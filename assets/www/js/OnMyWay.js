(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("omw");

    fluid.defaults("omw.app", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        contexts: [],
        components: {
            appImpl: {
                type: "omw.app.impl"
            }
        }
    });

    omw.app.preInit = function (that) {
        if (!that.options.contexts) {
            return;
        }
        fluid.each(fluid.makeArray(that.options.contexts), function (context) {
            that[context] = fluid.typeTag(context);
        });
    };

    fluid.defaults("omw.app.impl", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        events: {
            afterFetch: null
        },
        components: {
            urlExpander: {
                type: "omw.urlExpander"
            },
            messageBundle: {
                type: "omw.messageBundle",
                options: {
                    events: {
                        afterFetch: "{omw.app.impl}.events.afterFetch"
                    }
                }
            }/*
,
            arrow: {
                type: "omw.arrow",
                container: ".arrow"
            }
*/
        }
    });

    /*
fluid.defaults("omw.arrow", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        colors: {
            main: "#E92128",
            shadow: "rgba(0, 0, 0, 0.3)"
        }
    });
    omw.arrow.postInit = function (that) {
        var context,
            container = fluid.unwrap(that.container);
        if (container && container.getContext) {
            context = container.getContext("2d");
        }
        that.context = context;
    };
    omw.arrow.finalInit = function (that) {
        var context = that.context;
        context.canvas.width = that.container.width();
        context.canvas.height = that.container.height();

        context.fillStyle = context.strokeStyle = that.options.colors.main;
        context.lineWidth = 1;
        context.lineJoin = content.lineCap = "round";

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(context.canvas.width, 0);
        context.lineTo(context.canvas.width / 2, context.canvas.height - 15);
        context.lineTo(0, 0);
        context.fill();
        context.stroke();
        context.closePath();

        context.shadowOffsetX = context.shadowOffsetY = 5;
        context.shadowBlur = 10;
        context.shadowColor = that.options.colors.shadow;
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(context.canvas.width / 2, context.canvas.height - 15);
        context.lineTo(context.canvas.width, 0);
        context.fill();
    };
*/

})(jQuery, fluid);