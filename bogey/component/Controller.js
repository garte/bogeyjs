/*
 *
 */
var extend = require('ampersand-class-extend');

var _RecordHandlingMixin = require('./mixin/_RecordHandlingMixin');

var Controller = function () {};

Controller.extend = extend;

module.exports = Controller.extend(_RecordHandlingMixin, {
    constructor: function () {
        this.initializeRecordHandling();
    }
});