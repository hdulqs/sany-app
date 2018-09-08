/**
 * Created by Yuko on 16/6/2.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.help_list', {
            url: '/help/list',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/help/help.list.tpl.html',
                    controller: 'com.handchina.huilianyi.HelpListController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('help.and.feedback');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.huilianyi.HelpListController', ['$scope', '$state', 'Principal','$ionicHistory', 'FunctionProfileService', '$filter',
        function ($scope, $state, Principal,$ionicHistory, FunctionProfileService, $filter) {
            $scope.view = {};
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('tabs.account');
                }
            };
            $scope.goTo = function (name) {
                $state.go(name)
            };
            $scope.contactOnline = function () {
                Principal.identity().then(function (data) {
                    var userInfo = '';
                    if(data.fullName){
                        userInfo += '&c_name=' + data.fullName;
                    }
                    if(data.email){
                        userInfo += '&c_email=' + data.email;
                    }
                    if(data.companyName){
                        userInfo += '&c_org=' + data.companyName;
                    }
                    if(data.login){
                        userInfo += '&c_phone=' + data.login;
                    }
                    if(data.employeeID){
                        userInfo += '&c_desc=' + data.employeeID;
                    }
                    if(data.title){
                        userInfo += '&c_tags=' + data.title;
                    }
                    var partString = 'nonce=cdebd5d13f300170&timestamp=' + Date.parse(new Date()) + '&web_token=' + data.login;
                    var im_user_key = partString + '&85f7f909b3c90f9c8ad154acc5a1935d'
                    var signature = '&signature=' + sha1(im_user_key).toUpperCase();
                    alert('http://huilianyi.udesk.cn/im_client/?transfer=true&' + partString + signature + userInfo)
                    var ref = cordova.InAppBrowser.open('http://huilianyi.udesk.cn/im_client/?transfer=true&' + partString + signature + userInfo, '_blank', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' + $filter('translate')('back.to.HuiLianYi') + ',hardwareback=no');
                    ref.addEventListener('loadstart', inAppBrowserLoadStart);
                    ref.addEventListener('exit', inAppBrowserClose);
                })
            };
            $scope.gettingStart = function () {
                var ref = cordova.InAppBrowser.open('http://i.eqxiu.com/s/HywZtIKI', '_blank',
                    'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' +
                    $filter('translate')('back.to.HuiLianYi'), $filter('translate')('help.feedback.new.guidance'));

                ref.addEventListener('loadstart', inAppBrowserLoadStart);
                ref.addEventListener('exit', inAppBrowserClose);
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });
            });
        }]);
