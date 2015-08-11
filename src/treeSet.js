var Util = require('g-util');
var Base = require('g-base');
var _ = require('lodash');
var Node = require('./node');

function TreeSet (dataFrame) {
	this.dataFrame = dataFrame;
	this.nodes = [];
	this.edges = [];
	this.nodeMap = {};
	this.edgeMap = {};
	this.adjoinTable = {};
    this.reverseTable = {};
	
	this._initStructure();
}

var infix = "__->__";

var edgeId = function (source, target) {
	return source + infix + target;
}

Util.extend(TreeSet, Base);

Util.augment(TreeSet, {
	
	_initStructure : function () {
		var self = this;
		var data = self.dataFrame.data;
		var colNames = self.dataFrame.colNames();
		
		_.each(data.nodes, function (node) {
			self.addNode(_.pick(node,colNames));
		});
		
		_.each(data.edges, function (edge) {
			self.addEdge(edge);
		});
	},
	
	addNode : function (nodeData) {
		var node = new Node(nodeData);
		
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
		self.edges.push(edge);
		self.edgeMap[id] = edge;
		self.adjoinTable[id] = edge;
		self.reverseTable[id] = edge;
	},
	
	getNodes : function () {
		return this.nodes;
	},
	
	getRoots : function () {
		return _.filter(this.nodes, function (node) {
			return node.get('in').length === 0;
		});
	},
	
	getLeaf : function () {
		return _.filter(this.nodes, function (node) {
			return node.get('out').length === 0;
		});
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
	/**
	 * 获取某节点的`祖先`节点，以数组返回
	 */
	getAncestor : function (nodes) {
		var self = this;
		return [].concat(_.reduce(_.map(nodes, function (node){
			if (node.parent().length) {
				var arr = node.parent().concat(self.getAncestor(node.parent()));
				return arr;
			}
			return [];
		}), function (prev, curr) {
			return prev.concat(curr);
		}));
	},
	
	/**
	 * 获取某节点的 `子孙` 节点，以数组返回
	 */
	getDescendant : function (node) {
		if (node.length) node = node[0];
		var descendant = [];
		
		var walk = function (n) {
			if (n.children().length) {
				descendant = _(descendant).concat(n.children()).value();
				_.each(n.children(), walk);
			}
		}
		
		walk(node);
		return descendant;
	},
	
	/**
	 * 获取兄弟节点。不包含本身
	 */
	siblings: function (node) {
		if (node.length) node = node[0];
		var parents = node.parent();
		var self = this;
		
		var nodes = [];
		
		_.each(parents, function (parent) {
			var id = parent.get('id');
			var node = self.nodeMap[id];
			nodes = nodes.concat(node.children());
		})

		return _.filter(nodes, function (n) {
			return n.get('id') !== node.get('id');
		})
	}
});
	
module.exports = TreeSet;