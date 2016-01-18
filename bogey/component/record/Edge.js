var Record = require('../Record');

var Edge = Record.extend({
    constructor: function () {
        this._fromKey = null;
        this._toKey = null;

        Record.prototype.constructor.apply(this);
    },
    getFrom: function () {
        return this._fromKey;
    },
    setFrom: function (fromKey) {
        this._fromKey = fromKey;
        return this;
    },
    getTo: function () {
        return this._toKey;
    },
    setTo: function (toKey) {
        this._toKey = toKey;
        return this;
    }
});

module.exports = Edge;