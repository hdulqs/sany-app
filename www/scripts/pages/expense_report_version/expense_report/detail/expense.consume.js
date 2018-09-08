/**
 * Created by Administrator on 2016/7/30.
 */
// 已经不用,合并到账本里的费用
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.tab_erv_expense_consume_init_old', {
                url: '/expense/consume/init/old/:expenseReportOID',
                cache: false,
                params: {
                    expense: null,
                    message: null,
                    expenseTypeList: null
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/expense_report/detail/expense.consume.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvExpenseConsumeController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'init';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        $translatePartialLoader.addPart('expense');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.tab_erv_expense_consume_submit_old', {
                url: '/expense/consume/submit/old/:expenseReportOID',
                cache: false,
                params: {
                    expense: null
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/expense_report/detail/expense.consume.tpl.html',
                        controller: 'com.handchina.huilianyi.ErvExpenseConsumeController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'submit';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.huilianyi.ErvExpenseConsumeController', ['$scope', '$state', '$ionicModal',
        'ExpenseService', '$cordovaDatePicker', 'content', '$ionicScrollDelegate', 'InvoiceService', '$ionicLoading',
        'CompanyConfigurationService', 'localStorageService', 'LocationService', '$q', 'ExpenseReportService',
        'CurrencyCodeService', 'CustomValueService', '$ionicActionSheet', 'LANG', 'PublicFunction',
        'FunctionProfileService', 'Principal', '$filter','$sessionStorage',
        function ($scope, $state, $ionicModal, ExpenseService, $cordovaDatePicker, content,
                  $ionicScrollDelegate, InvoiceService, $ionicLoading, CompanyConfigurationService, localStorageService,
                  LocationService, $q, ExpenseReportService, CurrencyCodeService, CustomValueService, $ionicActionSheet, LANG, PublicFunction,
                  FunctionProfileService, Principal, $filter,$sessionStorage) {
            $scope.view = {
                showFooter: false,
                content: content,
                hasInvoices: false,
                updatePicLength: 0,
                withBPOReceipt: false,
                pictureUrl: [],//记录更新的图片,
                attachments: [],//附件
                isReadOnly: false, //是否为只读
                receiptStatus: false,
                deleteAttachment: [],
                nextState: null,
                uploadFinish: true,
                currentLocation: null,
                hasClicked: false,
                rejectReason: null,
                expense: {
                    "invoiceOID": null,
                    "date": new Date(),
                    "time": new Date(),
                    "expenseTypeOID": null,
                    "expenseTypeIconURL": 'img/expensetypes/no-image.png',
                    "expenseTypeName": $filter('translate')('expense.type'),
                    "expenseTypeIconName": "no-image",
                    "costCenterItemOID": null,
                    "costCenterItemName": null,
                    "amount": 0,
                    "currencyCode": $state.params.expense ? $state.params.expense.invoiceCurrencyCode : "CNY",
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
                    "invoiceInstead": false,
                    "invoiceInsteadReason": null,
                    "payByCompany": false, //是否公司支付
                    "paymentType": 1001 //1001 个人支付， 1002 公司支付
                },
                typeList: [],//费用列表
                stopTime: null,
                expenseListOIDs: [],
                //selected:false,
                againChoice: false,
                expenseObjects: localStorageService.get('expenseObjects') ? localStorageService.get('expenseObjects') : [],//创建报销单时手动添加费用
                taxRates: [],
                cancel: function () {
                    $scope.modal.hide();
                },
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1500
                    });
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
                showLoading: function () {
                    $scope.showLoading();
                    //在MainAppController中，已经定义了该函数，可以重用
                },
                doTask: function () {
                    $scope.view.expense.createLocation = JSON.stringify(LocationService.getExpenseCreateLocation());
                    //验证是否选择了税率
                    if ($scope.view.expense.expenseTypeOID
                        && $scope.view.expense.expenseTypeOID !== 'fcf5878d-0857-4c7e-8350-b0faded4fb9e'
                        && !$scope.view.expense.valid
                        && $scope.view.expense.vatInvoice
                        && $scope.view.expense.taxRate == null) {
                        $scope.view.openWarningPopup($filter('translate')('expense.Select.rate'));
                        return;
                    }
                    $scope.view.validateData().then(function () {
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
                            $scope.view.showLoading();
                            $scope.view.expense.attachments = $scope.view.attachments;
                            $scope.view.hasClicked = true;
                            //如果是增专 计算税额等...
                            if ($scope.view.expense.vatInvoice) {
                                if ($scope.view.expense.taxRate) {
                                    $scope.view.expense.taxAmount = ($scope.view.expense.amount/ (1 + $scope.view.expense.taxRate)).toFixed(2);
                                    $scope.view.expense.nonVATinclusiveAmount = ($scope.view.expense.amount - $scope.view.expense.taxAmount).toFixed(2);
                                } else {
                                    $scope.view.expense.taxAmount = 0;
                                    $scope.view.expense.nonVATinclusiveAmount = $scope.view.expense.amount;
                                }
                            } else {
                                $scope.view.expense.taxRate = null;
                                $scope.view.expense.taxAmount = null;
                                $scope.view.expense.nonVATinclusiveAmount = null;
                            }
                            InvoiceService.upsertRelativeInvoice($scope.view.expense)
                                .success(function (data) {
                                    if (localStorageService.get('expenseObjects')) {
                                        var expenseList = localStorageService.get('expenseObjects');
                                        expenseList.forEach(function (item, index) {
                                            if (data.invoiceOID == item) {
                                                $scope.view.expenseObjects.splice(index, 1);
                                                $scope.view.expenseObjects.push(data.invoiceOID);
                                                localStorageService.set('expenseObjects', $scope.view.expenseObjects);
                                            }
                                        });
                                    }
                                    if ($state.params.message == 'create_second') {
                                        $state.go('app.tab_erv_create_expense_second', {
                                            expenseReportOID: $state.params.expenseReportOID
                                        })
                                    } else if ($state.params.message == 'normal') {
                                        $state.go('app.tab_erv_expense_normal', {
                                            expenseReportOID: $state.params.expenseReportOID

                                        })
                                    } else if ($state.params.message == 'withdraw') {
                                        $state.go('app.tab_erv_expense_withdraw', {
                                            expenseReportOID: $state.params.expenseReportOID
                                        })
                                    } else if ($state.params.message == 'approval_reject') {
                                        $state.go('app.tab_erv_expense_approval_reject', {
                                            expenseReportOID: $state.params.expenseReportOID
                                        })
                                    } else if ($state.params.message == 'audit_reject') {
                                        $state.go('app.tab_erv_expense_audit_reject', {
                                            expenseReportOID: $state.params.expenseReportOID
                                        })
                                    }else if($state.params.message==='self_next'){
                                        $state.go('app.self_define_expense_report_next', {
                                            expenseReportOID: $state.params.expenseReportOID
                                        })
                                    }
                                })
                                .finally(function (){
                                    $ionicLoading.hide();
                                });
                        }
                    });

                },
                getMessageKey: function (index, customEnumerationOID, value) {
                    CustomValueService.getMessageKey(customEnumerationOID, value)
                        .then(function (data) {
                            $scope.view.expense.data[index].valueKey = data;
                        });
                },
                //根据值列表value获取值列表key(用于显示)
                getMessageKeyDetail: function(index, customEnumerationOID, value){
                    CustomValueService.getCustomValueDetail(customEnumerationOID)
                        .then(function (res) {
                            CustomValueService.getCustomValueItemDetail(res.data.dataFrom,customEnumerationOID, value)
                                .then(function (data) {
                                    $scope.view.expense.data[index].valueKey = data.data.messageKey;
                                });
                        })
                },
                validateForm: function () {
                    var i = 0;
                    for (; i < $scope.view.expense.data.length; i++) {
                        if($scope.view.expense.data[i].messageKey === 'mileage'){
                            $scope.view.expense.data[i].value = $scope.view.expense.mileage;
                        }
                        if ($scope.view.expense.data[i].required && PublicFunction.isNull($scope.view.expense.data[i].value)) {
                            PublicFunction.showToast($filter('translate')('expense.please.input') + $scope.view.expense.data[i].name);
                            return false;
                        }
                    }
                    if (i === $scope.view.expense.data.length) {
                        return true;
                    }
                },
                validateData: function () {
                    var deferred = $q.defer();
                    if (!$scope.view.expense.amount) {
                        $scope.view.openWarningPopup($filter('translate')('expense.Please.enter.the.amount'));
                        deferred.reject(false);
                    } else if ($scope.view.expense.amount < 0) {
                        $scope.view.openWarningPopup($filter('translate')('expense.The.input.amount.is.not.correct'));
                        deferred.reject(false);
                    } else if (!$scope.view.expense.time || !$scope.view.expense.date) {
                        $scope.view.openWarningPopup($filter('translate')('expense.The.date.is.not.correct'));
                        deferred.reject(false);
                    } else if ($scope.view.attachments.length === 0 && $scope.view.withBPOReceipt) {
                        $scope.view.openWarningPopup($filter('translate')('expense.Please.upload.the.invoice.photos.so.that.the.follow-up.audit.invoices'));
                        deferred.reject(false);
                    } else if ($scope.view.expense.expenseTypeName === $filter('translate')('expense.type')) {
                        $scope.view.openWarningPopup($filter('translate')('expense.Please.select.a.cost.type'));
                        deferred.reject(false);
                    }  else if (!$scope.view.validateForm()) {
                        deferred.reject(false);
                    } else {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                },
                save: function () {
                    $scope.view.canWatch = true;
                    if ($scope.view.hasClicked) {

                    } else {
                        if ($scope.view.uploadFinish) {
                            $scope.view.canWatch = false;
                            $scope.view.doTask();
                        } else {
                            PublicFunction.showToast($filter('translate')('create_expense_js.Pictures.are.on.the.cross'));//图片正在上传中...
                            // $scope.view.stopTime = $interval(function () {
                            //     $scope.view.timer()
                            // }, 100);
                        }
                    }
                }
                // timer: function () {
                //     $scope.$watch('view.uploadFinish', function () {
                //         if ($scope.view.uploadFinish) {
                //             if ($scope.view.canWatch) {
                //                 $scope.view.canWatch = false;
                //                 $scope.view.doTask();
                //                 $interval.cancel($scope.view.stopTime);
                //             }
                //         }
                //     });
                // }

            };

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
                        InvoiceService.upsertInvoice($scope.view.expense)
                            .success(function (data) {
                                if ($scope.view.nextState === 'back') {
                                    $scope.view.goBack();
                                } else if ($scope.view.nextState === 'more') {
                                    $scope.view.expense = {
                                        "invoiceOID": null,
                                        "expenseTypeOID": null,
                                        "expenseTypeIconURL": 'img/expensetypes/no-image.png',
                                        "expenseTypeName": $filter('translate')('expense.type'),
                                        "expenseTypeIconName": 'no-image',
                                        "amount": 0,
                                        "currencyCode": $state.params.expense ? $state.params.expense.invoiceCurrencyCode : "CNY",
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
                                        "paymentType": 1001
                                    };
                                    $scope.view.deleteAttachment = [];
                                    $ionicScrollDelegate.scrollTop();
                                }
                            });
                    }
                },
                error: function (error, msg) {
                    $ionicLoading.show({
                        template: $filter('translate')('expense.NetworkFailure'),//网络故障，请稍后再试。
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
                        doneButtonLabel: $filter('translate')('expense.determine'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('expense.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        locale: $sessionStorage.lang
                    };
                    if (!$scope.view.isReadOnly || ($scope.view.content === 'init' && string === 'expenseDate')) {
                        $cordovaDatePicker.show(dateOptions).then(function (date) {
                            if (date) {
                                if (string === 'expenseDate') {
                                    $scope.view.expense.date = date;
                                } else if (string === 'expenseTime') {
                                    $scope.view.expense.time = date;
                                } else {
                                    for (var i = 0; i < $scope.view.expense.data.length; i++) {
                                        if ($scope.view.expense.data[i].messageKey === string) {
                                            $scope.view.expense.data[i].value = date;
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                    }
                },
                selectTime: function () {
                    var timeOptions = {
                        date: $scope.view.expense.time,
                        mode: 'time',
                        is24Hour: true,
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel:$filter('translate')('expense.determine'),
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('expense.cancel'),
                        cancelButtonColor: '#cdcdcd',
                        androidTheme: 'THEME_HOLO_LIGHT',
                        locale: $sessionStorage.lang
                    };
                    if (!$scope.view.isReadOnly || $scope.view.content === 'init') {
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
                        doneButtonLabel: $filter('translate')('expense.determine'),
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('expense.cancel'),
                        cancelButtonColor: '#cdcdcd',
                        androidTheme: 'THEME_HOLO_LIGHT',
                        locale: $sessionStorage.lang
                    };
                    if (!$scope.view.isReadOnly) {
                        $cordovaDatePicker.show(dateTimeOptions).then(function (date) {
                            if (date) {
                                for (var i = 0; i < $scope.view.expense.data.length; i++) {
                                    if ($scope.view.expense.data[i].messageKey === string) {
                                        $scope.view.expense.data[i].value = date;
                                        break;
                                    }
                                }
                            }
                        });
                    }
                }
            };

            $scope.afreshChoice = function () {
                $scope.modal.show();
            };
            $scope.selectCash = function () {
                //alert(1)
                //$scope.view.selected=true;
            };

            //显示税率选项
            $scope.showTaxRates = function() {
                if (!$scope.view.isReadOnly || $scope.view.content === 'init') {
                    var hideSheet = $ionicActionSheet.show({
                        buttons: $scope.view.taxRates,
                        titleText: $scope.view.taxRatesTitle,
                        buttonClicked: function(index) {
                            $scope.view.expense.taxRate = $scope.view.taxRates[index].value;
                            return true;
                        }
                    });
                }
            };

            // // init modal
            // $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/expense_report/detail/afresh.select.expense.html', {
            //     scope: $scope,
            //     animation: 'slide-in-up'
            // }).then(function (modal) {
            //     $scope.modal = modal;
            // });

            $scope.$on('$ionicView.beforeEnter', function (event, ViewData) {
                ViewData.enableBack = true;
            });
            $scope.$on('$ionicView.enter', function () {
                //function profile
                FunctionProfileService.getFunctionProfileList()
                    .then(function (data) {
                        $scope.view.functionProfileList = data;
                    })
                //获取费用列表
                if($state.params.expenseTypeList){
                    $scope.view.typeList = $state.params.expenseTypeList
                } else{
                    Principal.identity().then(function (data) {
                        ExpenseService.getExpenseTypes(data.companyOID)
                            .then(function (data) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].messageKey !== 'expense.type.didi') {
                                        $scope.view.typeList.push(data[i]);
                                    }
                                }
                            });
                    })
                }

                //获取公司配置
                CompanyConfigurationService.getCompanyConfiguration().then(function (data) {
                    $scope.view.withBPOReceipt = data.configuration.bpo.enableInvoiceVerification;
                });

                //获取单条费用详情
                if ($state.params.expense) {
                    ExpenseService.getInvoice($state.params.expense.invoiceOID)
                        .success(function (data) {
                            $scope.view.expense = data;
                            //是否公司支付
                            if($scope.view.expense.paymentType && $scope.view.expense.paymentType == '1002' || $scope.view.expense.paymentType == 1002){
                                $scope.view.expense.payByCompany = true;
                            } else if($scope.view.expense.paymentType && $scope.view.expense.paymentType == '1001' || $scope.view.expense.paymentType == 1001){
                                $scope.view.expense.payByCompany = false;
                            }
                            $scope.view.code=CurrencyCodeService.getCurrencySymbol(data.invoiceCurrencyCode);
                            if (data.readonly || $scope.view.content === 'submit') {
                                $scope.view.isReadOnly = true;
                            } else {
                                $scope.view.isReadOnly = false;
                            }
                            if ($scope.view.content === 'submit') {
                                if (data.receiptFailType) {
                                    $scope.view.receiptStatus = true;
                                    $scope.receiptFailReason = angular.fromJson(data.receiptFailReason);
                                } else {
                                    $scope.view.receiptStatus = true;
                                }
                            }
                            $scope.view.expenseType = data.expenseTypeName;
                            $scope.view.expense.date = new Date($scope.view.expense.createdDate);
                            $scope.view.expense.time = new Date($scope.view.expense.createdDate);
                            //获取附件
                            $scope.view.attachments = $scope.view.expense.attachments;
                            $scope.view.pics = [];
                            angular.forEach(data.attachments, function (item) {
                                $scope.view.pics.push({
                                    src: item.fileURL,
                                    thumb: item.thumbnailUrl
                                })
                            })
                            for (var i = 0; i < $scope.view.expense.data.length; i++) {
                                if($scope.view.expense.data[i].messageKey === 'mileage'){
                                    $scope.view.expense.mileage = parseFloat($scope.view.expense.data[i].value);
                                } else if($scope.view.expense.data[i].messageKey === 'reference.mileage'){
                                    $scope.view.expense.referenceMileage = parseFloat($scope.view.expense.data[i].value);
                                } else if($scope.view.expense.data[i].messageKey === 'unit.price'){
                                    $scope.view.expense.unitPrice = parseFloat($scope.view.expense.data[i].value);
                                }
                                if ($scope.view.expense.data[i].fieldType === 'LONG' || $scope.view.expense.data[i].fieldType === 'DOUBLE') {
                                    $scope.view.expense.data[i].value = parseFloat($scope.view.expense.data[i].value);
                                }
                                if ($scope.view.expense.data[i].customEnumerationOID !== '' && $scope.view.expense.data[i].customEnumerationOID !== null && $scope.view.expense.data[i].value !== null && $scope.view.expense.data[i].value !== '') {
                                    //$scope.view.getMessageKey(i, $scope.view.expense.data[i].customEnumerationOID, $scope.view.expense.data[i].value);
                                    $scope.view.getMessageKeyDetail(i,$scope.view.expense.data[i].customEnumerationOID,$scope.view.expense.data[i].value);
                                }
                            }
                        });
                }

                if ($scope.view.content !== 'submit') {
                    $scope.view.currentLocation = LocationService.getExpenseCreateLocation();
                }

                //获取税率
                ExpenseService.getTaxRates()
                    .then(function(response) {
                        $scope.view.taxRates = response.data;
                        if ($scope.view.taxRates && $scope.view.taxRates.length > 0) {
                            $scope.view.taxRates.forEach(function(item, key) {
                                item.text = 100 * item.value + '%';
                            });
                            $scope.view.taxRates.sort(function(a, b) {
                                return a.value - b.value;
                            });
                        }
                    });
            });
        }]);
