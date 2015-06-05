
angular.module("composer.common")
    .filter("capitalize", function () {
        "use strict";
        return function(input) {
            //special case 1
            if (input.toLowerCase() === "id" || input.toLowerCase() === "guid") {
                return input.toUpperCase();
            }
            //special case 2
            if (input.toLowerCase() === "formid") {
                return "ID";
            }

            //snake case
            input = input.replace(/_/g, " ");
            //camel case
            input = input.replace(/([a-z])([A-Z])/g, "$1 $2");

            return input.split(" ").map(function (word) {
                return word.charAt(0).toUpperCase() + word.substr(1);
            }).join(" ");
        };
    });
