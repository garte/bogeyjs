/**
 * Created by gaga on 2/21/15.
 */

var extendable = require('bogey/lang/extendable');
var all = require('bogey/lang/all');
var Definition = require('bogey/component/Definition');
var Q = require('q');
var _ = require('lodash');


var Loader = extendable({
    load: function (definition, params) {
        if (!(definition instanceof Definition)) {
            throw new Error('definition has to be instance of Definition');
        }

        var def = Q.defer(),
            promise = def.promise,
            preload;

        definition.validateParams(params);

        if (null !== definition.preload()) {
            preload = definition.preload();

            // untested
            if (_.isFunction(preload)) {
                preload = preload(params);
            }

            if (Q.isPromise(preload)) {
                preload.then(function (def, preloaded) {
                    def.resolve(preloaded);
                }.bind(this, def)).done();
            } else {
                if (!preload) {
                    throw new Error('Preload seems to be empty at ' + definition.name);
                }
                all(definition.preload()).then(function (def, preloaded) {
                    def.resolve(preloaded);
                }.bind(this, def)).done();
            }
        } else {
            def.resolve();
        }

        return promise.then(function (definition, params, preloaded) {
            var setup = definition.setup();
            return Q.when(setup.apply(definition, [preloaded, params]))
                .then(function (component) {
                    return component;
                });
        }.bind(this, definition, params));
    },
    isLoadable: function (val) {
        return (val instanceof Definition);
    }
}, 'Bogey Loader');

module.exports = Loader;