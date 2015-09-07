var Util = require('g-util');
var Base = require('g-base');
var _ = require('lodash');

// 是否 null ,undefined
function isNull(value) {
	return value === null || value === undefined;
}


/**
 * 因为是层次型数据，所以数据里必须有id
 * 
 */
function Frame(data, cfg) {
	this.data = data;
	
	if (cfg && cfg.names && cfg.names.indexOf('parent') === -1) {
		cfg.names.push('parent');
	}

	Util.mix(this, cfg);
	this.source(data);
}


Util.extend(Frame, Base);


Util.augment(Frame, {
	type: 'Frame',
	/**
	 * 加载数据
	 * @param {Array} 数据集合
	 */
	source: function (data) {
		if (!data.nodes || !data.edges) {
			throw "数据类型错误：请传入正确的数据格式";
		}

		var self = this;
		var names = self.colNames();

		var arr = self.getArr(names);
		self.arr = arr;

	},

	colNames: function () {
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

	getArr: function (names) {
		var self = this,
			data = self.data,
			arr = [];
		_.each(names, function (name) {
			arr.push(data.nodes.map(function (node) {
				return node[name];
			}))
		});

		return arr;
	},

	_getColArray: function (names, startRow, endRow) {
		var self = this;
		var arr = self.arr;
		var totalNames = self.colNames();
		var rst = [];
		var rowCount = self.rowCount();
		var indexs = Util.map(names, function (name) {
			return Util.indexOf(totalNames, name);
		});

		startRow = startRow || 0;
		endRow = isNull(endRow) ? rowCount : endRow;

		for (var j = 0; j < indexs.length; j++) {
			var temp = arr[indexs[j]] || [];
			var subArray = temp.slice(startRow, endRow);
			rst.push(subArray);
		}

		return rst;
	},
  	
	toJSON: function () {
		var self = this;
		var rowCount = self.rowCount();
		var rst = [];

		for (var i = 0; i < rowCount; i++) {
			rst.push(self._getObject(i));
		}
		return rst;
	},
	
	_getObject: function (index, names) {
		var self = this;
		var arr = self.arr;
		var obj = {};

		names = names || self.colNames();

		for (var i = 0; i < names.length; i++) {
			obj[names[i]] = arr[i][index];
		}

		return obj;
	},
	
	/**
	 * 行数
	 */
	rowCount: function () {
		var arr = this.arr;
		return arr && arr.length && arr[0].length || 0;
	},
	
	/**
	 * 获取单元格数据
	 */
	cell: function (rowIndex, colIndex) {
		var self = this;
		var names = self.colNames();
		var arr = self.arr;

		if (Util.isString(colIndex)) {
			colIndex = names.indexOf(colIndex);
		}

		return arr[colIndex] ? arr[colIndex][rowIndex] : undefined;
	},

	cols: function (names) {
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
			for (var i = 0; i < names.length; i++) {
				var name = names[i];
				obj[name] = d[name];
			}
			return obj;
		})

		return new Frame({
			nodes: nodes,
			edges: self.data.edges
		});
	},

	contains: function (name) {
		var names = this.colNames();
		return names.indexOf(name) !== -1;
	},

	toArray: function () {
		return this.arr;
	}

});


module.exports = Frame;

