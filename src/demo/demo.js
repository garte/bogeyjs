/**
 * Created by garte on 2/5/15.
 */


var bogey = require('bogey');
var qajax = require('qajax');
var React = require('react');
var ReactDOM = require('react-dom');
var Q = require('q');
var _ = require('lodash');

var Application = require('bogey/Application');
var Loader = require('bogey/component/Loader');
var Container = require('bogey/component/Container');
var Router = require('bogey/Router');

var loader = new Loader();
var container = new Container(loader);

var router = new Router({
    basePath: '/app'
});

var config = {};

var app = new Application(config, container, router);

var Main = require('./module/Main');

app.start = function () {
    Q.longStackSupport = true;

    app.router.bindURL('', 'home');
    app.router.bindURL('n/:token', 'entry-select', function (target) {
        var token = target;
        if (_.isObject(target)) {
            token = target.getPublicKey();
        }
        return '/n/'+token;
    });
};

app.registerModules([Main]);

bogey.start(app).then(function (app) {
    app.get('user.context').then((context) => {
        ReactDOM.render(React.createElement(MainView, { app: app, context: context }), document.getElementById('app-container'));
        app.router.start();
    });
}).done();
