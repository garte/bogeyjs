var _ = require('lodash');
var _EventHandlingMixin = require('./_EventHandlingMixin');
var _DestroyableMixin = require('./_DestroyableMixin');

module.exports = _.extend({
    initializeRecordHandling: function () {
        this._registeredRecords = {};

        this.initializeEventHandling();
        this.initializeDestroyable();
    },
    record: function (name) {
        if (_.isObject(name)) {
            return name;
        }
        if (!this._registeredRecords[name]) {
            return null;
        }
        return this._registeredRecords[name];
    },
    bindRecordState: function (mapping, stateSetterFunction) {
        var recordName, record, recordMap, property, bind;
        for (recordName in mapping) {
            recordMap = mapping[recordName];
            record = this._registeredRecords[recordName];
            if (!record) {
                continue;
            }

            var invokeState = function (recordMap, record, stateSetterFunction) {
                var state = {}, isArray = _.isArray(recordMap);
                _.each(recordMap, function (record, recordProperty, stateProperty) {
                    if (true === isArray) {
                        stateProperty = recordProperty;
                    }
                    // @todo escape this?
                    state[stateProperty] = record.get(recordProperty);
                }.bind(this, record));
                stateSetterFunction(state);
            }.bind(this, recordMap, record, stateSetterFunction);

            this.own(record, 'change', invokeState);

            record.hookEngage();
            this.bgOnDestroy(function (record) {
                record.hookDisable();
            }.bind(this, record));

            invokeState();
        }
    },
    registerRecords: function (records) {
        var name;
        for (name in records) {
            this.registerRecord(name, records[name]);
        }
        return this;
    },
    registerRecord: function (name, record) {
        this._registeredRecords[name] = record;
        return this;
    }
}, _EventHandlingMixin, _DestroyableMixin);