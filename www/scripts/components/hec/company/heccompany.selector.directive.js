/**
 * 类型：lov
 * 公司
 * Created by zong.liu on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('heccompanySelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected:'=',
                companyName:'=',
                readonly: '=',
                employeeId:'=',
                unitId:'=?',
                unitName:'=?',
                positionId:'=?',
                respCenterId:'=?',
                respCenterName:'=?',
                functionCry:'=?'
            },
            templateUrl: 'scripts/components/hec/company/heccompany.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.heccompanySelectorController'
        }
    })
    .controller('com.handchina.hly.dialog.heccompanySelectorController', [
        '$scope', '$http', '$ionicModal',  'HecCompanyService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal, HecCompanyService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {
            $scope.searchKeyword = {value:""};
            $scope.size = LocalStorageKeys.hec_pagesize;
            $scope.companies = [];

            $ionicModal.fromTemplateUrl('heccompany.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.openDialog = function () {
                $scope.modal.show();
                $scope.companies = [];
                $scope.searchKeyword.value = "";
                $scope.loadMore(1);
            };

            $scope.selectItem = function (company) {
                $scope.companyName = company.company_short_name;
                $scope.selected = company.company_id;
                $scope.functionCry = company.functional_currency_code;
                $scope.unitId = company.unit_id;
                $scope.unitName = company.unit_name;
                $scope.positionId = company.position_id;
                $scope.respCenterId = company.responsibility_center_id;
                $scope.respCenterName = company.responsibility_center_name;
                $scope.modal.hide();
            };

            $scope.searchCompany = function () {
                $scope.companies = [];
                $scope.loadMore(1);
            };

            $scope.loadMore = function (page) {
                $scope.page = page;
                var q = HecCompanyService.searchKeywords($scope.searchKeyword.value,$scope.employeeId, page, $scope.size);
                q.then(function (res) {
                    var dataRes = angular.fromJson(res.data);
                    $scope.lastPage = dataRes.result.pageCount;
                    if ($scope.lastPage > 0) {
                        $scope.total = 1;
                        $scope.companies = $scope.companies.concat(dataRes.result.record);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }else{
                        $scope.total = 0;
                    }
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

