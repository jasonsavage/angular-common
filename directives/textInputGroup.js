angular.module("composer.common")

    .directive("textInputGroup", function () {
        "use strict";

        return {
            restrict: "E",
            replace: true,
            scope : {
                property : "@",
                ngModel : "=",
                size : "@",
                readonly : "@"
            },
            templateUrl: "composer/common/views/textInputGroup.tpl.html",
            controller: TextInputGroupCtrl
        };

        function TextInputGroupCtrl($scope) {
            var parts = $scope.size ? $scope.size.split(",") : [3,5];
            $scope.labelSize = parts[0];
            $scope.inputSize = parts[1];
        }
    });
