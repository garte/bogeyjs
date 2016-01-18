/**
 * Created by gaga on 2/21/15.
 */

var extendable = require('bogey/lang/extendable');
var _ = require('lodash');

var Route = extendable({
    constructor: function (urlhandler) {
    }
}, 'Bogey Route');

module.exports = Route;