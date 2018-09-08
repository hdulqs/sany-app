'use strict';
angular.module('huilianyi.services')
    .factory('InvoiceService', ['$http', 'ServiceBaseURL', '$filter', '$q', function ($http, ServiceBaseURL, $filter, $q) {
        var startStr = "点击选择时间";
        var tab;
        return {
            getInvoices: function (page, size) {
                return $http({
                    url: ServiceBaseURL.url + '/api/invoices/init/all',
                    method: 'GET',
                    params: {
                        page: page,
                        size: size
                    }
                });
            },
            getInvoice: function (invoiceOID) {
                return $http.get(ServiceBaseURL.url + '/api/invoices/' + invoiceOID);
            },
            getAllInvoiceByProject: function (data, withReceipt) {
                return $http({
                    url: ServiceBaseURL.url + '/api/invoices/oids/for_apply/' + data,
                    method: 'GET',
                    params: {
                        withReceipt: withReceipt
                    }
                });
            },
            getInvoiceByProject: function (data, page, size, withReceipt) {
                return $http({
                    url: ServiceBaseURL.url + '/api/invoices/cost/center/item/for_apply/' + data,
                    method: 'GET',
                    params: {
                        page: page,
                        size: size,
                        withReceipt: withReceipt
                    }
                });
            },
            getSumByInvoice: function (data) {
                return $http({
                    url: ServiceBaseURL.url + '/api/invoices/cal/total_amount',
                    method: 'GET',
                    params: {
                        invoiceOIDs: data
                    }
                });
            },
            //使用post方法来计算金额:针对报销单是外币的
            getSumByPost: function(data) {
                var dataArray = [];
                var dataStr = "";
                if (data && data.length && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        dataArray.push('invoiceOIDs=' + data[i]);
                    }
                }
                if (dataArray.length > 0) {
                    dataStr = dataArray.join('&');
                }
                return $http({
                    url: ServiceBaseURL.url + '/api/invoices/cal/total_amount',
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: dataStr
                });
            },
            //使用post方法来计算金额:针对报销单是本位币的
            getBaseAmountSumByPost: function(data) {
                var dataArray = [];
                var dataStr = "";
                if (data && data.length && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        dataArray.push('invoiceOIDs=' + data[i]);
                    }
                }
                if (dataArray.length > 0) {
                    dataStr = dataArray.join('&');
                }
                return $http({
                    url: ServiceBaseURL.url + '/api/invoices/cal/total_baseAmount',
                    method: 'post',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    data: dataStr
                });
            },
            getInvoiceBatch: function (data) {
                return $http({
                    url: ServiceBaseURL.url + '/api/invoices/batch/',
                    method: 'GET',
                    params: {
                        invoiceOIDs: data
                    }
                });
            },
            upsertInvoice: function (invoiceOriginal) {
                var invoice = angular.copy(invoiceOriginal);
                for (var i = 0; i < invoice.data.length; i++) {
                    var field = invoice.data[i];
                    if (field.fieldType === 'DATETIME') {
                        field.value = $filter('date')(field.value, "yyyy-MM-dd'T'HH:mm:ss'Z'");
                    } else if (field.fieldType === 'DATE') {
                        if (field.value != null) {
                            var now = new Date();
                            field.value = $filter('date')(field.value, "yyyy-MM-dd'T'HH:mm:ss'Z'");
                        }
                    }
                }
                if (invoice.invoiceOID) {
                    return $http.put(ServiceBaseURL.url + '/api/v2/invoices', invoice);
                } else {
                    return $http.post(ServiceBaseURL.url + '/api/v2/invoices', invoice);
                }
            },
            upsertRelativeInvoice:function(invoiceOriginal){
                var invoice = angular.copy(invoiceOriginal);
                for (var i = 0; i < invoice.data.length; i++) {
                    var field = invoice.data[i];
                    if (field.fieldType === 'DATETIME') {
                        field.value = $filter('date')(field.value, "yyyy-MM-dd'T'HH:mm:ss'Z'");
                    } else if (field.fieldType === 'DATE') {
                        if (field.value != null) {
                            var now = new Date();
                            field.value = $filter('date')(field.value, "yyyy-MM-dd'T'HH:mm:ss'Z'");
                        }
                    }
                }
                if (invoice.invoiceOID) {
                    return $http.put(ServiceBaseURL.url + '/api/v2/invoices/expense/report', invoice);
                }
            },
            deleteOneInvoice: function (invoiceOID) {
                return $http.delete(ServiceBaseURL.url + "/api/invoice/" + invoiceOID);
            },
            getDidiOrderInvoice: function (startDate, endDate) {
                if (startDate == startStr || endDate == startStr) {
                    startDate = '';
                    endDate = '';
                } else {
                    startDate = $filter('date')(startDate, "yyyy-MM-dd HH:mm:ss");
                    endDate = $filter('date')(endDate, "yyyy-MM-dd HH:mm:ss");
                }
                return $http({
                    url: ServiceBaseURL.url + '/api/v2/didi/orders/init/my',
                    method: 'GET',
                    params: {
                        startDate: startDate,
                        endDate: endDate
                    }
                })
            },
            //获取用户信息v2
            getUserInfoNew: function (userOID) {
                return $http.get(ServiceBaseURL.url + '/api/users/v2/' + userOID);
            },
            getInvoiceInformation: function (page, size) {
                return $http({
                    url: ServiceBaseURL.url + '/api/v2/my/company/receipted/invoices',
                    method: 'GET',
                    params: {
                        page: page,
                        size: size
                    }
                })
            },
            getInvoiceInformationByOIDs: function (companyReceiptedOID) {
                return $http.get(ServiceBaseURL.url + '/api/my/company/receipted/invoice/' + companyReceiptedOID);
            },
            getInvoiceListByFilter: function (page, size, filter) {
                return $http({
                    url: ServiceBaseURL.url + '/api/invoices/init/all/by',
                    method: 'GET',
                    params: {
                        page: page,
                        size: size,
                        startDate: filter.startTime,
                        endDate: filter.finishTime,
                        costCenterItemOID: filter.costCenterItemOID,
                        expenseTypeOID: filter.expenseTypeOID
                    }
                })
            },
            getRentInfoList: function(code){
                return $http.get(ServiceBaseURL.url + '/api/get/rental/list?costCenterItemOID=' + code);
            },
            getRentDetail: function(rentalId){
                return $http.get(ServiceBaseURL.url + '/api/get/rental/detail?rentalId=' + rentalId);
            },
            getBudgets: function(costCenterItemOID){
                return $http.get(ServiceBaseURL.url + '/api/process/my?costCenterItemOID=' + costCenterItemOID);
            },
            getBudget: function (customProcessRecordOID) {
                return $http.get(ServiceBaseURL.url + '/api/process/by/' + customProcessRecordOID);
            },
            isBudgetRequired: function(expenseTypeOID, costCenterItemOID, amount){
                return $http.get(ServiceBaseURL.url + '/api/budget/application/required?expenseTypeOID=' + expenseTypeOID + '&amount=' + amount + '&costCenterItemOID=' + costCenterItemOID);
            },
            getAllInvoiceByFilter: function (filter) {
                return $http({
                    url: ServiceBaseURL.url + '/api/invoices/init/all/by/all',
                    method: 'GET',
                    params: {
                        startDate: filter.startTime,
                        endDate: filter.finishTime,
                        costCenterItemOID: filter.costCenterItemOID,
                        expenseTypeOID: filter.expenseTypeOID
                    }
                });
            },
            //批量删除费用
            batchDeleteInvoice: function (invoiceOIDs) {
                return $http({
                    url: ServiceBaseURL.url + '/api/invoice/batch',
                    method: 'DELETE',
                    params: {
                        invoiceOIDs: invoiceOIDs
                    }
                });
            },
            getInvoiceOids: function(currencyCode, status, expenseTypeOID) {
                return $http({
                    url: ServiceBaseURL.url + '/api/invoice/oids/stats/currency',
                    method: 'POST',
                    data: {
                        currencyCode: currencyCode,
                        invoiceStatus: status,
                        expenseTypeOIDs: expenseTypeOID
                    }
                });
            },
            getTab:function(){
                return tab;
            },
            setTab:function(state){
                tab=state;
                return tab;
            }
        };
    }]);
