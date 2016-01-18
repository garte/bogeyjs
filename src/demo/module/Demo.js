/**
 * Created by gaga on 2/21/15.
 */
var Module = require('bogey/component/Module');
var Context = require('./main/service/Context');

Module = Module.extend({
    setup: function (app) {
        app.container.define('user.context')
            .isStatic(true)
            .preload(function () {
                return app.container.get({
                    mapper: 'graph.record.mapper',
                    request: 'graph.service.request'
                })
            })
            .setup(function (preloaded) {
                var context = new Context(preloaded.request, preloaded.mapper);
                return context.refresh();
            });
    }
});

module.exports = Module;