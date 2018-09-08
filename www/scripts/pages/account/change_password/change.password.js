/**
 * Created by Ting on 2016/2/18.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.change_password_init', {
                cache: false,
                url: '/change/password/init',
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/account/change_password/change.password.init.tpl.html',
                        controller: 'ChangePasswordInitController'
                    }
                },
                resolve:{
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        //$translatePartialLoader.addPart('homepage');
                        $translatePartialLoader.addPart('account');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('ChangePasswordInitController', ['$scope','$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout',
        function ($scope,  $filter,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout) {
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.setting_list');
                }
            };
            var pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;

            $scope.changePassword = {
                submitted: false,
                changePassword: function (valid) {
                    $scope.changePassword.submitted = true;
                    if (!valid) {
                        return;
                    }
                    if ($scope.changePassword.newPassword !== $scope.changePassword.confirmNewPassword) {
                        $ionicLoading.show({
                            template:  $filter('translate')('account.two.passwords.are.not.consistent')/*两次密码不一致*/,
                            duration: '1000'
                        });
                        return;
                    } if ($scope.changePassword.newPassword.match(pattern) === null) {
                        $ionicLoading.show({
                            template:$filter('translate')('account.please.input.6-20.letters.and.numbers')/*请输入6-20字母与数字组合!*/,
                            duration: '1000'
                        });
                    } else {
                        $scope.showLoading();
                        //在MainAppController中，已经定义了该函数，可以重用
                        $scope.passwordNotMatched = false;
                        Auth.changePassword($scope.changePassword.oldPassword, $scope.changePassword.newPassword)
                            .success(function () {
                                $ionicLoading.hide();
                                $ionicLoading.show({
                                    template:$filter('translate')('account.password.modification.success') /*密码修改成功*/,
                                    duration: '1000'
                                });
                                $timeout(function () {
                                    $scope.goBack();
                                }, 500);

                            })
                            .error(function (error, status) {
                                $ionicLoading.hide();
                                if (status === 400
                                    && error.validationErrors
                                    && error.validationErrors.length > 0) {
                                    if (error.validationErrors[0].message === 'Incorrect old password') {
                                        $ionicLoading.show({
                                            template:$filter('translate')('account.old.password.error') /*旧密码错误*/,
                                            duration: '1000'
                                        });
                                    }
                                } else if(status === -1){
                                    $ionicLoading.show({
                                        template: $filter('translate')('error.network.error.check.network.settings')/*网络出错啦!请检查网络设置*/,
                                        duration: '1000'
                                    });
                                } else {
                                    $ionicLoading.show({
                                        template: $filter('translate')('error.error')/*出错了*/,
                                        duration: '1000'
                                    });
                                }
                            });
                    }
                }
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });

        }]);
