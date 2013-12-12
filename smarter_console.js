// smarter console
(function(console_ref){
    var debugging = false;
    var safety = function() { /* do nothing, avoid exceptions. */ };
    var console = {
        // add safety handler for most common use cases 
        log:safety, 
        warn:safety, 
        trace:safety,
        // enabled debugging in production enviornments via console.enable_debugging
        enable_debugging: function() {
            debugging = true;
        },
        can_use: function(method) {
            // if we're in a debugging env and have access to the method needed, use it.
            if (debugging) {
                if (typeof console_ref != 'undefined' && typeof console_ref[method] == 'function') {
                    return true; 
                }
            }
            return false;
        }
    };

    // mirror source, adding our can_use checking logic 
    if (console_ref) {
        for (var method in console_ref) {
            if (typeof console[method] == 'undefined' || console[method] === safety) {
                // create it, closure is to ensure method name sticks
                (function(method_name){
                     console[method_name] = function() {
                        if (console.can_use(method_name)) {
                            console_ref[method_name].apply(console_ref,arguments);
                        }
                    }
                })(method);
            }
        }
    }

    // enabled debugging by default on dev/staging 
    //if ([HOWEVER YOU WANT TO GO ABOUT DETECTING A DEV ENVIORNMENT]) {
    //    debugging = true;
    //}

    // replace the default console with our smarter version
    window.console = console;
})(window.console);
