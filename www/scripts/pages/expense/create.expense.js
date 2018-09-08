'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            // 账本创建费用,报销单创建费用,区别在于是否有expenseReportOID
            .state('app.expense_create', {
                url: '/expense/create/:expenseReportOID',
                cache: false,
                params: {
                    reportExpenseAbleSelectCurrency:true,//默认
                    expense: null,
                    message: null,
                    currencyCode: null,
                    //还能创建的费用条数
                    invoiceNum: null,
                    expenseTypeList: null,
                    ownerOID: null,  // 费用所属者的OID
                    hasHistory: null //是否可以选择历史数据
                },
                views: {
                    'page-content': {
                        templateUrl: 'scripts/pages/expense/create.expense.tpl.html',
                        controller: 'CreateExpenseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'create';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            // 账本编辑费用
            .state('app.expense_init', {
                url: '/expense/init/:expense/:message',
                cache: false,
                params: {
                    reportExpenseAbleSelectCurrency:true,//默认
                    hasHistory: null //是否可以选择历史数据
                },
                views: {
                    'page-content': {
                        templateUrl: 'scripts/pages/expense/create.expense.tpl.html',
                        controller: 'CreateExpenseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'init';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            // 报销单编辑费用,币种不能被修改

            .state('app.tab_erv_expense_consume_init', {
                url: '/expense/consume/init/:expenseReportOID/:expense',
                cache: false,
                params: {
                    reportExpenseAbleSelectCurrency:true,//默认
                    message: null,
                    expenseTypeList: null,
                    hasHistory: null //是否可以选择历史数据
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense/create.expense.tpl.html',
                        controller: 'CreateExpenseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'consumeInit';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense');
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            // 报销单查看费用详情
            .state('app.tab_erv_expense_consume_submit', {
                url: '/expense/consume/submit/:expenseReportOID/:expense',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense/create.expense.tpl.html',
                        controller: 'CreateExpenseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'submit';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense');
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.expense_submitted', {
                url: '/expense/submitted/:expense',
                cache: false,
                views: {
                    'page-content': {
                        templateUrl: 'scripts/pages/expense/create.expense.tpl.html',
                        controller: 'CreateExpenseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'submitted';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.expense_approvaled', {
                url: '/expense/approvaled/:expense',
                cache: false,
                views: {
                    'page-content': {
                        templateUrl: 'scripts/pages/expense/create.expense.tpl.html',
                        controller: 'CreateExpenseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'approvaled';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.expense_represented', {
                url: '/expense/represented/:expense',
                cache: false,
                views: {
                    'page-content': {
                        templateUrl: 'scripts/pages/expense/create.expense.tpl.html',
                        controller: 'CreateExpenseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'represented';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.expense_third_part', {
                url: '/expense/third/part/:expense/:message',
                cache: false,
                views: {
                    'page-content': {
                        templateUrl: 'scripts/pages/expense/create.expense.tpl.html',
                        controller: 'CreateExpenseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'third';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.expense_approval_form_message', {
                url: '/expense/approval/form/message/:expense',
                cache: false,
                views: {
                    'page-content': {
                        templateUrl: 'scripts/pages/expense/create.expense.tpl.html',
                        controller: 'CreateExpenseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'approvalMessage';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.expense_approval_list', {
                url: '/expense/approval/list/:expense',
                cache: false,
                views: {
                    'page-content': {
                        templateUrl: 'scripts/pages/expense/create.expense.tpl.html',
                        controller: 'CreateExpenseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'approvalList';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('CreateExpenseController', ['$scope', '$ionicModal', 'InvoiceService', '$ionicHistory', '$state',
        '$ionicPopup', 'ExpenseService', '$stateParams', 'content', '$ionicScrollDelegate', '$ionicLoading', '$q',
        'localStorageService', 'Auth', 'CompanyConfigurationService', 'LocationService', '$cordovaDatePicker', '$interval',
        'CurrencyCodeService', 'CustomValueService', 'Principal', 'CostCenterService', '$ionicActionSheet', 'PublicFunction',
        'LANG', 'FunctionProfileService','$filter','$sessionStorage', '$rootScope', 'SelfDefineExpenseReport', 'AgencyService', 'UserService',
        function ($scope, $ionicModal, InvoiceService, $ionicHistory, $state, $ionicPopup, ExpenseService, $stateParams,
                  content, $ionicScrollDelegate, $ionicLoading, $q, localStorageService, Auth, CompanyConfigurationService,
                  LocationService, $cordovaDatePicker, $interval, CurrencyCodeService, CustomValueService, Principal,
                  CostCenterService, $ionicActionSheet, PublicFunction, LANG, FunctionProfileService, $filter,
                  $sessionStorage, $rootScope, SelfDefineExpenseReport, AgencyService, UserService) {

            /*
            * 很多页面都可以进入这个创建费用
            * 但是有了多币种功能后,从报销单里面进来编辑,或者创建费用,
            * 费用的币种不能比选择
            * */

            $scope.view = {
                expenseType: null,  // 费用类型
                reportExpenseAbleSelectCurrency:$stateParams.reportExpenseAbleSelectCurrency,
                hasHistory: $stateParams.hasHistory, //是否可以显示历史数据
                functionProfileList: null, //function profile
                fromPage: 'none',
                updatePicLength: 0,
                withBPOReceipt: false,
                currencyCode:  $stateParams.currencyCode ? $stateParams.currencyCode : "CNY",
                code: CurrencyCodeService.getCurrencySymbol("CNY"),
                content: content,
                currencycodechangeable:content,
                pictureUrl: [],//记录更新的图片,
                attachments: [],//附件
                isReadOnly: false, //是否为只读
                deleteAttachment: [],
                nextState: null,
                uploadFinish: true,
                currentLocation: null,
                hasClicked: false,
                rejectReason: null,
                tempTypeList: [],//用作初始化费用类型列表 copy ExpenseTypeService
                typeList: [],//费用列表
                head: $filter('translate')('create_expense_js.Cost.details'),//费用详情
                hasValid: false,//是否有补贴
                taxRates: [],//税率列表
                invoiceNum: $stateParams.invoiceNum,
                expense: {
                    "ownerOID": $stateParams.ownerOID,     // 费用关联者的OID
                    "invoiceOID": null,
                    "date": new Date(),
                    "time": new Date(),
                    "expenseTypeOID": null,
                    "expenseTypeIconURL": 'img/expensetypes/no-image.png',
                    "expenseTypeName": $filter('translate')('create_expense_js.type'),//类型
                    "expenseTypeIconName": "no-image",
                    "costCenterItemOID": null,
                    "costCenterItemName": null,
                    "amount": 0,
                    "actualCurrencyAmount": 0,
                    "baseAmount": 0,
                    "actualCurrencyRate": "",
                    "companyCurrencyRate":"",
                    "currencyCode": $stateParams.currencyCode ? $stateParams.currencyCode : "",
                    "invoiceCurrencyCode": "",
                    "userOID": null,
                    "data": [],
                    "invoiceStatus": null,
                    "comment": null,
                    "createdDate": new Date(),
                    "attachments": [],
                    "withReceipt": true,
                    "readonly": false,
                    "businessCode": null,
                    "createLocation": null,
                    "createTime": null,
                    "approvalOperateDTOList": null,
                    "rejectType": null,
                    "rejectReason": null,
                    "approverId": null,
                    "approvalStepId": null,
                    "recognized": false,
                    "unitPrice": null,
                    "number": null,
                    "valid": false,
                    "unit": null,
                    "invoiceInstead": false, //是否替票
                    "invoiceInsteadReason": null,
                    "paymentType": 1001, //1001 个人支付， 1002 公司支付
                    "payByCompany": false, //是否公司支付
                    "apportionEnabled": false,  // 费用类型分摊是否开启
                    "expenseApportion": []  // 费用分摊
                },
                selectExpenseType: {},
                hasEdited: false,
                today: new Date(),
                canWatch: false,
                stopTime: null,
                expenseObjects: localStorageService.get('expenseObjects') ? localStorageService.get('expenseObjects') : [],//创建报销单时手动添加费用
                language: $sessionStorage.lang,
                isDirtyForm: function () {
                    if ($('.input-list').has('input').length > 0) {
                        if ($('.input-list input').hasClass('ng-dirty') || $('.input-list textarea').hasClass('ng-dirty') || (($scope.view.content === 'create') && ($scope.view.expense.expenseTypeName !== $filter('translate')('create_expense_js.type') || $scope.view.expense.attachments.length > 0))) {
                            $scope.view.showPopup();
                        } else {
                            $scope.view.goBack();
                        }
                    } else {
                        $scope.view.goBack();
                    }
                },
                //是否公司支付
                isPayByCompany: function () {
                    if(!$scope.view.expense.payByCompany){
                        // $scope.view.expense.vatInvoice = false;
                        // $scope.view.expense.taxRate = null;
                        // $scope.view.expense.invoiceInstead = false;
                        // $scope.view.expense.invoiceInsteadReason = null;
                        $scope.view.expense.paymentType = 1001;
                    } else {
                        $scope.view.expense.paymentType = 1002;
                    }
                },
                showPopup: function () {
                    var confirmPopup = $ionicPopup.confirm({
                        title: $filter('translate')('create_expense_js.prompt'),//提示
                        template: $filter('translate')('create_expense_js.Information.not.saved.exit'),//信息未保存,是否退出?
                        cancelText: $filter('translate')('create_expense_js.cancel'),//取消
                        okText: $filter('translate')('create_expense_js.ok'),//确定
                        cssClass: 'delete-ordinary-application-popup'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            $scope.view.goBack();
                        } else {
                            $scope.view.save();
                        }
                    });
                },
                goBack: function () {
                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('app.tab_erv.homepage');
                    }
                },
                //撤回
                withdraw: function () {
                    var invoiceOIDs = [];
                    invoiceOIDs.push($stateParams.expense);
                    ExpenseService.withdrawExpense(invoiceOIDs)
                        .success(function (data) {
                            PublicFunction.showToast($filter('translate')('create_expense_js.Withdraw.the.success'));//撤回成功
                            $scope.view.goBack();
                        })
                },
                //删除
                delete: function () {
                    ExpenseService.deleteOneExpense($stateParams.expense)
                        .success(function (data) {
                            PublicFunction.showToast($filter('translate')('create_expense_js.Delete.the.success'));//删除成功
                            $scope.view.goBack();
                        })
                },
                showOpinionPopup: function () {
                    var opinionPopup = $ionicPopup.show({
                        template: '<textarea type="text" style="padding:10px;" placeholder="' + $filter('translate')('create_expense_js.Please.enter.the.reason') + '" ng-model="view.rejectReason" rows="6" maxlength="100">',
                        title: '<h5>'+$filter('translate')('create_expense_js.rejected.reason')+'</h5>',//<h5>驳回理由</h5>
                        scope: $scope,
                        buttons: [
                            {text: $filter('translate')('create_expense_js.cancel')},//取消
                            {
                                text: $filter('translate')('create_expense_js.ok'),//确认
                                type: 'button-positive',
                                onTap: function (e) {
                                    if (!$scope.view.rejectReason) {
                                        $ionicLoading.show({
                                            template: $filter('translate')('create_expense_js.Please.enter.the.reject.reason'),//请输入驳回理由
                                            duration: '500'
                                        });
                                        e.preventDefault();
                                    } else {
                                        return $scope.view.rejectReason;
                                    }
                                }
                            }
                        ]
                    });
                    opinionPopup.then(function (res) {
                        if (res) {
                            $scope.view.reject();
                        } else {
                        }
                    });
                },

                //驳回
                reject: function () {
                    var invoiceOIDs = [];
                    invoiceOIDs.push($stateParams.expense);
                    ExpenseService.rejectExpense(invoiceOIDs, $scope.view.rejectReason)
                        .success(function (data) {
                            PublicFunction.showToast($filter('translate')('create_expense_js.Has.been.rejected'));//已驳回
                            $scope.view.goBack();
                        });
                },
                agree: function () {
                    var invoiceOIDs = [];
                    invoiceOIDs.push($stateParams.expense);
                    ExpenseService.agreeExpense(invoiceOIDs)
                        .success(function (data) {
                            PublicFunction.showToast($filter('translate')('create_expense_js.Have.been.through'));//已通过
                            $scope.view.goBack();
                        });
                },
                doTask: function () {
                    PublicFunction.showLoading();  // loading

                    //处理同行人相关的数据
                    angular.forEach($scope.view.expense.data, function (field) {
                        if (field.messageKey === 'participant') {
                            var roommate = {};
                            if (field.userOID) {
                                roommate.userOID = field.userOID;
                            }
                            roommate.enabled = $scope.view.expense.roommate;
                            field.value = angular.toJson(roommate);
                        }
                    });

                    $scope.view.hasClicked = true;
                    $scope.view.expense.createLocation = JSON.stringify(LocationService.getExpenseCreateLocation());
                    // 同步费用控件上的信息
                    $scope.view.expense = ExpenseService.syncExpenseData($scope.view.expense);

                    // 获取费用类型信息
                    if($scope.view.expense.expenseTypeOID){
                        ExpenseService.getExpenseType($scope.view.expense.expenseTypeOID).then(function(response){
                            $scope.view.expenseType = response;

                            $scope.view.validateData().then(function (data) {
                                var hasFinish = false;
                                $scope.view.expense.createdDate = new Date();
                                $scope.view.expense.date = new Date($scope.view.expense.date);
                                $scope.view.expense.time = new Date($scope.view.expense.time);
                                $scope.view.expense.createdDate.setFullYear($scope.view.expense.date.getFullYear());
                                $scope.view.expense.createdDate.setMonth($scope.view.expense.date.getMonth());
                                $scope.view.expense.createdDate.setDate($scope.view.expense.date.getDate());
                                $scope.view.expense.createdDate.setHours($scope.view.expense.time.getHours());
                                $scope.view.expense.createdDate.setMinutes($scope.view.expense.time.getMinutes());
                                $scope.view.expense.createdDate.setSeconds($scope.view.expense.time.getSeconds());
                                if ($scope.view.deleteAttachment.length === 0) {
                                    var i = 0;
                                    for (; i < $scope.view.attachments.length; i++) {
                                        if ($scope.view.attachments[i].attachmentOID === -1) {
                                            $scope.view.attachments.splice(i, 1);
                                        }
                                    }
                                    if (i === $scope.view.attachments.length) {
                                        hasFinish = true;
                                    }
                                } else {
                                    var deleteIndex = 0;
                                    var attachIndex = 0;
                                    for (; deleteIndex < $scope.view.deleteAttachment.length; deleteIndex++) {
                                        for (; attachIndex < $scope.view.attachments.length; attachIndex++) {
                                            if ($scope.view.attachments[attachIndex].attachmentOID === -1) {
                                                $scope.view.attachments.splice(attachIndex, 1);
                                                break;
                                            }
                                            if ($scope.view.deleteAttachment[deleteIndex] === $scope.view.attachments[attachIndex].attachmentOID) {
                                                $scope.view.attachments.splice(attachIndex, 1);
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (deleteIndex === $scope.view.deleteAttachment.length && attachIndex === $scope.view.attachments.length) {
                                    hasFinish = true;
                                }
                                if (hasFinish) {
                                    $scope.view.expense.attachments = $scope.view.attachments;
                                    $scope.view.expense.invoiceCurrencyCode = $scope.view.currencyCode;
                                    //上传的时候,rateChangeAbled加上,updateRate上传为true后端会以手输汇率计算金额,updateRate设置false,后端只是以公司汇率计算金额
                                    $scope.view.expense.updateRate = $scope.rateChangeAbled;
                                    InvoiceService.upsertInvoice($scope.view.expense)
                                        .success(function (data) {
                                            //返回之后还原,保存再创建一笔,需要这个字段
                                            $scope.view.expense.updateRate = $scope.rateChangeAbled;
                                            $ionicLoading.hide();

                                            //只添加费用OID
                                            if ($scope.view.expenseObjects.indexOf(data.invoiceOID) == -1){
                                                //如果费用OID已经在list里面了，不要添加，否则会重复
                                                $scope.view.expenseObjects.push(data.invoiceOID);
                                            }
                                            if ($scope.view.fromPage) {
                                                localStorageService.set('expenseObjects', $scope.view.expenseObjects);
                                            }
                                            if ($scope.view.nextState === 'back') {
                                                if ($state.params.message == 'create_second') {
                                                    $state.go('app.tab_erv_create_expense_second', {
                                                        expenseReportOID: $state.params.expenseReportOID
                                                    });
                                                } else if ($state.params.message == 'create_relative_second') {
                                                    $state.go('app.tab_erv_create_relative_expense_second', {
                                                        expenseReportOID: $state.params.expenseReportOID
                                                    });
                                                } else if ($state.params.message == 'normal') {
                                                    $state.go('app.tab_erv_expense_normal', {
                                                        expenseReportOID: $state.params.expenseReportOID
                                                    });
                                                } else if ($state.params.message == 'withdraw') {
                                                    $state.go('app.tab_erv_expense_withdraw', {
                                                        expenseReportOID: $state.params.expenseReportOID
                                                    });
                                                } else if ($state.params.message == 'approval_reject') {
                                                    $state.go('app.tab_erv_expense_approval_reject', {
                                                        expenseReportOID: $state.params.expenseReportOID
                                                    });
                                                } else if ($state.params.message == 'audit_reject') {
                                                    $state.go('app.tab_erv_expense_audit_reject', {
                                                        expenseReportOID: $state.params.expenseReportOID
                                                    });
                                                } else if ($state.params.message === 'self_next') {
                                                    $state.go('app.self_define_expense_report_next', {
                                                        expenseReportOID: $state.params.expenseReportOID
                                                    });
                                                } else {
                                                    $scope.view.goBack();
                                                }
                                            } else if ($scope.view.nextState === 'more') {
                                                //如果是从报销单过来的 并且费用总数超过最大限制的 直接返回
                                                if ($scope.view.invoiceNum != null && --$scope.view.invoiceNum === 0) {
                                                    //PublicFunction.showToast('报销单最多添加200条费用!');
                                                    PublicFunction.showToast($filter('translate')('create_expense_js.Reimburse.single.added.at.200'));//报销单最多添加200条费用!
                                                    if ($state.params.message == 'create_second') {
                                                        $state.go('app.tab_erv_create_expense_second', {
                                                            expenseReportOID: $state.params.expenseReportOID
                                                        });
                                                    } else if ($state.params.message == 'create_relative_second') {
                                                        $state.go('app.tab_erv_create_relative_expense_second', {
                                                            expenseReportOID: $state.params.expenseReportOID
                                                        });
                                                    } else if ($state.params.message == 'normal') {
                                                        $state.go('app.tab_erv_expense_normal', {
                                                            expenseReportOID: $state.params.expenseReportOID
                                                        });
                                                    } else if ($state.params.message == 'withdraw') {
                                                        $state.go('app.tab_erv_expense_withdraw', {
                                                            expenseReportOID: $state.params.expenseReportOID
                                                        });
                                                    } else if ($state.params.message == 'approval_reject') {
                                                        $state.go('app.tab_erv_expense_approval_reject', {
                                                            expenseReportOID: $state.params.expenseReportOID
                                                        });
                                                    } else if ($state.params.message == 'audit_reject') {
                                                        $state.go('app.tab_erv_expense_audit_reject', {
                                                            expenseReportOID: $state.params.expenseReportOID
                                                        });
                                                    } else if ($state.params.message === 'self_next') {
                                                        $state.go('app.self_define_expense_report_next', {
                                                            expenseReportOID: $state.params.expenseReportOID
                                                        });
                                                    } else {
                                                        $scope.view.goBack();
                                                    }
                                                } else {
                                                    $scope.view.currencyCode = $state.params.currencyCode ? $state.params.currencyCode : $scope.view.originCurrencyCode;

                                                    $scope.view.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                                                    $scope.view.expense = {
                                                        ownerOID: $stateParams.ownerOID,     // 费用关联者的OID
                                                        invoiceOID: null,
                                                        expenseTypeOID: null,
                                                        expenseTypeIconURL: 'img/expensetypes/no-image.png',
                                                        expenseTypeName: $filter('translate')('create_expense_js.type'),//类型,
                                                        expenseTypeIconName: 'no-image',
                                                        amount: 0,
                                                        baseAmount: 0,
                                                        companyCurrencyRate:"",
                                                        actualCurrencyAmount: 0,
                                                        actualCurrencyRate:"",
                                                        currencyCode: $scope.view.currencyCode,
                                                        invoiceCurrencyCode:$scope.view.currencyCode,
                                                        userOID: null,
                                                        data: [],
                                                        invoiceStatus: "INIT",
                                                        comment: null,
                                                        createdDate: new Date(),
                                                        date: new Date(),
                                                        time: new Date(),
                                                        attachments: [],
                                                        withReceipt: true,
                                                        readonly: false,
                                                        businessCode: null,
                                                        recognized: false,
                                                        invoiceInstead: false,
                                                        invoiceInsteadReason: null,
                                                        payByCompany: false,
                                                        paymentType: 1001,
                                                        updateRate:$scope.view.expense.updateRate
                                                    };
                                                    $scope.view.attachments = [];
                                                    $scope.view.deleteAttachment = [];
                                                    $ionicScrollDelegate.scrollTop();
                                                    $scope.view.hasClicked = false;
                                                    if ($stateParams.expenseTypeList) {
                                                        $scope.view.typeList = angular.copy($stateParams.expenseTypeList);
                                                    } else {
                                                        $scope.view.typeList = angular.copy($scope.view.tempTypeList);
                                                    }
                                                    $scope.expenseTypeList = $scope.view.typeList;
                                                    $scope.view.isReadOnly = false;

                                                    $scope.view.content = 'create';
                                                }
                                            }
                                        })
                                        .error(function() {
                                            //PublicFunction.showToast('费用创建失败!');
                                            PublicFunction.showToast($filter('translate')('create_expense_js.Cost.to.create.failure'));//费用创建失败!
                                        })
                                        .finally(function() {
                                            $scope.view.hasClicked = false;
                                            //$ionicLoading.hide();
                                        });
                                } else {
                                    $ionicLoading.hide();
                                }
                            }, function() {
                                $scope.view.hasClicked = false;
                                //$ionicLoading.hide();
                            });
                        });
                    }else{
                        $scope.view.hasClicked=false;
                        PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.cost.type'));
                    }
                },
                //保存
                save: function () {
                    $scope.view.nextState = 'back';
                    $scope.view.canWatch = true;
                    if ($scope.view.hasClicked) {

                    } else {
                        if ($scope.view.uploadFinish) {
                            $scope.view.canWatch = false;
                            $scope.view.doTask();
                        } else {
                            PublicFunction.showToast($filter('translate')('create_expense_js.Pictures.are.on.the.cross'));//图片正在上传中...
                            //$scope.view.stopTime = $interval(function () {
                            //    $scope.view.timer()
                            //}, 100);
                        }
                    }
                },

                //保存并再建一笔
                saveAndMore: function () {
                    $scope.view.canWatch = true;
                    $scope.view.nextState = 'more';
                    if ($scope.view.hasClicked) {

                    } else {
                        if ($scope.view.uploadFinish) {
                            $scope.view.canWatch = false;
                            $scope.view.doTask();
                        } else {
                            PublicFunction.showToast($filter('translate')('create_expense_js.Pictures.are.on.the.cross'));//图片正在上传中...
                        }
                    }
                },
                getMessageKey: function (index, customEnumerationOID, value) {
                    CustomValueService.getMessageKey(customEnumerationOID, value)
                        .then(function (data) {
                            $scope.view.expense.data[index].valueKey = data;
                        })
                },
                //根据值列表value获取值列表key(用于显示)
                getMessageKeyDetail: function(index, customEnumerationOID, value){
                    CustomValueService.getCustomValueDetail(customEnumerationOID)
                        .then(function (res) {
                            var enabled=res.data.enabled;
                            //enabled为false时，该值列表不可打开
                            if(enabled){
                                $scope.view.expense.data[index].enabledStatus=true;
                            }else{
                                $scope.view.expense.data[index].enabledStatus=false;
                                $scope.view.expense.data[index].required=false;
                            }
                            //当值列表修改状态下，由禁用变为启用时，value是为null
                            if(value){
                                CustomValueService.getCustomValueItemDetail(res.data.dataFrom,customEnumerationOID, value)
                                    .then(function (data) {
                                        //enabled为true时，处理messagekey
                                        if(enabled){
                                            $scope.view.expense.data[index].valueKey = data.data.messageKey;
                                        }
                                    });
                            }else{
                                //根据值列表oid查询值列表，获取默认值
                                CustomValueService.getCustomValueListByPagination(res.data.dataFrom,customEnumerationOID, 0, 1000, '', $scope.view.expense.ownerOID)
                                    .then(function (data) {
                                        if(data.data && data.data.length>0){
                                            data.data.forEach(function(item){
                                                //enabled为true且有默认值时值列表才显示默认值
                                                if(item.patientia && enabled){
                                                    $scope.view.expense.data[index].value=item.value;
                                                    $scope.view.expense.data[index].valueKey=item.messageKey;
                                                    return
                                                }
                                            })
                                        }
                                        //没有值列表项的时候显示未启用
                                        else{
                                            $scope.view.expense.data[index].enabledStatus=false;
                                            $scope.view.expense.data[index].required=false;
                                        }

                                    });
                            }
                        })
                },
                getCostCenterName: function (i) {
                    if ($scope.view.expense.data[i].value) {
                        CostCenterService.getCostCenterItemDetail($scope.view.expense.data[i].value)
                            .success(function (data) {
                                $scope.view.expense.data[i].costCenterName = data.name;
                            })
                            .error(function () {
                                $scope.view.expense.data[i].costCenterName = null;
                            })
                    } else {
                        $scope.view.expense.data[i].costCenterName = null;
                    }
                },
                validateForm: function () {
                    var i = 0;
                    for (; i < $scope.view.expense.data.length; i++) {
                        if($scope.view.expense.data[i].messageKey === 'mileage'){
                             $scope.view.expense.data[i].value = $scope.view.expense.mileage;
                        }
                        if ($scope.view.expense.data[i].required && PublicFunction.isNull($scope.view.expense.data[i].value)) {
                            PublicFunction.showToast($filter('translate')('create_expense.Please.enter.the') + $scope.view.expense.data[i].name);//请输入
                            return false;
                        }
                        if($scope.view.expense.data[i].fieldType == "LONG" && !PublicFunction.isNull($scope.view.expense.data[i].value) && Math.floor($scope.view.expense.data[i].value) != $scope.view.expense.data[i].value){
                            PublicFunction.showToast($filter('translate')('create_expense.Please.enter.legal') + $scope.view.expense.data[i].name);//请输入
                            return false;
                        }
                    }
                    if (i === $scope.view.expense.data.length) {
                        return true;
                    }
                },
                validateData: function () {
                    var deferred = $q.defer();
                    if (!$scope.view.expense.amount || $scope.view.expense.amount == 0) {
                        PublicFunction.showToast($filter('translate')('create_expense_js.Please.enter.the.amount'));//请输入金额
                        deferred.reject(false);
                    } else if ($scope.view.expense.amount < 0) {
                        PublicFunction.showToast($filter('translate')('create_expense_js.The.input.amount.is.not.correct'));//输入金额不正确
                        deferred.reject(false);
                    } else if (!$scope.view.expense.date) {
                        PublicFunction.showToast($filter('translate')('create_expense_js.The.date.is.not.correct'));//日期不正确
                        deferred.reject(false);
                    } else if ($scope.view.attachments.length === 0 && ($scope.view.withBPOReceipt || $scope.view.expenseType.isAttachmentRequired)) {
                        PublicFunction.showToast($filter('translate')('create_expense_js.Please.upload.the.invoice.photo'));//请上传发票照片, 以便后续发票审核
                        deferred.reject(false);
                    } else if ($scope.view.expense.expenseTypeName === $filter('translate')('create_expense_js.type')) {
                        PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.cost.type'));//请选择费用类型
                        deferred.reject(false);
                    } else if (!$scope.view.validateForm()) {
                        deferred.reject(false);
                    }
                    // 默认分摊金额不能为负
                    else if ($scope.view.expense.expenseApportion && $scope.view.expense.expenseApportion.length>0 &&
                        Number($scope.view.expense.expenseApportion[0].amount)<0) {

                        // 分摊金额不能有负 请重新编辑
                        PublicFunction.showToast($filter('translate')('expenseApportion.message.noLessZero'));
                        deferred.reject(false);
                    }
                    // 增专金额校验,是否需要校验,如果需要校验增专价税合计必须不小于费用的金额
                    else if (!$scope.view.functionProfileList['expense.vat.validate.disabled'] && $scope.view.expense.vatInvoice &&
                        Number($scope.view.expense.priceTaxAmount)<Number($scope.view.expense.amount)) {

                        // 费用金额不可超过价税合计
                        PublicFunction.showToast($filter('translate')('vatSpecial.vatAmountValidate'));
                        deferred.reject(false);
                    }
                    else {
                        /**
                         * 验证增专发票代码和发票号码,只有选择币种为人民币(CNY时验证)
                         */
                        if ($scope.view.expense.vatInvoice && $scope.view.expense.vatInvoiceCurrencyCode === 'CNY') {
                            // 发票代码只能10或12位数字
                            if($scope.view.expense.invoiceCode && (isNaN(Number($scope.view.expense.invoiceCode)) ||
                                ($scope.view.expense.invoiceCode.length!==10 && $scope.view.expense.invoiceCode.length!==12))){

                                // 人民币发票代码应为10位或12位数字
                                PublicFunction.showToast($filter('translate')('vatSpecial.codeError'));
                                deferred.reject(false);
                            }
                            // 发票号码只能8位数字
                            else if($scope.view.expense.invoiceNumber &&
                                (isNaN(Number($scope.view.expense.invoiceNumber)) ||
                                $scope.view.expense.invoiceNumber.length != 8)) {

                                // 人民币发票号码应为8位数字
                                PublicFunction.showToast($filter('translate')('vatSpecial.numberError'));
                                deferred.reject(false);
                            } else {
                                deferred.resolve(true);
                            }
                        } else {
                            deferred.resolve(true);
                        }
                    }
                    return deferred.promise;
                },
                choseTaxRate: function () {

                },

                // 费用分摊相关内容
                expenseApportion: {
                    expenseReportData: null,    // 报销单数据
                    applicantOID: null,     // 报销单申请人OID
                    applicantName: null,     // 报销单申请人姓名
                    costCenterMessageKey: 'select_cost_center', // 成本中心messageKey

                    /**
                     * 计算剩余的分摊金额
                     * @param index 需要排除计算的分摊index
                     * @returns {number} 剩余的分摊金额
                     */
                    calculateLeftAmount: function(index) {
                        var totalAmount = $scope.view.expense.amount,
                            apportions = $scope.view.expense.expenseApportion,
                            amount = totalAmount,
                            i;

                        for(i=1; i<apportions.length; i++) {
                            // 如果有index,去除index对应的分摊的金额
                            if(index!==i) {
                                amount = amount - apportions[i].amount;
                            }
                        }

                        return amount;
                    },

                    // 计算默认分摊的分摊金额
                    calculateDefaultAmount: function() {
                        var apportions = $scope.view.expense.expenseApportion,
                            amount = this.calculateLeftAmount(0);
                        // 计算出来的amount可能是null
                        amount = amount ? amount : 0;
                        apportions[0].amount = amount;
                    },

                    // 获取报销单数据后的初始化
                    _createInitDataHandle: function() {
                        // 默认分摊
                        var dataSource,
                            i = 0,
                            self = this,
                            defaultApportion = {
                                "amount": $scope.view.expense.amount,
                                "costCenterItems": [],
                                "relevantPerson": self.applicantOID,
                                "personName": self.applicantName,
                                "personAvatar": "",
                                "defaultApportion": true
                            };
                        $scope.view.expense.expenseApportion = [];
                        $scope.view.expense.expenseApportion.push(defaultApportion);
                        defaultApportion = $scope.view.expense.expenseApportion[0];

                        // 获取表单所有成本中心
                        angular.forEach(self.expenseReportData.custFormValues, function(custFormValue) {
                            if(custFormValue.messageKey===self.costCenterMessageKey) {
                                // 默认分摊的成本中心OID和成本中心项OID
                                var costCenterOID = JSON.parse(custFormValue.dataSource).costCenterOID,
                                    costCenterItem = {
                                        fieldName: custFormValue.fieldName,
                                        costCenterOID: costCenterOID,
                                        costCenterItemName: "",
                                        costCenterItemOID: custFormValue.value,
                                        required: custFormValue.required
                                    };

                                // 把成本中心加入到分摊中
                                defaultApportion.costCenterItems.push(costCenterItem);
                                costCenterItem = defaultApportion.costCenterItems[defaultApportion.costCenterItems.length-1];

                                if(costCenterItem.costCenterItemOID) {
                                    // 获取成本中心项名称
                                    CostCenterService.getCostCenterItemDetail(custFormValue.value)
                                        .then(function(response) {
                                            costCenterItem.costCenterItemName = response.data.name;
                                        }, function(){})
                                }
                            }
                        });

                        // 获取用户头像
                        // 暂时用这个
                        AgencyService.getUserDetail(defaultApportion.relevantPerson).then(function(response){
                            defaultApportion.personAvatar = response.data.avatar;
                        });
                    },

                    // 费用创建分摊初始化
                    createInit: function() {
                        var self = this;

                        // 如果已经获取过报销单详情,直接初始化,否则先获取报销单数据
                        if(self.expenseReportData) {
                            self._createInitDataHandle();
                        } else {
                            // 获取报销单详情
                            SelfDefineExpenseReport.getCustomDetail($stateParams.expenseReportOID).then(function(response) {
                                // 保存报销单数据
                                self.applicantOID = response.data.applicantOID;
                                self.applicantName = response.data.applicantName;
                                self.expenseReportData = response.data;

                                // 获取报销单数据之后的初始化
                                self._createInitDataHandle();
                            }, function(){});
                        }
                    },

                    // 编辑费用时的初始化分摊, 获取新建分摊时需要的报销单数据
                    editInit: function() {
                        var self = this;

                        SelfDefineExpenseReport.getCustomDetail($stateParams.expenseReportOID).then(function(response) {
                            var defaultApportion = $scope.view.expense.expenseApportion[0];

                            self.applicantOID = response.data.applicantOID;
                            self.applicantName = response.data.applicantName;
                            self.expenseReportData = response.data;

                            // 默认分摊的成本中心项和报销单的保持一致,不考虑报销单配置改变的情况,不考虑表单多个成本中心一样的情况
                            angular.forEach(response.data.custFormValues, function(custFormValue) {
                                if(custFormValue.messageKey===self.costCenterMessageKey) {
                                    // 表单成本中心OID和成本中心项OID
                                    var costCenterOID = JSON.parse(custFormValue.dataSource).costCenterOID,
                                        costCenterItemOID = custFormValue.value;

                                    angular.forEach(defaultApportion.costCenterItems, function(costCenterItem) {
                                        // 只有分摊中的成本中心为表单的成本中心并且成本中心项和表单的不一样时,才修改
                                        if(costCenterItem.costCenterOID===costCenterOID &&
                                            costCenterItem.costCenterItemOID!==costCenterItemOID) {

                                            // 获取成本中心项名称
                                            CostCenterService.getCostCenterItemDetail(custFormValue.value)
                                                .then(function(response) {
                                                    costCenterItem.costCenterItemName = response.data.name;
                                                }, function(){})
                                        }
                                    });
                                }
                            });
                        }, function() {})
                    },

                    // 清空分摊数据
                    clear: function() {
                        $scope.view.expense.expenseApportion = [];
                    }
                }
            };
            //计算汇率差异,保留一位小数的百分数;四舍五入
            function getRateDiff(actualCurrencyRate, companyCurrencyRate) {
                var a = (actualCurrencyRate - companyCurrencyRate) * 100 / companyCurrencyRate;
                var b = Math.round(a * 10);
                var c = b / 10;
                if(c<0){
                    c=(-c);
                }
                return c + "%";
            }
            //上传图片配置
            $scope.uploadPicConfig = {
                success: function (data) {
                    $scope.view.updatePicLength++;
                    var attachment = JSON.parse(data.response);
                    var attach = {
                        attachmentOID: null
                    };
                    attach.attachmentOID = attachment.attachmentOID;
                    $scope.view.expense.attachments.push(attach);
                    if ($scope.view.updatePicLength === $scope.view.pictureUrl.length) {
                        $scope.view.expense.invoiceCurrencyCode = $scope.view.currencyCode;
                        if ($scope.view.expense.costCenterItemOID) {
                            CostCenterService.logLastCostCenterItem($scope.view.expense.costCenterItemOID);
                        }
                        InvoiceService.upsertInvoice($scope.view.expense)
                            .success(function (data) {
                                if ($scope.view.nextState === 'back') {
                                    $scope.view.goBack();
                                } else if ($scope.view.nextState === 'more') {
                                    $scope.view.currencyCode = $state.params.currencyCode ? $state.params.currencyCode : $scope.view.originCurrencyCode;
                                    $scope.view.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                                    $scope.view.expense = {
                                        "ownerOID": $stateParams.ownerOID,     // 费用关联者的OID
                                        "invoiceOID": null,
                                        "expenseTypeOID": null,
                                        "expenseTypeName": $filter('translate')('create_expense_js.type'),//类型
                                        "expenseTypeIconName": 'no-image',
                                        "expenseTypeIconURL": 'img/expensetypes/no-image.png',
                                        "amount": 0,
                                        "currencyCode": $scope.view.currencyCode,
                                        "invoiceCurrencyCode":$scope.view.currencyCode,
                                        "userOID": null,
                                        "data": [],
                                        "invoiceStatus": "INIT",
                                        "comment": null,
                                        "createdDate": new Date(),
                                        "date": new Date(),
                                        "time": new Date(),
                                        "withReceipt": true,
                                        "readonly": false,
                                        "businessCode": null,
                                        "recognized": false,
                                        "invoiceInstead": false,
                                        "invoiceInsteadReason": null,
                                        "payByCompany": false,
                                        "paymentType": 1001,
                                        "updateRate":$scope.view.expense.updateRate

                                    };
                                    $scope.view.deleteAttachment = [];

                                    $ionicScrollDelegate.scrollTop();
                                }
                            });
                    }
                },
                error: function (error, msg) {
                    $ionicLoading.show({
                        template: $filter('translate')('create_expense_js.Network.failure.please.try.again.later'),//网络故障，请稍后再试。
                        duration: '1000'
                    });
                },
                headers: {}
            };
            //选择时间
            $scope.datePicker = {
                selectDate: function (string) {
                    var dateOptions = {
                        date: $scope.view.expense.date,
                        mode: 'date',
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('create_expense_js.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('create_expense_js.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        locale: $sessionStorage.lang
                    };

                    // 如果费用不是只读,或者是第三方费用,或者是报销单中编辑费用,可以编辑
                    if (!$scope.view.isReadOnly || (($scope.view.content === 'third' || $scope.view.content === 'consumeInit')
                            && string === 'expenseDate')) {
                        $cordovaDatePicker.show(dateOptions).then(function (date) {
                            if (date) {
                                if (string === 'expenseDate') {
                                    $scope.view.expense.date = date;
                                } else if (string === 'expenseTime') {
                                    $scope.view.expense.time = date;
                                } else {
                                    for (var i = 0; i < $scope.view.expense.data.length; i++) {
                                        if ($scope.view.expense.data[i].name === string) {
                                            $scope.view.expense.data[i].value = date;
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                    }
                },
                selectHandDate: function (string) {
                    var date = null;
                    if(string === 'expenseDate' && $scope.view.expense.date){
                       date = new Date($scope.view.expense.date).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if(ionic.Platform.isAndroid()){
                                $scope.result = new Date(response);
                            } else {
                                $scope.result = new Date(response.result);
                            }
                            if (string === 'expenseDate') {
                                $scope.view.expense.date = $scope.result;
                                $scope.$apply();
                            }

                        } catch (e) {
                        }
                    };
                    var error = function (response) {
                    };
                    if (!$scope.view.isReadOnly || (($scope.view.content === 'third' || $scope.view.content === 'consumeInit')
                        && string === 'expenseDate')) {
                        if (ionic.Platform.isWebView()) {
                            var startTime = '-';
                            var endTime = '-';
                            var banPick = {};
                            if(date){
                                banPick = { "startTime": startTime, "endTime": endTime, "dates":[], "selectedDate": date };
                            } else {
                                banPick = { "startTime": startTime, "endTime": endTime, "dates":[]};
                            }
                            if($sessionStorage.lang != 'zh_cn'){
                                banPick.language = "en";
                            }
                            HmsCalendar.openCalendar(success, error, 2, banPick);
                        }
                    }
                },
                selectTime: function () {
                    var timeOptions = {
                        date: $scope.view.expense.time,
                        mode: 'time',
                        is24Hour: true,
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('create_expense_js.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel:  $filter('translate')('create_expense_js.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        androidTheme: 'THEME_HOLO_LIGHT',
                        locale: $sessionStorage.lang
                    };

                    // 如果费用不是只读,或者是第三方费用,或者是报销单中编辑费用,可以编辑
                    if (!$scope.view.isReadOnly || $scope.view.content === 'third' || $scope.view.content === 'consumeInit') {
                        $cordovaDatePicker.show(timeOptions).then(function (date) {
                            if (date) {
                                $scope.view.expense.time = date;
                            }
                        });
                    }
                },
                selectDateTime: function (string) {
                    var dateTimeOptions = {
                        date: $scope.view.expense.date,
                        mode: 'datetime',
                        is24Hour: true,
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel:  $filter('translate')('create_expense_js.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('create_expense_js.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        androidTheme: 'THEME_HOLO_LIGHT',
                        locale: LANG
                    };
                    if (!$scope.view.isReadOnly) {
                        $cordovaDatePicker.show(dateTimeOptions).then(function (date) {
                            if (date) {
                                for (var i = 0; i < $scope.view.expense.data.length; i++) {
                                    if ($scope.view.expense.data[i].name === string) {
                                        $scope.view.expense.data[i].value = date;
                                        break;
                                    }
                                }
                            }
                        });
                    }
                }
            };

            //初始化同行人的数据
            $scope.initRoommate = function () {
                angular.forEach($scope.view.expense.data, function (field) {
                    if (field.messageKey === 'participant' && field.value) {
                        var roommate = angular.fromJson(field.value);
                        $scope.view.expense.roommate = roommate.enabled;
                        if (roommate.userOID) {
                            UserService.getOneUser(roommate.userOID)
                                .success(function (data, status, headers) {
                                    field.userName = data.fullName;
                                    field.status = data.status;
                                    field.userOID = data.userOID;
                                });
                        }
                    }
                });
            };

            var init = function () {
                var i;
                if ($state.params.message == 'account_book' || $state.params.message == 'app.erv_notification') {
                    $scope.view.fromPage = null;
                }
                if ($state.params.currencyCode) {
                    $scope.view.currencyCode = $state.params.currencyCode;
                    $scope.view.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                }
                //if($state.params.expense){
                //    $scope.view.currencyCode=$state.params.expense.currencyCode;
                //    $scope.view.code=CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                //}
                if ($stateParams.expenseTypeList && $stateParams.expenseTypeList.length > 0) {
                    $scope.view.typeList = [];
                    for (i = 0; i < $stateParams.expenseTypeList.length; i++) {
                        // 过滤掉第三方费用(readonly为true)
                        if (!$stateParams.expenseTypeList[i].readonly) {
                            // 判断是否有补贴
                            if ($stateParams.expenseTypeList[i].valid) {
                                $scope.view.hasValid = true;
                            }
                            $scope.view.typeList.push($stateParams.expenseTypeList[i]);
                        }
                    }
                } else {
                    Principal.identity().then(function (data) {
                        ExpenseService.getExpenseTypes(data.companyOID)
                            .then(function (data) {
                                var i = 0;
                                for (; i < data.length; i++) {
                                    // 过滤掉第三方费用(readonly为true)
                                    if (!data[i].readonly) {
                                        // 判断是否有补贴
                                        if (data[i].valid) {
                                            $scope.view.hasValid = true;
                                        }
                                        $scope.view.tempTypeList.push(data[i]);
                                    }
                                }
                                if (i == data.length) {
                                    $scope.view.typeList = angular.copy($scope.view.tempTypeList);
                                }
                            });
                    });
                }
                //获取费用列表
                CompanyConfigurationService.getCompanyConfiguration().then(function (data) {
                    $scope.view.withBPOReceipt = data.configuration.bpo.enableInvoiceVerification;
                    //获取公司本位币
                    $scope.view.originCurrencyCode = data.currencyCode;
                    if(!$state.params.expenseReportOID && $scope.view.content === 'create'){
                        $scope.view.currencyCode = data.currencyCode;
                        $scope.view.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                    }
                });
                $scope.rateChangeAbled = true;
                FunctionProfileService.getFunctionProfileList()
                    .then(function (data) {
                        $scope.view.functionProfileList = data;

                        $scope.webInvoiceKeepConsistentWithExpense=false;
                        //配置成true，本位币也是保持一致
                        if($state.params.expenseReportOID && content === 'create' && data['web.invoice.keep.consistent.with.expense']=== true){
                            $scope.webInvoiceKeepConsistentWithExpense=true;
                        }

                        //默认是可以修改汇率,false
                        //但是上传的时候,要传true,后端才拿手动汇率计算
                        if (data['web.expense.rate.edit.disabled'] == "true" || data['web.expense.rate.edit.disabled'] == true) {
                            $scope.rateChangeAbled = false;

                        } else {
                            $scope.rateChangeAbled = true;

                        }
                        //如果报销单的币种与本位币不一样,就不能修改币种
                        if ($scope.view.originCurrencyCode!= $scope.view.currencyCode) {
                            $scope.view.currencycodechangeable=false;
                        }
                        if ($scope.view.content === 'create') {
                            $scope.view.isReadOnly = false;
                            //是否可以需改汇率,这个字段需要从functionProfile里面获取
                            $scope.view.expense.updateRate = $scope.rateChangeAbled;
                        } else {
                            ExpenseService.getInvoice($stateParams.expense)
                                .success(function (data) {
                                    var cityControl = null; // 城市控件

                                    $scope.view.expense = data;
                                    $scope.view.expense.data.sort(function(a,b){
                                        return a.sequence > b.sequence ? 1 : (a.sequence < b.sequence ? -1 : 0);
                                    });
                                    //初始化同行人里的数据
                                    $scope.initRoommate();
                                    //是否可以需改汇率,这个字段需要从functionProfile里面获取
                                    $scope.view.expense.updateRate = $scope.rateChangeAbled;

                                    // 获取费用类型数据
                                    ExpenseService.getExpenseType(data.expenseTypeOID)
                                        .then(function (data) {
                                            $scope.view.expenseType = data;
                                        });

                                    //console.log($scope.view.expense)
                                    //如果汇率可以修改,可能会有汇率差异
                                    if ($scope.view.expense.updateRate) {
                                        $scope.selfCurrencyRateCurrencyRate= getRateDiff($scope.view.expense.actualCurrencyRate,$scope.view.expense.companyCurrencyRate);
                                    }
                                    $scope.view.currencyCode = $scope.view.expense.invoiceCurrencyCode;
                                    $scope.view.code = CurrencyCodeService.getCurrencySymbol($scope.view.expense.invoiceCurrencyCode);
                                    $scope.view.expense.date = new Date($scope.view.expense.createdDate);
                                    $scope.view.expense.time = new Date($scope.view.expense.createdDate);

                                    // 是否只读.如果费用的readonly字段为true(比如滴滴),或者不是创建以及编辑,费用为只读,否则为可编辑
                                    $scope.view.isReadOnly = data.readonly || ($scope.view.content !== 'init' &&
                                        $scope.view.content !== 'consumeInit');

                                    //是否公司支付
                                    if ($scope.view.expense.paymentType && $scope.view.expense.paymentType == '1002' || $scope.view.expense.paymentType == 1002) {
                                        $scope.view.expense.payByCompany = true;
                                    } else if ($scope.view.expense.paymentType && $scope.view.expense.paymentType == '1001' || $scope.view.expense.paymentType == 1001) {
                                        $scope.view.expense.payByCompany = false;
                                    }
                                    $scope.view.attachments = $scope.view.expense.attachments;
                                    if ($scope.view.expense.valid) {
                                        for (var i = 0; i < $scope.view.typeList.length; i++) {
                                            if ($scope.view.expense.expenseTypeOID === $scope.view.typeList[i].expenseTypeOID) {
                                                $scope.view.expense.unit = $scope.view.typeList[i].unit;
                                            }
                                        }
                                    }

                                    for (var i = 0; i < $scope.view.expense.data.length; i++) {
                                        if ($scope.view.expense.data[i].messageKey === 'mileage') {
                                            $scope.view.expense.mileage = parseFloat($scope.view.expense.data[i].value);
                                        } else if ($scope.view.expense.data[i].messageKey === 'reference.mileage') {
                                            $scope.view.expense.referenceMileage = parseFloat($scope.view.expense.data[i].value);
                                        } else if ($scope.view.expense.data[i].messageKey === 'unit.price') {
                                            $scope.view.expense.unitPrice = parseFloat($scope.view.expense.data[i].value);
                                        }
                                        if ($scope.view.expense.data[i].fieldType === 'LONG' || $scope.view.expense.data[i].fieldType === 'DOUBLE') {
                                            $scope.view.expense.data[i].value = parseFloat($scope.view.expense.data[i].value);
                                        }
                                        if ($scope.view.expense.data[i].customEnumerationOID !== '' && $scope.view.expense.data[i].customEnumerationOID !== null) {
                                            //新莱 messageKey 为xinlai.task.list , 则获取成本中心名字
                                            if ($scope.view.expense.data[i].messageKey && $scope.view.expense.data[i].messageKey === 'xinlai.task.list' && $scope.view.expense.data[i].value !== null && $scope.view.expense.data[i].value !== '') {
                                                $scope.view.getCostCenterName(i);
                                            } else {
                                                //$scope.view.getMessageKey(i, $scope.view.expense.data[i].customEnumerationOID, $scope.view.expense.data[i].value);
                                                $scope.view.getMessageKeyDetail(i, $scope.view.expense.data[i].customEnumerationOID, $scope.view.expense.data[i].value);
                                            }
                                        }
                                        // 城市控件获取城市名称
                                        if($scope.view.expense.data[i].fieldType==="LOCATION" && $scope.view.expense.data[i].value) {
                                            cityControl = $scope.view.expense.data[i];
                                            LocationService.getCityByCode(cityControl.value).then(function(response) {
                                                cityControl.cityName = response.data.city;
                                            }, function() {});
                                        }
                                    }

                                    // 报销单编辑费用分摊初始化.
                                    if ($scope.view.content === 'consumeInit') {
                                        // 如果有分摊,获取已有分摊,否则根据费用类型是否开启分摊创建初始化分摊
                                        if ($scope.view.expense.expenseApportion && $scope.view.expense.expenseApportion.length > 0) {
                                            $scope.view.expenseApportion.editInit();
                                        } else {
                                            ExpenseService.getExpenseType($scope.view.expense.expenseTypeOID).then(function (data) {
                                                if (data.apportionEnabled) {
                                                    $scope.view.expense.expenseApportion = [];
                                                    $scope.view.expenseApportion.createInit();
                                                }
                                            }, function () {
                                            })
                                        }
                                    }
                                });
                        }

                        //标题显示
                        if ($scope.view.content === 'init' || $scope.view.content === 'create') {
                            $scope.view.head = $filter('translate')('create_expense_js.Create.a.cost');//创建费用
                            $scope.view.currentLocation = LocationService.getExpenseCreateLocation();
                        } else if ($scope.view.content === 'consumeInit') {
                            $scope.view.head = $filter('translate')('expense.Consumption.details');//消费详情
                            $scope.view.currentLocation = LocationService.getExpenseCreateLocation();
                        } else if ($scope.view.content === 'submit') {
                            $scope.view.head = $filter('translate')('expense.Consumption.details');//消费详情
                        } else if ($scope.view.content === 'approvalList' || $scope.view.content === 'approvalMessage') {
                            $scope.view.head = $filter('translate')('create_expense_js.The.examination.and.approval.for.details');//审批详情
                        } else {
                            $scope.view.head = $filter('translate')('create_expense_js.Cost.details');//费用详情
                        }
                    });

            }
            init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;

            });

            // 监听费用类型改变
            var expenseTypeChangedWatch = $rootScope.$watch('expenseTypeChanged', function() {
                // 如果费用类型改变
                if($rootScope.expenseTypeChanged ) {
                    $rootScope.expenseTypeChanged = false;

                    // 是报销单创建和编辑费用并且费用类型分摊开启,初始化分摊数据,否则清空分摊数据
                    if($scope.view.expense.apportionEnabled &&
                        ((($scope.view.content==='create') && $stateParams.expenseReportOID) || $scope.view.content==='consumeInit')) {

                        $scope.view.expenseApportion.createInit();
                    } else {
                        $scope.view.expenseApportion.clear();
                    }
                }
            });

            // 监听费用金额改变
            var expenseAmountChangedWatch = $rootScope.$watch('expenseAmountChanged', function() {
                // 如果费用类型改变
                if($rootScope.expenseAmountChanged ) {
                    $rootScope.expenseAmountChanged = false;

                    // 获取费用类型数据
                    ExpenseService.getExpenseType($scope.view.expense.expenseTypeOID)
                        .then(function (data) {
                            $scope.view.expenseType = data;
                        });

                    // 如果有分摊数据
                    if($scope.view.expense.expenseApportion && $scope.view.expense.expenseApportion.length>0) {
                        // 计算默认分摊金额
                        $scope.view.expenseApportion.calculateDefaultAmount();

                        // 提示分摊金额改变
                        var alertPopup = $ionicPopup.alert({
                            title: $filter('translate')('expenseApportion.message.popupTitle'),   // 提示
                            // 金额变动后,费用分摊的数据将有所变动.请点击查看或编辑
                            template: $filter('translate')('expenseApportion.message.popupContent'),
                            okText: $filter('translate')('expenseApportion.message.popupButton'), // 好的, 我知道了
                            cssClass: "expense-amount-popup"
                        });
                        alertPopup.then(function(res) {
                        });
                    }
                }
            });

            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                // 销毁watch,避免重复监听
                expenseTypeChangedWatch();
                expenseAmountChangedWatch();
            });


        }]);
