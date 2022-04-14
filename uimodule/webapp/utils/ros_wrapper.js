sap.ui.define([], function () {
    "use strict";
    var ros
    return {

        initROS: function (oController) {
            var ROSmodel = oController.getModel("ROS");
            var ros_master_url = ROSmodel.getProperty("/ROS/master/url");
            ros = new ROSLIB.Ros({
                url: ros_master_url
            });

            ros.on('connection', function () {
                console.log('Connected to websocket server.');
            });

            ros.on('error', function (error) {
                console.log('Error connecting to websocket server: ', error);
            });

            ros.on('close', function () {
                console.log('Connection to websocket server closed.');
            });

            this.initSubscribers(ros, oController);
            this.initPublisher(ros, oController);

        },

        initSubscribers: function (ros, oController) {
            // Register subscribers
            var ROSmodel = oController.getModel("ROS");

            // Loop through all subscribers according JSON model
            for (var element in ROSmodel.getProperty("/ROS/subscribers")) {
                // get current subscribe definition from JSON model
                var subscribe_to = ROSmodel.getProperty("/ROS/subscribers/" + element);

                // define subscriber definition and function
                // store everything as function block in JSON model
                subscribe_to.listener = function () {
                    // define listener
                    var listener = new ROSLIB.Topic({
                        ros: ros,
                        name: subscribe_to.Topic,
                        messageType: subscribe_to.messageType
                    });

                    // define callback function for new messages
                    listener.subscribe(function (message) {
                        // get JSON model to store data
                        var ROSmodel = oController.getModel("ROS");
                        // get JSON object of this subscriber
                        var subscribe_to = ROSmodel.getProperty("/ROS/subscribers" + listener.name);
                        // add new content 
                        // remove the oldest entry, if necessary
                        if (subscribe_to.data.length >= subscribe_to.queueLength) {
                            subscribe_to.data.splice(0, 1);
                        }
                        subscribe_to.data.push(message);

                        // write back to JSON model to trigger refresh
                        ROSmodel.setProperty("/ROS/subscribers" + listener.name, subscribe_to);

                    });
                }
                // after everything has been defined as function block, we need to call it once to
                // activate/register everything
                subscribe_to.listener();

            };

        },

        initPublisher: function (ros, oController) {
            // Register publisher
            var ROSmodel = oController.getModel("ROS");

            // Loop through all publisher according JSON model
            for (var element in ROSmodel.getProperty("/ROS/publisher")) {
                // get current publisher definition from JSON model
                var publish_to = ROSmodel.getProperty("/ROS/publisher/" + element);

                publish_to.publisher = new ROSLIB.Topic({
                    ros: ros,
                    //name: publish_to.Topic,
                    name : '/e_stop',
                    messageType: publish_to.messageType
                });
            }
        },

        init3DViewer: function (oControl) {
            // Create the main viewer.
            var viewer = new ROS3D.Viewer({
                divID: oControl.sId,
                width: oControl.getWidth(),
                height: oControl.getHeight(),
                antialias: true
            });

            // Add a grid.
            viewer.addObject(new ROS3D.Grid());

            var ROSmodel = oControl.getModel("ROS");
            var tf = ROSmodel.getProperty("/ROS/3DViewer/tf");
            // Setup a client to listen to TFs.
            var tfClient = new ROSLIB.TFClient({
                ros: ros,
                angularThres: 0.01,
                transThres: 0.01,
                rate: 10.0,
                fixedFrame: tf.fixedFrame
            });

            // Loop through all subscribers according JSON model
            for (var element in ROSmodel.getProperty("/ROS/3DViewer/subscribers")) {
                // get current subscribe definition from JSON model
                var subscribe_to = ROSmodel.getProperty("/ROS/3DViewer/subscribers/" + element);

                subscribe_to.listener = function () {

                    switch (subscribe_to.messageType) {
                        case "sensors_msgs/LaserScan":
                            var scanclient = new ROS3D.LaserScan({
                                ros: ros,
                                topic: subscribe_to.Topic,
                                tfClient: tfClient,
                                rootObject: viewer.scene,
                                material: { size: 0.05, color: 0xaf00ff }
                            });
                            break;
                    }
                }
                subscribe_to.listener();
            }
            // put your data functions here
        }
    }
});