sap.ui.define([
    "./BaseController"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("rosmower.ROSMowerControl.controller.MainView", {
            onInit: function () {
                this.initROS();
            },

            initROS: function () {

                var ros = new ROSLIB.Ros({
                    url: 'ws://192.168.178.68:8080'
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


                this.initSubscribers(ros);

            },

            initSubscribers: function (ros) {
                var that = this;

                // Register subscribers
                var ROSmodel = this.getModel("ROS");

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
                            var ROSmodel = that.getModel("ROS");
                            // get JSON object of this subscriber
                            var subscribe_to = ROSmodel.getProperty("/ROS/subscribers" + listener.name);
                            // add new content 
                            // remove the oldest entry, if necessary
                            if (subscribe_to.data.length >= subscribe_to.queueLength) {
                               subscribe_to.data.splice(0,1); 
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

            }

        });
    });
