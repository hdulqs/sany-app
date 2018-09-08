(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('HecImageService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService', 'LocalStorageKeys', 'PublicFunction', '$filter', '$rootScope',
            function ($http, $q, ServiceBaseURL, $timeout, localStorageService, LocalStorageKeys, PublicFunction, $filter, $rootScope) {
                var service = {
                    getSeqId: getSeqId,
                    downloadImage: downloadImage,
                    uploadImage: uploadImage,
                    deleteImage: deleteImage
                };
                return service;

                /**
                 * 获取费控的SeqId(夏尔系统会验证费控系统的SeqId)
                 * @param type req/差旅申请单  exp:费用账本
                 * @param headerId  差旅申请头ID或费用账本ID
                 */
                function getSeqId(type, headerId) {
                    var deferred = $q.defer();
                    var seqList = localStorageService.get("seqList");
                    if (PublicFunction.isNull(seqList)) {
                        seqList = [];
                    } else {
                        //根据type和headerID从localStorageService查找对应的SeqId，如果存在则返回，否则调用费控接口获取
                        for (var i = 0; i < seqList.length; i++) {
                            var seq = seqList[i];
                            var currTime = new Date().getTime();
                            var expiredTime = new Date(seq.expiredDate).getTime();
                            if (seq.type === type && seq.headerId == headerId) {
                                //未过期则返回
                                if (currTime < expiredTime) {
                                    deferred.resolve(seq);
                                    return deferred.promise;
                                } else {
                                    //过期则删除
                                    seqList.splice(i, 1);
                                }
                            } else {
                                //删除过期的SeqId
                                if (currTime > expiredTime) {
                                    seqList.splice(i, 1);
                                }
                            }
                        }
                    }

                    var barcode = "";
                    var tableName = "";
                    if (type == "erh") {
                        tableName = "EXP_REPORT_HEADERS" //报销单头
                    } else if (type === "exp") {
                        tableName = "SY_EXP_EXPENSE";  //费用
                    } else if (type === "erl") {
                        tableName = "SY_EXP_EXPENSE";  //报销单行
                        barcode = headerId;  //单据号
                        headerId = "";
                    } else if (type === "req") {
                        tableName = "EXP_REQUISITION_HEADERS"; //申请单
                    } else if (type === "pr") {
                        tableName = "CSH_PAYMENT_REQUISITION_HDS";//借款单
                    } else if (type === "prh") {
                        tableName = "ACP_ACP_REQUISITION_HDS";//付款单
                    }

                    //调用费控接口获取SeqID(费控系统会同时返回两个SeqId，一个用于下载，一个用于上传)
                    $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "book_img",
                            "action": "submit",
                            "parameter": [{
                                "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                                "session_company_id": localStorageService.get(LocalStorageKeys.hec_company_id),
                                "upload_type_id": 5,  //上传
                                "download_type_id": 4, //下载
                                "header_id": headerId,
                                "barcode": barcode,
                                "table_name": tableName
                            }]
                        }
                    }).success(function (res) {
                        if (res.success) {
                            var data = res.result;
                            var dateStr = data.upload.record[0].upload_seqid_date;
                            var creationDate = new Date(Date.parse(dateStr));
                            //设置SeqId过期时间为0.7天(夏尔设置SeqId一天的有效期)
                            creationDate.setDate(creationDate.getDate() + 0.014);
                            var seq = {
                                "type": type,
                                "headerId": headerId,
                                "docNum": data.doc_info.record[0].document_number,
                                "downSeqId": data.download.record[0].download_seqid,
                                "uploadSeqId": data.upload.record[0].upload_seqid,
                                "expiredDate": PublicFunction.getDateTimeDString(creationDate)
                            };
                            seqList.push(seq);
                            localStorageService.set("seqList", seqList);
                            deferred.resolve(seq);
                        } else {
                            PublicFunction.showToast(res.error.message);
                            deferred.reject("");
                        }
                    }).error(function (error) {
                        PublicFunction.showToast($filter('translate')('hec_image.error.get.seqid'));
                        console.log("获取seqid出错：" + angular.toJson(error));
                        deferred.reject("");
                    });
                    return deferred.promise;
                };

                /**
                 * 从夏尔系统中获取图片的下载地址
                 * @param type req/差旅申请单  exp:费用账本
                 * @param headerId  差旅申请头ID或费用账本ID
                 */
                function downloadImage(type, headerId) {
                    var deferred = $q.defer();
                    getSeqId(type, headerId).then(function (seq) {
                        if (!PublicFunction.isNull(seq)) {
                            var downloadUrl = ServiceBaseURL.xiaer_url + "&type=4&barcode=" + seq.docNum + "&seqid=" + seq.downSeqId;
                            $http({
                                url: downloadUrl,
                                method: 'POST'
                            }).success(function (data) {
                                if (data.success) {
                                    var result = data.returnData;
                                    var imgList = [];
                                    var image = {};
                                    var imageUrl = "";
                                    for (var i = 0; i < result.length; i++) {
                                        image = {};
                                        //imageUrl = result[i].attacheUrl.replace('http://10.0.12.29:8080', "http://113.247.241.66:9083");
                                        image.fileName = result[i].attacheName;
                                        image.attachmentOID = result[i].attacheId;
                                        image.fileType = "IMAGE";
                                        if(result[i].Imagetype==="0"){ //图片
                                            image.fileURL = result[i].TattacheUrl;
                                        }else{ //其他文件
                                            image.fileURL = result[i].attacheUrl;
                                        }
                                        image.thumbnailUrl = result[i].TattacheUrl;
                                        image.Imagetype = result[i].Imagetype;
                                        imgList.push(image);
                                    }
                                    deferred.resolve(imgList);
                                } else {
                                    console.log("图片下载失败，错误信息：" + angular.toJson(data));
                                    PublicFunction.showToast($filter('translate')('hec_image.error.download.image.failed'));
                                    deferred.reject([]);
                                }
                            }).error(function (error) {
                                PublicFunction.showToast($filter('translate')('hec_image.error.download.image.failed'));
                                console.log("图片下载失败：" + angular.toJson(error));
                                deferred.reject("");
                            });
                        }
                    });
                    return deferred.promise;
                };

                /**
                 * 上传图片
                 * @param fileUrl 本地图片地址(手机上图片的地址)
                 * @param success 上传成功的回调函数
                 * @param error  上传失败的回调函数
                 * @param uuid   图片标识Id
                 * @param type req/差旅申请单  exp:费用账本
                 * @param headerId  差旅申请头ID或费用账本ID
                 */
                function uploadImage(fileUrl, success, error, uuid, type, headerId) {
                    getSeqId(type, headerId).then(function (seq) {
                        if (!PublicFunction.isNull(seq)) {
                            var options = new FileUploadOptions();
                            options.fileKey = "some";
                            options.fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
                            options.mimeType = "image/jpeg";
                            options.chunkedMode = false;
                            var files = {
                                "fileid": "1",
                                "filename": options.fileName,
                                "imgType": "png",
                                "op": "add",
                                "uuid": uuid
                            };
                            var progressBar = 0;
                            var ft = new FileTransfer();
                            ft.onprogress = function (progressEvent) {
                                if (progressEvent.lengthComputable) {
                                    //如果进度大于95%,则进度 - 1 ,避免进度为100%,但是还没执行callback,导致100%状态提交时提示照片正在上传
                                    if ((progressEvent.loaded / progressEvent.total) > 0.95) {
                                        progressBar = ((progressEvent.loaded / progressEvent.total) * 100 - 1).toFixed(2);
                                    } else {
                                        progressBar = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2);
                                    }
                                    $rootScope.waitingAttachments[uuid] = progressBar;//更新对应附件的上传状态
                                    $rootScope.$apply();
                                }
                            };
                            var str = "&type=5&barcode=" + seq.docNum + "&seqid=" + seq.uploadSeqId + "&files=" + "[" + angular.toJson(files) + "]";
                            var uploadUrl = ServiceBaseURL.xiaer_url + str;
                            ft.upload(fileUrl,
                                encodeURI(uploadUrl),
                                success,
                                error,
                                options,
                                true);
                        }
                    });
                };

                /**
                 * 调用夏尔接口，删除图片
                 * @param type req/差旅申请单  exp:费用账本
                 * @param headerId  差旅申请头ID或费用账本ID
                 * @param fileId 图片ID
                 * @param fileName 图片名称
                 */
                function deleteImage(type, headerId, fileId, fileName) {
                    var deferred = $q.defer();
                    getSeqId(type, headerId).then(function (seq) {
                        if (!PublicFunction.isNull(seq)) {
                            var deleteUrl = ServiceBaseURL.xiaer_url + "&type=5&barcode=" + seq.docNum + "&seqid=" + seq.uploadSeqId;
                            var deleteFile = {
                                "fileid": "",
                                "filename": fileName,
                                "imgType": "",
                                "op": "delete",
                                "uuid": "12345"
                            };
                            deleteUrl = encodeURI(deleteUrl + "&files=" + "[" + angular.toJson(deleteFile) + "]");
                            $http({
                                url: deleteUrl,
                                method: 'POST'
                            }).success(function (res) {
                                if (res.success) {
                                    deferred.resolve("S");
                                } else {
                                    console.log("删除图片出错，错误信息：" + angular.toJson(res.errorMark));
                                    PublicFunction.showToast($filter('translate')('hec_image.error.delete.image.failed') + angular.toJson(res.errorMark));
                                    deferred.reject("E");
                                }
                            }).error(function (error) {
                                console.log("删除图片出错：" + angular.toJson(error));
                                PublicFunction.showToast($filter('translate')('hec_image.error.delete.image.failed') + angular.toJson(error));
                                deferred.reject("E");
                            });
                        }
                    });
                    return deferred.promise;
                }
            }])
})();
