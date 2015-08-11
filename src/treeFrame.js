var Util = require('g-util');
var _ = require('lodash');
var Frame = require('./frame');
var TreeSet = require('./treeSet');

function TreeFrame (data, cfg) {
	
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
	
	source : function (data) {
		var edges = [];
		if (Util.isArray(data)) {

			_.each(data, function (d) {
				if (d.parent) {
					edges.push({
						source : d.parent,
						target : d.id
					});
				}
			});
		}
		
		return {
			nodes : data,
			edges : edges
		};
	},
	
	cols : function (names) {
		var self = this;
		//id永远有。
		return new TreeFrame(self.dataFrame.cols(names));
	},
	
	
	colArray : function (names) {
		if (!Util.isArray(names)) names = [names];
		//0永远是id，所以取1
		return this.dataFrame.cols(names).toArray()[1];
	},
	
	/**
	 * 行数
	 */
	rowCount : function () {
		if (!this.dataFrame) return 0;
		var arr = this.dataFrame.arr;
		return arr && arr.length && arr[0].length || 0;	
	},
	
	/**
	 * 获取对象
	 */
	_getObject : function (index, names) {
		var self = this;
	    var arr = self.dataFrame.arr;
	    var obj = {};
	
	    names = names || self.dataFrame.colNames();
	
	    for (var i = 0;i < names.length;i++) {
	      obj[names[i]] = arr[i][index];
	    }
		
	    return obj;
	},
	
	/**
	 * 获取对应names 列的JSON对象构成的数组
	 */
	toJSON : function () {
		var self = this;
		var rowCount = self.rowCount();
		var rst = [];
		
		console.log(">> rowCount", rowCount);
		for (var i = 0 ; i < rowCount; i++) {
			rst.push(self._getObject(i));
		}
		return rst;
	}
});

/**
 * statics functions
 */
TreeFrame.forceMerge = function () {
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
		names : names
	});
}

module.exports = TreeFrame;
