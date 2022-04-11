sap.ui.define([
    "./BaseController",
    "rosmower/ROSMowerControl/utils/ros_wrapper"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ROS) {
        "use strict";

        return Controller.extend("rosmower.ROSMowerControl.controller.MainView", {
            onInit: function () {
                ROS.initROS(this);
            },

            
        });
    });
