/*global jQuery, fluid, omw, google*/
(function (fluid, $) {

    "use strict";

    fluid.defaults("omw.start", {
        gradeNames: ["autoInit", "fluid.viewComponent"],
        selectors: {
            routes: ".omwc-start-routes",
            stops: ".omwc-start-stops",
            predictions: ".omwc-start-predictions"
        },
        model: {
            routes: {},
            stops: {}
        },
        components: {
            instantiator: "{instantiator}",
            routes: {
                type: "omw.section",
                container: "{omw.start}.dom.routes",
                options: {
                    model: "{omw.start}.model.routes"
                }
            },
            stops: {
                type: "omw.section",
                container: "{omw.start}.dom.stops",
                options: {
                    model: "{omw.start}.model.stops"
                }
            },
            predictions: {
                type: "omw.predictions",
                container: "{omw.start}.dom.predictions",
                options: {
                    model: {
                        route: "{omw.start}.model.routes.result.tag",
                        stop: "{omw.start}.model.stops.result.tag"
                    }
                },
                createOnEvent: "afterStopSelected"
            }
        },
        events: {
            ready: null,

            onRoutes: null,
            onRouteSelected: null,
            onRouteUpdated: null,

            initStops: {
                event: "onRouteSelected"
            },

            onStops: null,
            onStopSelected: null,
            afterStopSelected: null,
            onStopUpdated: null
        },
        listeners: {
            onStopUpdated: "{that}.clearPredictions",
            onRouteUpdated: "{that}.clearPredictions",
            ready: "{that}.show"
        }
    });

    omw.start.preInit = function (that) {
        that.show = function () {
            that.container.show();
        };
        that.clearPredictions = function () {
            if (that.predictions) {
                that.instantiator.clearComponent(that, "predictions");
            }
        };
    };

    omw.start.finalInit = function (that) {
        that.events.ready.fire();
    };

    fluid.demands("autocomplete", "routes", {
        options: {
            url: "http://webservices.nextbus.com/service/publicXMLFeed?command=routeList&a=ttc",
            responseParser: "omw.autocomplete.parseRoutes"
        }
    });

    fluid.demands("routes", "omw.start", {
        options: {
            events: {
                onResults: {
                    event: "{omw.start}.events.onRoutes"
                },
                onResult: {
                    event: "{omw.start}.events.onRouteSelected"
                },
                updated: {
                    event: "{omw.start}.events.onRouteUpdated"
                },
                initAutocomplete: {
                    event: "{omw.start}.events.ready"
                }
            },
            nickName: "routes",
            placeholders: {
                input: "routeInput"
            }
        }
    });

    fluid.demands("autocomplete", "stops", {
        options: {
            url: "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&r=%route",
            model: {
                route: "{omw.start}.model.routes.result.tag"
            },
            termMap: {
                route: "%route"
            },
            responseParser: "omw.autocomplete.parseStops"
        }
    });

    fluid.demands("stops", "omw.start", {
        options: {
            events: {
                onResults: {
                    event: "{omw.start}.events.onStops"
                },
                onResult: {
                    event: "{omw.start}.events.onStopSelected"
                },
                afterResult: {
                    event: "{omw.start}.events.afterStopSelected"
                },
                updated: {
                    event: "{omw.start}.events.onStopUpdated"
                },
                showOn: {
                    event: "{omw.start}.events.onRouteSelected"
                },
                hideOn: {
                    event: "{omw.start}.events.onRouteUpdated"
                },
                initAutocomplete: {
                    event: "{omw.start}.events.initStops"
                }
            },
            showOnInit: false,
            nickName: "stops",
            placeholders: {
                input: "stopInput"
            }
        }
    });

    fluid.defaults("omw.direction", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        parentBundle: "{messageBundle}.resolver",
        selectors: {
            title: ".omwc-start-direction-title",
            minute: ".omwc-start-direction-minute",
            minuteTime: ".omwc-start-direction-minuteTime",
            minuteText: ".omwc-start-direction-minuteText"
        },
        repeatingSelectors: ["minute"],
        renderOnInit: true,
        styles: {
            title: "omw-start-direction-title",
            minuteTime: "omw-start-direction-minuteTime",
            minuteText: "omw-start-direction-minuteText"
        },
        strings: {},
        protoTree: {
            title: {
                value: "${title}",
                decorators: {
                    addClass: "{styles}.title"
                }
            },
            expander: {
                repeatID: "minute",
                type: "fluid.renderer.repeat",
                pathAs: "prediction",
                controlledBy: "predictions",
                tree: {
                    minuteTime: {
                        messagekey: "minuteTime",
                        args: {
                            minutes: "${{prediction}.minutes}"
                        },
                        decorators: {
                            addClass: "{styles}.minuteTime"
                        }
                    },
                    minuteText: {
                        messagekey: "minuteText",
                        decorators: {
                            addClass: "{styles}.minuteText"
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("omw.predictions", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        parentBundle: "{messageBundle}.resolver",
        events: {
            afterFetch: null
        },
        listeners: {
            afterFetch: "{that}.refreshView",
            afterRender: "{that}.afterRender",
            onDestroy: "{that}.hide"
        },
        selectors: {
            message: ".omwc-start-message",
            direction: ".omwc-start-direction"
        },
        styles: {
            message: "omw-start-message",
            direction: "omw-start-direction"
        },
        components: {
            dataSource: {
                type: "omw.dataSource.URL",
                options: {
                    url: "http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=ttc&r=%route&s=%stop",
                    termMap: {
                        route: "%route",
                        stop: "%stop"
                    },
                    dataType: "xml",
                    responseParser: "omw.predictions.responseParser"
                }
            }
        },
        repeatingSelectors: ["direction", "message"],
        protoTree: {
            expander: [{
                repeatID: "message",
                type: "fluid.renderer.repeat",
                pathAs: "message",
                controlledBy: "messages",
                tree: {
                    value: "${{message}}",
                    decorators: {
                        addClass: "{styles}.message"
                    }
                }
            }, {
                repeatID: "direction",
                type: "fluid.renderer.repeat",
                valueAs: "direction",
                controlledBy: "directions",
                tree: {
                    decorators: [{
                        addClass: "{styles}.direction"
                    }, {
                        type: "fluid",
                        func: "omw.direction",
                        options: {
                            model: "{direction}"
                        }
                    }]
                }
            }]
        }
    });

    omw.predictions.responseParser = function (data) {
        var togo = {
            directions: []
        };
        fluid.each($("direction", data), function (direction) {
            direction = $(direction);
            togo.directions.push({
                title: direction.attr("title"),
                predictions: fluid.transform($("prediction", direction), function (prediction) {
                    prediction = $(prediction);
                    return {
                        epochTime: prediction.attr("epochTime"),
                        seconds: prediction.attr("seconds"),
                        minutes: prediction.attr("minutes"),
                        isDeparture: prediction.attr("isDeparture"),
                        branch: prediction.attr("branch"),
                        dirTag: prediction.attr("dirTag"),
                        vehicle: prediction.attr("vehicle"),
                        block: prediction.attr("block"),
                        tripTag: prediction.attr("tripTag")
                    };
                })
            });
        });
        togo.messages = fluid.transform($("message", data), function (message) {
            return $(message).attr("text");
        });
        return togo;
    };

    omw.predictions.preInit = function (that) {
        that.afterRender = function () {
            that.container.show();
        };
        that.refreshView = function () {
            that.refreshView();
        };
        that.hide = function () {
            that.container.hide();
        };
    };

    omw.predictions.finalInit = function (that) {
        that.dataSource.get(that.model, function (data) {
            that.applier.requestChange("directions", data.directions);
            that.applier.requestChange("messages", data.messages);
            that.events.afterFetch.fire();
        });
    };

    fluid.defaults("omw.section", {
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        parentBundle: "{messageBundle}.resolver",
        selectors: {
            input: ".omwc-start-section-input",
            results: ".omwc-start-section-results",
            result: ".omwc-start-section-result"
        },
        styles: {
            input: "omw-start-input",
            result: "omw-start-section-result"
        },
        components: {
            context: {
                type: "fluid.typeFount",
                options: {
                    targetTypeName: "{omw.section}.options.nickName"
                }
            },
            autocomplete: {
                type: "omw.autocomplete",
                container: "{omw.section}.dom.input",
                createOnEvent: "initAutocomplete",
                options: {
                    events: {
                        onMatch: {
                            event: "{omw.section}.events.onResults"
                        }
                    },
                    dataType: "xml"
                }
            },
            results: {
                type: "omw.results",
                container: "{omw.section}.dom.results",
                options: {
                    events: {
                        onResults: {
                            event: "{omw.section}.events.onResults"
                        },
                        onResult: {
                            event: "{omw.section}.events.onResult"
                        }
                    }
                }
            },
            result: {
                type: "omw.result",
                container: "{omw.section}.dom.result",
                options: {
                    model: "{omw.section}.model.result",
                    listeners: {
                        onResultAction: "{omw.section}.events.onResultAction"
                    }
                },
                createOnEvent: "onResult"
            }
        },
        events: {
            onResultAction: null,
            initAutocomplete: null,
            onResult: null,
            afterResult: null,
            onResults: null,
            cleared: null,
            updated: null,
            showOn: null,
            hideOn: null
        },
        listeners: {
            showOn: "{that}.showOn",
            hideOn: "{that}.hideOn",
            cleared: [
                "{that}.cleared",
                "{that}.events.updated.fire"
            ],
            onResultAction: "{that}.onResultAction",
            onResult: [
                "{that}.onResult",
                "{that}.events.afterResult.fire"
            ],
            onResults: "{that}.events.updated.fire",
            prepareModelForRender: "{that}.prepareModelForRender"
        },
        protoTree: {
            result: {
                decorators: [{
                    type: "jQuery",
                    func: "hide"
                }, {
                    addClass: "{styles}.result"
                }]
            },
            results: {
                decorators: {
                    type: "jQuery",
                    func: "hide"
                }
            },
            input: {
                decorators: [{
                    type: "attrs",
                    attributes: {
                        placeholder: "${placeholders.input}"
                    }
                }, {
                    addClass: "{styles}.input"
                }]
            }
        },
        placeholders: {},
        renderOnInit: true,
        showOnInit: true,
        delay: 500
    });

    omw.section.preInit = function (that) {
        that.onResultAction = function () {
            var input = that.locate("input");
            input.parent().show();
            input.focus();
            that.locate("result").hide();
        };
        that.applier.modelChanged.addListener("result", function () {
            var title = fluid.get(that.model, "result.title") || "";
            that.locate("input").val(title);
        });
        that.prepareModelForRender = function () {
            var placeholders = {};
            fluid.each(that.options.placeholders, function (val, key) {
                placeholders[key] = that.options.parentBundle.resolve(val);
            });
            that.applier.requestChange("placeholders", placeholders);
        };
        that.cleared = function () {
            that.locate("results").hide();
        };
        that.onResult = function (result) {
            that.applier.requestChange("result", result);
            that.locate("input").parent().hide();
            that.locate("result").show();
        };
        that.showOn = function () {
            that.container.show();
            that.locate("input").parent().show();
        };
        that.hideOn = function () {
            that.applier.requestChange("result", undefined);
            that.locate("results").hide();
            that.locate("result").hide();
            that.container.hide();
        };
    };

    omw.section.postInit = function (that) {
        if (!that.options.showOnInit) {
            that.container.hide();
        }
        that.locate("input").keydown(function () {
            clearTimeout(that.outFirer);
            that.outFirer = setTimeout(function () {
                if (!that.locate("input").val()) {
                    that.events.cleared.fire();
                }
            }, that.options.delay);
        });
    };

    fluid.demands("omw.result", "routes", {
        options: {
            selectors: {
                map: ".omwc-start-section-result-map",
                expand: ".omwc-start-section-result-expand"
            },
            styles: {
                map: "omw-start-section-result-map",
                expand: "omw-start-section-result-expand",
                expandActive: "omw-start-section-result-expandActive"
            },
            components: {
                dataSource: {
                    type: "omw.dataSource.URL",
                    options: {
                        url: "http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=ttc&terse&r=%route",
                        termMap: {
                            route: "{omw.result}.model.tag"
                        },
                        dataType: "xml",
                        responseParser: "omw.result.responseParser"
                    }
                }
            },
            finalInitFunction: "omw.result.finalInitRoutes",
            produceTree: "omw.result.produceTreeRoutes"
        }
    });

    fluid.defaults("omw.result", {
        parentBundle: "{messageBundle}.resolver",
        gradeNames: ["autoInit", "fluid.rendererComponent"],
        selectors: {
            result: ".omwc-start-section-result-result"
        },
        strings: {},
        events: {
            onResultAction: null
        },
        listeners: {
            onResultAction: "{that}.onResultAction"
        },
        styles: {
            result: "omw-start-section-result-result"
        },
        model: {},
        renderOnInit: true,
        produceTree: "omw.result.produceTree"
    });

    omw.result.preInit = function (that) {
        that.onResultAction = function () {
            that.applier.requestChange("result", undefined);
            that.container.hide();
        };
    };

    omw.result.postInit = function (that) {
        that.container.addClass(that.options.styles.container);
    };

    omw.result.responseParser = function (data) {
        var route = $("route", data),
            stopsData = $("route>stop", data),
            stops = {},
            directionsData = $("route>direction", data);
        fluid.each(stopsData, function (stop) {
            stop = $(stop);
            stops[stop.attr("tag")] = new google.maps.LatLng(parseFloat(stop.attr("lat")), parseFloat(stop.attr("lon")));
        });
        return {
            latMin: parseFloat(route.attr("latMin")),
            latMax: parseFloat(route.attr("latMax")),
            lonMin: parseFloat(route.attr("lonMin")),
            lonMax: parseFloat(route.attr("lonMax")),
            directions: fluid.transform(directionsData, function (direction) {
                direction = $(direction);
                return fluid.transform($("stop", direction), function (stop) {
                    stop = $(stop);
                    return stops[stop.attr("tag")];
                });
            })
        };
    };

    omw.result.produceTreeRoutes = function (that) {
        var tree = omw.result.produceTree(that);
        fluid.merge(null, tree, {
            map: {
                decorators: [{
                    type: "jQuery",
                    func: "hide"
                }, {
                    addClass: "{styles}.map"
                }]
            },
            expand: {
                messagekey: "expand-routes",
                decorators: [{
                    addClass: "{styles}.expand"
                }, {
                    type: "jQuery",
                    func: "click",
                    args: function () {
                        that.loadMap();
                    }
                }]
            }
        });
        return tree;
    };

    omw.result.finalInitRoutes = function (that) {
        that.loadMap = function () {
            that.locate("map").toggle();
            that.locate("expand").toggleClass(that.options.styles.expandActive);
            if (that.map) {
                return;
            }
            that.dataSource.get(null, function (data) {
                var latlngbounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(data.latMin, data.lonMin),
                    new google.maps.LatLng(data.latMax, data.lonMax)
                );
                that.map = new google.maps.Map(that.locate("map")[0], {
                    center: latlngbounds.getCenter(),
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    backgroundColor: "white",
                    disableDefaultUI: true,
                    draggable: false,
                    zoomControl: false
                });
                that.map.fitBounds(latlngbounds);
                fluid.each(data.directions, function (direction) {
                    new google.maps.Polyline({
                        path: direction,
                        strokeColor: "#33B5E5",
                        strokeOpacity: 1,
                        strokeWeight: 2,
                        map: that.map,
                        clickable: false,
                        editable: false,
                    });
                });
            });
        };
    };

    omw.result.produceTree = function (that) {
        return {
            result: {
                value: "${title}",
                decorators: [{
                    addClass: "{styles}.result"
                }, {
                    type: "jQuery",
                    func: "click",
                    args: that.events.onResultAction.fire
                }]
            }
        };
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
            that.container[!data || data.length === 0 ? "hide" : "show"]();
        };
        that.onResult = function () {
            that.applier.requestChange("results", undefined);
            that.refreshView();
            that.container.hide();
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