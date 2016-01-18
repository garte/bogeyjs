/**
 * Created by gaga on 2/21/15.
 */

var extendable = require('bogey/lang/extendable');
var _ = require('lodash');
var AmpersandRouter = require('ampersand-router');

var Router = extendable({
    constructor: function (options) {
        this.options = options || {};
        this._router = new AmpersandRouter();
        this._routes = {};
        this._firstRoute = true;
    },
    bindURL: function (url, topic, urlcompositor) {
        if (!urlcompositor) {
            urlcompositor = function () {};
        }

        var urltopic = topic + '-url';

        this._router.on(topic, function (urlcompositor) {
            //console.debug('trigger by url topic', topic);
            this._router.navigate(urlcompositor.apply(null, _.toArray(arguments).slice(1)), { trigger: false })
        }.bind(this, urlcompositor));

        this._router.route(url, urltopic, function (urltopic, topic) {
            //console.debug('trigger url topic as', urltopic, topic, [topic].concat(_.toArray(arguments).slice(2)));
            this._router.trigger.apply(this._router, [topic].concat(_.toArray(arguments).slice(2)));
        }.bind(this, urltopic, topic));
    },
    trigger: function (topic, args) {
        this._router.trigger.apply(this._router, arguments);
    },
    on: function (topic, handler) {
        this._router.on.apply(this._router, arguments);
    },
    off: function (topic, handler) {
        this._router.off.apply(this._router, arguments);
    },
    start: function () {

        var found = this._router.history.start({
            root: this.options.basePath || ''
        });
    }
}, 'Bogey Router');

module.exports = Router;