/*
 *
 */
var Service = require('bogey/component/Service');
var _ = require('lodash');
var Q = require('q');
var dotty = require('dotty');

var Repository = Service.extend({
		constructor: function (config) {
			this._config = config;
			
			this._repository = {};
			this._connections = {};
			this._inflights = {};
			console.debug('constructed object repo', this._repository);
		},
		connect: function (key) {
			//var val = _.getObject(key, false, this._connections);
            var val = access(this._connections, 'key');
            console.debug('val', val);
			if (val > 0) {
				val++;
			} else {
				val = 1;
			}
			dotty.put(this._connections, key, val);
			console.debug('connect to', key, val);
			return this;
		},
		disconnect: function (key) {
			var val = dotty.get(this._connections, key);
			if (val > 0) {
				val--;
			} else {
				val = 0;
			}
			dotty.put(this._connections, key, val);
			console.debug('disconnect from', key, val);

			if (val === 0) {
				this.remove(key);
				console.debug('removed key from repo', key, val);
			}
			return this;
		},
		get: function (key) {
			return dotty.get(this._repository, key);
		},
		set: function (key, object) {
			dotty.put(this._repository, key, object);
			return this;
		},
		getOrFetch: function (key, fetcher) {
			if (this.exists(key)) {
				return Q.when(this.get(key));
			}

			var def = fetcher(key).then(function (key, object) {
				this.set(key, object);
				return object;
			}.bind(this, key));
			return def;
		},
		setInFlight: function (key, deferred) {
			deferred.then(function (result) {
				delete(this._inflights[key]);
				return result;
			}.bind(this));
			this._inflights[key] = deferred;
			return this;
		},
		getInFlight: function (key) {
			if (!this._inflights[key]) {
				return false;
			}

			return this._inflights[key];
		},
		remove: function (key) {
			var val = this.get(key);
			val = null;
			dotty.remove(this._repository, key);
			//delete(val);
			return this;
		},
		exists: function (key) {
			return dotty.exists(this._repository, key);
		}
});

module.exports = Repository;
