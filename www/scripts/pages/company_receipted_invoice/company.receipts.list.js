/**
 * Created by boyce1 on 2016/5/23.
 */
/**
 * Created by boyce1 on 2016/5/12.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.company_receipts', {
                url: '/company/receipts',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/company_receipted_invoice/company.receipts.list.html',
                        controller: 'CompanyReceiptsInvoiceController'
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
    .controller('CompanyReceiptsInvoiceController', ['$scope','$ionicHistory', '$state', 'InvoiceService', '$timeout','$ionicLoading',
        'ParseLinks', 'PublicFunction','$filter', 'localStorageService',
        function ($scope,$ionicHistory, $state, InvoiceService, $timeout,$ionicLoading, ParseLinks, PublicFunction,$filter, localStorageService) {
            $scope.view = {
                allCompanys: [],
                selfCompany: null,  //自己公司的开票抬头
                isHasCompany: true,
                page: 0,
                size: 20,
                lastPage: 0,
                loadMore: function (page) {
                    $scope.view.page = page;
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                    InvoiceService.getInvoiceInformation(page, $scope.view.size)
                        .success(function (data, status, headers) {
                            $ionicLoading.hide();
                            if(page === 0){
                                $scope.view.lastPage = ParseLinks.parse(headers('link')).last;
                                if (data.length === 0) {
                                    $scope.view.isHasCompany = false;
                                }
                            }

                            var userOID = localStorageService.get('userInfo').userOID;
                            if(!userOID){
                                Principal.identity().then(function (data) {
                                    userOID = data.userOID;
                                });
                            }
                            InvoiceService.getUserInfoNew(userOID).success(function (res) {
                                if(res.corporationOID){ //如果当前员工的法人实体存在
                                    //根据法人实体获取开票信息
                                    InvoiceService.getInvoiceInformationByOIDs(res.corporationOID).success(function (selfCompany) {
                                        $scope.view.selfCompany = selfCompany;
                                        //将员工的法人实体从所有法人实体中删除掉
                                        if( data.length > 0){
                                            for (var i = 0; i < data.length; i++) {
                                                if(data[i].companyReceiptedOID !== selfCompany.companyReceiptedOID){
                                                    $scope.view.allCompanys.push({
                                                        companyReceiptedOID: data[i].companyReceiptedOID,
                                                        companyName: data[i].companyName
                                                    });
                                                }
                                            }
                                            if($scope.view.allCompanys.length){
                                                $scope.count = $scope.view.allCompanys.length;
                                            }else{
                                                $scope.count = 0;
                                            }
                                        }
                                    });
                                }else {//如果当前员工的法人实体不存在
                                    $scope.view.selfCompany = {
                                        enable: false,
                                        hasNoCompany: true
                                    } ;
                                    //将所有法人实体推入到allCompanys数组中
                                    if( data.length > 0){
                                        for (var i = 0; i < data.length; i++) {
                                            $scope.view.allCompanys.push({
                                                companyReceiptedOID: data[i].companyReceiptedOID,
                                                companyName: data[i].companyName
                                            });
                                        }
                                    }
                                    if($scope.view.allCompanys.length){
                                        $scope.count = $scope.view.allCompanys.length;
                                    }else{
                                        $scope.count = 0;
                                    }
                                }
                            })
                        })
                        .error(function () {
                            $ionicLoading.hide();
                            PublicFunction.showToast($filter('translate')('company.error'));
                        })
                        .finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });
                }
            };
            // $scope.$on('$ionicView.enter', function () {
            //     $ionicLoading.show({
            //         template: '<img style="height: 3em" ng-src="img/loading.gif">',
            //         noBackdrop: true
            //     });
            //     InvoiceService.getInvoiceInformation()
            //         .success(function (data) {
            //             $ionicLoading.hide();
            //             for (var i = 0; i < data.length; i++) {
            //                 $scope.view.allCompanys.push(data[i]);
            //             }
            //             $scope.view.isHasCompany = $scope.view.allCompanys.length > 0;
            //         });
            // });
            $scope.showCompanyDetails = function (company) {
                $state.go('app.company_receipted_invoice', {
                    company: company,
                    companyReceiptedOID: company.companyReceiptedOID
                })
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = false;
            });
            $scope.goBack = function(){
                //上一级是tab，设置为根页面
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $ionicHistory.goBack();
            };
            var init = function () {
                $scope.view.loadMore(0);
            }
            init();


        }])

