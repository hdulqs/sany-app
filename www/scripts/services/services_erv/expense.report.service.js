/**
 * Created by Administrator on 2016/7/30.
 */
'use strict'
angular.module('huilianyi.services')
    .factory('ExpenseReportService', ['$http', 'ServiceBaseURL',
        function ($http, ServiceBaseURL) {
            var tab;
            return {
                //审核报销单的页面,也会检测差标,与提交报销单的提醒是一样的;在提交报销单的时候,是提醒状态,任然提交的情况
                getCheckStandardResult: function (data) {
                    return $http.post(ServiceBaseURL.url + '/api/travel/standard/results', data,{
                        headers:{
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": "application/json",
                        }
                    })
                },
                getTab: function () {
                    return tab;
                },
                setTab: function (state) {
                    tab = state;
                    return tab;
                },
                saveExpenseReport: function (expense) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/expense/reports/draft',
                        method: 'POST',
                        data: expense
                    })
                },
                getExpenseReportList: function (status, page, size) {
                    return $http.get(ServiceBaseURL.url + '/api/expense/reports/my?status=' + status + '&page=' + page + '&size=' + size);
                },
                deleteExpenseReport: function (expenseOID) {
                    return $http.delete(ServiceBaseURL.url + "/api/expense/reports/" + expenseOID);
                },
                getExpenseReportDetail: function (expenseOID) {
                    return $http.get(ServiceBaseURL.url + "/api/expense/reports/" + expenseOID);
                },
                commitExpenseReport: function (expense) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/expense/reports/submit',
                        method: 'POST',
                        data: expense
                    })
                },
                getCashCategoryList: function (companyOID) {
                    return $http.get(ServiceBaseURL.url + "/api/get/exchange/rate?companyOID=" + companyOID);

                },
                recallExpenseReport: function (expense) {
                    return $http({
                        url: ServiceBaseURL.url + "/api/approvals/withdraw",
                        method: 'POST',
                        data: expense
                    })
                },
                //deleteOneInoviceInExpense: function (expenseReportOID, invoiceOID) {
                //    return $http.delete(ServiceBaseURL.url + '/api/expense/reports/delete/invoice/' + expenseReportOID + '/' + invoiceOID);
                //},
                printExpense: function (expenseReportOID) {
                    return $http.get(ServiceBaseURL.url + '/api/expense/reports/generate/pdf/' + expenseReportOID);
                },
                removeExpense: function (expenseReportOID, invoiceOID) {
                    return $http.delete(ServiceBaseURL.url + '/api/expense/reports/remove/invoice/' + expenseReportOID + '/' + invoiceOID);
                }
            }


        }])
