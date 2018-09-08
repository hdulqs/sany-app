/**
 * 类型：combox
 * 费用账本--发票项目
 * Created by changyu.duan on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecinvitemSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                invItemName:'=',
                readonly: '=',
                expenseItemId:'=',
                invItemCode:'=',
                invCateName:'=?',
                invCateCode:'=?',
                authFlag:'=?',
                invoiceType:'=?',
                oldValue:'=?',
                mustInvoiceItems:'@'
            },
            templateUrl: 'scripts/components/hec/invitem/hecinvitem.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecinvitemSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecinvitemSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecinvitemService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecinvitemService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.invitems = [];
            $scope.trip = $filter('translate')('hec_common.please.select.one');

            $ionicModal.fromTemplateUrl('hecinvitem.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.invitems = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (invitem) {
                $scope.invItemName = invitem.invoice_category_name;
                $scope.selected = invitem.invoice_category_id;
                $scope.invItemCode=invitem.invoice_category_code;
                $scope.modal.hide();
            };

            $scope.searchUnit = function () {
                $scope.invitems = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecinvitemService.searchKeywords($scope.expenseItemId, page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.invitems = $scope.invitems.concat(dataRes.result.record);
                    }else{
                        $scope.invitems = [];
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }, function (error) {
                    // 如果是搜索结果为空,结束搜索,否则提示报错
                    if (error === 'keywords.is.ambiguous') {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        PublicFunction.showToast($filter('translate')('hec_common.searchError'));  // 加载失败
                    }
                });
            };

            //监听费用类型发生改变清空原来的发票项目
            $scope.$watch(function () {
                return $scope.expenseItemId;
            },function (n,o) {
                if( n != o) {
                    $scope.invItemName="";
                    $scope.invItemCode="";
                    $scope.selected="";
                    $scope.init();
                }
            });

            $scope.init = function () {
                $scope.list = [];
                var q = HecinvitemService.searchKeywords($scope.expenseItemId, 1, 10);
                q.then(function (res) {
                    $scope.list = res.data.result.record;
                    if(Array.isArray($scope.list) && $scope.list.length ==1){
                        $scope.invItemName = $scope.list[0].invoice_category_name;
                        $scope.selected = $scope.list[0].invoice_category_id;
                        $scope.invItemCode= $scope.list[0].invoice_category_code;
                    }else if(!$scope.list){
                        $scope.list = [];
                        $scope.trip = $filter('translate')('hec_common.nothing');
                        if(!$scope.oldValue){
                            $scope.invCateName =  $filter('translate')('hec_common.other');
                            $scope.invCateCode = "OTHER";
                            $scope.authFlag = 'N';
                            $scope.invoiceType = "OTHER";
                        }
                    }
                },function (error) {

                });
            };
            $scope.init();
        }
    ]);

