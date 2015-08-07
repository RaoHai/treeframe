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
	}
});


module.exports = TreeFrame;
