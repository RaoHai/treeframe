var Util = require('g-util');
var _ = require('lodash');
var Frame = require('./frame');
var TreeSet = require('./treeSet');


function formatArray(data) {
	var arr = [];
	Util.each(data, function (sub) {
		if (Util.isArray(sub)) {
			arr = arr.concat(sub);
		} else {
			arr.push(sub);
		}
	});
	return arr;
}

// 是否 null ,undefined
function isNull(value) {
	return value === null || value === undefined;
}

function TreeFrame(data, cfg) {

	if (data.type && data.type === 'Frame') {
		this.data = data.data;
		this.dataFrame = data;
	} else {
		this.data = this.source(data);
		this.dataFrame = new Frame(this.data, cfg);
	}
	this.treeSet = new TreeSet(this.dataFrame);
}


Util.augment(TreeFrame, {

	source: function (data) {
		var edges = [];
		if (Util.isArray(data)) {

			_.each(data, function (d) {
				if (d.parent) {
					edges.push({
						source: d.parent,
						target: d.id
					});
				}
			});
		}

		return {
			nodes: data,
			edges: edges
		};
	},

	col: function (index) {
		var self = this;
		var names = self.dataFrame.colNames();
		var name;
		
		if (typeof index === 'string') {
			name = index;
			index = names.indexOf(index);
		} else {
			name = names[index];
		}
		
		return self.dataFrame.getArr([name]);
		
	},


	cols: function (names) {
		var self = this;
		//id永远有。
		return new TreeFrame(self.dataFrame.cols(names));
	},

	colArray: function (name) {
		return this.col(name)[0];
	},
	
	/**
	 * 行数
	 */
	rowCount: function () {
		return this.dataFrame.rowCount();
	},
	
	/**
	 * 获取对象
	 */
	_getObject: function (index, names) {
		var self = this;
		var arr = self.dataFrame.arr;
		var obj = {};

		names = names || self.dataFrame.colNames();

		for (var i = 0; i < names.length; i++) {
			obj[names[i]] = arr[i][index];
		}

		return obj;
	},

	/**
	 * 获取对应names 列的JSON对象构成的数组
	 */
	toJSON: function () {
		var self = this;
		var rowCount = self.rowCount();
		var rst = [];

		console.log(">> rowCount", rowCount);
		for (var i = 0; i < rowCount; i++) {
			rst.push(self._getObject(i));
		}
		return rst;
	},

	toArray: function () {
		return this.dataFrame.arr;
	},
	
	min : function (x) {
		var arr = this.colArray(x);
		arr = formatArray(arr);
		return _.min(arr);
	},
	
	max : function (x) {
		var arr = this.colArray(x);
		arr = formatArray(arr);
		return _.max(arr);
	}
});

Util.mix(TreeFrame, {
	values: function (frame, x) {
		var col = frame.col(x),
			rst = [],
			count = col.rowCount();

		for (var i = 0; i < count; i++) {
			var value = col.cell(i, 0);
			if (value !== undefined && rst.indexOf(value) === -1) {
				rst.push(value);
			}
		}
		return rst;
	},
	
	forceMerge: function () {
		var frameArray = Util.toArray(arguments);
		var names = [];
		var data = [];

		_.each(frameArray, function (frame) {
			var frameData = frame.dataFrame;

			var subNames = frameData.colNames();

			_.each(subNames, function (name) {
				if (names.indexOf(name) === -1) {
					names.push(name);
				}
			});

			var jsonArray = frame.toJSON();
			data = data.concat(jsonArray);
		});

		return new TreeFrame(data, {
			names: names
		});
	}
})

module.exports = TreeFrame;
