'use strict';
angular.module('huilianyi.services')
    .factory('NotificationService', ['$http', 'ServiceBaseURL','localStorageService','LocalStorageKeys',
        function($http, ServiceBaseURL,localStorageService,LocalStorageKeys) {
            return {
                //获取消息列表
                getMessageList: function (page, pageSize) {
                    return $http.get(ServiceBaseURL.url + "/api/my/messages?page=" + page + "&size=" + pageSize);
                },
                //删除一条消息
                deleteOneMessage: function (referenceId) {
                    return $http.delete(ServiceBaseURL.url + "/api/messages/" + referenceId);
                },
                getMessageAccountDetail: function (processInstanceId) {
                    return $http.get(ServiceBaseURL.url + '/api/workflow/reimbursement/reimbursement_domain/process_instance/' + processInstanceId);
                },
                //获取消息列表的待审批TRAVEL_APPROVAL详情
                getMessageTravelDetail: function (processInstanceId) {
                    return $http.get(ServiceBaseURL.url + '/api/workflow/travel/travel_domain/process_instance/' + processInstanceId);
                },
                //获取预报销详情
                getPreInvoiceDetailByProcressId: function (referenceId) {
                    return $http.get(ServiceBaseURL.url + '/api/workflow/process/custom_process/process_instance/' + referenceId)
                },
                //根据项目id拿项目名字
                getCostCenterNameById: function(costCenterItemOID){
                    return $http.get(ServiceBaseURL.url + '/api/cost/center/item/' + costCenterItemOID);
                },
                //清空消息列表
                cleanMessage: function(){
                    return $http.delete(ServiceBaseURL.url +'/api/messages/clean');
                },
                //标记为已读
                remarkRead: function(messageOID){
                    return $http.put(ServiceBaseURL.url +'/api/messages/read/' + messageOID);
                },
                //获取未读消息数量
                countUnReadMessage: function(){
                    return $http.get(ServiceBaseURL.url + '/api/messages/viewed/count?viewed=false');
                },
                getMessagetSSOUrl: function (messageOID) {
                    return $http.get(ServiceBaseURL.url + '/api/messages/h5/sso/' + messageOID);
                },
                //hec:获取消息列表中单据状态
                getDocStatus:function(headerId,docType){
                    return $http({
                        url: ServiceBaseURL.hec_interface_url,
                        method: 'POST',
                        data: {
                            "data_type": "get_status",
                            "action": "query",
                            "header_id": headerId,
                            "document_type":docType,////EXP_REQUISITION  费用申请单（标准和差旅）	PAYMENT_REQUISITION  借款申请单		ACP_REQUISITION  付款申请单		EXP_REPORT
                            "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                            "pagenum": 1,
                            "pagesize": 1000,
                            "fetchall": "false"
                        }
                    });
                }
            }
        }
    ]);
