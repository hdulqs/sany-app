/**
 * Created by ZhaoYing on 2016/2/25.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('ExpenseSheetService', ['$http', 'ServiceBaseURL', function ($http, ServiceBaseURL) {
        return {
            SubmitExpenseSheet: function (data) {
                return $http({
                    url: ServiceBaseURL.url + '/api/workflow/reimbursement/apply',
                    method: 'POST',
                    data: data
                });
            },
            SaveExpenseSheet: function (data) {
                return $http({
                    url: ServiceBaseURL.url + '/api/workflow/reimbursement/apply/draft',
                    method: 'POST',
                    data: data
                });
            },
            reSubmitExpenseSheet: function (taskId, data) {
                return $http({
                    url: ServiceBaseURL.url + '/api/workflow/reimbursement/apply/reApply/' + taskId,
                    method: 'POST',
                    data: data
                });
            },
            reSaveExpenseSheet: function (taskId, data) {
                return $http({
                    url: ServiceBaseURL.url + '/api/workflow/reimbursement/apply/reApply_draft/' + taskId,
                    method: 'POST',
                    data: data
                });
            },
            deleteExpenseSheet: function (taskId) {
                return $http({
                    url: ServiceBaseURL.url + '/api/workflow/reimbursement/apply/cancel/' + taskId,
                    method: 'POST'
                });
            },
            setExpenseSheetSetting: function (settings) {
                return $http.post(ServiceBaseURL.url + '/api/user/expense/sheet/settings', $.param(settings), {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
            },
            getExpenseSheetSetting: function () {
                return $http.get(ServiceBaseURL.url + '/api/user/expense/sheet/settings');
            },
            //hand create expense
            batchCreateExpense: function (invoiceOIDs) {
                var reimbursementDTO = {};
                reimbursementDTO.invoiceUUIDs = invoiceOIDs;
                return $http({
                    url: ServiceBaseURL.url + '/api/v2/workflow/reimbursement/apply',
                    method: 'POST',
                    data: reimbursementDTO
                });
            }
        }
    }]);

