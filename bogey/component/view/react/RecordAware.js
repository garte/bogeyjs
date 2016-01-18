var React = require('react');
var _ = require('lodash');

var RecordAware = {
    mixin: {
    componentWillMount: function () {
        console.debug('aware?', this.props);
            if (!this.bgBindRecordState) {
                throw new Error('No bgBindRecordState found. Did you mixin Bogey?');
            }
            var servedRecords = {};
            var records = [];
            var propMap = {};

            _.each(this.props, function (obj, name) {
                if (!_.isObject(obj) || !obj.bgIsRecordAwareProp) {
                    return;
                }

                console.debug('found aware prop', obj);

                let {record, property} = obj;

                records.push(record);

                if (!propMap[record.getRecordType()]) {
                    propMap[record.getRecordType()] = [];
                }
                propMap[record.getRecordType()].push(property);
            }, this);

            _.each(records, function (record) {
                if (!propMap[record.getRecordType()]) {
                    console.warn('Record ' + record.getRecordType() + ' has no prop mapping.');
                }
                this.bgBindRecordState(record, propMap[record.getRecordType()]);
            }, this);

            this.servedRecords = servedRecords;
        }
    },
    prop: function (record, property) {
        return {
            bgIsRecordAwareProp: true,
            record,
            property
        };
    }
};

module.exports = RecordAware;