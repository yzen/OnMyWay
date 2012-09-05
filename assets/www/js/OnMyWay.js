(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("omw");

    fluid.defaults("omw.app", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        contexts: [],
        components: {
            app: {
                type: "omw.app.impl"
            }
        }
    });

    omw.app.preInit = function (that) {
        if (!that.options.contexts) {
            return;
        }
        fluid.each(fluid.makeArray(that.options.contexts), function (context) {
            that[context] = fluid.typeTag(context);
        });
    };

    fluid.defaults("omw.app.impl", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        events: {
            afterFetch: null
        },
        components: {
            urlExpander: {
                type: "omw.urlExpander"
            },
            messageBundle: {
                type: "omw.messageBundle",
                options: {
                    events: {
                        afterFetch: "{that}.events.afterFetch"
                    }
                }
            }
        }
    });

    fluid.demands("omw.app.impl", null, {
        options: "{options}"
    });

})(jQuery, fluid);
