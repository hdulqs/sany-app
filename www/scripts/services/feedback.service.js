'use strict';
angular.module('huilianyi.services')
    .factory('FeedbackService', ['$http', 'ServiceBaseURL','$injector',
        function ($http, ServiceBaseURL,$injector) {
            return {
                sendMessage: function (attachmentOIDs, model, deviceVersion, appVersion, platform, message) {
                    return $http({
                        method: 'POST',
                        url: ServiceBaseURL.url + '/api/feedback',
                        params: {
                            model: model,
                            deviceVersion: deviceVersion,
                            appVersion: appVersion,
                            platform: platform,
                            message: message,
                            attachmentOIDs: attachmentOIDs
                        }
                    });
                },
                uploadFile:function (fileUrl,success,error,headers) {
                    var options = new FileUploadOptions();
                    options.filekey = "file";
                    options.fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
                    options.mimeType = "image/jpeg";
                    options.chunkedMode = false;
                    options.params = {
                        attachmentType: 'FEEDBACK_IMAGES'
                    };
                    options.headers = headers;
                    var ft = new FileTransfer();
                    ft.upload(fileUrl,
                        encodeURI(ServiceBaseURL.url + '/api/upload/attachment'),
                        success,
                        error,
                        options);
                    $injector.get('$ionicLoading').show({
                        template: '<img style="height: 3em" ng-src="img/loading.gif">',
                        noBackdrop: true
                    });
                }
            }
        }]);
