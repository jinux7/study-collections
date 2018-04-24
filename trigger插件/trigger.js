;(function(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory;
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jinuxTrigger"] = factory;
	else
		root["jinuxTrigger"] = factory;
})(this, function(el, evt, detail) {
	detail = detail || {};
    var e, opt = {
            bubbles: true,
            cancelable: true,
            detail: detail
        };

    try {
        if (typeof CustomEvent !== 'undefined') {
            e = new CustomEvent(evt, opt);
            if (el) {
                el.dispatchEvent(e);
            }
        } else {
            e = document.createEvent("CustomEvent");
            e.initCustomEvent(evt, true, true, detail);
            if (el) {
                el.dispatchEvent(e);
            }
        }
    } catch (ex) {
        console.warn("jinux-trigger is not supported by environment.");
    }
});