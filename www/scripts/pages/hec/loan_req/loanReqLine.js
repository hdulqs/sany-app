/**
 * Created by Hurong on 2017/8/1.
 *  新建借款申请-借款申请行信息
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.loanReqLine', {
                cache: false,
                url: '/loanReqLine',
                data: {
                    roles: []
                },
                params: {
                    loanReqHeaderId: "",
                    loanReqLineId: "",
                    maxLineNum: ""
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/loan_req/loanReqLine.html',
                        controller: 'loanReqLineController',
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
    .controller('loanReqLineController', ['$scope', '$filter', 'LANG', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout',
        'PublicFunction', 'LoanHeaderService', '$q', 'PageValueService', '$stateParams', '$ionicPopup', '$cordovaDatePicker','$sessionStorage',
        function ($scope, $filter, LANG, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, PublicFunction, LoanHeaderService
            , $q, PageValueService, $stateParams, $ionicPopup, $cordovaDatePicker,$sessionStorage) {
            var vm = this;
            //页面初始化
            vm.initPage = initPage;
            //保存借款申请单行信息
            vm.saveLoanReqLine = saveLoanReqLine;
            //需要监听的字段
            vm.watchString = watchString;
            //判断数据是否有修改
            vm.isChanged = isChanged;
            //验证借款申请行数据
            vm.validLoanReqLine = validLoanReqLine;
            //保存并新建
            vm.addNewLine = addNewLine;
            //回退按钮
            vm.goBack = goBack;
            vm.dataStr = "";
            vm.line = {};
            vm.isReadOnly = false;
            vm.loanReqLineId = $stateParams.loanReqLineId;
            vm.maxLineNum = $stateParams.maxLineNum;
            vm.loanReqHeaderId = $stateParams.loanReqHeaderId;
            vm.header = PageValueService.get("reqHeader");
            vm.canReqAmount = 0;//可借金额
            vm.oldLineAmount = 0;//行查询金额

            //获取type
            vm.reqRefLoanInfo = PageValueService.get("reqRefLoanInfo");
            if (!PublicFunction.isNull(vm.reqRefLoanInfo)) {
                vm.type = vm.reqRefLoanInfo.type;//类型：reqRefLoan 申请单关联借款跳转
            }
            //项目lov：标题
            vm.dimPrompt = $filter('translate')('hec_lov.input.dimension.prompt');

            function initPage() {
                //当关联了申请单时，获取可借金额
                if(vm.header.ref_document_id){
                    LoanHeaderService.getCanReqAmount(vm.header.ref_document_id).then(function (res) {
                        if (res.data.success) {
                            vm.canReqAmount = res.data.result.record[0].unrequisited_amount;
                        } else {
                            PublicFunction.showToast(res.data.error.message);  // 获取可借金额失败
                        }
                    });
                }
                console.log("vm.loanReqLineId====" + vm.loanReqLineId);
                if (!PublicFunction.isNull(vm.loanReqLineId)) {
                    PublicFunction.showLoading(150);
                    LoanHeaderService.searchLoanReqLine(vm.loanReqLineId).then(function (res) {
                        $ionicLoading.hide();
                        if (res.data.success) {
                            var result = res.data.result;
                            vm.line = result.record[0];
                            vm.oldLineAmount = vm.line.amount;
                            vm.dataStr = vm.watchString();
                        } else {
                            PublicFunction.showToast(res.data.error.message);  // 借款申请行查询失败
                        }
                    }, function (error) {
                        $ionicLoading.hide();
                        PublicFunction.showToast($filter('translate')('message.error.query'));  // 数据查询失败
                    });
                } else {
                    vm.line = {};
                    vm.maxLineNum = vm.maxLineNum + 10;
                    vm.line.line_number = vm.maxLineNum;
                    vm.line.payment_requisition_line_id = "";
                    //头id
                    vm.line.payment_requisition_header_id = vm.header.payment_requisition_header_id;
                    //公司
                    vm.line.company_id = vm.header.company_id;
                    //币种
                    vm.line.currency_code = vm.header.currency_code;
                    //业务期间
                    vm.line.period_name = $filter('date')(vm.header.requisition_date, 'yyyy-MM');//根据头上的日期截取业务期间
                    //汇率
                    vm.line.exchange_rate = vm.header.exchange_rate;
                    //事由：默认头上的
                    vm.line.description = vm.header.description;
                    //付款方式
                    vm.line.payment_method_id = vm.header.payment_method_id;
                    vm.line.payment_method_id_display = vm.header.payment_method_id_display;
                    //收款对象
                    vm.line.partner_category = vm.header.partner_category;
                    vm.line.partner_category_name = vm.header.partner_category_display;//头上是partner_category_display，行上是partner_category_name
                    //收款方
                    vm.line.partner_id = vm.header.partner_id
                    vm.line.p_partner_name = vm.header.p_partner_name;
                    //银行账号和银行信息
                    vm.line.account_number = vm.header.account_number;
                    vm.line.account_name = vm.header.account_name;
                    vm.line.bank_code = vm.header.bank_code;
                    vm.line.bank_name =  vm.header.bank_name;
                    vm.line.bank_location_code =  vm.header.bank_location_code;
                    vm.line.bank_location_name  = vm.header.bank_location_name;
                    vm.line.project_id = vm.header.project_id;
                    vm.line.project_name = vm.header.project_name;
                    vm.line.payment_usedes = "GD_11";

                    //业务属性取头上的，对公("G")时,行保存"A";对私("S")时,行保存"B"
                    if(!PublicFunction.isNull(vm.header.business_attribute)){
                        vm.line.business_attribute = vm.header.business_attribute=="G"?"A":"B";
                    }
                    //关联申请单信息
                    vm.line.ref_document_id = vm.header.ref_document_id;
                    vm.line.ref_document_display = vm.header.ref_document_display;
                    //关联申请时
                    if (vm.type == 'reqRefLoan') {
                        vm.line.payment_requisition_line_type = "EXP_REQUISITION";//行类型
                    } else {
                        vm.line.payment_requisition_line_type = "OTHERS";//行类型
                    }
                    // vm.line.plan_payment_date = '2017-11-27';
                }
            }

            vm.initPage();

            /**
             * 保存借款申请行信息
             * @param type M/手动点击保存按钮  A/程序自动保存
             */
            function saveLoanReqLine(type) {
                var deferred = $q.defer();
                if (!vm.validLoanReqLine()) {
                    deferred.resolve("E");
                    return deferred.promise;
                }

                var plan_payment_date = new Date(vm.line.plan_payment_date);
                //限制预计还款日期为1个月内
                if(vm.header.csh_type_code&&vm.header.csh_type_code=="110"){
                    if (plan_payment_date>setDateMonth(vm.header.requisition_date)) {
                        var confirmPopup = $ionicPopup.confirm({
                            title: $filter('translate')('confirm.window.prompt'),//提示
                            template: $filter('translate')('req.message.error.line.repayment.date.is.not.earlier.than.application.date.month'),//是否保存该借款申请单行信息
                            cancelText: $filter('translate')('confirm.window.cancel'),//取消
                            okText: $filter('translate')('confirm.window.ok'),//确定
                            cssClass: 'loanReqLine-application-popup'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                if (!vm.isChanged()) {
                                    console.log("数据未修改");
                                    deferred.resolve("S");
                                    if (type === "M") { //显示保存成功提示
                                        //PublicFunction.showToast("没有修改数据，无需保存!");
                                        $state.go('app.loanReqHeader', {loanReqHeaderId: vm.loanReqHeaderId});
                                    }
                                    return deferred.promise;
                                }

                                var params = vm.line;
                                //调用申请行保存接口
                                PublicFunction.showLoading(250);
                                LoanHeaderService.saveLoanReqLine(params).success(function (res) {
                                    $ionicLoading.hide();
                                    if (res.success) {
                                        if (type === "M") { //点击保存按钮保存
                                            //PublicFunction.showToast("保存成功");
                                            $state.go('app.loanReqHeader', {loanReqHeaderId: vm.loanReqHeaderId});
                                        }
                                        vm.line.payment_requisition_line_id = res.result.record.payment_requisition_line_id;
                                        vm.loanReqLineId = vm.line.payment_requisition_line_id;
                                        vm.oldLineAmount = vm.line.amount;
                                        vm.dataStr = vm.watchString();
                                        deferred.resolve("S");
                                    } else {
                                        console.log("保存出错,错误信息：" + angular.toJson(res.error.message));
                                        PublicFunction.showToast(res.error.message);
                                        deferred.reject("E");
                                    }
                                }).error(function (error) {
                                    $ionicLoading.hide();
                                    //PublicFunction.showToast('请求失败！');
                                    $filter('translate')('error.request')
                                    console.log("失败信息" + angular.toJson(error));
                                    deferred.reject("E");
                                });
                                return deferred.promise;
                            } else {
                                deferred.resolve("E");
                                return deferred.promise;
                            }
                        });
                    }
                }
            }

            /**
             * 保存并新建另外一行行程
             */
            function addNewLine() {
                vm.saveLoanReqLine("").then(function (data) {
                    if (data === "S") {
                        $state.go('app.loanReqLine', {
                            loanReqHeaderId: vm.loanReqHeaderId,
                            loanReqLineId: "",
                            maxLineNum: vm.maxLineNum
                        });
                    }
                });
            }

            /**
             * 比当前日期大一个月的日期
             * @param {Date} date
             */
            function setDateMonth(date){
                var d = new Date(date);
                var month = d.getMonth();
                if(11 === month){
                    var year = d.getFullYear();
                    d.setMonth(0);
                    d.setFullYear(year + 1);
                }else{
                    d.setMonth(month + 1);
                }
                return d;
            }
            /**
             * 验证申请行信息(字段必输性验证)
             * @returns {boolean}
             */
            function validLoanReqLine() {
                //请先选择借款类型
                if (PublicFunction.isNull(vm.line.cls_des)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.loan.type'));
                    return false;
                }
                //请先选择付款方式
                if (PublicFunction.isNull(vm.line.payment_method_id_display)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.payment.method'));
                    return false;
                }
                //请先选择付款对象
                if (PublicFunction.isNull(vm.line.partner_category_name)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.payment.object'));
                    return false;
                }
                //请先选择收款方
                if (PublicFunction.isNull(vm.line.p_partner_name)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.header.required.payee'));
                    return false;
                }
                //请输入预计还款日期
                if (PublicFunction.isNull(vm.line.plan_payment_date)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.plan.payment.date'));
                    return false;
                }
                //预计还款日期不能早于申请日期
                if (vm.line.plan_payment_date<vm.header.requisition_date) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.repayment.date.is.not.earlier.than.application.date'));
                    return false;
                }
                //请输入附言
              /*  if (PublicFunction.isNull(vm.line.special_payment_usedes)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.special.payment.usedes'));
                    return false;
                }*/
                //请先选择银行账号
                if (PublicFunction.isNull(vm.line.account_number)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.account.number'));
                    return false;
                }
                //借款金额必须大于等于0
                if (PublicFunction.isNull(vm.line.amount) || vm.line.amount <= 0) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.Amount.must.more.than.0.loan.amount'));
                    return false;
                }
                //当关联了申请单时，借款金额不能超出可借金额!
                if (vm.header.ref_document_id && vm.canReqAmount+vm.oldLineAmount-vm.line.amount < 0) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.max.loan.amount'));
                    //
                    return false;
                }
                //请先选择银行账号
                if (PublicFunction.isNull(vm.line.project_name)) {
                    PublicFunction.showToast($filter('translate')('req.message.error.line.required.project.name'));
                    return false;
                }

                return true;
            };

            function watchString() {
                var tmp = {
                    "cls_des": vm.line.cls_des,
                    "payment_method_id_display": vm.line.payment_method_id_display,
                    "partner_category_display": vm.line.partner_category_display,
                    "p_partner_name": vm.line.p_partner_name,
                    "plan_payment_date": vm.line.plan_payment_date,
                    "special_payment_usedes": vm.line.special_payment_usedes,
                    "account_number": vm.line.account_number,
                    "amount": vm.line.amount,
                    "cash_plan_number": vm.line.cash_plan_number,
                    "description": vm.line.description,
                    "project_name":vm.line.project_name
                };
                return angular.toJson(tmp);
            }

            function isChanged() {
                var str = vm.watchString();
                if (str != vm.dataStr) {
                    return true;
                }
                console.log("没有修改数据");
                return false;
            }

            //监听收款对象
            $scope.$watch("vm.line.partner_category", function (newValue, oldValue) {
                console.log(vm.line.partner_category);
                if (!PublicFunction.isNull(newValue) && !PublicFunction.isNull(oldValue)) {
                    if (newValue != oldValue) {
                        vm.line.p_partner_name = "";
                    }
                }
            });

            //监听金额
            $scope.$watch("vm.line.amount", function (newValue, oldValue) {
                var amount = vm.line.amount+"";
                if(amount.indexOf(".") != -1){
                    vm.line.amount = parseFloat(amount.substring(0,amount.indexOf(".") + 3));
                }
                vm.line.function_amount = (vm.line.amount * vm.line.exchange_rate).toFixed(2);
            })

            function goBack() {
                if (vm.isChanged()) {
                    $scope.showPopup();
                } else {
                    $state.go('app.loanReqHeader', {loanReqHeaderId: vm.loanReqHeaderId});
                }
            };

            $scope.showPopup = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: $filter('translate')('confirm.window.prompt'),//提示
                    template: $filter('translate')('confirm.window.Information.loan.line'),//是否保存该借款申请单行信息
                    cancelText: $filter('translate')('confirm.window.cancel'),//取消
                    okText: $filter('translate')('confirm.window.ok'),//确定
                    cssClass: 'delete-ordinary-application-popup'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        vm.saveLoanReqLine("").then(function (data) {
                            if (data === "S") {
                                $state.go('app.loanReqHeader', {loanReqHeaderId: vm.loanReqHeaderId});
                            }
                        });
                    } else {
                        $state.go('app.loanReqHeader', {loanReqHeaderId: vm.loanReqHeaderId});
                    }
                });
            };

            //选择时间
            $scope.datePicker = {
                selectDate: function () {
                    var dateOptions = {
                        date: vm.line.plan_payment_date,
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
                                vm.line.plan_payment_date = new Date(date).Format('yyyy-MM-dd');
                            }
                        });
                    }
                },
                selectHandDate: function () {
                    var date = null;
                    if (vm.line.plan_payment_date) {
                        date = new Date(vm.line.plan_payment_date).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if (ionic.Platform.isAndroid()) {
                                $scope.result = new Date(response).Format('yyyy-MM-dd');
                            } else {
                                $scope.result = new Date(response.result).Format('yyyy-MM-dd');
                            }
                            vm.line.plan_payment_date = $scope.result;
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


