/**
 * Created by gaga on 2/21/15.
 */
var Module = require('bogey/component/Module');

var Repository = require('./service/Repository')

Module = Module.extend({
    setup: function (app) {
      app.container.define('basics.context')
          .isStatic(true)
          .preload(function () {
            // Load a configuration file here
              return {
                configuration: 'here'
              };
          })
          .setup(function (preloaded) {
              return preloaded.configuration;
          });

        app.container.define('basics.valuestore')
            .isStatic(true)
            .preload(function () {
                return app.container.get({
                  config: 'basics.config'
                })
            })
            .setup(function (preloaded) {
                return new Repository(preloaded.config);
            });

        app.container.define('basics.helloworld')
            .isStatic(true)
            .setup(function (preloaded) {
                return "Hello World!";
            });

    }
});

module.exports = Module;
