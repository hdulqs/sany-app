/**
 * 类型：combox
 * 借款申请单--行--借款类型
 * Created by rong.hu on 2017/10/23.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecloantypeSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                loanTypeName:'=',
                reqTypeId:'=',
                readonly: '=',
            },
            templateUrl: 'scripts/components/hec/loantype/hecloantype.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecLoanTypeSelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.HecLoanTypeSelectorController', [
        '$scope', '$http', '$ionicModal',  'HecLoanTypeService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecLoanTypeService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.nothing = false;
            $ionicModal.fromTemplateUrl('hecloantype.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.loanTypes = [];
                $scope.nothing = false;
                $scope.loadMore(1);
            };

            $scope.selectItem = function (loanType) {
                $scope.loanTypeName = loanType.description;
                $scope.selected = loanType.csh_transaction_class_code;
                $scope.modal.hide();
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecLoanTypeService.searchKeywords($scope.reqTypeId,page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.nothing = false;
                        $scope.loanTypes = $scope.loanTypes.concat(dataRes.result.record);
                    }else{
                        $scope.nothing = true;
                        $scope.loanTypes=[];
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

