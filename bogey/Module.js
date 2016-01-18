/**
 * Created by gaga on 2/21/15.
 */
var Module = require('bogey/component/Module');
var CentralDispatch = require('bogey/service/CentralDispatch');
var Router = require('bogey/Router');

var BogeyModule = Module.extend({
    setup: function (app) {
        app.container.define('bogey.centraldispatch')
            .isStatic(true)
            .setup(function () {
                var centralDispatch = new CentralDispatch(app.container);
                return centralDispatch;
            });
    }
});

module.exports = BogeyModule;