(function (fluid, $) {

    "use strict";

    var eUC = "encodeURIComponent:";

    fluid.registerNamespace("omw");

    fluid.defaults("omw.urlExpander", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        vars: {
            webapp: ".."
        }
    });
    omw.urlExpander.finalInit = function (that) {
        that.expand = function (url) {
            return fluid.stringTemplate(url, that.options.vars);
        };
    };

    fluid.defaults("omw.messageBundle", {
        gradeNames: ["autoInit", "fluid.eventedComponent"],
        events: {
            afterFetch: null
        },
        lang: "en",
        components: {
            resolver: {
                type: "fluid.messageResolver",
                options: {
                    messageBase: "{omw.messageBundle}.messageBase"
                },
                createOnEvent: "afterFetch"
            },
            messageBaseDataSource: {
                type: "omw.dataSource.URL",
                options: {
                    url: "%webapp/bundle/%lang.json",
                    termMap: {
                        lang: "%lang"
                    }
                }
            }
        }
    });
    omw.messageBundle.finalInit = function (that) {
        that.messageBaseDataSource.get({
            lang: that.options.lang
        }, function (data) {
            if (data.isError) {
                fluid.log(data.message);
            }
            that.messageBase = data;
            that.events.afterFetch.fire();
        });
    };

    fluid.defaults("omw.dataSource", {
        gradeNames: ["autoInit", "fluid.littleComponent"],
        components: {
            urlExpander: "{urlExpander}"
        },
        invokers: {
            get: "omw.dataSource.get",
            resolveUrl: "omw.dataSource.resolveUrl"
        },
        nickName: "dataSource",
        termMap: {},
        writable: false
    });

    omw.dataSource.preInit = function (that) {
        that.nickName = "dataSource";
        if (that.options.writable) {
            that.options.invokers.set = "omw.dataSource.set";
        }
    };

    fluid.defaults("omw.dataSource.URL", {
        gradeNames: ["omw.dataSource", "autoInit"],
        preInitFunction: "omw.dataSource.preInit",
        dataType: "json"
    });

    fluid.demands("omw.dataSource.get", "omw.dataSource.URL", {
        funcName: "omw.dataSource.URL.method",
        args: [
            "{dataSource}.options.dataType",
            "{dataSource}.options.responseParser",
            "{dataSource}.resolveUrl",
            "{arguments}.0",
            "{arguments}.1",
            "GET"
        ]
    });

    fluid.demands("omw.dataSource.set", "omw.dataSource.URL", {
        funcName: "omw.dataSource.URL.method",
        args: [
            "{dataSource}.options.dataType",
            "{dataSource}.options.responseParser",
            "{dataSource}.resolveUrl",
            "{arguments}.0",
            "{arguments}.2",
            "POST",
            "{arguments}.1",
        ]
    });

    fluid.demands("omw.dataSource.resolveUrl", null, {
        args: [
            "{urlExpander}.expand",
            "{dataSource}.options.url",
            "{dataSource}.options.termMap",
            "{arguments}.0"
        ]
    });

    omw.dataSource.URL.method = function (dataType, responseParser, resolveUrl, directModel, callback, httpMethod, model) {
        var ajaxOpts = {
            type: httpMethod,
            url: resolveUrl(directModel),
            dataType: dataType,
            success: function (data) {
                if (responseParser) {
                    data = typeof responseParser === "string" ? fluid.invokeGlobalFunction(responseParser, [data]) : responseParser(data);
                }
                callback(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                callback({
                    isError: true,
                    message: textStatus
                });
            }
        };
        if (model) {
            ajaxOpts.data = model;
        }
        $.ajax(ajaxOpts);
    };

    omw.dataSource.resolveUrl = function (expand, url, termMap, directModel) {
        var map = fluid.copy(termMap);
        map = fluid.transform(map, function (entry) {
            var encode = false;
            if (entry.indexOf(eUC) === 0) {
                encode = true;
                entry = entry.substring(eUC.length);
            }
            if (entry.charAt(0) === "%") {
                entry = fluid.get(directModel, entry.substring(1));
            }
            if (encode) {
                entry = encodeURIComponent(entry);
            }
            return entry;
        });
        var replaced = fluid.stringTemplate(url, map);
        replaced = expand(replaced);
        return replaced;
    };

})(fluid, jQuery);