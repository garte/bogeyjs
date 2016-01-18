var React = require('react');
var _ = require('lodash');
var BogeyMixin = require('bogey/component/view/react/BogeyMixin');

var AirGap = React.createClass({
    mixins: [BogeyMixin],
    getInitialProps: function () {
        return { render: function () {} };
    },
    componentWillMount: function () {
        var servedRecords = {};
        _.each(this.props.records, function (meta, name) {
            servedRecords[name] = meta[0];
            if (!meta[1]) {
                return;
            }
            this.bgBindRecordState(meta[0], meta[1]);
        }, this);

        this.servedRecords = servedRecords;
    },
    render: function () {
        if (!this.state) {
            return null;
        }
        return _.bind(this.props.render, this)(this.servedRecords);
    }
});

module.exports = AirGap;