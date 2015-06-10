angular.module("composer.common")

    .directive("tablePagination", function (utilityService) {
        "use strict";

        return {
            restrict: "E",
            replace : true,
            scope : {
                //A tableService api object
                api : "="
            },
            templateUrl: "composer/common/views/tablePagination.tpl.html",
            link: PaginationCtrl
        };

        function PaginationCtrl($scope) {

            var api = $scope.api;

            //view variables
            $scope.pages = [];

            //watchers
            $scope.$watch("api.pageSize", update);
            $scope.$watch("api.totalRows", update);

            //view methods
            $scope.gotoPage = function (page) {
                //make sure page is within min and max and we're not already on this page
                if (utilityService.clamp(page, 0, api.pageTotal-1) === page && page !== api.page) {
                    api.page = page;
                    api.updateTableRows();
                }
            };

            function update() {
                //get total pages
                api.pageTotal = (api.totalRows < api.pageSize) ? 1 : Math.ceil(api.totalRows/api.pageSize);

                //check if current page is valid
                var page = utilityService.clamp(api.page, 0, api.pageTotal-1);
                if(page !== api.page) {
                    api.page = page;
                    api.updateTableRows();
                }

                //update view
                $scope.pages.length = 0;
                for(var i = 0; i < api.pageTotal; i++) {
                    $scope.pages[i] = i;
                }
            }
        }
    });
