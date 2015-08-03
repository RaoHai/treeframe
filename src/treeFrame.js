var Util = require('g-util');
var _ = require('lodash');
var Frame = require('./frame');

function TreeFrame (data, cfg) {
	TreeFrame.superclass.constructor.call(this, data, cfg);
}

Util.extend(TreeFrame, Frame);

Util.augment(TreeFrame, {
	/**
	 * 树类型数据
	 */
	source : function (data) {
		var self = this;
		
		if (Util.isArray(data)) {
			_.each(data , function (d) {
				self.addNode(d);
			});
		}
		
		self.makeTree();
		
	},
	
	makeTree : function () {
		var self = this;
		
		_.each(this.nodeMap, function (node) {
			self.addEdge({source : node.get('parent'), target : node.get('id')});
		})
			
		this.roots = this.getRoots();
	},
	/**
	 * 获取某节点的`祖先`节点，以数组返回
	 */
	getAncestor : function (node) {
		
		if (node.length) node = node[0];
		var n = node, ancestors = [];
		console.log(n);
		while(n && n.parent()) {
			var _n = n.parent()[0];
			if (!_n) break;
			ancestors.push(_n);
			n = _n;	
		}
		
		return ancestors;
	},

	/**
	 * 获取某节点的 `子孙` 节点，以数组返回
	 */
	getDescendant : function (node) {
		if (node.length) node = node[0];
		var descendant = [];
		
		var walk = function (n) {
			if (n.children()) {
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
		var parent = node.parent(), siblings = [];
		
		_.each(parent, function (node) {
			 siblings = _(siblings).concat(node.children()).value();
		});
		
		return _.filter(siblings, function (sibling) {
			return sibling.get('id') !== node.get('id');
		});
	}
	
});

module.exports = TreeFrame;