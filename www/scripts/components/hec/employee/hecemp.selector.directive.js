/**
 * 类型：combox
 * 经办人
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecempSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                empName:'=',
                companyId:'@',
                readonly: '=',
                type:'='  // 费用申请单/ExpReq   费用报销单/ExpReim   借款申请单/LoanReq
            },
            templateUrl: 'scripts/components/hec/employee/hecemp.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecempSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecempSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecempService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecempService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.emps = [];

            $ionicModal.fromTemplateUrl('hecemp.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.emps = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (emp) {
                $scope.empName = emp.name;
                $scope.selected = emp.employee_id;
                $scope.modal.hide();
            };

            $scope.searchEmp = function () {
                $scope.emps = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecempService.searchKeywords($scope.companyId,$scope.type,page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage= dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.emps = $scope.emps.concat(dataRes.result.record);
                    }else{
                        $scope.emps = [];
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

