/**
 * Created by Yuko on 16/10/26.
 */
'use strict'
angular.module('huilianyi.services')
    .factory('CustomApplicationServices', ['$http', 'ServiceBaseURL', '$q', '$sessionStorage', 'ServiceHttpURL',
        function ($http, ServiceBaseURL, $q, $sessionStorage, ServiceHttpURL) {
            var tab = null;
            return {
                getTab: function () {
                    return tab;
                },
                setTab: function (state) {
                    tab = state;
                    return tab;
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
                },

                /**
                 * 获取本人可以创建的申请单列表
                 * @returns 本人可以创建的表单列表
                 */
                getApplicationFormsCanSelect: function(){
                    var deferred = $q.defer();
                    var customForm = $sessionStorage.applicationForm;
                    if (customForm) {
                        deferred.resolve(customForm);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/custom/forms/company/my/available/all/', {
                                params: {
                                    formType:101
                                }})
                            .success(function (data) {
                                $sessionStorage.applicationForm = data;
                                deferred.resolve(data);
                            }).error(function (error) {
                            deferred.reject(error);
                        })
                    }
                    return deferred.promise;
                },

                getCustomApplication: function (formOID) {
                    return $http.get(ServiceBaseURL.url + '/api/get/exchange/rate?companyOID=' + formOID);
                },
                submitCustomApplication: function (data) {
                    return $http.post(ServiceBaseURL.url + '/api/travel/booker/applications/submit', data);
                },
                submitBorrowApply: function (applyData) {
                    return $http.post(ServiceBaseURL.url + '/api/loan/application/submit', applyData);
                },
                saveCustomApplication: function (data) {
                    return $http.post(ServiceBaseURL.url + '/api/travel/booker/applications/draft', data);
                },
                saveBorrowApply: function (data) {
                    return $http.post(ServiceBaseURL.url + '/api/loan/application/draft', data);
                },
                getCustomApplicationList: function (status, page, size) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/applications/all',
                        method: 'GET',
                        params: {
                            status: status,
                            page: page,
                            size: size,
                        }
                    });

                    //test
                    // return $http.get(ServiceBaseURL.url + '/api/travel/booker/applications/my?applicationStatusEnumId=' + status + '&page=' + page + '&size=' + size);
                },
                withdrawApplication: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/approvals/withdraw',
                        method: 'POST',
                        data: data
                    });
                },
                deleteApplication: function (url, applicationOID) {
                    return $http.delete(ServiceBaseURL.url + url + applicationOID);
                },
                getApplicationDetail: function (url, applicationOID) {
                    //var url = '/api/travel/booker/order/'; //test
                    return $http.get(ServiceBaseURL.url + url + applicationOID);
                },
                getUserDetail: function (userOID) {
                    return $http.get(ServiceBaseURL.url + '/api/contact/bank/account/user/' + userOID);
                },
                getBookers: function (name, page, size) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/travel/booker/get/bookers',
                        method: 'GET',
                        params: {
                            name: name,
                            page: page,
                            size: size
                        }
                    });
                },
                refund: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/travel/booker/order/apply/refund',
                        method: 'GET',
                        params: {
                            travelOrderOID: data.travelOrderOID,
                            remark: data.remark
                        }
                    })
                },
                endorse: function (data) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/travel/booker/order/apply/endorse',
                        method: 'GET',
                        params: {
                            travelOrderOID: data.travelOrderOID,
                            remark: data.remark
                        }
                    })
                },
                getTravelElementList: function (formOID) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/custom/forms/travel/elements/' + formOID,
                        method: 'GET'
                    })
                },
                getApplyList: function (status, page, size) {
                    return $http.get(ServiceBaseURL.url + '/api/loan/application/my?status=' + status + '&page' + page + '&size' + size);
                },
                //根据差旅oid删除差旅补贴
                deleteAllowance: function (applicationOID) {
                    return $http.delete(ServiceBaseURL.url + '/api/travelsubsidiess/by/application?applicationOID=' + applicationOID);
                },
                //根据差旅oid查询差补详细
                getAllowanceDetail: function (applicationOID) {
                    return $http.get(ServiceBaseURL.url + '/api/travelsubsidiess/by/application?applicationOID=' + applicationOID);

                },
                //保存差补
                saveAllowance: function (data) {
                    return $http.post(ServiceBaseURL.url + '/api/travel/applications/draft', data);

                },
                getStandardAllowance: function (cityCode, userOIDArr) {
                    var deferred = $q.defer();
                    $http({
                        url: ServiceBaseURL.url + '/api/travelstandardsettings/by?toCityCode=' + cityCode + '&userOIDs=' + userOIDArr,
                        method: 'GET'
                    }).success(function (res) {// res是一个对象
                        var groupList = [];
                        for(var userOID in res){
                            //key是userOID
                            var allowanceList = res[userOID];
                            //改用户的所有补贴列表
                            for (var i = 0; i < allowanceList.length; i++){
                                var exist = false;
                                //检查该条件（金额和费用类型）是否已经在groupList里面了
                                for (var j = 0; j < groupList.length; j++){
                                    if (groupList[j] && groupList[j].expenseTypeOID == allowanceList[i].expenseTypeOID && groupList[j].amount == allowanceList[i].amount){
                                        //相同条件已经存在了，把userOID加入属性中，跳出循环
                                        exist = true;
                                        groupList[j].userOIDList.push(userOID);
                                        break;
                                    }
                                }
                                if (!exist){
                                    //没有找到相同条件的，则创造一个新的group对象，作为新的条件
                                    var group = {
                                        //如果需要新的字段，在这里添加
                                        expenseTypeName: allowanceList[i].expenseTypeName,
                                        expenseTypeOID: allowanceList[i].expenseTypeOID,
                                        amount: allowanceList[i].amount,
                                        userOIDList: [userOID]
                                    };
                                    groupList.push(group)
                                }
                            }
                        }
                        //groupList返回的格式如下，根据费用类型和金额进行分组，把相同条件的人员放入同一组
                        //var groupList = [
                        //    {
                        //        expenseTypeName: '餐饮',
                        //        expenseTypeOID :"cc6a8a2b-a7d5-4c9b-960c-c4f62e3d2a78",
                        //        amount: 100,
                        //        userOIDList: ['af0995c3-7891-42c9-a2c8-67b008fd0e74','af0995c3-7891-42c9-a2c8-67b008fd0e74']
                        //
                        //    }
                        //]
                        deferred.resolve(groupList);
                    }).error(function (err) {
                        deferred.reject(err);
                    });
                    return deferred.promise;
                },
                searchUserByOIDs:function(userOIDs){
                    return $http.get(ServiceBaseURL.url+'/api/users/oids?userOIDs='+userOIDs);
                },
                searchAllowanMoney:function(toCityCode,userOIDs){
                    return $http.get(ServiceBaseURL.url + '/api/travelstandardsettings/totalamount?toCityCode='+toCityCode+'&userOIDs='+userOIDs)

                },
                getReceiptDetails: function (companyReceiptedOID) {
                    return $http.get(ServiceBaseURL.url + '/api/company/receipted/invoices/users/' + companyReceiptedOID);
                },
                getOwnerAccount: function () {
                    return $http({
                        method: 'GET',
                        url: ServiceBaseURL.url + '/api/contact/bank/account/my'
                    })
                },
                getAllBank: function (page, size, bankName) {
                    return $http.get(ServiceBaseURL.url + '/api/repayment/bank/list?page=' + page + '&size=' + size + '&bankName=' + bankName);
                },
                commitRefund: function (refundData) {
                    return $http({
                        method: 'POST',
                        url: ServiceBaseURL.url + '/api/repayment/submit',
                        data: refundData
                    })
                },
                getRefundDetail: function (applicationOID) {
                    return $http.get(ServiceBaseURL.url + '/api/repayment/detail/' + applicationOID);
                },
                getPayExpenseDetail: function (applicationOID) {

                },
                getRefundList: function (applicationOID) {
                    return $http.get(ServiceBaseURL.url + '/api/repayment/list?loanApplicationOid='+applicationOID);

                },
                getRefundStatusDetail: function (repaymentOid) {
                    return $http.get(ServiceBaseURL.url + '/api/repayment/detail/' + repaymentOid);
                },
                //删除申请单api
                deleteApplicationForAll: function (applicationOID) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/applications/all/' + applicationOID,
                        method: 'DELETE',
                    })
                },
                //获取差旅申请单的 profile
                getTravelApplicationProfile: function () {
                    return $http.get(ServiceBaseURL.url + '/api/applications/property');
                },
                //新增机票行程
                createFlightItinerary: function (applicationOID, data) {
                    return $http({
                            method: 'POST',
                            url: ServiceBaseURL.url + '/api/travel/flight/itinerary',
                            params: {
                                applicationOID: applicationOID
                            },
                            data: data
                        })
                },
                modifyFlightItinerary: function (data) {
                    return $http({
                        method: 'PUT',
                        url: ServiceBaseURL.url + '/api/travel/flight/itinerary',
                        data: data
                    })
                },
                deleteFlightItinerary: function (flightItineraryOID) {
                    return $http({
                        method: 'DELETE',
                        url: ServiceBaseURL.url + '/api/travel/flight/itinerary',
                        params: {
                            flightItineraryOID: flightItineraryOID
                        }
                    })
                },
                getFlightItinerary: function (flightItineraryOID) {
                    return $http({
                        method: 'GET',
                        url: ServiceBaseURL.url + '/api/travel/flight/itinerary',
                        params: {
                            flightItineraryOID: flightItineraryOID
                        }
                    })
                },
                //新增酒店行程
                createHotelItinerary: function (applicationOID, data) {
                    return $http({
                        method: 'POST',
                        url: ServiceBaseURL.url + '/api/travel/hotel/itinerary',
                        params: {
                            applicationOID: applicationOID
                        },
                        data: data
                    })
                },
                modifyHotelItinerary: function (data) {
                    return $http({
                        method: 'PUT',
                        url: ServiceBaseURL.url + '/api/travel/hotel/itinerary',
                        data: data
                    })
                },
                deleteHotelItinerary: function (hotelItineraryOID) {
                    return $http({
                        method: 'DELETE',
                        url: ServiceBaseURL.url + '/api/travel/hotel/itinerary',
                        params: {
                            hotelItineraryOID: hotelItineraryOID
                        }
                    })
                },
                //新增火车行程
                createTrainItinerary: function (applicationOID, data) {
                    return $http({
                            method: 'POST',
                            url: ServiceBaseURL.url + '/api/travel/train/itinerary',
                            params: {
                                applicationOID: applicationOID
                            },
                            data: data
                        })
                },
                modifyTrainItinerary: function (data) {
                    return $http({
                        method: 'PUT',
                        url: ServiceBaseURL.url + '/api/travel/train/itinerary',
                        data: data
                    })
                },
                deleteTrainItinerary: function (trainItineraryOID) {
                    return $http({
                        method: 'DELETE',
                        url: ServiceBaseURL.url + '/api/travel/train/itinerary',
                        params: {
                            trainItineraryOID: trainItineraryOID
                        }
                    })
                },
                getTrainItinerary: function (trainItineraryOID) {
                    return $http({
                        method: 'GET',
                        url: ServiceBaseURL.url + '/api/travel/train/itinerary',
                        params: {
                            trainItineraryOID: trainItineraryOID
                        }
                    })
                },
                //新增其他行程
                createOtherItinerary: function (applicationOID, data) {
                    return $http({
                        method: 'POST',
                        url: ServiceBaseURL.url + '/api/travel/other/itinerary',
                        params: {
                            applicationOID: applicationOID
                        },
                        data: data
                    })
                },
                modifyOtherItinerary: function (data) {
                    return $http({
                        method: 'PUT',
                        url: ServiceBaseURL.url + '/api/travel/other/itinerary',
                        data: data
                    })
                },
                deleteOtherItinerary: function (otherItineraryOID) {
                    return $http({
                        method: 'DELETE',
                        url: ServiceBaseURL.url + '/api/travel/other/itinerary',
                        params: {
                            otherItineraryOID: otherItineraryOID
                        }
                    })
                },
                getOtherItinerary: function (otherItineraryOID) {
                    return $http({
                        method: 'GET',
                        url: ServiceBaseURL.url + '/api/travel/other/itinerary',
                        params: {
                            otherItineraryOID: otherItineraryOID
                        }
                    })
                },
                //新增差补
                createAllowanceItinerary: function (applicationOID, data) {
                    data.startDate = data.startDate + ' 00:00:00';
                    data.endDate = data.endDate + ' 00:00:00';
                    return $http({
                        method: 'POST',
                        url: ServiceBaseURL.url + '/api/travel/subsidies/generate',
                        params: {
                            applicationOID: applicationOID,
                            startDate: data.startDate,
                            endDate: data.endDate,
                            areaCode: data.areaCode,
                            areaName: data.areaName
                        },
                        data: data
                    })
                },
                //获取火车供应商
                getTrainSupplier: function () {
                    //todo
                    return $http.get(ServiceBaseURL.url + '/api/repayment/detail/');
                },
                //获取备注详情
                getItineraryDetail: function (applicationOID, remarkDate) {
                    if(remarkDate != null && remarkDate != ''){
                        remarkDate = new Date(remarkDate).Format('yyyy-MM-dd') + ' 00:00:00';
                    }
                    return $http({
                            method: 'GET',
                            url: ServiceBaseURL.url + '/api/travel/applications/itinerarys',
                            params: {
                                applicationOID: applicationOID,
                                remarkDate: remarkDate
                            }
                        })
                },
                //获取单据所有行程
                getAllItinerary: function (applicationOID, itineraryShowDetails) {
                    return $http({
                        method: 'GET',
                        url: ServiceBaseURL.url + '/api/travel/applications/itinerarys',
                        params: {
                            applicationOID: applicationOID,
                            itineraryShowDetails: itineraryShowDetails
                        }
                    })
                },
                //停用申请单
                closeApplication: function (applicationOID, participantOID) {
                    return $http({
                            method: 'POST',
                            url: ServiceBaseURL.url + '/api/applications/close',
                            params: {
                                applicationOID: applicationOID,
                                participantOID: participantOID
                            }
                        })
                },
                //重新启用申请单
                restartApplication: function (applicationOID, participantOID, closeDay) {
                    return $http({
                        method: 'POST',
                        url: ServiceBaseURL.url + '/api/applications/restart',
                        params: {
                            applicationOID: applicationOID,
                            participantOID: participantOID,
                            closeDay: closeDay
                        }
                    })
                },
                //修改停用时间
                modifyCloseDate: function (applicationOID, participantOID, closeDate) {
                    return $http({
                        method: 'POST',
                        url: ServiceBaseURL.url + '/api/applications/changeCloseDate',
                        params: {
                            applicationOID: applicationOID,
                            participantOID: participantOID,
                            closeDate: closeDate
                        }
                    })
                },
                //获取管理员列表
                getAdminList: function (companyOID, page, size) {
                    return $http({
                            method: 'GET',
                            url: ServiceBaseURL.url + '/api/account/get/admin/' + companyOID,
                            params: {
                                page: page,
                                size: size
                            }
                        })
                },
                //通过表单类型获取申请单配置
                getApplicationProfile: function (type) {
                    return $http({
                        method: 'GET',
                        url: ServiceBaseURL.url + '/api/applications/property/type/' + type
                    })
                },
                //判断某些是否在参与人列表
                getUserInForm: function (data) {
                    var item = [];
                    var i = 0
                    if(data.costCentreOID.length > 0){
                        item = [];
                        for(; i < data.costCentreOID.length; i++){
                            if(data.costCentreOID[i].name){
                                item.push(data.costCentreOID[i].name);
                            }
                        }
                    }
                    if(i == data.costCentreOID.length){
                        return $http({
                            method: 'GET',
                            url: ServiceBaseURL.url + '/api/application/participant',
                            params: {
                                formOID: data.formOID,
                                participantsOID: data.participantsOID,
                                departmentOID: data.departmentOID,
                                proposerOID: data.proposerOID,
                                costCentreOID: item
                            }
                        })
                    }
                },
                //获取表单可以关联的参与人列表
                getFormParticipantList: function (data, page, size, keyword) {
                    var item = [];
                    var i = 0
                    if(data.costCentreOID.length > 0){
                        item = [];
                        for(; i < data.costCentreOID.length; i++){
                            if(data.costCentreOID[i].name){
                                item.push(data.costCentreOID[i].name);
                            }
                        }
                    }
                    if(i == data.costCentreOID.length){
                        return $http({
                            method: 'GET',
                            url: ServiceBaseURL.url + '/api/application/participantsList',
                            params: {
                                formOID: data.formOID,
                                departmentOID: data.departmentOID,
                                proposerOID: data.proposerOID,
                                costCentreOID: item,
                                page: page,
                                size: size,
                                keyword: keyword
                            }
                        })
                    }

                },
                //搜索表单可以关联的参与人列表
                searchFormParticipantList: function (data, page, size) {

                },
                //根据时间端生成每天的行程备注结构
                getRemarkItinerary: function (applicationOID, startDate, endDate) {
                    startDate = startDate + ' 00:00:00';
                    endDate = endDate + ' 00:00:00';
                    return $http({
                        method: 'GET',
                        url: ServiceBaseURL.url + '/api/travel/remark/itinerary/generate',
                        params: {
                            applicationOID: applicationOID,
                            startDate: startDate,
                            endDate: endDate
                        }
                    })
                },
                //获取差旅标准
                getTravelAllowanceStandard: function (cityCode, userOIDArr) {
                    return $http({
                        method: 'GET',
                        url: ServiceBaseURL.url + '/api/travelstandardsettings/by',
                        params: {
                            toCityCode: cityCode,
                            userOIDs: userOIDArr,
                        }
                    })
                },
                //保存行程备注
                 saveRemarkItinerary: function (applicationOID, data) {
                     return $http({
                         method: 'POST',
                         url: ServiceBaseURL.url + '/api/travel/itinerary/remark',
                         params: {
                             applicationOID: applicationOID
                         },
                         data: data
                     })
                 },
                //获取供应商列表v2:
                getAllSupplier: function () {
                    return $http({
                        method: 'GET',
                        url: ServiceBaseURL.url + '/api/v2/suppliers',
                    })
                },
                //查询申请单是否含有携程酒店、机票行程以及机票最大数量
                getMaxTicket: function (applicationOID) {
                    return $http({
                            method: 'GET',
                            url: ServiceBaseURL.url + '/api/travel/application/itinerary/ctrip/exist',
                            params: {
                                applicationOID: applicationOID
                            }
                        })
                },
                //获取酒店房间数量
                getHotelMaxRoom: function (data, externalParticipantNumber) {
                    if(externalParticipantNumber &&  externalParticipantNumber > 0 ){
                        return $http({
                            method: 'POST',
                            url: ServiceBaseURL.url + '/api/travel/application/hotel/room/share',
                            data: data,
                            params: {
                                externalParticipantNumber: externalParticipantNumber
                            }
                        })
                    } else {
                        return $http({
                            method: 'POST',
                            url: ServiceBaseURL.url + '/api/travel/application/hotel/room/share',
                            data: data
                        })
                    }

                },
                //获取随机酒店预定人
                getRandomHotelBooker: function (data) {
                    return $http({
                        method: 'POST',
                        url: ServiceBaseURL.url + '/api/travel/application/random/booking/clerk',
                        data: data
                    })
                },
                //获取城市code
                getCityCode: function (keyword, lang, type) {
                    if(!lang || lang == '' || lang == null || lang == undefined){
                        lang = 'zh_cn';
                    }
                    if(lang == 'en'){
                        lang = 'en_us';
                    }
                    return $http({
                        method: 'GET',
                        url: ServiceBaseURL.url + '/location-service/api/location/search',
                        headers: {
                            language: lang
                        },
                        params: {
                            vendorType: 'standard',
                            keyWord: keyword,
                            type: type
                        }
                    })
                },
                //打印申请单
                printApplication: function (applicationOID) {
                    return $http.get(ServiceBaseURL.url + '/api/loan/application/generate/pdf/' + applicationOID);
                },
                //判断某个城市是否在该供应商城市列表
                isCityInVendor: function (vendorType, code, lang) {
                    if(!lang || lang == '' || lang == null || lang == undefined){
                        lang = 'zh_cn'
                    }
                    if(lang == 'en'){
                        lang = 'en_us';
                    }
                    return $http({
                        method: 'GET',
                        url: ServiceBaseURL.url + '/location-service/api/vendor/aliases/' + vendorType + '/' + code,
                        headers: {
                            language: lang
                        }
                    })
                }
            }
        }]);
