/*
 *
 */
var extend = require('ampersand-class-extend');

var _RecordHandlingMixin = require('./mixin/_RecordHandlingMixin');

var Model = function () {};

Model.extend = extend;

module.exports = Model.extend(_RecordHandlingMixin, {
    constructor: function () {
        this.initializeRecordHandling();
    }
});