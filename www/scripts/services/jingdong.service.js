/**
 * Created by lizhi on 16/11/11.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('JingDongApplicationServices', ['$http', 'ServiceBaseURL', '$q', '$sessionStorage', 'JingDongURL', 'Auth', 'localStorageService', '$state', 'PublicFunction',
        function ($http, ServiceBaseURL, $q, $sessionStorage, JingDongURL, Auth, localStorageService, $state, PublicFunction) {
            var browser = null;
            var stateUrl = null;
            var orderId = null;
            var applicationState = {
                create: "app.jingdong_application_create",
                edit: "app.jingdong_application_edit",
                waitApproval: "app.jingdong_application_wait_approval",
                hasPass: "app.jingdong_application_has_pass"
            };

            // 获取京东申请详情
            function getApplicationDetail(applicationOID) {
                return $http.get(ServiceBaseURL.url + '/api/jingdong/order/applications/my/get/' + applicationOID);
            }

            // 京东H5打开链接监听
            function browserLoadStart(event){
                var targetApplicationOID = null;

                // 如果访问了'borwser/close'链接,则关闭H5
                if (event.url.indexOf('closeInAppBrowser.html') !== -1) {
                    browser.close();
                }
                // 查看已通过申请
                else if (event.url.indexOf('jingdong/application/has/pass?applicationOID=') !== -1) {
                    targetApplicationOID = event.url.split('=')[1];
                    browser.close();

                    // 如果是从首页跳到H5
                    if (stateUrl==="/tab/erv/homepage"){
                        $state.go(applicationState.hasPass, {applicationOID: targetApplicationOID});
                    }
                }
                // 查看申请详情
                else if (event.url.indexOf('jingdong/application?applicationOID=') !== -1) {
                    targetApplicationOID = event.url.split('=')[1];
                    browser.close();
                    getApplicationDetail(targetApplicationOID)
                        .success(function(data){
                            // 申请单类型 type 1001-费用申请, 1002-差旅申请,1003-订票申请，1004 -京东订单申请
                            // 订单状态 jingDongOrderApplication.jingDongOrder 1001-初始，1002-待付款，1003-已取消，1004-已付款
                            // 申请单状态 status 1001-初始，1002-提交审批，1003-审批通过
                            // 驳回类型 rejectType 1000-正常, 1001-撤回, 1002-审批驳回，1003-财务审核驳回，1004-开票驳回
                            if(data.type!==1004 || (data.status!==1001&&data.status!==1002)){
                                PublicFunction.showToast("申请单无效");
                                return
                            }
                            if(!data.jingDongOrderApplication.jingDongOrder ||
                                (data.jingDongOrderApplication.jingDongOrder.status!==1001 && data.jingDongOrderApplication.jingDongOrder.status!==1003)){
                                PublicFunction.showToast("京东订单无效");
                                return
                            }

                            switch (data.status){
                                // 待提交
                                case 1001:
                                    // 如果是从首页跳到H5
                                    if (stateUrl==="/tab/erv/homepage"){
                                        $state.go(applicationState.edit, {applicationOID: targetApplicationOID});
                                    }
                                    break;
                                // 审批中
                                case 1002:
                                    // 如果是从首页跳到H5
                                    if (stateUrl==="/tab/erv/homepage"){
                                        $state.go(applicationState.waitApproval, {applicationOID: targetApplicationOID});
                                    }
                                    break;
                                default:
                                    return
                            }
                        })
                        .error(function(){
                        });
                }
            }

            // 京东H5关闭监听
            function browserClose(){
                browser.removeEventListener('loadstart', browserLoadStart);
                browser.removeEventListener('exit', browserClose);
                browser = null;
            }

            // 生成InAppBrowser url
            function getBrowserUrl(){
                var token = localStorageService.get("token").access_token;
                return orderId ? JingDongURL+"/demo.html?token="+token+"&orders="+orderId : JingDongURL+"?token="+token;
            }

            return {
                // 跳转京东H5
                jumpJD: function(url, orderNum){
                    stateUrl = url?url:null;
                    orderId = orderNum?orderNum:null;
                    Auth.refreshToken().then(function(){
                        browser = cordova.InAppBrowser.open(encodeURI(getBrowserUrl()), '_blank', 'location=no,toolbar=no,zoom=no');
                        browser.addEventListener('loadstart', browserLoadStart);
                        browser.addEventListener('exit', browserClose);
                    });
                },

                // 跳转京东付款
                jumpJDPay: function() {
                    Auth.refreshToken().then(function(){
                        // 京东付款页面url
                        var url = JingDongURL + "/mycart.html?token=" + localStorageService.get("token").access_token;
                        browser = cordova.InAppBrowser.open(encodeURI(url), '_blank', 'location=no,toolbar=no,zoom=no');
                        browser.addEventListener('loadstart', browserLoadStart);
                        browser.addEventListener('exit', browserClose);
                    });
                },

                // 获取京东申请详情
                getApplicationDetail: getApplicationDetail,

                // 保存
                saveApplication: function(data) {
                    return $http.post(ServiceBaseURL.url + '/api/jingdong/order/applications/draft', data);
                },

                // 提交
                submitApplication: function(data) {
                    return $http.post(ServiceBaseURL.url + '/api/jingdong/order/applications/custom/form/submit', data);
                },

                // 删除京东申请
                deleteApplication: function (applicationOID) {
                    return $http.delete(ServiceBaseURL.url + '/api/jingdong/order/applications/' + applicationOID);
                },

                // 撤回
                withdrawApplication: function (data) {
                    /*
                     data={
                         "entities":[{"entityOID":"605f84bc-56d4-4b2d-9ba0-606652b194ee","entityType":1002}],
                         "approvalTxt":"测试测试"
                     }
                     * */
                    return $http.post(ServiceBaseURL.url + '/api/approvals/withdraw', data);
                },

                getAllCustomApplication: function () {
                    var deferred = $q.defer();
                    var customApplication = $sessionStorage.customApplication;
                    if (customApplication) {
                        deferred.resolve(customApplication);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/custom/forms/company/application/all')
                            .success(function (data) {
                                $sessionStorage.customApplication = data;
                                deferred.resolve(data);
                            }).error(function (error) {
                            deferred.reject(error);
                        })
                    }
                    return deferred.promise;
                }
            }
        }]);
