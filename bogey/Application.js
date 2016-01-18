/**
 * Created by gaga on 2/21/15.
 */

var extendable = require('bogey/lang/extendable');
var q = require('q');
var _ = require('lodash');
var BogeyModule = require('bogey/Module');

var Application = extendable({
    constructor: function (config, container, router) {
        this.router = router;
        this.container = container;
        this.modules = [BogeyModule];
        this.start = function () {};
    },
    registerModules: function (modules) {
        _.forEach(modules, this.registerModule, this);
        return this;
    },
    registerModule: function (module) {
        this.modules.push(module);
        return this;
    },
    get: function () {
        return this.container.get.apply(this.container, arguments);
    },
    set: function () {
        return this.container.set.apply(this.container, arguments);
    },
    __start: function () {
        var setupped = [];
        _.forEach(this.modules, function (Module) {
            var module = new Module();
            setupped.push(q.when(module.setup(this)));
        }, this);

        return q.allSettled(setupped).then(function (modules) {
            this.modules = modules;

            if (_.isFunction(this.start)) {
                return q.when(this.start.bind(this)()).then(function () {
                    // Bind this scope definitely to this instance.
                    this.get = _.bind(this.get, this);
                    this.set = _.bind(this.set, this);
                    return this;
                }.bind(this));
            }

            return this;
        }.bind(this));
    }
}, 'Bogey Application');

module.exports = Application;