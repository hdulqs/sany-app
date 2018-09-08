/**
 * Created by Yuko on 16/10/16.
 */
'use strict'
angular.module('huilianyi.services')
    .factory('SelfDefineExpenseReport', ['$http', 'ServiceBaseURL', '$q', '$sessionStorage',
        function ($http, ServiceBaseURL, $q, $sessionStorage) {
            return {
                //在提交/修改报销单时，在调用现在有提交报销单API之前，需要调用检查差标API进行差标检查。
                checkStandard: function (data) {
                    return $http.post(ServiceBaseURL.url + '/api/travel/standards/validate', data)
                },
                getCashCategoryList: function () {
                    return $http.get(ServiceBaseURL.url + '/api/company/standard/currency/getAll');
                },
                //查汇率,根据币种和时间获取汇率
                getCashRate:function(curency_time){
                    return $http.get(ServiceBaseURL.url + '/api/company/standard/currency/get?'+curency_time);
                },
                //获取历史记录费用
                getHistoryExpenseList: function (page, size) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/invoice/history/record',
                        method: 'GET',
                        params: {
                            page: page,
                            size: size
                        }
                    })
                },
                getAvaliableCustomForm: function () {
                    return $http.get(ServiceBaseURL.url + '/api/custom/forms/company/my/avalilable/all');
                },
                getCustomForm: function (formOID) {
                    return $http.get(ServiceBaseURL.url + '/api/custom/forms/' + formOID);
                },
                getFormExpenseType: function (formOID, applicationOID) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/custom/forms/' + formOID + '/selected/expense/types',
                        method: 'GET',
                        params: {
                            applicationOID: applicationOID
                        }
                    })
                },
                saveCustomForm: function (data) {
                    return $http.post(ServiceBaseURL.url + '/api/expense/reports/custom/form/draft', data)
                },
                submitCustomForm: function (data) {
                    return $http.post(ServiceBaseURL.url + '/api/expense/reports/custom/form/submit', data)
                },
                getCustomDetail: function (expenseReportOID) {
                    return $http.get(ServiceBaseURL.url + '/api/expense/reports/' + expenseReportOID)
                },
                getApplicationList: function (page, size, filter) {
                    return $http.get(ServiceBaseURL.url + '/api/applications/all',
                        {
                            params: {
                                page: page,
                                size: size,
                                types: filter.types,
                                status: filter.status,
                                rejectTypes: filter.rejectTypes,
                                startDate: filter.startDate,
                                endDate: filter.endDate
                            }
                        });
                },
                getAllCustomForm: function () {
                    var deferred = $q.defer();
                    var customForm = $sessionStorage.customForm;
                    if (customForm) {
                        deferred.resolve(customForm);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/custom/forms/company/expense/report/all')
                            .success(function (data) {
                                $sessionStorage.customForm = data;
                                deferred.resolve(data);
                            }).error(function (error) {
                            deferred.reject(error);
                        })
                    }
                    return deferred.promise;
                },

                /**
                 * 获取本人可以创建的报销单列表
                 * @returns 本人可以创建的表单列表
                 */
                getExpenseReportFormsCanSelect: function(){
                    var deferred = $q.defer();
                    var customForm = $sessionStorage.expenseReportForm;
                    if (customForm) {
                        deferred.resolve(customForm);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/custom/forms/company/my/available/all/', {
                            params: {
                                formType:102
                            }})
                            .success(function (data) {
                                $sessionStorage.expenseReportForm = data;
                                deferred.resolve(data);
                            }).error(function (error) {
                                deferred.reject(error);
                            })
                    }
                    return deferred.promise;
                },

                getDepartmentInfo: function (departmentOID) {
                    return $http.get(ServiceBaseURL.url + '/api/departments/' + departmentOID)
                },
                getTravelAllowance: function (applicationOID, userOID) {
                    return $http.get(ServiceBaseURL.url + '/api/travelsubsidiess/by/user/application?applicationOID=' + applicationOID + '&userOID=' + userOID);
                },
                getPersonalPaymentAmount: function (applicantOID) {
                    return $http.get(ServiceBaseURL.url + '/api/repayment/writeoffArtificial/my', {
                        params: {
                            applicantOID: applicantOID   // 申请人OID
                        }
                    });
                },
                getExpenseRefundList:function(status,page,size, applicantOID){
                    return $http.get(ServiceBaseURL.url+'/api/loan/application/statusIn/my', {
                            params: {
                                page: page,
                                size: size,
                                status: status,
                                applicantOID: applicantOID   // 申请人OID
                            }
                        });
                },
                commitExpenseRefund:function(data){
                    return $http({
                        method:'POST',
                        url:ServiceBaseURL.url+'/api/repayment/expenseReportRelLoan/submit',
                        data:data
                    })
                },
                getRelateApplication: function (formOID, page, size) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/applications/passed/my',
                        method: 'GET',
                        params: {
                            formOID: formOID,
                            page: page,
                            size: size
                        }
                    })
                },
                //提交报销单时先调用这个接口检查预算是否超额
                checkBudgetCustomForm: function (data) {
                    return $http.post(ServiceBaseURL.url + '/api/expense/reports/checkbudget', data)
                },
                //获取费用类别
                getCategoryList: function () {
                    var deferred = $q.defer();
                    var expenseCategoryList = $sessionStorage.expenseCategoryList;
                    if (expenseCategoryList) {
                        deferred.resolve(expenseCategoryList);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/expense/types/category')
                            .success(function (data) {
                                $sessionStorage.expenseCategoryList = data;
                                deferred.resolve(data);
                            }).error(function (error) {
                            deferred.reject(error);
                        })
                    }
                    return deferred.promise;
                },
                //保存报销单错误信息
                saveExpenseError:function (expenseReportOID,warning) {
                    return $http({
                        method:'POST',
                        url:ServiceBaseURL.url+'/api/expense/report/save/warning',
                        data:{
                            applicationOID:expenseReportOID,
                            warningMessage:warning
                        }
                    })

                }
            }

        }])
