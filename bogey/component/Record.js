/*
 *
 */
var State = require('ampersand-state');

var Record = State.extend({
    initialize: function () {
        this._version = null;
        this._key = null;
        // How many components use this record to track changes.
        // If it's zero it may be removed by the Repository holding it.
        this._bgHookCounter = 0;

    },
    getPublicKey: function () {
        return this._key;
    },
    setPublicKey: function (key) {
        this._key = key;
        return this;
    },
    getRecordType: function () {
        return this._recordType;
    },
    getVersion: function () {
        return this._version;
    },
    hookEngage: function () {
        this._bgHookCounter++;
        //console.debug('Hook engaged', this._bgHookCounter, this);
        return this;
    },
    hookDisable: function () {
        this._bgHookCounter--;
        if (this._bgHookCounter === 0) {
            //console.debug('Hook disabled', this._bgHookCounter, this);
        }
        return this;
    }
}, 'Bogey Record');

module.exports = Record;