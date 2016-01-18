var AmpersandEvents = require('ampersand-events');
var _ = require('lodash');
var dotty = require('dotty');

var domquery = require('domquery');
var css = require('dom-css');

module.exports = {
    bgInlineEdit: function (name, handler) {
        return function (name, handler, evt) {
            var element = evt.target, findElement = function (element) {
                if (!domquery(element).hasClass('inline-editable')) {
                    if (!element.parentNode) {
                        return null;
                    }
                    return findElement(element.parentNode);
                }
                return element;
            };

            element = findElement(element);

            if (null === element) {
                throw new Error('Malconfigured inline edit: no element with class inline-editable found');
            }

            var events = AmpersandEvents.createEmitter({});

            var submit = function(name, handler, events, element, input, displayProp, eventHandlers) {
                var val = input.value;

                handler(name, val, { element: element });

                if (_.trim(val) === '') {
                    val = '...';
                    if (domquery(element).attr('data-placeholder')) {
                        val = domquery(element).attr('data-placeholder');
                    }
                }

                if (element.childNodes.length > 0) {
                    // This is safer than innerHTML... browser escapes the value itself.
                    element.childNodes[0].nodeValue = val;
                } else {
                    val = _.escape(val);
                    element.innerHTML = val;
                }

                var index;
                for (index in eventHandlers) {
                    events.off(eventHandlers[index]);
                    delete(eventHandlers[index]);
                }

                if (input) {
                    domquery(input).remove();
                }
                domquery(element).style('display', displayProp || 'block');
            }.bind(this, name, handler, events);

            var input, isMultiLine = false, elHtml = '<input>';
            if (domquery(element).hasClass('multiline')) {
                elHtml = '<textarea>';
                isMultiLine = true;
            }

            var $input = domquery(elHtml);
            $input.attr({type: 'text'});
            $input.style('border', 'none');

            domquery(element.parentNode).addBefore($input, element);

            input = $input[0];

            var wasunbound = false,
                bindUnboundAttr = 'elem-unbound';

            if (domquery(element).hasClass(bindUnboundAttr)) {
                domquery(element).removeClass(bindUnboundAttr);
                wasunbound = true;
            }

            var srcStyle = getComputedStyle(element),
                editStyle = "line-height:" + srcStyle.lineHeight + ";",
                destStyle = getComputedStyle(input);

            _.each(["Weight", "Family", "Size", "Style"], function(prop) {
                var textStyle = srcStyle["font" + prop],
                    wrapperStyle = destStyle["font" + prop];
                if (wrapperStyle != textStyle) {
                    editStyle += "font-" + prop + ":" + srcStyle["font" + prop] + ";";
                }
            }, this);
            _.each(["height", "border", "color", "backgroundColor", "marginTop", "marginBottom", "marginLeft", "marginRight", "position", "left", "top", "right", "bottom", "float", "clear", "display", "textAlign"], function(prop) {
                input.style[prop] = srcStyle[prop];
            }, this);
            var width = css.get(element, 'width');
            if (width == "100%") {
                // block mode
                editStyle += "width:100%;";
                input.style.display = "block";
            } else {
                // inline-block mode
                editStyle += "width:" + (width + (Number(width) == width ? "px" : "")) + ";";
                //editStyle += "width: auto;";
            }

            input.style.cssText += ';' + editStyle;

            input.value = 'Text';
            if (dotty.exists(element, 'childNodes.0')) {
                input.value = element.childNodes[0].nodeValue;
            }
            if (domquery(element).attr('data-inline-edit-content')) {
                input.value = domquery(element).attr('data-inline-edit-content');
            }

            if (wasunbound === true) {
                domquery(element).addClass(bindUnboundAttr);
            }

            var displayProp = css.get(element, 'display'),
                eventHandlers = {}
                ;
            domquery(element).style('display', 'none');

            input.focus();
            input.select();

            eventHandlers['blur'] = function(element, input, displayProp, evt) {
                submit.bind(this)(element, input, displayProp, eventHandlers);
            }.bind(this, element, input, displayProp);

            eventHandlers['keyup'] = function(isMultiLine, element, input, displayProp, evt) {
                if ((isMultiLine === false && evt.keyCode === 13) || (isMultiLine === true && evt.shiftKey === true && evt.keyCode === 13)) {
                    domquery(input).off('blur', eventHandlers['blur']);
                    submit.bind(this)(element, input, displayProp, eventHandlers);
                    return;
                }

                if (evt.keyCode === 27) {
                    domquery(input).remove();
                    domquery(element).style('display', displayProp);
                    return;
                }
            }.bind(this, isMultiLine, element, input, displayProp);

            domquery(input).on('keyup', eventHandlers['keyup']);
            domquery(input).on('blur', eventHandlers['blur']);

        }.bind(this, name, handler);
    }
};