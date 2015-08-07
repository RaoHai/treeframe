var Util = require('g-util');
var Base = require('g-base');
var _ = require('lodash');

/**
 * 因为是层次型数据，所以数据里必须有id
 * 
 */
function Frame (data, cfg) {
	this.data = data;
	Util.mix(this, cfg);
	this.source(data);
}

Util.extend(Frame, Base);


Util.augment(Frame, {
	type : 'Frame',
	/**
	 * 加载数据
	 * @param {Array} 数据集合
	 */
	source : function (data) {
		if (!data.nodes || !data.edges) {
			throw "数据类型错误：请传入正确的数据格式";
		}
		
		var self = this;
		var names = self.colNames();
		
		var arr = self.getArr(names);
		console.log(">> arr:", arr);
		
	},
	
	colNames : function () {
		var self = this;
		
		var names = self.names;
		if (!names) {
			names = _.keys(self.data.nodes[0]);
			self.names = names;
		}
		
		if (names.indexOf('id') == -1) {
			names.unshift('id');
		}
		
		return names;
	},
	
	getArr : function (names) {
		var self = this,
			data = self.data,
			arr = [];
		_.each(names, function (name) {
			arr.push(data.nodes.map(function (node) {
				return node[name];
			}))
		});
		
		self.arr = arr;
		return arr;
	},
	
	cols : function (names) {
		var self = this;
		
		if (names.indexOf('id') == -1) {
			names.unshift('id');
		}
		
		for (var i = 0; i < names.length; i++) {
			var name = names;
			if (Util.isNumber(name)) {
				names[i] = self.names[name];
			}
		}

		var nodes = _.map(self.data.nodes, function (d) {
			var obj = {};
			for (var i = 0 ; i < names.length ; i++) {
				var name = names[i];
				obj[name] = d[name];
			}
			return obj;
		})
		
		return new Frame({
			nodes : nodes,
			edges : self.data.edges
		});
	},
	
	toArray : function () {
		return this.arr;
	}

});
module.exports = Frame;

