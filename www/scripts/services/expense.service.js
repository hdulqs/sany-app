/**
 * Created by Yuko on 16/7/9.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('ExpenseService', ['$http', 'ServiceBaseURL', 'localStorageService', '$q', '$injector', '$sessionStorage',
        '$rootScope', 'LocationService',

        function ($http, ServiceBaseURL, localStorageService, $q, $injector, $sessionStorage, $rootScope, LocationService) {

            var progressBar = 0;
            var tab;
            return {
                getTab: function () {
                    return tab;
                },
                setTab: function (state) {
                    tab = state;
                    return tab;
                },
                //获取进度条
                getProgressBar: function () {
                    return progressBar;
                },
                //获取消息列表
                getMessageList: function (page, pageSize) {
                    return $http.get(ServiceBaseURL.url + "/api/my/messages?page=" + page + "&size=" + pageSize);
                },
                getTotal: function (invoiceStatus, includeOIDs, currencyCode, expenseTypeOIDs, beginTime, endTime) {
                    var params = '';
                    if (beginTime !== null) {
                        params = params + "&startTime=" + encodeURIComponent(beginTime);
                    }
                    if (endTime !== null) {
                        params = params + "&endTime=" + encodeURIComponent(endTime);
                    }
                    if(expenseTypeOIDs !== null){
                        for(var i = 0; i<expenseTypeOIDs.length ;i ++){
                            params = params + "&expenseTypeOIDs="+expenseTypeOIDs[i];
                        }
                    }
                    return $http.get(ServiceBaseURL.url + '/api/invoices/stats/currency?invoiceStatus=' + invoiceStatus + '&includeOIDs=' + includeOIDs + '&currencyCode=' + currencyCode + params);
                },
                submitApproval: function (invoiceOIDs) {
                    return $http.post(ServiceBaseURL.url + '/api/invoice/representations', invoiceOIDs);
                },
                deleteOneExpense: function (invoiceOID) {
                    return $http.delete(ServiceBaseURL.url + "/api/invoice/" + invoiceOID);
                },
                withdrawExpense: function (invoiceOIDs) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/invoice/approvals/withdraw',
                        method: 'POST',
                        data: {
                            invoiceOIDs: invoiceOIDs,
                            approvalTxt: '撤回'
                        }
                    });
                },
                getExpenseTypes: function (companyOID) {
                    var deferred = $q.defer();
                    var expenseTypes = $sessionStorage.expenseTypes;
                    //var expenseTypes = localStorageService.get('expense.types');
                    if (expenseTypes) {
                        deferred.resolve(expenseTypes);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/expense/types?companyOID=' + companyOID)
                            .success(function (data) {
                                $sessionStorage.expenseTypes = data;
                                //localStorageService.set('expense.types', {
                                //    lastFetchDate: new Date().getTime(),
                                //    data: data
                                //});
                                deferred.resolve(data);
                            }).error(function (error) {
                            deferred.reject(error);
                        });
                    }
                    return deferred.promise;
                },
                // 获取费用类型详情
                getExpenseType: function (expenseTypeOID) {
                    var deferred = $q.defer();

                    $http.get(ServiceBaseURL.url + '/api/expense/types/' + expenseTypeOID)
                        .success(function (data) {
                            deferred.resolve(data);
                        }).error(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },
                getAllExpenseTypes: function () {
                    var deferred = $q.defer();
                    var expenseTypes = $sessionStorage.expenseTypes;
                    //var expenseTypes = localStorageService.get('expense.types');
                    if (expenseTypes) {
                        deferred.resolve(expenseTypes);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/expense/types/company/all')
                            .success(function (data) {
                                $sessionStorage.expenseTypes = data;
                                //localStorageService.set('expense.types', {
                                //    lastFetchDate: new Date().getTime(),
                                //    data: data
                                //});
                                deferred.resolve(data);
                            }).error(function (error) {
                            deferred.reject(error);
                        });
                    }
                    return deferred.promise;
                },
                getExpenseSelector: function (page, size, beginTime, endTime, expenseTypeOIDs, invoiceCurrencyCode, ownerOID,originCurrencyCode,webInvoiceKeepConsistentWithExpense) {
                    // 费用所属者的OID
                    ownerOID = ownerOID? ownerOID : '';
                    if (expenseTypeOIDs == null || expenseTypeOIDs.length === 0) {
                        return $http({
                            url: ServiceBaseURL.url + '/api/v2/invoices/currency',
                            method: 'POST',
                            params: {
                                page: page,
                                size: size
                            },
                            data: {
                                invoiceStatus: 'INIT',
                                startTime: beginTime,
                                endTime: endTime,
                                currencyCode: invoiceCurrencyCode,
                                applicantOID: ownerOID
                            }
                        });
                    }else if((invoiceCurrencyCode===originCurrencyCode) && !webInvoiceKeepConsistentWithExpense){
                        return $http({
                            url: ServiceBaseURL.url + '/api/v2/invoices/currency',
                            method: 'POST',
                            params: {
                                page: page,
                                size: size
                            },
                            data: {
                                invoiceStatus: 'INIT',
                                startTime: beginTime,
                                endTime: endTime,
                                expenseTypeOIDStr: expenseTypeOIDs+ '',
                                applicantOID: ownerOID
                            }
                        });
                    }else {
                        return $http({
                            url: ServiceBaseURL.url + '/api/v2/invoices/currency',
                            method: 'POST',
                            params: {
                                page: page,
                                size: size
                            },
                            data: {
                                invoiceStatus: 'INIT',
                                startTime: beginTime,
                                endTime: endTime,
                                expenseTypeOIDStr: expenseTypeOIDs+ '',
                                currencyCode: invoiceCurrencyCode,
                                applicantOID: ownerOID
                            }
                        });
                    }

                },
                getExpenseList: function (page, size, invoiceStatus, invoiceCurrencyCode) {
                    if (invoiceStatus === 'REPRESENTED') {
                        return $http.get(ServiceBaseURL.url + '/api/invoice/representations?page=' + page + '&size=' + size);
                    } else {
                        return $http({
                            url: ServiceBaseURL.url + '/api/v2/invoices/currency',
                            method: 'POST',
                            params: {
                                page: page,
                                size: size
                            },
                            data: {
                                invoiceStatus: invoiceStatus,
                                currencyCode: invoiceCurrencyCode
                            }
                        });
                    }

                },
                expenseApply: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/invoice/approvals/apply',
                        method: 'POST',
                        data: {
                            invoiceOIDs: data
                        }
                    });
                },
                getInvoice: function (invoiceOID) {
                    return $http.get(ServiceBaseURL.url + '/api/invoices/' + invoiceOID);
                },
                agreeExpense: function (invoiceOIDs) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/invoice/approvals/pass',
                        method: 'POST',
                        data: {
                            invoiceOIDs: invoiceOIDs,
                            approvalTxt: '通过'
                        }
                    });
                },
                rejectExpense: function (invoiceOIDs, approvalTxt) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/invoice/approvals/reject',
                        method: 'POST',
                        data: {
                            invoiceOIDs: invoiceOIDs,
                            approvalTxt: approvalTxt
                        }
                    });
                },
                uploadFile: function (fileUrl, success, error, headers) {
                    var options = new FileUploadOptions();
                    options.filekey = "file";
                    options.fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
                    options.mimeType = "image/jpeg";
                    options.chunkedMode = false;
                    options.params = {
                        attachmentType: 'INVOICE_IMAGES'
                    };
                    options.headers = headers;
                    var ft = new FileTransfer();
                    ft.onprogress = function (progressEvent) {
                        if (progressEvent.lengthComputable) {
                            //如果进度大于95%,则进度 - 1 ,避免进度为100%,但是还没执行callback,导致100%状态提交时提示照片正在上传
                            if((progressEvent.loaded / progressEvent.total) > 0.95){
                                progressBar = ((progressEvent.loaded / progressEvent.total) * 100 - 1).toFixed(2);
                            }else{
                                progressBar = ((progressEvent.loaded / progressEvent.total) * 100).toFixed(2);
                            }
                            $rootScope.waitingAttachments[options.headers.uuid] = progressBar;//更新对应附件的上传状态
                            $rootScope.$apply();
                        }
                    };
                    ft.upload(fileUrl,
                        encodeURI(ServiceBaseURL.url + '/api/upload/attachment'),
                        success,
                        error,
                        options);
                },
				/**
				 * 获取税率列表
                 * @returns {HttpPromise}
                 * [
                 *  {
                 *      "taxRateKey": "0%",
                 *      "taxRateValue": 0,
                 *      "defaultValue": false
                 *  },
                 * ...
                 * ]
                 */
                getTaxRates: function() {
                    return $http.get(ServiceBaseURL.url + '/api/custom/enumeration/tax/rate');
                },
                //根据条件获取费用的OIDs
                getInvoiceOids: function(currencyCode, originCurrencyCode, webInvoiceKeepConsistentWithExpense, status, expenseTypeOID, filter, applicantOID) {
                    //如果报销单的币种==本位币 并且 不严格管控 本位 报销单只有一种币种
                    if(!webInvoiceKeepConsistentWithExpense && currencyCode == originCurrencyCode){
                        return $http({
                            url: ServiceBaseURL.url + '/api/invoice/oids/stats/currency',
                            method: 'POST',
                            data: {
                                invoiceStatus: status,
                                expenseTypeOIDs: expenseTypeOID,
                                startTime: filter ? filter.beginTime : null,
                                endTime: filter? filter.endTime : null,
                                applicantOID: applicantOID   // 费用所属者OID
                            }
                        });
                    } else {
                        return $http({
                            url: ServiceBaseURL.url + '/api/invoice/oids/stats/currency',
                            method: 'POST',
                            data: {
                                currencyCode: currencyCode,
                                invoiceStatus: status,
                                expenseTypeOIDs: expenseTypeOID,
                                startTime: filter ? filter.beginTime : null,
                                endTime: filter? filter.endTime : null,
                                applicantOID: applicantOID   // 费用所属者OID
                            }
                        });
                    }

                },
                //根据OID 批量获取费用
                getExpenseByOIDs: function (invoiceOIDs) {
                    return $http({
                        method:'GET',
                        url:ServiceBaseURL.url + '/api/invoices/batch/',
                        params:{
                            invoiceOIDs:invoiceOIDs
                        }
                    });
                },

                // 费用城市控件初始化处理,获取当前定位城市以及城市编码
                initExpenseCityDate: function(data) {
                    var i,
                        city = LocationService.getCity(),
                        deferred = $q.defer();

                    if(!data || !city) {
                        deferred.reject();
                        return deferred.promise;
                    }

                    for(i=0; i<data.length; i++) {
                        // 城市控件获取定位城市以及转换为城市编码
                        if(data[i].fieldType==="LOCATION") {
                            LocationService.getCodeByCity(city).then(function(response) {
                                // 只处理返回数据只有一个的情况
                                if(response.data.length===1) {
                                    data[i].cityName = response.data[0].state;
                                    data[i].value = response.data[0].code;
                                    deferred.resolve(data);
                                }
                            }, function(error) {
                                deferred.reject(error);
                            });
                        }
                    }
                    return deferred.promise;
                },

                // 同步费用上的信息
                syncExpenseData: function(expense) {
                    var i, j;

                    if(!expense.data) {
                        return expense;
                    }

                    for(i=0; i<expense.data.length; i++) {
                        //  同步控件上的城市到字段中的城市
                        if(expense.data[i].fieldType==="LOCATION") {
                            for(j=0; j<expense.data.length; j++) {
                                if(expense.data[j].messageKey === 'city') {
                                    // 城市控件第一个元素为城市名称
                                    expense.data[j].value = expense.data[i].cityName;
                                    break;
                                }
                            }
                        }
                    }

                    return expense;
                }
            };
        }]);
