angular.module("composer.common")

    .filter("truncate", function () {
        "use strict";

        return function (input, length ) {
            length = length || 0;
            input = "" + input; //to string

            return (input.length <= length) ? input : input.substring(0, length) + "...";
        };
    }
)
