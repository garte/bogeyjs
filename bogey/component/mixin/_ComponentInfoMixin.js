/*
 *
 */
define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/Evented',
	'dojo/Stateful',
], function (declare, lang, array, Evented, Stateful) {
	return declare([], {
		constructor: function () {
			this._bgTriggers = new Evented();
		},
		bgGetComponentInfo: function () {
			var info = 'Component: ' + this.bgComponentName + " ("+this.toString()+")\n";
			info += "Type: " + this.bogeyType + "\n\n";

			if (lang.isFunction(this.bgGetSpecificComponentInfo)) {
				info += this.bgGetSpecificComponentInfo();
			}
			return info;
		}
	});
});