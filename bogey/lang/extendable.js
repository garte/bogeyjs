/**
 * Created by gaga on 2/21/15.
 */
var extend = require('ampersand-class-extend');

var Base = function () {};

var extendable = function (literal, toString) {
    var Obj = function () {
        if (toString) {
            this.toString = function () { return toString; };
        }
    };

    Obj.extend = extend;

    Obj = Obj.extend(literal);

    return Obj;
};

module.exports = extendable;