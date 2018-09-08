/**
 * Created by Dawn on 2017/8/3.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.dailyReqHeader', {
                cache: false,
                url: '/dailyReqHeader',
                params: {
                    reqHeaderId: ""
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_req/daily/dailyReqHeader.html',
                        controller: 'dailyReqHeaderCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecexp.req');
                        $translatePartialLoader.addPart('hecexp.common');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('dailyReqHeaderCtrl', ['$scope', '$q', '$ionicPopup', '$cordovaDatePicker', 'LANG', '$filter', '$ionicHistory', '$state', '$ionicLoading', '$timeout',
        '$stateParams', 'ReqHeaderService', 'localStorageService', 'LocalStorageKeys', 'PageValueService', 'PublicFunction', 'HecImageService','$sessionStorage',
        function ($scope, $q, $ionicPopup, $cordovaDatePicker, LANG, $filter, $ionicHistory, $state, $ionicLoading, $timeout,
                  $stateParams, ReqHeaderService, localStorageService, LocalStorageKeys, PageValueService, PublicFunction, HecImageService,$sessionStorage) {
            var vm = this;
            vm.attachments = [];//附件
            vm.deleteAttachment = [];//删除附件
            vm.uploadFinish = true;

            vm.header = {};
            vm.lineList = [];
            vm.dataStr = "";

            vm.isReadOnly = false;
            vm.reqHeaderId = $stateParams.reqHeaderId;
            vm.comDocData = PageValueService.get("comDocData");
            vm.messageFlag = PageValueService.get("messageFlag");//判断是否是消息列表跳转标志
            var loginUser = localStorageService.get(LocalStorageKeys.hec_user_default);

            vm.initPage = initPage;
            vm.goToPage = goToPage;
            vm.isChanged = isChanged;
            vm.submitReq = submitReq;
            vm.saveReqHeader = saveReqHeader;
            vm.watchString = watchString;
            vm.deleteReqLine = deleteReqLine;
            vm.toDailyLineDetail = toDailyLineDetail;
            vm.validReqHeader = validReqHeader;
            vm.goDocHistory = goDocHistory;
            //关联借款列表查询
            vm.toReqLoanList = toReqLoanList;
            //初始化页面
            vm.initPage();

            /**
             * 初始化页面(vm.reqHeaderId不为空则查询，为空则调用申请单头初始化接口)
             */
            function initPage() {
                //安卓，从行上点击返回键时，加载页面数据
                if (PublicFunction.isNull(vm.reqHeaderId) && !PublicFunction.isNull(PageValueService.get("reqHeader"))) {
                    vm.reqHeaderId = PageValueService.get("reqHeader").exp_requisition_header_id;
                }
                console.log("vm.reqHeaderId == " + vm.reqHeaderId);
                if (PublicFunction.isNull(vm.reqHeaderId)) {
                    initReqHeader();
                } else {
                    PublicFunction.showLoading(150);
                    HecImageService.downloadImage("req", vm.reqHeaderId).then(function (res) {
                        vm.attachments = res;
                    });
                    ReqHeaderService.searchDailyHeader(vm.reqHeaderId).then(function (res) {
                        $ionicLoading.hide();
                        if (res.data.success) {
                            var result = res.data.result;
                            vm.header = result.record[0];
                            vm.header.initFlag = false;

                            if (result.lines.totalCount === 0) {
                                vm.lineList = [];
                            } else if (result.lines.totalCount === 1) {
                                vm.isReadOnly = true;
                                vm.lineList.push(result.lines.record);
                            } else {
                                vm.isReadOnly = true;
                                vm.lineList = result.lines.record;
                            }
                            vm.dataStr = vm.watchString();
                            // $scope.isShowAddBtn = true;
                            // 计算申请行的费用总金额
                            var amount = 0;
                            angular.forEach(vm.lineList, function (line) {
                                amount = amount + line.requisition_amount;
                            });
                            vm.header.total_amount = amount;
                            console.log("vm.header.total_amount:" + vm.header.total_amount);
                        } else {
                            PublicFunction.showToast(res.data.error.message);  // 申请头查询失败
                        }
                    }, function (error) {
                        $ionicLoading.hide();
                        PublicFunction.showToast($filter('translate')('message.error.query'));  // 数据查询失败
                    });
                }
            }

            /**
             * 获取单据历史
             */
            function goDocHistory() {
                $state.go('app.docHistory', {type: 'dailyReq', headerId: vm.reqHeaderId});
            }

            /**
             * 跳转到关联借款信息
             */
            function toReqLoanList() {
                PageValueService.set("reqRefLoanInfo", {
                    reqHeaderId: vm.reqHeaderId,
                    reqDocNumber: vm.header.exp_requisition_number,
                    companyId: vm.header.company_id,
                    companyName: vm.header.company_short_name,
                    employeeId : vm.header.employee_id,
                    employeeName : vm.header.employee_name,
                    functionCry:vm.header.functional_currency_code,
                    cryCode: vm.header.currency_code,
                    type: "reqRefLoan",
                    docType: "daily"
                });
                $state.go('app.reqRefLoanList');
            }

            /**
             * 返回需要监听的字符串
             * @returns {*}
             */
            function watchString() {
                var tmp = {
                    "unit_name": vm.header.unit_name,
                    "responsibility_center_name": vm.header.responsibility_center_name,
                    "requisition_date": vm.header.requisition_date,
                    "description": vm.header.description,
                    "currency_code": vm.header.currency_code,
                    "business_attribute": vm.header.business_attribute,
                    "leader_approval_flag": vm.header.leader_approved_flag
                };
                return angular.toJson(tmp);
            }

            /**
             * 初始化申请头信息
             */
            function initReqHeader() {
                ReqHeaderService.initTravelHeader(vm.comDocData.employeeId, vm.comDocData.companyId, vm.comDocData.docTypeId).then(function (res) {
                    if (res.data.success) {
                        vm.header = res.data.result.record[0];
                        vm.reqHeaderId = vm.header.exp_requisition_header_id;
                        vm.header.company_id = vm.comDocData.companyId;
                        vm.header.company_short_name = vm.comDocData.companyName;
                        vm.header.exp_requisition_type_id = vm.comDocData.docTypeId;
                        vm.header.exp_requisition_type_name = vm.comDocData.docTypeName;
                        vm.header.exp_requisition_type_code = vm.comDocData.docTypeCode;

                        vm.header.unit_id = vm.comDocData.unitId;
                        vm.header.unit_name = vm.comDocData.unitName;

                        vm.header.responsibility_center_id = vm.comDocData.respId;
                        vm.header.responsibility_center_name = vm.comDocData.respName;

                        vm.header.employee_id = vm.comDocData.employeeId;
                        vm.header.employee_name = vm.comDocData.employeeName;

                        vm.header.created_by = loginUser.employee_name;
                        vm.header.currency_code = vm.comDocData.cryCode;
                        vm.header.functional_currency_code = vm.comDocData.functionCry;

                        vm.header.total_amount = 0;
                        vm.header.initFlag = true;
                        // $scope.isShowAddBtn = false;
                    } else {
                        PublicFunction.showToast(res.data.error.message);  // 申请头初始化失败
                    }
                }, function (error) {
                    console.log("error when init header: " + angular.toJson(error));
                    PublicFunction.showToast($filter('translate')('error.header.init'));  // 申请头初始化报错
                });
            }

            /**
             * 判断界面数据是否有更新
             * @returns {boolean}
             */
            function isChanged() {
                var str = vm.watchString();
                if (str != vm.dataStr || vm.initFlag) {
                    return true;
                }
                return false;
            }

            /**
             * 验证申请头信息(字段必输性验证)
             * @returns {boolean}
             */
            function validReqHeader() {
                if (PublicFunction.isNull(vm.header.unit_name)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.unit_name'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.responsibility_center_name)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.responsibility_center_name'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.requisition_date)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.requisition_date'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.currency_code)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.currency_code'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.exchange_rate)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.exchange_rate'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.business_attribute_code)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.business_attribute'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.description)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.description'));
                    return false;
                }

                return true;
            };

            /**
             * 保存申请头信息
             * @param type M/手动点击保存按钮  A/程序自动保存
             */
            function saveReqHeader(type) {
                var deferred = $q.defer();
                if (!vm.validReqHeader()) {
                    deferred.reject("E");
                    return deferred.promise;
                }

                if (!vm.isChanged()) {
                    console.log("没有修改");
                    deferred.resolve("S");
                    if (type === "M") { //显示保存成功提示
                        PublicFunction.showToast($filter('translate')('message.no.save'));
                    }
                    return deferred.promise;
                }
                if(PublicFunction.isNull(vm.header.leader_approved_flag)){
                    vm.header.leader_approved_flag = "N";
                }
                vm.header.exchange_rate_type = "HL001";
                vm.header.exchange_rate_quotation = "DIRECT QUOTATION";
                var params = vm.header;
                //调用申请头保存接口
                PublicFunction.showLoading(250);
                ReqHeaderService.saveReqHeader(params).success(function (res) {
                    $ionicLoading.hide();
                    if (res.success) {
                        vm.header.initFlag = false;
                        // $scope.isShowAddBtn = true;
                        if (type === "M") { //显示保存成功提示
                            PublicFunction.showToast($filter('translate')('common.save.successfully'));
                        }
                        vm.dataStr = vm.watchString();
                        deferred.resolve("S");
                    } else {
                        console.log("数据保存失败,错误信息：" + angular.toJson(res.error.message));
                        PublicFunction.showToast(res.error.message);
                        deferred.reject("E");
                    }
                }).error(function (error) {
                    $ionicLoading.hide();
                    PublicFunction.showToast(PublicFunction.showToast($filter('translate')('req.message.error.data.save')));
                    console.log("数据保存失败：" + angular.toJson(error));
                    deferred.reject("E");
                });
                return deferred.promise;
            }

            //部门监听
            /*  $scope.$watch("vm.header.unit_name", function (newValue, oldValue) {
             if (vm.header != "{}") {
             if (!PublicFunction.isNull(oldValue)) {
             if (newValue != oldValue) {
             vm.header.responsibility_center_name = "";
             vm.header.responsibility_center_id = "";
             }
             }
             }
             });*/

            /**
             * 删除申请行信息(先保存头信息再删除)
             * @param line 申请行对象
             */
            function deleteReqLine(line) {
                vm.saveReqHeader("").then(function (data) {
                    if (data === "S") {
                        //调用申请行删除接口
                        PublicFunction.showLoading(250);
                        ReqHeaderService.deleteDailyReqLine(vm.reqHeaderId, line.line_id).success(function (res) {
                            if (res.success) {
                                $ionicLoading.hide();
                                //计算总金额
                                vm.header.total_amount = vm.header.total_amount - line.requisition_amount;
                                //删除
                                vm.lineList.splice(vm.lineList.indexOf(line), 1);
                                if (vm.lineList.length <= 0) {
                                    vm.isReadOnly = false;
                                }
                                PublicFunction.showToast($filter('translate')('req.message.success.delete'));//删除成功!
                            } else {
                                PublicFunction.showToast(res.error.message);
                                console.log("数据删除失败：" + angular.toJson(res.error.message));
                            }
                        }).error(function (error) {
                            console.log("未知错误，数据删除失败：" + angular.toJson(error));
                            PublicFunction.showToast(PublicFunction.showToast($filter('translate')('req.message.error.data.delete')));//未知错误，数据删除失败
                        });
                    }
                });
            }

            /**
             * 提交前的验证：
             *   如果没有行信息，不能提交
             * @returns {Promise}
             */
            function preSubmit() {
                var deferred = $q.defer();
                if (vm.lineList.length <= 0) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.one.line'));
                    deferred.reject("E");
                } else {
                    deferred.resolve("S");
                }
                return deferred.promise;
            }

            /**
             * 提交申请单(先保存头信息再提交)
             */
            function submitReq() {
                preSubmit().then(function (data) {
                    if (data === "S") {
                        vm.saveReqHeader("").then(function (data) {
                            if (data === "S") {
                                //调用差旅申请提交接口
                                PublicFunction.showLoading(250);
                                ReqHeaderService.submitReq(vm.reqHeaderId).success(function (res) {
                                    if (res.success) {
                                        PageValueService.set("reqHeader", "");
                                        PageValueService.set("reqRefLoanInfo", "");
                                        PageValueService.set("messageFlag","");
                                        if (vm.messageFlag === 'Y') {
                                            $state.go('app.erv_notification');
                                        } else {
                                            $state.go('app.reqList');
                                        }
                                    } else {
                                        console.log("数据提交失败,错误信息：" + angular.toJson(res.error.message));
                                        PublicFunction.showToast(res.error.message);
                                    }
                                }).error(function (error) {
                                    PublicFunction.showToast(PublicFunction.showToast($filter('translate')('req.message.error.data.submit')));
                                    console.log("数据提交失败：" + angular.toJson(error));
                                });
                            }
                        });
                    }
                });
            }

            /**
             * 查看申请行信息(先保存头信息再跳转到行界面)
             * @param reqLineId 申请行ID
             */
            function toDailyLineDetail(reqLineId) {
                vm.saveReqHeader("").then(function (data) {
                    if (data === "S") {
                        console.log(reqLineId);
                        PageValueService.set("reqHeader", "");
                        PageValueService.set("reqHeader", vm.header);
                        $state.go('app.dailyReqLine', {
                            reqHeaderId: vm.reqHeaderId,
                            reqLineId: reqLineId,
                            maxLineNum: vm.header.max_num
                        });
                    }
                });
            }

            /**
             * 页面跳转
             */
            function goToPage() {
                if (vm.header.initFlag) {
                    vm.reqHeaderId = "";
                    vm.header = {};
                    $state.go('app.companyExpType'); //跳转到公司类型选择界面
                } else {
                    if (vm.messageFlag === 'Y') {
                        $state.go('app.erv_notification');
                    } else {
                        $state.go('app.reqList'); //跳转到申请列表界面
                    }
                }
            }

            $scope.goBack = function () {
                PageValueService.set("reqHeader", "");
                PageValueService.set("reqRefLoanInfo", "");
                PageValueService.set("messageFlag","");
                if (isChanged()) {
                    $scope.showPopup();
                } else {
                    vm.goToPage();
                }
            };

            //监听结算币种和期间
            $scope.$watch("vm.header.period_name + vm.header.currency_code", function (newValue, oldValue) {
                if (!vm.isReadOnly) {
                    if (!PublicFunction.isNull(newValue)) {
                        if (newValue != oldValue) {
                            PublicFunction.queryExchangeRate(vm.header.company_id, vm.header.period_name, vm.header.requisition_date, vm.header.currency_code, vm.header.functional_currency_code).then(function (res) {
                                if (res.data.success) {
                                    vm.header.exchange_rate = res.data.result.record[0].exchange_rate;
                                    if (PublicFunction.isNull(vm.header.exchange_rate)) {
                                        PublicFunction.showToast($filter('translate')('req.message.error.exchange_rate'));
                                    }
                                } else {
                                    console.log("汇率查询失败,错误信息：" + angular.toJson(res.error.message));
                                    PublicFunction.showToast(res.error.message);
                                }
                            }, function (error) {
                                vm.header.exchange_rate = "";
                                console.log("汇率查询报错,错误信息：" + angular.toJson(res.error.message));
                                PublicFunction.showToast($filter('translate')('req.message.error.exchange_rate'));
                            });
                        }
                    } else {
                        vm.header.exchange_rate = "";
                    }
                }
            });

            /**
             * 信息提示框
             */
            $scope.showPopup = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: $filter('translate')('confirm.window.prompt'),//提示
                    template: $filter('translate')('confirm.window.Information.req'),//是否保存该申请单
                    cancelText: $filter('translate')('confirm.window.cancel'),//取消
                    okText: $filter('translate')('confirm.window.ok'),//确认保存
                    cssClass: 'delete-ordinary-application-popup'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        vm.saveReqHeader("").then(function (data) {
                            if (data === "S") {
                                vm.goToPage();
                            }
                        });
                    } else {
                        vm.goToPage();
                    }
                });
            };

            //选择时间
            $scope.datePicker = {
                selectDate: function () {
                    var dateOptions = {
                        date: vm.header.requisition_date,
                        mode: 'date',
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('button.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('button.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        locale: $sessionStorage.lang //$sessionStorage.lang
                    };

                    // 如果不是只读,可以编辑
                    if (!vm.isReadOnly) {
                        $cordovaDatePicker.show(dateOptions).then(function (date) {
                            if (date) {
                                vm.header.requisition_date = new Date(date).Format('yyyy-MM-dd');
                                vm.header.period_name = $filter('date')(vm.header.requisition_date, 'yyyy-MM');
                            }
                        });
                    }
                },
                selectHandDate: function () {
                    var date = null;
                    if (vm.header.requisition_date) {
                        date = new Date(vm.header.requisition_date).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if (ionic.Platform.isAndroid()) {
                                $scope.result = new Date(response).Format('yyyy-MM-dd');
                            } else {
                                $scope.result = new Date(response.result).Format('yyyy-MM-dd');
                            }
                            vm.header.requisition_date = $scope.result;
                            vm.header.period_name = $filter('date')(vm.header.requisition_date, 'yyyy-MM');
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
