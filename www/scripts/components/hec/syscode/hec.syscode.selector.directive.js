/**
 * 类型：combox
 * system_code传值：
 *   待遇级别类型：TREAMENT_LEVEL_TYPE
 *   是否园区入驻：SETTLED_PARK
 *   机票供应商：AIRPLANE_VENDER
 *   酒店供应商：HOTEL_VENDER
 *   业务属性：BUSINESS_ATTRIBUTE
 *   收款对象：PAYMENT_OBJECT1
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecSyscodeSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                sysCodeName:'=?',
                sysCodeId:'=?',
                sysCodeType:'@', //类型(待遇级别类型：TREAMENT_LEVEL_TYPE 是否园区入驻：SETTLED_PARK 机票供应商：AIRPLANE_VENDER 酒店供应商：HOTEL_VENDER 业务属性：BUSINESS_ATTRIBUTE 收款对象：PAYMENT_OBJECT1)
                readonly: '='
            },
            templateUrl: 'scripts/components/hec/syscode/hec.syscode.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecSyscodeSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecSyscodeSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecSyscodeService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecSyscodeService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.dataList = [];
            $scope.itemPrompt = "";

            $ionicModal.fromTemplateUrl('hec.syscode.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                console.log("sysCodeType ===== "+$scope.sysCodeType);
                if($scope.sysCodeType === "SETTLED_PARK"){
                    $scope.itemPrompt = $filter('translate')('hec_combox.input.park.prompt');
                }else if($scope.sysCodeType === "TREATMENT_LEVEL_TYPE"){
                    $scope.itemPrompt = $filter('translate')('hec_combox.input.treament.level.type.prompt');
                }else if($scope.sysCodeType === "AIRPLANE_VENDER"){
                    $scope.itemPrompt = $filter('translate')('hec_combox.input.airplane.vender.prompt');
                }else if($scope.sysCodeType === "HOTEL_VENDER"){
                    $scope.itemPrompt = $filter('translate')('hec_combox.input.hotel.vender.prompt');
                }else if($scope.sysCodeType === "BUSINESS_ATTRIBUTE"){
                    $scope.itemPrompt = $filter('translate')('hec_combox.input.business.attribute.prompt');
                }else if($scope.sysCodeType === "PAYMENT_OBJECT1"){
                    $scope.itemPrompt = $filter('translate')('hec_combox.input.payment.object.prompt');
                }
                $scope.modal = modal;
            });

            $scope.openDialog = function () {

                $scope.modal.show();
                $scope.dataList = [];
                $scope.loadMore(1);
            };

            $scope.selectItem = function (data) {
                $scope.sysCodeName = data.code_value_name;
                $scope.selected = data.code_value;
                $scope.sysCodeId = data.code_value_id;
                $scope.modal.hide();
            };

            $scope.searchUnit = function () {
                $scope.dataList = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecSyscodeService.searchKeywords($scope.sysCodeType,page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.dataList = $scope.dataList.concat(dataRes.result.record);
                    }else{
                        $scope.dataList = [];
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

