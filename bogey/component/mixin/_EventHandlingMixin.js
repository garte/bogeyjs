var _ = require('lodash');
var _DestroyableMixin = require('./_DestroyableMixin');

module.exports = _.extend({
    initializeEventHandling: function () {
        if (true === this.initializeEventHandlingDone) {
            return;
        }
        this.initializeEventHandlingDone = true;

        this.initializeDestroyable();

        this._bogeyEvents = [];
        this.bgOnDestroy(this.unregisterEventHandles);
    },
    own: function (emitter, name, cb, context) {
        return this.registerEventHandle.apply(this, arguments);
    },
    registerEventHandle: function (emitter, name, cb, context) {
        emitter.on(name, cb, context);
        this._bogeyEvents.push(_.toArray(arguments));
        return emitter;
    },
    unregisterEventHandles: function () {
        _.forEach(this._bogeyEvents, function (params) {
            if (!params[0].off) {
                return;
            }
            params[0].off(params[1], params[2], params[3]);
        }, this);
    }
}, _DestroyableMixin);