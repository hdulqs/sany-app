/**
 * Created by boyce1 on 2016/5/24.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.setting_list', {
            url: '/setting/list',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/settings/setting.list.tpl.html',
                    controller: 'SettingsListController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('settings');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('SettingsListController', ['$scope', '$ionicHistory', 'localStorageService','LocalStorageKeys', '$state', 'PushService', '$ionicPopup', 'Auth', 'CompanyConfigurationService', '$ionicModal','$sessionStorage','$ionicLoading','$timeout','$translate','$filter','VersionService','$ionicPickerI18n','DatePickI18N',
        function ($scope, $ionicHistory, localStorageService,LocalStorageKeys, $state, PushService, $ionicPopup, Auth, CompanyConfigurationService, $ionicModal,$sessionStorage,$ionicLoading,$timeout,$translate,$filter,VersionService,$ionicPickerI18n, DatePickI18N) {
            $scope.$on('$ionicView.enter', function () {
                $scope.showDidi = false;
                $scope.goTo = function (stateName) {
                    /*if (stateName === 'app.change_password_init') {
                        var mobile = localStorageService.get('username');
                        $state.go(stateName, {'mobile': mobile});
                    } else {
                        $state.go(stateName)
                    }*/
                    if (stateName === 'app.change_password_init') {
                        var mobile = localStorageService.get('username');
                        $state.go(stateName, {'mobile': mobile});
                    } else {
                        $state.go(stateName)
                    }
                };
                CompanyConfigurationService.getCompanyConfiguration().then(function (data) {
                    $scope.configuration = data.configuration.integrations;
                    if ($.inArray(1001, $scope.configuration) > -1) {
                        $scope.showDidi = true;
                    }
                });
            });

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = false;
            });

            $scope.goBack = function () {
                //上一级是tab，设置为根页面
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                var view = $ionicHistory.backView();
                if (view) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.tab_erv.account');
                }
            };
            $scope.view = {
                selectIndex: -1,
                languageName: $sessionStorage.lang,//列表语言
                //语言列表
                languageList: [],
                msIndex: -1//马来语在语言列表里的index
            };

            //$scope.exitAccount = function () {
            //    var confirmPopup = $ionicPopup.confirm({
            //        title: '提示',
            //        template: '<p style="text-align: center">确定要退出吗?</p>',
            //        cancelText: '取消',
            //        cancelType: 'button-calm',
            //        okText: '确定',
            //        cssClass: 'exit-popup'
            //    });
            //    confirmPopup.then(function (res) {
            //        if (res) {
            //            PushService.unRegisterUserDevice();
            //            Auth.logout();
            //            PushService.stopPushService();
            //            PushService.setBadge(0);
            //            $state.go('no_header.login');
            //        } else {
            //        }
            //    });
            //}
            //显示语言modal
            $scope.showLanguage = function () {
                $scope.view.languageList.forEach(function (item, index) {
                    if (item.code.toLowerCase() === $scope.view.languageName.toLowerCase()) {
                        $scope.view.selectIndex = index;
                    }
                });
                $scope.languageModal.show();
            };
            //选择要切换的语言
            $scope.selectLanguageItem = function (item, index) {
                $ionicPopup.confirm({
                    title: $filter('translate')('common.tip'),
                    template: '<p style="text-align: center">'+ $filter('translate')('language_list.whether_change_the_language') +item.value+'?</p>',
                    cancelText: $filter('translate')('common.cancel'),
                    cancelType: 'button-calm',
                    okText:  $filter('translate')('common.ok'),
                    cssClass: 'exit-popup'
                }).then(function (res) {
                    if (res) {
                        VersionService.updateLanguage(item.code)
                            .success(function (data) {
                                if (data.success) {
                                    $scope.view.selectIndex = index;
                                    $scope.view.languageName = item.code.toLowerCase();
                                    $sessionStorage.lang = item.code.toLowerCase();
                                    localStorageService.set('language', item.code.toLowerCase());
                                    //datepick切换相应语言环境
                                    if (item.code.toLowerCase() === 'zh_cn') {
                                        $ionicPickerI18n.weekdays = DatePickI18N.zh_cn.weekdays;
                                        $ionicPickerI18n.months = DatePickI18N.zh_cn.months;
                                        $ionicPickerI18n.ok = DatePickI18N.zh_cn.ok;
                                        $ionicPickerI18n.cancel = DatePickI18N.zh_cn.cancel;
                                        localStorageService.set(LocalStorageKeys.hec_language_code, 'ZHS');
                                        VersionService.updateHecLanguage('ZHS');
                                    } else if (item.code.toLowerCase() === 'en') {
                                        $ionicPickerI18n.weekdays = DatePickI18N.en.weekdays;
                                        $ionicPickerI18n.months = DatePickI18N.en.months;
                                        $ionicPickerI18n.ok = DatePickI18N.en.ok;
                                        $ionicPickerI18n.cancel = DatePickI18N.en.cancel;
                                        localStorageService.set(LocalStorageKeys.hec_language_code, 'US');
                                        VersionService.updateHecLanguage('US');
                                    }
                                    $ionicLoading.show({
                                        template: '<img style="height: 3em" ng-src="img/loading.gif"><br><p>' +
                                        $filter('translate')('language_list.updating.languages_' + item.code) + '...</p>',
                                        noBackdrop: true
                                    });
                                    $scope.getLanguageList(item.code);
                                    $translate.use($scope.view.languageName);
                                    $timeout(function () {
                                        $ionicLoading.hide();
                                        $scope.languageModal.hide();
                                        $translate.refresh();
                                    }, 500)
                                }
                            });
                    }
                });
            };

            //选择语言
            $ionicModal.fromTemplateUrl('scripts/pages/settings/choice.language.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.languageModal = modal;
            });
            $scope.getLanguageList=function(code){
                if(code.toLowerCase()==='zh_cn'){
                    code='zh_CN';
                }
                VersionService.getLanguageList(code)
                    .success(function(data){
                        $scope.view.languageList=angular.copy(data);
                        //支持中文和英文，隐藏掉马来文
                        $scope.view.languageList.forEach(function (item, index) {
                            if (item.code.toLowerCase() === 'ms') {
                                $scope.view.msIndex = index;
                            }
                        });
                        if ($scope.view.msIndex !== -1) {
                            $scope.view.languageList.splice($scope.view.msIndex, 1);
                        }
                    })
            };
            function init() {
                $scope.getLanguageList($sessionStorage.lang);
            }
            init();
        }]);

