/**
 * Created by Yuko on 16/10/16.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.self_define_expense_report_create', {
                url: '/self/define/expense/report/create?formOID?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/self_define_expense_report/self.define.expense.report.base.tpl.html',
                        controller: 'com.handchina.huilianyi.SelfDefineExpenseReportController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'create';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('invoice_apply');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        $translatePartialLoader.addPart('invoice_apply');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.self_define_expense_report_edit', {
                url: '/self/define/expense/report/edit?expenseReportOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/self_define_expense_report/self.define.expense.report.base.tpl.html',
                        controller: 'com.handchina.huilianyi.SelfDefineExpenseReportController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'edit';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('expense_report');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })

    }])
    .controller('com.handchina.huilianyi.SelfDefineExpenseReportController', ['$scope', '$state', 'FunctionProfileService', '$ionicModal', 'CurrencyCodeService', 'SelfDefineExpenseReport', 'Principal', '$cordovaDatePicker',
        'PublicFunction', 'content', '$q', '$stateParams', 'ExpenseService', 'ExpenseReportService', 'CostCenterService', '$ionicLoading', 'TravelERVService', 'CompanyConfigurationService', 'ManagerPrompt', 'DepartmentService',
        'localStorageService', 'CustomValueService', 'LANG', 'CorporationEntityService', 'LocationService', 'FORM_TYPE', 'CustomApplicationServices', 'CompanyService', '$filter', 'AgencyService', '$rootScope', '$timeout','$sessionStorage',
        function ($scope, $state, FunctionProfileService, $ionicModal, CurrencyCodeService, SelfDefineExpenseReport,
                  Principal, $cordovaDatePicker, PublicFunction, content, $q, $stateParams, ExpenseService, ExpenseReportService,
                  CostCenterService, $ionicLoading, TravelERVService, CompanyConfigurationService, ManagerPrompt, DepartmentService,
                  localStorageService, CustomValueService, LANG, CorporationEntityService, LocationService, FORM_TYPE,
                  CustomApplicationServices, CompanyService, $filter, AgencyService, $rootScope, $timeout,$sessionStorage) {
            $scope.view = {
                hasInit: false, //是否已初始化完毕
                defaultBankAccount: null,   //默认银行账户
                userOID: null,
                applicantOID: null,  // 申请人OID,选银行卡号时会用到
                disabled: false,
                code: null,
                content: content,
                readonly: false,
                cashName: null,
                cashCategoryList: null,
                departmentInfo: {},
                departmentOID: "",
                functionProfileList: null,
                approvalMaxLength: 3,
                companyOID: null,
                currencyCode: '',
                reportData: {},
                approvalSelectedName: null,//已选择的审批人名字
                corporationOID: null, //法人实体
                currentLocation: null, //位置信息
                isReadOnly: false,
                isBaseMessageKey: function (field) {
                    if(field.messageKey === 'applicant' || field.messageKey === 'writeoff_flag' || field.messageKey === 'total_budget' || field.messageKey === 'title' || field.messageKey === 'start_date' || field.messageKey === 'remark' || field.messageKey === 'text_area' ||
                        field.messageKey === 'select_participant' || field.messageKey === 'end_date' || field.messageKey === 'currency_code' || field.messageKey === 'budget_detail' || field.messageKey === 'average_budget' ||
                        field.messageKey === 'select_cost_center' || field.messageKey === 'select_department' || field.messageKey === 'select_approver' || field.messageKey === 'select_corporation_entity' ||
                        field.messageKey === 'linkage_switch' || field.messageKey === 'cust_list' || field.messageKey === 'select_user' || field.messageKey === 'select_box' ||
                        field.messageKey === 'contact_bank_account' || field.messageKey === 'time'){
                        return true;
                    } else {
                        return false;
                    }
                },
                validate: function () {
                    var deferred = $q.defer();
                    var i = 0;
                    while(i < $scope.view.reportData.custFormValues.length){
                        if ($scope.view.reportData.custFormValues[i].messageKey === "select_department") {
                            if($scope.view.departmentInfo.status == 102){
                                PublicFunction.showToast($filter('translate')('expense.diable.department'));
                                deferred.reject(false);
                                return deferred.promise;
                            }
                            $scope.view.departmentOID = $scope.view.reportData.custFormValues[i].value;
                        }
                        // 申请人
                        if ($scope.view.reportData.custFormValues[i].messageKey === "applicant" && $scope.view.reportData.custFormValues[i].applicant) {
                            $scope.view.reportData.custFormValues[i].value = $scope.view.reportData.custFormValues[i].applicant.userOID;
                        }
                        //联动开关
                        if($scope.view.reportData.custFormValues[i].messageKey === 'linkage_switch'){
                            if($scope.view.reportData.custFormValues[i].value){
                                var j = 0;
                                for(; j < $scope.view.reportData.custFormValues[i].content.length; j++){
                                    if($scope.view.reportData.custFormValues[i].content[j].required && ($scope.view.reportData.custFormValues[i].content[j].value === null || $scope.view.reportData.custFormValues[i].fieldContent[j].value === '')){
                                        PublicFunction.showToast($filter('translate')('expense.please.input') + $scope.view.reportData.custFormValues[i].content[j].fieldName);
                                        deferred.reject(false);
                                        return deferred.promise;
                                    } else if($scope.view.reportData.custFormValues[i].content[j].fieldType === 'LONG' && $scope.view.reportData.custFormValues[i].content[j].value !== parseInt($scope.view.reportData.custFormValues[i].content[j].value)){
                                        PublicFunction.showToast($filter('translate')('expense.Please.enter.a.valid') + $scope.view.reportData.custFormValues[i].content[j].fieldName);
                                        deferred.reject(false);
                                        return deferred.promise;
                                    }
                                }
                                if(j === $scope.view.reportData.custFormValues[i].content.length){
                                    $scope.view.reportData.custFormValues[i].fieldContent = JSON.stringify($scope.view.reportData.custFormValues[i].content);
                                    i++;
                                }
                            } else {
                                $scope.view.reportData.custFormValues[i].fieldContent = JSON.stringify($scope.view.reportData.custFormValues[i].content);
                                i++;
                            }
                        } else if($scope.view.reportData.custFormValues[i].messageKey === 'select_box'){
                            //选择框
                            if($scope.view.reportData.custFormValues[i].required && $scope.view.reportData.custFormValues[i].selectValue.length === 0){
                                PublicFunction.showToast($filter('translate')('expense.Please.select') + $scope.view.reportData.custFormValues[i].fieldName);
                                deferred.reject(false);
                                return deferred.promise;
                            } else{
                                $scope.view.reportData.custFormValues[i].value  = angular.toJson($scope.view.reportData.custFormValues[i].selectValue);
                                i++;
                            }
                        } else if ($scope.view.reportData.custFormValues[i].required && ($scope.view.reportData.custFormValues[i].value === null || $scope.view.reportData.custFormValues[i].value === '')) {
                            if($scope.view.reportData.custFormValues[i].messageKey === 'select_cost_center' && $scope.view.reportData.custFormValues[i].costCenterLength == 0){
                                PublicFunction.showToast($scope.view.reportData.custFormValues[i].fieldName + $filter('translate')('expense.Not.configured,please.contact.your.administrator'));
                                deferred.reject(false);
                                return deferred.promise;
                            } else {
                                PublicFunction.showToast($filter('translate')('expense.please.input') + $scope.view.reportData.custFormValues[i].fieldName);
                                deferred.reject(false);
                                return deferred.promise;
                            }
                            return deferred.promise;
                        } else {
                            i++;
                        }
                    }
                    if (i === $scope.view.reportData.custFormValues.length) {
                        deferred.resolve(true);
                        return deferred.promise;
                    }
                },
                //获取值列表名字
                getValueName: function (index) {
                    // CustomValueService.getMessagekeyDetail()
                    CustomValueService.getMessageKey($scope.view.reportData.custFormValues[index].customEnumerationOID, $scope.view.reportData.custFormValues[index].value)
                        .then(function (data) {
                            $scope.view.reportData.custFormValues[index].valueKey = data;
                        })
                },
                //根据值列表value获取值列表key(用于显示)
                getMessageKeyDetail: function(index, customEnumerationOID, value){
                    CustomValueService.getCustomValueDetail(customEnumerationOID)
                        .then(function (res) {
                            var enabled=res.data.enabled;
                            //enabled为false时，该值列表不可打开
                            if(enabled){
                                $scope.view.reportData.custFormValues[index].enabledStatus=true;
                            }else{
                                $scope.view.reportData.custFormValues[index].enabledStatus=false;
                                $scope.view.reportData.custFormValues[index].required=false;
                            }
                            //根据值列表oid和value值查询特定值列表详情，获取默认值
                            CustomValueService.getCustomValueItemDetail(res.data.dataFrom,customEnumerationOID, value)
                                .then(function (data) {
                                    //enabled为true才显示默认值
                                    if(enabled){
                                        $scope.view.reportData.custFormValues[index].valueKey = data.data.messageKey;

                                    }
                                });
                        })
                },
                //新建时处理值列表的默认值
                getMessageKeyDetailByCreate:function(index,customEnumerationOID){
                    CustomValueService.getCustomValueDetail(customEnumerationOID)
                        .then(function (res) {
                            var enabled=res.data.enabled;
                            //enabled为false时，该值列表不可打开
                            if(enabled){
                                $scope.view.reportData.custFormValues[index].enabledStatus=true;
                            }else{
                                $scope.view.reportData.custFormValues[index].enabledStatus=false;
                                $scope.view.reportData.custFormValues[index].required=false;
                            }
                            //根据值列表oid查询值列表项，获取默认值
                            CustomValueService.getCustomValueListByPagination(res.data.dataFrom,customEnumerationOID, 0, 1000, '', $scope.view.applicantOID)
                                .then(function (data) {
                                    if(data.data && data.data.length >0){
                                        data.data.forEach(function(item){
                                            //值列表启用，值列表项启用才显示默认值
                                            if(item.patientia && enabled){
                                                $scope.view.reportData.custFormValues[index].valueKey=item.messageKey;
                                                $scope.view.reportData.custFormValues[index].value=item.value;
                                            }
                                        })
                                    }
                                    //没有值列表项的时候显示未启用
                                    else{
                                        $scope.view.reportData.custFormValues[index].enabledStatus=false;
                                        $scope.view.reportData.custFormValues[index].required=false;
                                    }


                                });
                        })
                },
                doTask: function () {
                    if ($scope.view.reportData.expenseReport.expenseReportOID !== null && $scope.view.reportData.expenseReport.expenseReportOID !== '') {

                    }
                },
                saveDataExpenseReport: function(){
                    ExpenseReportService.setTab('1001');
                    if($scope.view.reportData.formType === 3002){
                        $scope.view.reportData.applicationOID = $stateParams.applicationOID;
                    } else if($scope.view.reportData.formType === 3003){
                        $scope.view.reportData.applicationOID = $stateParams.applicationOID;
                    }
                    SelfDefineExpenseReport.saveCustomForm($scope.view.reportData)
                        .success(function (data) {

                            $scope.view.disabled = false;
                            $state.go('app.tab_erv.expense_report');
                        })
                        .error(function(error){
                            $scope.view.disabled = false;
                            if(error.message){
                                PublicFunction.showToast(error.message);
                            } else {
                                PublicFunction.showToast($filter('translate')('expense.error'));
                            }
                        })
                },
                saveExpenseReport: function () {
                    $scope.view.validate()
                        .then(function () {
                            ExpenseReportService.setTab('1001');
                            if($scope.view.departmentOID){
                                DepartmentService.getDepartmentInfo($scope.view.departmentOID).then(function(response){
                                    if($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode===1002 && !response.data.managerOID){
                                        PublicFunction.showToast(ManagerPrompt);
                                    } else {
                                        $scope.view.disabled = true;
                                        $scope.view.saveDataExpenseReport();
                                    }
                                })
                            } else {
                                $scope.view.disabled = true;
                                $scope.view.saveDataExpenseReport();
                            }
                        })
                },
                saveDataNextOperation:function(){
                    if($scope.view.reportData.formType === 3002){
                        $scope.view.reportData.applicationOID = $stateParams.applicationOID;
                    } else if($scope.view.reportData.formType === 3003){
                        $scope.view.reportData.applicationOID = $stateParams.applicationOID;
                    }
                    SelfDefineExpenseReport.saveCustomForm($scope.view.reportData)
                        .success(function (data) {
                            $state.go('app.self_define_expense_report_next', {expenseReportOID: data.expenseReportOID})
                        })
                        .error(function(error){
                            if(error.message){
                                PublicFunction.showToast(error.message);
                            } else {
                                PublicFunction.showToast($filter('translate')('expense.error'));
                            }
                        })
                        .finally(function() {
                            $scope.view.disabled = false;
                        })
                },
                nextOperation: function () {
                    //var data = "e2676289-5619-4b4b-b60f-b75b6bfdb735";
                    //$state.go('app.self_define_expense_report_next', {expenseReportOID: data, formOID: $scope.view.reportData.formOID})
                    // 防止重复点击
                    $scope.view.disabled = true;
                    PublicFunction.showLoading(0);
                    $scope.view.validate()
                        .then(function () {
                            // 如果表单有部门并且公司配置为部门经理审批并且所选择部门没有部门经理,提示错误信息
                            if($scope.view.departmentOID){
                                DepartmentService.getDepartmentInfo($scope.view.departmentOID).then(function(response){
                                    if($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode === 1002 && !response.data.managerOID){
                                        $scope.view.disabled = false;
                                        PublicFunction.showToast(ManagerPrompt);
                                    } else {
                                        $scope.view.saveDataNextOperation();
                                    }
                                })
                            } else {
                                $scope.view.saveDataNextOperation();
                            }
                        }, function() {
                            $scope.view.disabled = false;
                        })
                },
                selectCode: function () {
                        $scope.selectCurrencyCode.show();
                },
                changeCurrencyCode: function (item) {
                    $scope.view.currencyCode = item.currency;
                    for (var i = 0; i < $scope.view.reportData.custFormValues.length; i++) {
                        if ($scope.view.reportData.custFormValues[i].messageKey === 'currency_code') {
                            $scope.view.reportData.custFormValues[i].value = item.currency;
                            break;
                        }
                    }
                    $scope.view.cashName = item.currencyName;
                    $scope.selectCurrencyCode.hide();
                },
                //选择时间
                selectDate: function (string, fieldOID, value) {
                    // var originDate = new Date(value);
                    // var dateOptions = {
                    //     date: new Date(originDate),
                    //     mode: 'date',
                    //     allowOldDates: true,
                    //     allowFutureDates: true,
                    //     doneButtonLabel: $filter('translate')('expense.determine'),
                    //     doneButtonColor: '#0092da',
                    //     cancelButtonLabel: $filter('translate')('expense.cancel'),
                    //     cancelButtonColor: '#cdcdcd',
                    //     locale: $sessionStorage.lang
                    // };
                    // if (!$scope.view.isReadOnly) {
                    //     $cordovaDatePicker.show(dateOptions).then(function (date) {
                    //         if (date) {
                    //             //检查开始日期不能晚于结束日期的逻辑
                    //             var startDate = null;
                    //             var endDate = null;
                    //             if (string === 'startDate') {
                    //                 //如果是开始日期，则通过函数去获取结束日期
                    //                 startDate = originDate;
                    //                 endDate = $scope.view.getEndDate();
                    //             } else if (string === 'endDate') {
                    //                 //如果是结束日期，则通过函数去获取开始日期
                    //                 startDate = $scope.view.getStartDate();
                    //                 endDate = originDate;
                    //             }
                    //             if (((Date.parse(endDate) - Date.parse(startDate)) / 3600 / 1000) < 0) {
                    //                 PublicFunction.showToast($filter('translate')('expense.End.date.cannot.be.earlier.than.start.date'));
                    //             } else {
                    //                 if(string === 'startDate'){
                    //                     $scope.view.setStartDate(date);
                    //                 } else if(string === 'endDate'){
                    //                     $scope.view.setEndDate(date);
                    //                 }
                    //
                    //             }
                    //         }
                    //     });
                    // }

                    var date = null;
                    if(string === 'startDate'){
                        date = new Date($scope.view.getStartDate()).Format('yyyy-MM-dd');
                    } else if(string === 'endDate'){
                        date = new Date($scope.view.getEndDate()).Format('yyyy-MM-dd');
                    }


                    var success = function (response) {
                        var originDate = new Date(value);
                        try {
                            if(ionic.Platform.isAndroid()){
                                $scope.result = new Date(response);
                            } else {
                                $scope.result = new Date(response.result);
                            }
                            //检查开始日期不能晚于结束日期的逻辑
                            var startDate = null;
                            var endDate = null;
                            if (string === 'startDate') {
                                //如果是开始日期，则通过函数去获取结束日期
                                startDate = $scope.result;
                                endDate = $scope.view.getEndDate();
                            } else if (string === 'endDate') {
                                //如果是结束日期，则通过函数去获取开始日期
                                startDate = $scope.view.getStartDate();
                                endDate = $scope.result;
                            } else {
                                for(var i = 0; i < $scope.view.reportData.custFormValues.length; i++){
                                    if($scope.view.reportData.custFormValues[i].fieldOID == fieldOID){
                                        $scope.view.reportData.custFormValues[i].value = $scope.result;
                                        break;
                                    }
                                }
                            }
                            if (((Date.parse(endDate) - Date.parse(startDate)) / 3600 / 1000) < 0) {
                                PublicFunction.showToast($filter('translate')('expense.End.date.cannot.be.earlier.than.start.date'));
                            } else {
                                if(string === 'startDate'){
                                    $scope.view.setStartDate($scope.result);
                                } else if(string === 'endDate'){
                                    $scope.view.setEndDate($scope.result);
                                }

                            }
                            $scope.$apply();
                        } catch (e) {
                        }
                    };
                    var error = function (response) {
                    };


                    if (ionic.Platform.isWebView() && !$scope.view.isReadOnly) {
                        var startTime = '-';
                        var endTime = '-';
                        if(string === 'endDate'){
                            //$scope.view.getStartDate()有值才进行格式转化
                            //new Date(null).Format('yyyy-MM-dd')为1970-01-01
                            if ($scope.view.getStartDate()) {
                                startTime = new Date($scope.view.getStartDate()).Format('yyyy-MM-dd');
                            }
                        }
                        if(string === 'startDate'){
                            //$scope.view.getEndDate()有值才进行格式转化
                            //new Date(null).Format('yyyy-MM-dd')为1970-01-01
                            if ($scope.view.getEndDate()) {
                                endTime = new Date($scope.view.getEndDate()).Format('yyyy-MM-dd');
                            }
                        }
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

                },
                //只有时间
                selectTime: function (field) {
                    var timeOptions = {
                        date: field.value ? field.value : new Date(),
                        mode: 'time',
                        is24Hour: true,
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('common.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel:  $filter('translate')('common.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        androidTheme: 'THEME_HOLO_LIGHT',
                        locale: $sessionStorage.lang
                    };
                    if (!$scope.view.isReadOnly) {
                        $cordovaDatePicker.show(timeOptions).then(function (date) {
                            if (date) {
                                field.value = date;
                            }
                        });
                    }
                },
                //在所有自定义控件中，找出开始时间
                getStartDate: function(){
                    for(var i = 0; i < $scope.view.reportData.custFormValues.length; i++) {
                        if ($scope.view.reportData.custFormValues[i].messageKey === 'start_date'){
                            return $scope.view.reportData.custFormValues[i].value;
                        }
                    }
                },
                setStartDate: function(date){
                    for(var i = 0; i < $scope.view.reportData.custFormValues.length; i++) {
                        if ($scope.view.reportData.custFormValues[i].messageKey === 'start_date'){
                            $scope.view.reportData.custFormValues[i].value = date;
                            break;
                        }
                    }
                },
                setEndDate: function(date){
                    for(var i = 0; i < $scope.view.reportData.custFormValues.length; i++) {
                        if ($scope.view.reportData.custFormValues[i].messageKey === 'end_date'){
                            $scope.view.reportData.custFormValues[i].value = date;
                            break;
                        }
                    }
                },
                //在所有自定义控件中，找出结束时间
                getEndDate: function(){
                    for(var i = 0; i < $scope.view.reportData.custFormValues.length; i++) {
                        if ($scope.view.reportData.custFormValues[i].messageKey === 'end_date'){
                            return $scope.view.reportData.custFormValues[i].value;
                        }
                    }
                },
                getCostCenterName: function(index){
                    var indexCostCenter = index;
                    var json = JSON.parse($scope.view.reportData.custFormValues[indexCostCenter].dataSource);
                    $scope.view.reportData.custFormValues[indexCostCenter].costCenterOID = json.costCenterOID;
                    if($scope.view.reportData.custFormValues[indexCostCenter].value){
                        CostCenterService.getCostCenterItemDetail($scope.view.reportData.custFormValues[indexCostCenter].value)
                            .success(function(data){
                                $scope.view.reportData.custFormValues[indexCostCenter].costCenterName = data.name;
                            })
                            .error(function(){
                                $scope.view.reportData.custFormValues[indexCostCenter].costCenterName = null;
                            })
                    } else{
                        $scope.view.reportData.custFormValues[indexCostCenter].costCenterName = null;
                    }
                },
                //获取部门详情
                getDepartmentDetail: function(departmentOID){
                    SelfDefineExpenseReport.getDepartmentInfo(departmentOID)
                        .success(function(data) {
                            var name = $scope.view.departmentInfo.departmentName;
                            $scope.view.departmentInfo = data;
                            $scope.view.departmentInfo.departmentName = name;
                        })
                },
                getDepartmentName: function(index){
                    SelfDefineExpenseReport.getDepartmentInfo($scope.view.reportData.custFormValues[index].value)
                        .success(function(data){
                            $scope.view.departmentInfo = data;
                            if($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]){
                                $scope.view.reportData.custFormValues[index].departmentName = data.name;
                                $scope.view.departmentInfo.departmentName = data.name;
                            } else {
                                $scope.view.reportData.custFormValues[index].departmentName = data.path;
                                $scope.view.departmentInfo.departmentName = data.path;
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
                //获取成本中心的长度
                getCostCenterLength: function (index) {
                    CostCenterService.getMyCostCenter($scope.view.reportData.customFormFields[index].costCenterOID, 0, 1)
                        .success(function (data, status, headers) {
                            $scope.view.reportData.custFormValues[index].costCenterLength = headers('x-total-count');
                        })
                },
                //获取法人实体名字
                getCorporationEntityName: function (index) {
                    if($scope.view.corporationOID){
                        CorporationEntityService.getCorporationEntityDetail($scope.view.corporationOID)
                            .success(function (data) {
                                $scope.view.reportData.custFormValues[index].entityName = data.companyName;
                                if($scope.view.content === 'create'){
                                    $scope.view.reportData.customFormFields[index].entityName = data.companyName;
                                    $scope.view.reportData.customFormFields[index].value = $scope.view.corporationOID;
                                    $scope.view.reportData.custFormValues[index].value = $scope.view.corporationOID;
                                }
                            })
                    }
                },
                //获取选择框的数组
                getSelectBoxId: function (index) {
                    $scope.view.reportData.custFormValues[index].selectID = [];
                    for (var i = 0; i < $scope.view.reportData.custFormValues[index].selectValue.length; i++) {
                        $scope.view.reportData.custFormValues[index].selectID.push($scope.view.reportData.custFormValues[index].selectValue[i].id);
                    }
                },
                //银行卡
                getContactBankAccountName: function (index) {
                    if($scope.view.reportData.custFormValues[index].value){
                        CompanyService.getBankAccountDetail($scope.view.reportData.custFormValues[index].value)
                            .success(function (data) {
                                $scope.view.reportData.custFormValues[index].bankAccountNo = data.bankAccountNo;
                            })
                    }
                },
                //TODO:根据申请人OID获取默认银行卡
                getDefaultBankAccount: function (applicantOID) {
                    var deferred = $q.defer();
                    CompanyService.getUserBankAccountList(applicantOID, 0, 20).success(function (data) {
                        if (data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                if(data[i].isPrimary){
                                    $scope.view.defaultBankAccount = data[i];
                                    deferred.resolve($scope.view.defaultBankAccount)
                                }
                            }
                        }else{
                            $scope.adminList = [];
                            Principal.identity().then(function (data) {
                                CustomApplicationServices.getAdminList(data.companyOID, 0, 3)
                                    .success(function (data) {
                                        $scope.adminList = data;
                                        deferred.resolve($scope.adminList)
                                    })
                            })
                        }
                    });
                    return deferred.promise;
                },
                // 获取成本中心
                getCostcenterAndSetCenterItemName: function(item) {
                    if (item.value) {
                        CostCenterService.getCostCenterItemDetail(item.value)
                            .then(function(response) {
                                var costCenterItem = response.data;
                                if(costCenterItem) {
                                    item.costCenterName = costCenterItem.name;
                                }
                            });
                    }
                },
                //根据申请人OID获取默认成本中心
                getDefaultCostCenter: function (applicantOID, costCenterOID, item) {
                    CostCenterService.getDefaultValueOfCostCenter(applicantOID, costCenterOID).success(function (res) {
                        //获取默认的成本中心项OID,
                        item.value = res.costCenterItemOID;
                        //根据默认的成本中心项OID获取成本中心
                        $scope.view.getCostcenterAndSetCenterItemName(item);
                    }).error(function (err) {
                        //当报错时，将成本中心项初始化为null,让用户自己选择
                        item.value = null;
                        item.costCenterName = null;
                    });
                }
                // //拼接选择框值
                // getSelectBoxValue: function (index) {
                //     if($scope.view.reportData.custFormValues[index].value.length > 0){
                //         $scope.view.reportData.custFormValues[index].selectValue = '';
                //         for(var i = 0; i < $scope.view.reportData.custFormValues[index].value.length; i++){
                //             if(i === $scope.view.reportData.custFormValues[index].value.length -1){
                //                 $scope.view.reportData.custFormValues[index].selectValue += $scope.view.reportData.custFormValues[index].value[i];
                //             } else {
                //                 $scope.view.reportData.custFormValues[index].selectValue += $scope.view.reportData.custFormValues[index].value[i] + '，';
                //             }
                //         }
                //     }
                // }
            };

            //选择币种
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/self_define_expense_report/select.currency.code.tpl.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.selectCurrencyCode = modal;
            });
            //计算总金额
            //$scope.$watch('view.reportData.expenseReport.averageBudget', function (newValue, oldValue) {
            //    if (newValue !== oldValue && newValue !== '' && newValue !== null) {
            //        $scope.view.reportData.expenseReport.totalBudget = $scope.view.reportData.expenseReport.averageBudget * ($scope.view.reportData.expenseReport.applicationParticipants.length);
            //    }
            //});
            //$scope.$watch('view.reportData.expenseReport.applicationParticipants.length', function (newValue, oldValue) {
            //    if (newValue !== oldValue) {
            //        $scope.view.reportData.expenseReport.totalBudget = $scope.view.reportData.expenseReport.averageBudget * ($scope.view.reportData.expenseReport.applicationParticipants.length );
            //    }
            //});

            // 代理相关内容
            $scope.agency = {

                // 清空成本中心内容
                costCenterClear: function (index){
                    var formValues = $scope.view.reportData.custFormValues;
                    formValues[index].costCenterName = null;
                    formValues[index].value = null;
                },
                //当申请人发生变化，会调用该函数，去修改该申请单的默认成本中心
                costCenterChange: function (index, applicant) {
                    var costCenterItem = $scope.view.reportData.custFormValues[index];
                    $scope.view.getDefaultCostCenter(applicant.userOID, costCenterItem.costCenterOID, costCenterItem);
                },
                // 修改部门为申请人所在的部门
                departmentChange: function (index, applicant){

                    // 先清空部门信息,避免拿不到数据时还是使用之前的数据
                    $scope.view.reportData.custFormValues[index].value = null;
                    $scope.view.reportData.custFormValues[index].path = null;

                    // 获取用户所在部门信息
                    AgencyService.getUserDetail(applicant.userOID).then(function(response){
                        var data = response.data.department;

                        $scope.view.reportData.custFormValues[index].value = data.departmentOID;
                        if($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]){
                            $scope.view.reportData.custFormValues[index].departmentName = data.name;
                        } else {
                            $scope.view.reportData.custFormValues[index].departmentName = data.path;
                        }
                    });
                },

                // 修改法人实体为申请人所在的法人实体
                corporationEntityChange: function (index, applicant){
                    AgencyService.getUserDetail(applicant.userOID).then(function(response){
                            var data = response.data;

                            $scope.view.corporationOID = data.corporationOID;
                            $scope.view.getCorporationEntityName(index);
                        });
                },

                // 修改法人实体为申请人所在的法人实体
                bankAccountChange: function (index, applicant){
                    //根据申请人OID，获取默认银行账户
                    $scope.view.defaultBankAccount = null;
                    $scope.view.getDefaultBankAccount(applicant.userOID).then(function (res) {
                        if(res){
                            $scope.view.reportData.custFormValues[index].bankAccountNo = res.bankAccountNo;
                            $scope.view.reportData.custFormValues[index].promptInfo = res.bankName;
                            $scope.view.reportData.custFormValues[index].value = res.contactBankAccountOID;
                        }
                    });
                },

                // 清除银行卡信息
                bankAccountClear: function (index){
                    $scope.view.reportData.custFormValues[index].value = null;
                    $scope.view.reportData.custFormValues[index].bankAccountNo = null;
                },

                // 判断是否报销单是否有关联的申请单
                judgeRelativeApplication: function () {
                    return $scope.view.reportData.referenceOID;
                },

                // 清空已选择的费用以及本地费用
                clearInvoices: function(){
                    $scope.view.reportData.expenseReportInvoices = [];
                    localStorageService.remove('expenseObjects');
                },

                // 申请人改变时的处理
                applicantChange: function(applicant){
                    // 修改关联信息,如果是有关联申请单的,申请人改变,关联的部门,和法人实体不变,按照申请单的,否则按照申请人.
                    // 成本中心清空,因为修改了申请人之后,申请单带过来的成本中心所选的申请人可能选不到
                    // 申请人改变，对应的银行账户也需要做改变，重新根据申请人OID查询其对应的默认银行账号
                    //值列表清空
                    function relativeHandle(){
                        var custFormValues = $scope.view.reportData.custFormValues;
                        for(var i=0; i< custFormValues.length; i++){
                            switch (custFormValues[i].messageKey){
                                // 修改部门为申请人所在的部门
                                case 'select_department':
                                    if ($scope.agency.judgeRelativeApplication()){
                                        break;
                                    }
                                    $scope.agency.departmentChange(i, applicant);
                                    break;
                                // 清空成本中心内容
                                case 'select_cost_center':
                                    $scope.agency.costCenterChange(i, applicant);
                                    // $scope.agency.costCenterClear(i);
                                    break;
                                // 修改法人实体为申请人所在的法人实体
                                case 'select_corporation_entity':
                                    if ($scope.agency.judgeRelativeApplication()){
                                        break;
                                    }
                                    $scope.agency.corporationEntityChange(i, applicant);
                                    break;
                                // 清除银行卡信息
                                case 'contact_bank_account':
                                    // $scope.agency.bankAccountClear(i);
                                    $scope.agency.bankAccountChange(i, applicant);
                                    break;
                                //修改值列表
                                case 'cust_list':
                                    $scope.view.reportData.custFormValues[i].value = null;
                                    $scope.view.reportData.custFormValues[i].valueKey = null;
                                    break;
                            }
                        }
                    }

                    // 修改申请人OID
                    $scope.view.applicantOID = applicant.userOID;

                    // 清空已选择的费用
                    $scope.agency.clearInvoices();

                    // 获取申请人FunctionProfile信息
                    FunctionProfileService.getUserFunctionProfile(applicant.userOID).then(function (response) {
                        $scope.view.functionProfileList = response.data;
                        relativeHandle();
                        $rootScope.expenseReportApplicantChanged = false;  // 释放变量
                    })
                },

                // 关联自定义申请单时申请人的相关处理
                relativeApplicationApplicant: function (applicationData) {
                    var report = $scope.view.reportData.custFormValues;
                    var application = applicationData.custFormValues;

                    // 部门和法人实体处理
                    function departmentCorporation(){
                        var applicant = {
                            userOID: $scope.view.applicantOID
                        };

                        // 部门,如果申请单中没有部门,默认取申请人所在部门
                        var departmentIndex = AgencyService.getDetailFromFormValuesByKey('select_department', report);
                        if (departmentIndex && !AgencyService.getDetailFromFormValuesByKey('select_department', application)) {
                            $scope.agency.departmentChange(departmentIndex, applicant);
                        }
                        // 法人实体,如果申请单中没有法人实体,默认取申请人所在法人实体
                        var corporationIndex = AgencyService.getDetailFromFormValuesByKey('select_corporation_entity', report);
                        if (corporationIndex && !AgencyService.getDetailFromFormValuesByKey('select_corporation_entity', application)) {
                            $scope.agency.corporationEntityChange(corporationIndex, applicant);
                        }
                    }

                    // 如果报销单有申请人字段,改为申请单对应的参与人并且是可以被代理的人
                    // 获取表单中的申请人
                    var index = AgencyService.getDetailFromFormValuesByKey('applicant', report);
                    if (index){
                        // 判断当前是否为所关联的申请单中的参与人之一
                        var exist = false;
                        for(var k=0; k< applicationData.applicationParticipants.length; k++){
                            if (report[index].applicant.userOID===applicationData.applicationParticipants[k].participantOID){
                                exist = true;
                            }
                        }
                        // 如果是,处理部门和法人实体.如果不是,选择任一可以选择的申请人进行处理
                        if (exist){
                            departmentCorporation();
                        } else {
                            AgencyService.getApplicantsCanSelect().then(function(response){
                                if(response.data.length>0){
                                    report[index].applicant = AgencyService.getApplicantItem(response.data[0]);

                                    // 修改申请人OID
                                    $scope.view.applicantOID = report[index].applicant.userOID;

                                    departmentCorporation();
                                }
                            });
                        }
                    }
                }
            };

            //货币
            $scope.getCashName = function (currencyCode) {
                if (currencyCode !== null && currencyCode !== '') {
                    return CurrencyCodeService.getCashName(currencyCode)
                } else {
                    return null;
                }
            };

            $scope.autoFillReport = function (applicationData) {
                var i, j;
                var report = $scope.view.reportData.custFormValues;
                var application = applicationData.custFormValues;

                // 关联自定义申请单时申请人的相关处理
                $scope.agency.relativeApplicationApplicant(applicationData);

                //比较两个field，如果都是值列表，DataSource里包含的customEnumerationOID是否一样
                function custListEqual(objectOne, objectTwo){
                    if (objectOne.messageKey=="cust_list" && objectTwo.messageKey=="cust_list" && objectOne.dataSource && objectTwo.dataSource){
                        var dataSourceOne = JSON.parse(objectOne.dataSource);
                        var dataSourceTwo = JSON.parse(objectTwo.dataSource);
                        if (objectOne.customEnumerationOID && objectTwo.customEnumerationOID && objectOne.customEnumerationOID == objectTwo.customEnumerationOID){
                            return true
                        }
                    }
                    return false
                }

                //自定义申请单
                if (application && application.length) {
                    for (i = 0; i <(report && report.length); i++) {
                        for(j = 0; j <(application && application.length); j++) {
                            if (report[i].messageKey && report[i].messageKey === application[j].messageKey) {
                                if (application[j].value) {
                                    //如果申请单有值，则赋给报销单，从if中拿出来。
                                    //比如开始时间start_date，和结束时间，就在下面赋值
                                    if (report[i].messageKey=="cust_list" && !custListEqual(report[i], application[j]) ){
                                    //    如果是值列表，并且customEnumerationOID不相同，则什么也不做，否则需要把值从申请单复制到报销单
                                    }
                                    else{
                                        //TODO:
                                        // notice:由于在创建报销单时，会获取默认的成本中心和银行卡号，当关联申请单时会带入申请单中成本中心以及其他的值，所以需要匹配上之后再赋值
                                        //处理成本中心显示
                                        if (report[i].messageKey === 'select_cost_center') {
                                            if (report[i].datasource === application[j].datasource && report[i].fieldName === application[j].fieldName) {
                                                report[i].value = application[j].value;
                                                $scope.view.getCostCenterName(i);
                                            }
                                        }else {
                                            report[i].value = application[j].value;

                                        }
                                    }
                                    //处理部门显示
                                    if (report[i].messageKey === 'select_department' &&
                                        report[i].fieldName === application[j].fieldName) {
                                        $scope.view.getDepartmentName(i);
                                    }
                                    //处理审批人显示
                                    if ((report[i].messageKey === 'select_approver' && report[i].fieldName === application[j].fieldName) ||
                                        (report[i].messageKey === 'select_user' && report[i].fieldName === application[j].fieldName)) {
                                        $scope.view.getSelectedApproval(i);
                                    }
                                    //法人实体
                                    if (report[i].messageKey === 'select_corporation_entity' &&
                                        report[i].fieldName === application[j].fieldName) {
                                        $scope.view.corporationOID = application[j].value ;
                                        report[i].entityName = null;
                                        $scope.view.getCorporationEntityName(i);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    //旧的申请单
                    for (i = 0; i < (report && report.length); i++) {
                        //关联成本中心
                        if (report[i].messageKey === 'select_cost_center') {
                            if (applicationData.costCenterItemOID) {
                                report[i].value = applicationData.costCenterItemOID;
                                $scope.view.getCostCenterName(i);
                            }
                        }
                        //关联部门
                        if (report[i].messageKey === 'select_department') {
                            if (applicationData.departmentOID) {
                                report[i].value = applicationData.departmentOID;
                                $scope.view.getDepartmentName(i);
                            }
                        }
                        //关联审批人
                        if (report[i].messageKey === 'select_approver') {
                            if (applicationData.userOID) report[i].value = applicationData.userOID;
                        }
                        //关联币种
                        if (report[i].messageKey === 'currency_code') {
                            if (applicationData.currencyCode) report[i].value = applicationData.currencyCode;
                        }
                        //关联title
                        if (report[i].messageKey === 'title') {
                            if (applicationData.title) report[i].value = applicationData.title;
                        }
                    }
                }

            };

            var init = function () {
                PublicFunction.showLoading();

                // 保存当前的formOID
                if ($stateParams.formOID){
                    AgencyService.setFormOID($stateParams.formOID);
                }
                // 保存当前的applicationOID
                if ($stateParams.applicationOID){
                    AgencyService.setApplicationOID($stateParams.applicationOID);
                }

                $scope.view.currentLocation = LocationService.getExpenseCreateLocation();
                Principal.identity().then(function (data) {
                    $scope.view.corporationOID = data.corporationOID;
                    $scope.view.companyOID = data.companyOID;
                    $scope.view.departmentInfo.departmentOID = data.departmentOID;
                    $scope.view.departmentInfo.departmentName = data.departmentName;
                    $scope.view.userOID = data.userOID;
                    $scope.view.applicantOID = data.userOID;  // 初始化申请人OID为当前用户OID,避免没有代理关系的时候选不到银行卡

                    // 默认申请人
                    var defaultApplicant = AgencyService.getApplicantItem(data);

                    //根据申请人OID，获取默认银行账户
                    $scope.view.getDefaultBankAccount($scope.view.applicantOID);

                    FunctionProfileService.getFunctionProfileList()
                        .then(function (data) {
                            $scope.view.functionProfileList = data;
                            if($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]){
                                var array = $scope.view.departmentInfo.departmentName.split('|');
                                $scope.view.departmentInfo.departmentName = array[array.length -1];
                                $scope.view.getDepartmentDetail($scope.view.departmentInfo.departmentOID);
                            } else {
                                $scope.view.getDepartmentDetail($scope.view.departmentInfo.departmentOID);
                            }
                        });
                    SelfDefineExpenseReport.getCashCategoryList()
                        .success(function (data) {
                            data = data.filter(function (item) {
                                return item.enable === true;
                            });
                            $scope.view.cashCategoryList = data;
                        });
                    if ($scope.view.content === 'create') {
                        SelfDefineExpenseReport.getFormExpenseType($stateParams.formOID, $stateParams.applicationOID)
                            .success(function (data) {
                                $scope.view.typeList = data.expenseTypes;
                            });
                        CompanyConfigurationService.getCompanyConfiguration()
                            .then(function (data) {
                                $scope.view.currencyCode = data.currencyCode;
                                SelfDefineExpenseReport.getCustomForm($stateParams.formOID)
                                    .success(function (data) {
                                        $ionicLoading.hide();
                                        $scope.view.reportData = data;

                                        $scope.view.reportData.custFormValues = [];
                                        var finish = false;
                                        if ($scope.view.reportData.customFormFields && $scope.view.reportData.customFormFields.length > 0) {
                                            for (var i = 0; i < $scope.view.reportData.customFormFields.length; i++) {
                                                if($scope.view.reportData.customFormFields[i].fieldType === 'CUSTOM_ENUMERATION' || $scope.view.reportData.customFormFields[i].messageKey === 'cust_list'){
                                                    $scope.view.reportData.customFormFields[i].value = null;
                                                    if($scope.view.reportData.customFormFields[i].dataSource && JSON.parse($scope.view.reportData.customFormFields[i].dataSource)){
                                                        var json = JSON.parse($scope.view.reportData.customFormFields[i].dataSource);
                                                        $scope.view.reportData.customFormFields[i].customEnumerationOID = json.customEnumerationOID;
                                                    } else {
                                                        $scope.view.reportData.customFormFields[i].customEnumerationOID = null;
                                                    }
                                                    $scope.view.getMessageKeyDetailByCreate(i,$scope.view.reportData.customFormFields[i].customEnumerationOID);
                                                }
                                                var field = $scope.view.reportData.customFormFields[i];

                                                // 开关初始化
                                                if(field.fieldType === 'BOOLEAN'){
                                                    field.value = false;
                                                }

                                                // 申请人
                                                if (field.messageKey === 'applicant') {
                                                    field.applicant = defaultApplicant;
                                                    field.value = null;
                                                }
                                                // 法人实体
                                                else if($scope.view.reportData.customFormFields[i].messageKey === 'select_corporation_entity'){
                                                    $scope.view.reportData.customFormFields[i].entityName = null;
                                                    $scope.view.reportData.customFormFields[i].value = $scope.view.corporationOID;
                                                    $scope.view.getCorporationEntityName(i);
                                                }
                                                else if ($scope.view.reportData.customFormFields[i].messageKey === 'writeoff_flag') {
                                                    // 核销
                                                    $scope.view.reportData.customFormFields[i].value = false;
                                                } else if($scope.view.reportData.customFormFields[i].messageKey === 'currency_code'){
                                                    // 币种
                                                    $scope.view.reportData.customFormFields[i].value = $scope.view.currencyCode;
                                                } else if($scope.view.reportData.customFormFields[i].messageKey === 'select_department'){
                                                    // 部门
                                                    $scope.view.reportData.customFormFields[i].value = $scope.view.departmentInfo.departmentOID;
                                                    $scope.view.reportData.customFormFields[i].departmentName = $scope.view.departmentInfo.departmentName;
                                                    if($scope.view.reportData.customFormFields[i].fieldConstraint && JSON.parse($scope.view.reportData.customFormFields[i].fieldConstraint)){
                                                         var json = JSON.parse($scope.view.reportData.customFormFields[i].fieldConstraint);
                                                        $scope.view.reportData.customFormFields[i].valueReadonly = json.valueReadonly;
                                                    }
                                                } else if($scope.view.reportData.customFormFields[i].messageKey === 'select_cost_center'){
                                                    // 成本中心
                                                    $scope.view.reportData.customFormFields[i].costCenterName = null;
                                                    $scope.view.reportData.customFormFields[i].value = null;
                                                    if($scope.view.reportData.customFormFields[i].dataSource !== null && $scope.view.reportData.customFormFields[i].dataSource !== ""){
                                                        var costCenterIndex = i;
                                                        var json = JSON.parse($scope.view.reportData.customFormFields[costCenterIndex].dataSource);
                                                        $scope.view.reportData.customFormFields[costCenterIndex].costCenterOID = json.costCenterOID;
                                                        //获取成本中心默认值
                                                        $scope.view.getDefaultCostCenter($scope.view.applicantOID, json.costCenterOID, $scope.view.reportData.customFormFields[costCenterIndex]);
                                                        $scope.view.getCostCenterLength(costCenterIndex);
                                                    }
                                                } else if($scope.view.reportData.customFormFields[i].messageKey === 'select_approver'){
                                                    // 审批人
                                                    $scope.view.reportData.customFormFields[i].value = null;
                                                    if($scope.view.reportData.customFormFields[i].fieldConstraint !== null && $scope.view.reportData.customFormFields[i].fieldConstraint !== ""){
                                                        var json = JSON.parse($scope.view.reportData.customFormFields[i].fieldConstraint);
                                                        $scope.view.reportData.customFormFields[i].maxApprovalChain = json.maxApprovalChain;
                                                        $scope.view.reportData.customFormFields[i].approvalSelectedName = null;
                                                    }
                                                } else if ($scope.view.reportData.customFormFields[i].messageKey === 'select_user') {

                                                    if ($scope.view.reportData.customFormFields[i].fieldConstraint && $scope.view.reportData.customFormFields[i].fieldConstraint !== null && $scope.view.reportData.customFormFields[i].fieldConstraint !== "") {
                                                        var json = JSON.parse($scope.view.reportData.customFormFields[i].fieldConstraint);
                                                        if(json.selectMode === 0){
                                                            $scope.view.reportData.customFormFields[i].maxApprovalChain = 1;
                                                        } else {
                                                            $scope.view.reportData.customFormFields[i].maxApprovalChain = -1;
                                                        }
                                                    }
                                                    $scope.view.reportData.customFormFields[i].approvalSelectedName = null;
                                                } else if($scope.view.reportData.customFormFields[i].messageKey === 'linkage_switch'){
                                                    // 联动开关
                                                    $scope.view.reportData.customFormFields[i].value = false;
                                                    if($scope.view.reportData.customFormFields[i].fieldContent && JSON.parse($scope.view.reportData.customFormFields[i].fieldContent)){
                                                        $scope.view.reportData.customFormFields[i].content = JSON.parse($scope.view.reportData.customFormFields[i].fieldContent);
                                                    }
                                                } else if($scope.view.reportData.customFormFields[i].messageKey === 'select_box'){
                                                    //选择框
                                                    $scope.view.reportData.customFormFields[i].selectValue = [];
                                                    $scope.view.reportData.customFormFields[i].value = [];
                                                    $scope.view.reportData.customFormFields[i].selectID = [];
                                                    if($scope.view.reportData.customFormFields[i].fieldContent && JSON.parse($scope.view.reportData.customFormFields[i].fieldContent)){
                                                        $scope.view.reportData.customFormFields[i].content = JSON.parse($scope.view.reportData.customFormFields[i].fieldContent);
                                                    }
                                                    if($scope.view.reportData.customFormFields[i].fieldConstraint && JSON.parse($scope.view.reportData.customFormFields[i].fieldConstraint)){
                                                        var json = JSON.parse($scope.view.reportData.customFormFields[i].fieldConstraint);
                                                        $scope.view.reportData.customFormFields[i].type = json.type;
                                                    }
                                                } else if($scope.view.reportData.customFormFields[i].messageKey === 'contact_bank_account'){
                                                    if($scope.view.defaultBankAccount){
                                                        //银行卡
                                                        $scope.view.reportData.customFormFields[i].bankAccountNo = $scope.view.defaultBankAccount.bankAccountNo;
                                                        $scope.view.reportData.customFormFields[i].promptInfo = $scope.view.defaultBankAccount.bankName;
                                                        $scope.view.reportData.customFormFields[i].value = $scope.view.defaultBankAccount.contactBankAccountOID;
                                                    }else{
                                                        $scope.view.reportData.customFormFields[i].value = null;
                                                    }
                                                } else{
                                                    $scope.view.reportData.customFormFields[i].value = null;
                                                }
                                                $scope.view.reportData.custFormValues.push($scope.view.reportData.customFormFields[i]);
                                                if(i >= $scope.view.reportData.customFormFields.length -1){
                                                    finish = true;
                                                    $scope.view.hasInit = true;
                                                }
                                            }
                                        }
                                        //有对应的申请
                                        if ($stateParams.applicationOID) {
                                            //差旅报销单
                                            if (data.formType === FORM_TYPE.travel) {
                                                $scope.view.currentUrl = '/api/travel/applications/my/get/';
                                            }
                                            //费用报销单
                                            if (data.formType === FORM_TYPE.invoice) {
                                                $scope.view.currentUrl = '/api/expense/applications/';
                                            }
                                            CustomApplicationServices.getApplicationDetail($scope.view.currentUrl, $stateParams.applicationOID)
                                                .then(function (response) {
                                                    $scope.view.applicationData = response.data;
                                                    if(finish){
                                                        $scope.autoFillReport(response.data);
                                                    }
                                                })
                                        }
                                    })
                                    .error(function(error){
                                        $ionicLoading.hide();
                                        if(error.message){
                                            PublicFunction.showToast(error.message);
                                        } else {
                                            PublicFunction.showToast($filter('translate')('expense.error'));
                                        }
                                    });
                            })
                    } else if ($scope.view.content === 'edit') {
                        SelfDefineExpenseReport.getCustomDetail($stateParams.expenseReportOID)
                            .success(function (data) {

                                $ionicLoading.hide();
                                $scope.view.reportData = data;

                                // 保存当前的formOID
                                AgencyService.setFormOID($scope.view.reportData.formOID);
                                // 保存当前的applicationOID
                                AgencyService.setApplicationOID($scope.view.reportData.applicationOID);

                                // custFormValues 处理
                                function dataParse(){
                                    for (var i = 0; i < $scope.view.reportData.custFormValues.length; i++) {
                                        var formValue = $scope.view.reportData.custFormValues[i];

                                        // 开关
                                        if(formValue.fieldType === 'BOOLEAN'){
                                            formValue.value = formValue.value === 'true';
                                        }

                                        // 申请人
                                        if (formValue.messageKey === 'applicant') {
                                            // 获取申请人信息
                                            AgencyService.getUserDetail(formValue.value).then(function(response){
                                                formValue.applicant = AgencyService.getApplicantItem(response.data);
                                            });
                                            // 修改申请人OID
                                            $scope.view.applicantOID = formValue.value;
                                        }
                                        // 核销
                                        else if ($scope.view.reportData.custFormValues[i].messageKey === 'writeoff_flag') {
                                            var indexWrite = i;
                                            if ($scope.view.reportData.custFormValues[indexWrite].value === 'true') {
                                                $scope.view.reportData.custFormValues[indexWrite].value = true;
                                            } else {
                                                $scope.view.reportData.custFormValues[indexWrite].value = false;
                                            }
                                        }
                                        //值列表
                                        else if($scope.view.reportData.custFormValues[i].fieldType === 'CUSTOM_ENUMERATION' || $scope.view.reportData.custFormValues[i].messageKey === 'cust_list'){
                                            if($scope.view.reportData.custFormValues[i].dataSource && JSON.parse($scope.view.reportData.custFormValues[i].dataSource)){
                                                var json = JSON.parse($scope.view.reportData.custFormValues[i].dataSource);
                                                $scope.view.reportData.custFormValues[i].customEnumerationOID = json.customEnumerationOID;
                                            } else {
                                                $scope.view.reportData.custFormValues[i].customEnumerationOID = null;
                                            }
                                            if($scope.view.reportData.custFormValues[i].value){
                                                //$scope.view.getValueName(i);
                                                $scope.view.getMessageKeyDetail(i,$scope.view.reportData.custFormValues[i].customEnumerationOID,$scope.view.reportData.custFormValues[i].value);
                                            }else{
                                                //值列表修改状态下，当值列表状态由禁用变成启用时，该值列表没有value
                                                $scope.view.getMessageKeyDetailByCreate(i,$scope.view.reportData.custFormValues[i].customEnumerationOID);
                                            }
                                        }
                                        //成本中心项目名字获取
                                        else if($scope.view.reportData.custFormValues[i].messageKey === 'select_cost_center'){
                                            $scope.view.getCostCenterName(i);
                                        }
                                        //部门名称获取
                                        else if($scope.view.reportData.custFormValues[i].messageKey === 'select_department'){
                                            $scope.view.getDepartmentName(i);
                                            if($scope.view.reportData.custFormValues[i].fieldConstraint && JSON.parse($scope.view.reportData.custFormValues[i].fieldConstraint)){
                                                var json = JSON.parse($scope.view.reportData.custFormValues[i].fieldConstraint);
                                                $scope.view.reportData.custFormValues[i].valueReadonly = json.valueReadonly;
                                            }
                                        }
                                        // 审批人
                                        else if($scope.view.reportData.custFormValues[i].messageKey === 'select_approver'){
                                            if($scope.view.reportData.custFormValues[i].fieldConstraint !== null && $scope.view.reportData.custFormValues[i].fieldConstraint !== ""){
                                                var json = JSON.parse($scope.view.reportData.custFormValues[i].fieldConstraint);
                                                $scope.view.reportData.custFormValues[i].maxApprovalChain = json.maxApprovalChain;
                                            }
                                            $scope.view.getSelectedApproval(i);
                                        }
                                        else if ($scope.view.reportData.custFormValues[i].messageKey === 'select_user') {
                                            if ($scope.view.reportData.custFormValues[i].fieldConstraint && $scope.view.reportData.custFormValues[i].fieldConstraint !== null && $scope.view.reportData.custFormValues[i].fieldConstraint !== "") {
                                                var json = JSON.parse($scope.view.reportData.custFormValues[i].fieldConstraint);
                                                if(json.selectMode == 0 || json.selectMode == '0'){
                                                    $scope.view.reportData.custFormValues[i].maxApprovalChain = 1;
                                                } else {
                                                    $scope.view.reportData.custFormValues[i].maxApprovalChain = -1;
                                                }
                                            }
                                            $scope.view.getSelectedApproval(i);
                                        }
                                        else if($scope.view.reportData.custFormValues[i].messageKey === 'select_corporation_entity'){
                                            $scope.view.corporationOID = $scope.view.reportData.custFormValues[i].value;
                                            $scope.view.getCorporationEntityName(i);
                                        }
                                        //联动开关
                                        else if($scope.view.reportData.custFormValues[i].messageKey === 'linkage_switch'){
                                            if($scope.view.reportData.custFormValues[i].value === 'true'){
                                                $scope.view.reportData.custFormValues[i].value = true;
                                            } else {
                                                $scope.view.reportData.custFormValues[i].value = false;
                                            }
                                            if($scope.view.reportData.custFormValues[i].fieldContent && JSON.parse($scope.view.reportData.custFormValues[i].fieldContent)){
                                                $scope.view.reportData.custFormValues[i].content = JSON.parse($scope.view.reportData.custFormValues[i].fieldContent);
                                            } else {
                                                $scope.view.reportData.custFormValues[i].content = [];
                                            }
                                        }
                                        else if($scope.view.reportData.custFormValues[i].messageKey === 'contact_bank_account'){
                                            //银行卡
                                            $scope.view.reportData.custFormValues[i].bankAccountNo = null;
                                            $scope.view.getContactBankAccountName(i);
                                        }
                                        else if($scope.view.reportData.custFormValues[i].messageKey === 'select_box'){
                                            //选择框
                                            $scope.view.reportData.custFormValues[i].selectValue = JSON.parse($scope.view.reportData.custFormValues[i].value);
                                            $scope.view.getSelectBoxId(i);
                                            // $scope.view.getSelectBoxValue(i);
                                            if($scope.view.reportData.custFormValues[i].fieldContent && JSON.parse($scope.view.reportData.custFormValues[i].fieldContent)){
                                                $scope.view.reportData.custFormValues[i].content = JSON.parse($scope.view.reportData.custFormValues[i].fieldContent);
                                            }
                                            if($scope.view.reportData.custFormValues[i].fieldConstraint && JSON.parse($scope.view.reportData.custFormValues[i].fieldConstraint)){
                                                var json = JSON.parse($scope.view.reportData.custFormValues[i].fieldConstraint);
                                                $scope.view.reportData.custFormValues[i].type = json.type;
                                            }
                                        }
                                        if(i >= $scope.view.reportData.custFormValues.length -1){
                                            $scope.view.hasInit = true;
                                        }
                                    }
                                }

                                if ($scope.view.reportData.custFormValues && $scope.view.reportData.custFormValues.length > 0) {
                                    // 判断是否有申请人字段并且申请人是否为当前用户
                                    var custFormValues = $scope.view.reportData.custFormValues;
                                    var index = AgencyService.getDetailFromFormValuesByKey('applicant', custFormValues);
                                    // 如果没有申请人字段或者申请人为当前用户,直接解析数据,否则,获取申请人的function profile,再处理
                                    if (!index || custFormValues[index].value===$scope.view.userOID){
                                        dataParse();
                                    } else {
                                        FunctionProfileService.getUserFunctionProfile(custFormValues[index].value).then(function(response){
                                            $scope.view.functionProfileList = response.data;
                                            dataParse();
                                        })
                                    }
                                }
                                if ($scope.view.reportData.currencyCode) {
                                    $scope.view.currencyCode = $scope.view.reportData.currencyCode;
                                    $scope.view.code = CurrencyCodeService.getCurrencySymbol($scope.view.reportData.currencyCode);
                                }
                                SelfDefineExpenseReport.getFormExpenseType(data.formOID, data.applicationOID)
                                    .success(function (data) {
                                        $scope.view.typeList = data.expenseTypes;
                                    })
                            })
                            .error(function(error){
                                $ionicLoading.hide();
                                if(error.message){
                                    PublicFunction.showToast(error.message);
                                } else {
                                    PublicFunction.showToast($filter('translate')('expense.error'));
                                }
                            });
                    }
                })
            };
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
            $scope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    // 清空申请人OID,单据OID,报销单关联的申请单OID
                    AgencyService.clearAll();

                    $rootScope.expenseReportApplicantChanged = false;  // 释放变量
                });
            // 监听申请人的变化,进行相应关联处理
            $rootScope.$watch('expenseReportApplicantChanged', function (newValue, oldValue) {
                if (newValue) {
                    // 延时100ms,让选人控件先执行完
                    $timeout(function(){
                        var custFormValues = $scope.view.reportData.custFormValues;
                        // 获取申请人字段
                        var index = AgencyService.getDetailFromFormValuesByKey('applicant', custFormValues);
                        if (index!==null){
                            $scope.agency.applicantChange(custFormValues[index].applicant);
                        }
                    }, 100);
                }
            });
            init();
        }]);
