angular.module("composer.common")

    .factory("signalService", function(){
        "use strict";

        var slotMapping = {};

        return {

            signal : function (name){
                return createSignal(name);
            },

            connect : function (name, slotFn) {
                if(!slotMapping.hasOwnProperty(name)){
                    slotMapping[name] = [];
                }
                slotMapping[name].push(slotFn);
            }
        };

        function createSignal(name) {
            return {
                name : name,
                notify : function (result) {
                    slotMapping[name].forEach(function (fn) {
                        result = fn(result);
                    });
                }
            };
        }
    });
