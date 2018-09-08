/**
 * Created by Hurong on 2017/8/2.
 *  审批申请页面-查看预算项目
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.payPlan', {
                cache: false,
                url: '/payPlan',
                params: {
                    headerId: '',
                    planItem: '',
                    type: 'approval',//approval:审批中心模块、report:报销单模块
                    status: '',
                    maxLine: ''
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/approval_center/report/payPlan.html',
                        controller: 'payPlanController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecapproval');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('payPlanController', ['$scope', '$filter','$ionicPopup', '$cordovaDatePicker', 'LANG', 'PageValueService', 'localStorageService', 'LocalStorageKeys', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading',
        '$timeout', '$stateParams', 'ReportHeaderService', 'PublicFunction', 'approvalService','$sessionStorage',
        function ($scope, $filter, $ionicPopup,$cordovaDatePicker, LANG, PageValueService, localStorageService, LocalStorageKeys, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, $stateParams,
                  ReportHeaderService, PublicFunction, approvalService,$sessionStorage) {
            var vm = this;
            vm.isReadonly = false;
            vm.headerId = $stateParams.headerId;
            vm.type = $stateParams.type;
            vm.status = $stateParams.status;
            vm.nothing = false;
            vm.payPlans = [];
            var oldObject = {};
            console.log("payPlan type:" + vm.type);
            //保存付款计划行
            vm.validPlan = validPlan;
            vm.savePayPlan = savePayPlan;
            vm.initPage = initPage;
            vm.initPage();
            function initPage() {
                if (!(vm.type == 'report' && vm.status == 'waitSubmit')) {
                    //审批中心查看
                    PublicFunction.showLoading();
                    approvalService.searchApprovalReport('center_report_plan_payment', vm.headerId).then((function (res) {
                        if (res.data.success && res.data.result.pageCount > 0) {
                            vm.payPlans = res.data.result.record;
                            vm.nothing = false;
                        } else {
                            vm.nothing = true;
                            console.log("付款计划查询失败,headerId=" + vm.headerId);
                            PublicFunction.showToast($filter('translate')('message.error.query'));  // 数据查询失败
                        }
                        $ionicLoading.hide();
                    }), function (error) {
                        console.log("付款计划查询失败,headerId=" + vm.headerId);
                        PublicFunction.showToast($filter('translate')('message.error.query'));  // 数据查询失败
                    });
                } else {
                    //报销单待提交
                    vm.reportHeaderParams = PageValueService.get("reportHeaderParams");
                    vm.maxLine = $stateParams.maxLine;
                    if (vm.maxLine) {//新增
                        vm.reportHeaderParams = PageValueService.get("reportHeaderParams");
                        vm.planItem = {};
                        vm.planItem.initFlag = true;
                        vm.planItem.schedule_line_number = vm.maxLine;
                        vm.planItem.write_off_amount1 = 0;
                        vm.planItem.schedule_start_date= new Date(vm.reportHeaderParams.exp_report_date).Format('yyyy-MM-dd');
                        //收款方式
                        vm.planItem.payment_method = vm.reportHeaderParams.exp_report_payment_method;
                        vm.planItem.payment_type_id = vm.reportHeaderParams.payment_method_id;
                        //收款对象
                        vm.planItem.payee_type = vm.reportHeaderParams.exp_report_payee_category_name;
                        vm.planItem.payee_type_value = vm.reportHeaderParams.exp_report_payee_category;
                        vm.planItem.schedule_due_date = new Date(vm.reportHeaderParams.exp_report_date).Format('yyyy-MM-dd');
                        vm.planItem.description = vm.reportHeaderParams.exp_report_description;
                        vm.planItem.payment_usedes = "GD_03";
                        oldObject = JSON.stringify(vm.planItem);
                    } else {//修改
                        //获取报销单付款计划
                        vm.planItem = $stateParams.planItem;
                        oldObject = JSON.stringify(vm.planItem);
                        vm.isReadonly = true;
                    }
                }
            }



            function validPlan() {
                if (PublicFunction.isNull(vm.planItem.write_off_amount1)) {
                    console.log("请输入冲账金额！");
                    PublicFunction.showToast($filter('translate')('error.please.enter.the.write.off.amount'));//请输入冲账金额
                    return false;
                }else if(PublicFunction.isNull(vm.planItem.due_amount)){
                    PublicFunction.showToast($filter('translate')('error.please.enter.total.amount'));//请输入总金额
                    return false;
                }else if(PublicFunction.isNull(vm.planItem.payment_method)){
                    PublicFunction.showToast($filter('translate')('error.please.enter.payment.method'));//请输入总金额
                    return false;
                }else if(PublicFunction.isNull(vm.planItem.payee_type)){
                    PublicFunction.showToast($filter('translate')('error.please.select.payee.type'));//请选择收款对象
                    return false;
                }else if(PublicFunction.isNull(vm.planItem.payee_partner_name)){
                    PublicFunction.showToast($filter('translate')('error.please.select.payee.partner.name'));//请选择收款方
                    return false;
                }else if(PublicFunction.isNull(vm.planItem.account_number)){
                    PublicFunction.showToast($filter('translate')('error.please.select.account.number'));//请选择银行账号
                    return false;
                }else if(PublicFunction.isNull(vm.planItem.account_name)){
                    PublicFunction.showToast($filter('translate')('error.please.select.account.name'));//户名不能为空
                    return false;
                }else if (PublicFunction.isNull(vm.planItem.schedule_due_date)){
                    PublicFunction.showToast($filter('translate')('error.please.select.schedule.start.date'));//请选择计划付款日期
                    return false;
                }else{
                    vm.planItem.write_off_amount1 = vm.planItem.write_off_amount1.toFixed(2)*1;
                    vm.planItem.due_amount = vm.planItem.due_amount.toFixed(2)*1;
                    return true;
                }
            }
            /**
             * 保存付款计划行
             */
            function savePayPlan() {
                if(vm.validPlan()){
                    if (PublicFunction.isNull(vm.planItem.frozen_flag)) {
                        vm.planItem.frozen_flag = 'N';
                    }
                    vm.planItem.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                    vm.planItem.company_id = vm.reportHeaderParams.company_id;
                    vm.planItem.currency = vm.reportHeaderParams.exp_report_currency_code;
                    vm.planItem.exp_report_header_id = vm.reportHeaderParams.exp_report_header_id;
                    var params = [vm.planItem];
                    ReportHeaderService.savaPayPlans(params).then(function (res) {
                        if (res.data.success) {
                            vm.planItem ={};
                            vm.planItem =res.data.result.record.record[0].record;
                            console.log("保存成功");
                            $state.go('app.paymentList', {headerId: vm.headerId});
                        } else {
                            PublicFunction.showToast($filter('translate')('error.save.failed'));  // 保存失败
                        }
                    }, function (error) {
                        console.log("请求保存失败： " + angular.toJson(error));
                        PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                    });
                    vm.planItem.initFlag =false;
                }
            }

            //监听收款对象改变清空收款方的值
            $scope.$watch("vm.planItem.payee_type_value", function (newValue, oldValue) {
                if (!PublicFunction.isNull(newValue) && !PublicFunction.isNull(oldValue)) {
                    if (newValue != oldValue) {
                        vm.planItem.payee_partner_name = "";
                        vm.planItem.payee_id = "";
                        vm.planItem.account_number = "";
                        vm.planItem.account_name = "";
                        vm.planItem.bank_code = "";
                        vm.planItem.bank_name = "";
                        vm.planItem.bank_location_code = "";
                        vm.planItem.bank_location_name = "";
                    }
                }
            });

            //选择时间
            $scope.datePicker = {
                selectDate: function () {
                    var dateOptions = {
                        date: vm.planItem.schedule_due_date,
                        mode: 'date',
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('button.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('button.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        locale: $sessionStorage.lang //$sessionStorage.lang
                    };

                    // 如果费用不是只读,或者是第三方费用,或者是报销单中编辑费用,可以编辑
                    $cordovaDatePicker.show(dateOptions).then(function (date) {
                        if (date) {
                            vm.planItem.schedule_due_date = new Date(date).Format('yyyy-MM-dd');
                            vm.header.period_name = $filter('date')(vm.planItem.schedule_due_date, 'yyyy-MM');
                        }
                    });

                },
                selectHandDate: function () {
                    var date = null;
                    if (vm.planItem.schedule_due_date) {
                        date = new Date(vm.planItem.schedule_due_date).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if (ionic.Platform.isAndroid()) {
                                $scope.result = new Date(response).Format('yyyy-MM-dd');
                            } else {
                                $scope.result = new Date(response.result).Format('yyyy-MM-dd');
                            }
                            vm.planItem.schedule_due_date = $scope.result;
                            $scope.$apply();
                        } catch (e) {
                        }
                    };
                    var error = function (response) {
                    };
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
            };

            $scope.showPopup = function () {
                if(!(vm.type == 'report' && vm.status == 'waitSubmit')){
                    $scope.goBack();
                }else{
                    var newObject = JSON.stringify(vm.planItem);
                  /*   console.log("旧的数据"+oldObject);
                     console.log("新的数据"+ newObject);*/
                    if(newObject != oldObject){
                        var confirmPopup = $ionicPopup.confirm({
                            title: $filter('translate')('approval.report.payPlan.prompt'),//提示
                            template: $filter('translate')('approval.report.payPlan.Information.not.saved.exit'),//信息未保存,是否退出?
                            cancelText: $filter('translate')('common.cancel'),//取消
                            okText: $filter('translate')('common.ok'),//确定
                            cssClass: 'delete-ordinary-application-popup'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                $scope.goBack();
                            }
                        });
                    }else{
                        $scope.goBack();
                    }
                }
            }

            $scope.goBack = function () {
                if (vm.type == 'approval') {
                    $state.go('app.approvalReport');
                } else if (vm.type == 'report') {
                    if (vm.status == 'waitSubmit') {
                        $state.go('app.paymentList', {headerId: vm.headerId});
                        /* var params = {
                         headerId : $stateParams.headerId
                         }
                         $state.go('app.reportHeader',params);*/
                    } else {
                        $state.go('app.approvalReport');
                    }
                } else {
                    $state.go('app.tab_erv.homepage');
                }
            };

            $scope.$watch("vm.planItem.write_off_amount1", function (newValue, oldValue) {
                var amount = vm.planItem.write_off_amount1+"";
                if(amount.indexOf(".") != -1){
                    vm.planItem.write_off_amount1 = parseFloat(amount.substring(0,amount.indexOf(".") + 3));
                }
                vm.planItem.payment_amount = vm.planItem.due_amount - vm.planItem.write_off_amount1;//改变冲账金额触发事件  应付-冲账=实付金额
            })
            $scope.$watch("vm.planItem.due_amount", function (newValue, oldValue) {
                var amount = vm.planItem.due_amount+"";
                if(amount.indexOf(".") != -1){
                    vm.planItem.due_amount = parseFloat(amount.substring(0,amount.indexOf(".") + 3));
                }
                vm.planItem.payment_amount = vm.planItem.due_amount - vm.planItem.write_off_amount1;//改变冲账金额触发事件  应付-冲账=实付金额
            })

        }]);

