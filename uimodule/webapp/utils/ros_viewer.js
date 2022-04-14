sap.ui.define([
    "sap/ui/core/Control",
    "rosmower/ROSMowerControl/utils/ros_wrapper",
],
    function (Control, ROS) {
        "use strict";
        return Control.extend("rosmower.ROSMowerControl.utils.ros_viewer", {
            metadata: {
                properties: {
                    "width": {
                        type: "string",
                        defaultValue: "500"
                    },
                    "height": {
                        type: "string",
                        defaultValue: "400"
                    }
                },
                aggregations: {},
                events: {}
            },
            init: function () {

            },

            renderer: {
                render: function (oRm, oControl) {
                    oRm.write("<div");
                    oRm.writeControlData(oControl);
                    oRm.addStyle("width", oControl.getWidth());
                    oRm.addStyle("height", oControl.getHeight());
                    oRm.writeStyles();

                    oRm.write("></div>");

                }
            },

            onBeforeRendering: function () { },
            onAfterRendering: function () {
                this.createViewer();
            },

            createViewer: function () {
                ROS.init3DViewer(this);
            }

        });
    })
