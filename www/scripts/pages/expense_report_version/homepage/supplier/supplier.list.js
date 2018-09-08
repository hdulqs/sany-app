/**
 * Created by Yuko on 16/9/13.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.supplier_list', {
            url: '/supplier/list?pageType',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/expense_report_version/homepage/supplier/supplier.list.tpl.html',
                    controller: 'com.handchina.huilianyi.SupplierSelectorController'
                }
            },
            resolve:{
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    //$translatePartialLoader.addPart('homepage');
                    $translatePartialLoader.addPart('home_page');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.huilianyi.SupplierSelectorController', ['$scope', '$state', 'Principal', '$ionicHistory', '$stateParams', 'TravelERVService', 'ServiceBaseURL', 'FunctionProfileService', '$filter',
        function ($scope, $state, Principal, $ionicHistory, $stateParams, TravelERVService, ServiceBaseURL, FunctionProfileService,$filter) {
            $scope.view = {
                title: null,
                supplierList: [],
                orderTicket: function (supplierOID) {
                    TravelERVService.getSupplierURL(supplierOID, $stateParams.pageType);
                    //.success(function (data) {
                    //    var ref = cordova.InAppBrowser.open(ServiceBaseURL.url + '/jump.html?' + data.url, '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=返回');
                    //    ref.addEventListener('loadstart', inAppBrowserLoadStart);
                    //    ref.addEventListener('exit', inAppBrowserClose);
                    //})
                }
            };
            var init = function () {
                if ($stateParams.pageType === '1002') {
                    $scope.view.title = $filter('translate')('vendor.ticket')/*机票*/;
                } else if ($stateParams.pageType === '1001') {
                    $scope.view.title = $filter('translate')('vendor.hotel')/*酒店*/;
                }
                TravelERVService.getSuppliers()
                    .success(function (data) {
                        for(var i=0; i<data.length; i++){
                            if(!$scope.view.functionProfileList || !$scope.view.functionProfileList['vendor'] || $scope.view.functionProfileList['vendor'].indexOf(data[i].supplyId)!=-1){
                                $scope.view.supplierList.push(data[i])
                            }
                        }
                    })
            };
            init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });
            });
        }]);
