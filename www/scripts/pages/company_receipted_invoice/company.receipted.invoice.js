/**
 * Created by boyce1 on 2016/5/12.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.company_receipted_invoice', {
                url: '/company/receipted/invoice/:companyReceiptedOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/company_receipted_invoice/company.receipted.invoice.html',
                        controller: 'CompanyReceiptedInvoiceController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('company.receipted.invoice');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('CompanyReceiptedInvoiceController', ['$scope', '$state', '$ionicHistory', '$stateParams', '$ionicPopup', '$ionicLoading', '$cordovaClipboard', 'InvoiceService', '$ionicPopover', '$timeout','$filter',
        function ($scope, $state, $ionicHistory, $stateParams, $ionicPopup, $ionicLoading, $cordovaClipboard, InvoiceService, $ionicPopover, $timeout,$filter) {
            $ionicPopover.fromTemplateUrl("scripts/pages/company_receipted_invoice/company.copy.text.html", {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            $scope.view = {
                relativeCompany: [],
                readyCopy: function ($event, data) {
                    $scope.popover.show($event);
                    $scope.popover.scope.value = data

                },
                copyText: function (value) {
                    $scope.popover.hide();
                    $cordovaClipboard.copy(value).then(function () {
                        $ionicLoading.show({
                            template: $filter('translate')('company.Copy.success'),
                            duration: 1500
                        });
                    });
                }
            };
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.company_receipts');
                }
            };
            function init() {
                if ($stateParams.companyReceiptedOID) {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    InvoiceService.getInvoiceInformationByOIDs($stateParams.companyReceiptedOID)
                        .success(function (data) {
                            $ionicLoading.hide();
                            $scope.view.relativeCompany.push(data);
                            $scope.view.companyName = data.companyName;
                        }).error(function (error, status) {
                            $ionicLoading.hide();
                            $ionicLoading.show({
                                template: $filter('translate')('company.Network.failure.please.try.again.later'),
                                duration: 1500
                            });
                    });
                }
            }

            init();
        }]);

