/*
 *
 */
var extend = require('ampersand-class-extend');
var _ = require('lodash');
//var _EventHandlingMixin = require('../component/mixin/_EventHandlingMixin');
var AmpersandEvents = require('ampersand-events');


var State = function (centralDispatch, name) {
    this.name = name;
    this.centralDispatch = centralDispatch;
};

State.extend = extend;

module.exports = State.extend(AmpersandEvents, {
    publish: function (event, args) {
        return this.trigger.apply(this, arguments);
    },
    getName: function () {
        return this.name;
    },
    subscribe: function (event, handler, args) {
        return this.on.apply(this, arguments);
    },
    triggerDontEscalate: function (event, args) {
        AmpersandEvents.trigger.apply(this, arguments);
        return this;
    },
    trigger: function (event, args) {
        this.triggerDontEscalate.apply(this, arguments);
        this.centralDispatch.trigger.apply(this.centralDispatch, [event, this].concat(_.toArray(arguments).splice(1)));
        return this;
    }
});