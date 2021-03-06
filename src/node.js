var Base = require('g-base');
var Util = require('g-util');
var _ = require('lodash');

function Node (data) {
	Node.superclass.constructor.call(this, data);
	this.set('in', []);
	this.set('out', []);
	this.set('degree', 0);
	
	this.expand = true;
	this.__w = 5;
    this.__h = 5;
}

Util.extend(Node, Base);

Util.augment(Node, {
	parent : function () {
		return _.map(this.get('in'), function (n) {
			return n.sourceNode;
		});
	},
	
	children : function () {

		return _.map(this.get('out'), function (n) {
			return n.targetNode;
		});
	},
	
	source : function () {
		// return _.map(this.get('in'))
	},
	
	_update : function (cfg) {
        Util.mix(true, this._attrs, cfg);
    },
	
	_afterLayout : function (x, y) {
		this.set('x', x);
		this.set('y', y);
	},
	
	getSize : function () {
        var factory = this.get('factory');
        return factory && factory.getSize(this.get('size'));
    },
	
	getPosition : function () {
		var factory = this.get('factory');
        return factory && factory.getPosition(this.get('position'));
	},
	
	getColor : function () {
		var factory = this.get('factory');
        return factory && factory.getColor(this.get('color'));
	},
	
	getShape : function () {
		var factory = this.get('factory');
        return factory && factory.getShape(this.get('shape'));
	}
	
});

module.exports = Node;