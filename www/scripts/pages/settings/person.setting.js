/**
 * Created by boyce1 on 2016/6/21.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.person_setting', {
            url: '/person/setting',
            cache: false,
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/settings/person.setting.html',
                    controller: 'PersonSettingController'
                }
            },
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('settings');
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('PersonSettingController', ['$scope', '$ionicLoading', '$cordovaCamera', '$cordovaImagePicker',
        '$ionicActionSheet', '$ionicPopup', 'Auth', 'PushService', 'Principal', '$ionicHistory', '$state',
        'localStorageService', 'ServiceBaseURL', 'UploadFileService', '$sessionStorage', '$localStorage','$filter',
        function ($scope, $ionicLoading, $cordovaCamera, $cordovaImagePicker, $ionicActionSheet, $ionicPopup, Auth,
                  PushService, Principal, $ionicHistory, $state, localStorageService, ServiceBaseURL, UploadFileService,
                  $sessionStorage, $localStorage,$filter) {
            $scope.view = {
                picFile: {},
                attachmentOID: {},
                noPics: true,
                maxPicCount: 5
            };
            //退出登录
            $scope.exitAccount = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: $filter('translate')('person_js.prompt'),
                    template: "<p style='text-align: center'>" + $filter('translate')('person_js.confirmExit') + "</p>",//确定要退出吗?
                    cancelText: $filter('translate')('person_js.cancel'),
                    cancelType: 'button-calm',
                    okText: $filter('translate')('person_js.ok'),
                    cssClass: 'exit-popup'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        PushService.unRegisterUserDevice();
                        Auth.logout();
                        //PushService.stopPushService();
                        PushService.setBadge(0);
                        $state.go('login', {}, {
                            reload: true
                        });
                        //reset storage
                        $localStorage.$reset();
                        $sessionStorage.$reset();
                        // localStorageService.clearAll();
                        $sessionStorage.isLoginOut = true;
                        //记住登录的手机号
                        localStorageService.set('username', $scope.person.login);
                    } else {
                    }
                });
            };

            //调用摄像选择
            $scope.cameraActionSheet = function () {
                $scope.hideSheet = $ionicActionSheet.show({
                    buttons: [
                        {text: $filter('translate')('person_js.pictures')},
                        {text: $filter('translate')('person_js.Choose.from.the.album')}
                    ],
                    cancelText: $filter('translate')('person_js.cancel'),
                    buttonClicked: function (index) {
                        if (index === 0) {
                            $scope.hideSheet();
                            $scope.takePhoto();
                        } else {
                            $scope.hideSheet();
                            $scope.selectPhotoFromAlbum();
                        }
                    },
                    cancel: function () {
                        $scope.hideSheet();
                    }
                });
            };

            //调用摄像头拍照
            var cameraOptions = {};
            $scope.takePhoto = function () {
                if (device.platform.toLowerCase() === 'android') {
                    cameraOptions = {
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        saveToPhotoAlbum: localStorageService.get('unSavePhoto'),
                        encodingType: Camera.EncodingType.JPEG,
                        quality: 30
                    };
                } else {
                    cameraOptions = {
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType: Camera.PictureSourceType.CAMERA,
                        saveToPhotoAlbum: localStorageService.get('unSavePhoto'),
                        encodingType: Camera.EncodingType.JPEG,
                        quality: 55
                    };
                }
                $cordovaCamera.getPicture(cameraOptions).then(function (imageURL) {
                    var cameraItem = {};
                    cameraItem.OriginSize = '';
                    cameraItem.thumbnailUrl = imageURL;
                    cameraItem.iconUrl = imageURL;
                    cameraItem.deleteFlag = false;
                    $scope.imgUrl = imageURL;
                    $scope.view.photoSrc = cameraItem;
                    $scope.canUpload = true;
                    if ($scope.imgUrl != "img/title-icon.png")
                        $scope.uploadPic($scope.imgUrl);
                });
            };

            //调用相册
            var albumoptions = {};
            $scope.selectPhotoFromAlbum = function () {
                if (device.platform.toLowerCase() === 'android') {
                    albumoptions = {
                        maximumImagesCount: 1,
                        quality: 30
                    };
                } else {
                    albumoptions = {
                        maximumImagesCount: 1,
                        width: 700,
                        height: 700
                    };
                }
                $cordovaImagePicker.getPictures(albumoptions)
                    .then(function (results) {
                        if (results.length > 0) {
                            var albumItem = {};
                            albumItem.OriginSize = '';
                            albumItem.thumbnailUrl = results[0];
                            albumItem.iconUrl = results[0];
                            albumItem.deleteFlag = false;
                            $scope.imgUrl = results[0];
                            $scope.canUpload = true;
                            if ($scope.imgUrl != "img/title-icon.png")
                                $scope.uploadPic($scope.imgUrl);
                        }
                    });
            };
            $scope.uploadPicture = function () {
                $scope.cameraActionSheet();
            };

            $scope.promotion = function (msg) {
                $ionicPopup.alert({
                    title: $filter('translate')('person_js.prompt'),
                    template: msg,
                    okText: $filter('translate')('person_js.ok'),
                    cssClass: 'upload-popup'
                });
            };

            $scope.uploadPicConfig = {
                success: function (data) {
                    var responseContext = JSON && JSON.parse(data.response);
                    var attachments = {
                        attachmentOID: ''
                    };
                    attachments.attachmentOID = responseContext.attachmentOID;
                    if (responseContext.thumbnailUrl) {
                        $scope.thumbnailUrl = responseContext.thumbnailUrl;

                    }
                    if (responseContext.fileURL) {
                        $scope.fileURL = responseContext.fileURL;
                        Principal.changeAvatar(responseContext.fileURL);
                        $scope.imgUrl = null;
                        $scope.imgUrl = responseContext.fileURL;
                        $ionicLoading.show({
                            template: $filter('translate')('person_js.Uploaded.successfully'),
                            duration: 1000
                        });
                    }

                    //init();
                },
                fail: function (error) {
                    $scope.uploadPicConfig.count++;

                    if (error.http_status == null || error.http_status === 504) {
                        if ($scope.uploadPicConfig.count < 3) {
                            $ionicLoading.hide();
                            $ionicLoading.show({
                                template: '<div style="height: 40px;width: 120px;" class="row row-center"><p style="text-align: center;width: 100%;">' + $filter('translate')('person_js.uploading') + '</p></div>',
                                noBackdrop: true,
                                duration: 400
                            });
                            $timeout(function () {
                                $scope.uploadPicConfig.uploadToServer(error.source);
                            }, 500);
                        } else {
                            $ionicLoading.hide();
                            $scope.uploadPicConfig.count = 0;
                            $scope.promotion($filter('translate')('person_js.network'));
                        }
                    } else if (error.http_status === 401) {
                        Auth.refreshToken().then(function (data) {
                            var access_token = localStorageService.get('token').access_token;
                            $scope.uploadPicConfig.headers = {
                                'access_token': access_token,
                                'Authorization': 'Bearer' + access_token
                            };
                            $scope.uploadPicConfig.uploadToServer(error.source);
                        });
                    } else if (error.http_status === 400) {
                        $ionicLoading.hide();
                        $scope.promotion($filter('translate')('person_js.network'));
                    } else {
                        $ionicLoading.hide();
                        if (error.message.indexOf('maximum permitted') != -1) {
                            $scope.promotion($filter('translate')('person_js.Picture.exceeds.the.limit'));
                        } else {
                            $scope.uploadPicConfig.count = 0;
                            $ionicLoading.hide();
                            $scope.promotion($filter('translate')('person_js.Failed.to.upload.again'));
                            //$ionicPopup.alert({
                            //    title: '提示',
                            //    template: '上传失败,请重新上传！'
                            //}).then(function (res) {
                            //    //$ionicHistory.goBack();
                            //});
                        }
                    }
                },
                createImageInvoiceUrl: ServiceBaseURL.url + '/api/contact/add/headPortrait',
                count: 0,
                headers: {},
                params: {},
                uploadToServer: function (source) {
                    UploadFileService.uploadAvatar(source,
                        $scope.uploadPicConfig.createImageInvoiceUrl,
                        $scope.uploadPicConfig.success,
                        $scope.uploadPicConfig.fail,
                        $scope.uploadPicConfig.params,
                        $scope.uploadPicConfig.headers);
                }
            };

            $scope.uploadPic = function (source) {
                var access_token = localStorageService.get('token').access_token;
                $scope.uploadPicConfig.headers = {
                    'access_token': access_token,
                    'Authorization': 'Bearer' + access_token
                };
                $scope.uploadPicConfig.uploadToServer(source);
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });

            var init = function () {

                Principal.identity().then(function (data) {
                    $scope.person = data;
                    if ($scope.person && $scope.person.filePath) {

                        $scope.imgUrl = $scope.person.filePath;
                    } else {
                        $scope.imgUrl = null;
                    }
                });
            };

            init();
        }]);
