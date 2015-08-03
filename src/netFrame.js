var Util = require('g-util');
var _ = require('lodash');
var Frame = require('./frame');


function NetFrame (data, cfg) {
	NetFrame.superclass.constructor.call(this, data, cfg);
}

Util.extend(NetFrame, Frame);

Util.augment(NetFrame, {
		
});

module.exports = NetFrame;