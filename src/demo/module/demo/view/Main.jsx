/**
 * Created by garte on 2/5/15.
 */
var React = require('react');
var MainView = React.createClass({
    componentDidMount: function () {
        var record = this.props.controller.record('node');
        this.props.controller.bindRecordState({
            node: ['label']
        }, this.setState.bind(this));

    },
    getInitialState: function () {
        return { homeLabel: 'loading' };
    },
    handleSubmit: function (evt) {
        evt.stopPropagation();
        evt.preventDefault();

        this.props.controller.record('node').set('label', this.refs.inp.getDOMNode().value);
        this.props.controller.save('node');
    },
    render: function() {
        return <div>
            Your home: {this.state.label}
            <br />
            <form method="POST" onSubmit={this.handleSubmit}>
                <input type="text" ref="inp" />
                <button type="submit" name="bt">Save</button>
            </form>
        </div>
}
});

module.exports = MainView;