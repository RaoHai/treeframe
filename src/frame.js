var Util = require('g-util');

function Frame (data, cfg) {
	this.data = data;
	Util.mix(this, cfg);
	this.initFrame();
}

Frame.prototype = {
	initFrame : function () {
		var self = this;
		var data = self.data;
		
		self.parseData(data);
	},
	
	parseData : function (data) {
		
	}
};

module.exports = Frame;