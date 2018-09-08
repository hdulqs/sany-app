/**
 * Created by Yuko on 16/7/10.
 */
angular.module('huilianyi.pages')
    .directive('uploadImage', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                headerId: '=',
                attachmentSrc: '=',
                uploadFinish: '=?',
                maxLength: '=?',
                typeName: '@?',
                readOnlyFlag: "@?"
            },
            link: function ($scope, element, attrs) {
            },
            templateUrl: 'scripts/components/modal/upload_picture/upload.picture.tpl.html',
            controller: 'com.handchina.hly.UploadPictureController'
        }
    }])
    /*允许图片缩放的轮播图*/
    .directive('zoomSlider', ['$ionicModal', '$timeout', '$ionicScrollDelegate', 'PublicFunction', function ($ionicModal, $timeout, $ionicScrollDelegate, PublicFunction) {
        return {
            restrict: 'A',
            controller: controller,
            link: link
        };

        function controller($scope) {
            var zoomStart = false;
            $scope.hideAll = false;
            $scope.slides = [];
            $scope.currentImage = function(index){
                $scope.selectedSlide = index;
            }
            $scope.showImages = function (idx, fileId) {
                if ($scope.attachmentSrc && $scope.attachmentSrc.length) {
                    $scope.slides = [];
                    var index = "";
                    if (PublicFunction.isNull(fileId)) {
                        index = idx;
                    } else {
                        //attachmentSrc数组中可能有图片和文件，只需要把图片放在轮播组件中
                        for (var i = 0; i < $scope.attachmentSrc.length; i++) {
                            if ($scope.attachmentSrc[i].Imagetype == "0") {
                                $scope.slides.push($scope.attachmentSrc[i]);
                            }
                        }

                        //根据fileId获取slides的数组下标
                        for (var i = 0; i < $scope.slides.length; i++) {
                            if ($scope.slides[i].attachmentOID == fileId) {
                                index = i;
                                break;
                            }
                        }
                    }

                    if (!PublicFunction.isNull(index)) {
                        $scope.selectedSlide = index;
                        /*打开展示轮播图片的modal*/
                        $scope.loadModal();
                    }
                }
            };

            /*监听开始缩放事件，隐藏navigation bar*/
            $scope.$on('ZoomStarted', function (e) {
                //console.log('监听开始缩放事件');
                $timeout(function () {
                    zoomStart = true;
                    $scope.hideAll = true;
                });
            });
            /*监听图片的单击事件*/
            $scope.$on('TapEvent', function (e) {
                //console.log('监听图片的单击事件');
                $timeout(function () {
                    _onTap();
                },400);
            });
            /*监听图片的双击事件*/
            $scope.$on('DoubleTapEvent', function (event, position) {
                //console.log('监听图片的双击事件');
                $timeout(function () {
                    _onDoubleTap(position);
                },400);
            });

            /*在缩放开始后，点击图片，图片变为原来大小，否则，只打开或影藏navigation bar*/
            var _onTap = function _onTap() {
                if (zoomStart === true) {
                    $ionicScrollDelegate.$getByHandle('slide-' + $scope.selectedSlide).zoomTo(1, true);
                    $timeout(function () {
                        _isOriginalSize();
                    }, 300);
                    return;
                }

                if (($scope.hasOwnProperty('ionSliderToggle') && $scope.ionSliderToggle === false && $scope.hideAll === false) || zoomStart === true) {
                    return;
                }
                $scope.hideAll = !$scope.hideAll;
            };
            /*如果未缩放图片，那么双击图片，放大图片三倍，如果在缩放图片过程中双击图片，调用单击函数，还原图片尺寸*/
            var _onDoubleTap = function _onDoubleTap(position) {
                if (zoomStart === false) {
                    $ionicScrollDelegate.$getByHandle('slide-' + $scope.selectedSlide).zoomTo(2, true, position.x, position.y);
                    zoomStart = true;
                    $scope.hideAll = true;
                } else {
                    _onTap();
                }
            };

            /*切换图片尺寸到初始大小*/
            function _isOriginalSize() {
                zoomStart = false;
                _onTap();
            }
        }

        /*在link中加载modal*/
        function link(scope, element, attrs) {
            //var _modal;
            scope.loadModal = function () {
                $ionicModal.fromTemplateUrl('scripts/components/modal/upload_picture/gallery.zoom.slide.tpl.html', {
                    scope: scope,
                    animation: 'fade-in'
                }).then(function (modal) {
                    scope.modal = modal;
                    scope.openModal();
                });
            };

            scope.openModal = function () {
                scope.modal.show();
            };

            scope.closeModal = function () {
                scope.modal.hide();
            };

            scope.$on('$destroy', function () {
                try {
                    //暂时注释掉，不然会报 can not read property 'remove' of undefined
                    //scope.modal.remove();
                } catch (err) {
                    console.log(err.message);
                }
            });
        }
    }])
    .controller('com.handchina.hly.UploadPictureController', ['$scope', '$ionicLoading', '$ionicHistory', '$state',
        '$ionicActionSheet', '$cordovaCamera', '$cordovaImagePicker', 'ImgSizeConvertService', '$ionicPopup',
        'Auth', 'localStorageService', 'UploadFileService', '$filter', '$rootScope', 'HecImageService', 'PublicFunction',
        function ($scope, $ionicLoading, $ionicHistory, $state, $ionicActionSheet, $cordovaCamera, $cordovaImagePicker, ImgSizeConvertService,
                  $ionicPopup, Auth, localStorageService, UploadFileService, $filter, $rootScope, HecImageService, PublicFunction) {
            $rootScope.waitingAttachments = {};//用rootScope 记录正在上传的附件的进度
            $scope.isShowAddBtn = true;
            $scope.maxlength = 0;
            $scope.deleteImage = deleteImage;
            if ($scope.maxLength === undefined) {
                $scope.maxlength = 9;
            } else {
                $scope.maxlength = $scope.maxLength;
            }
            $scope.isShowAddBtn = $scope.attachmentSrc.length < $scope.maxlength ? true : false;
            var cameraOptions = {};
            var albumoptions = {};
            $scope.view = {
                isSaveToPhotoAlbum: false,
                cameraActionSheet: function () {
                    /*if($scope.initFlag){
                     PublicFunction.showToast($filter('translate')('message.error.save.data.first'));
                     return;
                     }*/
                    $scope.hideSheet = $ionicActionSheet.show({
                        cssClass:"hec-ActionSheet",
                        buttons: [
                            {text: $filter('translate')('upload_js.take.pictures.and.compress')},//拍照并且压缩
                            {text: $filter('translate')('upload_js.Taking.pictures')},//拍照
                            {text: $filter('translate')('upload_js.choose.from.album.and.compress')},//从相册中选择并且压缩
                            {text: $filter('translate')('upload_js.Choose.from.the.album')}//从相册中选择
                        ],
                        buttonClicked: function (index) {
                            if (index === 0 || index === 1) {
                                $scope.hideSheet();
                                if ($scope.attachmentSrc.length < $scope.maxlength) {
                                    $scope.view.takePhoto(index);
                                } else {
                                    $ionicLoading.show({
                                        template: $filter('translate')('upload_js.Photos.over.limit'),//照片数量超过限制！
                                        duration: 1500
                                    });
                                }
                            } else {
                                $scope.hideSheet();
                                if ($scope.attachmentSrc.length < $scope.maxlength) {
                                    $scope.view.selectPhotoFromAlbum(index);
                                } else {
                                    $ionicLoading.show({
                                        template: $filter('translate')('upload_js.Photos.over.limit'),//照片数量超过限制！
                                        duration: 1500
                                    });
                                }
                            }
                        }
                    });
                },
                takePhoto: function (index) {
                    /*var androidQuality = 60;
                    var iosQuality = 50;
                    if (index == 0) {
                        //如果是拍照并压缩
                        androidQuality = 40;
                        iosQuality = 30;
                    }*/
                    var androidQuality = 80;
                    var iosQuality = 70;
                    if (index == 0) {
                        //如果是拍照并压缩
                        androidQuality = 70;
                        iosQuality = 60;
                    }
                    if (localStorageService.get('unSavePhoto')) {
                        $scope.view.isSaveToPhotoAlbum = localStorageService.get('unSavePhoto')
                    } else {
                        $scope.view.isSaveToPhotoAlbum = false;
                    }
                    if (device.platform.toLowerCase() === 'android') {
                        cameraOptions = {
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            saveToPhotoAlbum: $scope.view.isSaveToPhotoAlbum,
                            encodingType: Camera.EncodingType.JPEG,
                            quality: androidQuality,
                            allowEdit: false,
                            targetWidth:1500,//宽度(必须设置，不然上传的图片会大于1M，设置之后，上传的图片小于100kb，好神奇)
                            targetHeight:1000//高度
                        };
                    } else {
                        cameraOptions = {
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            saveToPhotoAlbum: $scope.view.isSaveToPhotoAlbum,
                            encodingType: Camera.EncodingType.JPEG,
                            quality: iosQuality,
                            correctOrientation: true,
                            allowEdit: false,
                            targetWidth:1500,
                            targetHeight:1000
                        };
                    }
                    $cordovaCamera.getPicture(cameraOptions).then(function (imageURL) {
                        var cameraItem = {};
                        cameraItem.OriginSize = '';
                        cameraItem.thumbnailUrl = imageURL;
                        cameraItem.fileURL = imageURL;
                        cameraItem.isDeleted = false;
                        cameraItem.attachmentOID = -1;
                        cameraItem.uuid = randomUUID();//前台用于识别照片,将上传进度与照片关联
                        //刚拍完照,取得的进度设为0
                        if ($rootScope.waitingAttachments) {
                            $rootScope.waitingAttachments[cameraItem.uuid] = 0;
                        }
                        cameraItem.finished = false;
                        cameraItem.Imagetype = 0;
                        $scope.uploadFinish = false;
                        $scope.attachmentSrc.push(cameraItem);
                        $scope.view.uploadImage($scope.attachmentSrc.length - 1, cameraItem.uuid);
                    });
                },
                selectPhotoFromAlbum: function (index) {
                    /*var androidQuality = 60;
                    var iosQuality = 50;
                    if (index == 2) {
                        //从相册中选择并且压缩
                        androidQuality = 50;
                        iosQuality = 40;
                    }*/
                    var androidQuality = 80;
                    var iosQuality = 70;
                    if (index == 2) {
                        //从相册中选择并且压缩
                        androidQuality = 70;
                        iosQuality = 60;
                    }
                    var maximumImagesCount = $scope.maxlength - $scope.attachmentSrc.length;
                    if (device.platform.toLowerCase() === 'android') {
                        albumoptions = {
                            maximumImagesCount: maximumImagesCount,
                            quality: androidQuality,
                            width:1500,
                            height:1000
                        };
                    } else {
                        albumoptions = {
                            maximumImagesCount: maximumImagesCount,
                            quality: iosQuality,
                            correctOrientation: true,
                            width:1500,
                            height:1000
                        };
                    }
                    $cordovaImagePicker.getPictures(albumoptions)
                        .then(function (results) {
                            if (results.length > 0) {
                                angular.forEach(results, function (result) {
                                    var albumItem = {};
                                    albumItem.OriginSize = '';
                                    albumItem.thumbnailUrl = result;
                                    albumItem.fileURL = result;
                                    albumItem.isDeleted = false;
                                    albumItem.attachmentOID = -1;
                                    albumItem.uuid = randomUUID();//前台用于识别照片,将上传进度与照片关联
                                    //刚从相册中选择,取得的进度设为0
                                    if ($rootScope.waitingAttachments) {
                                        $rootScope.waitingAttachments[albumItem.uuid] = 0;
                                    }
                                    albumItem.finished = false;
                                    albumItem.Imagetype = 0;
                                    $scope.uploadFinish = false;
                                    $scope.attachmentSrc.push(albumItem);
                                    $scope.view.uploadImage($scope.attachmentSrc.length - 1, albumItem.uuid);
                                });
                            }
                        });
                },
                uploadImage: function (index, uuid) {
                    /*Auth.refreshToken().then(function () {
                     var access_token = localStorageService.get('token').access_token;
                     $scope.uploadPicConfig.headers = {
                     'access_token': access_token,
                     'Authorization': 'Bearer' + access_token,
                     'index': index,
                     'uuid': uuid//将uuid 放入header,success callback 将header 回传,以便将success callback 与具体附件相对应
                     };
                     UploadFileService.uploadFile($scope.attachmentSrc[index].fileURL, $scope.uploadPicConfig.success, $scope.uploadPicConfig.error, $scope.uploadPicConfig.headers);
                     $scope.isShowAddBtn = $scope.attachmentSrc.length < $scope.maxlength ? true : false;
                     });*/
                    HecImageService.uploadImage($scope.attachmentSrc[index].fileURL, $scope.uploadPicConfig.success, $scope.uploadPicConfig.error, uuid, $scope.typeName, $scope.headerId);
                    $scope.isShowAddBtn = $scope.attachmentSrc.length < $scope.maxlength ? true : false;
                }
            };

            function deleteImage(idx, fileId) {
                //根据fileId获取attachmentSrc的数组下标
                var index = "";
                if (PublicFunction.isNull(fileId)) {
                    index = idx;
                } else {
                    for (var i = 0; i < $scope.attachmentSrc.length; i++) {
                        if ($scope.attachmentSrc[i].attachmentOID === fileId) {
                            index = i;
                            break;
                        }
                    }
                }

                if (!PublicFunction.isNull(index)) {
                    if ($scope.attachmentSrc[index].attachmentOID === -1) {
                        $scope.attachmentSrc.splice(index, 1);
                    } else {
                        var oid = $scope.attachmentSrc[index].attachmentOID;
                        var fileName = $scope.attachmentSrc[index].fileName;
                        HecImageService.deleteImage($scope.typeName, $scope.headerId, oid, fileName).then(function (res) {
                            if (res === "S") {
                                $scope.attachmentSrc.splice(index, 1);
                                //删除照片后，重新检查是否所有照片已上传完毕
                                var i = 0;
                                $scope.uploadFinish = true;
                                for (; i < $scope.attachmentSrc.length; i++) {
                                    if (!$scope.attachmentSrc[i].attachmentOID || $scope.attachmentSrc[i].attachmentOID === -1) {
                                        $scope.uploadFinish = false;
                                        break;
                                    }
                                }
                            }
                            $scope.isShowAddBtn = $scope.attachmentSrc.length < $scope.maxlength ? true : false;
                        });
                    }
                }
            }

            //上传图片配置
            $scope.uploadPicConfig = {
                success: function (data) {
                    var result = JSON.parse(data.response);
                    if (result.success) {
                        var returnData = result.returnData[0];
                        var uuid = returnData.uuid;
                        //利用fileName进行一一对应图片 及其 attachmentOID
                        for (var i = 0; i < $scope.attachmentSrc.length; i++) {
                            var suuid = $scope.attachmentSrc[i].uuid;
                            if (!PublicFunction.isNull(suuid)) {
                                if (suuid == uuid) {
                                    //由于上传的时候，夏尔返回的attacheId会和以前的attachmentOID重复，查看和删除图片会有问题，故用uuid作为attachmentOID
                                    //$scope.attachmentSrc[i].attachmentOID = returnData.attacheId;
                                    $scope.attachmentSrc[i].attachmentOID = uuid;
                                    $scope.attachmentSrc[i].fileName = returnData.attacheName;
                                    $scope.attachmentSrc[i].thumbnailUrl = returnData.TattacheUrl;
                                    $scope.attachmentSrc[i].fileURL = returnData.TattacheUrl;
                                    $scope.attachmentSrc[i].Imagetype = 0;
                                    break;
                                }
                            }
                        }
                        $rootScope.waitingAttachments[uuid] = 100;//上传成功,将进度置为 100%
                    } else {
                        var errMsg = $filter('translate')('hec_image.error.upload.image.failed')+result.errorMark;
                        PublicFunction.showToast(errMsg);
                    }

                    //检查所有图片是否都已经上传成功
                    var allUploadSuccess = true;
                    for (var i = 0; i < $scope.attachmentSrc.length; i++) {
                        if (!$scope.attachmentSrc[i].attachmentOID || $scope.attachmentSrc[i].attachmentOID === -1) {
                            allUploadSuccess = false;
                            break;
                        }
                    }
                    $scope.uploadFinish = allUploadSuccess;
                    $scope.$apply();
                },
                error: function (error) {
                    try {
                        console.log("Error when upload image, Exception: " + angular.toJson(error));
                        var result = JSON.parse(error.response);
                        var uuid = result.uuid;
                        $rootScope.waitingAttachments[uuid] = 0;//上传失败,将进度置为 0
                        $ionicLoading.show({
                            template: $filter('translate')('upload_js.Network.failure.please.try.again.later'),//网络故障，请稍后再试。
                            duration: '1000'
                        });
                        //上传失败时，立刻删除这个图片
                        for (var i = 0; i < $scope.attachmentSrc.length; i++) {
                            if ($scope.attachmentSrc[i].uuid == uuid) {
                                $scope.attachmentSrc.splice(i, 1);
                            }
                        }
                    } catch (e) {
                        console.log(e);
                        //删除上传失败或未上传的照片
                        for (var i = 0; i < $scope.attachmentSrc.length; i++) {
                            if (!$scope.attachmentSrc[i].attachmentOID || $scope.attachmentSrc[i].attachmentOID === -1) {
                                $scope.attachmentSrc.splice(i, 1);
                            }
                        }
                    }
                    $scope.$apply();
                },
                headers: {}
            };
            $scope.$watch('attachmentSrc', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.isShowAddBtn = $scope.attachmentSrc.length < $scope.maxlength ? true : false;
                }
            });
            $scope.$watch('maxlength', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.isShowAddBtn = $scope.attachmentSrc.length < $scope.maxlength ? true : false;
                }
            });

            //生成一串uuid
            function randomUUID() {
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";

                var uuid = s.join("");
                return uuid;
            }
        }]);
