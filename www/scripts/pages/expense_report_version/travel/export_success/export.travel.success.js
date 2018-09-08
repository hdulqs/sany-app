/**
 * Created by Yuko on 16/8/8.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.erv_travel_export_success', {
                url: '/erv/travel/export/success?applicationOID',
                cache: false,
                params: {
                    expense: null
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/travel/export_success/export.travel.success.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvTravelExportSuccessController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        return $translate.refresh();
                    }]
                }
            })

    }])
    .controller('com.handchina.huilianyi.ErvTravelExportSuccessController', ['$scope', '$state', '$stateParams',
        function ($scope, $state, $stateParams) {
            $scope.goExpense = function(){
                $state.go('app.tab_erv.expense_report');
            };
            $scope.goOrder = function(){
                $state.go('app.erv_travel_has_pass', {applicationOID: $stateParams.applicationOID});
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
        }]);
