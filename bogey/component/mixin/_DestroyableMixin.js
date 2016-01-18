var AmpersandEvents = require('ampersand-events');
module.exports = {
    initializeDestroyable: function () {
        if (true === this.initializeDestroyableDone) {
            return;
        }
        this.initializeDestroyableDone = true;
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
    bgDestroy: function () {
        // Ignore if we never used any events.
        if (!this._bgDestroyer) {
            return;
        }
        this._bgDestroyer.trigger('onDestroy');
        this._bgDestroyer.off('onDestroy');
    }
};