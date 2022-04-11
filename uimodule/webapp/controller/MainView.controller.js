sap.ui.define([
    "./BaseController",
    "rosmower/ROSMowerControl/utils/ros_wrapper",
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ROS, Fragment) {
        "use strict";

        return Controller.extend("rosmower.ROSMowerControl.controller.MainView", {
            onInit: function () {
                ROS.initROS(this);
            },

            onMessagePopoverPress : function (oEvent) {
                var oSourceControl = oEvent.getSource();
                this._getMessagePopover().then(function(oMessagePopover){
                    oMessagePopover.openBy(oSourceControl);
                });
            },
		//################ Private APIs ###################

		_getMessagePopover : function () {
			var oView = this.getView();

			// create popover lazily (singleton)
			if (!this._pMessagePopover) {
				this._pMessagePopover = Fragment.load({
					id: oView.getId(),
					name: "rosmower.ROSMowerControl.fragment.MessagePopover"
				}).then(function (oMessagePopover) {
					oView.addDependent(oMessagePopover);
					return oMessagePopover;
				});
			}
			return this._pMessagePopover;
		}            

            
        });
    });
