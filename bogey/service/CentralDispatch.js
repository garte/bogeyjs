/*
 *
 */
var Service = require('bogey/component/Service');
var _ = require('lodash');
var dotty = require('dotty');
var AmpersandEvents = require('ampersand-events');
var State = require('bogey/component/State');


var CentralDispatch = Service.extend({
    constructor: function (container) {
        Service.prototype.constructor.apply(this, arguments);

        this._container = container;
        this._states = {};
        this._events = AmpersandEvents.createEmitter({});
    },
    state: function (key, state) {
        var path = this.normalizePath(key);
        // Set state object from outside
        if (state) {
            dotty.put(this._states, path, state);
            return this;
        }

        if (!dotty.exists(this._states, path)) {
            // Initialise state object if it does not exist.
            dotty.put(this._states, path, new State(this, key));
        }
        return dotty.get(this._states, path);
    },
    exists: function (key) {
        var path = this.normalizePath(key);
        return dotty.exists(this._states, path);
    },
    publish: function (event, args) {
        return this.trigger.apply(this, arguments);
    },
    subscribe: function (event, handler, args) {
        return this.on.apply(this, arguments);
    },
    on: function (event, handler) {
        this._events.on(event, handler);
        return this;
    },
    trigger: function (event, state, args) {
        var key = state.getName();
        this.normalizePath(key);
        var parts = key.split('/'), part, exists, wildcardState;

        for (var i=0;i<=parts.length;i++) {
            parts.splice(-1);
            part = parts.join('/') + '/*';
            if (this.exists(part)) {
                wildcardState = this.state(part);
                wildcardState.triggerDontEscalate.apply(wildcardState, [event, state].concat(_.toArray(arguments).splice(3)));
            }
        }
        return this._events.trigger.apply(this._events, arguments);
    },
    normalizePath: function (key) {
        if (key.indexOf('.') >= 0) {
            throw new Error('A state key must not contain dots: ' + key);
        }
        return key.replace(new RegExp('/', 'g'), '.');
    }
});

module.exports = CentralDispatch;