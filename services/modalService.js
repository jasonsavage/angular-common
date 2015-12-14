/**
 * @ngdoc service
 * @name composer.common.service:modalService
 */
angular.module("composer.common")

.factory("modalService", function ($q, $modal, $rootScope, $controller, $injector, $timeout) {
    "use strict";

    //public api
    return {
        getModal: getModal,

        //general modals
        loadingModal : loadingModal,
        alertModal : alertModal,
        confirmModal : confirmModal,
        unsavedChangesModal : unsavedChangesModal,
        confirmDeleteModal : confirmDeleteModal,
        reLoginModal : reLoginModal,

        //pre-made modals
        loadWebServiceModal : loadWebServiceModal,
        editRuleActionModal : editRuleActionModal,

        harmonyViewerModal : harmonyViewerModal
    };


    function getModal(config) {
        //wrap the modal instance object so we can use it with promises
        var deferred = $q.defer(),
            modal;

        if(angular.isUndefined(config) || config === null) {
            throw new Error("getModal(): config object is required.");
        }

        var settings = {
            scope: config.scope || $rootScope.$new(),
            backdrop: "static",
            keyboard: false,
            animation : "am-fade-and-slide-top"
        };

        if(angular.isDefined(config.template)) {
            settings.content = config.template;
        }
        else if(angular.isDefined(config.templateUrl)) {
            settings.template = config.templateUrl;
        }

        //create modal
        modal = $modal(settings);

        //add extra helper functions
        modal.accept = modal.$scope.$accept = function (data) {
            modal.hide();
            deferred.resolve(data);
        };
        modal.dismiss = modal.$scope.$dismiss = function (reason) {
            modal.hide();
            deferred.reject(reason);
        };
        modal.result = deferred.promise;

        //call controller on modal
        if(angular.isDefined(config.controller)) {

            var ctrlLocals = {};
            ctrlLocals.$scope = modal.$scope;
            ctrlLocals.$modalInstance = modal;

            if(angular.isDefined(config.resolve)){
                angular.forEach(config.resolve, function (value, key) {
                    ctrlLocals[key] = $injector.invoke(value);
                });
            }
            $controller(config.controller, ctrlLocals);
        }

        //when the route changes, close modal dialog
        var unbindEvent = $rootScope.$on("$stateChangeStart", function () {
            modal.dismiss();
            unbindEvent();
        });

        $timeout(function () {
            //focus on modal after it opens

            if(angular.isDefined(config.focus)) {
                angular.element(".modal .modal-content").find(config.focus).focus();
            } else {
                (angular.element(".modal .modal-content .btn.btn-primary").length > 0 ?
                    angular.element(".modal .modal-content .btn.btn-primary") : angular.element(".modal .modal-content .btn")
                ).focus();
            }
        }, 400);

        return modal;
    }

    function loadingModal(message) {
        message = message || "";
        return getModal({
            templateUrl : "composer/common/views/modalLoading.tpl.html",
            controller : function ($scope) {
                $scope.message = message;
            }
        });
    }

    function alertModal(title, message) {
        return getModal({
            templateUrl : "composer/common/views/modalAlert.tpl.html",
            controller : function ($scope) {
                $scope.title = title;
                $scope.message = message;
            }
        });
    }

    function confirmModal(title, message) {
        return getModal({
            templateUrl : "composer/common/views/modalConfirm.tpl.html",
            controller : function ($scope) {
                $scope.title = title;
                $scope.message = message;
            }
        });
    }





});
