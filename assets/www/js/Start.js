(function (fluid, $) {

    "use strict";

    fluid.defaults("omw.start", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        selectors: {
            routeInput: ".omwc-start-routeInput",
            stopInput: ".omwc-start-stopInput",
            stops: ".omwc-start-stops",
            routes: ".omwc-start-routes"
        },
        styles: {
            input: "omw-start-input"
        },
        parentBundle: "{messageBundle}.resolver",
        selectorsToIgnore: ["routes", "stops"],
        components: {
            routesAutocomplete: {
                type: "omw.autocomplete",
                container: "{omw.start}.dom.routeInput",
                options: {
                    url: "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc",
                    events: {
                        onMatch: {
                            event: "{omw.start}.events.onRoutes"
                        }
                    },
                    dataType: "xml",
                    responseParser: "omw.autocomplete.parseRoutes"
                }
            },
            stopsAutocomplete: {
                type: "omw.autocomplete",
                container: "{omw.start}.dom.stopInput",
                options: {
                    url: "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=%route",
                    events: {
                        onMatch: {
                            event: "{omw.start}.events.onStops"
                        }
                    },
                    model: {
                        route: "{omw.start}.model.route.tag"
                    },
                    termMap: {
                        route: "%route"
                    },
                    dataType: "xml",
                    responseParser: "omw.autocomplete.parseStops"
                },
                createOnEvent: "onRoute"
            },
            stops: {
                type: "omw.results",
                container: "{omw.start}.dom.stops",
                options: {
                    events: {
                        onResults: {
                            event: "{omw.start}.events.onStops"
                        },
                        onResult: {
                            event: "{omw.start}.events.onStop"
                        }
                    }
                }
            },
            routes: {
                type: "omw.results",
                container: "{omw.start}.dom.routes",
                options: {
                    events: {
                        onResults: {
                            event: "{omw.start}.events.onRoutes"
                        },
                        onResult: {
                            event: "{omw.start}.events.onRoute"
                        }
                    }
                }
            }
        },
        events: {
            onRoutes: null,
            onStops: null,
            onRoute: null,
            onStop: null
        },
        listeners: {
            onRoute: "{that}.onRoute",
            onStop: "{that}.onStop",
            prepareModelForRender: "{that}.prepareModelForRender"
        },
        protoTree: {
            routeInput: {
                value: "${route.title}",
                decorators: [{
                    type: "attrs",
                    attributes: {
                        placeholder: "${placeholders.routeInput}"
                    }
                }, {
                    addClass: "{styles}.input"
                }]
            },
            stopInput: {
                value: "${stop.stopTitle}",
                decorators: [{
                    type: "attrs",
                    attributes: {
                        placeholder: "${placeholders.stopInput}"
                    }
                }, {
                    addClass: "{styles}.input"
                }, {
                    type: "jQuery",
                    func: "hide"
                }]
            }
        },
        placeholders: {
            routeInput: "routeInput",
            stopInput: "stopInput"
        },
        renderOnInit: true,
        delay: 500
    });

    omw.start.preInit = function (that) {
        that.prepareModelForRender = function () {
            var placeholders = {};
            fluid.each(that.options.placeholders, function (val, key) {
                placeholders[key] = that.options.parentBundle.resolve(val);
            });
            that.applier.requestChange("placeholders", placeholders);
        };
        that.onRoute = function (route) {
            that.locate("routeInput").val(route.title);
            that.applier.requestChange("route.tag", route.tag);
        };
        that.onStop = function (stop) {
            that.applier.requestChange("stop", stop);
            that.locate("stopInput").val(that.model.stop.title);
        };

        that.applier.modelChanged.addListener("route.tag", function () {
            that.locate("stopInput").show();
        });
    };

    omw.start.postInit = function (that) {
        that.locate("routeInput").keydown(function () {
            clearTimeout(that.outFirer);
            var oldVal = that.locate("routeInput").val();
            that.outFirer = setTimeout(function () {
                if (that.locate("routeInput").val() !== oldVal) {
                    that.locate("stopInput").hide();
                }
            }, that.options.delay);
        });
    };

    fluid.defaults("omw.results", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        events: {
            onResults: null,
            onResult: null

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
        model: {},
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
                    value: "${{result}.title}",
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
            that.applier.requestChange("results", data);
            that.refreshView();
        };
        that.onResult = function () {
            that.applier.requestChange("results", undefined);
            that.refreshView();
        };
    };

    fluid.defaults("omw.autocomplete", {
        gradeNames: ["autoInit", "fluid.viewComponent"],
        events: {
            onMatch: null
        },
        url: "",
        components: {
            dataSource: {
                type: "omw.dataSource.URL",
                options: {
                    url: "{omw.autocomplete}.options.url",
                    termMap: "{omw.autocomplete}.options.termMap",
                    dataType: "{omw.autocomplete}.options.dataType",
                    responseParser: "{omw.autocomplete}.options.responseParser"
                }
            }
        },
        minSize: 1,
        delay: "{omw.start}.options.delay"
    });

    omw.autocomplete.parseRoutes = function (data) {
        return fluid.transform($("route", data), function (route) {
            route = $(route);
            return {
                title: route.attr("title"),
                tag: route.attr("tag")
            };
        });
    };

    omw.autocomplete.parseStops = function (data) {
        return fluid.transform($("route>stop", data), function (stop) {
            stop = $(stop);
            return {
                tag: stop.attr("tag"),
                title: stop.attr("title"),
                id: stop.attr("stopId"),
                lat: stop.attr("lat"),
                lon: stop.attr("lon")
            };
        });
    };

    omw.autocomplete.preInit = function (that) {
        that.applier.modelChanged.addListener("value", function () {
            if (!that.model.value) {
                that.events.onMatch.fire([]);
                return;
            }
            var list = fluid.copy(that.model.list),
                matches = fluid.remove_if(list, function (match) {
                    var titleUpper = match.title.toUpperCase(),
                        valueUpper = that.model.value.toUpperCase();
                    if (titleUpper.indexOf(valueUpper) < 0) {
                        return true;
                    }
                });
            that.events.onMatch.fire(matches);
        });
    };

    omw.autocomplete.postInit = function (that) {
        that.container.keydown(function () {
            clearTimeout(that.outFirer);
            that.outFirer = setTimeout(function () {
                var value = that.container.val();
                if (value.length < that.options.minSize) {
                    that.applier.requestChange("value", undefined);
                    return;
                }
                if (value !== that.model.value) {
                    that.applier.requestChange("value", value);
                }
            }, that.options.delay);
        });
    };

    omw.autocomplete.finalInit = function (that) {
        that.dataSource.get(that.model, function (data) {
            that.applier.requestChange("list", data);
        });
    };

})(fluid, jQuery);