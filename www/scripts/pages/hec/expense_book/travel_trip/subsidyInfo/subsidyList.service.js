/**
 * Created by Dawn on 2017/9/14.
 */
(function () {
    'use strict';
    angular.module('huilianyi.services')
        .factory('subsidyListService', ['$http', '$q', 'ServiceBaseURL', '$timeout', 'localStorageService','LocalStorageKeys',
            function ($http, $q,  ServiceBaseURL, $timeout, localStorageService,LocalStorageKeys) {
                var factory = {
                    ////已导入的补贴信息列表
                    getImportSubsidyList:getImportSubsidyList,
                    //获取未导入的补贴信息列表
                    getSubsidyList: getSubsidyList,
                    //导入接口
                    importSubsidyItem:importSubsidyItem,
                    //重新获取数据
                    tripSubsidyGet:tripSubsidyGet,
                    //补贴信息保存
                    save:save,
                    deleteSubsidy:deleteSubsidy
                };
                return factory;

                //已导入的补贴信息列表
                function getImportSubsidyList(id,page,size) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_subsidy_select",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "action":"query",
                        "exp_requisition_header_id":id,
                        "pagenum": typeof page === 'number' ? page : 1,
                        "pagesize":typeof size === 'number' ? size : LocalStorageKeys.hec_pagesize,
                        "fetchall":"false"
                    };
                    return $http.post(url,params);
                }


                /**
                 * 根据data_type获取未导入或者
                 * @param data_type 数据类型
                 * @param id  费用申请头id
                 * @param page 页码
                 * @param size 页大小
                 * @returns {HttpPromise}
                 */
                function getSubsidyList(id,page,size) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_subsidy_new_select",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "action":"query",
                        "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                        "exp_requisition_header_id":id,
                        "pagenum": typeof page === 'number' ? page : 1,
                        "pagesize":typeof size === 'number' ? size : LocalStorageKeys.hec_pagesize,
                        "fetchall":"false"
                    };
                    return $http.post(url,params);
                }

                /**
                 * 补贴信息导入
                 * @param param 补贴信息对象
                 * @returns {HttpPromise}
                 */
                function importSubsidyItem(param) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_subsidy_new",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "action":"submit",
                        "parameter":param
                    };
                    return $http.post(url,params);
                }

                /**
                 * 重新获取金额与币种
                 * @param subsidy
                 * @returns {HttpPromise}
                 */
                function tripSubsidyGet(subsidy,stateCode,expReqHeaderId) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var parameter = {};
                    var dataType = "trip_subsidy_inside_get";//国内
                    if(stateCode == '1015'){//国外
                        dataType = "trip_subsidy_get";
                        parameter ={
                            "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                            "exp_requisition_header_id":expReqHeaderId,
                            "company_id": subsidy.company_id,
                            "travel_standard":subsidy.travel_standard,
                            "place_to_id": subsidy.place_to_id,
                            "travel_days":subsidy.travel_days,
                            "planned_days": subsidy.planned_days,
                            "actual_days":subsidy.actual_days,
                            "meals_number":subsidy.meals_number,
                            "provided_meals_days":subsidy.provided_meals_days,
                            "treatment_level_type_code":subsidy.treatment_level_type_code,
                            "roommate_id":subsidy.roommate_id,
                            "meanwhile_report_flag":subsidy.meanwhile_report_flag,
                            "_status":"execute"
                        };
                    }else{
                        parameter = {
                            "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                            "exp_requisition_header_id":expReqHeaderId,
                            "company_id": subsidy.company_id,
                            "place_to_id": subsidy.place_to_id,
                            "actual_days": subsidy.actual_days,
                            "subsidy_days": subsidy.subsidy_days,
                            "travel_standard":subsidy.travel_standard,
                            "roommate_id":subsidy.roommate_id,
                            "meanwhile_report_flag":subsidy.meanwhile_report_flag,
                            "_status":"execute"
                        };
                    }
                    var params = {
                        "data_type":dataType,
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "action":"submit",
                        "parameter":[parameter]
                    };
                    return $http.post(url,params);
                }

                /**
                 * 补贴信息保存接口
                 * @param param 补贴信息对象
                 * @returns {HttpPromise}
                 */
                function save(param) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_subsidy_save",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "action":"submit",
                        "parameter":param
                    };
                    return $http.post(url,params);
                }


                function deleteSubsidy(param) {
                    var url = ServiceBaseURL.hec_interface_url;
                    var params = {
                        "data_type":"trip_subsidy_delete",
                        "lang":localStorageService.get(LocalStorageKeys.hec_language_code),
                        "action":"submit",
                        "parameter":param
                    };
                    return $http.post(url,params);
                }
            }])
})();
