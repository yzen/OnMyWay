(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("omw");

    fluid.defaults("omw.app", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        events: {
            afterFetch: null
        },
        components: {
            start: {
                type: "omw.start",
                container: ".omwc-start",
                createOnEvent: "afterFetch"
            },
            urlExpander: {
                type: "omw.urlExpander"
            },
            messageBundle: {
                type: "omw.messageBundle",
                options: {
                    events: {
                        afterFetch: "{omw.app}.events.afterFetch"
                    }
                }
            }
        }
    });

})(jQuery, fluid);