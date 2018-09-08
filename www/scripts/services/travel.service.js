/**
 * Created by Nealyang on 16/3/25.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('TravelService', ['$http', 'ServiceBaseURL', '$filter', function ($http, ServiceBaseURL, $filter) {
        var OrdinaryInfo = {
            OrdinaryId: '',
            OrdinaryMsg: '',
            processInstanceId: ''
        };
        return {
            setOrdinaryInfo: function (OrdinaryId, msg, processInstanceId) {
                OrdinaryInfo.OrdinaryId = OrdinaryId;
                OrdinaryInfo.OrdinaryMsg = msg;
                OrdinaryInfo.processInstanceId = processInstanceId;
            },
            getOrdinaryInfo: function (id) {
                return OrdinaryInfo;
            },

            //提交
            createOrdinaryApplication: function (data) {
               //if (data.applyType === 1002) {
               //     data.trafficPlanDTOs[0].departDate = $filter('date')(data.trafficPlanDTOs[0].departDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
               //     data.trafficPlanDTOs[0].returnDate = $filter('date')(data.trafficPlanDTOs[0].returnDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
               // }
                return $http({
                    url: ServiceBaseURL.url + '/api/workflow/travel/apply',
                    method: 'POST',
                    data: data
                });
            },
            //重新提交
            createOrdinaryApplicationAgain: function (taskId, data) {
                return $http({
                    url: ServiceBaseURL.url + '/api/workflow/travel/apply/reApply/' + taskId,
                    method: 'POST',
                    data: data
                });
            },
            //保存
            saveTravel: function (data) {
                if (data.applyType === 1001) {
                    data.flybackDTO.travelDateFrom = $filter('date')(data.flybackDTO.travelDateFrom, "yyyy-MM-dd'T'HH:mm:ss'Z'");
                    data.flybackDTO.travelDateTo = $filter('date')(data.flybackDTO.travelDateTo, "yyyy-MM-dd'T'HH:mm:ss'Z'");
                } else if (data.applyType === 1002) {
                    data.trafficPlanDTOs[0].departDate = $filter('date')(data.trafficPlanDTOs[0].departDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
                    data.trafficPlanDTOs[0].returnDate = $filter('date')(data.trafficPlanDTOs[0].returnDate, "yyyy-MM-dd'T'HH:mm:ss'Z'");
                }
                return $http({
                    url: ServiceBaseURL.url + '/api/workflow/travel/apply/draft',
                    method: 'POST',
                    data: data
                });
            },
            //重新保存
            saveTravelAgain: function (taskId, data) {
                return $http({
                    url: ServiceBaseURL.url + '/api/workflow/travel/apply/reApply_draft/' + taskId,
                    method: 'POST',
                    data: data
                });
            },
            //
            getInfoById: function (taskId) {
                return $http.get(ServiceBaseURL.url + '/api/workflow/travel/travel_domain/' + taskId);
            },
            //审批ordinary驳回
            rejectOrdinaryAccount: function (taskId, comment) {
                return $http.post(ServiceBaseURL.url + '/api/workflow/travel/approval/reject/' + taskId + '?comment=' + comment);
            },
            //审批ordinary通过
            agreeOrdinaryAccount: function (taskId) {
                return $http.post(ServiceBaseURL.url + '/api/workflow/travel/approval/pass/' + taskId);
            },
            //获取城市
            getCityInfo: function (searchName, page, size, useType) {
                return $http.get(ServiceBaseURL.url + '/api/city/search/' + searchName + '?page=' + page + '&size=' + size + '&useType=' + useType);
            },
            //获取flyBack
            getFlyBackType: function (costCenterItemOID) {
                return $http.get(ServiceBaseURL.url + '/api/workflow/travel/flybacks?costCenterItemOID=' + costCenterItemOID);
            },

            //获取基准票价
            getBasisPrice: function (startCity, endCity) {
                return $http.get(ServiceBaseURL.url + '/api/standardprice/get?startCity=' + startCity + '&endCity=' + endCity);
            },

            //删除
            deleteTravel: function (taskId) {
                return $http.post(ServiceBaseURL.url + '/api/workflow/travel/apply/cancel/' + taskId);
            },
            //撤回
            recallTravel: function (data) {
                return $http({
                    url: ServiceBaseURL.url + '/api/workflow/travel/recall/' + data,
                    method: 'DELETE'
                });
            },
            //列表
            getTravels: function (applyType, page, size) {
                return $http({
                    url: ServiceBaseURL.url + '/api/v3/workflow/historic/process_instances/my?processKey=travelProcess',
                    method: 'GET',
                    params: {
                        applyType: applyType,
                        page: page,
                        size: size
                    }
                });
            },
            //获取航班信息
            getInformationFromFlight: function (businessCode) {
                return $http.get(ServiceBaseURL.url + '/api/ctrip/order/get?journeyNo=' + businessCode);
            },
            //获取乘机人信息
            getFlybackBeneficiaries: function (userOID) {
                return $http.get(ServiceBaseURL.url + '/api/hrms/get/flyback/beneficiaries?userOID=' + userOID)
            },
            //获取用户本公司配置
            getCompanyConfigurationsUser: function () {
                return $http.get(ServiceBaseURL.url + '/api/company/configurations/user')
            },
            //记录搜索记录
            logHistorySearchStaff: function (userOID) {
                return $http.post(ServiceBaseURL.url + '/api/users/log/search/' + userOID);
            },
            //获取历史搜索员工记录
            getHistorySearchStaff: function () {
                return $http.get(ServiceBaseURL.url + '/api/users/search/history');
            },
            //搜索员工
            searchStaff: function (searchName, page, size) {
                // searchName = $.trim(searchName).replace(/\s+/g,'*');
                return $http.get(ServiceBaseURL.url + '/api/search/users/by/' + searchName + '?page=' + page + '&size=' + size)
            }
        }
    }]);
