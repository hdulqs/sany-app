/**
 * Created by boyce1 on 2016/5/25.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.save_photo', {
            url: '/save/photo',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/settings/photo.setting.html',
                    controller: 'SavePhotoController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('settings');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('SavePhotoController', ['$scope', 'localStorageService', '$ionicHistory', 'ExpenseSheetService', '$state',
        function ($scope, localStorageService, $ionicHistory, ExpenseSheetService, $state) {
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.setting_list');
                }
            };
            $scope.view = {
                IsSavePhoto: function () {
                    if (localStorageService.get('unSavePhoto') == null) {
                        localStorageService.set('unSavePhoto', false);
                    } else {
                        if ($scope.view.enable === false) {
                            localStorageService.set('unSavePhoto', false);
                        } else {
                            localStorageService.set('unSavePhoto', true);
                        }
                    }
                }
            };
            $scope.$on('$ionicView.enter', function () {
                if (localStorageService.get('unSavePhoto') == true) {
                    $scope.view.enable = true;
                } else if (localStorageService.get('unSavePhoto') == false) {
                    $scope.view.enable = false;
                } else {
                    $scope.view.enable = false;
                    localStorageService.set('unSavePhoto', false);
                }
            });
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
        }]);
