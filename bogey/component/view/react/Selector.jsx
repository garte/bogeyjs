var React = require('react');
var _ = require('lodash');

var Selector = React.createClass({
    componentWillUnmount: function () {
        this.currentElement = null;
    },
    render: function () {
        return (
            <div
                className={this.props.className}
                onFocus={this.handleFocus}
                onKeyUp={this.handleKeyPress}
                tabIndex="0"
                >
                {_.map(this.props.elements, function (meta, index) {
                    var props = meta[1];

                    _.assign(props, { onClick: this.handleElementClick });

                    if (this.state.currentIndex === index) {
                        this.currentElement = props.key || index;
                        _.assign(props, { style: { border: '1px solid yellow' }, className: 'selected' });
                    }

                    meta[1] = props;

                    return React.createElement.apply(this, meta);
                }, this)}
            </div>
        );
    },
    handleKeyPress: function (evt) {
        switch (evt.key.toLowerCase()) {
            case 'arrowdown':
                this.setState({ currentIndex: this.state.currentIndex + 1 });
                break;
            case 'arrowup':
                this.setState({ currentIndex: this.state.currentIndex - 1 });
                break;
            case 'enter':
                this.props.onSelect(this.currentElement);
        }
    },
    handleFocus: function (evt) {
        if (evt.target !== evt.currentTarget) {
            return;
        }

        this.setState({ currentIndex: 0 });
    },
    handleElementClick: function (key, evt) {
        evt.preventDefault();
        this.props.onSelect(key);
    },
    getInitialState: function () {
        return { currentIndex: -1 };
    },
    getInitialProps: function () {
        return { onSelect: function () {}, wrapper: (<li></li>) };
    }
});

module.exports = Selector;