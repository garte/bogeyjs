/**
 * Created by gaga on 2/20/15.
 */
var q = require('q');
var Bogey = function () {
    this.start = function (app) {
        return q.when(app.__start());
    }
};

module.exports = new Bogey();