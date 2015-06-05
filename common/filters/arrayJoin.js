angular.module("composer.common")

    .filter("arrayJoin", function () {
        "use strict";

        return function (input, separator ) {
            input = angular.isArray(input) ? input : [input];
            return input.join(separator);
        };
    }
)
