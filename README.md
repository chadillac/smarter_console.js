smarter_js_console
==================

A smarter javascript console for browsers old and new.

**Why?**

Sometimes a console call gets left in your code, sometimes you don't realize it until it's reported from a production enviornment via a user in an old browser.  Sometimes it's handy to be able to get debugging information on a production enviornment as will.  The issue then becomes detecting where a browser supports a console and utilizing if and only if it's available, this still dumps debugging information to a users console if they have it open, which also isn't desirable a majority of the time.  You can prevent this by either setting a global "debugging" var in your code and checking for it before using a the console or (my preferred method) checking the URL structure to ensure you're not in a production enviornment.  The problem with the URL case is that even if you do want to enable debugging on a live system you can't unless you're also checking for the debugging global var or having it set based on the URL search and then manually changing it.

Getting fed up with both of the aforementioned use cases I wrote this generic wrapper to make my life easier for myself and my teams.

**How does this fix that?**
We basically hijack the existing console and mirror it adding a layer of sanity checks before attempting to use it.  These checks are:

1. Are we in a debugging enviornment? 
2. Do we have a console to use?
3. Does it have the method I'm looking for?

It also adds a few common use cases like log, warn, and trace with functions that do nothing intially.  This is to prevent older browsers from throwing fatal exceptions when attempting to use console.log without verifying that console exists and that it has a log method.  I've also added some little helpers here and there like the ability to enable stack traces to all console calls (helpful with event driven models) that can be enabled and disabled easily.

I essentially tried to make a library that made console interactions "set it and forget it" that would play nice with developers, third party libraries, and production enviornments.

**How do you use it?**
Just include the script in your page and use console.log and other methods as you normally would.

**Debugging**
***Enabling***

1. set var debugging = true in the script to default debugging everywhere
2. run console.enable_debugging(true) from console or any other script (not passing true will disable it again)
3. add a check in the script that will automagically detect you're in a dev environment by sniffing URL or global and set debugging value accordingly

**Stack Trace all the things!!1!**
***Enabling***

1. make sure debugging is enabled
2. run console.enable_traces(true) (not passing true will disable it again)
3. as part of your debug by default check, you could set trace = true to have all calls dump a trace 
