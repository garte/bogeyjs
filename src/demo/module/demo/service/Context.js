/**
 * Created by gaga on 2/24/15.
 */
var Service = require('bogey/component/Service');
var dotty = require('dotty');
var _ = require('lodash');

var Context = Service.extend({
    constructor: function (request, mapper) {
        this._request = request;
        this._mapper = mapper;
        this._home = null;
        this._struct = null;
    },

    getHome: function () {
        return this._home || null;
    },
    getPropertyRule: function (type, property) {
        var refPath = 'references.'+type+'.propertyRules.'+property,
            lnPath = 'listnodes.'+type+'.propertyRules.'+property;

        if (dotty.exists(this._struct, lnPath)) {
            return dotty.get(this._struct, lnPath);
        }

        if (dotty.exists(this._struct, refPath)) {
            return dotty.get(this._struct, refPath);
        }
        return null;

    },
    getAvailableReferenceTypes: function (originType, dir) {
        var semantics = this.getSemantics(originType),
            available = [],
            dirs = ['from', 'to'],
            endpoints;

        if (dir) {
            dir = this.toRefDir(dir);
            dirs = ['from' === dir ? 'from' : 'to'];
        }

        _.each(semantics.references, (refType) => {
            _.each(dirs, (dir) => {
                var refSemantics = this.getReferenceSemantics(refType, dir),
                    endpoints = refSemantics.endpoints;
                if (
                    '*' !== endpoints &&
                    -1 === _.indexOf(endpoints, originType)
                ) {
                    return;
                }
                available.push([refType, this.toNodeDir(dir)]);
            });
        });
        return available;
    },
    getAvailableListnodeTypes: function (refType, dir) {
        var semantics = this.getReferenceSemantics(refType, dir),
            available = [];

        if (!semantics) {
            return null;
        }

        if ('*' === semantics.endpoints) {
            return this._struct.listnodes['*'];
        }

        return semantics.endpoints;
    },
    getLayoutRules: function (recordType) {
        var rules = {
            ln_task: {
                list: {
                    section: {
                        meta: [
                            {
                                type: 'ref_requires',
                                dir: 'in',
                                style: 'prototype',
                                props: {
                                    width: 'full',
                                    title: 'Stuff depending on this'
                                }
                            },
                            {
                                type: 'ref_defines',
                                dir: 'in',
                                style: 'prototype',
                                props: {
                                    width: 'full',
                                    title: 'Tags'
                                }
                            },
                        ],
                        focus: [
                            {
                                type: 'ref_requires',
                                dir: 'out',
                                style: 'prototype',
                                props: {
                                    renderAs: 'table',
                                    width: 'full',
                                    title: 'Tasks and goals'
                                }
                            },
                        ]
                    }
                }
            },
            ln_note: {
                list: {
                    section: {
                        meta: [
                            {
                                type: 'ref_defines',
                                dir: 'in',
                                style: 'prototype',
                                props: {
                                    width: 'full',
                                    title: 'Tags'
                                }
                            },
                        ],
                        focus: [
                            {
                                type: 'ref_defines',
                                dir: 'out',
                                style: 'prototype',
                                props: {
                                    width: 'full',
                                    title: 'Depending on this'
                                }
                            },
                        ]
                    }
                }
            },
            ln_event: {
                list: {
                    section: {
                        meta: [
                            {
                                type: 'ref_takesplaceat',
                                dir: 'out',
                                style: 'prototype',
                                props: {
                                    width: 'full',
                                    title: 'takes place at'
                                }
                            },
                            {
                                type: 'ref_defines',
                                dir: 'in',
                                style: 'prototype',
                                props: {
                                    width: 'full',
                                    title: 'part of'
                                }
                            },
                        ],
                        focus: [
                            {
                                type: 'ref_requires',
                                dir: 'out',
                                style: 'prototype',
                                props: {
                                    renderAs: 'table',
                                    width: 'full',
                                    title: 'Goals and stuff to do'
                                }
                            },
                            {
                                type: 'ref_participates',
                                dir: 'out',
                                style: 'prototype',
                                props: {
                                    renderAs: 'table',
                                    width: 'full',
                                    title: 'Participants'
                                }
                            },
                            {
                                type: 'ref_defines',
                                dir: 'out',
                                style: 'prototype',
                                props: {
                                    renderAs: 'table',
                                    width: 'full',
                                    title: 'contains'
                                }
                            },

                        ]
                    }
                }
            },
            ln_location: {
                list: {
                    section: {
                        meta: [
                            {
                                type: 'ref_defines',
                                dir: 'in',
                                style: 'prototype',
                                props: {
                                    width: 'full',
                                    title: 'Tags'
                                }
                            },
                            {
                                type: 'ref_defines',
                                dir: 'out',
                                style: 'prototype',
                                props: {
                                    width: 'full',
                                    title: 'Sub-Locations'
                                }
                            },
                        ],
                        focus: [
                            {
                                type: 'ref_takesplaceat',
                                dir: 'in',
                                style: 'prototype',
                                props: {
                                    width: 'full',
                                    title: 'Stuff happening here'
                                }
                            },
                        ]
                    }
                }
            },

        };

        if (!rules[recordType]) {
            var types = this.getAvailableReferenceTypes(recordType);
            var defaultRules = [];
            _.each(types, (typemeta) => {
                var type = typemeta[0], dir = typemeta[1];
                defaultRules.push({ type: type, dir: dir, style: 'prototype' });
            });
            return { list: { section: { main: defaultRules }}};
        }

        return rules[recordType];
    },
    getReferenceSemantics: function (refType, dir) {
        var path = ['references', refType, this.toRefDir(dir), 'semantics']
        return dotty.get(this._struct, path.join('.'));
    },
    getSemantics: function (originType) {
        var path = ['listnodes', originType, 'semantics']
        return dotty.get(this._struct, path.join('.'));
    },
    refresh: function () {
        return this._request.get('/user/context').then(function (context) {
            this._home = this._mapper.mapResponseToRecord(context.profile.home);
            this._struct = context.graph.struct;
            return this;
        }.bind(this));
    },
    toRefDir: function (dir) {
        if (-1 !== _.indexOf(['out', 'in'], dir)) {
            dir = ('in' === dir) ? 'to' : 'from';
        }
        return dir;
    },
    toNodeDir: function (dir) {
        if (-1 !== _.indexOf(['to', 'from'], dir)) {
            dir = ('from' === dir) ? 'out' : 'in' ;
        }
        return dir;
    }
});

module.exports = Context;