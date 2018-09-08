/**
 * 类型：lov
 * 币种（人民币后端返回的code是CNY，前端自动转为RMB显示）
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('heccrySelector', function () {
        return {
            restrict: 'E',
            scope: {
                isRed:"@",
                selected: '=',
                promptName:'@',//receipt:收款币种
                readonly: '='
            },
            templateUrl: 'scripts/components/hec/cry/heccry.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HeccrySelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HeccrySelectorController', [
        '$scope', '$http', '$ionicModal',  'HeccryService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HeccryService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.searchKeyword = {value:""};
            $scope.size = LocalStorageKeys.hec_pagesize;
            if($scope.promptName=='receipt'){
                $scope.cryPrompt= $filter('translate')('hec_lov.collection.currency.prompt');
            }else{
                $scope.cryPrompt= $filter('translate')('hec_lov.input.cry.prompt');
            }
            $scope.crys = [];

            $ionicModal.fromTemplateUrl('heccry.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.searchKeyword.value = "";
                $scope.crys = [];
                $scope.loadMore(1,$scope.searchKeyword);
            };

            $scope.selectItem = function (cry) {
                $scope.selected = cry.currency_code;
                if(cry.currency_code == "CNY"){
                    $scope.cryCode = "RMB";
                }else{
                    $scope.cryCode = cry.currency_code;
                }
                $scope.modal.hide();
            };

            $scope.searchCry = function () {
                $scope.crys = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                    var q = HeccryService.searchKeywords($scope.searchKeyword.value, page, $scope.size);
                    q.then(function (res) {
                        var dataRes = angular.fromJson(res.data);
                        $scope.lastPage = dataRes.result.pageCount;
                        if ($scope.lastPage > 0) {
                            $scope.crys = $scope.crys.concat(dataRes.result.record);
                        }else{
                            $scope.crys=[];
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

