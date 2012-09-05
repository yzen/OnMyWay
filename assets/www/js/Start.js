(function (fluid, $) {

    "use strict";

    fluid.defaults("omw.start", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        selectors: {
            locationButton: ".omwc-start-locationButton",
            locationInput: ".omwc-start-locationButton"
        },
        styles: {
            locationButton: "omw-start-locationButton",
            locationInput: "omw-start-locationButton"
        },
        protoTree: {
            locationInput: {
                valuebinding: "${location}",
                decorators: {
                    addClass: "{styles}.locationInput"
                }
            }
        },
        renderOnInit: true
    });

})(fluid, jQuery);