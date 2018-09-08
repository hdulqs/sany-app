'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.feedback', {
                url: '/feedback',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/feedback/feedback.html',
                        controller: 'com.handchina.huilianyi.FeedbackController'
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
    .controller('com.handchina.huilianyi.FeedbackController', ['$scope', '$state', '$timeout', 'ParseLinks', '$cordovaImagePicker',
        'FeedbackService', '$ionicModal', 'ServiceBaseURL', '$ionicLoading', '$ionicPopup', 'localStorageService', '$ionicHistory','$filter',
        function ($scope, $state, $timeout, ParseLinks, $cordovaImagePicker, FeedbackService, $ionicModal,
                  ServiceBaseURL, $ionicLoading, $ionicPopup, localStorageService, $ionicHistory,$filter) {
            //ionicMaterialInk.displayEffect();
            $scope.data = {
                model: "",
                appVersion: "",
                deviceVersion: "",
                platform: "",
                message: null,
                picFiles: [],
                attachmentOIDs: [],
                noPics: true,
                maxPicCount: 5
            };
            $scope.view = {
                viewPicture: null
            };
            $scope.showSuccessNote = function () {
                var Pop = $ionicPopup.alert({
                    title: $filter('translate')('help.feedback.prompt'),
                    template: '<p style="text-align: center">' + $filter('translate')('help.feedback.success') + '</p>'
                });
                Pop.then(function (res) {
                    if (res) {
                        $scope.goBack();
                    }
                });
            };
            $scope.$on("$ionicView.enter", function () {
                $scope.data.model = ionic.Platform.device().model;
                $scope.data.deviceVersion = ionic.Platform.device().version;
                $scope.data.platform = ionic.Platform.device().platform;
                $scope.data.message = null;
                $scope.data.picFiles = [];
                $scope.data.attachmentOIDs = [];
                // $scope.data.appVersion = AppVersion.version;
                $scope.data.appVersion = localStorageService.get('welcomeVersion');
            });
            //上传图片配置
            $scope.uploadPicConfig = {
                success: function (data) {
                    var attachment = JSON.parse(data.response);
                    $scope.data.attachmentOIDs.push(attachment.attachmentOID);
                    if ($scope.data.attachmentOIDs.length == $scope.data.picFiles.length) {
                        FeedbackService.sendMessage($scope.data.attachmentOIDs, $scope.data.model, $scope.data.deviceVersion, $scope.data.appVersion, $scope.data.platform, $scope.data.message)
                            .success(function (data) {
                                $ionicLoading.hide();
                                $scope.showSuccessNote();
                            }).error(function (error, msg) {
                            $ionicLoading.show({
                                template: $filter('translate')('help.feedback.Network.failure.please.try.again.later'),
                                duration: '1000'
                            });
                        });
                    }
                },
                error: function (error, msg) {
                    $ionicLoading.show({
                        template: $filter('translate')('help.feedback.Network.failure.please.try.again.later'),
                        duration: '1000'
                    });
                },
                headers: {}
            };
            $scope.sendFeedback = function () {
                if ($scope.data.message == null || $scope.data.message == "") {
                    $ionicLoading.show({
                        template: $filter('translate')('help.feedback.Please.fill.out.the.feedback.information.thank.you'),
                        duration: '1000'
                    });
                } else {
                    var access_token = localStorageService.get('token').access_token;
                    $scope.uploadPicConfig.headers = {
                        'access_token': access_token,
                        'Authorization': 'Bearer' + access_token
                    };
                    var files = $scope.data.picFiles;
                    angular.forEach(files, function (fileUrl) {
                        $scope.data.noPics = false;
                        FeedbackService.uploadFile(fileUrl, $scope.uploadPicConfig.success, $scope.uploadPicConfig.error, $scope.uploadPicConfig.headers);

                    });
                    if ($scope.data.noPics) {
                        FeedbackService.sendMessage($scope.data.attachmentOIDs, $scope.data.model, $scope.data.deviceVersion, $scope.data.appVersion, $scope.data.platform, $scope.data.message)
                            .success(function (data) {
                                $scope.showSuccessNote();
                            }).error(function (error, msg) {
                            $ionicLoading.show({
                                template: $filter('translate')('help.feedback.Network.failure.please.try.again.later'),
                                duration: '1000'
                            });
                        });
                    }
                }
            };

            //add picture ,the max count o picture is maxPicCount
            var albumoptions = {};
            $scope.addFiles = function () {
                if (device.platform.toLowerCase() === 'android') {
                    albumoptions = {
                        maximumImagesCount: $scope.data.maxPicCount,
                        quality: 75
                    };
                } else {
                    albumoptions = {
                        maximumImagesCount: $scope.data.maxPicCount,
                        width: 700,
                        height: 700
                    };
                }
                $cordovaImagePicker.getPictures(albumoptions)
                    .then(function (results) {
                        for (var i = 0; i < results.length; i++) {
                            if ($scope.data.picFiles.length >= $scope.data.maxPicCount) {
                                break;
                            } else {
                                $scope.data.picFiles.push(results[i]);
                            }
                        }
                    }, function (error) {
                    });
            };
            //放大图片
            $ionicModal.fromTemplateUrl('scripts/pages/help/feedback/feedback.picture.view.html', {
                scope: $scope,
                animation: "slide-in-up"
            }).then(function (modal) {
                $scope.modal = modal;
            });
            $scope.openModal = function () {
                $scope.modal.show();
            };
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            $scope.showPicture = function (fileUrl) {
                $scope.view.viewPicture = fileUrl;
                $scope.openModal();
            };
            $scope.removePic = function (file) {
                var index = $scope.data.picFiles.indexOf(file);
                $scope.data.picFiles.splice(index, 1);
            };
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.help_list');
                }
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
        }]);
