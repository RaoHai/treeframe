var Util = require('g-util');
var Base = require('g-base');
var _ = require('lodash');
var Node = require('./node');


function Frame (data, cfg) {
	Frame.superclass.constructor.call(this, cfg);
	this.data = data;
	
	this.nodes = [];
	this.nodeMap = {};
	this.edgeMap = {};
	this.adjoinTable = {};
    this.reverseTable = {};
	
	this.source(data);
}

var infix = "__->__";

var edgeId = function (source, target) {
	return source + infix + target;
}

Util.extend(Frame, Base);

Util.augment(Frame, {
	/**
	 * source 
	 */
	source : function (data) {
		if (!data.nodes || !data.edges) {
			throw "数据类型错误：请传入正确的数据格式";
		}
		
		var self = this;
		
		// this._initNodes(data.nodes);
		_.each(data.nodes, function (node) {
			self.addNode(node);
		});
		
		_.each(data.edges, function (edge) {
			self.addEdge(edge);
		});
		
		console.log("nodes", this.nodeMap);
		console.log("edges", this.edgeMap);
		// this._initEdges(data.edges);
	},
	
	addNode : function (nodeData) {
		var node = new Node(nodeData);
		node.set('frame', this);
		
		this.nodes.push(node);
		this.nodeMap[node.get('id')] = node;
	},
	
	addEdge : function (edge) {
		var self = this;
		
		var source = self.nodeMap[edge.source];
		if (!source) return;
		edge.sourceNode = source;
		
		var target = self.nodeMap[edge.target];
		if (!target) return;
		edge.targetNode = target;
		
		source.get('out').push(edge);
		target.get('in').push(edge);
		
		var id = edgeId(edge.source, edge.target);

		edge.id = id;
		self.edgeMap[id] = edge;
		self.adjoinTable[id] = edge;
		self.reverseTable[id] = edge;
	},
	
	setDegree : function () {
		var self = this;
		_.forEach(this.edgeMap, function (n, key) {
			self.getById(key).set('degree', n.length);
		});
	},
	
	getOut : function (edge) {
		var node = edge.targetNode,
			self = this;
		if (!node) return;
		
		return _.map(node.out, function (n) {
			return self.nodeMap[n.target];
		});
	},
	
	getById : function (id) {
		var self = this;
		
		if (Util.isArray(id)) {
			return _.map(id, function (i) {
				return self.nodeMap[i];
			});
		} 
		return this.nodeMap[id];	
	},
	
	getRoots : function () {
		// var self = this;
		return _.filter(this.nodes, function (node) {
			return node.get('in').length === 0;
		});
	},
	
	getNodes : function () {
		return this.nodes;
	},
	
	getLeaf : function () {
		return this.select({degree : 0});
	},
	
	/**
	 * 条件选择节点
	 */
	select : function (condition) {
		if (typeof condition === 'string') {
			condition = {id : condition};
		}
		
		if (typeof condition === 'function') {
			return _.filter(this.nodes, condition);
		} else {
			var keys = _.keys(condition);
			return _.filter(this.nodes, function (node) {
				// console.log()
				return keys.map(function (key) {
					return node.get(key) == condition[key];
				}).reduce(function (prev, curr) {
					return prev && curr;
				});
			})
		}
	},
	
	
});

module.exports = Frame;
