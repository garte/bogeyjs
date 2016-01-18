var React = require('react');
var _ = require('lodash');

var BogeyLoader = function (literal) {
    literal.proxyRender = literal.render;
    literal.proxyComponentWillMount = literal.componentWillMount;
    literal.proxyGetInitialState = literal.getInitialState;

    _.assign(literal, {
        render: function () {
            if (true !== this.state.bgDependenciesLoaded) {
                return (<div>Loading dependencies</div>);
            }
            return this.proxyRender();
        },
        componentWillMount: function () {
            if (!this.props.app) {
                throw new Error('No app found!');
            }
            if (_.isFunction(literal.proxyComponentWillMount)) {
                literal.proxyComponentWillMount.bind(this)();
            }

            if (!_.isFunction(this.bgDependencies)) {
                return;
            }
            var dependencies = this.bgDependencies();
            this.props.app.get(dependencies).then(_.bind(function (resources) {
                this.components = resources;
                this.setState({ bgDependenciesLoaded: true });
            }, this)).done();
        },
        getInitialState: function () {
            return _.assign({}, this.proxyGetInitialState, {
                bgDependenciesLoaded: false
            });
        },
        bgLoad: function (dependencies, assignmentProp, cb) {
            if (null !== assignmentProp && !assignmentProp) assignmentProp = 'components';
            return this.props.app.get(dependencies).then(_.bind(function (assignmentProp, cb, resources) {
                if (null !== assignmentProp) {
                    this[assignmentProp] = _.assign(this[assignmentProp] || {}, resources);
                }

                if (_.isFunction(cb)) {
                    cb(resources);
                }

                return resources;
            }, this, assignmentProp, cb));
        },
    });
    return literal;
};

module.exports = BogeyLoader;