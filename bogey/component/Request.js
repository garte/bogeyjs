/**
 * Created by gaga on 2/24/15.
 */

var extendable = require('bogey/lang/extendable');
var _ = require('lodash');
var qajax = require('qajax');
var dotty = require('dotty');

var Request = extendable({
    constructor: function () {
        this._pendingRequests = {};
    },
    request: function (path, data, options) {
        options = _.extend({ method: 'POST' }, options || {});

        if (data) {
            data = qajax.serialize(data);
        }

        var params = {
            method: options.method || 'POST',
            data: data || null,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        };

        if (this.getPendingRequest(path, params)) {
            return this.getPendingRequest(path, params);
        }


        var pendingRequest = qajax(path, params).then(function (response) {
            var res = JSON.parse(response.responseText);

            switch (response.status) {
                case 200:
                    return res;

                case 500:
                    console.debug('status 500', res);
                    if (true === res.error && res.message) {
                        throw new Error('SERVER EXCEPTION: ' + res.exception + ': ' + res.message + "\n" + res.stack.split("\n"), 500);
                    }
            }

            return res;
        }.bind(this), function (error) {

            throw error;
        });

        if ('GET' !== params.method) {
            return pendingRequest;
        }

        return this.setPendingRequest(path, params, pendingRequest);
    },
    get: function (path) {
        return this.request(path, null, { method: 'GET' });
    },
    post: function (path, data) {
        return this.request(path, data, { method: 'POST' });
    },
    del: function (path) {
        return this.request(path, null, { method: 'DELETE' });
    },
    getPendingRequest: function (path, params) {
        if (!dotty.exists(this._pendingRequests, path)) {
            return false;
        }
        return dotty.get(this._pendingRequests, path);
    },
    setPendingRequest: function (path, params, request) {
        dotty.put(this._pendingRequests, path, request);
        return request.then(function (path, val) {
            dotty.remove(this._pendingRequests, path);
            return val;
        }.bind(this, path));
    }
}, 'bogey Service');

module.exports = Request;