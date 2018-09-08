/**
 * Created by Yuko on 16/7/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.tab_erv.account', {
            url: '/account',
            cache: false,
            views: {
                'tab-erv-account': {
                    templateUrl: 'scripts/pages/expense_report_version/my_account/my.account.tpl.html',
                    controller: 'com.handchina.hly.ErvAccountController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('my_account');
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.hly.ErvAccountController', ['$scope', 'Principal', 'CompanyConfigurationService', '$state', 'UserService', 'localStorageService', 'FunctionProfileService', '$filter',
        function ($scope, Principal, CompanyConfigurationService, $state, UserService, localStorageService, FunctionProfileService, $filter) {
            $scope.view = {
                showHelpMenu: false //显示帮助菜单
            };
            $scope.goTo = function (stateName) {
                $state.go(stateName);
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });

                FunctionProfileService.getCompanyVendor().then(function (data) {
                    // 获取公司开通的服务，返回服务代号
                    angular.forEach(data, function (value, key) {
                        if(value === 1002 || value===1008){ // 1002：携程,// 1008：订餐小秘书
                            $scope.orderAuth = true;
                        }
                    })
                })
            });
            $scope.contactOnline = function () {
                var userInfo = '';
                if($scope.person.fullName){
                    userInfo += '&c_name=' + $scope.person.fullName;
                }
                if($scope.person.email){
                    userInfo += '&c_email=' + $scope.person.email;
                }
                if($scope.person.companyName){
                    userInfo += '&c_org=' + $scope.person.companyName;
                }
                if($scope.person.login){
                    userInfo += '&c_phone=' + $scope.person.login;
                }
                if($scope.person.employeeID){
                    userInfo += '&c_desc=' + $scope.person.employeeID;
                }
                if($scope.person.title){
                    userInfo += '&c_tags=' + $scope.person.title;
                }
                var partString = 'nonce=cdebd5d13f300170&timestamp=' + Date.parse(new Date()) + '&web_token=' + $scope.person.login;
                var im_user_key = partString + '&85f7f909b3c90f9c8ad154acc5a1935d';
                var signature = '&signature=' + sha1(im_user_key).toUpperCase();

                var ref = cordova.InAppBrowser.open('http://huilianyi.udesk.cn/im_client/?' + partString + signature + userInfo,
                    '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' +
                    $filter('translate')('my.back.to.HuiLianYi') + ',hardwareback=no',
                    $filter('translate')('my.Online.customer.service'));

                ref.addEventListener('loadstart', inAppBrowserLoadStart);
                ref.addEventListener('exit', inAppBrowserClose);
            };
            var init = function () {
                $scope.showAccountBind = false;
                Principal.identity().then(function (data) {
                    $scope.person = data;
                    if ($scope.person && $scope.person.filePath) {
                        $scope.imgUrl = $scope.person.filePath;
                    } else {
                        $scope.imgUrl = null;
                    }
                });
                CompanyConfigurationService.getCompanyConfiguration().then(function (data) {
                    $scope.configuration = data.configuration.integrations;
                    if ($.inArray(1001, $scope.configuration) > -1) {
                        $scope.showAccountBind = true;
                    }
                    if (data.configuration.menuList && data.configuration.menuList.length > 0) {
                        var index = $.inArray(1001, data.configuration.menuList);
                        if (index > -1) {
                            $scope.view.showHelpMenu = true;
                        } else {
                            $scope.view.showHelpMenu = false;
                        }
                    }
                });
            };
            init();
        }]);
