angular.module("composer.common")

    .directive("tableSortableHeader", function () {
        "use strict";

        return {
            restrict: "A",
            replace : true,
            transclude : true,
            scope : {
                //A tableService api object
                api : "=",
                property : "@"
            },
            templateUrl: "composer/common/views/tableSortableHeader.tpl.html",
            link: TableSortableHeaderCtrl
        };

        function TableSortableHeaderCtrl($scope) {

            var api = $scope.api;

            $scope.sortOrder = "";

            $scope.updateSort = function() {
                //toggle sort
                $scope.sortOrder = ($scope.sortOrder === "desc") ? "asc" : ($scope.sortOrder === "asc") ? "" : "desc";

                //apply sort to table rows
                api.sortRows($scope.property, $scope.sortOrder);
            };
        }
    });
