(function (fluid, $) {

    "use strict";

    fluid.demands("omw.app.impl", "main", {
        options: {
            components: {
                start: {
                    type: "omw.start",
                    container: ".omwc-start",
                    createOnEvent: "afterFetch"
                }
            }
        }
    });

})(fluid, jQuery);