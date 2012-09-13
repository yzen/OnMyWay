(function (fluid, $) {

    "use strict";

    fluid.defaults("omw.start", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        selectors: {
            routeInput: ".omwc-start-routeInput",
            stopInput: ".omwc-start-stopInput"
            routes: ".omwc-start-routes"
        },
        styles: {
            routeInput: "omw-start-routeInput"
        },
        parentBundle: "{messageBundle}.resolver",
        selectorsToIgnore: ["routes"],
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
            routes: {
                type: "omw.routes",
                container: "{omw.start}.dom.routes"
            }
        },
        events: {
            onRoutes: null,
            onRoute: null
        },
        listeners: {
            onRoute: "{that}.onRoute",
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
                    addClass: "{styles}.routeInput"
                }]
            }
        },
        placeholders: {
            routeInput: "routeInput"
        },
        renderOnInit: true
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
            that.applier.requestChange("route", route);
            that.locate("routeInput").val(that.model.route.title);
        };
    };

    fluid.defaults("omw.routes", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        events: {
            onRoutes: {
                event: "{omw.start}.events.onRoutes"
            },
            onRoute: {
                event: "{omw.start}.events.onRoute"
            }
        },
        listeners: {
            onRoutes: "{that}.onRoutes",
            onRoute: "{that}.onRoute"
        },
        selectors: {
            route: ".omwc-start-route"
        },
        styles: {
            route: "omw-start-route"
        },
        model: {},
        repeatingSelectors: ["route"],
        renderOnInit: true,
        produceTree: "omw.routes.produceTree"
    });

    omw.routes.produceTree = function (that) {
        return {
            expander: {
                repeatID: "route",
                type: "fluid.renderer.repeat",
                pathAs: "route",
                controlledBy: "routes",
                tree: {
                    value: "${{route}.title}",
                    decorators: [{
                        "addClass": "{styles}.route"
                    }, {
                        type: "jQuery",
                        func: "click",
                        args: that.selectRoute
                    }]
                }
            }
        };
    };

    omw.routes.preInit = function (that) {
        that.selectRoute = function (event) {
            var index = that.locate("route").index(event.currentTarget),
                route = that.model.routes[index];
            that.events.onRoute.fire(route);
        };
        that.onRoutes = function (data) {
            that.applier.requestChange("routes", data);
            that.refreshView();
        };
        that.onRoute = function () {
            that.applier.requestChange("routes", undefined);
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
        delay: 500
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

    omw.autocomplete.preInit = function (that) {
        that.applier.modelChanged.addListener("value", function () {
            if (!that.model.value) {
                that.events.onMatch.fire([]);
                return;
            }
            var list = fluid.copy(that.model.list),
                matches = fluid.remove_if(list, function (route) {
                    var titleUpper = route.title.toUpperCase(),
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