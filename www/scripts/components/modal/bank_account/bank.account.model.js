/**
 * Created by Yuko on 16/12/23.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('bankAccountSelector', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                bankAccountNo: '=',
                userOid: '=',
                name: '=',
                title: '=',
                prompt: '='

            },
            templateUrl: 'scripts/components/modal/bank_account/bank.account.model.html',
            controller: 'com.handchina.huilianyi.BankAccountSelectorController'
        }
    }])
    .controller('com.handchina.huilianyi.BankAccountSelectorController', ['$scope', '$ionicModal', 'CompanyService', 'ParseLinks', 'Principal', 'CustomApplicationServices',
        function ($scope, $ionicModal, CompanyService, ParseLinks, Principal, CustomApplicationServices) {
            $scope.view = {
                page: 0,
                size: 20,
                lastPage: 0,
                bankAccountList: [],
                cancel: function () {
                    $scope.bankAccountNo = $scope.defaultBankAccountNo;
                    $scope.selected = $scope.defaultSelected ;
                    $scope.modal.hide();
                },
                selectCorporationEntity: function(item){
                    $scope.bankAccountNo = item.bankAccountNo;
                    $scope.selected = item.contactBankAccountOID;
                    $scope.modal.hide();
                },
                loadMore: function(page){
                    $scope.view.page = page;
                    if(page === 0){
                        $scope.view.bankAccountList = [];
                    }
                    if($scope.view.lastPage >= page){
                        CompanyService.getUserBankAccountList($scope.userOid, page, $scope.view.size)
                            .success(function (data, status, headers) {
                                $scope.total = headers('x-total-count');
                                if (page === 0) {
                                    $scope.view.lastPage = ParseLinks.parse(headers('link')).last;
                                }
                                if (data.length > 0) {
                                    for (var i = 0; i < data.length; i++) {
                                        $scope.view.bankAccountList.push(data[i]);
                                    }
                                }else{
                                    $scope.adminList = [];
                                    Principal.identity().then(function (data) {
                                        CustomApplicationServices.getAdminList(data.companyOID, 0, 3)
                                            .success(function (data) {
                                                $scope.adminList = data;
                                            })
                                    })
                                }
                            })
                            .finally(function () {
                                $scope.$broadcast('scroll.infiniteScrollComplete');
                            });
                    }

                }
            }
            $ionicModal.fromTemplateUrl('bank.account.selector.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.defaultBankAccountNo = angular.copy($scope.bankAccountNo);
                $scope.defaultSelected = angular.copy($scope.selected);
                $scope.view.loadMore(0);
                $scope.modal.show();
            };
        }]);
