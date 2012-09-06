(function (fluid, $) {

    "use strict";

    fluid.defaults("omw.start", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        selectors: {
            locationButton: ".omwc-start-locationButton",
            locationInput: ".omwc-start-locationInput"
        },
        styles: {
            locationButton: "omw-start-locationButton",
            locationInput: "omw-start-locationInput"
        },
        protoTree: {
            locationInput: {
                valuebinding: "${location}",
                decorators: {
                    addClass: "{styles}.locationInput"
                }
            }
        },
        components: {
            geocoding: {
                type: "omw.geocoding",
                container: "{omw.start}.dom.locationInput"
            }
        },
        renderOnInit: true
    });

    fluid.defaults("omw.geocoding", {
        gradeNames: ["autoInit", "fluid.viewComponent"],
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
                that.applier.requestChange("results", data);
                console.log(JSON.stringify(data));
                delete that.searching;
                if (that.address) {
                    that.getGeocode(that.address);
                    delete that.address;
                }
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
                if (address.lenth < minSize) {
                    return;
                }
                if (address !== that.model.address) {
                    that.applier.requestChange("address", address);
                }
            }, that.options.delay);
        });
    };

})(fluid, jQuery);