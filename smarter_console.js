// smarter console
(function(console_ref){
    var debugging = true;
    var old_support = false;
    var failover_console = false;

    // method we'll shove in place to catch common use cases, also supports
    // using self built console if support is enabled and an existing console isn't
    // available for us to use (IE I'm looking at you...)
    var failover = function() {
        if (debugging) {
            if (failover_console) {
                var log_time = new Date();
                var append_it = [];
                for (var arg in arguments) {
                    append_it.push(' '+arguments[arg]);    
                }
                append_it.join(',');
                failover_console.value += "["+log_time.toTimeString()+"]-----------\n";
                failover_console.value += " >"+append_it+"\n";
                failover_console.scrollTop = failover_console.scrollHeight;
            }
        }
    };

    // they want to utilize failover console for older browers, do it up.
    var enable_failover = function(attempts) {
        if (typeof attempts == 'undefined') {
            attempts = 0;   
        }
        if (document.readyState != "interactive" && document.readyState != 'complete') {
            // DOM isn't ready yet, retry later.
            if (attempts <= 200) {
                // we'll try for 200 attempts, then give up.
                setTimeout(enable_failover,100,attempts);
            }
            return; // try again shortly
        }
        if (debugging) {
            // create and style our failover console
            var console_out = document.createElement('textarea'); 
            console_out.style.position = "absolute";
            console_out.style.bottom =  "0"; 
            console_out.style.right = "0"; 
            console_out.style.left = "0"; 
            console_out.style.height = "200px";
            console_out.readOnly = true;
            document.body.appendChild(console_out);
            failover_console = console_out;
        }
    };

    var console = {
        // add safety handler for most common use cases 
        log:failover, 
        warn:failover, 
        trace:failover,
        enable_failover_support: enable_failover,
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
            if (typeof console[method] == 'undefined' || console[method] === failover) {
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
    } else if (old_support) {
        enable_failover();    
    }

    // enabled debugging by default on dev/staging 
    //if ([HOWEVER YOU WANT TO GO ABOUT DETECTING A DEV ENVIORNMENT]) {
    //    debugging = true;
    //}

    // replace the default console with our smarter version
    window.console = console;
})(window.console);
