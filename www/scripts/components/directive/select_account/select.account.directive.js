/**
 * Created by hly on 2016/12/9.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('selectAccount', function () {
        return {
            restrict: 'E',
            scope: {
                accountData: '=',
                readOnly:'='
            },
            templateUrl: 'scripts/components/directive/select_account/select.account.directive.html',
            controller: 'huilianyi.selectAccountController'
        }
    })
    .controller('huilianyi.selectAccountController', ['$scope', 'InvoiceService', 'ParseLinks', 'PublicFunction', '$ionicScrollDelegate', '$ionicModal','$filter',
        function ($scope, InvoiceService, ParseLinks, PublicFunction, $ionicScrollDelegate, $ionicModal,$filter) {
            $scope.view = {
                page: {
                    current: 0,
                    size: 10,
                    lastPage: 0
                },
                nothing:false,
                accountList: [],
                openModal: function () {
                    $scope.accountModal.show();
                    $scope.view.loadMore(0);
                },
                doRefresh: function () {
                    $scope.view.nothing=false;
                    $scope.view.current = 0;
                    $scope.view.accountList = [];
                    $scope.view.loadMore(0);
                },
                loadMore: function (page) {
                    $scope.view.current = page;
                    if (page === 0) {
                        $scope.view.accountList = [];
                        $scope.view.page.lastPage = 0;
                        $ionicScrollDelegate.scrollTop();
                    }
                    InvoiceService.getInvoiceInformation(page, $scope.view.size)
                        .success(function (data, status, headers) {
                            if (data.length > 0) {
                                $scope.view.nothing=false;
                                $scope.view.page.lastPage = ParseLinks.parse(headers('link')).last;
                                data.forEach(function (item) {
                                    $scope.view.accountList.push(item);
                                });
                            }else{
                                if(page===0){
                                    $scope.view.nothing=true;
                                }
                            }
                        })
                        .error(function () {
                            PublicFunction.showToast($filter('translate')('account_js.Make.a.mistake'));//出错了
                        })

                },
                selectItem: function (item) {
                    $scope.accountData.acceptAccountName = item.companyName;
                    $scope.accountData.acceptAccount = item.cardNumber;
                    $scope.accountData.acceptBankName = item.accountBank;
                    $scope.accountModal.hide();
                }
            };
            $ionicModal.fromTemplateUrl('select.account.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.accountModal = modal;
            })
        }]);
