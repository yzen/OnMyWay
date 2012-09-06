(function (fluid, $) {

    "use strict";

    fluid.defaults("omw.start", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        selectors: {
            locationButton: ".omwc-start-locationButton",
            locationInput: ".omwc-start-locationInput",
            result: ".omwc-start-result"
        },
        styles: {
            locationButton: "omw-start-locationButton",
            locationInput: "omw-start-locationInput",
            result: "omw-start-result"
        },
        model: {
            results: [{
                formatted_address: "TEST"
            }]
        },
        protoTree: {
            locationInput: {
                valuebinding: "${location}",
                decorators: {
                    addClass: "{styles}.locationInput"
                }
            },
            expander: {
                repeatID: "result",
                type: "fluid.renderer.repeat",
                pathAs: "result",
                controlledBy: "results",
                tree: {
                    value: "${{result}.formatted_address}",
                    decorators: {"addClass": "{styles}.result"}
                }
            }
        },
        repeatingSelectors: ["result"],
        components: {
            geocoding: {
                type: "omw.geocoding",
                container: "{omw.start}.dom.locationInput",
                options: {
                    listeners: {
                        onResults: "{omw.start}.onResults"
                    }
                }
            }
        },
        renderOnInit: true
    });
    omw.start.preInit = function (that) {
        that.onResults = function (data) {
            that.applier.requestChange("results", data.results);
            that.refreshView();
        };
    };

    fluid.defaults("omw.geocoding", {
        gradeNames: ["autoInit", "fluid.viewComponent"],
        events: {
            onResults: null
        },
        components: {
            geocodeSource: {
                type: "omw.dataSource.URL",
                options: {
                    url: "https://maps.googleapis.com/maps/api/geocode/json?address=%address&sensor=true",
                    termMap: {
                        address: "%address"
                    }
                }
            }
        },
        minSize: 4,
        delay: 500
    });

    omw.geocoding.preInit = function (that) {
        that.getGeocode = function (address) {
            that.geocodeSource.get({
                address: address
            }, function (data) {
                delete that.searching;
                if (that.address) {
                    that.getGeocode(that.address);
                    delete that.address;
                    return;
                }
                that.events.onResults.fire(data);
            });
        };
        that.applier.modelChanged.addListener("address", function () {
            if (that.searching) {
                that.address = that.model.address;
                return;
            }
            that.getGeocode(that.model.address);
        });
    };

    omw.geocoding.finalInit = function (that) {
        that.container.keydown(function () {
            clearTimeout(that.outFirer);
            that.outFirer = setTimeout(function () {
                var address = that.container.val();
                if (address.lenth < that.options.minSize) {
                    return;
                }
                if (address !== that.model.address) {
                    that.applier.requestChange("address", address);
                }
            }, that.options.delay);
        });
    };

})(fluid, jQuery);