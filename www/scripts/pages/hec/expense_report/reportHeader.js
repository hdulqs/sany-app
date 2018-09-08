/**
 * Created by Hurong on 2017/8/3.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.reportHeader', {
                cache: false,
                url: '/reportHeader',
                params: {
                    headerId: ''//报销单头id
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_report/reportHeader.html',
                        controller: 'reportHeaderCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecexp.report');
                        $translatePartialLoader.addPart('components');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('reportHeaderCtrl', ['$scope', '$q', '$ionicPopup', '$cordovaDatePicker', 'LANG', '$filter', '$ionicHistory',
        '$state', '$ionicLoading', '$timeout', '$stateParams', 'localStorageService', 'LocalStorageKeys', 'PageValueService',
        'PublicFunction', 'HecImageService', 'approvalService', 'ReportHeaderService','$sessionStorage',
        function ($scope, $q, $ionicPopup, $cordovaDatePicker, LANG, $filter, $ionicHistory,
                  $state, $ionicLoading, $timeout, $stateParams, localStorageService, LocalStorageKeys, PageValueService,
                  PublicFunction, HecImageService, approvalService, ReportHeaderService,$sessionStorage) {
            var vm = this;
            //参数定义
            vm.headerId = $stateParams.headerId;
            vm.comDocData = PageValueService.get("comDocData"); //从单据类型选择设置的参数
            vm.messageFlag = PageValueService.get("messageFlag");//判断是否是消息列表跳转标志
            vm.type = 'report';
            vm.header = {};
            vm.lineList = [];
            vm.attachments = [];//附件
            vm.isReadOnly = false;
            vm.dataStr = "";
            vm.hasLines = false;

            //方法定义：初始化page
            vm.initPage = initPage;
            //页面跳转
            vm.goPage = goPage;
            //报销单行详情
            vm.goExpenseLine = goExpenseLine;
            //是否存在计划付款行
            vm.getPayPlan = getPayPlan;
            //一键生成计划付款行
            vm.createPayPlan = createPayPlan;
            //付款计划行详情查看
            vm.goPayPlan = goPayPlan;
            //保存报销单头信息
            vm.saveReportHeader = saveReportHeader;
            //验证头上字段必输性
            vm.validReportHeader = validReportHeader;
            //删除报销单行信息
            vm.deleteExpReportLine = deleteExpReportLine;
            //报销单提交
            vm.submitReport = submitReport;
            //监听字段
            vm.watchString = watchString;
            //计算行上总金额
            vm.calTotalAmount = calTotalAmount;


            vm.initPage();

            //初始化页面
            function initPage() {
                vm.hasPayPlanFlag = false;
                //安卓，从行上点击返回键时，加载页面数据
                if (PublicFunction.isNull(vm.headerId) && !PublicFunction.isNull(PageValueService.get("reportHeaderParams"))) {
                    vm.headerId = PageValueService.get("reportHeaderParams").exp_report_header_id;
                }
                //页面重新加载的时候清空
                PageValueService.set("reportHeaderParams", "");
                PageValueService.set("reqItem", "");
                console.log("报销单头id == " + vm.headerId);
                if (PublicFunction.isNull(vm.headerId)) {
                    //新建报销单信息
                    initReportHeader();
                } else {
                    //待提交报销单查询
                    PublicFunction.showLoading(150);
                    //加载附件
                    HecImageService.downloadImage("erh", vm.headerId).then(function (res) {
                        vm.attachments = res;
                    });
                    //获取报销单头行信息
                    ReportHeaderService.searchReportHeaderLine(vm.headerId).then(function (res) {
                        $ionicLoading.hide();
                        if (res.data.success) {
                            var result = res.data.result;
                            if(result.record&&result.record.length){
                                vm.header = result.record[0];
                                vm.header.initFlag = false;
                            }
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
                            vm.calTotalAmount();
                            vm.getPayPlan();
                        } else if (res.data.error.message) {
                            PublicFunction.showToast(res.data.error.message);
                        } else {
                            PublicFunction.showToast(res.data.error);
                        }
                    }, function (error) {
                        $ionicLoading.hide();
                        PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                        console.log("请求获取单据行数据失败： " + angular.toJson(error));
                    });
                }
            }

            function getPayPlan() {
                //判断当前页面是否有计划付款行
                ReportHeaderService.searchPlanPayment(vm.headerId).then(function (res) {
                    if (res.data.success) {
                        if (res.data.result.totalCount > 0) {
                            vm.hasPayPlanFlag = true;
                        }
                    }
                });
            }


            /**
             * 初始化报销单头信息
             * 初始化接口不生成报销单头ID(exp_report_header_id)
             * 调用报销单头保存接口时返回exp_report_header_id
             */
            function initReportHeader() {
                console.log(angular.toJson(vm.comDocData));
                ReportHeaderService.initReportHeader(vm.comDocData.companyId, vm.comDocData.employeeId, vm.comDocData.docTypeId, vm.comDocData.cryCode).then(function (res) {
                    if (res.data.success) {
                        if (res.data.result.record) {
                            vm.header = res.data.result.record[0];
                            vm.header.company_id = vm.comDocData.companyId;
                            vm.header.company_short_name = vm.comDocData.companyName;

                            vm.header.exp_report_type_id = vm.comDocData.docTypeId;
                            vm.header.exp_report_type_name = vm.comDocData.docTypeName;
                            vm.header.exp_report_type_code = vm.comDocData.docTypeCode;

                            //申请与非申请标志
                            vm.header.req_required_flag = vm.comDocData.reqRequiredFlag;
                            //精简与非精简
                            vm.header.document_page_type = vm.comDocData.documentPageType;

                            //为精简时默认设置对私
                            if (vm.header.document_page_type == 'STREAMLINED') {
                                vm.header.business_attribute_code = 'S';
                            }
                            vm.header.unit_id = vm.comDocData.unitId;
                            vm.header.unit_name = vm.comDocData.unitName;

                            vm.header.responsibility_center_id = vm.comDocData.respId;
                            vm.header.responsibility_center_name = vm.comDocData.respName;

                            vm.header.employee_id = vm.comDocData.employeeId;
                            vm.header.employee_name = vm.comDocData.employeeName;
                            //收款币种
                            vm.header.exp_report_currency_code = vm.comDocData.cryCode;
                            //本位币
                            vm.header.functional_currency_code = vm.comDocData.functionCry;

                            vm.header.initFlag = true;//报销单初始化标志，保存时不传递此参数
                        }
                    } else if (res.data.error.message) {
                        PublicFunction.showToast(res.data.error.message);  // 报销单头初始化失败
                    } else {
                        PublicFunction.showToast(res.data.error);
                    }
                }, function (error) {
                    console.log("error when init header: " + angular.toJson(error));
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                });
            }

            /**
             * 保存报销单头信息
             * type M/手动点击保存按钮  A/程序自动保存
             * @param type
             */
            function saveReportHeader(type) {
                var deferred = $q.defer();
                if (!vm.validReportHeader()) {
                    deferred.reject("E");
                    return deferred.promise;
                }
                //设置toggle默认值
                if (PublicFunction.isNull(vm.header.leader_approved_flag)) {
                    vm.header.leader_approved_flag = 'N';//领导已审
                }
                if (PublicFunction.isNull(vm.header.special_approved_flag)) {
                    vm.header.special_approved_flag = 'N';//特批
                }
                if (PublicFunction.isNull(vm.header.add_approval_flag)) {
                    vm.header.add_approval_flag = 'N';//需添加审批人
                }
                //固定写死
                vm.header.invoice_flag = 'Y';
                vm.header.period_name = new Date(vm.header.exp_report_date).Format('yyyy-MM');
                vm.header.finance_rate = vm.header.exp_report_rate;//发票-收款汇率
                //根据是否存在headerId判断是新增还是修改
                if (PublicFunction.isNull(vm.headerId)) {
                    vm.header._status = 'insert';
                } else {
                    vm.header._status = 'update';
                }
                PublicFunction.showLoading();
                ReportHeaderService.saveReportHeader(vm.header).then(function (res) {
                    if (res.data.success) {
                        deferred.resolve("S");
                        vm.header.initFlag = false;
                        vm.reportHeaderParams = res.data.result.record;
                        vm.headerId = vm.reportHeaderParams.exp_report_header_id;
                        vm.header.exp_report_header_id = vm.headerId;
                        PageValueService.set("reportHeaderParams", vm.reportHeaderParams);
                        //console.log(angular.toJson(PageValueService.get("reportHeaderParams")));
                        vm.dataStr = vm.watchString();
                        console.log("保存成功,type:" + type);
                        if (!PublicFunction.isNull(type) && type == "M") { //显示保存成功提示
                            vm.getPayPlan();
                            PublicFunction.showToast($filter('translate')('message.save.success'));//保存成功
                        } else {
                            $ionicLoading.hide();
                        }
                    } else {
                        deferred.reject("E");
                        PublicFunction.showToast($filter('translate')('message.save.failed') + ":" + res.data.error.message);//保存失败
                        console.log("数据保存失败： " + res.data.error.message);
                    }
                }, function (error) {
                    deferred.reject("E");
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                    console.log("请求数据保存失败： " + angular.toJson(error));
                });
                return deferred.promise;
            };


            /**
             * 验证申请头信息(字段必输性验证)
             * @returns {boolean}
             */
            function validReportHeader() {
                if (PublicFunction.isNull(vm.header.unit_name)) {
                    PublicFunction.showToast($filter('translate')('report.header.error.required.unit_name'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.responsibility_center_name)) {
                    PublicFunction.showToast($filter('translate')('report.header.error.required.responsibility_center_name'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.exp_report_date)) {
                    PublicFunction.showToast($filter('translate')('report.header.error.required.exp_report_date'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.exp_report_currency_code)) {
                    PublicFunction.showToast($filter('translate')('report.header.error.required.exp_report_currency_code'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.exp_report_rate)) {
                    PublicFunction.showToast($filter('translate')('report.header.error.required.exp_report_rate'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.exp_report_payment_method)) {
                    PublicFunction.showToast($filter('translate')('report.header.error.required.exp_report_payment_method'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.exp_report_payee_category_name)) {
                    PublicFunction.showToast($filter('translate')('report.header.error.required.exp_report_payee_category_name'));
                    return false;
                }

                if (vm.header.document_page_type != 'STREAMLINED' && PublicFunction.isNull(vm.header.business_attribute)) {
                    PublicFunction.showToast($filter('translate')('report.header.error.required.business_attribute'));//请选择业务属性
                    return false;
                }
                if (vm.header.business_attribute_code == 'G' && (vm.header.exp_report_type_code !='1010'&& vm.header.exp_report_type_code !='1015') && PublicFunction.isNull(vm.header.contract_pay_term)) {
                    PublicFunction.showToast($filter('translate')('report.header.error.required.contract_pay_term'));
                    return false;
                }

                if((vm.header.exp_report_type_code =='1010'|| vm.header.exp_report_type_code =='1015') && vm.header.special_approved_flag=='Y' && PublicFunction.isNull(vm.header.contract_pay_term)){
                    PublicFunction.showToast($filter('translate')('report.header.error.required.special.approval.note'));
                    return false;
                }

                if (PublicFunction.isNull(vm.header.exp_report_description)) {
                    PublicFunction.showToast($filter('translate')('report.header.error.required.description'));
                    return false;
                }

                return true;
            };

            /**
             * 根据pageName跳转到对应的页面
             * @param pageName
             */
            function goPage(pageName) {
                vm.saveReportHeader().then(function (res) {
                    if (res == 'S') {
                        if (pageName === 'createExp') {//不关联申请新建费用
                            $state.go('app.createExp', {assReportFlag: true});
                        } else if (pageName === 'expList') { //不关联申请从账本导入费用
                            $state.go('app.expList', {isImport: true});
                        } else if (pageName === 'needReq') {//关联申请单列表页面
                            $state.go('app.needReq');
                        } else if (pageName === 'docHistory') { //获取单据历史
                            $state.go('app.docHistory', {type: 'report', headerId: vm.headerId});
                        } else if (pageName === 'OverPage') {
                            $state.go('app.overStandard', {
                                "repHeaderId": vm.header.exp_report_header_id,
                                "repTypeCode": vm.header.exp_report_type_code,
                                "status": "waitSubmit"
                            });
                        }
                    }
                });
            }

            /**
             * 查看报销单行详情
             * @param item 费用行对象
             */
            function goExpenseLine(item) {
                vm.saveReportHeader().then(function (data) {
                    if (data === "S") {
                        $state.go('app.createExp', {assReportFlag: true, reportLineId: item.exp_report_line_id});
                    }
                });
            }

            //一键生成付款计划行
            function createPayPlan() {
                //新建时：exp_report_header_id从报销单头保存接口获取
                //查询时：从报销单头行查询接口获取
                if (PublicFunction.isNull(vm.headerId)) {
                    vm.headerId = vm.reportHeaderParams.exp_report_header_id;
                }
                ReportHeaderService.createPayPlan(vm.headerId).then(function (res) {
                    if (res.data.success) {
                        //是否生成付款计划行标志
                        //vm.hasPlanFlag = true;
                        vm.saveReportHeader().then(function (data) {
                            if (data === "S") {
                                $state.go('app.paymentList', {"headerId": vm.headerId});
                            }
                        });
                    } else if (res.data.error.message) {
                        PublicFunction.showToast(res.data.error.message);
                    } else {
                        console.log('一键生成付款计划失败');
                        PublicFunction.showToast(res.data.error);
                    }
                }, function (error) {
                    console.log("一键生成付款计划请求出错了");
                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                });
            }

            //查看付款计划行
            function goPayPlan() {
                vm.saveReportHeader().then(function (data) {
                    if (data === "S") {
                        ReportHeaderService.searchPlanPayment(vm.headerId).then(function (res) {
                            if (res.data.success) {
                                if (res.data.result.totalCount > 0) {
                                    vm.hasPayPlanFlag = true;
                                    $state.go('app.paymentList', {"headerId": vm.headerId});
                                    $ionicLoading.hide();
                                } else {
                                    vm.hasPayPlanFlag = false;
                                    var message = $filter('translate')('report.header.makePlanContent');
                                    $scope.showMakePlanPopup(message);
                                }
                            } else {
                                PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                            }
                        }, function (error) {
                            PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                        });
                    }
                });
            }

            /**
             * 提交前的验证：住宿费不能超标
             */
            function preSubmit() {
                var deferred = $q.defer();
                if(vm.headerId){
                    ReportHeaderService.checkHotelExpense(vm.headerId).then(function (res) {
                        if (res.data.success) {
                            if (res.data.result&&res.data.result.flag=="N") {
                                deferred.resolve("S");
                            }else if(res.data.result&&res.data.result.flag=="Y"){
                                $ionicPopup.confirm({
                                    title: $filter('translate')('report.prompt'),
                                    template: '<p style="text-align: center">' + $filter('translate')('report.header.submit.hotelTip') + '</p>',
                                    cancelText: $filter('translate')('system_check.cancel'),
                                    cancelType: 'button-calm',
                                    okText: $filter('translate')('system_check.ok')
                                }).then(function (result) {
                                    if (result) {
                                        deferred.resolve("S");
                                    } else {
                                        deferred.reject("E");
                                    }
                                })
                            }
                        } else {
                            deferred.reject("E");
                        }
                    })
                }
                return deferred.promise;
            }

            //报销单提交
            function submitReport() {
                vm.saveReportHeader().then(function (data) {
                    if (data === "S") {
                        preSubmit().then(function (data) {
                            if(data === "S"){
                                ReportHeaderService.searchPlanPayment(vm.headerId).then(function (res) {
                                    if (res.data.success) {
                                        if (res.data.result.totalCount > 0) {
                                            vm.hasPayPlanFlag = true;

                                            ReportHeaderService.submitCheck(vm.headerId, vm.header.budget_control_enabled).then(function (res) {
                                                if (res.data.success) {
                                                    //如果error_type存在给出提示框,否则直接提交跳转页面
                                                    if (!PublicFunction.isNull(res.data.result.error_type)) {
                                                        $scope.showCheckSubPopup(res.data.result);
                                                    } else {
                                                        PublicFunction.showLoading();
                                                        PageValueService.set("comDocData", "");
                                                        PageValueService.set("reportHeaderParams", "");
                                                        PageValueService.set("messageFlag", "");
                                                        PageValueService.set("reqItem", "");
                                                        if (vm.messageFlag === 'Y') {
                                                            $state.go('app.erv_notification');
                                                        } else {
                                                            $state.go('app.tab_erv.reportList');
                                                        }
                                                        $ionicLoading.hide();
                                                    }
                                                } else {
                                                    PublicFunction.showToast($filter('translate')('message.submit.failed') + ": " + res.data.error.message);//提交失败
                                                    console.log("数据提交失败：" + res.data.error.message);
                                                }
                                            }, function (error) {
                                                PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                                                console.log("请求数据提交失败： " + angular.toJson(error));
                                            });
                                        } else {
                                            vm.hasPayPlanFlag = false;
                                            var message = $filter('translate')('report.header.submit.tip');
                                            $scope.showMakePlanPopup(message);
                                        }
                                    } else {
                                        PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                                    }
                                }, function (error) {
                                    PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                                });
                            }
                        })
                    }
                });
            }

            /**
             * 判断界面数据是否有更新
             * @returns {boolean}
             */
            $scope.isChanged = function () {
                var str = vm.watchString();
                if (str != vm.dataStr) {
                    return true;
                }
                return false;
            }

            /**
             * 返回需要监听的字符串
             * @returns {*}
             */
            function watchString() {
                var tmp = {
                    "exp_report_date": vm.header.exp_report_date,
                    "exp_report_payment_method": vm.header.exp_report_payment_method,
                    "exp_report_payee_category_name": vm.header.exp_report_payee_category_name,
                    "exp_report_payee_name": vm.header.exp_report_payee_name,
                    "business_attribute": vm.header.business_attribute,
                    "leader_approved_flag": vm.header.leader_approved_flag,
                    "special_approved_flag": vm.header.special_approved_flag,
                    "add_approval_flag": vm.header.add_approval_flag,
                    "exp_report_description": vm.header.exp_report_description,
                    "contract_number": vm.header.contract_number,
                    "contract_pay_term": vm.header.contract_pay_term
                };
                return angular.toJson(tmp);
            }

            /**
             * 信息提示框
             */
            $scope.showPopup = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: $filter('translate')('confirm.window.prompt'),//提示
                    template: $filter('translate')('confirm.window.Information.report'),//是否保存该费用报销单信息?
                    cancelText: $filter('translate')('confirm.window.cancel'),//取消
                    okText: $filter('translate')('confirm.window.ok'),//确认保存
                    cssClass: 'delete-ordinary-application-popup'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        vm.saveReportHeader().then(function (data) {
                            if (data === "S") {
                                if (vm.messageFlag === 'Y') {
                                    $state.go('app.erv_notification');
                                } else {
                                    $state.go('app.tab_erv.reportList');
                                }
                            }
                        });
                    } else {
                        if (vm.messageFlag === 'Y') {
                            $state.go('app.erv_notification');
                        } else {
                            $state.go('app.tab_erv.reportList');
                        }
                    }
                });
            };
            $scope.showCheckSubPopup = function (result) {
                var checkPopup = $ionicPopup.confirm({
                    title: $filter('translate')('report.prompt'),//提示
                    template: "<div style='font-size: 15px;color: #959595;'>" + result.error_desc + "</div>",
                    cancelText: $filter('translate')('report.cancel'),//取消
                    okText: $filter('translate')('report.confirm')//确定
                });
                checkPopup.then(function (res) {
                    if (res) {
                        ReportHeaderService.submitCheck(vm.headerId,null,result).then(function (res) {
                            if (res.data.success) {
                                //如果error_type存在给出提示框,否则直接提交跳转页面
                                if (!PublicFunction.isNull(res.data.result.error_type)) {
                                    $scope.showCheckSubPopup(res.data.result);
                                } else {
                                    PageValueService.set("comDocData", "");
                                    PageValueService.set("reportHeaderParams", "");
                                    PageValueService.set("messageFlag", "");
                                    PageValueService.set("reqItem", "");
                                    if (vm.messageFlag === 'Y') {
                                        $state.go('app.erv_notification');
                                    } else {
                                        $state.go('app.tab_erv.reportList');
                                    }
                                    $ionicLoading.hide();
                                }
                            } else {
                                PublicFunction.showToast($filter('translate')('message.submit.failed') + ": " + res.data.error.message);//提交失败
                                console.log("数据提交失败：" + res.data.error.message);
                            }
                            console.log(angular.toJson(res));
                        }, function (error) {
                            PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                        });
                    } else {

                    }
                });
            }

            $scope.showMakePlanPopup = function (message, result) {
                var confirmPopup = $ionicPopup.confirm({
                    title: $filter('translate')('report.prompt'),//提示
                    template: "<div style='font-size: 15px;color: #959595;'>" + message + "</div>",
                    cancelText: $filter('translate')('report.cancel'),//取消
                    okText: $filter('translate')('report.confirm')//确定
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        vm.createPayPlan();
                    } else {

                    }
                });
            }

            //删除报销单行-费用项目
            function deleteExpReportLine(item) {
                var paramter = [{
                    "exp_report_header_id": item.exp_report_header_id,
                    "exp_report_line_id": item.exp_report_line_id,
                    "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                    "_status": "delete"
                }];
                vm.saveReportHeader().then(function (data) {
                    if (data === "S") {
                        //调用差旅申请行删除接口
                        PublicFunction.showLoading(250);
                        ReportHeaderService.deleteExpReportLine(paramter).success(function (res) {
                            if (res.success) {
                                $ionicLoading.hide();
                                vm.header.sum_amount = vm.header.sum_amount - item.report_amount;
                                vm.lineList.splice(vm.lineList.indexOf(item), 1);
                                PublicFunction.showToast($filter('translate')('message.delete.success'));
                                if (vm.lineList.length <= 0) {
                                    vm.isReadOnly = false;
                                }
                            } else {
                                console.log("数据删除失败,错误信息：" + angular.toJson(res.error.message));
                                PublicFunction.showToast(res.error.message);
                            }
                        }).error(function (error) {
                            PublicFunction.showToast($filter('translate')('error.request'));  // 请求失败了
                            console.log("请求数据失败： " + angular.toJson(error));
                        });
                    }
                });
            }

            $scope.goBack = function () {
                PageValueService.set("comDocData", "");
                PageValueService.set("reportHeaderParams", "");
                PageValueService.set("messageFlag", "");
                if ($scope.isChanged()) {
                    $scope.showPopup();
                } else {
                    if (vm.messageFlag === 'Y') {
                        $state.go('app.erv_notification');
                    } else {
                        $state.go('app.tab_erv.reportList');
                    }
                }

            };

            //监听收款对象改变清空收款方的值
            $scope.$watch("vm.header.exp_report_payee_category_name", function (newValue, oldValue) {
                if (!PublicFunction.isNull(newValue) && !PublicFunction.isNull(oldValue)) {
                    if (newValue != oldValue) {
                        vm.header.exp_report_payee_name = "";
                        vm.header.exp_report_payee_id = "";
                    }
                }
            });

            //监听结算币种和期间
            $scope.$watch("vm.header.period_name + vm.header.exp_report_currency_code", function (newValue, oldValue) {
                if (!vm.isReadOnly) {
                    if (!PublicFunction.isNull(newValue)) {
                        if (newValue != oldValue) {
                            PublicFunction.queryExchangeRate(vm.header.company_id, vm.header.period_name, vm.header.exp_report_date, vm.header.exp_report_currency_code, vm.header.functional_currency_code).then(function (res) {
                                if (res.data.success) {
                                    vm.header.exp_report_rate = res.data.result.record[0].exchange_rate;
                                    if (PublicFunction.isNull(vm.header.exp_report_rate)) {
                                        PublicFunction.showToast($filter('translate')('report.header.error.required.exp_report_rate'));
                                    }
                                } else if (res.data.error.message) {
                                    console.log("汇率查询失败,错误信息：" + angular.toJson(res.error.message));
                                    PublicFunction.showToast(res.data.error.message);
                                } else {
                                    PublicFunction.showToast(res.data.error);
                                }
                            }, function (error) {
                                vm.header.exp_report_rate = "";
                                console.log("汇率查询报错,错误信息：" + angular.toJson(res.data.error.message));
                                PublicFunction.showToast($filter('translate')('report.header.error.required.exp_report_rate'));
                            });
                        }
                    } else {
                        vm.header.exp_report_rate = "";
                    }
                }
            });

            //计算报销单行的费用总金额
            function calTotalAmount() {
                var amount = 0;
                angular.forEach(vm.lineList, function (line) {
                    amount = amount + line.report_amount;
                });
                if (!vm.header.sum_amount) {
                    vm.header.sum_amount = 0;
                }
                vm.header.sum_amount = amount;
            }

            //选择时间
            $scope.datePicker = {
                selectDate: function () {
                    var dateOptions = {
                        date: vm.header.exp_report_date,
                        mode: 'date',
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('common.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('common.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        locale: $sessionStorage.lang //LANG
                    };

                    // 如果费用不是只读,或者是第三方费用,或者是报销单中编辑费用,可以编辑
                    if (!vm.isReadOnly) {
                        $cordovaDatePicker.show(dateOptions).then(function (date) {
                            if (date) {
                                vm.header.exp_report_date = new Date(date).Format('yyyy-MM-dd');
                                vm.header.period_name = $filter('date')(vm.header.exp_report_date, 'yyyy-MM');
                            }
                        });
                    }
                },
                selectHandDate: function () {
                    var date = null;
                    if (vm.header.exp_report_date) {
                        date = new Date(vm.header.exp_report_date).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if (ionic.Platform.isAndroid()) {
                                $scope.result = new Date(response).Format('yyyy-MM-dd');
                            } else {
                                $scope.result = new Date(response.result).Format('yyyy-MM-dd');
                            }
                            vm.header.exp_report_date = $scope.result;
                            vm.header.period_name = $filter('date')(vm.header.exp_report_date, 'yyyy-MM');
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
