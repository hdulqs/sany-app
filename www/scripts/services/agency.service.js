'use strict';

angular.module('huilianyi.services')
    .factory('AgencyService', ['$http', '$q', 'ServiceBaseURL', function ($http, $q, ServiceBaseURL) {
        var agency = {
            applicantOID: null,    // 申请人OID
            formOID: null,         // 单据OID
            applicationOID: null   // 报销单关联的申请单OID
        };

        return {
            // 清空申请人OID,单据OID,报销单关联的申请单OID
            clearAll: function(){
                agency.applicantOID = null;
                agency.formOID = null;
                agency.applicationOID = null;
            },

            // 获取页面展示的申请人信息
            getApplicantItem: function(data){
                var item = {};
                item.avatar = data.avatar;
                item.fullName = data.fullName;
                item.userOID = data.userOID;

                // 保存申请人OID
                agency.applicantOID = item.userOID;

                return item
            },

            // 获取当前的申请人OID
            getApplicantOID: function(){
                return agency.applicantOID;
            },

            // 设置当前的申请人OID
            setApplicantOID: function(applicantOID){
                agency.applicantOID = applicantOID;
            },

            // 获取当前的单据OID
            getFormOID: function(){
                return agency.formOID;
            },

            // 设置当前的单据OID
            setFormOID: function(formOID){
                agency.formOID = formOID;
            },

            // 获取当前的报销单关联的申请单OID
            getApplicationOID: function(){
                return agency.applicationOID;
            },

            // 设置当前的报销单关联的申请单OID
            setApplicationOID: function(applicationOID){
                agency.applicationOID = applicationOID;
            },

            // 搜索在职员工
            searchUsers: function(keyword){
                return $http.get(ServiceBaseURL.url + '/api/search/users/by/' + keyword)
            },

            // 获得公司所有申请单和报销单
            getCustomForm: function(){
                return $http.get(ServiceBaseURL.url + '/api/custom/forms/company/all')
            },

            // 查看被代理人是否已存在被代理信息
            partyCheck: function (partyOID) {
                return $http.get(ServiceBaseURL.url + '/api/bill/proxy/principals/check/' + partyOID)
            },

            // 获取用户信息
            getUserDetail: function (userOID) {
                return $http.get(ServiceBaseURL.url + '/api/users/proxy/' + userOID);
            },

            // 获取可以选择的申请人
            getApplicantsCanSelect: function (keyword) {
                return $http.get(ServiceBaseURL.url + '/api/bill/proxy/my/principals/' + agency.formOID, {
                    params: {
                        applicationOID: agency.applicationOID,
                        keyword: keyword
                    }
                });
            },

            // 从custFormValues中取出对应key的值,返回对应的index(下标)
            getDetailFromFormValuesByKey: function(messageKey, custFormValues){
                for(var i=0; i< custFormValues.length; i++){
                    if (messageKey===custFormValues[i].messageKey){
                        return i;
                    }
                }
                return null;
            }
        };
    }]);
