/**
 * Created by Hurong on 2017/8/1.
 *  新建借款申请-借款申请头信息
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.loanReqHeader', {
                cache: false,
                url: '/loanReqHeader',
                params: {
                    loanReqHeaderId: ""
                },
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/loan_req/loanReqHeader.html',
                        controller: 'loanReqHeaderController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecexp.req');
                        $translatePartialLoader.addPart('hecexp.common');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }

            })
    }])
    .controller('loanReqHeaderController', ['$scope', '$filter', '$q', 'LANG', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout', '$ionicPopup',
        '$stateParams', 'LoanHeaderService', 'localStorageService', 'LocalStorageKeys', 'PageValueService', 'PublicFunction', 'HecImageService', '$cordovaDatePicker','$sessionStorage',
        function ($scope, $filter, $q, LANG, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, $ionicPopup,
                  $stateParams, LoanHeaderService, localStorageService, LocalStorageKeys, PageValueService, PublicFunction, HecImageService, $cordovaDatePicker,$sessionStorage) {
            var vm = this;
            vm.attachments = [];//附件
            vm.deleteAttachment = [];//删除附件
            vm.uploadFinish = true;

            vm.header = {};
            vm.lineList = [];
            vm.dataStr = "";

            vm.isReadOnly = false;
            vm.loanReqHeaderId = $stateParams.loanReqHeaderId;
            //申请单关联借款单List页面参数
            vm.reqRefLoanInfo = PageValueService.get("reqRefLoanInfo");
            if (!PublicFunction.isNull(vm.reqRefLoanInfo)) {
                vm.reqHeaderId = vm.reqRefLoanInfo.reqHeaderId;//申请单Id
                vm.reqDocNumber = vm.reqRefLoanInfo.reqDocNumber;//申请单单据号
                vm.type = vm.reqRefLoanInfo.type;//类型：reqRefLoan 申请单关联借款跳转
                vm.docType = vm.reqRefLoanInfo.docType;//单据类型：差旅申请travel、通用申请
            }
            vm.comDocData = PageValueService.get("comDocData");
            vm.messageFlag = PageValueService.get("messageFlag");//判断是否是消息列表跳转标志
            var loginUser = localStorageService.get(LocalStorageKeys.hec_user_default);

            vm.initPage = initPage;
            vm.goToPage = goToPage;
            vm.isChanged = isChanged;
            vm.submitLoanReq = submitLoanReq;
            vm.saveLoanReqHeader = saveLoanReqHeader;
            vm.watchString = watchString;
            vm.deleteLoanReqLine = deleteLoanReqLine;
            vm.toLoanReqLine = toLoanReqLine;
            vm.validLoanReqHeader = validLoanReqHeader;
            vm.goDocHistory = goDocHistory;
            vm.goRefReq = goRefReq;


            /**
             * 初始化页面(vm.loanReqHeaderId不为空则查询，为空则调用借款申请单头初始化接口)
             */
            function initPage() {
                //安卓，从行上点击返回键时，加载页面数据
                if(PublicFunction.isNull(vm.loanReqHeaderId)&& !PublicFunction.isNull(PageValueService.get("reqHeader"))){
                    vm.loanReqHeaderId = PageValueService.get("reqHeader").payment_requisition_header_id;
                }
                console.log("vm.loanReqHeaderId == " + vm.loanReqHeaderId);
                if (PublicFunction.isNull(vm.loanReqHeaderId)) {
                    initLoanReqHeader();
                } else {
                    PublicFunction.showLoading(150);
                    HecImageService.downloadImage("pr", vm.loanReqHeaderId).then(function (res) {
                        vm.attachments = res;
                    });
                    LoanHeaderService.searchLoanReqHeader(vm.loanReqHeaderId).then(function (res) {
                        $ionicLoading.hide();
                        if (res.data.success) {
                            var result = res.data.result;
                            vm.header = result.record[0];
                            vm.header.initFlag = false;
                            vm.header.period_name = $filter('date')(vm.header.requisition_date, 'yyyy-MM');

                            if (result.lines.totalCount === 0) {
                                vm.isReadOnly = false;
                                vm.lineList = [];
                            } else if (result.lines.totalCount === 1) {
                                vm.isReadOnly = true;
                                vm.lineList.push(result.lines.record);
                            } else {
                                vm.isReadOnly = true;
                                vm.lineList = result.lines.record;
                            }
                            vm.dataStr = vm.watchString();
                            // 计算申请行的费用总金额
                            var amount = 0;
                            angular.forEach(vm.lineList, function (line) {
                                console.log("line.amount:" + line.amount);
                                amount = amount + line.amount;
                            });
                            vm.header.total_amount = amount;
                            console.log("vm.header.total_amount:" + vm.header.total_amount);
                            // $scope.isShowAddBtn = true;
                        } else {
                            PublicFunction.showToast(res.data.error.message);  // 借款头查询失败
                        }
                    }, function (error) {
                        $ionicLoading.hide();
                        PublicFunction.showToast($filter('translate')('message.error.query'));  // 数据查询失败
                    });
                }
            }

            vm.initPage();

            /**
             * 初始化借款申请头信息
             */
            function initLoanReqHeader() {
                LoanHeaderService.initLoanReqHeader(vm.comDocData.employeeId, vm.comDocData.companyId,vm.comDocData.docTypeId).then(function (res) {
                    if (res.data.success) {
                        vm.header = res.data.result.record[0];
                        vm.loanReqHeaderId = vm.header.payment_requisition_header_id;
                        //公司
                        vm.header.company_id = vm.comDocData.companyId;
                        vm.header.company_short_name = vm.comDocData.companyName;
                        //单据类型
                        vm.header.payment_req_type_id = vm.comDocData.docTypeId;
                        vm.header.csh_type_id_display = vm.comDocData.docTypeName;
                        vm.header.csh_type_code = vm.comDocData.docTypeCode;
                        //付款方式（从单据类型选择接口返回）
                        vm.header.payment_method_id = vm.comDocData.paymentMethodId;
                        vm.header.payment_method_id_display = vm.comDocData.paymentMethodDisplay;
                        //部门
                        vm.header.unit_id = vm.comDocData.unitId;
                        vm.header.unit_name = vm.comDocData.unitName;
                        //责任中心
                        vm.header.responsibility_center_id = vm.comDocData.respId;
                        vm.header.responsibility_center_name = vm.comDocData.respName;
                        //员工
                        vm.header.employee_id = vm.comDocData.employeeId;
                        vm.header.employee_id_display = vm.comDocData.employeeName;
                        //制单人
                        vm.header.payment_requisition_create_by = loginUser.employee_name;
                        //币种
                        vm.header.currency_code = vm.comDocData.cryCode;
                        vm.header.functional_currency_code = vm.comDocData.functionCry;
                        //头的总金额，用于展示
                        vm.header.total_amount = 0;
                        vm.header.amount = 0;
                        //初始化标志
                        vm.header.initFlag = true;
                        //获取业务属性（对公必输）判断合同付款条件是否必输
                        vm.header.business_attribute = vm.comDocData.busAttrCode;

                        //申请单关联借款时，保存申请单信息
                        if (vm.type == 'reqRefLoan') {
                            vm.header.ref_document_id = vm.reqHeaderId;
                            vm.header.ref_document_display = vm.reqDocNumber;
                        }
                        // $scope.isShowAddBtn = false;
                    } else {
                        PublicFunction.showToast(res.data.error.message);  // 借款单头初始化失败
                    }
                }, function (error) {
                    console.log("error when init header: " + angular.toJson(error));
                    PublicFunction.showToast($filter('translate')('error.header.init'));  // 申请单头初始化错误
                });
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
                    "currency_code": vm.header.currency_code,
                    "payment_method_id_display": vm.header.payment_method_id_display,
                    "partner_category_display": vm.header.partner_category_display,
                    "p_partner_name": vm.header.p_partner_name,
                    "contract_number": vm.header.contract_number,
                    "contract_pay_term": vm.header.contract_pay_term,
                    "leader_approved_flag": vm.header.leader_approved_flag,
                    "description": vm.header.description
                };
                return angular.toJson(tmp);
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
             * 保存借款申请头信息
             * @param type M/手动点击保存按钮  A/程序自动保存
             */
            function saveLoanReqHeader(type) {
                var deferred = $q.defer();
                if (!vm.validLoanReqHeader()) {
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
                //申请单关联借款时，保存申请单信息
                if (vm.type == 'reqRefLoan') {
                    vm.header.ref_document_id = vm.reqHeaderId;
                    vm.header.ref_document_display = vm.reqDocNumber;
                }
                var params = vm.header;
                //调用申请头保存接口
                PublicFunction.showLoading(250);
                LoanHeaderService.saveLoanReqHeader(params).success(function (res) {
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


            /**
             * 查看借款申请行信息(先保存头信息再跳转到行界面)
             * @param loanReqLineId 申请行ID
             */
            function toLoanReqLine(loanReqLineId) {
                vm.saveLoanReqHeader("").then(function (data) {
                    if (data === "S") {
                        PageValueService.set("reqHeader", "");
                        PageValueService.set("reqHeader", vm.header);
                        $state.go('app.loanReqLine', {
                            loanReqHeaderId: vm.loanReqHeaderId,
                            loanReqLineId: loanReqLineId,
                            maxLineNum: vm.header.max_num
                        });
                    }
                });
            }

            /**
             * 删除借款申请行信息(先保存头信息再删除)
             * @param line 借款申请行对象
             */
            function deleteLoanReqLine(line) {
                vm.saveLoanReqHeader("").then(function (data) {
                    if (data === "S") {
                        //调用差旅申请行删除接口
                        PublicFunction.showLoading(250);
                        LoanHeaderService.deleteLoanReqLine(line.payment_requisition_line_id).success(function (res) {
                            if (res.success) {
                                $ionicLoading.hide();
                                //计算总金额
                                vm.header.total_amount = vm.header.total_amount - line.amount;
                                //删除
                                vm.lineList.splice(vm.lineList.indexOf(line), 1);
                                if(vm.lineList.length<=0){
                                    vm.isReadOnly = false;
                                }
                                PublicFunction.showToast($filter('translate')('req.message.success.delete'));//删除成功!
                            } else {
                                console.log("数据删除失败：" + angular.toJson(res.error.message));
                                PublicFunction.showToast(res.error.message);
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
             *   1. 已经被费用申请单关联的借款单，不能提交
             *   2. 如果没有行信息，不能提交
             * @returns {Promise}
             */
            function preSubmit() {
                var deferred = $q.defer();
                if (!PublicFunction.isNull(vm.header.ref_document_id)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.loan.is.submitted.according.to.the.req'));
                    deferred.reject("E");
                }
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
            function submitLoanReq() {
                preSubmit().then(function (data) {
                    if (data === "S") {
                        vm.saveLoanReqHeader("").then(function (data) {
                            if (data === "S") {
                                //调用借款申请提交接口
                                PublicFunction.showLoading(250);
                                LoanHeaderService.submitLoanReq(vm.loanReqHeaderId).success(function (res) {
                                    if (res.success) {
                                        PageValueService.set("reqHeader", "");
                                        PageValueService.set("messageFlag","");
                                        if( vm.messageFlag==='Y'){
                                            $state.go('app.erv_notification');
                                        }else {
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
             * 验证申请头信息(字段必输性验证)
             * @returns {boolean}
             */
            function validLoanReqHeader() {
                //请先选择公司
                if (PublicFunction.isNull(vm.header.unit_name)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.unit_name'));
                    return false;
                }
                //请先选择成本中心
                if (PublicFunction.isNull(vm.header.responsibility_center_name)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.responsibility_center_name'));
                    return false;
                }
                //请先选择申请日期
                if (PublicFunction.isNull(vm.header.requisition_date)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.requisition_date'));
                    return false;
                }
                //请先选择币种
                if (PublicFunction.isNull(vm.header.currency_code)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.currency_code'));
                    return false;
                }
                //汇率不存在，请联系管理员维护汇率!
                if (PublicFunction.isNull(vm.header.exchange_rate)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.exchange_rate'));
                    return false;
                }
                //请先选择付款方式
                if (PublicFunction.isNull(vm.header.payment_method_id_display)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.payment.method'));
                    return false;
                }
                //请先选择付款对象
                if (PublicFunction.isNull(vm.header.partner_category_display)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.payment.object'));
                    return false;
                }
                //请先选择收款方
                if (PublicFunction.isNull(vm.header.p_partner_name)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.payee'));
                    return false;
                }
                //业务属性为对公，合同付款条件为必输
                if (!PublicFunction.isNull(vm.header.business_attribute) && vm.header.business_attribute == 'G' && PublicFunction.isNull(vm.header.contract_pay_term)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.contract.pay.term'));
                    return false;
                }
                //请输入申请事由
                if (PublicFunction.isNull(vm.header.description)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.description'));
                    return false;
                }
                return true;
            };

            /**
             * 获取单据历史
             */
            function goDocHistory() {
                $state.go('app.docHistory', {type: 'loan', headerId: vm.loanReqHeaderId});
            }

            /*
             * 监听收款对象
             */
            $scope.$watch("vm.header.partner_category", function (newValue, oldValue) {
                console.log(vm.header.partner_category);
                if (!PublicFunction.isNull(newValue) && !PublicFunction.isNull(oldValue)) {
                    if (newValue != oldValue) {
                        vm.header.p_partner_name = "";
                    }
                }
            });

            //监听结算币种
            $scope.$watch("vm.header.currency_code", function (newValue, oldValue) {
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
            $scope.showPopup = function (docType) {
                var confirmPopup = $ionicPopup.confirm({
                    title: $filter('translate')('confirm.window.prompt'),//提示
                    template: $filter('translate')('confirm.window.Information.loan'),//是否保存该借款申请单
                    cancelText: $filter('translate')('confirm.window.cancel'),//取消
                    okText: $filter('translate')('confirm.window.ok'),//确认保存
                    cssClass: 'delete-ordinary-application-popup'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        vm.saveLoanReqHeader("").then(function (data) {
                            if (data === "S") {
                                vm.goToPage(docType);
                            }
                        });
                    } else {
                        vm.goToPage(docType);
                    }
                });
            };

            /**
             * 返回关联的申请单
             */
            function goRefReq() {
                PageValueService.set("reqHeader", "");
                $state.go('app.dailyReqHeader', {reqHeaderId: vm.reqHeaderId});
            }

            /**
             * 页面跳转
             * @param docType 跳转类型: travel daily 返回申请单
             */
            function goToPage(docType) {
                if (docType == 'travel') {
                    $state.go('app.travelReqHeader', {reqHeaderId: vm.reqHeaderId});
                } else if (docType == 'daily') {
                    $state.go('app.dailyReqHeader', {reqHeaderId: vm.reqHeaderId});
                } else {
                    if (vm.header.initFlag) {//页面初始化时
                        vm.loanReqHeaderId = "";
                        vm.header = {};
                        if (vm.type != 'reqRefLoan') {
                            vm.type = 'LoanReq';//列表页面新建借款申请
                        }
                        $state.go('app.companyExpType', {chooseValue: vm.type}); //跳转到公司类型选择界面
                    } else {
                        console.log("vm.type:" + vm.type);
                        if (vm.type == 'reqRefLoan') {
                            $state.go('app.reqRefLoanList');
                        } else {
                            PageValueService.set("messageFlag","");
                            if(vm.messageFlag==='Y'){
                                $state.go('app.erv_notification');
                            }else {
                                $state.go('app.reqList'); //跳转到申请列表界面
                            }
                        }
                    }
                }
            }

            $scope.goBack = function (docType) {
                PageValueService.set("reqHeader", "");
                if (isChanged()) {
                    $scope.showPopup(docType);
                } else {
                    vm.goToPage(docType);
                }
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
                        locale: $sessionStorage.lang //LANG
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
                            if ($sessionStorage.lang != 'zh_cn') {//LANG
                                banPick.language = "en";
                            }
                            HmsCalendar.openCalendar(success, error, 2, banPick);
                        }
                    }
                }
            };
        }]);

