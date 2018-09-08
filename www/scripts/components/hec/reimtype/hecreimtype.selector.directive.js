/**
 * 类型：lov
 * 费用申请单-差旅申请-报销类型
 * data_type传值：
 *   差旅申请行报销类型：report_type
 *   通用申请行报销类型：exp_expense_type
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecreimtypeSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                reimTypeName:'=',
                readonly: '=',
                companyId:'=',
                docTypeId:'=',
                reimDataType:'@' //类型(差旅申请行报销类型：report_type 通用申请行报销类型：exp_expense_type)
            },
            templateUrl: 'scripts/components/hec/reimtype/hecreimtype.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecReimTypeSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecReimTypeSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecReimTypeService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecReimTypeService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $ionicModal.fromTemplateUrl('hecreimtype.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.reimTypes = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (rec) {
                $scope.reimTypeName = rec.expense_type_description;
                $scope.selected = rec.expense_type_id;
                $scope.modal.hide();
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecReimTypeService.searchKeywords($scope.reimDataType,$scope.docTypeId,$scope.companyId, page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.reimTypes = $scope.reimTypes.concat(dataRes.result.record);
                    }else{
                        $scope.reimTypes=[];
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

