var React = require('react');
var AmpersandEvents = require('ampersand-events');
var _ = require('lodash');

var invokeState = function (recordMap, record) {
        var state = {}, isArray = _.isArray(recordMap);
        _.each(recordMap, function (record, recordProperty, stateProperty) {
            if (true === isArray) {
                stateProperty = recordProperty;
            }
            // @todo escape this?
            state[stateProperty] = record.get(recordProperty);
        }.bind(this, record));
    //console.debug('invoke state', state);
    this.setState(state);
};

module.exports = {
    bgValueLink: function (controller, record, prop) {
        return {
            value: controller.record(record).get(prop),
            requestChange: _.bind(function (record, prop, value) {
                record = this.record(record);
                record.set(prop, value);
                console.debug('set', prop, value);
                return this.save(record);
            }, controller, record, prop)
        };
    },
    bgBindRecordState: function (record, mapping) {
        if (!record) {
            return;
        }

        var invoker = _.bind(invokeState, this, mapping, record);

        record.on('change', invoker);
        this.bgOwn(record, 'change', invoker);

        record.hookEngage();
        this.bgOnDestroy(function (record) {
            record.hookDisable();
        }.bind(this, record));

        invoker();
    },
    bgBindControllerState: function (controller, mapping) {
        var recordName, record, recordMap;
        for (recordName in mapping) {
            recordMap = mapping[recordName];
            record = controller.record(recordName);
            if (!record) {
                continue;
            }

            var invoker = _.bind(invokeState, this, recordMap, record);

            this.bgOwn(record, 'change', invoker);

            record.hookEngage();
            this.bgOnDestroy(function (record) {
                record.hookDisable();
            }.bind(this, record));

            invoker();
        }
    },
    bgOnDestroy: function (cb, context) {
        if (!this._bgDestroyerEvents) {
            this._bgDestroyerEvents = [];
        }
        if (!this._bgDestroyer) {
            this._bgDestroyer = AmpersandEvents.createEmitter({});
        }
        if (!context) {
            context = this;
        }
        this._bgDestroyer.on('onDestroy', cb.bind(context));
    },
    bgTransform: function (transformation, value) {
        if (!value) {
            value = '';
        }

        switch (transformation) {
            case 'nl2br':
                return value.split("\n").map(function (item, index) {
                    return (<span key={"row"+index}>{item}<br/></span>)
                })
        }
    },
    bgOwn: function (emitter, name, cb) {
        emitter.on(name, cb);
        this.bgOnDestroy(_.bind((emitter, name, cb) => {
            if (!_.isFunction(emitter.off)) {
                return;
            }
            //console.warn('Removing bgOwned event', emitter, name, cb);
            emitter.off(name, cb);
        }, this, emitter, name, cb));
    },
    bgPreserveOnUnmount: function (component) {
        if (_.isArray(component)) {
            _.each(component, this.bgPreserveOnUnmount, this);
            return;
        }
        this._componentsToPreserve.push(component);
    },
    componentWillMount: function () {
        this.components = {};
        this._componentsToPreserve = [];
    },
    componentWillUnmount: function () {
        var destroy = (component) => {
            if (!component || !_.isFunction(component.bgDestroy)) {
                return;
            }
            if (-1 !== _.indexOf(this._componentsToPreserve, component)) {
                console.debug('preserved component', component);
                return;
            }
            component.bgDestroy();
        };

        // Auto cleanup for props
        _.each(this.components, destroy, this);
        //_.each(this.props, destroy, this);
        _.each(this.bgAutoDestroy, (key) => {
            destroy(this.props[key]);
        }, this);


        if (!this._bgDestroyer) {
            return;
        }

        this._bgDestroyer.trigger('onDestroy');
        this._bgDestroyer.off('onDestroy');
        this._bgDestroyer = null;
    }
};