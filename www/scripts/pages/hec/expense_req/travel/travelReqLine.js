/**
 * Created by Dawn on 2017/8/3.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.travelReqLine', {
                cache: false,
                url: '/travelReqLine',
                params: {
                    reqHeaderId: "",
                    reqLineId: "",
                    maxLineNum: ""
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_req/travel/travelReqLine.html',
                        controller: 'travelReqLineCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('hecexp.req');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('travelReqLineCtrl', ['$scope', '$q', '$filter', '$ionicPopup', '$ionicLoading', '$cordovaDatePicker', 'LANG', '$stateParams', '$ionicHistory', '$document', 'Auth', '$state', '$ionicModal', 'PublicFunction', 'ReqLineService', 'PageValueService', 'localStorageService', 'LocalStorageKeys','$sessionStorage',
        function ($scope, $q, $filter, $ionicPopup, $ionicLoading, $cordovaDatePicker, LANG, $stateParams, $ionicHistory, $document, Auth, $state, $ionicModal, PublicFunction, ReqLineService, PageValueService, localStorageService, LocalStorageKeys,$sessionStorage) {
            var vm = this;
            //显示删除出差人的图片
            vm.showDeleteTraveler = showDeleteTraveler;
            //添加同行人信息
            vm.addTraveler = addTraveler;
            //更新同行人信息
            vm.updateTraveler = updateTraveler;
            //删除同行人
            vm.deleteTraveler = deleteTraveler;
            //验证同行人数据
            vm.validTraveler = validTraveler;
            //保存同行人数据
            vm.saveTraveler = saveTraveler;
            //页面初始化
            vm.initPage = initPage;
            //验证申请行数据
            vm.validReqLine = validReqLine;
            //保存申请单行信息
            vm.saveReqLine = saveReqLine;
            //需要监听的字段
            vm.watchString = watchString;
            //判断数据是否有修改
            vm.isChanged = isChanged;
            //计算出发日期和离开日期相隔天数
            vm.calculateDays = calculateDays;
            //保存并新建另外一行行程
            vm.addNewLine = addNewLine;

            //回退按钮
            vm.goBack = goBack;

            vm.dataStr = "";
            vm.line = {};

            vm.isReadOnly = false;
            vm.reqLineId = $stateParams.reqLineId;
            vm.maxLineNum = $stateParams.maxLineNum;
            vm.reqHeaderId = $stateParams.reqHeaderId;
            vm.header = PageValueService.get("reqHeader");
            vm.dimPrompt = $filter('translate')('hec_lov.input.dimension.prompt');
            vm.travelerList = [];
            vm.traveler = {};
            vm.initPage();

            function initPage() {
                console.log("vm.reqLineId====" + vm.reqLineId);
                if (!PublicFunction.isNull(vm.reqLineId)) {
                    PublicFunction.showLoading(150);
                    ReqLineService.queryTravelLines(vm.reqLineId).then(function (res) {
                        $ionicLoading.hide();
                        if (res.data.success) {
                            var result = res.data.result;
                            vm.line = result.record[0];
                            if (result.detail.totalCount == 0) {
                                vm.travelerList = [];
                            } else if (result.detail.totalCount == 1) {
                                vm.travelerList = [];
                                vm.travelerList.push(result.detail.record);
                            }else {
                                vm.travelerList = result.detail.record;
                            }
                            vm.dataStr = vm.watchString();
                        } else {
                            PublicFunction.showToast(res.data.error.message);  // 差旅申请行查询失败
                        }
                        //vm.dataStr = angular.toJson(vm.details);
                    }, function (error) {
                        $ionicLoading.hide();
                        PublicFunction.showToast($filter('translate')('message.error.query'));  // 数据查询失败
                    });
                } else {
                    vm.line = {};
                    vm.line.req_travel_id = "";
                    vm.maxLineNum = vm.maxLineNum*1 + 10;
                    vm.line.line_number = vm.maxLineNum;
                    vm.line.unit_id = vm.header.unit_id;
                    vm.line.unit_name = vm.header.unit_name;
                    vm.line.company_id = vm.header.company_id;
                    vm.line.period_name = $filter('date')(vm.header.requisition_date, 'yyyy-MM');//根据头上的日期截取业务期间
                    vm.line.currency_code = vm.header.currency_code;
                    vm.line.exchange_rate = vm.header.exchange_rate;
                    vm.line.exp_requisition_header_id = vm.header.exp_requisition_header_id;
                    vm.line.company_short_name = vm.header.company_short_name;
                    vm.line.responsibility_center_id = vm.header.responsibility_center_id;
                    vm.line.responsibility_center_name = vm.header.responsibility_center_name;
                    vm.line.settled_park_desc = $filter('translate')('req.line.not.stay.in.park');
                    vm.line.settled_park = "NO_SETTLED_PARK";
                    /*vm.line.fly_requisition_amount = 0;
                    vm.line.hotel_requisition_amount = 0;
                    vm.line.other_requisition_amount = 0;
                    vm.line.date_from = new Date('2017-11-10').Format("yyyy-MM-dd");
                    vm.line.date_to = new Date('2017-11-14').Format("yyyy-MM-dd");*/
                    vm.line.date_total = "0";
                    //初始化内部项目
                    vm.line.d2 = vm.header.value_description;
                    vm.line.e2 = vm.header.default_dim_value_id;
                    vm.line.position_id = vm.header.position_id;
                    vm.line.employee_id = vm.header.employee_id;
                    vm.line.exchange_rate_type = "HL001";
                    vm.line.exchange_rate_quotation = "DIRECT QUOTATION";
                    vm.line.payment_flag = "Y";
                    vm.line.flight_class = "Y";
                    vm.line.flight_class_desc = $filter('translate')('req.line.air.default.flight.class');

                    //事由：默认头上的
                    vm.line.description = vm.header.description;
                    if(vm.header.exp_requisition_type_code =="1015"){
                        vm.line.flight_vender_desc = $filter('translate')('req.line.default.flight.vender.desc');
                        vm.line.flight_vender = "OTHER";
                    }
                }
            }

            /**
             * 保存并新建另外一行行程
             */
            function addNewLine() {
                vm.saveReqLine("").then(function (data) {
                    if (data === "S") {
                        console.log(vm.maxLineNum);
                        $state.go('app.travelReqLine', {
                            reqHeaderId: vm.reqHeaderId,
                            reqLineId: "",
                            maxLineNum: vm.maxLineNum
                        });
                    }
                });
            }

            function getAmount(value) {
                if (PublicFunction.isNull(value)) {
                    return 0;
                } else {
                    return value;
                }
            }

            /**
             * 验证差旅申请行信息(字段必输性验证)
             * @returns {boolean}
             */
            function validReqLine() {
                if (PublicFunction.isNull(vm.line.expense_type_display)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.expense_type_display'));
                    return false;
                }
                if (PublicFunction.isNull(vm.line.exchange_rate)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.exchange_rate'));
                    return false;
                }
                if (PublicFunction.isNull(vm.line.date_from)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.date_from'));
                    return false;
                }
                if (PublicFunction.isNull(vm.line.date_to)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.date_to'));
                    return false;
                }
                if (PublicFunction.compareDate(vm.line.date_from, vm.line.date_to)) {
                    vm.line.date_total = "";
                    PublicFunction.showToast($filter('translate')('req.message.error.line.date.from.to'));
                    return false;
                }
                if (PublicFunction.isNull(vm.line.place_from)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.place_from'));
                    return false;
                }
                if (vm.line.from_state_flag === "Y" && PublicFunction.isNull(vm.line.abroad_place_from)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.abroad.place.from'));
                    return false;
                }
                if (PublicFunction.isNull(vm.line.place_to)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.place_to'));
                    return false;
                }
                if (vm.line.to_state_flag === "Y" && PublicFunction.isNull(vm.line.abroad_place_to)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.abroad.place.to'));
                    return false;
                }
                if(PublicFunction.isNull(vm.line.flight_vender)){
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.flight_vender'));
                    return false;
                }
                if(PublicFunction.isNull(vm.line.hotel_vender)){
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.hotel_vender'));
                    return false;
                }
                if (getAmount(vm.line.fly_requisition_amount) < 0) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.Amount.must.more.than.0.fly'));
                    return false;
                }
                if (getAmount(vm.line.hotel_requisition_amount) < 0) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.Amount.must.more.than.0.hotel'));
                    return false;
                }
                if (getAmount(vm.line.other_requisition_amount) < 0) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.Amount.must.more.than.0.other'));
                    return false;
                }
                if (getAmount(vm.line.fly_requisition_amount) == 0 && getAmount(vm.line.hotel_requisition_amount) == 0 &&
                    getAmount(vm.line.other_requisition_amount) == 0) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.at.least.one.amount'));
                    return false;
                }
                if (PublicFunction.isNull(vm.line.d2)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.project.name'));
                    return false;
                }
                return true;
            };

            function watchString() {
                var tmp = {
                    "period_name": vm.line.period_name,
                    "exchange_rate": vm.line.exchange_rate,
                    "expense_type_display": vm.line.expense_type_display,
                    "date_from": vm.line.date_from,
                    "date_to": vm.line.date_to,
                    "place_from": vm.line.place_from,
                    "place_to": vm.line.place_to,
                    "fly_requisition_amount": vm.line.fly_requisition_amount === 0 ? "" : vm.line.fly_requisition_amount,
                    "hotel_requisition_amount": vm.line.hotel_requisition_amount === 0 ? "" : vm.line.hotel_requisition_amount,
                    "other_requisition_amount": vm.line.other_requisition_amount === 0 ? "" : vm.line.other_requisition_amount,
                    "description": vm.line.description,
                    "settled_park_desc": vm.line.settled_park_desc,
                    "d2": vm.line.d2,
                    "flight_class_desc": vm.line.flight_class_desc,
                    "abroad_place_from": vm.line.abroad_place_from,
                    "abroad_place_to": vm.line.abroad_place_to,
                    "return_flag":vm.line.return_flag,
                    "flight_vender_desc":vm.line.flight_vender_desc,
                    "hotel_vender_desc":vm.line.hotel_vender_desc
                };
                return angular.toJson(tmp);
            }

            /**
             * 保存差旅申请头信息
             * @param type M/手动点击保存按钮  A/程序自动保存
             */
            function saveReqLine(type) {
                var deferred = $q.defer();
                if (!vm.validReqLine()) {
                    deferred.resolve("E");
                    return deferred.promise;
                }

                if (!vm.isChanged()) {
                    console.log("数据未修改");
                    deferred.resolve("S");
                    if (type === "M") { //显示保存成功提示
                        //PublicFunction.showToast("没有修改数据，无需保存!");
                        $state.go('app.travelReqHeader', {reqHeaderId: vm.reqHeaderId});
                    }
                    return deferred.promise;
                }

                if(PublicFunction.isNull(vm.line.return_flag)){
                    vm.line.return_flag = 'N';
                }

                var params = vm.line;
                //调用差旅申请行保存接口
                PublicFunction.showLoading(250);
                ReqLineService.saveReqLine(params).success(function (res) {
                    $ionicLoading.hide();
                    if (res.success) {
                        if (type === "M") { //点击保存按钮保存
                            //PublicFunction.showToast("保存成功");
                            $state.go('app.travelReqHeader', {reqHeaderId: vm.reqHeaderId});
                        }
                        vm.line.req_travel_id = res.result.record.req_travel_id;
                        vm.reqLineId = vm.line.req_travel_id;
                        console.log("req_travel_id === " + vm.line.req_travel_id);
                        vm.dataStr = vm.watchString();
                        deferred.resolve("S");
                    } else {
                        console.log("保存出错,错误信息：" + angular.toJson(res.error.message));
                        PublicFunction.showToast(res.error.message);
                        deferred.reject("E");
                    }
                }).error(function (error) {
                    $ionicLoading.hide();
                    PublicFunction.showToast($filter('translate')('error.request'));
                    console.log("失败信息" + angular.toJson(error));
                    deferred.reject("E");
                });
                return deferred.promise;
            }

            function isChanged() {
                var str = vm.watchString();
                //console.log("str====" + str);
                //console.log("vm.dataStr===" + vm.dataStr);
                if (str != vm.dataStr) {
                    return true;
                }
                console.log("没有修改数据");
                return false;
            }

            function goBack(param) {
                if (param == 'hide') {
                    vm.travelPartnerModal.hide();
                    initPage();//重新初始化数据，刷出同行人(本人)
                } else {
                    if (vm.isChanged()) {
                        $scope.showPopup();
                    } else {
                        $state.go('app.travelReqHeader', {reqHeaderId: vm.reqHeaderId});
                    }
                }
            };

            $scope.showPopup = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: $filter('translate')('confirm.window.prompt'),//提示
                    template: $filter('translate')('confirm.window.Information.travel.line'),//是否保存该差旅申请单
                    cancelText: $filter('translate')('confirm.window.cancel'),//取消
                    okText: $filter('translate')('confirm.window.ok'),//确定
                    cssClass: 'delete-ordinary-application-popup'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        vm.saveReqLine("").then(function (data) {
                            if (data === "S") {
                                $state.go('app.travelReqHeader', {reqHeaderId: vm.reqHeaderId});
                            }
                        });
                    } else {
                        $state.go('app.travelReqHeader', {reqHeaderId: vm.reqHeaderId});
                    }
                });
            };

            //监听结算币种和期间
            $scope.$watch("vm.line.period_name + vm.line.currency_code", function (newValue, oldValue) {
                if (!PublicFunction.isNull(newValue)) {
                    if (newValue != oldValue) {
                        if (vm.line.currency_code === vm.header.currency_code) {
                            vm.line.exchange_rate = 1;
                            return;
                        }
                        PublicFunction.queryExchangeRate(null, vm.line.period_name, vm.line.currency_code, vm.header.currency_code).then(function (res) {
                            if (res.data.success) {
                                vm.line.exchange_rate = res.data.result.record[0].exchange_rate;
                                if (PublicFunction.isNull(vm.line.exchange_rate)) {
                                    PublicFunction.showToast($filter('translate')('req.message.error.exchange_rate'));
                                }
                            } else {
                                console.log("汇率查询失败,错误信息：" + angular.toJson(res.error.message));
                                PublicFunction.showToast(res.error.message);
                            }
                        }, function (error) {
                            vm.line.exchange_rate = "";
                            console.log("汇率查询报错,错误信息：" + angular.toJson(res.error.message));
                            PublicFunction.showToast($filter('translate')('req.message.error.exchange_rate'));
                        });
                    }
                } else {
                    vm.line.exchange_rate = "";
                }
            });

            /**
             * 计算出发日期和离开日期相隔天数
             */
            function calculateDays() {
                if (PublicFunction.isNull(vm.line.date_from) || PublicFunction.isNull(vm.line.date_to)) {
                    vm.line.date_total = "";
                } else {
                    if (PublicFunction.compareDate(vm.line.date_from, vm.line.date_to)) {
                        vm.line.date_total = "";
                        PublicFunction.showToast($filter('translate')('req.message.error.line.date.from.to'));
                    } else {
                        vm.line.date_total = PublicFunction.calculateDays(vm.line.date_from, vm.line.date_to) + 1;
                    }
                }
            }

            //出差同行人--员工类型
            $scope.$watch("vm.traveler.employee_type_code", function (newValue, oldValue) {
                if (vm.traveler != "{}" && vm.traveler.isNewFlag) {
                    if (!PublicFunction.isNull(newValue) && !PublicFunction.isNull(oldValue)) {
                        if (newValue != oldValue) {
                            vm.traveler.id_code = "";
                            vm.traveler.employee_name = "";
                            vm.traveler.employee_mobil = "";
                            vm.traveler.employee_code = "";
                        }
                    }
                }
            });

            //监听金额
            $scope.$watch('vm.line.fly_requisition_amount', function () {
                if (vm.line.fly_requisition_amount === 0) {
                    vm.line.fly_requisition_amount = "";
                }else{
                    var amount = vm.line.fly_requisition_amount+"";
                    if(amount.indexOf(".") != -1){
                        vm.line.fly_requisition_amount = parseFloat(amount.substring(0,amount.indexOf(".") + 3));
                    }
                }
            });

            $scope.$watch('vm.line.hotel_requisition_amount', function () {
                if (vm.line.hotel_requisition_amount === 0) {
                    vm.line.hotel_requisition_amount = "";
                }else{
                    var amount = vm.line.hotel_requisition_amount+"";
                    if(amount.indexOf(".") != -1){
                        vm.line.hotel_requisition_amount = parseFloat(amount.substring(0,amount.indexOf(".") + 3));
                    }
                }
            });

            $scope.$watch('vm.line.other_requisition_amount', function () {
                if (vm.line.other_requisition_amount === 0) {
                    vm.line.other_requisition_amount = "";
                }else{
                    var amount = vm.line.other_requisition_amount+"";
                    if(amount.indexOf(".") != -1){
                        vm.line.other_requisition_amount = parseFloat(amount.substring(0,amount.indexOf(".") + 3));
                    }
                }
            });

            vm.travelPartnerModal = null;
            vm.isDelete = false;
            //维护同行人modal
            $ionicModal.fromTemplateUrl('scripts/pages/hec/expense_req/travel/travelPartner.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal1) {
                vm.travelPartnerModal = modal1;
            });

            //添加同行出差人
            function addTraveler() {
                vm.saveReqLine().then(function (data) {
                    if (data === "S") {
                        vm.isDelete = false;
                        vm.traveler =
                            {
                                "isReadOnly": false,
                                "isNewFlag": true,
                                "isInternal": true,
                                "req_travel_id": vm.line.req_travel_id,
                                "beneficiary_id": "",
                                "employee_name": ""
                            }
                        vm.travelPartnerModal.show();
                    }
                }, function (err) {
                    console.log(angular.toJson(err));
                });
            }

            //更新同行出差人
            function updateTraveler(traveler) {
                if (traveler.employee_type_code == "INTERNAL_STAFF") {
                    traveler.isInternal = true;
                }
                traveler._status = "update";
                traveler.isReadOnly = vm.isReadOnly;
                traveler.updateFlag = vm.isReadOnly;
                if (!vm.isReadOnly) {
                    traveler.updateFlag = true;
                }
                vm.traveler = traveler;
                vm.travelPartnerModal.show();
            }

            //显示删除同行出差人
            function showDeleteTraveler() {
                vm.isDelete = !vm.isDelete;
            }

            //删除同行出差人信息
            function deleteTraveler(benefyId) {
                vm.saveReqLine().then(function (data) {
                    if (data === "S") {
                        PublicFunction.showLoading(250);
                        ReqLineService.deleteTraveler(benefyId).success(function (res) {
                            if (res.success) {
                                $ionicLoading.hide();
                                for (var i = 0; i < vm.travelerList.length; i++) {
                                    if (benefyId === vm.travelerList[i].beneficiary_id) {
                                        vm.travelerList.splice(i, 1);
                                        return;
                                    }
                                }
                            } else {
                                console.log("删除出错,错误信息：" + angular.toJson(res.error.message));
                                PublicFunction.showToast(res.error.message);
                            }
                        }).error(function (error) {
                            PublicFunction.showToast($filter('translate')('error.request'));
                            console.log("失败信息" + angular.toJson(e));
                        });
                    }
                }, function (err) {
                    console.log(angular.toJson(err));
                });
            }

            //保存出差同行人信息
            function saveTraveler() {
                if (!vm.validTraveler()) {
                    return;
                }
                var rowId = vm.traveler.beneficiary_id;
                var params = {
                    employee_type_code: vm.traveler.employee_type_code,
                    id_code: vm.traveler.id_code,
                    employee_mobil: vm.traveler.employee_mobil,
                    employee_code: vm.traveler.employee_code,
                    req_travel_id: vm.traveler.req_travel_id,
                    employee_type: vm.traveler.employee_type,
                    beneficiary_id: vm.traveler.beneficiary_id,
                    employee_name: vm.traveler.employee_name
                };
                PublicFunction.showLoading(250);
                ReqLineService.saveTraveler(params).then(function (res) {
                    if (res.data.success) {
                        vm.travelPartnerModal.hide();
                        initPage();//重新初始化数据，刷出同行人(本人)
                    } else {
                        PublicFunction.showToast(res.data.error.message);
                    }
                }, function (error) {
                    PublicFunction.showToast($filter('translate')('req.message.error.data.save'));
                });
            };

            /**
             * 验证同行人数据(字段必输性验证)
             * @returns {boolean}
             */
            function validTraveler() {
                if (PublicFunction.isNull(vm.traveler.employee_type)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.traveler.required.employee.type'));
                    return false;
                } else {
                    if (vm.traveler.employee_type_code === "INTERNAL_STAFF" && PublicFunction.isNull(vm.traveler.employee_code)) {
                        PublicFunction.showToast($filter('translate')('req.message.error.traveler.required.employee.code'));
                        return false;
                    }
                }
                if (PublicFunction.isNull(vm.traveler.employee_name)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.traveler.required.employee.name'));
                    return false;
                }
                if (!vm.traveler.isInternal && PublicFunction.isNull(vm.traveler.id_code)) { //国外身份证必输
                    PublicFunction.showToast($filter('translate')('req.message.error.traveler.required.employee.id.code'));
                    return false;
                }
                if (!vm.traveler.isInternal && PublicFunction.isNull(vm.traveler.employee_mobil)) {//国外手机号必输
                    PublicFunction.showToast($filter('translate')('req.message.error.traveler.required.employee.mobile'));
                    return false;
                }
                return true;
            };

            //选择时间
            $scope.datePicker = {
                selectDate: function (string) {
                    var itemDate = vm.line.data_from;
                    if (string === 'dateTo') {
                        itemDate = vm.line.data_to;
                    }
                    var dateOptions = {
                        date: itemDate,
                        mode: 'date',
                        allowOldDates: false,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('button.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('button.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        locale: $sessionStorage.lang //$sessionStorage.lang
                    };

                    // 如果费用不是只读,或者是第三方费用,或者是报销单中编辑费用,可以编辑
                    if (!vm.isReadOnly) {
                        $cordovaDatePicker.show(dateOptions).then(function (date) {
                            if (date) {
                                if (string === 'dateFrom') {
                                    vm.line.date_from = date.Format('yyyy-MM-dd');
                                } else {
                                    vm.line.date_to = date.Format('yyyy-MM-dd');
                                }
                                vm.calculateDays();
                            }
                        });
                    }
                },
                selectHandDate: function (string) {
                    var date = null;
                    if (string === 'dateFrom' && vm.line.date_from) {
                        date = new Date(vm.line.date_from).Format('yyyy-MM-dd');
                    }
                    if (string === 'dateTo' && vm.line.date_to) {
                        date = new Date(vm.line.date_to).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if (ionic.Platform.isAndroid()) {
                                $scope.result = new Date(response).Format('yyyy-MM-dd');
                            } else {
                                $scope.result = new Date(response.result).Format('yyyy-MM-dd');
                            }
                            if (string === 'dateFrom') {
                                vm.line.date_from = $scope.result;
                            } else {
                                vm.line.date_to = $scope.result;
                            }
                            vm.calculateDays();
                            $scope.$apply();
                        } catch (e) {
                        }
                    };
                    var error = function (response) {
                    };
                    if (!vm.isReadOnly) {
                        if (ionic.Platform.isWebView()) {
                            var startTime = '-';
                            var endTime = '-';
                            var banPick = {};
                            if (date) {
                                banPick = {
                                    "startTime": startTime,
                                    "endTime": endTime,
                                    "dates": [],
                                    "selectedDate": date
                                };
                            } else {
                                banPick = {"startTime": startTime, "endTime": endTime, "dates": []};
                            }
                            if ($sessionStorage.lang != 'zh_cn') {
                                banPick.language = "en";
                            }
                            HmsCalendar.openCalendar(success, error, 2, banPick);
                        }
                    }
                }
            };
        }]);


