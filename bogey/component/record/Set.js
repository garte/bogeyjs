
var extendable = require('bogey/lang/extendable');
var _ = require('lodash');
var dotty = require('dotty');

var Set = extendable({
		constructor: function() {
			this.items = {};
			this.index = 0;
			this.keys = [];
			this.iterateOverClasses = null;
			this.iterateOverType = null;
            this._metaCount = null;
		},
		first: function() {
			this.reset();
			return this.next();
		},
		next: function() {
			var val = this.items[this.keys[this.index++]];
			if (!val) {
				this.reset();
				return null;
			}

			if (this.iterateOverType && val.getRecordType().toLowerCase() !== this.iterateOverType.toLowerCase()) {
				return this.next();
			}

			if (null !== this.iterateOverClasses && val instanceof this.iterateOverClasses) {
				return this.next();
			}

			return val;
		},
		hasNext: function() {
			return this.index <= this.keys.length;
		},
		reset: function() {
			this.index = 0;
		},
        map: function (handler, scope) {
            this.reset();
            var x, results = [], index;
            while (x = this.next()) {
                //index = this.keys[this.index];
                index = null;
                results.push(_.bind(handler, scope || this)(x, index));
            }
            return results;
        },
		add: function(item, key) {
			this.items[key] = item;
			this.keys.push(key);
			return this;
		},
        remove: function (key) {
            if (!this.items[key]) {
                return this;
            }
            this.items[key] = null;
            delete(this.items[key]);

            this.reindex();
            return this;
        },
        move: function (index, newindex) {
            var current = this.keys[index], next = this.keys[newindex];

            this.keys[newindex] = current;
            this.keys[index] = next;
            return this;
        },
        reindex: function () {
            var newItems = {};
            var newKeys = [];

            _.each(this.keys, function (key, index) {
                if (!this.items[key]) {
                    return;
                }
                newItems[key] = this.items[key];
                newKeys.push(key);
            }, this);

            this.items = newItems;
            this.keys = newKeys;

            this.reset();
        },
		iterateOverRecordType: function (className) {
			this.iterateOverType = className;
		},
		iterateOverConstructor: function (ClassConstructor) {
			this.iterateOverClasses = ClassConstructor;
			return this;
		},
		get: function (key) {
			return this.items[key] || null;
		},
        metaCount: function (count) {
            if (!count) {
                return this._metaCount;
            }

            this._metaCount = count;
            return this;
        }
	});

module.exports = Set;