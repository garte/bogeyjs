/**
 * Created by gaga on 2/25/15.
 */
var q = require('q');
var _ = require('lodash');

module.exports = function (promises) {
    var promise, index, indexes = [], loaders = [];

    if (_.isArray(promises)) {
        return q.allSettled(promises);
    }

    _.forEach(promises, function (promise, index) {
        indexes.push(index);
        loaders.push(promise);
    }, this);

    return q.allSettled(loaders).then(function (indexes, components) {
        var result = {};

        _.forEach(components, function (component, index) {
            result[indexes[index]] = component;
        }, this);

        return result;
    }.bind(this, indexes));
};

