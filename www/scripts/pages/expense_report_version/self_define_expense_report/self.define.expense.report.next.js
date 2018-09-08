/**
 * Created by Yuko on 16/10/16.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.self_define_expense_report_next', {
                url: '/self/define/expense/report/next?expenseReportOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/self_define_expense_report/self.define.expense.report.next.tpl.html',
                        controller: 'com.handchina.huilianyi.SelfDefineExpenseReportNextController'
                    }
                },
                data: {
                    roles: ['ROLE_USER'],
                    pageClass: 'self-define-expense-report'
                },
                resolve: {
                    content: function () {
                        return 'self_next';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense');
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        $translatePartialLoader.addPart('custom_application');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.huilianyi.SelfDefineExpenseReportNextController', ['$scope', '$state', 'FunctionProfileService', '$ionicModal', 'CurrencyCodeService', 'SelfDefineExpenseReport', 'Principal', '$cordovaDatePicker', 'PublicFunction',
        'content', '$q', '$stateParams', 'localStorageService', 'InvoiceService', 'MAX_ER_INVOICE_NUM', 'ExpenseService', 'ExpenseReportService', '$ionicLoading', '$timeout', '$filter', 'CostCenterService', 'TravelERVService', '$interval',
        'ApprovalPopupService', 'CorporationEntityService', 'CompanyConfigurationService', 'CustomValueService', 'CompanyService', '$ionicPopup', '$ionicScrollDelegate', 'ParseLinks', 'AgencyService', '$sessionStorage','$ionicPopover','$rootScope',
        function ($scope, $state, FunctionProfileService, $ionicModal, CurrencyCodeService, SelfDefineExpenseReport, Principal, $cordovaDatePicker, PublicFunction, content, $q, $stateParams, localStorageService, InvoiceService,
                  MAX_ER_INVOICE_NUM, ExpenseService, ExpenseReportService, $ionicLoading, $timeout, $filter, CostCenterService, TravelERVService, $interval, ApprovalPopupService, CorporationEntityService, CompanyConfigurationService,
                  CustomValueService, CompanyService, $ionicPopup, $ionicScrollDelegate, ParseLinks, AgencyService, $sessionStorage,$ionicPopover,$rootScope) {

            $scope.showScroll = function () {
                if (!$scope.view.hasBlueBar) {
                    $scope.view.hasBlueBar = true;
                    $timeout(function () {
                        $scope.view.hasBlueBar = false;
                        if ($('.expand-member-list').offset().top < 0) {
                            $('ion-header-bar.bar.bar-header').removeClass('blue-bar');
                        } else {
                            $('ion-header-bar.bar.bar-header').addClass('blue-bar');
                        }
                    }, 100)
                }
            };

            var function_profile_for_check_standard = false;
            FunctionProfileService.getFuntionProfileJustCheckStandard()
                .then(function (data) {
                    if (data == "true" || data == true) {
                        function_profile_for_check_standard = true;
                    }
                });


            /*
             *  检测差标与差标结果检测
             *  现在这个页面的入口有两种方式,可能以后还会增加,不关心这个页面的怎么进入,
             *  只是关心一旦进入这个页面,之后,页面的就会根据这个报销单的id去获取保存在这个报错单上的费用(请求后端)
             *  另一方面如果是从导入页面进入的,还会去导入的费用数据(本地获取)
             *  这个时候,这个保险单上的所有费用都有了,但是费用的具体数据还没,只有费用oid
             *  通过这个费用oid做的分页,那么差标结果检测就在分页的时候,去检测(只需要传费用oid),
             *  这个时候的oid一般是一个数组,有保存在报销单上费用,还有导入的费用,没有保存,对于没有保存的oid(导入的),是没有检测结果的,
             *  但是因为杂在一起了,所以检测结果根据费用oid去匹配,不会出错
             *  检测差标是在最后点击提交的时候,对页面的数据进行检测(需要传费用的详细数据),没有翻页的话,
             *  后面的数据没法检测
             * */
            $scope.view = {
                reportExpenseAbleSelectCurrency:true,// 需要传入报销单下面的费用,费用根据这个字段判断是否可以选择币种
                hasValidateTravelStandard: false,
                rightNavList: [],
                hasBlueBar: false,
                disabled: false,
                notFoundIcon: 'img/error-icon/not-found.png',
                notFoundText: $filter('translate')('expense.The.expense.account.has.been.deleted')/*'该报销单已删除'*/,
                code: null,
                isNotFound: false,
                isLoadFinish: false,
                invoiceNum: 0,
                content: content,
                hasLocalData: false,
                canDelete: true,
                expenseTypeList: [],//费用类型
                expenseReportList: [],//报销单关联的费用列表
                reportData: {},
                showTravelMember: false,
                amount: 0,
                personalPaymentAmount: 0,//个人支付金额
                expenseRefundAmount: 0,//待还款金额
                realPaymentAmount: 0,//报销单实发金额
                reimbursementAmount: 0,//还款金额
                localFinish: -1, //state: -1:还开始, 0: 开始, 1: 完成
                selectFinish: -1, //state: -1:还开始, 0: 开始, 1: 完成
                nothing: false,
                isHandEdit: false,
                unLoading: false,//费用两个来源:本地与单子关联的费用都加载过来
                language: $sessionStorage.lang,//获取当前语言环境
                rightNav: function (id) {  //右上角
                    $scope.popover.hide();
                    if(id == 'save'){
                        if(!$scope.view.disabled){
                            $scope.view.disabled = true;
                            $scope.view.saveCustomForm()
                        }
                    }
                },
                isBaseMessageKey: function (field) {
                    // if(field.messageKey === 'writeoff_flag' || field.messageKey === 'total_budget' || field.messageKey === 'title' || field.messageKey === 'start_date' || field.messageKey === 'remark' ||
                    //     field.messageKey === 'select_participant' || field.messageKey === 'end_date' || field.messageKey === 'currency_code' || field.messageKey === 'budget_detail' || field.messageKey === 'average_budget' ||
                    //     field.messageKey === 'select_cost_center' || field.messageKey === 'select_department' || field.messageKey === 'select_approver' || field.messageKey === 'select_corporation_entity' ||
                    //     field.messageKey === 'linkage_switch'){
                    //     return true;
                    // } else {
                    //     return false;
                    // }
                    if (field.messageKey === 'title' || field.messageKey === 'select_department') {
                        return true;
                    } else {
                        return false;
                    }
                },
                //fieldValue 不能直接拿来用的,需要转换
                isNotNativeFieldValue: function (field) {
                    if (field.messageKey === 'writeoff_flag' || field.messageKey === 'total_budget' || field.messageKey === 'select_cost_center' ||
                        field.messageKey === 'select_approver' || field.messageKey === 'select_corporation_entity' || field.messageKey === 'linkage_switch' || field.messageKey === 'cust_list'
                        || field.messageKey === 'select_user' || field.messageKey === 'contact_bank_account') {
                        return true
                    } else {
                        return false
                    }
                },
                showToast: function (text) {
                    $ionicLoading.show({
                        template: text,
                        duration: 1000
                    });
                },
                validateSubmit: function () {
                    var deferred = $q.defer();
                    if ($scope.view.expenseReportList && $scope.view.expenseReportList.length === 0) {
                        $scope.view.showToast($filter('translate')('expense.Please.add.cost'));//请添加费用
                        deferred.reject(false);
                    } else {
                        var i = 0;
                        $scope.view.reportData.expenseReportInvoices = [];
                        for (; i < $scope.selectedInvoiceOids.length; i++) {
                            var item = {};
                            item.expenseReportInvoiceOID = $stateParams.expenseReportOID;
                            item.invoiceOID = $scope.selectedInvoiceOids[i];
                            $scope.view.reportData.expenseReportInvoices.push(item);
                        }
                        if (i === $scope.selectedInvoiceOids.length) {
                            deferred.resolve(true);
                        }
                    }
                    return deferred.promise;
                },
                showPopup: function (message, content) {
                    var deferred = $q.defer();
                    var confirm = $ionicPopup.confirm({
                        title: message,
                        cssClass: 'refund-confirm-popup',
                        template: '<span>' + content + '</span>',
                        buttons: [
                            {
                                text: $filter('translate')('expense.return'),//返回
                                type: 'cancel-button',
                                onTap: function (e) {
                                    deferred.reject(false);
                                }
                            },
                            {
                                text: $filter('translate')('expense.submit'),//提交
                                type: 'sure-button',
                                onTap: function (e) {
                                    deferred.resolve(true);
                                }
                            }]
                    });
                    return deferred.promise;
                },
                changWriteoffFlag: function () {
                    if ($scope.view.reportData.custFormValues && $scope.view.reportData.custFormValues.length > 0) {
                        $scope.view.reportData.custFormValues.forEach(function (item) {
                            if (item.messageKey === 'writeoff_flag') {
                                item.value = false;
                            }
                        })
                    }
                },
                validateExpenseRefund: function () {
                    $ionicLoading.hide();
                    var deferred = $q.defer();
                    //$scope.view.personalPaymentAmount=0;
                    SelfDefineExpenseReport.getPersonalPaymentAmount($scope.view.reportData.applicantOID)
                        .success(function (data) {
                            if (data >= 0) {
                                $scope.view.expenseRefundAmount = data;
                                $scope.view.expenseReportList.forEach(function (item) {
                                    //个人支付
                                    if (item.paymentType === 1001) {
                                        // $scope.view.personalPaymentAmount = item.amount + $scope.view.personalPaymentAmount;
                                        // 考虑费用存在多币种的情况，所以个人金额
                                        $scope.view.personalPaymentAmount = item.baseAmount + $scope.view.personalPaymentAmount;
                                    }
                                });
                                /*if ($scope.view.personalPaymentAmount === 0) {
                                    $scope.view.showPopup($filter('translate')('expense.individualPayment0'), $filter('translate')('expense.notReimbursementCharges'))//个人支付费用0--无可还款费用，是否直接提交
                                        .then(function () {
                                            $scope.view.changWriteoffFlag();
                                            deferred.reject(false);
                                        }, function () {
                                            $scope.view.disabled = false;
                                        });
                                } else if ($scope.view.expenseRefundAmount === 0) {
                                    $scope.view.showPopup($filter('translate')('expense.notBorrowingForm'), $filter('translate')('expense.directSubmission'))//无可还借款单--是否直接提交
                                        .then(function () {
                                            $scope.view.changWriteoffFlag();
                                            deferred.reject(false);
                                        }, function () {
                                            $scope.view.disabled = false;
                                        });
                                } else if ($scope.view.personalPaymentAmount === 0 && $scope.view.expenseRefundAmount === 0) {
                                    $scope.view.showPopup($filter('translate')('expense.notReimbursementChargesAndBorrowingForm'), $filter('translate')('expense.mismatches'))//无可还款费用及借款单--是否直接提交
                                        .then(function () {
                                            $scope.view.changWriteoffFlag();
                                            deferred.reject(false);
                                        }, function () {
                                            $scope.view.disabled = false;
                                        });
                                } else if ($scope.view.personalPaymentAmount > 0 && $scope.view.expenseRefundAmount > 0) {
                                    deferred.resolve(true);
                                }*/
                                if ($scope.view.personalPaymentAmount > 0 && $scope.view.expenseRefundAmount > 0) {
                                    deferred.resolve(true);
                                }else{
                                    deferred.reject(false);
                                }
                                $scope.view.disabled = false;
                            }else{
                                $scope.view.disabled = false;
                                PublicFunction.showToast($filter('translate')('expense.error'));//出错了
                                deferred.reject(false);
                            }
                        }).error(function () {
                        $scope.view.disabled = false;
                    });
                    return deferred.promise;
                },
                validateSave: function () {
                    var deferred = $q.defer();
                    if ($scope.view.expenseReportList && $scope.view.expenseReportList.length > 0) {
                        var i = 0;
                        $scope.view.reportData.expenseReportInvoices = [];
                        for (; i < $scope.selectedInvoiceOids.length; i++) {
                            var item = {};
                            item.expenseReportInvoiceOID = $stateParams.expenseReportOID;
                            item.invoiceOID = $scope.selectedInvoiceOids[i];
                            $scope.view.reportData.expenseReportInvoices.push(item);
                        }
                        if (i === $scope.selectedInvoiceOids.length) {
                            deferred.resolve(true);
                        }
                    } else {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                },
                editBase: function () {
                    // 手动点击编辑按钮
                    $scope.view.isHandEdit = true;
                    $state.go('app.self_define_expense_report_edit', {expenseReportOID: $stateParams.expenseReportOID})
                },
                expandTravelMember: function () {
                    $scope.view.showTravelMember = !$scope.view.showTravelMember;
                },
                // 删除费用
                removeInvoice: function (expense, index) {

                    // 删除处理
                    var _remove = function() {
                        // 已选费用列表index
                        var indexSelected = $scope.selectedInvoiceOids.indexOf(expense.invoiceOID);
                        // 已选上但还没关联的费用(本地保存的费用)列表index
                        var indexLocal = $scope.localInvoiceData.indexOf(expense.invoiceOID);
                        // 如果是已选中的费用
                        if (indexSelected > -1) {
                            // 如果不是本地保存的费用(即报销单之前保存的费用),调用接口删除费用
                            if (indexLocal <= -1) {
                                if ($scope.view.reportData.expenseReportInvoices && $scope.view.reportData.expenseReportInvoices.length > 0) {
                                    for (var i = 0; i < $scope.view.reportData.expenseReportInvoices.length; i++) {
                                        if ($scope.view.reportData.expenseReportInvoices[i].invoiceOID === expense.invoiceOID) {
                                            ExpenseReportService.removeExpense($scope.view.reportData.expenseReportOID, expense.invoiceOID)
                                                .success(function () {
                                                    // 后端删除成功,前端才删除数据
                                                    // 前端展示列表中删除费用
                                                    $scope.view.expenseReportList.splice(index, 1);
                                                    // 判断费用列表是否为空
                                                    $scope.view.nothing = $scope.view.expenseReportList.length === 0;
                                                    // 已选费用列表中删除费用
                                                    $scope.selectedInvoiceOids.splice(indexSelected, 1);
                                                    // 费用总金额计算
                                                    $scope.view.amount = $scope.view.amount - expense.amount;
                                                    $scope.view.showToast($filter('translate')('expense.deleted'));//已删除
                                                    // 报销单中删除费用
                                                    $scope.view.reportData.expenseReportInvoices.splice(i, 1);
                                                })
                                                .error(function (error) {
                                                    if(error.message){
                                                        $scope.view.showToast(error.message);
                                                    } else {
                                                        $scope.view.showToast($filter('translate')('expense.error'));//出错了
                                                    }
                                                });
                                            break;
                                        }
                                    }
                                }
                            }
                            // 如果是本地保存的费用,直接删除费用
                            else {
                                // 前端展示列表中删除费用
                                $scope.view.expenseReportList.splice(index, 1);
                                // 判断费用列表是否为空
                                $scope.view.nothing = $scope.view.expenseReportList.length === 0;
                                // 已选费用列表中删除费用
                                $scope.selectedInvoiceOids.splice(indexSelected, 1);
                                // 费用总金额计算
                                $scope.view.amount = $scope.view.amount - expense.amount;
                                // 本地保存的费用列表中删除费用
                                $scope.localInvoiceData.splice(indexLocal, 1);
                                localStorageService.set('expenseObjects', $scope.localInvoiceData);
                                $scope.view.showToast($filter('translate')('expense.deleted'));//已删除
                            }
                        }
                    };
                    // 判断是否有分摊,然后提示
                    if(expense.apportionUsed) {
                        var alertPopup = $ionicPopup.confirm({
                            title: $filter('translate')('expenseApportion.message.popupTitle'),   // 提示
                            template: $filter('translate')('expenseApportion.message.deletePrompt'),
                            cancelText: $filter('translate')('expenseApportion.message.cancel'), // 取消
                            cancelType: "button-left",
                            okText: $filter('translate')('expenseApportion.message.delete'), // 删除
                            cssClass: "expense-amount-popup"
                        });
                        alertPopup.then(function(result) {
                            if(result) {
                                // 删除
                                _remove();
                            } else {
                                // 取消
                            }
                        });
                    } else {
                        // 删除
                        _remove()
                    }
                },
                addInvoice: function () {
                    if($scope.view.expenseTypeList.length === 0){
                        $scope.view.showToast($filter('translate')('expense.expense.type.loading.failed'));//无可选费用类型，请稍后再试
                    } else {
                        localStorageService.set('expenseObjects', $scope.localInvoiceData);
                        $scope.view.invoiceNum = MAX_ER_INVOICE_NUM - $scope.selectedInvoiceOids.length;
                        $state.go('app.expense_create', {
                            reportExpenseAbleSelectCurrency: $scope.view.reportExpenseAbleSelectCurrency,
                            message: $scope.view.content,
                            expenseReportOID: $stateParams.expenseReportOID,
                            currencyCode: $scope.view.reportData.currencyCode,
                            invoiceNum: $scope.view.invoiceNum,
                            expenseTypeList: $scope.view.expenseTypeList,
                            ownerOID: $scope.view.reportData.applicantOID  // 创建申请人的费用
                        });
                    }
                },
                importInvoice: function () {
                    if($scope.view.expenseTypeList.length === 0){
                        $scope.view.showToast($filter('translate')('expense.expense.type.loading.failed'));//无可选费用类型，请稍后再试
                    } else {
                        localStorageService.set('expenseObjects', $scope.localInvoiceData);
                        if ($scope.view.reportData.expenseReportInvoices && $scope.view.reportData.expenseReportInvoices.length > 0) {
                            $scope.view.invoiceNum = $scope.view.reportData.expenseReportInvoices.length;
                        } else {
                            $scope.view.invoiceNum = 0;
                        }
                        if($scope.view.expenseTypeList && $scope.view.expenseTypeList.length > 0){


                            //如果是本位币 ,把本位币也传过去originCurrencyCode
                            if($scope.view.originCurrencyCode===$scope.view.reportData.currencyCode){
                                $state.go('app.account_book', {
                                    message: $scope.view.content,
                                    expenseReportOID: $stateParams.expenseReportOID,
                                    currencyCode: $scope.view.reportData.currencyCode,
                                    originCurrencyCode:$scope.view.originCurrencyCode,
                                    invoiceNum: $scope.view.invoiceNum,
                                    expenseTypeList: $scope.view.expenseTypeList,
                                    expenseTypeOIDs: $scope.view.expenseTypeOIDs,
                                    ownerOID: $scope.view.reportData.applicantOID   // 获取申请人的费用
                                });
                            }else {
                                $state.go('app.account_book', {
                                    message: $scope.view.content,
                                    expenseReportOID: $stateParams.expenseReportOID,
                                    currencyCode: $scope.view.reportData.currencyCode,
                                    invoiceNum: $scope.view.invoiceNum,
                                    expenseTypeList: $scope.view.expenseTypeList,
                                    expenseTypeOIDs: $scope.view.expenseTypeOIDs,
                                    ownerOID: $scope.view.reportData.applicantOID   // 获取申请人的费用
                                });
                            }
                        }
                        else {
                            SelfDefineExpenseReport.getFormExpenseType($scope.view.reportData.formOID, $scope.view.reportData.applicationOID)
                                .success(function (data) {
                                    $scope.view.expenseTypeOIDs = data.expenseTypeOIDs;
                                    $scope.view.expenseTypeList = data.expenseTypes;
                                    if($scope.view.originCurrencyCode===$scope.view.reportData.currencyCode){
                                        $state.go('app.account_book', {
                                            message: $scope.view.content,
                                            expenseReportOID: $stateParams.expenseReportOID,
                                            currencyCode: $scope.view.reportData.currencyCode,
                                            originCurrencyCode:$scope.view.originCurrencyCode,
                                            invoiceNum: $scope.view.invoiceNum,
                                            expenseTypeList: $scope.view.expenseTypeList,
                                            expenseTypeOIDs: $scope.view.expenseTypeOIDs,
                                            ownerOID: $scope.view.reportData.applicantOID  // 获取申请人的费用
                                        });
                                    }else {
                                        $state.go('app.account_book', {
                                            message: $scope.view.content,
                                            expenseReportOID: $stateParams.expenseReportOID,
                                            currencyCode: $scope.view.reportData.currencyCode,
                                            invoiceNum: $scope.view.invoiceNum,
                                            expenseTypeList: $scope.view.expenseTypeList,
                                            expenseTypeOIDs: $scope.view.expenseTypeOIDs,
                                            ownerOID: $scope.view.reportData.applicantOID  // 获取申请人的费用
                                        });
                                    }



                                })
                        }
                    }
                },
                saveCustomForm: function () {
                    // 防止重复点击
                    $scope.view.disabled = true;
                    PublicFunction.showLoading();
                    if ($scope.view.unLoading) {
                        $scope.view.validateSave()
                            .then(function () {
                                ExpenseReportService.setTab('1001');
                                $scope.view.disabled = true;
                                // $scope.view.reportData.expenseReportInvoices = angular.copy($scope.selectedInvoiceOids)
                                SelfDefineExpenseReport.saveCustomForm($scope.view.reportData)
                                    .success(function (data) {
                                        $scope.view.disabled = false;
                                        $ionicLoading.hide();
                                        localStorageService.remove('expenseObjects');
                                        $scope.view.showToast($filter('translate')('expense.Save.success'));//保存成功
                                        $timeout(function () {
                                            $state.go('app.tab_erv.expense_report');
                                        }, 500);
                                    })
                                    .error(function (error) {
                                        $ionicLoading.hide();
                                        $scope.view.disabled = false;
                                        if (error.message) {
                                            $scope.view.showToast(error.message);
                                        } else {
                                            $scope.view.showToast($filter('translate')('expense.error'));//出错了
                                        }
                                    })
                            })
                    } else {
                        $scope.view.stopTime = $interval(function () {
                            $scope.view.timer('isSave')
                        }, 100);
                    }
                },
                timer: function (message) {
                    $scope.$watch('view.unLoading', function () {
                        if ($scope.view.unLoading) {
                            if (message === 'isSave') {
                                $scope.view.saveCustomForm();
                            } else if (message === 'isSubmit') {
                                $scope.view.submitCustomForm();
                            }
                            $interval.cancel($scope.view.stopTime);
                        }
                    });
                },
                budgetCancel:function () {
                    $scope.expenseBudgetPopover.hide();
                },
                budgetSubmit: function () {
                    if($scope.isSubmit){
                        if(!$scope.isError){
                            $scope.view.showToast($filter('translate')('expense_list_js.has_submitted'));//已提交
                            $timeout(function () {
                                $scope.expenseBudgetPopover.hide();
                                ApprovalPopupService.setCount();
                                $state.go('app.tab_erv.expense_report');
                            }, 500);
                        }
                    }
                    //预算验证返回错误为2002时 需再次调用验证预算的接口
                    if($scope.aginCheck){
                        $scope.view.submitExpense();
                        $scope.expenseBudgetPopover.hide();
                    }


                },
                checkStandard: function () {
                    if (function_profile_for_check_standard) {
                        //提交:有两种情况,一种是非借款单,直接就提交了;另一种是带借款单提交,提交之后,还有借款提交,
                        //那么后一次的借款提交,就不需要差标检测了:唐晶欣
                        //hasValidateTravelStandard
                        //$scope.view.showToast($filter('translate')('检查差旅标准中…'));//检查差旅标准中…
                        PublicFunction.showCheckStandardLoading();
                        if (!$scope.view.hasValidateTravelStandard) {
                            SelfDefineExpenseReport.checkStandard($scope.view.reportData)
                                .success(function (res) {
                                    $ionicLoading.hide();

                                    expenseReportListSetRejectOrWarn($scope.view.expenseReportList, res)
                                    //如果全部都ok,直接提交
                                    if (checkEvery(res, "OK")) {
                                        $scope.view.submitExpense();
                                    } else if (hasOne(res, "REJECT")) {

                                        $ionicPopup.confirm({
                                            title: "提示",
                                            cssClass: 'refund-confirm-popup',
                                            template: '<span>' + '你有' + getWarningNum(res) + '条费用预警<br>' + getRejectNum(res) + '条费用禁止提交' + '</span>',
                                            buttons: [
                                                {
                                                    text: '返回去修改',
                                                    type: 'cancel-button',
                                                    onTap: function (e) {
                                                        $scope.view.disabled = false;
                                                    }
                                                }]
                                        });
                                    } else {
                                        $ionicPopup.confirm({
                                            title: "提示",
                                            cssClass: 'refund-confirm-popup',
                                            template: '<span>' + '你有' + getWarningNum(res) + '条费用预警' + '</span>',
                                            buttons: [
                                                {
                                                    text: '直接提交',
                                                    type: 'sure-button',
                                                    onTap: function (e) {
                                                        $scope.view.submitExpense();
                                                    }
                                                },
                                                {
                                                    text: '返回去修改',
                                                    type: 'cancel-button',
                                                    onTap: function (e) {
                                                        $scope.view.disabled = false;
                                                    }
                                                }]
                                        });
                                    }
                                })
                        } else {
                            $scope.view.submitExpense();
                        }
                    } else {
                        $scope.view.submitExpense();
                    }

                },
                submitExpense: function ($event) {
                    //预算结果为2002时 无需有loading
                    if(!$scope.aginCheck){
                        PublicFunction.showProcessLoading();
                    } else {
                        // 显示loading
                        PublicFunction.showLoading();
                    }
                    SelfDefineExpenseReport.checkBudgetCustomForm($scope.view.reportData)
                        .success(function (res) {
                            // 提交报销单,预算校验通过后再提交
                            var _submitExpenseReport = function() {
                                SelfDefineExpenseReport.submitCustomForm($scope.view.reportData)
                                    .success(function (data) {
                                        $ionicLoading.hide();
                                        $scope.view.disabled = false;
                                        localStorageService.remove('expenseObjects');
                                        $scope.view.showToast($filter('translate')('expense_list_js.has_submitted'));//已提交
                                        if (data.writeoffFlag) {
                                            $scope.expenseRefundModal.hide();
                                        }
                                        $timeout(function () {
                                            ApprovalPopupService.setCount();
                                            $state.go('app.tab_erv.expense_report');
                                        }, 500);
                                    })
                                    .error(function (error) {
                                        $ionicLoading.hide();
                                        $scope.view.disabled = false;
                                        if (!error) {
                                            $scope.view.showToast($filter('translate')('expense.error'));//出错了
                                            return
                                        }
                                        var validationErrors = error.validationErrors;
                                        if (error && error.message === 'OUT_OF_BUDGET') {
                                            $scope.view.showToast($filter('translate')('expense.Excess.budget.Do.not.submit'));//预算超标，不可提交
                                            //$scope.view.showToast('预算超标，不可提交');
                                        } else if (validationErrors && validationErrors.length > 0 &&
                                            validationErrors[0].externalPropertyName === 'operation.error' &&
                                            validationErrors[0].message === 'Expense report valid fail!') {
                                            $scope.view.showToast($filter('translate')('expense.mismatches'));//费用类型与项目不匹配
                                        } else if (validationErrors && validationErrors.length > 0 &&
                                            validationErrors[0].externalPropertyName === 'operation.error' &&
                                            validationErrors[0].message === 'not find approver') {
                                            $scope.view.showToast($filter('translate')('expense.notFoundApprover'));//找不到审批人
                                        }else if(validationErrors && validationErrors.length > 0){
                                            $scope.view.showToast(validationErrors[0].message);
                                        } else if (error.message) {
                                            $scope.view.showToast(error.message);
                                        } else {
                                            $scope.view.showToast($filter('translate')('expense.error'));//出错了
                                        }
                                    });
                            };

                            //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                            if(res) {
                                //清除计时器
                                clearInterval($rootScope.waitInterval);
                                ExpenseReportService.setTab('1002');
                                $scope.view.disabled = true;
                                // $scope.view.reportData.expenseReportInvoices = angular.copy($scope.selectedInvoiceOids)

                                //预算结果为2002时 虽然校验通过 但还是会保存错误信息
                                if($scope.aginCheck) {
                                    if ($scope.budgetError && $scope.budgetError.length > 0) {
                                        var msg = {};
                                        $scope.budgetError.forEach(function (item) {
                                            msg.externalPropertyName = item.externalPropertyName;
                                            msg.message = item.message;
                                        });
                                        var msgStr = JSON.stringify(msg);
                                        SelfDefineExpenseReport.saveExpenseError($scope.view.reportData.expenseReportOID, msgStr)
                                            .success(function () {
                                                // 提交报销单,预算校验通过后再提交
                                                _submitExpenseReport();
                                            })
                                            .error(function () {
                                                // hide loading
                                                $ionicLoading.hide();
                                            })
                                    }
                                }else{
                                    SelfDefineExpenseReport.saveExpenseError($scope.view.reportData.expenseReportOID, null)
                                        .success(function () {
                                            // 提交报销单,预算校验通过后再提交
                                            _submitExpenseReport();
                                        })
                                        .error(function () {
                                            // hide loading
                                            $ionicLoading.hide();
                                        })
                                }
                            } else {
                                // hide loading
                                $ionicLoading.hide();
                            }
                        })
                        .error(function (error) {
                            // 显示loading
                            PublicFunction.showLoading();
                            //清除计时器
                            clearInterval($rootScope.waitInterval);
                            if (error.validationErrors && error.validationErrors.length > 0) {
                                $scope.budgetError = error.validationErrors;
                                $scope.isSubmit=false;
                                $scope.aginCheck=false;
                                $scope.errorColor = false;
                                $scope.lastShowTab = false;//先出现弹框  然后显示头部上的错误bug修改
                                $scope.budgetError.forEach(function (item) {
                                    if(item.externalPropertyName==='1002'){
                                        $scope.isSubmit=true;
                                    }
                                    //2002 页面弹窗点击'确定'按钮 会再一次调用校验接口
                                    if(item.externalPropertyName==='2002'){
                                        $scope.aginCheck=true;
                                    }
                                    item.errorMsg = [];
                                    if (item.message) {
                                        item.errorMsg = item.message.split(",").map(function (item, index) {
                                            return {id: index, msg: item};

                                        })
                                    }
                                    //error框背景颜色显示
                                    if(item.externalPropertyName =='1001' || item.externalPropertyName =='1003' || item.externalPropertyName =='1004' || item.externalPropertyName =='2001'){
                                        $scope.errorColor = true;
                                    }
                                });
                                if ($scope.budgetError && $scope.budgetError.length > 0) {
                                    var msg = {};
                                    $scope.budgetError.forEach(function (item) {
                                        msg.externalPropertyName = item.externalPropertyName;
                                        msg.message = item.message;
                                    });
                                    var msgStr = JSON.stringify(msg);
                                    SelfDefineExpenseReport.saveExpenseError($scope.view.reportData.expenseReportOID, msgStr)
                                        .success(function () {

                                        })
                                }
                                //预算错误信息为1002时 为弱管控 可直接提交
                                if($scope.isSubmit){
                                    ExpenseReportService.setTab('1002');
                                    $scope.view.disabled = true;
                                    SelfDefineExpenseReport.submitCustomForm($scope.view.reportData)
                                        .success(function () {
                                            $ionicLoading.hide();
                                            $scope.view.disabled = false;
                                            localStorageService.remove('expenseObjects');
                                            //弹出错验证预算误信息
                                            $scope.expenseBudgetPopover.show($event);
                                            $scope.lastShowTab = true;//让头部显示
                                            // $scope.view.showToast($filter('translate')('expense.Submitted.successfully'));//提交成功
                                            // $timeout(function () {
                                            //     ApprovalPopupService.setCount();
                                            //     $state.go('app.tab_erv.expense_report');
                                            // }, 500);
                                        })
                                        .error(function (error) {
                                            $scope.isError=true;
                                            var validationErrors = error.validationErrors;
                                            $ionicLoading.hide();
                                            $scope.expenseRefundModal.hide();
                                            $scope.expenseBudgetPopover.hide();
                                            $scope.view.disabled = false;
                                            if (error.message === 'OUT_OF_BUDGET') {
                                                $scope.view.showToast($filter('translate')('expense.Excess.budget.Do.not.submit'));//预算超标，不可提交
                                            } else if (validationErrors && validationErrors.length > 0 &&
                                                validationErrors[0].externalPropertyName === 'operation.error' &&
                                                validationErrors[0].message === 'Expense report valid fail!') {
                                                $scope.view.showToast($filter('translate')('expense.mismatches'));//费用类型与项目不匹配
                                            } else if(validationErrors && validationErrors.length > 0){
                                                if(error.bizErrorCode=='9001'){//bug修复  重复提交时候第二次提交 就跳转
                                                    $state.go('app.tab_erv.expense_report');
                                                }else{
                                                    $scope.view.showToast(validationErrors[0].message);
                                                }
                                            } else if (error.message) {
                                                $scope.view.showToast(error.message);
                                            } else {
                                                $scope.view.showToast($filter('translate')('expense.error'));//出错了
                                            }
                                        })
                                }else{
                                    //弹出错验证预算误信息
                                    $scope.lastShowTab = true;//先出现弹框  然后显示头部上的错误bug修改
                                    $scope.expenseBudgetPopover.show($event);
                                    $ionicLoading.hide();
                                }
                            }else if(error.message && (!error.validationErrors || error.validationErrors.length===0)){
                                PublicFunction.showToast(error.message);
                            }

                        })
                        .finally(function () {
                            $scope.view.disabled = false;
                        })

                },
                openBudgetModal:function () {
                    $scope.expenseCheckBudgetModal.show();
                },
                /*点击提交时判断，个人支付>0，且借款单待还款金额>0时，进入选择借款单页面，否则直接提交*/
                submitCustomForm: function ($event) {
                    // 防止重复点击
                    $scope.view.disabled = true;
                    PublicFunction.showLoading();
                    if ($scope.view.unLoading) {
                        $scope.view.validateSubmit()
                            .then(function () {
                                $scope.view.disabled = true;
                                /*if($scope.view.reportData.writeoffFlag && !$scope.view.functionProfileList['app.borrow.disabled']){*/
                                //如果是外币也不能走报销核销借款流程
                                if(!$scope.view.functionProfileList['app.borrow.disabled'] &&
                                    $scope.view.reportData.currencyCode === $scope.view.originCurrencyCode){
                                    $scope.view.personalPaymentAmount=0;
                                    $scope.view.validateExpenseRefund().then(function () {
                                        $ionicLoading.hide();
                                        $scope.expenseRefund.refundIndex = -1;
                                        $scope.expenseRefundModal.show();
                                        $scope.expenseRefund.expenseRefundList = [];
                                        $scope.expenseRefund.loadMore(0);
                                    }, function () {
                                        $ionicLoading.hide();
                                        $scope.view.checkStandard();
                                        $scope.view.disabled = false;
                                        //PublicFunction.showToast('出错了');
                                        //$scope.view.disabled = false;
                                    })
                                } else {
                                    $scope.view.checkStandard();
                                }
                            })
                    } else {
                        $scope.view.stopTime = $interval(function () {
                            $scope.view.timer('isSubmit')
                        }, 100);
                    }

                },
                //获取成本中心名字
                getCostCenterName: function (index) {
                    var indexCostCenter = index;
                    var json = JSON.parse($scope.view.reportData.custFormValues[indexCostCenter].dataSource);
                    if(json){
                        $scope.view.reportData.custFormValues[indexCostCenter].costCenterOID = json.costCenterOID;
                    }
                    if ($scope.view.reportData.custFormValues[indexCostCenter].value) {
                        CostCenterService.getCostCenterItemDetail($scope.view.reportData.custFormValues[indexCostCenter].value)
                            .success(function (data) {
                                $scope.view.reportData.custFormValues[indexCostCenter].costCenterName = data.name;
                            })
                            .error(function () {
                                $scope.view.reportData.custFormValues[indexCostCenter].costCenterName = null;
                            })
                    } else {
                        $scope.view.reportData.custFormValues[indexCostCenter].costCenterName = null;
                    }
                },
                //获取部门
                getDepartmentName: function (index) {
                    SelfDefineExpenseReport.getDepartmentInfo($scope.view.reportData.custFormValues[index].value)
                        .success(function (data) {
                            if ($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]) {
                                $scope.view.reportData.custFormValues[index].departmentName = data.name;
                            } else {
                                $scope.view.reportData.custFormValues[index].departmentName = data.path;
                            }
                        })
                },
                //获取已选择审批人的名字
                getSelectedApproval: function (index) {
                    var uerOID = [];
                    if ($scope.view.reportData.custFormValues[index].value !== null && $scope.view.reportData.custFormValues[index].value !== '') {
                        uerOID = $scope.view.reportData.custFormValues[index].value.split(":");
                        $scope.view.reportData.custFormValues[index].approvalSelectedName = '';
                        if (uerOID.length > 0) {
                            $scope.view.reportData.custFormValues[index].memberList = [uerOID.length];
                            TravelERVService.getBatchUsers(uerOID)
                                .success(function (data) {
                                    var num = 0;
                                    for (; num < data.length; num++) {
                                        for (var j = 0; j < uerOID.length; j++) {
                                            if (uerOID[j] === data[num].userOID) {
                                                $scope.view.reportData.custFormValues[index].memberList[j] = data[num];
                                            }
                                        }
                                    }
                                    if (num === data.length) {
                                        for (var i = 0; i < $scope.view.reportData.custFormValues[index].memberList.length; i++) {
                                            if (i !== ($scope.view.reportData.custFormValues[index].memberList.length - 1)) {
                                                $scope.view.reportData.custFormValues[index].approvalSelectedName += $scope.view.reportData.custFormValues[index].memberList[i].fullName + ','
                                            } else {
                                                $scope.view.reportData.custFormValues[index].approvalSelectedName += $scope.view.reportData.custFormValues[index].memberList[i].fullName;
                                            }
                                        }
                                    }
                                })
                        } else {
                            $scope.view.reportData.custFormValues[index].memberList = [];
                            $scope.view.reportData.custFormValues[index].approvalSelectedName = '';
                        }

                    } else {
                        $scope.view.reportData.custFormValues[index].approvalSelectedName = '';
                    }
                },
                //获取法人实体名字
                getCorporationEntityName: function (index) {
                    if ($scope.view.reportData.custFormValues[index].value && $scope.view.reportData.custFormValues[index].messageKey === 'select_corporation_entity') {
                        CorporationEntityService.getCorporationEntityDetail($scope.view.reportData.custFormValues[index].value)
                            .success(function (data) {
                                $scope.view.reportData.custFormValues[index].entityName = data.companyName;
                            })
                    }
                },
                //获取值列表名字
                getValueName: function (index) {
                    CustomValueService.getMessageKey($scope.view.reportData.custFormValues[index].customEnumerationOID, $scope.view.reportData.custFormValues[index].value)
                        .then(function (data) {
                            $scope.view.reportData.custFormValues[index].valueKey = data;
                        })
                },
                //银行卡
                getContactBankAccountName: function (index) {
                    if ($scope.view.reportData.custFormValues[index].value) {
                        CompanyService.getBankAccountDetail($scope.view.reportData.custFormValues[index].value)
                            .success(function (data) {
                                $scope.view.reportData.custFormValues[index].bankAccountNo = data.bankAccountNo;
                            })
                    }
                },
                //提交预算校验
                checkBudget: function (message, content) {
                    var deferred = $q.defer();
                    var confirm = $ionicPopup.confirm({
                        title: message,
                        cssClass: 'refund-confirm-popup',
                        template: '<span>' + content + '</span>',
                        buttons: [
                            {
                                text: $filter('translate')('expense.return'),//返回
                                type: 'cancel-button',
                                onTap: function (e) {
                                    deferred.reject(false);
                                }
                            },
                            {
                                text: $filter('translate')('expense.submit'),//提交
                                type: 'sure-button',
                                onTap: function (e) {
                                    deferred.resolve(true);
                                }
                            }]
                    });
                    return deferred.promise;
                }
            };
            $scope.expenseRefund = {
                page: {
                    current: 0,
                    size: 15,
                    lastPage: 0
                },
                choiceRefund: null,
                choiceStatus: false,
                refundIndex: -1,
                expenseRefundList: [],
                choiceAmount: 0,
                //获取借款单列表
                loadMore: function (page) {
                    $scope.expenseRefund.page.current = page;
                    var status = [1005, 1006];
                    if ($scope.expenseRefund.page.current === 0) {
                        $scope.expenseRefund.expenseRefundList = [];
                        $scope.expenseRefund.page.lastPage = 0;
                        $ionicScrollDelegate.scrollTop();
                    }
                    SelfDefineExpenseReport.getExpenseRefundList(status, page, $scope.expenseRefund.page.size, $scope.view.reportData.applicantOID)
                        .success(function (data, status, headers) {
                            if (data && data.length > 0) {
                                data.forEach(function (item) {
                                    if (item.writeoffArtificialDTO.stayWriteoffAmount > 0) {
                                        $scope.expenseRefund.expenseRefundList.push(item);
                                    }
                                });
                                $scope.expenseRefund.page.lastPage = ParseLinks.parse(headers('link')).last;
                            }
                        })
                },
                //选择借款单
                selectRefund: function (item, index) {
                    if($scope.expenseRefund.refundIndex > -1 && $scope.expenseRefund.refundIndex === index){ //当反选借款单
                        //清空choiceRefund
                        $scope.expenseRefund.choiceRefund = null;
                        //清空refundIndex
                        $scope.expenseRefund.refundIndex = -1;
                        //清空loanApplicationOID
                        $scope.view.reportData.loanApplicationOID = null;
                        //清空报销实发金额
                        $scope.view.reimbursementAmount = 0;
                    }else{
                        $scope.expenseRefund.choiceRefund = item;
                        $scope.expenseRefund.refundIndex = index;
                        //计算还款金额
                        if($scope.view.personalPaymentAmount < item.writeoffArtificialDTO.stayWriteoffAmount ){
                            $scope.expenseRefund.choiceAmount=$scope.view.personalPaymentAmount;
                        }else{
                            $scope.expenseRefund.choiceAmount=item.writeoffArtificialDTO.stayWriteoffAmount;
                        }
                        $scope.view.reimbursementAmount=$scope.expenseRefund.choiceAmount;
                        $scope.view.realPaymentAmount = $scope.view.personalPaymentAmount - $scope.expenseRefund.choiceAmount;
                        $scope.view.reportData.loanApplicationOID = $scope.expenseRefund.choiceRefund.applicationOID;
                    }
                },
                //提交报销单，进行还款
                commit: function ($event) {
                    $scope.expenseRefundModal.hide();

                    $scope.view.checkStandard();
                },
                //直接提交报销单，不进行还款
                redirectCommit: function () {
                    //点击提交按钮之后，影藏modal
                    $scope.expenseRefundModal.hide();
                    //将跟借款有关的东西都置空
                    //清空choiceRefund
                    $scope.expenseRefund.choiceRefund = null;
                    //清空refundIndex
                    $scope.expenseRefund.refundIndex = -1;
                    //清空loanApplicationOID
                    $scope.view.reportData.loanApplicationOID = null;
                    //清空报销实发金额
                    $scope.view.reimbursementAmount = 0;
                    //最好提交报销单
                    $scope.view.checkStandard();
                }
            };

            $ionicPopover.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/base.popover.tpl.html', {
                scope: $scope
            }).then(function(popover) {
                $scope.popover = popover;
            });
            $scope.openPopover = function($event) {
                if($scope.view.content === 'self_next' || $scope.view.content === 'edit'){
                    $scope.view.rightNavList = [
                        {
                            name: $filter('translate')('expense.save'),
                            id: 'save'
                        }
                    ]
                }
                $scope.popover.show($event);
            };

            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/self_define_expense_report/modal/didi.expense.refund.modal.html', {
                scope: $scope,
                animation: 'none'
            }).then(function (modal) {
                $scope.expenseRefundModal = modal;
            });
            $scope.$on('modal.hidden', function () {
                $scope.view.disabled = false;
            });
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/self_define_expense_report/modal/expense.check.budget.html',{
               scope:$scope,
                animation:'none'
            }).then(function (modal) {
                $scope.expenseCheckBudgetModal=modal;

            });
            $ionicPopover.fromTemplateUrl('scripts/pages/expense_report_version/self_define_expense_report/modal/expense.budget.popover.html',{
                scope: $scope,
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function (popover) {
                $scope.expenseBudgetPopover=popover;

            });


            //已选费用的OID 列表
            $scope.selectedInvoiceOids = [];
            //已选上但还没关联的费用oid 列表
            $scope.localInvoiceData = [];

            $scope.pagenation = {
                page: 0,
                size: 10,
                total: 0,
                maxPage: 0,
                loadMore: function (page) {
                    $scope.pagenation.page = page;
                    if (page === 0) {
                        $scope.view.expenseReportList = [];
                    }
                    $scope.view.nothing = false;
                    if (page <= $scope.pagenation.maxPage) {
                        var pieceOIDs = $scope.selectedInvoiceOids.slice(page * $scope.pagenation.size, (1 + page) * $scope.pagenation.size);
                        if (pieceOIDs.length > 0) {
                            ExpenseService.getExpenseByOIDs(pieceOIDs)
                                .then(function (response) {
                                    if (page === 0 && response.data.length === 0) {
                                        $scope.view.nothing = true;
                                    }
                                    Array.prototype.push.apply($scope.view.expenseReportList, response.data);
                                    $scope.view.nothing = $scope.view.expenseReportList.length === 0;
                                    $scope.view.expenseReportList.forEach(function (item) {
                                        item.week = new Date(item.createdDate).getDay();
                                        item.formatDate = $filter('date')(item.createdDate, 'yyyy-MM-dd');
                                    });
                                    $scope.view.expenseReportList = $filter('orderBy')($scope.view.expenseReportList, 'createdDate', true);
                                    if (function_profile_for_check_standard) {
                                        $scope.getFeeStandardResult($scope.view.expenseReportList);
                                    }
                                })
                                .finally(function () {
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                });
                        }
                    }
                }
            };


            //查看费用详情
            $scope.showDetail = function (expense) {
                localStorageService.set('expenseObjects', $scope.localInvoiceData);
                if ($scope.view.content == 'self_next') {
                    $state.go('app.tab_erv_expense_consume_init', {
                        reportExpenseAbleSelectCurrency: $scope.view.reportExpenseAbleSelectCurrency,
                        expense: expense.invoiceOID,
                        message: $scope.view.content,
                        expenseReportOID: $state.params.expenseReportOID,
                        expenseTypeList: $scope.view.expenseTypeList
                    });
                }
            };

            //这个函数是去获取整个页面需要的数据,特别注意的是,对于页面中所有的费用id都一起拿到了,
            //之后,通过这个费用id去查询费用的详细数据,上面做的翻页
            var init = function () {
                PublicFunction.showLoading();
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (data) {
                        //获取公司本位币
                        $scope.view.originCurrencyCode=data.currencyCode;
                        $scope.code = CurrencyCodeService.getCurrencySymbol(data.currencyCode);
                        SelfDefineExpenseReport.getCustomDetail($stateParams.expenseReportOID)
                            .success(function (data) {
                                $scope.view.reportData = data;
                                //如果报销单头部的币种,与本位币不一样,费用是不能选择币种的
                                if($scope.view.reportData.currencyCode != $scope.view.originCurrencyCode){
                                    $scope.view.reportExpenseAbleSelectCurrency = false;
                                }
                                $scope.lastShowTab = true;//显示头部
                                $scope.errorColor = false;//强弱管控的背景色显示
                                $scope.budgetError=[];
                                if(data.warnning){
                                    var warning=JSON.parse(data.warnning);
                                    $scope.budgetError.push({
                                        externalPropertyName:warning.externalPropertyName,
                                        message:warning.message
                                    });
                                    $scope.budgetError.forEach(function (item) {
                                        item.errorMsg=[];
                                        if(item.message){
                                            item.errorMsg = item.message.split(",").map(function(item, index) {
                                                return {id: index, msg: item}
                                            })
                                        }
                                        //error框背景颜色显示
                                        if(item.externalPropertyName =='1001' || item.externalPropertyName =='1003' || item.externalPropertyName =='1004' || item.externalPropertyName =='2001'){
                                            $scope.errorColor = true;
                                        }
                                    });
                                }

                                //console.log(data)
                                if ($scope.view.reportData.custFormValues && $scope.view.reportData.custFormValues.length > 0) {
                                    for (var i = 0; i < $scope.view.reportData.custFormValues.length; i++) {
                                        //值列表
                                        if ($scope.view.reportData.custFormValues[i].fieldType === 'CUSTOM_ENUMERATION' || $scope.view.reportData.custFormValues[i].messageKey === 'cust_list') {
                                            if ($scope.view.reportData.custFormValues[i].dataSource && JSON.parse($scope.view.reportData.custFormValues[i].dataSource)) {
                                                var json = JSON.parse($scope.view.reportData.custFormValues[i].dataSource);
                                                $scope.view.reportData.custFormValues[i].customEnumerationOID = json.customEnumerationOID;
                                            } else {
                                                $scope.view.reportData.custFormValues[i].customEnumerationOID = null;
                                            }
                                            if ($scope.view.reportData.custFormValues[i].value) {
                                                $scope.view.getValueName(i);
                                            }
                                        }
                                        if ($scope.view.reportData.custFormValues[i].messageKey === 'writeoff_flag') {
                                            var indexWrite = i;
                                            if ($scope.view.reportData.custFormValues[indexWrite].value === 'true') {
                                                $scope.view.reportData.custFormValues[indexWrite].value = true;
                                            } else {
                                                $scope.view.reportData.custFormValues[indexWrite].value = false;
                                            }
                                        }
                                        // 申请人
                                        var formValue = $scope.view.reportData.custFormValues[i];
                                        if (formValue.messageKey === 'applicant') {
                                            AgencyService.getUserDetail(formValue.value).then(function (response) {
                                                formValue.applicant = AgencyService.getApplicantItem(response.data);
                                            });
                                            formValue.applicantName = $scope.view.reportData.applicantName;
                                        }
                                        //成本中心项目名字获取
                                        if ($scope.view.reportData.custFormValues[i].messageKey === 'select_cost_center') {
                                            $scope.view.getCostCenterName(i);
                                        }
                                        //部门名称获取
                                        if ($scope.view.reportData.custFormValues[i].messageKey === 'select_department') {
                                            $scope.view.getDepartmentName(i);
                                        }
                                        if ($scope.view.reportData.custFormValues[i].messageKey === 'select_approver') {
                                            $scope.view.getSelectedApproval(i);
                                        }
                                        if ($scope.view.reportData.custFormValues[i].messageKey === 'select_user') {
                                            $scope.view.getSelectedApproval(i);
                                        }
                                        if ($scope.view.reportData.custFormValues[i].messageKey === 'currency_code') {
                                            var currencyIndex = i;
                                            $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.reportData.custFormValues[currencyIndex].value);
                                        }
                                        //法人实体
                                        if ($scope.view.reportData.custFormValues[i].messageKey === 'select_corporation_entity') {
                                            $scope.view.getCorporationEntityName(i);
                                        }
                                        //联动开关
                                        if ($scope.view.reportData.custFormValues[i].messageKey === 'linkage_switch') {
                                            if ($scope.view.reportData.custFormValues[i].value === 'true') {
                                                $scope.view.reportData.custFormValues[i].value = true;
                                            } else {
                                                $scope.view.reportData.custFormValues[i].value = false;
                                            }
                                            if ($scope.view.reportData.custFormValues[i].fieldContent && JSON.parse($scope.view.reportData.custFormValues[i].fieldContent)) {
                                                $scope.view.reportData.custFormValues[i].content = JSON.parse($scope.view.reportData.custFormValues[i].fieldContent);
                                            } else {
                                                $scope.view.reportData.custFormValues[i].content = [];
                                            }
                                        }
                                        if ($scope.view.reportData.custFormValues[i].messageKey === 'select_box') {
                                            //选择框
                                            $scope.view.reportData.custFormValues[i].selectValue = JSON.parse($scope.view.reportData.custFormValues[i].value);
                                        }
                                        if ($scope.view.reportData.custFormValues[i].messageKey === 'contact_bank_account') {
                                            //银行卡
                                            $scope.view.reportData.custFormValues[i].bankAccountNo = null;
                                            $scope.view.getContactBankAccountName(i);
                                        }
                                    }
                                }
                                // if($scope.view.reportData.currencyCode){
                                //     $scope.view.code = CurrencyCodeService.getCurrencySymbol($scope.view.reportData.currencyCode);
                                // }
                                SelfDefineExpenseReport.getFormExpenseType(data.formOID, data.applicationOID)
                                    .success(function (data) {
                                        $ionicLoading.hide();
                                        $scope.view.expenseTypeOIDs = data.expenseTypeOIDs;
                                        $scope.view.expenseTypeList = data.expenseTypes;
                                    })
                                    .error(function (data) {
                                        $ionicLoading.hide();
                                    })
                                //本来就保存的费用列表,从后端请求的
                                if (data.expenseReportInvoices && data.expenseReportInvoices.length > 0) {
                                    $scope.view.selectFinish = 0;
                                    $scope.view.invoiceNum = data.expenseReportInvoices.length;
                                    var i = 0
                                    for (; i < data.expenseReportInvoices.length; i++) {
                                        if ($scope.selectedInvoiceOids.indexOf(data.expenseReportInvoices[i].invoiceOID) == -1){
                                            //如果费用OID已经在list里面了，不要添加，否则会重复
                                            $scope.selectedInvoiceOids.push(data.expenseReportInvoices[i].invoiceOID);
                                        }
                                    }
                                    if (i === data.expenseReportInvoices.length) {
                                        $scope.view.selectFinish = 1;
                                    }
                                } else {
                                    $scope.view.selectFinish = 1;
                                    $scope.view.isLoadFinish = true;
                                }
                                //这个是从账本导入或者编辑的
                                if ($scope.view.hasLocalData) {
                                    var invoiceList = localStorageService.get('expenseObjects');

                                    $scope.localInvoiceData = [];
                                    $scope.view.localFinish = 0;
                                    if (invoiceList && invoiceList.length > 0) {
                                        var i = 0
                                        for (; i < invoiceList.length; i++) {
                                            if ($scope.selectedInvoiceOids.indexOf(invoiceList[i]) == -1){
                                                //如果费用OID已经在list里面了，不要添加，否则会重复
                                                $scope.selectedInvoiceOids.push(invoiceList[i]);
                                                $scope.localInvoiceData.push(invoiceList[i]);
                                                $scope.view.invoiceNum++;
                                            }
                                        }
                                        if (i === invoiceList.length) {
                                            $scope.view.localFinish = 1;
                                        }
                                    } else {
                                        $scope.view.localFinish = 1;
                                        $scope.view.isLoadFinish = true;
                                    }
                                } else {
                                    $scope.view.localFinish = 1;
                                    $scope.view.isLoadFinish = true;
                                }
                                if ($scope.view.localFinish === 1 && $scope.view.selectFinish === 1) {
                                    $scope.view.unLoading = true;
                                    if ($scope.selectedInvoiceOids.length > 0) {
                                        $scope.pagenation.maxPage = Math.ceil($scope.selectedInvoiceOids.length / $scope.pagenation.size) - 1;
                                    }
                                    $scope.pagenation.loadMore(0);
                                    $scope.getSum();
                                }
                                if (data.type === 1002) {
                                    $scope.view.travaelAllowanceList = [];
                                    //获取差补金额
                                    SelfDefineExpenseReport.getTravelAllowance(data.applicationOID, data.applicantOID)
                                        .success(function (data) {
                                            if (data && data.length > 0) {
                                                data.forEach(function (item) {
                                                    $scope.view.travaelAllowanceList.push(item.expenseTypeName + ' ' + $scope.code + item.amount)
                                                })
                                            }
                                            $scope.view.travelAllowance = $scope.view.travaelAllowanceList.join(" | ");

                                        })
                                }
                            })
                            .error(function (data) {
                                if (data.errorCode === 'OBJECT_NOT_FOUND') {
                                    $scope.view.isNotFound = true;
                                }
                                if (data.message) {
                                    $scope.view.showToast(data.message);
                                } else {
                                    $scope.view.showToast($filter('translate')('expense.error'));//出错了
                                }
                            })
                    })

            }
            init();


            //提交检测后:获取多少条提醒
            function getWarningNum(res) {
                var n = 0;
                res.foreach(function (item) {
                    if (item.actionType === "WARNING") {
                        n++;
                    }
                })
                return n;
            }

            //提交检测后:获取多少条拒绝
            function getRejectNum(res) {
                var n = 0;
                res.foreach(function (item) {
                    if (item.actionType === "REJECT") {
                        n++;
                    }
                })
                return n;
            }
            //每一个都满足,返回true
            function checkEvery(arr, reg) {
                return arr.every(function (item, index) {
                    return item.actionType === reg;
                })
            }

            //有一个满足就返回true
            function hasOne(arr, reg) {
                return arr.some(function (item, index) {
                    return item.actionType === reg;
                })
            }
            //OIDs要拼接一个url,类似get请求后面的参数
            function getFeeOIDs(feeOids) {
                var string = '';
                for (var i = 0; i < feeOids.length; i++) {
                    string += 'invoiceOIDs=';
                    string += feeOids[i].invoiceOID;
                    if (i < feeOids.length - 1) {
                        string += '&';
                    }
                }
                return string;
            }


            //获取预警的数目
            function getWarningNum(res) {
                var num = 0;
                var r_len = res.length;
                for (var i = 0; i < r_len; i++) {
                    if (res[i].actionType === "WARNING") {
                        num++;
                    }
                }
                return num;
            }

            //获取拒绝的数目
            function getRejectNum(res) {
                var num = 0;
                var r_len = res.length;
                for (var i = 0; i < r_len; i++) {
                    if (res[i].actionType === "REJECT") {
                        num++;
                    }
                }
                return num;
            }
            /*
             * param1:费用的本身的数组,$scope.view.expenseReportList
             * param2:检测结果,data
             * 根据这个检测结果,通过比对OIDs,给相应的费用添加拒绝或者提醒字段
             * 在显示费用的指令里面,通过这个字段,显示相应的样式
             * */

            function expenseReportListSetRejectOrWarn(originList, standardResult) {
                if (standardResult.length === 0) {
                    return false;
                }
                var r_len = standardResult.length;
                var o_len = originList.length;
                for (var i = 0; i < r_len; i++) {
                    for (var j = 0; j < o_len; j++) {
                        if (standardResult[i].invoiceOID === originList[j].invoiceOID) {
                            if (standardResult[i].actionType === "REJECT") {
                                $scope.view.expenseReportList[j].reject = true;
                                $scope.view.expenseReportList[j].rejectMesage = standardResult[i].message;

                            } else if (standardResult[i].actionType === "WARNING") {
                                $scope.view.expenseReportList[j].warning = true;
                                $scope.view.expenseReportList[j].warningMesage = standardResult[i].message;

                            } else if (standardResult[i].actionType === "OK") {
                                $scope.view.expenseReportList[j].warning = false;
                                $scope.view.expenseReportList[j].warning = false;
                            }
                        }
                    }
                }
            }
            /*
             * 把费用数组的oids传入进去,然后检测费用标准,根据结果构造数组
             * 这个数组与费用列表的数组必须一一对应
             * 如果某一条费用删除,这个某一条检测结果也必须删除
             * 上面有删除的操作,紧跟着费用列表的删除
             * */
            $scope.getFeeStandardResult = function (feeOids) {

                var data = getFeeOIDs(feeOids);
                ExpenseReportService.getCheckStandardResult(data)
                    .success(function (data) {
                        expenseReportListSetRejectOrWarn($scope.view.expenseReportList, data)
                    })
                    .error(function (data) {
                    })
            }
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                $('ion-header-bar.bar.bar-header').addClass('blue-bar');
                $scope.view.goBackStatus = true;
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function (response) {
                    $scope.view.functionProfileList = response;
                })
            });

            /*
             * 现在有了多币种,计算费用总和的计算,需要分为两种情况
             * 如果是多币种,费用总和直接相加
             * 如果是本位币,费用总和不是直接相加
             * */
            $scope.getSum = function (invoiceOIDs) {
                if ($scope.selectedInvoiceOids && $scope.selectedInvoiceOids.length > 0) {


                    if($scope.view.originCurrencyCode===$scope.view.reportData.currencyCode){

                        InvoiceService.getBaseAmountSumByPost($scope.selectedInvoiceOids)
                            .success(function (data) {
                                $scope.view.isLoadFinish = true;
                                $scope.view.amount = data;
                            });


                    }else {

                        InvoiceService.getSumByPost($scope.selectedInvoiceOids)
                            .success(function (data) {
                                $scope.view.isLoadFinish = true;
                                $scope.view.amount = data;
                            });
                    }



                } else {
                    $scope.view.amount = 0;
                }
            };
            //货币
            $scope.getCashName = function (currencyCode) {
                if (currencyCode !== null && currencyCode !== '') {
                    return CurrencyCodeService.getCashName(currencyCode)
                } else {
                    return null;
                }
            }
            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {


                // 判断是否从本地拿费用
                if (fromState.name === 'app.expense_create' || fromState.name === 'app.account_book' ||
                    fromState.name === 'app.tab_erv_expense_consume_init' || fromState.name === 'app.self_define_expense_report_edit') {
                    $scope.view.hasLocalData = true;

                }
                // 判断是否要清空本地的费用
                if ((fromState.name !== 'app.expense_create')&& fromState.name !== 'app.account_book' &&
                    fromState.name !== 'app.self_define_expense_report_next' && fromState.name !== 'app.tab_erv_expense_consume_init' &&
                    fromState.name !== 'app.self_define_expense_report_edit') {
                    localStorageService.remove('expenseObjects');
                }
                if (toState.name === 'app.self_define_expense_report_create') {
                    ExpenseReportService.setTab('1001');
                    $state.go('app.tab_erv.expense_report');
                }
                if (toState.name === 'app.app.self_define_expense_report_edit') {
                    // 如果不是手动点击编辑按钮(即安卓点击了物理返回键),跳到报销单列表
                    if (!$scope.view.isHandEdit) {
                        ExpenseReportService.setTab('1001');
                        $state.go('app.tab_erv.expense_report');
                    }
                }
            });
        }])
