/**
 * Created by gaga on 2/21/15.
 */

var extendable = require('bogey/lang/extendable');
var _ = require('lodash');
var dotty = require('dotty');

var Definition = extendable({
    constructor: function (name) {
        this._setupFunction = null;
        this.name = name;
        this._isStatic = false;
        this._isLoaded = false;
        this._preloaders = null;
        this._storage = {};
        this._validationRules = {};
    },
    preload: function (promises) {
        if (!promises) {
            return this._preloaders;
        }
        this._preloaders = promises;
        return this;
    },
    factory: function (key, builder) {
        var obj = this.get(key);
        if (!obj) {
            this.set(key, builder());
        }
        return this.get(key);
    },
    get: function (key) {
        return this._storage[key] || null;
    },
    set: function (key, value) {
        this._storage[key] = value;
        return this;
    },
    setup: function (setup) {
        if (!_.isFunction(setup)) {
            return this._setupFunction || null;
        }

        this._setupFunction = setup.bind(this);
        return this;
    },
    isLoaded: function (state) {
        if (!state && false !== state) {
            return this._isLoaded;
        }

        this._isLoaded = state ? true : false;
    },
    isStatic: function (isstatic) {
        if (!isstatic && false !== isstatic) {
            return this._isStatic;
        }
        this._isStatic = isstatic ? true : false;
        return this;
    },
    validate: function (validation) {
        if (!validation) {
            return this._validationRules;
        }
        this._validationRules = validation;
        return this;
    },
    validateParams: function (params) {
        if (!this._validationRules.params) {
             return true;
        }

        var requiredParams = this._validationRules.params;
        if (!_.isArray(requiredParams)) {
            throw new Error('Required params must be array of param names.');
        }

        _.each(requiredParams, function (name) {
            if (!params[name]) {
                throw new Error('Required parameter ' + name + ' not given to definition ' + this.name);
            }
        }, this);
    }
}, 'Bogey Definition');

module.exports = Definition;