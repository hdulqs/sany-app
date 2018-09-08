/**
 * Created by enchen on 17/2/27.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.ctrip_no_card', {
            url: 'ctrip/no/card',
            cache: false,
            views: {
                'page-content@app': {
                    'templateUrl': 'scripts/pages/expense_report_version/homepage/ctrip_no_card/ctrip.no.card.tpl.html',
                    'controller': 'com.handchina.huilianyi.CtripNoCardController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('home_page');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.huilianyi.CtripNoCardController', ['$scope', '$ionicHistory', 'CompanyConfigurationService',
        function ($scope, $ionicHistory, CompanyConfigurationService) {
            $scope.goBack = function () {
                $ionicHistory.goBack();
            };
            function init() {
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (res) {
                        //获取公司管理员详细信息
                        CompanyConfigurationService.getCompanyAdminInfo(res.companyOID)
                            .then(function (response) {
                                $scope.AdminInfo = response.data;
                            });
                    });
            }
            init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });

        }]);
