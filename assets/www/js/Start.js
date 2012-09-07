(function (fluid, $) {

    "use strict";

    fluid.defaults("omw.start", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        selectors: {
            locationButton: ".omwc-start-locationButton",
            locationInput: ".omwc-start-locationInput",
            results: ".omwc-start-results"
        },
        styles: {
            locationButton: "omw-start-locationButton",
            locationInput: "omw-start-locationInput"
        },
        selectorsToIgnore: ["results"],
        components: {
            results: {
                type: "omw.results",
                container: "{omw.start}.dom.results"
            }
        },
        events: {
            onResults: null,
            onResult: null
        },
        listeners: {
            onResult: "{that}.onResult"
        },
        protoTree: {
            locationInput: {
                value: "${location}",
                decorators: [{
                    addClass: "{styles}.locationInput"
                }, {
                    type: "fluid",
                    func: "omw.geocoding"
                }]
            }
        },
        renderOnInit: true
    });

    omw.start.preInit = function (that) {
        that.onResult = function (result) {
            that.applier.requestChange("result", result);
            that.applier.requestChange("location", result.formatted_address);
            that.refreshView();
        };
    };

    fluid.defaults("omw.results", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        events: {
            onResults: {
                event: "{omw.start}.events.onResults"
            },
            onResult: {
                event: "{omw.start}.events.onResult"
            }
        },
        listeners: {
            onResults: "{that}.onResults",
            onResult: "{that}.onResult"
        },
        selectors: {
            result: ".omwc-start-result"
        },
        styles: {
            result: "omw-start-result"
        },
        model: {
           "results" : [
              {
                 "address_components" : [
                    {
                       "long_name" : "test",
                       "short_name" : "test",
                       "types" : [ "route" ]
                    },
                    {
                       "long_name" : "Sarasota",
                       "short_name" : "Sarasota",
                       "types" : [ "locality", "political" ]
                    },
                    {
                       "long_name" : "Sarasota",
                       "short_name" : "Sarasota",
                       "types" : [ "administrative_area_level_2", "political" ]
                    },
                    {
                       "long_name" : "Florida",
                       "short_name" : "FL",
                       "types" : [ "administrative_area_level_1", "political" ]
                    },
                    {
                       "long_name" : "United States",
                       "short_name" : "US",
                       "types" : [ "country", "political" ]
                    }
                 ],
                 "formatted_address" : "test, Sarasota, FL, USA",
                 "geometry" : {
                    "bounds" : {
                       "northeast" : {
                          "lat" : 27.269040,
                          "lng" : -82.46058549999999
                       },
                       "southwest" : {
                          "lat" : 27.26538590,
                          "lng" : -82.46454820
                       }
                    },
                    "location" : {
                       "lat" : 27.26705330,
                       "lng" : -82.46332260
                    },
                    "location_type" : "GEOMETRIC_CENTER",
                    "viewport" : {
                       "northeast" : {
                          "lat" : 27.269040,
                          "lng" : -82.46058549999999
                       },
                       "southwest" : {
                          "lat" : 27.26538590,
                          "lng" : -82.46454820
                       }
                    }
                 },
                 "types" : [ "route" ]
              },
              {
                 "address_components" : [
                    {
                       "long_name" : "Old Bedford Rd",
                       "short_name" : "Old Bedford Rd",
                       "types" : [ "route" ]
                    },
                    {
                       "long_name" : "Goldens Bridge",
                       "short_name" : "Goldens Bridge",
                       "types" : [ "locality", "political" ]
                    },
                    {
                       "long_name" : "Lewisboro",
                       "short_name" : "Lewisboro",
                       "types" : [ "administrative_area_level_3", "political" ]
                    },
                    {
                       "long_name" : "Westchester",
                       "short_name" : "Westchester",
                       "types" : [ "administrative_area_level_2", "political" ]
                    },
                    {
                       "long_name" : "New York",
                       "short_name" : "NY",
                       "types" : [ "administrative_area_level_1", "political" ]
                    },
                    {
                       "long_name" : "United States",
                       "short_name" : "US",
                       "types" : [ "country", "political" ]
                    },
                    {
                       "long_name" : "10526",
                       "short_name" : "10526",
                       "types" : [ "postal_code" ]
                    }
                 ],
                 "formatted_address" : "Old Bedford Rd, Goldens Bridge, NY 10526, USA",
                 "geometry" : {
                    "bounds" : {
                       "northeast" : {
                          "lat" : 41.29588890,
                          "lng" : -73.67857990
                       },
                       "southwest" : {
                          "lat" : 41.29033750,
                          "lng" : -73.68211780
                       }
                    },
                    "location" : {
                       "lat" : 41.29257140,
                       "lng" : -73.67942649999999
                    },
                    "location_type" : "GEOMETRIC_CENTER",
                    "viewport" : {
                       "northeast" : {
                          "lat" : 41.29588890,
                          "lng" : -73.67857990
                       },
                       "southwest" : {
                          "lat" : 41.29033750,
                          "lng" : -73.68211780
                       }
                    }
                 },
                 "types" : [ "route" ]
              },
              {
                 "address_components" : [
                    {
                       "long_name" : "test",
                       "short_name" : "test",
                       "types" : [ "route" ]
                    },
                    {
                       "long_name" : "Southwest Denver",
                       "short_name" : "Southwest Denver",
                       "types" : [ "neighborhood", "political" ]
                    },
                    {
                       "long_name" : "Denver",
                       "short_name" : "Denver",
                       "types" : [ "locality", "political" ]
                    },
                    {
                       "long_name" : "Denver",
                       "short_name" : "Denver",
                       "types" : [ "administrative_area_level_2", "political" ]
                    },
                    {
                       "long_name" : "Colorado",
                       "short_name" : "CO",
                       "types" : [ "administrative_area_level_1", "political" ]
                    },
                    {
                       "long_name" : "United States",
                       "short_name" : "US",
                       "types" : [ "country", "political" ]
                    },
                    {
                       "long_name" : "80204",
                       "short_name" : "80204",
                       "types" : [ "postal_code" ]
                    }
                 ],
                 "formatted_address" : "test, Denver, CO 80204, USA",
                 "geometry" : {
                    "bounds" : {
                       "northeast" : {
                          "lat" : 39.72555680,
                          "lng" : -105.00706560
                       },
                       "southwest" : {
                          "lat" : 39.72537970,
                          "lng" : -105.00905390
                       }
                    },
                    "location" : {
                       "lat" : 39.72546820,
                       "lng" : -105.00805980
                    },
                    "location_type" : "GEOMETRIC_CENTER",
                    "viewport" : {
                       "northeast" : {
                          "lat" : 39.72681723029149,
                          "lng" : -105.0067107697085
                       },
                       "southwest" : {
                          "lat" : 39.72411926970850,
                          "lng" : -105.0094087302915
                       }
                    }
                 },
                 "types" : [ "route" ]
              }
           ],
           "status" : "OK"
        },
        repeatingSelectors: ["result"],
        renderOnInit: true,
        produceTree: "omw.results.produceTree"
    });

    omw.results.produceTree = function (that) {
        return {
            expander: {
                repeatID: "result",
                type: "fluid.renderer.repeat",
                pathAs: "result",
                controlledBy: "results",
                tree: {
                    value: "${{result}.formatted_address}",
                    decorators: [{
                        "addClass": "{styles}.result"
                    }, {
                        type: "jQuery",
                        func: "click",
                        args: that.selectResult
                    }]
                }
            }
        };
    };

    omw.results.preInit = function (that) {
        that.selectResult = function (event) {
            var index = that.locate("result").index(event.currentTarget),
                result = that.model.results[index];
            that.events.onResult.fire(result);
        };
        that.onResults = function (data) {
            that.applier.requestChange("results", data.results);
            that.refreshView();
        };
        that.onResult = function () {
            that.applier.requestChange("results", undefined);
            that.refreshView();
        };
    };

    fluid.defaults("omw.geocoding", {
        gradeNames: ["autoInit", "fluid.viewComponent"],
        events: {
            onResults: {
                event: "{omw.start}.events.onResults"
            }
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
                that.events.onResults.fire({
                    results: data.results
                });
            });
        };
        that.applier.modelChanged.addListener("address", function () {
            that.getGeocode(that.model.address);
        });
    };

    omw.geocoding.finalInit = function (that) {
        that.container.keydown(function () {
            clearTimeout(that.outFirer);
            that.outFirer = setTimeout(function () {
                var address = that.container.val();
                if (address.length < that.options.minSize) {
                    return;
                }
                if (address !== that.model.address) {
                    that.applier.requestChange("address", address);
                }
            }, that.options.delay);
        });
    };

})(fluid, jQuery);