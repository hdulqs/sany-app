/**
 * Created by hly on 2016/11/25.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('selectDestination', function () {
        return {
            restrict: 'E',
            scope: {
                title: '=',
                city: '='
            },
            templateUrl: 'scripts/components/directive/select_destination/select.destination.directive.html',
            controller: 'com.huilianyi.SelectDestinationController'
        }
    })
    .controller('com.huilianyi.SelectDestinationController', ['$scope', 'CompanyConfigurationService', '$ionicModal','$filter',
        function ($scope, CompanyConfigurationService, $ionicModal,$filter) {
            $scope.options = {  // 城市搜索配置项
                highlightFirst: true,
                onSelect: function (item) {
                    $scope.view.keyword = item.value;
                    $scope.view.selectedCity = item.value;
                }
            };
            $scope.view = {
                keyword: '',
                hotCity: [
                    {
                        areaCode: 'CHN031000000',
                        value: $filter('translate')('destination_js.Shanghai')//上海
                    },
                    {
                        areaCode: 'CHN011000000',
                        value: $filter('translate')('destination_js.Beijing')//北京
                    },
                    {
                        areaCode: 'CHN081000000',
                        value: $filter('translate')('destination_js.HongKong')//香港
                    },
                    {
                        areaCode: 'CHN044003000',
                        value: $filter('translate')('destination_js.Shenzhen')//深圳
                    },
                    {
                        areaCode: 'CHN044001000',
                        value: $filter('translate')('destination_js.Guangzhouo')//广州
                    },
                    {
                        areaCode: 'CHN032002000',
                        value: $filter('translate')('destination_js.Wuxi')//无锡
                    },
                    {
                        areaCode: 'CHN043001000',
                        value: $filter('translate')('destination_js.Changsha')//长沙
                    },
                    {
                        areaCode: 'CHN042001000',
                        value: $filter('translate')('destination_js.Wuhan')//武汉
                    }],
                loadMore: function () {
                    CompanyConfigurationService.getCitiesByKeyword($scope.view.keyword).then(function (data) {
                        $scope.view.hotCity = [];
                        angular.forEach(data, function (item) {
                            $scope.view.hotCity.push({areaCode: item.code, value: item.name});
                        });
                    });
                },
                openCity: function () {
                    $scope.view.keyword = '';
                    $scope.selectCity.show();
                },
                clearKeyword: function () {
                    $scope.view.keyword = '';
                    //$scope.view.page.lastPage=0;
                },
                closeCity: function (item) {
                    $scope.city=item;
                    $scope.selectCity.hide();

                }
            };
            //选择城市
            $ionicModal.fromTemplateUrl('select.destination.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.selectCity = modal;
            });
             $scope.$watch('view.keyword', function (newValue, oldValue) {
                if (newValue !== oldValue && newValue !== '') {
                    $scope.view.loadMore();
                } else if (newValue === '') {
                    $scope.view.hotCity = [{areaCode: 'CHN031000000', value: $filter('translate')('destination_js.Shanghai')}, {//上海
                        areaCode: 'CHN011000000',
                        value: $filter('translate')('destination_js.Beijing')//北京
                    }, {areaCode: 'CHN081000000', value: $filter('translate')('destination_js.HongKong')},/*香港*/ {areaCode: 'CHN044003000', value: $filter('translate')('destination_js.Shenzhen')},/*深圳*/ {areaCode: 'CHN044001000', value: $filter('translate')('destination_js.Guangzhou')},/*广州*/ {
                        areaCode: 'CHN032002000', value: $filter('translate')('destination_js.Wuxi')/*无锡*/
                    }, {areaCode: 'CHN043001000', value: $filter('translate')('destination_js.Changsha')},/*长沙*/ {areaCode: 'CHN042001000', value: $filter('translate')('destination_js.Wuhan')}];/*武汉*/
                }
            });
        }]);
