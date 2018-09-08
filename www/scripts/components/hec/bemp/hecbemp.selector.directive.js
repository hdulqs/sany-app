/**
 * 类型：lov
 * 币种（人民币后端返回的code是CNY，前端自动转为RMB显示）
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecbempSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=?',
                empName:'=',
                idCard:'=?',
                mobilePhone:'=?',
                empId:'=?',
                promptName:'=?',
                readonly: '='
            },
            templateUrl: 'scripts/components/hec/bemp/hecbemp.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecbempSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecbempSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecbempService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecbempService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.searchKeyword = {value:""};
            $scope.size = LocalStorageKeys.hec_pagesize;
            if(!$scope.promptName){
                $scope.promptName = $filter('translate')('hec_lov.input.bemp.prompt');
                $scope.showTextFlag = false;
            }else{
                $scope.showTextFlag = true;
            }
            $scope.bemps = [];

            $ionicModal.fromTemplateUrl('hecbemp.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.searchKeyword.value = "";
                $scope.bemps = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (bemp) {
                $scope.selected = bemp.employee_code;
                $scope.empName = bemp.name;
                $scope.idCard = bemp.id_code;
                $scope.mobilePhone = bemp.mobil;
                $scope.empId = bemp.employee_id;
                $scope.modal.hide();
            };

            $scope.searchBemp = function () {
                $scope.bemps = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecbempService.searchKeywords($scope.searchKeyword.value, page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage  = dataRes.result.pageCount;
                    if ($scope.lastPage  > 0) {
                        $scope.bemps = $scope.bemps.concat(dataRes.result.record);
                    }else{
                        $scope.bemps = [];
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

