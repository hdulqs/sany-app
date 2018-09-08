/**
 * Created by boyce1 on 2016/7/14.
 */
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.ordinary_travel', {
                url: '/ordinary/travel/{ordinaryMsg}/{ordinaryId}/{processInstanceId}',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/travel/ordinary.travel.html',
                        controller: 'OrdinaryTravelController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('travel');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('OrdinaryTravelController', ['$scope','$cordovaDatePicker', 'Principal', '$filter', 'ParseLinks', '$ionicPopup', '$timeout', 'CtripService', '$stateParams', 'WorkflowService', '$state', '$ionicModal',
        'CostCenterService', 'TravelService', '$ionicLoading', 'LANG',
        function ($scope,$cordovaDatePicker, Principal, $filter, ParseLinks, $ionicPopup, $timeout, CtripService, $stateParams, WorkflowService, $state, $ionicModal, CostCenterService, TravelService, $ionicLoading, LANG) {
            $scope.view = {
                startTime: '',
                finishTime: '',
                ordinaryMsg: null,
                checkDetails: '',//hasPass/waitApproval
                //costCenterItemOID: null,
                showLittleIcon: false,
                durationFrom: {value: $filter('translate')('ordinary.pleaseChioceStartDate'), name: $filter('translate')('ordinary.js.pleaseChioceDepartTime')},//请选择开始日期--请选择出发时间
                durationTo: {value: $filter('translate')('ordinary.js.pleaseChioceEndDate'), name: $filter('translate')('ordinary.js.pleaseChioceEndTime')},//请选择结束日期--请选择结束时间
                disabled: false,
                comment: '',
                hasHeader: false,
                userMatch: true,
                isExpiration: true,
                processInstanceId: '',
                statusInfo: {
                    messages: []
                },
                ordinaryApplication: {
                    routeCity: [{id: 0, value: $filter('translate')('ordinary.js.shanghai')}],//上海
                    airRoute: [],
                    unreasonable: false
                },
                cityInfo: {
                    comeForm: '',
                    currentPage: 0,
                    size: 10,
                    links: null,
                    searchName: '',
                    cityData: '',
                    citys: [$filter('translate')('ordinary.js.shanghai'), $filter('translate')('ordinary.js.beijing'), $filter('translate')('ordinary.js.xianggang'), $filter('translate')('ordinary.js.shengzheng'), $filter('translate')('ordinary.js.guangzou'), $filter('translate')('ordinary.js.wuxi'), $filter('translate')('ordinary.js.changsha'), $filter('translate')('ordinary.js.wuhan')]//'上海', '北京', '香港', '深圳', '广州', '无锡', '长沙', '武汉'
                },
                staffInfo: {
                    comeForm: '',
                    searchName: '',
                    size: 10,
                    links: null,
                    staff: []
                },
                getDatePickerTitle: function (name) {
                    return name;
                },
                prompt: function (text, time) {
                    $ionicLoading.show({
                        template: text,
                        duration: time
                    });
                }
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });

            $scope.datePicker = {
                selectDate: function(string){
                    var dateOptions={
                        date: new Date(),
                        mode: 'date',
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('create.arrange.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('create.arrange.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        locale: LANG
                    };
                    $cordovaDatePicker.show(dateOptions).then(function(date){
                        if (date) {
                            if (string == 'startTime') {
                                $scope.view.startTime = date;
                            } else if (string == 'finishTime') {
                                $scope.view.finishTime = date;
                            }
                        }
                    });
                }
            };
            //保存
            $scope.saveApplication = function () {
                $scope.view.disabled = true;
                $scope.view.ordinaryApplication.airRoute = [];
                if ($scope.view.type === $filter('translate')('ordinary.js.TravelApplicationDetails')) {//差旅申请详情
                    if ($scope.view.startTime === '' && $scope.view.finishTime === '' && $scope.view.comment === ''
                        && $scope.view.ordinaryApplication.routeCity.length <= 1) {
                        $scope.view.prompt($filter('translate')('ordinary.js.notSave'), 1500);//您没有填写任何信息，不能保存
                        $scope.view.disabled = false;
                    } else {
                        for (var i = 0; i < $scope.view.ordinaryApplication.routeCity.length; i++) {
                            $scope.view.ordinaryApplication.airRoute.push($scope.view.ordinaryApplication.routeCity[i].value);
                        }
                        var newData = {
                            "applyType": 1002,
                            "comment": $scope.view.comment,
                            //"costCenterItemOID": null,
                            //"costCenterItemName": null,
                           // "departmentOID": null,
                          //  "departmentName": null,
                            "flybackDTO": null,
                            "stayPlanDTOs": null,
                            "trafficPlanDTOs": [{
                                "advanceReserveLimit": 0,
                                "airline": "string",
                                "budgetAmount": 0,
                                "departDate": $scope.view.startTime,
                                "departDuration": "",
                                "flightWay": "string",
                                "fromCity": "",
                                "international": true,
                                "returnDate": $scope.view.finishTime,
                                "returnDuration": "",
                                "roundTrip": true,
                                "seatClass": "",
                                "toCity": "",
                                "travelMethod": "String",
                                "airRoute": $scope.view.ordinaryApplication.airRoute
                            }]
                        };
                        if ($scope.view.ordinaryMsg === 'create') {
                            TravelService.saveTravel(newData).success(function (data) {
                                $scope.view.prompt($filter('translate')('ordinary.js.yetSave'), 500);//已保存
                                $state.go('app.travel_list');

                            })
                        } else if ($scope.view.ordinaryMsg === 'editting' || $scope.view.ordinaryMsg === 'hasReject') {
                            TravelService.saveTravelAgain($scope.view.ordinaryId, newData).success(function (data) {
                                $scope.view.prompt($filter('translate')('ordinary.js.yetSave'), 500);//已保存
                                $state.go('app.travel_list');
                            })
                        } else if ($scope.view.ordinaryMsg === 'TravelRejectFromMsg') {
                            TravelService.saveTravelAgain($scope.view.statusInfo.taskId, newData).success(function (data) {
                                $scope.view.prompt($filter('translate')('ordinary.js.yetSave'), 500);//已保存
                               $state.go('app.notification')
                            })
                        }
                        //if ($scope.view.costCenterItemOID) {
                        //    CostCenterService.logLastCostCenterItem($scope.view.costCenterItemOID);
                        //}
                    }
                }
            };
            //提交
            $scope.ordinaryCommit = function () {
                $scope.view.disabled = true;
                $scope.view.ordinaryApplication.airRoute = [];
                for (var i = 0; i < $scope.view.ordinaryApplication.routeCity.length; i++) {
                    $scope.view.ordinaryApplication.airRoute.push($scope.view.ordinaryApplication.routeCity[i].value);
                }
                if ($scope.view.startTime !== '' && $scope.view.finishTime !== '' && $scope.view.comment !== ''
                    && $scope.view.ordinaryApplication.routeCity.length > 1) {
                    for (var i = 0; i < $scope.view.ordinaryApplication.routeCity.length - 1; i++) {
                        if ($scope.view.ordinaryApplication.routeCity[i].value === $scope.view.ordinaryApplication.routeCity[i + 1].value) {
                            $scope.view.ordinaryApplication.unreasonable = true;
                        }
                    }
                    if ($scope.view.finishTime < $scope.view.startTime) {
                        $scope.view.disabled = false;
                        $scope.view.prompt($filter('translate')('ordinary.js.endDateStartDate'), 1000);//结束日期不能小于开始日期
                        return;
                    }

                    if ($scope.view.ordinaryApplication.unreasonable) {
                        $scope.view.prompt($filter('translate')('ordinary.js.pleaseInputBusinessTrip'), 1500);//请输入合理的出差行程
                        $scope.view.disabled = false;
                    } else {
                        var newData = {
                            "applyType": 1002,
                            "comment": $scope.view.comment,
                            //"costCenterItemOID": null,
                           // "costCenterItemName": null,
                          //  "departmentOID": null,
                           // "departmentName": null,
                            "flybackDTO": null,
                            "stayPlanDTOs": null,
                            "trafficPlanDTOs": [{
                                "advanceReserveLimit": 0,
                                "airline": "string",
                                "budgetAmount": 0,
                                "departDate": $scope.view.startTime,
                                "departDuration": "",
                                "flightWay": "string",
                                "fromCity": "",
                                "international": true,
                                "returnDate": $scope.view.finishTime,
                                "returnDuration": "",
                                "roundTrip": true,
                                "seatClass": "",
                                "toCity": "",
                                "travelMethod": "String",
                                "airRoute": $scope.view.ordinaryApplication.airRoute
                            }]
                        };
                        if ($scope.view.ordinaryMsg === 'create') {
                            TravelService.createOrdinaryApplication(newData)
                                .success(function (data) {
                                    $state.go('app.travel_list');

                                })
                        } else if ($scope.view.ordinaryMsg === 'editting' || $scope.view.ordinaryMsg === 'hasReject') {
                            TravelService.createOrdinaryApplicationAgain($scope.view.ordinaryId, newData).success(function (data) {
                                $state.go('app.travel_list');
                            }).error(function (data) {
                                $scope.view.ordinaryApplication.airRoute = [];
                            })
                        } else if ($scope.view.ordinaryMsg === 'TravelRejectFromMsg') {
                            TravelService.createOrdinaryApplicationAgain($scope.view.statusInfo.taskId, newData)
                                .success(function (data) {
                                   $state.go('app.notification');
                                })
                        }
                        //if ($scope.view.costCenterItemOID) {
                        //    CostCenterService.logLastCostCenterItem($scope.view.costCenterItemOID);
                        //}
                    }
                } else {
                    $scope.view.disabled = false;
                    if ($scope.view.startTime === '' || $scope.view.finishTime === '') {
                        $scope.view.prompt($filter('translate')('ordinary.js.pleaseChioceEvectionDate'), 1500);//请选择完整出差日期
                    } else if ($scope.view.comment === '') {
                        $scope.view.prompt($filter('translate')('ordinary.js.pleaseInputReasons'), 1500);//请填写事由
                    }
                    //else if ($scope.view.costCenterItemOID === '' || $scope.view.costCenterItemOID === null) {
                    //    $scope.view.prompt('请选择成本归属中心', 1500);
                    //}
                    else if ($scope.view.ordinaryApplication.routeCity.length <= 1) {
                        $scope.view.prompt($filter('translate')('ordinary.js.pleasePerfectStroke'), 1500);//请完善出差行程
                    }
                }
            };
            $scope.changeCity = function (index, item) {
                $scope.view.ordinaryApplication.unreasonable = false;
                $scope.view.cityInfo.cityData = item;
                $scope.view.changeId = index;
                $scope.selectCity.show();
            };
            $ionicModal.fromTemplateUrl('scripts/pages/travel/select.city.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.selectCity = modal;
            });
            $scope.closeSelectCity = function () {
                $scope.view.cityInfo.searchName = '';
                $scope.view.cityInfo.comeForm = '';
                $scope.selectCity.hide();
            };
            //添加城市
            $scope.goCheckCity = function (comeFormTo) {
                $scope.view.cityInfo.comeForm = comeFormTo;
                $scope.selectCity.show();
            };
            //选择城市
            $scope.choiceCity = function (item) {
                if ($scope.view.cityInfo.cityData !== '') {
                    if (item === '') {
                        $scope.view.ordinaryApplication.routeCity.splice($scope.view.ordinaryApplication.routeCity.indexOf($scope.view.cityInfo.cityData), 1);
                    } else {
                        if ($scope.view.changeId !== -1) {
                            if ($scope.view.changeId - 1 >= 0) {
                                if ($scope.view.ordinaryApplication.routeCity[$scope.view.changeId - 1].value !== item) {
                                    if ($scope.view.changeId + 1 < $scope.view.ordinaryApplication.routeCity.length) {
                                        if ($scope.view.ordinaryApplication.routeCity[$scope.view.changeId + 1].value !== item) {
                                            $scope.view.ordinaryApplication.routeCity[$scope.view.ordinaryApplication.routeCity.indexOf($scope.view.cityInfo.cityData)].value = item;
                                        } else {
                                            $scope.view.prompt($filter('translate')('ordinary.js.pleaseInputCity'), 1500);//请填写合理的城市
                                        }
                                    } else {
                                        $scope.view.ordinaryApplication.routeCity[$scope.view.ordinaryApplication.routeCity.indexOf($scope.view.cityInfo.cityData)].value = item;
                                    }
                                } else {
                                    $scope.view.prompt($filter('translate')('ordinary.js.pleaseInputCity'), 1500);//请填写合理的城市
                                }
                            } else {
                                if ($scope.view.changeId + 1 < $scope.view.ordinaryApplication.routeCity.length) {
                                    if ($scope.view.ordinaryApplication.routeCity[$scope.view.changeId + 1].value !== item) {
                                        $scope.view.ordinaryApplication.routeCity[$scope.view.ordinaryApplication.routeCity.indexOf($scope.view.cityInfo.cityData)].value = item;
                                    } else {
                                        $scope.view.prompt($filter('translate')('ordinary.js.pleaseInputCity'), 1500);//请填写合理的城市
                                    }
                                } else {
                                    $scope.view.ordinaryApplication.routeCity[$scope.view.ordinaryApplication.routeCity.indexOf($scope.view.cityInfo.cityData)].value = item;
                                }
                            }
                        }
                    }
                    $scope.view.cityInfo.cityData = '';
                } else {
                    if ($scope.view.cityInfo.comeForm == 'ordinaryApplication') {
                        if (item !== '') {
                            if ($scope.view.ordinaryApplication.routeCity.length >= 1) {
                                var data = {
                                    id: $scope.view.ordinaryApplication.routeCity[$scope.view.ordinaryApplication.routeCity.length - 1].id + 1,
                                    value: item
                                };
                                if (data.value !== $scope.view.ordinaryApplication.routeCity[$scope.view.ordinaryApplication.routeCity.length - 1].value) {
                                    $scope.view.ordinaryApplication.routeCity.push(data);
                                } else {
                                    $scope.view.prompt($filter('translate')('ordinary.js.pleaseInputCity'), 1500);//请填写合理的城市
                                }
                            } else {
                                var data = {
                                    id: $scope.view.ordinaryApplication.routeCity.length + 1,
                                    value: item
                                };
                                $scope.view.ordinaryApplication.routeCity.push(data);
                            }
                        }
                    }
                    $scope.view.cityInfo.searchName = '';
                    $scope.view.cityInfo.comeForm = '';
                }

                $scope.selectCity.hide();
            };
            //撤回
            $scope.revoke = function () {
                if ($scope.view.processInstanceId !== '') {
                    var confirmPopup = $ionicPopup.confirm({
                        title: $filter('translate')('ordinary.js.operationHint'),//操作提示
                        template: $filter('translate')('ordinary.js.revocationTravelApplication'),//确定撤销差旅申请?
                        cancelText: $filter('translate')('create.arrange.cancel'),//取消
                        okText: $filter('translate')('create.arrange.ok'),//确定
                        cssClass: 'revoke-ordinary-application-popup'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            TravelService.recallTravel($scope.view.processInstanceId).success(function (data) {
                                $state.go('app.travel_list');
                            })
                        } else {
                        }
                    });

                }
            };
            //删除
            $scope.dustbin = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: $filter('translate')('ordinary.js.operationHint'),//操作提示
                    template: $filter('translate')('ordinary.js.DeleteTravelApplication'),//确定删除差旅申请?
                    cancelText: $filter('translate')('create.arrange.cancel'),//取消
                    okText: $filter('translate')('create.arrange.ok'),//确定
                    cssClass: 'delete-ordinary-application-popup'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        if ($scope.view.ordinaryMsg === 'TravelRejectFromMsg') {
                            TravelService.deleteTravel($scope.view.statusInfo.taskId)
                                .success(function (data) {
                                    $state.go('app.notification')
                                })
                        } else {
                            TravelService.deleteTravel($scope.view.ordinaryId).success(function (data) {
                                $state.go('approval.other_expense');
                            })
                        }
                    } else {
                    }
                });
            };

            //提交驳回
            $scope.reject = function () {
                if ($scope.view.ordinaryMsg === 'TravelApprovalFromMsg') {
                    WorkflowService.rejectTravelApproval($scope.view.processInstanceId, $scope.view.comment)
                        .success(function (data) {
                            $scope.view.prompt($filter('translate')('create.next_js.Has.been.rejected'), 500);//已驳回
                            $state.go('app.notification');
                        })

                } else {
                    TravelService.rejectOrdinaryAccount($scope.view.ordinaryId, $scope.view.comment)
                        .success(function (data) {
                            $scope.view.prompt($filter('translate')('create.next_js.Has.been.rejected'), 500);//已驳回
                            $state.go('approval.other_expense');
                        })
                }

            };
            //提交同意
            $scope.agree = function () {
                if ($scope.view.ordinaryMsg === 'TravelApprovalFromMsg') {
                    WorkflowService.agreeTravelApproval($scope.view.processInstanceId)
                        .success(function (data) {
                            $scope.view.prompt($filter('translate')('create.next_js.Has.been.rejected'), 500);//已通过
                            $state.go('app.notification');
                        })

                } else {
                    TravelService.agreeOrdinaryAccount($scope.view.ordinaryId)
                        .success(function (data) {
                            $scope.view.prompt($filter('translate')('create.next_js.Has.been.rejected'), 500);//已通过
                            $state.go('approval.other_expense');
                        })
                }
            };
            //驳回理由
            $scope.showOpinionPopup = function () {
                var opinionPopup = $ionicPopup.show({
                    template: "<textarea type='text' style='padding:10px;' placeholder='" + $filter('translate')('ordinary.js.pleaseInputReason') + "' ng-model='view.comment' rows='6' >",//请输入理由
                    title: "<h5>" + $filter('translate')('create.next_js.Reason.for.rejection') + "</h5>",//驳回理由
                    scope: $scope,
                    buttons: [
                        {text: $filter('translate')('create.arrange.cancel')},//取消
                        {
                            text: $filter('translate')('create.next_js.confirm'),//确认
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.view.comment) {
                                    $scope.view.prompt($filter('translate')('create.next_js.Please.enter.the.reject.reason'), 1000);//请输入驳回理由
                                    e.preventDefault();
                                } else {
                                    return $scope.view.comment;
                                }
                            }
                        }
                    ]
                });
                opinionPopup.then(function (res) {
                    if (res) {
                        $scope.reject();
                    } else {
                    }
                });
            };
            //根据关键字获取城市
            $scope.loadMore = function (page) {
                $scope.view.cityInfo.currentPage = page;
                TravelService.getCityInfo($scope.view.cityInfo.searchName, $scope.view.cityInfo.currentPage, $scope.view.cityInfo.size, 'FLIGHT')
                    .success(function (data, status, headers) {
                        if (data.length === 0) {
                            $scope.view.prompt($filter('translate')('ordinary.js.notConformData'), "1000");//没有符合的数据
                        }
                        $scope.view.cityInfo.links = ParseLinks.parse(headers('link'));
                        for (var i = 0; i < data.length; i++) {
                            $scope.view.cityInfo.citys.push(data[i]);
                        }
                        if ($scope.view.cityInfo.links.last === $scope.view.cityInfo.currentPage && $scope.view.cityInfo.links.last != 0) {
                            $scope.view.prompt($filter('translate')('ordinary.js.notData'), "1000");//没有更多数据了
                        }
                    }).finally(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };
            //监听搜索城市关键字
            $scope.$watch('view.cityInfo.searchName', function (newValue, oldValue) {
                if (newValue !== oldValue && newValue !== '') {
                    $scope.view.cityInfo.citys = [];
                    $scope.loadMore(0);
                } else if (newValue === '') {
                    $scope.view.cityInfo.links = null;
                    $scope.view.cityInfo.citys = [$filter('translate')('ordinary.js.shanghai'), $filter('translate')('ordinary.js.beijing'), $filter('translate')('ordinary.js.xianggang'), $filter('translate')('ordinary.js.shengzheng'), $filter('translate')('ordinary.js.guangzou'), $filter('translate')('ordinary.js.wuxi'), $filter('translate')('ordinary.js.changsha'), $filter('translate')('ordinary.js.wuhan')];//'上海', '北京', '香港', '深圳', '广州', '无锡', '长沙', '武汉'
                }
            });
            //立即购票
            $scope.buyTicket = function () {
                $scope.view.disabled = true;
                CtripService.goTravelBefore('FlightSearch', $scope.view.checkDetails.businessCode).success(function (data) {
                    $scope.view.disabled = false;
                });
            };
            //比较代办人与当前登录用户
            $scope.matchUser = function (taskAsignee) {
                Principal.identity().then(function (data) {
                    if (data.userOID !== taskAsignee) {
                        $scope.view.userMatch = false;
                    }
                });
            };
            //差旅详情审批历史信息
            function historyMessage(data) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].operation === 'apply' || data[i].operation === 'auto_approval') {
                        data[i].operationClass = 'little-icon';
                        data[i].operationImgSrc = 'img/submittypes/littleIcon.png';
                    }
                    if (data[i].operation === 'approval_pass') {
                        data[i].operationClass = 'approval-icon';
                        data[i].operationImgSrc = 'img/submittypes/passIcon.png';
                    }
                    if (data[i].operation === 'approval_reject') {
                        data[i].operationClass = 'approval-icon';
                        data[i].operationImgSrc = 'img/submittypes/rejectIcon.png';
                    }
                }
                return data;
            }
            //获取差旅详情
            function getTravelDetail(data){
                $scope.view.ordinaryApplication.routeCity=[];
                if (data.applyType === 1002) {
                    $scope.view.applyType = 1002;
                    $scope.view.type = $filter('translate')('ordinary.js.TravelApplicationDetails');//差旅申请详情
                    if (data.trafficPlanDTOs[0].departDate === null) {
                        $scope.view.startTime = '';
                    } else {
                        $scope.view.startTime = new Date(data.trafficPlanDTOs[0].departDate);
                    }
                    if (data.trafficPlanDTOs[0].returnDate === null) {
                        $scope.view.finishTime = '';
                    } else {
                        $scope.view.finishTime =new Date( data.trafficPlanDTOs[0].returnDate);
                    }
                    var route = data.trafficPlanDTOs[0].airRoute;
                    if (route) {
                        for (var i = 0; i < route.length; i++) {
                            var data = {
                                id: i,
                                value: route[i]
                            };
                            $scope.view.ordinaryApplication.routeCity.push(data);
                        }
                    }
                }
            }
            //判断立即购票是否失效
            function compareDateExpiration(data){
                var nowTimestamp = new Date().getTime() / 1000;
                var endTime = null;
                var endTimestamp2 = null;
                if (data.invalidDate !== null && data.invalidDate !== '') {
                    endTime = data.invalidDate.substring(0, 10);
                    endTime = endTime + ' 00:00:00';
                    endTimestamp2 = new Date(endTime.replace(/-/g, "/")).getTime() / 1000;
                } else {
                    if (data.applyType === 1002) {
                        endTime = data.trafficPlanDTOs[0].returnDate.substring(0, 10);
                    }
                    endTime = endTime + ' 00:00:00';
                    endTimestamp2 = new Date(endTime.replace(/-/g, "/")).getTime() / 1000 + 345600;//加4天
                }
                if (nowTimestamp > endTimestamp2) {
                    $scope.view.isExpiration = false;
                }
            }

            //差旅状态详情
            function detailsInfo(id, msg) {
                if (msg === 'hasReject' || msg === 'editting') {
                    $scope.view.ordinaryApplication.routeCity = [];
                    TravelService.getInfoById(id).success(function (data) {
                        //if (data.costCenterItemOID === null || data.costCenterItemOID === '') {
                        //    $scope.view.costCenterItemOID = null;
                        //} else {
                        //    $scope.view.costCenterItemOID = data.costCenterItemOID;
                        //}
                        $scope.view.comment = data.comment;
                        $scope.view.statusInfo = data;
                        getTravelDetail(data);
                        $scope.view.statusInfo.messages = historyMessage($scope.view.statusInfo.messages);
                    });
                } else {
                    if (msg === 'TravelPassFromMsg' || msg === 'TravelApprovalFromMsg' || msg === 'TravelRejectFromMsg') {
                        WorkflowService.getMessageTravelDetail(id)
                            .success(function (data) {
                                if (msg === 'TravelRejectFromMsg') {
                                    //$scope.view.costCenterItemOID = data.costCenterItemOID;
                                    $scope.view.comment = data.comment;
                                    $scope.view.statusInfo = data;
                                    getTravelDetail(data);
                                    $scope.view.statusInfo.messages = historyMessage($scope.view.statusInfo.messages);
                                } else {
                                    $scope.matchUser(data.taskAsignee);
                                    $scope.view.checkDetails = data;
                                    $scope.view.processInstanceId = data.taskId;
                                    $scope.view.checkDetails.messages= historyMessage($scope.view.checkDetails.messages);
                                    if (msg === 'TravelPassFromMsg') {
                                        compareDateExpiration($scope.view.checkDetails);
                                    }
                                }

                            });
                    } else {
                        //msg=='hasPass'/'waitApproval'
                        TravelService.getInfoById(id).success(function (data) {
                            $scope.view.checkDetails = data;
                            $scope.view.checkDetails.messages=historyMessage($scope.view.checkDetails.messages);
                            if (msg === 'hasPass') {
                                compareDateExpiration($scope.view.checkDetails);
                            }
                        });
                    }
                }
            }

            (function () {
                if ($stateParams.ordinaryMsg) {
                    $scope.view.ordinaryMsg = $stateParams.ordinaryMsg;
                }
                if ($stateParams.ordinaryId) {
                    $scope.view.ordinaryId = $stateParams.ordinaryId;
                }
                if ($stateParams.processInstanceId) {
                    $scope.view.processInstanceId = $stateParams.processInstanceId;
                }
                if ($scope.view.ordinaryMsg === 'TravelPassFromMsg') {
                    $scope.view.hasHeader = true;
                    detailsInfo($scope.view.ordinaryId, $scope.view.ordinaryMsg);
                } else if ($scope.view.ordinaryMsg === 'TravelRejectFromMsg') {
                    detailsInfo($scope.view.ordinaryId, $scope.view.ordinaryMsg);
                } else if ($scope.view.ordinaryMsg === 'TravelApprovalFromMsg') {
                    detailsInfo($scope.view.ordinaryId, $scope.view.ordinaryMsg);
                } else if ($scope.view.ordinaryMsg === 'waitApproval') {
                    $scope.view.hasHeader = true;
                    detailsInfo($scope.view.ordinaryId, $scope.view.ordinaryMsg);
                    $scope.view.processInstanceId = $scope.view.processInstanceId;
                } else if ($scope.view.ordinaryMsg === 'hasPass') {
                    $scope.view.hasHeader = true;
                    detailsInfo($scope.view.ordinaryId, $scope.view.ordinaryMsg);
                } else if ($scope.view.ordinaryMsg === 'hasReject') {
                    detailsInfo($scope.view.ordinaryId, $scope.view.ordinaryMsg);
                } else if ($scope.view.ordinaryMsg === 'editting') {
                    detailsInfo($scope.view.ordinaryId, $scope.view.ordinaryMsg)
                } else if ($scope.view.ordinaryMsg === 'approvalList') {
                    detailsInfo($scope.view.ordinaryId, $scope.view.ordinaryMsg);
                } else if ($scope.view.ordinaryMsg === 'approvalHistoryReject') {
                    detailsInfo($scope.view.ordinaryId, $scope.view.ordinaryMsg)
                } else if ($scope.view.ordinaryMsg === 'approvalHistoryHasPass') {
                    $scope.view.hasHeader = true;
                    detailsInfo($scope.view.ordinaryId, $scope.view.ordinaryMsg)
                }
                if ($stateParams.ordinaryMsg === 'create') {
                    $scope.view.type = $filter('translate')('list.Travel.application');//差旅申请
                } else {
                    $scope.view.type = $filter('translate')('ordinary.js.TravelApplicationDetails');//差旅申请详情
                }

            })();


        }]);
