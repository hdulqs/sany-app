/**
 * Created by lizhi on 16/9/30.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('AutoUpdateService', ['updateVersionUrl', '$ionicLoading', '$cordovaFileTransfer', '$cordovaFileOpener2', '$timeout', '$filter','$sessionStorage','PublicFunction',
        function (updateVersionUrl, $ionicLoading, $cordovaFileTransfer, $cordovaFileOpener2, $timeout, $filter,$sessionStorage,PublicFunction) {
            return {
                androidUpdate: function(){
                    var downloadUrl = $sessionStorage.newVersion.downloadUrl;
                    if(PublicFunction.isNull(downloadUrl)){
                        downloadUrl = updateVersionUrl.android;
                    }
                    console.log("downloadUrl android===="+downloadUrl);
                    console.log("androidUpdate====="+angular.toJson($sessionStorage.newVersion));
                    // 跳转系统浏览器下载更新
                    cordova.InAppBrowser.open(updateVersionUrl.android, '_system', 'location=no,toolbar=no,zoom=no');

                    // app内下载更新
                    //window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(fileEntry) {
                    //    fileEntry.getDirectory("Huilianyi", { create: true, exclusive: false }, function (fileEntry) {
                    //        //下载代码
                    //        $ionicLoading.show({
                    //            //template: "已经下载：0%"
                    //            template: $filter('translate')('system_check.downloading')//正在下载中，请稍后
                    //        });
                    //        var targetPath = fileEntry.toURL() + "/huilianyi.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
                    //        var trustHosts = true;
                    //        var options = {};
                    //        var url = updateVersionUrl.android;
                    //        $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function (result) {
                    //            // 打开下载下来的APP
                    //            $cordovaFileOpener2.open(targetPath, 'application/vnd.android.package-archive'
                    //            ).then(function () {
                    //                // 成功
                    //            }, function (err) {
                    //                // 错误
                    //            });
                    //            $ionicLoading.hide();
                    //        }, function (err) {
                    //            $ionicLoading.show({template: $filter('translate')('system_check.download.fail'), noBackdrop: true, duration: 1500});//下载失败
                    //        }, function (progress) {
                    //            //进度，这里使用文字显示下载百分比
                    //            $timeout(function () {
                    //                var downloadProgress = (progress.loaded / progress.total) * 100;
                    //                $ionicLoading.show({
                    //                    template: $filter('translate')('system_check.already.download') + Math.floor(downloadProgress) + "%"    //已下载:
                    //                });
                    //                if (downloadProgress > 99) {
                    //                    $ionicLoading.hide();
                    //                }
                    //            })
                    //        });
                    //    },function(){alert($filter('translate')('system_check.download.fail'))});//下载失败
                    //});
                },

                iosUpdate: function(){
                    var downloadUrl = $sessionStorage.newVersion.downloadUrl;
                    if(PublicFunction.isNull(downloadUrl)){
                        downloadUrl = updateVersionUrl.ios;
                    }
                    console.log("downloadUrl===="+downloadUrl);
                    console.log("androidUpdate====="+angular.toJson($sessionStorage.newVersion));
                    window.open(downloadUrl, '_system');
                }
            }
        }
    ]);
