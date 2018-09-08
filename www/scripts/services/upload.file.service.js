'use strict';
angular.module('huilianyi.services')
    .factory('UploadFileService', ['$http', '$injector', '$timeout', '$q', 'ServiceBaseURL', 'localStorageService', 'LocalStorageKeys','PublicFunction','$rootScope',
        function ($http, $injector, $timeout, $q, ServiceBaseURL, localStorageService, LocalStorageKeys,PublicFunction,$rootScope) {
            return {
                uploadAvatar: function (fileUrl, serviceUrl, success, fail, params, headers) {
                    var options = new FileUploadOptions();
                    options.filekey = "file";
                    options.fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
                    options.mimeType = "image/jpeg";
                    options.chunkedMode = false;
                    options.params = params;
                    options.headers = headers;

                    var ft = new FileTransfer();
                    /*ft.onprogress = function (progressEvent) {
                     if (progressEvent.lengthComputable) {
                     var progressBar = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2);
                     $injector.get('$ionicLoading').show({
                     template: '<div style="height: 40px;width: 120px;" class="row row-center"><p style="text-align: center;width: 100%;">已上传' + progressBar + '%</p></div>',
                     noBackdrop: true
                     });
                     if ((progressEvent.loaded / progressEvent.total) == 1 || progressBar == 100) {
                     $timeout(function () {
                     $injector.get('$ionicLoading').hide();
                     }, 300);
                     }
                     }
                     };*/
                    ft.upload(fileUrl,
                        encodeURI(serviceUrl),
                        success,
                        fail,
                        options);
                }
            }
        }
    ]);
