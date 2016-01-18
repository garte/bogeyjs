/**
 * Basic bogeyJS setup.
 */

// Require base object
var bogey = require('bogey');

// Get Application constructor
var Application = require('bogey/Application');

// Get the dependency Loader constructor
var Loader = require('bogey/component/Loader');

// Get the dependency Container constructor
var Container = require('bogey/component/Container');

// Get the Router constructor, heavily based on AmpersandRouter
var Router = require('bogey/Router');

// Initialize resources... These may be extended as you see fit.
var loader = new Loader();
var container = new Container(loader);

var router = new Router({
    basePath: '/app'
});

var config = {};

// Initialize the application object
var app = new Application(config, container, router);

// Load a module definition
var Main = require('./module/Basics');

// What should happen on startup?
// This could very well be part of a custom Application object if you want to be so bold.
app.start = function () {
  // Setup routes and stuff.
};

// Register the dependencies you want to use for your application. This can be
// as granular as you need it to be.
app.registerModules([Main]);

// Start the app
bogey.start(app).then(function (app) {
  // After the application has been initialized we get the actual application object which
  // basically is a dependency container.
    app.get('basics.helloworld').then((helloworld) => {
        // This signals the router to start listening for route events. This should only
        // be invoked AFTER you're absolutely ready for action.
        app.router.start();
    });
}).done();
