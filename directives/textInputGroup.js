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
               readonly : "@",
               required : "@"
            },
            templateUrl: "composer/common/views/textInputGroup.tpl.html",
            controller: TextInputGroupCtrl,
            link : textInputGroupLink
        };

        function textInputGroupLink($scope, $element, $attrs) {
            $scope.inputId = angular.isDefined($attrs.id) ? $attrs.id : "";
            $element.removeAttr("id");
        }

        function TextInputGroupCtrl($scope) {
            var parts = $scope.size ? $scope.size.split(",") : [3,5];
            $scope.labelSize = parts[0];
            $scope.inputSize = parts[1];
        }
    });
