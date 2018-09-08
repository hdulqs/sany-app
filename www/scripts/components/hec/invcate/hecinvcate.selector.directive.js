/**
 * 类型：combox
 * 费用账本--发票类型
 * Created by changyu.duan on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecinvcateSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                invCateName:'=',
                authFlag:'=?',
                invoiceType:'=?',
                invoiceCategoryCode:'=?',
                readonly: '='
            },
            templateUrl: 'scripts/components/hec/invcate/hecinvcate.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecinvcateSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecinvcateSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecinvcateService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecinvcateService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.invcates = [];

            $ionicModal.fromTemplateUrl('hecinvcate.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.invcates = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (invcate) {
                $scope.invCateName = invcate.invoice_category_name;
                $scope.selected = invcate.invoice_category_id;
                $scope.authFlag = invcate.authenticating_flag;
                $scope.invoiceType = invcate.invoice_type;
                $scope.invoiceCategoryCode = invcate.invoice_category_code;
                $scope.modal.hide();
            };

            $scope.searchUnit = function () {
                $scope.invcates = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                var q = HecinvcateService.searchKeywords(page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage  = dataRes.result.pageCount;
                    if ($scope.lastPage  > 0) {
                        $scope.invcates = $scope.invcates.concat(dataRes.result.record);
                    }else{
                        $scope.invcates = [];
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
        }
    ]);

