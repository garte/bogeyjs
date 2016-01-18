/**
 * Created by gaga on 2/21/15.
 */

var extendable = require('bogey/lang/extendable');
var all = require('bogey/lang/all');
var Definition = require('bogey/component/Definition');
var q = require('q');
var _ = require('lodash');

var Container = extendable({
    constructor: function (loader) {
        this.loader = loader;
        this.components = {};
        this.definitions = {};
    },
    define: function (key) {
        var definition = new Definition(key);

        this.definitions[key] = definition;

        return definition;
    },
    get: function (key, params) {
        if (_.isObject(key) || _.isArray(key)) {
            var orders = key, loaders = [], keys = [], order, params;
            _.forEach(orders, function (order, key) {
                params = null;
                keys.push(key);

                if (_.isArray(order)) {
                    params = order[1];
                    order = order[0];
                }

                loaders.push(this.get(order, params));
            }, this);

            // Since it's an array we simply return that through q.all:
            if (_.isArray(key)) {
                return q.all(loaders);
            }

            // For objects instead: Re-Apply the ordered keys to the result object since q.all does not
            // seem to support objects:
            return q.all(loaders).then(function (keys, components) {
                var result = {};

                _.forEach(components, function (component, index) {
                    result[keys[index]] = component;
                }, this);

                return result;
            }.bind(this, keys));
        }

        var val = this.components[key] || null;
        if (null === val) {
            val = this.definitions[key] || null;
            if (null === val) {
                throw new Error('No component ' + key + ' found in this container.');
            }

            var component = this.loader.load(val, params);

            if (true === val.isStatic()) {
                this.components[key] = component;
            }

            return component;
        }

        return val;
    },
    set: function (key, value) {
        this.components[key] = value;
        return this;
    }
}, 'Bogey Container');

module.exports = Container;