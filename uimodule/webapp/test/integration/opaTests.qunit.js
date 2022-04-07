/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
    "use strict";

    sap.ui.require(["rosmower/ROSMowerControl/test/integration/AllJourneys"], function () {
        QUnit.start();
    });
});
