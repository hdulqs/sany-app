/**
 * Created by Yuko on 16/10/26.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.custom_application_create', {
                url: '/custom/application/create?formOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/custom.application.base.tpl.html',
                        controller: 'com.handchina.huilianyi.CustomApplicationBaseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'create';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.custom_application_edit', {
                url: '/custom/application/edit?applicationOID?formType',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/custom.application.base.tpl.html',
                        controller: 'com.handchina.huilianyi.CustomApplicationBaseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'edit';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('custom_application');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })

    }])
    .controller('com.handchina.huilianyi.CustomApplicationBaseController', ['$scope', '$state', '$ionicModal', '$cordovaDatePicker', 'PublicFunction',
        'Principal', 'CompanyConfigurationService', 'CustomApplicationServices', '$stateParams', '$ionicLoading', 'SelfDefineExpenseReport', 'content', '$q', '$ionicHistory', '$timeout',
        'CostCenterService', 'TravelERVService', 'InvoiceApplyERVService', 'FunctionProfileService', 'ExpenseService', 'CurrencyCodeService', '$ionicPopup', '$interval', 'DepartmentService',
        'localStorageService', 'ManagerPrompt', 'CustomValueService', '$filter', 'LANG', 'CorporationEntityService', 'LocationService', 'CompanyService', 'AgencyService', '$rootScope',
        '$sessionStorage', '$ionicPopover',
        function ($scope, $state, $ionicModal, $cordovaDatePicker, PublicFunction, Principal, CompanyConfigurationService, CustomApplicationServices, $stateParams,
                  $ionicLoading, SelfDefineExpenseReport, content, $q, $ionicHistory, $timeout, CostCenterService, TravelERVService, InvoiceApplyERVService,
                  FunctionProfileService, ExpenseService, CurrencyCodeService, $ionicPopup, $interval, DepartmentService, localStorageService, ManagerPrompt, CustomValueService,
                  $filter, LANG, CorporationEntityService, LocationService, CompanyService, AgencyService, $rootScope,$sessionStorage, $ionicPopover) {
            $scope.view = {
                applicantIndex: -1, //申请人下标
                hasInit: false, //是否已初始化完毕
                defaultBankAccount: null,   //默认银行账户
                invoiceIndex: -1,//预算明细下标
                disableSubmit: false,
                hasGetItinerary: false, //是否有获取行程
                hasItinerary: false, //是否有行程
                //汇率是否可以修改
                rateCanChangeAble:true,
                participantIndex: -1, //参与人index
                participantHolder: '搜索姓名或者工号', //选择参与人的提示文本
                hasOuterMember: false, //是否有外部参与人
                hasInter: false, //是否有内部参与人
                hasOuter: false, //是否有外部参与人数量
                hasAllowance: false,
                errorUserOID: [], //不符合数据权限的参与人oid
                errorUserName: null,  //不符合数据权限的参与人名字字符串
                authorityData: {
                    formOID: null, //表单OID
                    participantsOID: [],//参与人OID
                    departmentOID: null,//部门OID
                    proposerOID: null,//申请人OID
                    costCentreOID: [] //成本中心OID
                }, //数据权限字段
                adminList: [], //管理员列表
                interMemberList: [], //内部参与人
                outerMemberList: [], //外部参与人
                outParticipantNum: null, //外部参与人数量
                rightNavList: [], //右上角更多操作列表
                hasStartEndDate: 0,
                userOID: null,
                applicantOID: null,  // 申请人OID,选银行卡号时会用到
                corporationOID: null, //法人实体
                currentUrl: null, //请求详情的url
                hasChangeDate: false, //出差时间是否有变
                departmentOID: null, //部门oid
                oldStartDate: null,
                oldEndDate: null,
                startDate: null,
                endDate: null,
                timeDate: null,
                content: content,
                readonly: false,
                trafficType: 1002,
                totalAmount: 0, //总金额
                currencyCode: 'CNY',
                departmentInfo: {},
                companyOID: null,//公司OID
                applicationParticipants: [],//乘机人
                maxLengthParticipants: -1, //乘机人数量
                maxLengthBookingPerson: 1, //订票专员数量
                travelItinerarys: [], //差旅行程
                bookingPerson: null,
                applicationData: {},
                custFormValuesCopy: {},
                expenseTypeList: null,
                disabled: false,
                currentLocation: null, //位置信息
                isReadOnly: false,
                attachments: [],
                deleteAttachment: [],
                maxLength: 0,   //附件最大长度
                uploadFinish: true,
                allItineraryList: [], //所有的行程
                rightNav: function (id) {  //右上角
                    $scope.popover.hide();
                    if(id == 'delete'){
                        var confirmPopup = $ionicPopup.confirm({
                            scope: $scope,
                            template: '<p style="text-align: center">'+ $filter('translate')('custom.application.tip.delete_application') + '</p>', //是否删除该申请单
                            cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                            cancelType: 'button-calm',
                            okText: $filter('translate')('custom.application.button.sure_delete'),  //确认删除
                            cssClass: 'stop-time-popup'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                $scope.view.deleteApplication();
                            }
                        })
                    } else if(id == 'save'){
                        var confirmPopup = $ionicPopup.confirm({
                            scope: $scope,
                            template: '<p style="text-align: center">'+ $filter('translate')('custom.application.tip.save_application') + '</p>', //是否保存该申请单
                            cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                            cancelType: 'button-calm',
                            okText: $filter('translate')('custom.application.button.sure_save'),  //确认保存
                            cssClass: 'stop-time-popup'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                $scope.view.saveApplication('save');
                            }
                        })
                    }
                },
                goBackTip: function () {
                    if(!$scope.view.disabled){
                        $scope.view.disabled = true;
                        if (($('.row').has('input').length > 0 || $('.row').has('textarea').length > 0) &&  ($('.row input').hasClass('ng-dirty') || $('.row textarea').hasClass('ng-dirty'))) {
                            var confirmPopup = $ionicPopup.confirm({
                                scope: $scope,
                                template: '<p style="text-align: center">'+ $filter('translate')('custom.application.tip.save_application') + '</p>', //是否保存该申请单
                                cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                cancelType: 'button-calm',
                                okText: $filter('translate')('custom.application.button.sure_save'),  //确认保存
                                cssClass: 'stop-time-popup'
                            });
                            confirmPopup.then(function (res) {
                                if (res) {
                                    $scope.view.disabled = false;
                                    if($scope.view.applicationData.formType == 2001){
                                        $scope.view.saveApplication('next', 'back');
                                    } else {
                                        $scope.view.saveApplication('save');
                                    }
                                } else {
                                    $scope.view.disabled = false;
                                    $scope.view.goBack();
                                }
                            })
                        } else {
                            $scope.view.isDirtyForm()
                                .then(function () {
                                    $scope.view.disabled = false;
                                    var confirmPopup = $ionicPopup.confirm({
                                        scope: $scope,
                                        template: '<p style="text-align: center">'+ $filter('translate')('custom.application.tip.save_application') + '</p>', //是否保存该申请单
                                        cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                        cancelType: 'button-calm',
                                        okText: $filter('translate')('custom.application.button.sure_save'),  //确认保存
                                        cssClass: 'stop-time-popup'
                                    });
                                    confirmPopup.then(function (res) {
                                        if (res) {
                                            $scope.view.disabled = false;
                                            if($scope.view.applicationData.formType == 2001){
                                                $scope.view.saveApplication('next', 'back');
                                            } else {
                                                $scope.view.saveApplication('save');
                                            }
                                        } else {
                                            $scope.view.disabled = false;
                                            $scope.view.goBack();
                                        }
                                    })
                                }, function () {
                                    $scope.view.disabled = false;
                                    $scope.view.goBack();
                                })
                        }
                    }
                },
                //表单是否有修改
                isDirtyForm: function(){
                    var defer = $q.defer();
                    var hasFinish = false;
                    if($scope.view.applicationData.custFormValues && $scope.view.applicationData.custFormValues.length > 0){
                        for(var i = 0; i < $scope.view.applicationData.custFormValues.length; i++){
                            if($scope.view.applicationData.custFormValues[i].messageKey == 'select_participant'){
                                var interMemberCopy = JSON.parse($scope.view.applicationData.custFormValues[i].value);
                                if(($scope.view.interMemberList && $scope.view.interMemberList.length && interMemberCopy && interMemberCopy.length && $scope.view.interMemberList.length != interMemberCopy.length) || (!interMemberCopy && $scope.view.interMemberList)){
                                    defer.resolve(true);
                                    return defer.promise;
                                } else {
                                    for(var j = 0; j < $scope.view.interMemberList.length; j++){
                                        if($scope.view.interMemberList[j].userOID != interMemberCopy[j].userOID){
                                            defer.resolve(true);
                                            return defer.promise;
                                        }
                                    }
                                }
                            } else if($scope.view.applicationData.custFormValues[i].messageKey == 'budget_detail'){
                                if($scope.view.applicationData.custFormValues[i].amount != $scope.view.custFormValuesCopy[i].amount
                                    || $scope.view.applicationData.custFormValues[i].invoiceList.length != $scope.view.custFormValuesCopy[i].invoiceList.length){
                                    defer.resolve(true);
                                    return defer.promise;
                                } else {
                                    for(var j = 0; j < $scope.view.applicationData.custFormValues[i].invoiceList.length; j++){
                                        if($scope.view.applicationData.custFormValues[i].invoiceList[j].amount != $scope.view.custFormValuesCopy[i].invoiceList[j].amount
                                            || $scope.view.applicationData.custFormValues[i].invoiceList[j].expenseTypeOID != $scope.view.custFormValuesCopy[i].invoiceList[j].expenseTypeOID){
                                            defer.resolve(true);
                                            return defer.promise;
                                        }
                                    }
                                }
                            } else if($scope.view.applicationData.custFormValues[i].messageKey == 'startDate' || $scope.view.applicationData.custFormValues[i].messageKey == 'endDate' || $scope.view.applicationData.custFormValues[i].messageKey == 'Date'){
                                if(new Date($scope.view.applicationData.custFormValues[i].value).Format('yyyy-MM-dd') != new Date($scope.view.custFormValuesCopy[i].value).Format('yyyy-MM-dd')){
                                    defer.resolve(true);
                                    return defer.promise;
                                }
                            } else {
                                if($scope.view.applicationData.custFormValues[i].value != $scope.view.custFormValuesCopy[i].value){
                                    defer.resolve(true);
                                    return defer.promise;
                                }
                            }
                            if(i >= ($scope.view.applicationData.custFormValues.length -1)){
                                hasFinish = true;
                            }
                        }
                    } else {
                        defer.reject(false);
                        return defer.promise;
                    }
                    if(hasFinish){
                        defer.reject(false);
                        return defer.promise;
                    }
                },
                //获取所有的差旅行程
                getAllItineraryDetail: function () {
                    CustomApplicationServices.getAllItinerary($stateParams.applicationOID)
                        .success(function (data) {
                            $scope.view.allItineraryList = data;
                            if ((data['FLIGHT'] && data['FLIGHT'].length && data['FLIGHT'].length > 0) || (data['TRAIN'] && data['TRAIN'].length && data['TRAIN'].length > 0) || (data['HOTEL'] && data['HOTEL'].length && data['HOTEL'].length > 0)
                            || (data['OTHER'] && data['OTHER'].length && data['OTHER'].length > 0) || (data['REMARK'] && data['REMARK'].length && data['REMARK'].length > 0)) {
                                $scope.view.hasItinerary = true;
                            } else {
                                $scope.view.hasItinerary = false;
                            }
                        })
                        .error(function () {
                            $scope.view.hasItinerary = false;
                        })
                },
                //获取已选中的成本中心oid
                getSelectCostCenter: function (fieldOID) {
                    $timeout(function () {
                        for(var i = 0; i < $scope.view.authorityData.costCentreOID.length; i++){
                            if($scope.view.authorityData.costCentreOID[i].fieldOID == fieldOID){
                                var index = i;
                                for(var j = 0; j < $scope.view.applicationData.custFormValues.length; j++){
                                    if($scope.view.applicationData.custFormValues[j].fieldOID == fieldOID){
                                        $scope.view.authorityData.costCentreOID[index].name = $scope.view.applicationData.custFormValues[j].value;
                                    }
                                }
                            }
                        }
                    }, 500)
                },
                deleteApplication: function () {  //删除申请单
                    PublicFunction.showLoading();
                    if($stateParams.applicationOID){
                        CustomApplicationServices.deleteApplicationForAll($stateParams.applicationOID)
                            .success(function () {
                                $ionicLoading.hide();
                                PublicFunction.showToast($filter('translate')('status.deleted'));
                                $timeout(function () {
                                    $scope.view.goBack();
                                }, 500);
                            })
                            .error(function () {
                                $ionicLoading.hide();
                                PublicFunction.showToast($filter('translate')('status.error'));
                            })

                    } else {
                        $timeout(function () {
                            $scope.view.goBack();
                        }, 500);
                    }
                },
                isBaseMessageKey: function (field) {
                    if(field.messageKey === 'applicant' || field.messageKey === 'writeoff_flag' || field.messageKey === 'total_budget' || field.messageKey === 'title' || field.messageKey === 'start_date' || field.messageKey === 'remark' || field.messageKey === 'text_area' ||
                        field.messageKey === 'select_participant' || field.messageKey === 'end_date' || field.messageKey === 'currency_code' || field.messageKey === 'budget_detail' || field.messageKey === 'average_budget' ||
                        field.messageKey === 'select_cost_center' || field.messageKey === 'select_department' || field.messageKey === 'destination' || field.messageKey === 'out_participant_num' ||
                        field.messageKey === 'select_special_booking_person' || field.messageKey === 'select_approver' || field.messageKey === 'image' || field.messageKey === 'select_air_ticket_supplier' ||
                        field.messageKey === 'select_corporation_entity' || field.messageKey === 'linkage_switch' || field.messageKey === 'cust_list' || field.messageKey === 'select_user' || field.messageKey === 'select_box' || field.messageKey === 'attachment' ||
                        field.messageKey === 'contact_bank_account' || field.messageKey === 'date' ||
                        field.messageKey === 'time' || field.messageKey === 'out_participant_name' || field.messageKey === 'number'){
                        return true;
                    } else {
                        return false;
                    }
                },
                validateMoney: function (num) {
                    var pattMoney = /^(\d+(\.\d{0,2})?)$/g;
                    if (pattMoney.test(num)) {
                        return true;
                    } else {
                        return false;
                    }
                },
                validate: function () {
                    if ($scope.view.hasChangeDate ) {
                        if($scope.view.applicationData.customFormProperties &&
                            $scope.view.applicationData.customFormProperties.manageType && $scope.view.applicationData.customFormProperties.manageType != ''
                        && $scope.view.applicationData.customFormProperties.manageType != null){

                        } else {
                            $scope.view.changeItinerary();
                        }
                    }
                    var deferred = $q.defer();
                    var i = 0;
                    while(i < $scope.view.applicationData.custFormValues.length){
                        var formValue = $scope.view.applicationData.custFormValues[i];
                        // 申请人
                        if (formValue.messageKey === 'applicant') {
                            formValue.value = formValue.applicant.userOID;
                        }
                        //联动开关
                        if($scope.view.applicationData.custFormValues[i].messageKey === 'linkage_switch'){
                            if($scope.view.applicationData.custFormValues[i].value){
                                var j = 0;
                                while(j < $scope.view.applicationData.custFormValues[i].content.length){
                                    if($scope.view.applicationData.custFormValues[i].content[j].required && ($scope.view.applicationData.custFormValues[i].content[j].value === null || $scope.view.applicationData.custFormValues[i].content[j].value === '')){
                                        PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].content[j].fieldName);
                                        deferred.reject(false);
                                        return deferred.promise;
                                        break;
                                    } else if($scope.view.applicationData.custFormValues[i].content[j].fieldType === 'LONG' && $scope.view.applicationData.custFormValues[i].content[j].value !== parseInt($scope.view.applicationData.custFormValues[i].content[j].value)){
                                        PublicFunction.showToast($filter('translate')('form.please.input.legal') + $scope.view.applicationData.custFormValues[i].content[j].fieldName);
                                        deferred.reject(false);
                                        return deferred.promise;
                                        break;
                                    } else {
                                        j++;
                                    }
                                }
                                if(j === $scope.view.applicationData.custFormValues[i].content.length){
                                    $scope.view.applicationData.custFormValues[i].fieldContent = JSON.stringify($scope.view.applicationData.custFormValues[i].content);
                                    i++;
                                }
                            } else {
                                $scope.view.applicationData.custFormValues[i].fieldContent = JSON.stringify($scope.view.applicationData.custFormValues[i].content);
                                i++;
                            }
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'start_date') {
                            $scope.view.applicationData.custFormValues[i].value = $scope.view.startDate;
                            i++;
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'end_date') {
                            $scope.view.applicationData.custFormValues[i].value = $scope.view.endDate;
                            i++;
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'date') {
                            var date = new Date().Format('yyyy-MM-dd');
                            var choiceDate = $scope.view.timeDate ? new Date($scope.view.timeDate).Format('yyyy-MM-dd') : null;
                            if(!choiceDate){
                                PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                deferred.reject(false);
                                return deferred.promise;
                            }else if(choiceDate && (choiceDate < date)){
                                PublicFunction.showToast($filter('translate')('custom.application.travel.RepaymentDate'));//还款日期要大于当前日期
                                deferred.reject(false);
                                return deferred.promise;
                            }else{
                                $scope.view.applicationData.custFormValues[i].value = $scope.view.timeDate;
                            }
                            i++;
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'title') {
                            if ($scope.view.applicationData.custFormValues[i].required) {
                                if ($scope.view.applicationData.custFormValues[i].value === null || $scope.view.applicationData.custFormValues[i].value === '') {
                                    PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    deferred.reject(false);
                                    return deferred.promise;
                                } else if ($scope.view.applicationData.custFormValues[i].value.length > 50) {
                                    PublicFunction.showToast($scope.view.applicationData.custFormValues[i].fieldName + '，' + $filter('translate')('form.max.length.50'));
                                    deferred.reject(false);
                                    return deferred.promise;
                                }
                            }
                            i++;
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_cost_center') {
                            if($scope.view.applicationData.custFormValues[i].required){
                                if ($scope.view.applicationData.custFormValues[i].costCenterLength == 0) {
                                    PublicFunction.showToast($scope.view.applicationData.custFormValues[i].fieldName + $filter('translate')('error.deploy'));
                                    deferred.reject(false);
                                    return deferred.promise;
                                } else if (($scope.view.applicationData.custFormValues[i].value === null || $scope.view.applicationData.custFormValues[i].value === '')) {
                                    PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    deferred.reject(false);
                                    return deferred.promise;
                                }
                            }
                            i++;
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_participant') {
                            if ($scope.view.interMemberList !== null && $scope.view.interMemberList !== '' && $scope.view.interMemberList.length > 0) {
                                $scope.view.applicationData.custFormValues[i].value = JSON.stringify($scope.view.interMemberList);
                            } else if ($scope.view.applicationData.custFormValues[i].required) {
                                PublicFunction.showToast($filter('translate')('form.please.select') + $scope.view.applicationData.custFormValues[i].fieldName);
                                deferred.reject(false);
                                return deferred.promise;
                            } else {
                                $scope.view.applicationData.custFormValues[i].value = null;
                            }
                            i++;
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_air_ticket_supplier') {
                            if ($scope.view.applicationData.custFormValues[i].selectedSupplier !== null && $scope.view.applicationData.custFormValues[i].selectedSupplier !== '') {
                                $scope.view.applicationData.custFormValues[i].value = $scope.view.applicationData.custFormValues[i].selectedSupplier.supplierOID;
                            } else if ($scope.view.applicationData.custFormValues[i].required) {
                                PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                deferred.reject(false);
                                return deferred.promise;
                            }
                            i++;
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'out_participant_num') {
                            if($scope.view.outParticipantNum != null && $scope.view.outParticipantNum != '' && $scope.view.outParticipantNum != undefined){
                                if(Math.floor($scope.view.outParticipantNum) == $scope.view.outParticipantNum){
                                    if($scope.view.outParticipantNum > 9999){
                                        PublicFunction.showToast($filter('translate')('custom.application.tip.max') + $scope.view.applicationData.custFormValues[i].fieldName + $filter('translate')('custom.application.tip.more_than_thousand')); //最大  不能大于9999
                                        deferred.reject(false);
                                        return deferred.promise;
                                    } else {
                                        $scope.view.applicationData.custFormValues[i].value = $scope.view.outParticipantNum;
                                        i++;
                                    }
                                } else {
                                    PublicFunction.showToast($filter('translate')('form.please.input.legal') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    deferred.reject(false);
                                    return deferred.promise;
                                }
                            } else {
                                if($scope.view.applicationData.custFormValues[i].required){
                                    PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    deferred.reject(false);
                                    return deferred.promise;
                                } else {
                                    $scope.view.applicationData.custFormValues[i].value = $scope.view.outParticipantNum;
                                    i++;
                                }
                            }
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'number') {
                            if($scope.view.applicationData.custFormValues[i].value != null && $scope.view.applicationData.custFormValues[i].value != undefined){
                                if(Math.floor($scope.view.applicationData.custFormValues[i].value) == $scope.view.applicationData.custFormValues[i].value){
                                    i++;
                                } else {
                                    PublicFunction.showToast($filter('translate')('form.please.input.legal') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    deferred.reject(false);
                                    return deferred.promise;
                                }
                            } else {
                                if($scope.view.applicationData.custFormValues[i].required){
                                    PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    deferred.reject(false);
                                    return deferred.promise;
                                } else {
                                    i++;
                                }
                            }
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'out_participant_name') {
                            if ($scope.view.outerMemberList.length > 0) {
                                $scope.view.applicationData.custFormValues[i].value = JSON.parse($scope.view.outerMemberList);
                            }
                            i++;
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_department') {
                            if ($scope.view.applicationData.custFormValues[i].value) {
                                if($scope.view.departmentInfo.status == 102){
                                    PublicFunction.showToast($filter('translate')('custom.application.diable.department'));
                                    deferred.reject(false);
                                    return deferred.promise;
                                }
                                $scope.view.departmentOID = $scope.view.applicationData.custFormValues[i].value;
                            }
                            i++;
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'total_budget' || $scope.view.applicationData.custFormValues[i].messageKey === 'average_budget') {
                            if($scope.view.applicationData.custFormValues[i].required && ($scope.view.applicationData.custFormValues[i].value === null || $scope.view.applicationData.custFormValues[i].value === '')){
                                PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                deferred.reject(false);
                                return deferred.promise;
                            } else if($scope.view.applicationData.custFormValues[i].value) {
                                if ($scope.view.applicationData.custFormValues[i].value < 0 || !$scope.view.validateMoney($scope.view.applicationData.custFormValues[i].value)) {
                                    PublicFunction.showToast($filter('translate')('form.please.input.legal') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    deferred.reject(false);
                                    return deferred.promise;
                                }
                            }
                            i++;
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'budget_detail') {
                            if ($scope.view.applicationData.custFormValues[i].required && $scope.view.applicationData.custFormValues[i].invoiceList.length === 0) {
                                PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                deferred.reject(false);
                                return deferred.promise;
                            } else {
                                var data = {};
                                data.budgetDetail = $scope.view.applicationData.custFormValues[i].invoiceList;
                                data.amount = $scope.view.applicationData.custFormValues[i].amount;
                                $scope.view.applicationData.custFormValues[i].value = JSON.stringify(data);
                                i++;
                            }
                        } else if($scope.view.applicationData.custFormValues[i].messageKey === 'select_box'){
                            //选择框
                            if($scope.view.applicationData.custFormValues[i].required && $scope.view.applicationData.custFormValues[i].selectValue.length === 0){
                                PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                deferred.reject(false);
                                return deferred.promise;
                            } else{
                                $scope.view.applicationData.custFormValues[i].value  = angular.toJson($scope.view.applicationData.custFormValues[i].selectValue);
                                i++;
                            }
                        } else if($scope.view.applicationData.custFormValues[i].messageKey === 'attachment'){

                            // action1: 验证附件信息
                            if($scope.view.applicationData.custFormValues[i].required && $scope.view.attachments.length === 0){
                                PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                deferred.reject(false);
                                return deferred.promise;
                            }
                            // 组装附件信息
                            var attachmentOIDS = [];
                            angular.forEach($scope.view.attachments, function (attachment) {
                                if(attachment.attachmentOID !== -1){
                                    attachmentOIDS.push({'attachmentOID': attachment.attachmentOID});
                                }
                            });
                            $scope.view.applicationData.custFormValues[i].value = JSON.stringify(attachmentOIDS);
                            i++;
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_approver') {
                            if (!$scope.view.applicationData.custFormValues[i].value && $scope.view.applicationData.custFormValues[i].required) {
                                PublicFunction.showToast($filter('translate')('form.please.select') + $scope.view.applicationData.custFormValues[i].fieldName);
                                deferred.reject(false);
                                return deferred.promise;
                            } else {
                                i++;
                            }
                        } else if ($scope.view.applicationData.custFormValues[i].required && ($scope.view.applicationData.custFormValues[i].value === null || $scope.view.applicationData.custFormValues[i].value === '')) {
                            PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                            deferred.reject(false);
                            return deferred.promise;
                        } else {
                            i++;
                        }
                    }
                    if (i === $scope.view.applicationData.custFormValues.length) {
                        deferred.resolve(true);
                        return deferred.promise;
                    }
                },
                checkInterMember: function (index) {
                    if($scope.view.interMemberList.length > 0){
                        var finish = false;
                        var userList = [];
                        for(var i = 0; i < $scope.view.interMemberList.length; i++){
                            userList.push($scope.view.interMemberList[i].userOID);
                            if(i >= $scope.view.interMemberList.length -1){
                                finish = true;
                            }
                        }
                        if(finish){
                            $scope.view.authorityData.participantsOID = angular.copy(userList);
                            CustomApplicationServices.getUserInForm($scope.view.authorityData)
                                .success(function (data) {
                                    $scope.view.errorUserOID = [];
                                    $scope.view.errorUserName = '';
                                    var j = 0;
                                    for(; j < data.length; j++){
                                        if(data[j].errorDetail != null && data[j].errorDetail != ''){
                                            if($scope.view.errorUserOID.length == 0){
                                                $scope.view.errorUserOID.push(data[j].userOID);
                                                $scope.view.errorUserName += data[j].fullName;
                                            } else {
                                                $scope.view.errorUserOID.push(data[j].userOID);
                                                $scope.view.errorUserName += '、' + data[j].fullName;
                                            }
                                        }
                                    }
                                    if(j == data.length){
                                        if($scope.view.errorUserOID.length > 0){
                                            $ionicLoading.hide();
                                            var confirmPopup = $ionicPopup.confirm({
                                                scope: $scope,
                                                title: $filter('translate')('custom.application.tip.applicant'),  //参与人员提示
                                                template: '<p style="text-align: center">' + $scope.view.errorUserName + $filter("translate")("custom.application.tip.error_applicant_mssage") + '</p>' +  //不在可选参与人范围内，是否删除以上人员  delete_all_allowance
                                                '<span ng-if="view.applicationData.travelApplication && view.applicationData.travelApplication.travelSubsidies && view.applicationData.travelApplication.travelSubsidies.length > 0"> *' + $filter("translate")("custom.application.tip.delete_all_allowance") + '</span>',
                                                cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                cancelType: 'button-calm',
                                                okText: $filter('translate')('custom.application.button.sure_delete'),  //确认删除
                                                cssClass: 'stop-time-popup'
                                            });
                                            confirmPopup.then(function (res) {
                                                if (res) {
                                                    PublicFunction.showLoading();
                                                    var i =0;
                                                    var interMemberListCopy = [];
                                                    for(; i < $scope.view.interMemberList.length; i++){
                                                        if($scope.view.errorUserOID.indexOf($scope.view.interMemberList[i].userOID) == -1){
                                                            interMemberListCopy.push($scope.view.interMemberList[i]);
                                                        }
                                                    }
                                                    if(i == $scope.view.interMemberList.length){
                                                        $scope.view.interMemberList = angular.copy(interMemberListCopy);
                                                        if ($scope.view.interMemberList.length > 0) {
                                                            $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = JSON.stringify($scope.view.interMemberList);
                                                            return false;
                                                        }  else {
                                                            $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = null;
                                                            return true;
                                                        }
                                                    }
                                                } else {
                                                    return true;
                                                }
                                            })
                                        }
                                        else {
                                            $scope.view.applicationData.custFormValues[index].value = JSON.stringify($scope.view.interMemberList);
                                            return false;
                                        }
                                    }
                                })
                                .error(function (error) {
                                    $scope.view.disabled = false;
                                    $ionicLoading.hide();

                                    if(error && error.validationErrors && error.validationErrors.length > 0 && error.validationErrors[0].externalPropertyName){
                                        // 2010: 申请人为空  2011:部门为空  2012：成本中心为空
                                        if(error.validationErrors[0].externalPropertyName == '2012'){
                                            PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_costCenter')); //请先选择成本中心
                                        } else if(error.validationErrors[0].externalPropertyName == '2010'){
                                            PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_applicant')); //请先选择申请人
                                        } else if(error.validationErrors[0].externalPropertyName == '2011'){
                                            PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_department')); //请先选择部门
                                        }
                                    } else {
                                        PublicFunction.showToast($filter('translate')('custom.application.tip.check_appliant_error')); //校验参与人数据权限出错
                                    }

                                })
                        }
                    }
                },
                saveValidate: function (string) {
                    var defer = $q.defer();
                    var i = 0;
                    for (; i < $scope.view.applicationData.custFormValues.length; i++) {
                        var formValue = $scope.view.applicationData.custFormValues[i];
                        // 申请人
                        if (formValue.messageKey === 'applicant') {
                            formValue.value = formValue.applicant.userOID;
                        }
                        //联动开关
                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'linkage_switch') {
                            $scope.view.applicationData.custFormValues[i].fieldContent = JSON.stringify($scope.view.applicationData.custFormValues[i].content);
                        }
                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'start_date') {
                            $scope.view.applicationData.custFormValues[i].value = $scope.view.startDate;
                            if(string == 'next' && !$scope.view.startDate){
                                PublicFunction.showToast($filter('translate')('form.please.select') + $scope.view.applicationData.custFormValues[i].fieldName);
                                defer.reject(false);
                                return defer.promise;
                            }
                        }
                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'end_date') {
                            $scope.view.applicationData.custFormValues[i].value = $scope.view.endDate;
                            if(string == 'next' && !$scope.view.endDate){
                                PublicFunction.showToast($filter('translate')('form.please.select') + $scope.view.applicationData.custFormValues[i].fieldName);
                                defer.reject(false);
                                return defer.promise;
                            }
                        }
                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_air_ticket_supplier') {
                            if ($scope.view.applicationData.custFormValues[i].selectedSupplier !== null && $scope.view.applicationData.custFormValues[i].selectedSupplier !== '') {
                                $scope.view.applicationData.custFormValues[i].value = $scope.view.applicationData.custFormValues[i].selectedSupplier.supplierOID;
                            }
                        }
                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_participant') {
                            if ($scope.view.interMemberList !== null && $scope.view.interMemberList !== '' && $scope.view.interMemberList.length > 0) {
                                $scope.view.applicationData.custFormValues[i].value = JSON.stringify($scope.view.interMemberList);
                            } else {
                                if(string == 'next' && $scope.view.applicationData.custFormValues[$scope.view.participantIndex].required ){
                                    PublicFunction.showToast($filter('translate')('form.please.select') + $scope.view.applicationData.custFormValues[$scope.view.participantIndex].fieldName);
                                    defer.reject(false);
                                    return defer.promise;
                                } else {
                                    $scope.view.applicationData.custFormValues[i].value = null;
                                }
                            }
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'total_budget' || $scope.view.applicationData.custFormValues[i].messageKey === 'average_budget') {
                            if ($scope.view.applicationData.custFormValues[i].value) {
                                if ($scope.view.applicationData.custFormValues[i].value < 0 || !$scope.view.validateMoney($scope.view.applicationData.custFormValues[i].value)) {
                                    PublicFunction.showToast($filter('translate')('form.please.input.legal') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    defer.reject(false);
                                    return defer.promise;
                                }
                            }
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'out_participant_num') {
                            if($scope.view.outParticipantNum != null && $scope.view.outParticipantNum != '' && $scope.view.outParticipantNum != undefined){
                                if(Math.floor($scope.view.outParticipantNum) == $scope.view.outParticipantNum){
                                    if($scope.view.outParticipantNum > 9999){
                                        PublicFunction.showToast($filter('translate')('custom.application.tip.max') + $scope.view.applicationData.custFormValues[i].fieldName + $filter('translate')('custom.application.tip.more_than_thousand')); //最大  不能大于9999
                                        defer.reject(false);
                                        return defer.promise;
                                    } else {
                                        $scope.view.applicationData.custFormValues[i].value = $scope.view.outParticipantNum;
                                    }
                                } else {
                                    PublicFunction.showToast($filter('translate')('form.please.input.legal') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    defer.reject(false);
                                    return defer.promise;
                                }
                            } else {
                                $scope.view.applicationData.custFormValues[i].value = null;
                            }
                        }  else if ($scope.view.applicationData.custFormValues[i].messageKey === 'number') {
                            if($scope.view.applicationData.custFormValues[i].value != null && $scope.view.applicationData.custFormValues[i].value != undefined){
                                if(Math.floor($scope.view.applicationData.custFormValues[i].value) == $scope.view.applicationData.custFormValues[i].value){

                                } else {
                                    PublicFunction.showToast($filter('translate')('form.please.input.legal') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    defer.reject(false);
                                    return defer.promise;
                                }
                            } else {
                                $scope.view.applicationData.custFormValues[i].value = null;
                            }
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'out_participant_name') {
                            if ($scope.view.outerMemberList.length > 0) {
                                $scope.view.applicationData.custFormValues[i].value = JSON.stringify($scope.view.outerMemberList);
                            }
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_box') {
                            $scope.view.applicationData.custFormValues[i].value = angular.toJson($scope.view.applicationData.custFormValues[i].selectValue);
                        } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'budget_detail') {
                            var data = {};
                            data.budgetDetail = $scope.view.applicationData.custFormValues[i].invoiceList;
                            data.amount = $scope.view.applicationData.custFormValues[i].amount;
                            $scope.view.applicationData.custFormValues[i].value = JSON.stringify(data);
                            if ($scope.view.applicationData.formType === 2005) {
                                if ($scope.view.applicationData.custFormValues[i].required) {
                                    if (data.budgetDetail && data.budgetDetail.length === 0) {
                                        PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                        defer.reject(false);
                                        return defer.promise;
                                    }
                                }
                            }

                        }
                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'title') {
                            if ($scope.view.applicationData.custFormValues[i].required) {
                                if ($scope.view.applicationData.custFormValues[i].value === null || $scope.view.applicationData.custFormValues[i].value === '') {
                                    PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    defer.reject(false);
                                    return defer.promise;
                                } else if ($scope.view.applicationData.custFormValues[i].value.length > 50) {
                                    PublicFunction.showToast($scope.view.applicationData.custFormValues[i].fieldName + '，' + $filter('translate')('form.max.length.50'));
                                    defer.reject(false);
                                    return defer.promise;
                                }

                            }
                        }
                        if ($scope.view.applicationData.formType === 2005 && $scope.view.applicationData.custFormValues[i].required) {
                            if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_cost_center') {
                                if ($scope.view.applicationData.custFormValues[i].costCenterLength == 0) {
                                    PublicFunction.showToast($scope.view.applicationData.custFormValues[i].fieldName + $filter('translate')('error.deploy'));
                                    defer.reject(false);
                                    return defer.promise;
                                } else if ($scope.view.applicationData.custFormValues[i].value === null || $scope.view.applicationData.custFormValues[i].value === '') {
                                    PublicFunction.showToast($filter('translate')('form.please.select') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    defer.reject(false);
                                    return defer.promise;
                                }

                            } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_department') {
                                if (!$scope.view.applicationData.custFormValues[i].value) {
                                    PublicFunction.showToast($filter('translate')('form.please.select') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    defer.reject(false);
                                    return defer.promise;
                                }

                            } else if ($scope.view.applicationData.custFormValues[i].messageKey === 'select_approver') {
                                if (!$scope.view.applicationData.custFormValues[i].value) {
                                    PublicFunction.showToast($filter('translate')('form.please.select') + $scope.view.applicationData.custFormValues[i].fieldName);
                                    defer.reject(false);
                                    return defer.promise;
                                }
                            }
                        }
                        if($scope.view.applicationData.custFormValues[i].messageKey === 'attachment'){
                            // action1: 验证附件信息
                            if($scope.view.applicationData.custFormValues[i].required && $scope.view.attachments.length === 0){
                                PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[i].fieldName);
                                defer.reject(false);
                                return defer.promise;
                            }
                            // 组装附件信息
                            var attachmentOIDS = [];
                            angular.forEach($scope.view.attachments, function (attachment) {
                                if(attachment.attachmentOID !== -1){
                                    attachmentOIDS.push({'attachmentOID': attachment.attachmentOID});
                                }
                            });
                            $scope.view.applicationData.custFormValues[i].value = JSON.stringify(attachmentOIDS);
                        }
                    }
                    if (i === $scope.view.applicationData.custFormValues.length) {
                        defer.resolve(true);
                        return defer.promise;
                    }
                },
                //获取两天之间的天数
                getDiffDay: function (startDate, endDate) {
                    if(startDate && endDate){
                        startDate = new Date(startDate).Format('yyyy/MM/dd').toString();
                        endDate = new Date(endDate).Format('yyyy/MM/dd').toString();
                        var start = [], end = [];
                        var oDate1, oDate2;
                        start = startDate.split("/");
                        oDate1 = new Date(start[1] + '/' + start[2] + '/' + start[0]);  //转换为12-18-2002格式
                        end = endDate.split("/");
                        oDate2 = new Date(end[1] + '/' + end[2] + '/' + end[0]);
                        return (parseInt(Math.abs(oDate2 - oDate1) / 1000 / 60 / 60 / 24)); //把相差的毫秒数转换为天数
                    }
                },
                validateDate: function () {
                    var defer = $q.defer();
                    //manageType不为空  为新的差旅申请单
                    if($scope.view.applicationData.customFormProperties && $scope.view.applicationData.customFormProperties.manageType){
                        defer.resolve(true);
                        return defer.promise;
                    } else if (($scope.view.oldStartDate !== $scope.view.startDate || $scope.view.oldEndDate !== $scope.view.endDate)) {
                        $scope.view.applicationData.travelApplication.travelItinerarys = [];
                        var dateLength = $scope.view.getDiffDay($scope.view.startDate, $scope.view.endDate);
                        var num = 0;
                        for (; num <= dateLength; num++) {
                            var journey = {};
                            journey.itineraryDate = new Date($scope.view.startDate);
                            journey.itineraryDate.setDate(journey.itineraryDate.getDate() + num);
                            journey.travelItineraryTraffics = [];
                            $scope.view.applicationData.travelApplication.travelItinerarys.push(journey);
                    }
                        if (num === (dateLength + 1)) {
                            $scope.view.oldStartDate = $scope.view.startDate;
                            $scope.view.oldEndDate = $scope.view.endDate;
                            defer.resolve(true);
                            return defer.promise;
                        }
                    } else {
                        defer.resolve(true);
                        return defer.promise;
                    }
                },
                goBack: function () {
                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('app.custom_application_list');
                    }
                },
                //借款须知
                showRefundTips:function(){
                    $scope.refundTipsModal.show();
                },
                //差旅申请存草稿
                travelDraft: function (backText) {
                    TravelERVService.travelDraft($scope.view.applicationData)
                        .success(function (data) {
                            $ionicLoading.hide();
                            PublicFunction.showToast($filter('translate')('status.saved'));
                            //保存差旅
                            if(backText && backText == 'back'){
                                $scope.view.goBack()
                            } else {
                                $state.go('app.custom_application_travel_next', {
                                    applicationOID: data.applicationOID,
                                    formType: 2001
                                });
                            }
                        })
                        .error(function (error) {
                            $ionicLoading.hide();
                            if(error.message){
                                PublicFunction.showToast(error.message)
                            } else {
                                PublicFunction.showToast($filter('translate')('status.error'));
                            }
                        })
                        .finally(function () {
                            $scope.view.disabled = false;
                        })
                },
                //保存
                saveApplication: function (string, backText) {
                   $scope.view.saveValidate(string)
                       .then(function () {
                           $scope.view.disabled = true;
                           CustomApplicationServices.setTab('init');
                           if ($scope.view.applicationData.formType === 2001) {
                               //差旅申请
                               $scope.view.validateDate()
                                   .then(function () {
                                       if (string === 'next') {
                                           $scope.view.validate()
                                               .then(function () {
                                                   if($scope.view.applicationData.closeDate && Date.parse(new Date($scope.view.applicationData.closeDate)) < Date.parse(new Date(new Date().setDate(new Date().getDate()-1)))){
                                                       var confirmPopup = $ionicPopup.confirm({
                                                           title: $filter('translate')('custom.application.tip.stop_time'), //停用时间早于当前时间
                                                           template: '<p style="text-align: center">' + $filter("translate")("custom.application.tip.warn_stop_time") + '<br/> ' + $filter("translate")("custom.application.tip.relate_report") + $filter("translate")("custom.application.tip.order_itinerary") + '</p>',  //您仍可以提交，但审批通过后   不可报销和预定相关交通住宿
                                                           cancelText: $filter('translate')('custom.application.button.back_modify'), //返回修改
                                                           cancelType: 'button-calm',
                                                           okText: $filter('translate')('custom.application.button.sure'), //确定
                                                           cssClass: 'stop-time-popup'
                                                       });
                                                       confirmPopup.then(function (res) {
                                                           if (res) {
                                                               if($scope.view.applicationData.formType == 2001 && (($scope.view.hasOuterMember || $scope.view.hasOuter || $scope.view.hasInter) && (($scope.view.outParticipantNum && (parseInt($scope.view.outParticipantNum) + $scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0) ||
                                                                   (!$scope.view.outParticipantNum && ($scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0 )))){
                                                                   PublicFunction.showToast($filter('translate')('custom.application.tip.add_applicant'));  //请添加参与人或外部参与人
                                                                   $scope.view.disabled = false;
                                                               }
                                                               else {
                                                                   if ($scope.view.departmentOID) {
                                                                       DepartmentService.getDepartmentInfo($scope.view.departmentOID).then(function (response) {
                                                                           if ($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode == 1002 && !response.data.managerOID) {
                                                                               PublicFunction.showToast(ManagerPrompt);
                                                                               $scope.view.disabled = false;
                                                                           } else {
                                                                               PublicFunction.showLoading();
                                                                               //校验参与人是否符合数据权限
                                                                               if($scope.view.interMemberList.length > 0){
                                                                                   var finish = false;
                                                                                   var userList = [];
                                                                                   for(var i = 0; i < $scope.view.interMemberList.length; i++){
                                                                                       userList.push($scope.view.interMemberList[i].userOID);
                                                                                       if(i >= $scope.view.interMemberList.length -1){
                                                                                           finish = true;
                                                                                       }
                                                                                   }
                                                                                   if(finish){
                                                                                       $scope.view.authorityData.participantsOID = angular.copy(userList);
                                                                                       CustomApplicationServices.getUserInForm($scope.view.authorityData)
                                                                                           .success(function (data) {
                                                                                               var loopFinish = false;
                                                                                               $scope.view.errorUserOID = [];
                                                                                               $scope.view.errorUserName = '';
                                                                                               for(var i = 0; i < data.length; i++){
                                                                                                   if(data[i].errorDetail != null && data[i].errorDetail != '' && data[i].errorDetail != undefined){
                                                                                                       if($scope.view.errorUserOID.length == 0){
                                                                                                           $scope.view.errorUserOID.push(data[i].userOID);
                                                                                                           $scope.view.errorUserName += data[i].fullName;
                                                                                                       } else {
                                                                                                           $scope.view.errorUserOID.push(data[i].userOID);
                                                                                                           $scope.view.errorUserName += '、' + data[i].fullName;
                                                                                                       }
                                                                                                   }
                                                                                                   if(i >= (data.length -1)){
                                                                                                       loopFinish = true;
                                                                                                   }
                                                                                               }
                                                                                               if(loopFinish){
                                                                                                   if($scope.view.errorUserOID.length > 0){
                                                                                                       $ionicLoading.hide();
                                                                                                       var confirmPopup = $ionicPopup.confirm({
                                                                                                           scope: $scope,
                                                                                                           title: $filter('translate')('custom.application.tip.applicant'), //参与人员提示
                                                                                                           template: '<p style="text-align: center">' + $scope.view.errorUserName + $filter("translate")("custom.application.tip.error_applicant_mssage") + '</p>' +  //不在可选参与人范围内，是否删除以上人员
                                                                                                           '<span ng-if="view.applicationData.travelApplication && view.applicationData.travelApplication.travelSubsidies && view.applicationData.travelApplication.travelSubsidies.length > 0">* ' + $filter("translate")("custom.application.tip.delete_all_allowance") + '</span>',  //更改参与人员将清空已添加的差补，您需重新添加餐补
                                                                                                           cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                                                                           cancelType: 'button-calm',
                                                                                                           okText: $filter('translate')('custom.application.button.sure_delete'),  //确认删除
                                                                                                           cssClass: 'stop-time-popup'
                                                                                                       });
                                                                                                       confirmPopup.then(function (res) {
                                                                                                           if (res) {
                                                                                                               PublicFunction.showLoading();
                                                                                                               var i =0;
                                                                                                               var interMemberListCopy = [];
                                                                                                               for(; i < $scope.view.interMemberList.length; i++){
                                                                                                                   if($scope.view.errorUserOID.indexOf($scope.view.interMemberList[i].userOID) == -1){
                                                                                                                       interMemberListCopy.push($scope.view.interMemberList[i]);
                                                                                                                   }
                                                                                                               }
                                                                                                               if(i == $scope.view.interMemberList.length){
                                                                                                                   $scope.view.interMemberList = angular.copy(interMemberListCopy);
                                                                                                                   if ($scope.view.interMemberList.length > 0) {
                                                                                                                       $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = JSON.stringify($scope.view.interMemberList);
                                                                                                                       $scope.view.travelDraft(backText);
                                                                                                                   } else if ($scope.view.applicationData.custFormValues[$scope.view.participantIndex].required) {
                                                                                                                       PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[$scope.view.participantIndex].fieldName);
                                                                                                                       $scope.view.disabled = false;
                                                                                                                       $ionicLoading.hide();
                                                                                                                   } else if($scope.view.applicationData.formType == 2001 && (($scope.view.hasOuterMember || $scope.view.hasOuter || $scope.view.hasInter) && (($scope.view.outParticipantNum && (parseInt($scope.view.outParticipantNum) + $scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0) ||
                                                                                                                       (!$scope.view.outParticipantNum && ($scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0 )))){
                                                                                                                       $ionicLoading.hide();
                                                                                                                       PublicFunction.showToast($filter('translate')('custom.application.tip.add_applicant'));  //请添加参与人或外部参与人
                                                                                                                       $scope.view.disabled = false;
                                                                                                                   } else {
                                                                                                                       $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = null;
                                                                                                                       $scope.view.travelDraft(backText);
                                                                                                                   }
                                                                                                               }
                                                                                                           } else {
                                                                                                               $scope.view.disabled = false;
                                                                                                               $ionicLoading.hide();
                                                                                                           }
                                                                                                       })
                                                                                                   }
                                                                                                   else {
                                                                                                       $scope.view.travelDraft(backText);
                                                                                                   }

                                                                                               }
                                                                                           })
                                                                                           .error(function (error) {
                                                                                               $scope.view.disabled = false;
                                                                                               $ionicLoading.hide();

                                                                                               if(error && error.validationErrors && error.validationErrors.length > 0 && error.validationErrors[0].externalPropertyName){
                                                                                                   // 2010: 申请人为空  2011:部门为空  2012：成本中心为空
                                                                                                   if(error.validationErrors[0].externalPropertyName == '2012'){
                                                                                                       PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_costCenter')); //请先选择成本中心
                                                                                                   } else if(error.validationErrors[0].externalPropertyName == '2010'){
                                                                                                       PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_applicant')); //请先选择申请人
                                                                                                   } else if(error.validationErrors[0].externalPropertyName == '2011'){
                                                                                                       PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_department')); //请先选择部门
                                                                                                   }
                                                                                               } else {
                                                                                                   PublicFunction.showToast($filter('translate')('custom.application.tip.check_appliant_error')); //校验参与人数据权限出错
                                                                                               }

                                                                                           })
                                                                                   }
                                                                               } else {
                                                                                   $scope.view.travelDraft(backText);
                                                                               }

                                                                           }
                                                                       },function () {
                                                                           PublicFunction.showToast($filter('translate')('status.error'));
                                                                           $scope.view.disabled = false;
                                                                       })
                                                                   }
                                                                   else {
                                                                       PublicFunction.showLoading();
                                                                       if($scope.view.interMemberList.length > 0){
                                                                           var finish = false;
                                                                           var userList = [];
                                                                           for(var i = 0; i < $scope.view.interMemberList.length; i++){
                                                                               userList.push($scope.view.interMemberList[i].userOID);
                                                                               if(i >= $scope.view.interMemberList.length -1){
                                                                                   finish = true;
                                                                               }
                                                                           }
                                                                           if(finish){
                                                                               $scope.view.authorityData.participantsOID = angular.copy(userList);
                                                                               CustomApplicationServices.getUserInForm($scope.view.authorityData)
                                                                                   .success(function (data) {
                                                                                       var loopFinish = false;
                                                                                       $scope.view.errorUserOID = [];
                                                                                       $scope.view.errorUserName = '';
                                                                                       for(var i = 0; i < data.length; i++){
                                                                                           if(data[i].errorDetail != null && data[i].errorDetail != ''){
                                                                                               if($scope.view.errorUserOID.length == 0){
                                                                                                   $scope.view.errorUserOID.push(data[i].userOID);
                                                                                                   $scope.view.errorUserName += data[i].fullName;
                                                                                               } else {
                                                                                                   $scope.view.errorUserOID.push(data[i].userOID);
                                                                                                   $scope.view.errorUserName += '、' + data[i].fullName;
                                                                                               }
                                                                                           }
                                                                                           if(i >= (data.length -1)){
                                                                                               loopFinish = true;
                                                                                           }
                                                                                       }
                                                                                       if(loopFinish){
                                                                                           if($scope.view.errorUserOID.length > 0){
                                                                                               $ionicLoading.hide();
                                                                                               var confirmPopup = $ionicPopup.confirm({
                                                                                                   scope: $scope,
                                                                                                   title: $filter('translate')('custom.application.tip.applicant'),  //参与人员提示
                                                                                                   template: '<p style="text-align: center">' + $scope.view.errorUserName + $filter("translate")("custom.application.tip.error_applicant_mssage") + '？ </p>' +  //不在可选参与人范围内，是否删除以上人员  delete_all_allowance
                                                                                                   '<span ng-if="view.applicationData.travelApplication && view.applicationData.travelApplication.travelSubsidies && view.applicationData.travelApplication.travelSubsidies.length > 0">*$filter("translate")("custom.application.tip.delete_all_allowance")</span>',
                                                                                                   cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                                                                   cancelType: 'button-calm',
                                                                                                   okText: $filter('translate')('custom.application.button.sure_delete'),  //确认删除
                                                                                                   cssClass: 'stop-time-popup'
                                                                                               });
                                                                                               confirmPopup.then(function (res) {
                                                                                                   if (res) {
                                                                                                       PublicFunction.showLoading();
                                                                                                       var i =0;
                                                                                                       var interMemberListCopy = [];
                                                                                                       for(; i < $scope.view.interMemberList.length; i++){
                                                                                                           if($scope.view.errorUserOID.indexOf($scope.view.interMemberList[i].userOID) == -1){
                                                                                                               interMemberListCopy.push($scope.view.interMemberList[i]);
                                                                                                           }
                                                                                                       }
                                                                                                       if(i == $scope.view.interMemberList.length){
                                                                                                           $scope.view.interMemberList = angular.copy(interMemberListCopy);
                                                                                                           if ($scope.view.interMemberList.length > 0) {
                                                                                                               $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = JSON.stringify($scope.view.interMemberList);
                                                                                                               $scope.view.travelDraft(backText);
                                                                                                           } else if ($scope.view.applicationData.custFormValues[$scope.view.participantIndex].required) {
                                                                                                               PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[$scope.view.participantIndex].fieldName);
                                                                                                               $scope.view.disabled = false;
                                                                                                               $ionicLoading.hide();
                                                                                                           } else if($scope.view.applicationData.formType == 2001 && (($scope.view.hasOuterMember || $scope.view.hasOuter || $scope.view.hasInter) && (($scope.view.outParticipantNum && (parseInt($scope.view.outParticipantNum) + $scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0) ||
                                                                                                               (!$scope.view.outParticipantNum && ($scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0 )))){
                                                                                                               $ionicLoading.hide();
                                                                                                               PublicFunction.showToast($filter('translate')('custom.application.tip.add_applicant'));  //请添加参与人或外部参与人
                                                                                                               $scope.view.disabled = false;
                                                                                                           } else {
                                                                                                               $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = null;
                                                                                                               $scope.view.travelDraft(backText);
                                                                                                           }
                                                                                                       }
                                                                                                   } else {
                                                                                                       $scope.view.disabled = false;
                                                                                                       $ionicLoading.hide();
                                                                                                   }
                                                                                               })
                                                                                           } else {
                                                                                               $scope.view.travelDraft(backText);
                                                                                           }
                                                                                       }
                                                                                   })
                                                                                   .error(function (error) {
                                                                                       $scope.view.disabled = false;
                                                                                       $ionicLoading.hide();
                                                                                       if(error && error.validationErrors && error.validationErrors.length > 0 && error.validationErrors[0].externalPropertyName){
                                                                                           // 2010: 申请人为空  2011:部门为空  2012：成本中心为空
                                                                                           if(error.validationErrors[0].externalPropertyName == '2012'){
                                                                                               PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_costCenter')); //请先选择成本中心
                                                                                           } else if(error.validationErrors[0].externalPropertyName == '2010'){
                                                                                               PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_applicant')); //请先选择申请人
                                                                                           } else if(error.validationErrors[0].externalPropertyName == '2011'){
                                                                                               PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_department')); //请先选择部门
                                                                                           }
                                                                                       } else {
                                                                                           PublicFunction.showToast($filter('translate')('custom.application.tip.check_appliant_error')); //校验参与人数据权限出错
                                                                                       }


                                                                                   })
                                                                           }
                                                                       } else {
                                                                           $scope.view.travelDraft(backText);
                                                                       }
                                                                   }
                                                               }
                                                           } else {
                                                               $scope.view.disabled = false;
                                                           }
                                                       });
                                                   }
                                                   else {
                                                       if($scope.view.applicationData.formType == 2001 && (($scope.view.hasOuterMember || $scope.view.hasOuter || $scope.view.hasInter) && (($scope.view.outParticipantNum && (parseInt($scope.view.outParticipantNum) + $scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0) ||
                                                           (!$scope.view.outParticipantNum && ($scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0 )))){
                                                           PublicFunction.showToast($filter('translate')('custom.application.tip.add_applicant'));  //请添加参与人或外部参与人
                                                           $scope.view.disabled = false;
                                                       }
                                                       else {
                                                           if ($scope.view.departmentOID) {
                                                               DepartmentService.getDepartmentInfo($scope.view.departmentOID).then(function (response) {
                                                                   if ($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode == 1002 && !response.data.managerOID) {
                                                                       PublicFunction.showToast(ManagerPrompt);
                                                                       $scope.view.disabled = false;
                                                                   } else {
                                                                       PublicFunction.showLoading();
                                                                       //校验参与人是否符合数据权限
                                                                       if($scope.view.interMemberList.length > 0){
                                                                           var finish = false;
                                                                           var userList = [];
                                                                           for(var i = 0; i < $scope.view.interMemberList.length; i++){
                                                                               userList.push($scope.view.interMemberList[i].userOID);
                                                                               if(i >= $scope.view.interMemberList.length -1){
                                                                                   finish = true;
                                                                               }
                                                                           }
                                                                           if(finish){
                                                                               $scope.view.authorityData.participantsOID = angular.copy(userList);
                                                                               CustomApplicationServices.getUserInForm($scope.view.authorityData)
                                                                                   .success(function (data) {
                                                                                       var loopFinish = false;
                                                                                       $scope.view.errorUserOID = [];
                                                                                       $scope.view.errorUserName = '';
                                                                                       for(var i = 0; i < data.length; i++){
                                                                                           if(data[i].errorDetail != null && data[i].errorDetail != '' && data[i].errorDetail != undefined){
                                                                                               if($scope.view.errorUserOID.length == 0){
                                                                                                   $scope.view.errorUserOID.push(data[i].userOID);
                                                                                                   $scope.view.errorUserName += data[i].fullName;
                                                                                               } else {
                                                                                                   $scope.view.errorUserOID.push(data[i].userOID);
                                                                                                   $scope.view.errorUserName += '、' + data[i].fullName;
                                                                                               }
                                                                                           }
                                                                                           if(i >= (data.length -1)){
                                                                                               loopFinish = true;
                                                                                           }
                                                                                       }
                                                                                       if(loopFinish){
                                                                                           if($scope.view.errorUserOID.length > 0){
                                                                                               $ionicLoading.hide();
                                                                                               var confirmPopup = $ionicPopup.confirm({
                                                                                                   scope: $scope,
                                                                                                   title: $filter('translate')('custom.application.tip.applicant'), //参与人员提示
                                                                                                   template: '<p style="text-align: center">' + $scope.view.errorUserName + $filter("translate")("custom.application.tip.error_applicant_mssage") + '</p>' +  //不在可选参与人范围内，是否删除以上人员
                                                                                                   '<span ng-if="view.applicationData.travelApplication && view.applicationData.travelApplication.travelSubsidies && view.applicationData.travelApplication.travelSubsidies.length > 0">* ' + $filter("translate")("custom.application.tip.delete_all_allowance") + '</span>',  //更改参与人员将清空已添加的差补，您需重新添加餐补
                                                                                                   cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                                                                   cancelType: 'button-calm',
                                                                                                   okText: $filter('translate')('custom.application.button.sure_delete'),  //确认删除
                                                                                                   cssClass: 'stop-time-popup'
                                                                                               });
                                                                                               confirmPopup.then(function (res) {
                                                                                                   if (res) {
                                                                                                       PublicFunction.showLoading();
                                                                                                       var i =0;
                                                                                                       var interMemberListCopy = [];
                                                                                                       for(; i < $scope.view.interMemberList.length; i++){
                                                                                                           if($scope.view.errorUserOID.indexOf($scope.view.interMemberList[i].userOID) == -1){
                                                                                                               interMemberListCopy.push($scope.view.interMemberList[i]);
                                                                                                           }
                                                                                                       }
                                                                                                       if(i == $scope.view.interMemberList.length){
                                                                                                           $scope.view.interMemberList = angular.copy(interMemberListCopy);
                                                                                                           if ($scope.view.interMemberList.length > 0) {
                                                                                                               $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = JSON.stringify($scope.view.interMemberList);
                                                                                                               $scope.view.travelDraft(backText);
                                                                                                           } else if ($scope.view.applicationData.custFormValues[$scope.view.participantIndex].required) {
                                                                                                               $ionicLoading.hide();
                                                                                                               PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[$scope.view.participantIndex].fieldName);
                                                                                                               $scope.view.disabled = false;
                                                                                                           } else if($scope.view.applicationData.formType == 2001 && (($scope.view.hasOuterMember || $scope.view.hasOuter || $scope.view.hasInter) && (($scope.view.outParticipantNum && (parseInt($scope.view.outParticipantNum) + $scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0) ||
                                                                                                               (!$scope.view.outParticipantNum && ($scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0 )))){
                                                                                                               $ionicLoading.hide();
                                                                                                               PublicFunction.showToast($filter('translate')('custom.application.tip.add_applicant'));  //请添加参与人或外部参与人
                                                                                                               $scope.view.disabled = false;

                                                                                                           } else {
                                                                                                               $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = null;
                                                                                                               $scope.view.travelDraft(backText);
                                                                                                           }
                                                                                                       }
                                                                                                   } else {
                                                                                                       $scope.view.disabled = false;
                                                                                                       $ionicLoading.hide();
                                                                                                   }
                                                                                               })
                                                                                           }
                                                                                           else {
                                                                                               $scope.view.travelDraft(backText);
                                                                                           }

                                                                                       }
                                                                                   })
                                                                                   .error(function (error) {
                                                                                       $ionicLoading.hide();
                                                                                       $scope.view.disabled = false;
                                                                                       if(error && error.validationErrors && error.validationErrors.length > 0 && error.validationErrors[0].externalPropertyName){
                                                                                           // 2010: 申请人为空  2011:部门为空  2012：成本中心为空
                                                                                           if(error.validationErrors[0].externalPropertyName == '2012'){
                                                                                               PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_costCenter')); //请先选择成本中心
                                                                                           } else if(error.validationErrors[0].externalPropertyName == '2010'){
                                                                                               PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_applicant')); //请先选择申请人
                                                                                           } else if(error.validationErrors[0].externalPropertyName == '2011'){
                                                                                               PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_department')); //请先选择部门
                                                                                           }
                                                                                       } else {
                                                                                           PublicFunction.showToast($filter('translate')('custom.application.tip.check_appliant_error')); //校验参与人数据权限出错
                                                                                       }

                                                                                   })
                                                                           }
                                                                       } else {
                                                                           $scope.view.travelDraft(backText);
                                                                       }

                                                                   }
                                                               },function () {
                                                                   PublicFunction.showToast($filter('translate')('status.error'));
                                                                   $scope.view.disabled = false;
                                                               })
                                                           }
                                                           else {
                                                               PublicFunction.showLoading();
                                                               //校验参与人是否符合数据权限
                                                               if($scope.view.interMemberList.length > 0){
                                                                   var finish = false;
                                                                   var userList = [];
                                                                   for(var i = 0; i < $scope.view.interMemberList.length; i++){
                                                                       userList.push($scope.view.interMemberList[i].userOID);
                                                                       if(i >= $scope.view.interMemberList.length -1){
                                                                           finish = true;
                                                                       }
                                                                   }
                                                                   if(finish){
                                                                       $scope.view.authorityData.participantsOID = angular.copy(userList);
                                                                       CustomApplicationServices.getUserInForm($scope.view.authorityData)
                                                                           .success(function (data) {
                                                                               var loopFinish = false;
                                                                               $scope.view.errorUserOID = [];
                                                                               $scope.view.errorUserName = '';
                                                                               for(var i = 0; i < data.length; i++){
                                                                                   if(data[i].errorDetail != null && data[i].errorDetail != '' && data[i].errorDetail != undefined){
                                                                                       if($scope.view.errorUserOID.length == 0){
                                                                                           $scope.view.errorUserOID.push(data[i].userOID);
                                                                                           $scope.view.errorUserName += data[i].fullName;
                                                                                       } else {
                                                                                           $scope.view.errorUserOID.push(data[i].userOID);
                                                                                           $scope.view.errorUserName += '、' + data[i].fullName;
                                                                                       }
                                                                                   }
                                                                                   if(i >= (data.length -1)){
                                                                                       loopFinish = true;
                                                                                   }
                                                                               }
                                                                               if(loopFinish){
                                                                                   if($scope.view.errorUserOID.length > 0){
                                                                                       $ionicLoading.hide();
                                                                                       var confirmPopup = $ionicPopup.confirm({
                                                                                           scope: $scope,
                                                                                           title: $filter('translate')('custom.application.tip.applicant'), //参与人员提示
                                                                                           template: '<p style="text-align: center">' + $scope.view.errorUserName + $filter("translate")("custom.application.tip.error_applicant_mssage") + '</p>' +  //不在可选参与人范围内，是否删除以上人员
                                                                                           '<span ng-if="view.applicationData.travelApplication && view.applicationData.travelApplication.travelSubsidies && view.applicationData.travelApplication.travelSubsidies.length > 0">* ' + $filter("translate")("custom.application.tip.delete_all_allowance") + '</span>',  //更改参与人员将清空已添加的差补，您需重新添加餐补
                                                                                           cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                                                           cancelType: 'button-calm',
                                                                                           okText: $filter('translate')('custom.application.button.sure_delete'),  //确认删除
                                                                                           cssClass: 'stop-time-popup'
                                                                                       });
                                                                                       confirmPopup.then(function (res) {
                                                                                           if (res) {
                                                                                               PublicFunction.showLoading();
                                                                                               var i =0;
                                                                                               var interMemberListCopy = [];
                                                                                               for(; i < $scope.view.interMemberList.length; i++){
                                                                                                   if($scope.view.errorUserOID.indexOf($scope.view.interMemberList[i].userOID) == -1){
                                                                                                       interMemberListCopy.push($scope.view.interMemberList[i]);
                                                                                                   }
                                                                                               }
                                                                                               if(i == $scope.view.interMemberList.length){
                                                                                                   $scope.view.interMemberList = angular.copy(interMemberListCopy);
                                                                                                   if ($scope.view.interMemberList.length > 0) {
                                                                                                       $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = JSON.stringify($scope.view.interMemberList);
                                                                                                       $scope.view.travelDraft(backText);
                                                                                                   } else if ($scope.view.applicationData.custFormValues[$scope.view.participantIndex].required) {
                                                                                                       $ionicLoading.hide();
                                                                                                       PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[$scope.view.participantIndex].fieldName);
                                                                                                       $scope.view.disabled = false;
                                                                                                   } else if($scope.view.applicationData.formType == 2001 && (($scope.view.hasOuterMember || $scope.view.hasOuter || $scope.view.hasInter) && (($scope.view.outParticipantNum && (parseInt($scope.view.outParticipantNum) + $scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0) ||
                                                                                                       (!$scope.view.outParticipantNum && ($scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0 )))){
                                                                                                       $ionicLoading.hide();
                                                                                                       PublicFunction.showToast($filter('translate')('custom.application.tip.add_applicant'));  //请添加参与人或外部参与人
                                                                                                       $scope.view.disabled = false;
                                                                                                   } else {
                                                                                                       $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = null;
                                                                                                       $scope.view.travelDraft(backText);
                                                                                                   }
                                                                                               }
                                                                                           } else {
                                                                                               $scope.view.disabled = false;
                                                                                               $ionicLoading.hide();
                                                                                           }
                                                                                       })
                                                                                   }
                                                                                   else {
                                                                                       $scope.view.travelDraft(backText);
                                                                                   }

                                                                               }
                                                                           })
                                                                           .error(function (error) {
                                                                               $ionicLoading.hide();
                                                                               $scope.view.disabled = false;

                                                                               if(error && error.validationErrors && error.validationErrors.length > 0 && error.validationErrors[0].externalPropertyName){
                                                                                   // 2010: 申请人为空  2011:部门为空  2012：成本中心为空
                                                                                   if(error.validationErrors[0].externalPropertyName == '2012'){
                                                                                       PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_costCenter')); //请先选择成本中心
                                                                                   } else if(error.validationErrors[0].externalPropertyName == '2010'){
                                                                                       PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_applicant')); //请先选择申请人
                                                                                   } else if(error.validationErrors[0].externalPropertyName == '2011'){
                                                                                       PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_department')); //请先选择部门
                                                                                   }
                                                                               } else {
                                                                                   PublicFunction.showToast($filter('translate')('custom.application.tip.check_appliant_error')); //校验参与人数据权限出错
                                                                               }

                                                                           })
                                                                   }
                                                               } else {
                                                                   $scope.view.travelDraft(backText);
                                                               }
                                                           }
                                                       }
                                                   }

                                               }, function () {
                                                   $scope.view.disabled = false;
                                               })
                                       }
                                       else {
                                           PublicFunction.showLoading();
                                           TravelERVService.travelDraft($scope.view.applicationData)
                                               .success(function (data) {
                                                   $ionicLoading.hide();
                                                   PublicFunction.showToast($filter('translate')('status.saved'));
                                                   $timeout(function () {
                                                       $scope.view.goBack();
                                                   }, 500);
                                               })
                                               .error(function (error) {
                                                   $ionicLoading.hide();
                                                   if(error.message){
                                                       PublicFunction.showToast(error.message)
                                                   } else {
                                                       PublicFunction.showToast($filter('translate')('status.error'));
                                                   }
                                               })
                                               .finally(function () {
                                                   $scope.view.disabled = false;
                                               })
                                       }
                                   }, function () {
                                       $scope.view.disabled = false;
                                   })
                           }
                           else if ($scope.view.applicationData.formType === 2002) {
                               if($scope.view.applicationData.closeEnabled){
                                   if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                       $scope.view.applicationData.closeDate = new Date();
                                       $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                       $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                   } else {
                                       $scope.view.applicationData.closeDate = new Date();
                                   }
                               }
                               InvoiceApplyERVService.saveInvoiceApply($scope.view.applicationData)
                                   .success(function (data) {
                                       $ionicLoading.hide();
                                       PublicFunction.showToast($filter('translate')('status.saved'));
                                       $timeout(function () {
                                           $scope.view.goBack();
                                       }, 500);
                                   })
                                   .error(function (error) {
                                       $ionicLoading.hide();
                                       if(error.message){
                                           PublicFunction.showToast(error.message)
                                       } else {
                                           PublicFunction.showToast($filter('translate')('status.error'));
                                       }
                                   })
                                   .finally(function () {
                                       $scope.view.disabled = false;
                                   })
                           }
                           else if ($scope.view.applicationData.formType === 2003) {
                               //订票申请
                               PublicFunction.showLoading();
                               CustomApplicationServices.saveCustomApplication($scope.view.applicationData)
                                   .success(function (data) {
                                       $ionicLoading.hide();
                                       PublicFunction.showToast($filter('translate')('status.saved'));
                                       $timeout(function () {
                                           $scope.view.goBack();
                                       }, 500);
                                   })
                                   .error(function (error) {
                                       $ionicLoading.hide();
                                       if(error.message){
                                           PublicFunction.showToast(error.message)
                                       } else {
                                           PublicFunction.showToast($filter('translate')('status.error'));
                                       }
                                   })
                                   .finally(function () {
                                       $scope.view.disabled = false;
                                   })
                           } else if ($scope.view.applicationData.formType === 1001) {
                               //普通表单
                           } else if ($scope.view.applicationData.formType === 2005) {
                               PublicFunction.showLoading();
                               CustomApplicationServices.saveBorrowApply($scope.view.applicationData)
                                   .success(function () {
                                       $ionicLoading.hide();
                                       PublicFunction.showToast($filter('translate')('status.saved'));
                                       $scope.view.goBack();
                                   })
                                   .error(function (error) {
                                       $ionicLoading.hide();
                                       if(error.message){
                                           PublicFunction.showToast(error.message)
                                       } else {
                                           PublicFunction.showToast($filter('translate')('status.error'));
                                       }
                                   })
                                   .finally(function () {
                                       $scope.view.disabled = false;
                                   })
                           }
                       }, function () {
                           $scope.view.disabled = false;
                       })
                },
                submitApplication: function () {
                    if(!$scope.view.disabled){
                        $scope.view.disabled = true;
                        $scope.view.validate()
                            .then(function () {
                                CustomApplicationServices.setTab('submit');
                                var today = new Date();
                                today.setDate(today.getDate() -1);
                                if($scope.view.applicationData.closeDate && Date.parse(new Date($scope.view.applicationData.closeDate)) < Date.parse(new Date(today))) {
                                    var confirmPopup = $ionicPopup.confirm({
                                        title: $filter('translate')('custom.application.tip.stop_time'), //停用时间早于当前时间
                                        template: '<p style="text-align: center">' + $filter("translate")("custom.application.tip.warn_stop_time") + '<br/>' + $filter("translate")("custom.application.tip.relate_report") + '</p>',  //您仍可以提交，但审批通过后   不可报销
                                        cancelText: $filter('translate')('custom.application.button.back_modify'), //返回修改
                                        cancelType: 'button-calm',
                                        okText: $filter('translate')('custom.application.button.sure'), //确定
                                        cssClass: 'stop-time-popup'
                                    });
                                    confirmPopup.then(function (res) {
                                        if (res) {
                                            if($scope.view.applicationData.formType == 2001 &&(($scope.view.hasOuterMember || $scope.view.hasOuter || $scope.view.hasInter) && (($scope.view.outParticipantNum && (parseInt($scope.view.outParticipantNum) + $scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0) ||
                                                (!$scope.view.outParticipantNum && ($scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0 )))){
                                                PublicFunction.showToast($filter('translate')('custom.application.tip.add_applicant'));  //请添加参与人或外部参与人
                                                $scope.view.disabled = false;
                                            }
                                            else {
                                                PublicFunction.showLoading();
                                                //校验参与人是否符合数据权限
                                                if($scope.view.interMemberList.length > 0){
                                                    var finish = false;
                                                    var userList = [];
                                                    for(var i = 0; i < $scope.view.interMemberList.length; i++){
                                                        userList.push($scope.view.interMemberList[i].userOID);
                                                        if(i >= $scope.view.interMemberList.length -1){
                                                            finish = true;
                                                        }
                                                    }
                                                    if(finish){
                                                        $scope.view.authorityData.participantsOID = angular.copy(userList);
                                                        CustomApplicationServices.getUserInForm($scope.view.authorityData)
                                                            .success(function (data) {
                                                                var loopFinish = false;
                                                                $scope.view.errorUserOID = [];
                                                                $scope.view.errorUserName = '';
                                                                for(var i = 0; i < data.length; i++){
                                                                    if(data[i].errorDetail != null && data[i].errorDetail != '' && data[i].errorDetail != undefined){
                                                                        if($scope.view.errorUserOID.length == 0){
                                                                            $scope.view.errorUserOID.push(data[i].userOID);
                                                                            $scope.view.errorUserName += data[i].fullName;
                                                                        } else {
                                                                            $scope.view.errorUserOID.push(data[i].userOID);
                                                                            $scope.view.errorUserName += '、' + data[i].fullName;
                                                                        }
                                                                    }
                                                                    if(i >= (data.length -1)){
                                                                        loopFinish = true;
                                                                    }
                                                                }
                                                                if(loopFinish){
                                                                    if($scope.view.errorUserOID.length > 0){
                                                                        $ionicLoading.hide();
                                                                        var confirmPopup = $ionicPopup.confirm({
                                                                            scope: $scope,
                                                                            title: $filter('translate')('custom.application.tip.applicant'), //参与人员提示
                                                                            template: '<p style="text-align: center">' + $scope.view.errorUserName + $filter("translate")("custom.application.tip.error_applicant_mssage") + '？ </p>' +  //不在可选参与人范围内，是否删除以上人员
                                                                            '<span ng-if="view.applicationData.travelApplication && view.applicationData.travelApplication.travelSubsidies && view.applicationData.travelApplication.travelSubsidies.length > 0">*$filter("translate")("custom.application.tip.delete_all_allowance")</span>',  //更改参与人员将清空已添加的差补，您需重新添加餐补
                                                                            cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                                            cancelType: 'button-calm',
                                                                            okText: $filter('translate')('custom.application.button.sure_delete'),  //确认删除
                                                                            cssClass: 'stop-time-popup'
                                                                        });
                                                                        confirmPopup.then(function (res) {
                                                                            if (res) {
                                                                                PublicFunction.showLoading();
                                                                                var i =0;
                                                                                var interMemberListCopy = [];
                                                                                for(; i < $scope.view.interMemberList.length; i++){
                                                                                    if($scope.view.errorUserOID.indexOf($scope.view.interMemberList[i].userOID) == -1){
                                                                                        interMemberListCopy.push($scope.view.interMemberList[i]);
                                                                                    }
                                                                                }
                                                                                if(i == $scope.view.interMemberList.length){
                                                                                    $scope.view.interMemberList = angular.copy(interMemberListCopy);
                                                                                    if ($scope.view.interMemberList.length > 0) {
                                                                                        $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = JSON.stringify($scope.view.interMemberList);
                                                                                        //选择部门
                                                                                        if ($scope.view.departmentOID) {
                                                                                            DepartmentService.getDepartmentInfo($scope.view.departmentOID).then(function (response) {
                                                                                                if ($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode === 1002 && !response.data.managerOID) {
                                                                                                    PublicFunction.showToast(ManagerPrompt);
                                                                                                    $timeout(function () {
                                                                                                        $ionicLoading.hide();
                                                                                                    }, 1000)
                                                                                                    $scope.view.disabled = false;
                                                                                                } else {
                                                                                                    PublicFunction.showLoading();
                                                                                                    if ($scope.view.applicationData.formType === 2001) {
                                                                                                        //差旅申请
                                                                                                        //差旅申请需要校验预算
                                                                                                        TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                                                            .success(function (res) {
                                                                                                                $ionicLoading.hide();
                                                                                                                //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                                                                if(res){
                                                                                                                    TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                                        .success(function (data) {
                                                                                                                            $ionicLoading.hide();
                                                                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                            $timeout(function () {
                                                                                                                                $scope.view.goBack();
                                                                                                                            }, 500);
                                                                                                                        })
                                                                                                                        .error(function (error) {
                                                                                                                            $ionicLoading.hide();
                                                                                                                            if(error.message){
                                                                                                                                PublicFunction.showToast(error.message)
                                                                                                                            } else {
                                                                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                            }
                                                                                                                        })
                                                                                                                        .finally(function () {
                                                                                                                            $scope.view.disabled = false;
                                                                                                                        })
                                                                                                                }else{
                                                                                                                    $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                                                                        TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                                            .success(function (data) {
                                                                                                                                $ionicLoading.hide();
                                                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                                $timeout(function () {
                                                                                                                                    $scope.view.goBack();
                                                                                                                                }, 500);
                                                                                                                            })
                                                                                                                            .error(function (error) {
                                                                                                                                $ionicLoading.hide();
                                                                                                                                if(error.message){
                                                                                                                                    PublicFunction.showToast(error.message)
                                                                                                                                } else {
                                                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                                }
                                                                                                                            })
                                                                                                                            .finally(function () {
                                                                                                                                $scope.view.disabled = false;
                                                                                                                            })
                                                                                                                    })
                                                                                                                }
                                                                                                            })
                                                                                                            .error(function(error){
                                                                                                                $ionicLoading.hide();
                                                                                                                if(error.message){
                                                                                                                    PublicFunction.showToast(error.message)
                                                                                                                } else {
                                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                }
                                                                                                            })

                                                                                                    } else if ($scope.view.applicationData.formType === 2002) {
                                                                                                        //费用申请
                                                                                                        if($scope.view.applicationData.closeEnabled){
                                                                                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                                                                $scope.view.applicationData.closeDate = new Date();
                                                                                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                                                            } else {
                                                                                                                $scope.view.applicationData.closeDate = new Date();
                                                                                                            }
                                                                                                        }
                                                                                                        InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                                                            .success(function (data) {
                                                                                                                $ionicLoading.hide();
                                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                $timeout(function () {
                                                                                                                    $scope.view.goBack();
                                                                                                                }, 500);
                                                                                                            })
                                                                                                            .error(function (error) {
                                                                                                                $ionicLoading.hide();
                                                                                                                if(error.message){
                                                                                                                    PublicFunction.showToast(error.message)
                                                                                                                } else {
                                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                }
                                                                                                            })
                                                                                                            .finally(function () {
                                                                                                                $scope.view.disabled = false;
                                                                                                            })
                                                                                                    } else if ($scope.view.applicationData.formType === 2003) {
                                                                                                        //订票申请
                                                                                                        CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                                                            .success(function (data) {
                                                                                                                $ionicLoading.hide();
                                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                $timeout(function () {
                                                                                                                    $scope.view.goBack();
                                                                                                                }, 500);
                                                                                                            })
                                                                                                            .error(function (error) {
                                                                                                                $ionicLoading.hide();
                                                                                                                if(error.message){
                                                                                                                    PublicFunction.showToast(error.message)
                                                                                                                } else {
                                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                }
                                                                                                            })
                                                                                                            .finally(function () {
                                                                                                                $scope.view.disabled = false;
                                                                                                            })
                                                                                                    } else if ($scope.view.applicationData.formType === 1001) {
                                                                                                        //普通表单
                                                                                                    } else if ($scope.view.applicationData.formType === 2005) {
                                                                                                        //借款申请
                                                                                                        CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                                                            .success(function () {
                                                                                                                $ionicLoading.hide();
                                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                $scope.view.goBack();
                                                                                                            })
                                                                                                            .error(function (error) {
                                                                                                                $ionicLoading.hide();
                                                                                                                if(error.message){
                                                                                                                    PublicFunction.showToast(error.message)
                                                                                                                } else {
                                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                }
                                                                                                            })
                                                                                                            .finally(function () {
                                                                                                                $scope.view.disabled = false;
                                                                                                            })
                                                                                                    }
                                                                                                }
                                                                                            }, function () {
                                                                                                $scope.view.disabled = false;
                                                                                            })
                                                                                        }
                                                                                        else {
                                                                                            //不选择部门
                                                                                            if ($scope.view.applicationData.formType === 2001) {
                                                                                                //差旅申请
                                                                                                //差旅申请需要校验预算
                                                                                                TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                                                    .then(function (res) {
                                                                                                        //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                                                        if(res){
                                                                                                            TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                                .success(function (data) {
                                                                                                                    $ionicLoading.hide();
                                                                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                    $timeout(function () {
                                                                                                                        $scope.view.goBack();
                                                                                                                    }, 500);
                                                                                                                })
                                                                                                                .error(function (error) {
                                                                                                                    $ionicLoading.hide();
                                                                                                                    if(error.message){
                                                                                                                        PublicFunction.showToast(error.message)
                                                                                                                    } else {
                                                                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                    }
                                                                                                                })
                                                                                                                .finally(function () {
                                                                                                                    $scope.view.disabled = false;
                                                                                                                })
                                                                                                        }else{
                                                                                                            $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                                                                TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                                    .success(function (data) {
                                                                                                                        $ionicLoading.hide();
                                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                        $timeout(function () {
                                                                                                                            $scope.view.goBack();
                                                                                                                        }, 500);
                                                                                                                    })
                                                                                                                    .error(function (error) {
                                                                                                                        $ionicLoading.hide();
                                                                                                                        if(error.message){
                                                                                                                            PublicFunction.showToast(error.message)
                                                                                                                        } else {
                                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                        }
                                                                                                                    })
                                                                                                                    .finally(function () {
                                                                                                                        $scope.view.disabled = false;
                                                                                                                    })
                                                                                                            })
                                                                                                        }
                                                                                                    });

                                                                                            }
                                                                                            else if ($scope.view.applicationData.formType === 2002) {
                                                                                                //费用申请
                                                                                                if($scope.view.applicationData.closeEnabled){
                                                                                                    if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                                                        $scope.view.applicationData.closeDate = new Date();
                                                                                                        $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                                                        $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                                                    } else {
                                                                                                        $scope.view.applicationData.closeDate = new Date();
                                                                                                    }
                                                                                                }
                                                                                                InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                                                    .success(function (data) {
                                                                                                        $ionicLoading.hide();
                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                        $timeout(function () {
                                                                                                            $scope.view.goBack();
                                                                                                        }, 500);
                                                                                                    })
                                                                                                    .error(function (error) {
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })
                                                                                                    .finally(function () {
                                                                                                        $scope.view.disabled = false;
                                                                                                    })
                                                                                            } else if ($scope.view.applicationData.formType === 2003) {
                                                                                                //订票申请
                                                                                                CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                                                    .success(function (data) {
                                                                                                        $ionicLoading.hide();
                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                        $timeout(function () {
                                                                                                            $scope.view.goBack();
                                                                                                        }, 500);
                                                                                                    })
                                                                                                    .error(function (error) {
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })
                                                                                                    .finally(function () {
                                                                                                        $scope.view.disabled = false;
                                                                                                    })
                                                                                            } else if ($scope.view.applicationData.formType === 1001) {
                                                                                                //普通表单
                                                                                            } else if ($scope.view.applicationData.formType === 2005) {
                                                                                                //借款申请
                                                                                                CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                                                    .success(function () {
                                                                                                        $ionicLoading.hide();
                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                        $scope.view.goBack();
                                                                                                    })
                                                                                                    .error(function (error) {
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })
                                                                                                    .finally(function () {
                                                                                                        $scope.view.disabled = false;
                                                                                                    })
                                                                                            }
                                                                                        }
                                                                                    } else if ($scope.view.applicationData.custFormValues[$scope.view.participantIndex].required) {
                                                                                        $ionicLoading.hide();
                                                                                        PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[$scope.view.participantIndex].fieldName);
                                                                                        $scope.view.disabled = false;
                                                                                    } else if($scope.view.applicationData.formType == 2001 && (($scope.view.hasOuterMember || $scope.view.hasOuter || $scope.view.hasInter) && (($scope.view.outParticipantNum && (parseInt($scope.view.outParticipantNum) + $scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0) ||
                                                                                        (!$scope.view.outParticipantNum && ($scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0 )))){
                                                                                        $ionicLoading.hide();
                                                                                        PublicFunction.showToast($filter('translate')('custom.application.tip.add_applicant'));  //请添加参与人或外部参与人
                                                                                        $scope.view.disabled = false;
                                                                                    } else {
                                                                                        $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = null;
                                                                                        //选择部门
                                                                                        if ($scope.view.departmentOID) {
                                                                                            DepartmentService.getDepartmentInfo($scope.view.departmentOID).then(function (response) {
                                                                                                if ($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode === 1002 && !response.data.managerOID) {
                                                                                                    PublicFunction.showToast(ManagerPrompt);
                                                                                                    $timeout(function () {
                                                                                                        $ionicLoading.hide();
                                                                                                    }, 1000)
                                                                                                    $scope.view.disabled = false;
                                                                                                } else {
                                                                                                    PublicFunction.showLoading();
                                                                                                    if ($scope.view.applicationData.formType === 2001) {
                                                                                                        //差旅申请
                                                                                                        //差旅申请需要校验预算
                                                                                                        TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                                                            .success(function (res) {
                                                                                                                $ionicLoading.hide();
                                                                                                                //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                                                                if(res){
                                                                                                                    TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                                        .success(function (data) {
                                                                                                                            $ionicLoading.hide();
                                                                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                            $timeout(function () {
                                                                                                                                $scope.view.goBack();
                                                                                                                            }, 500);
                                                                                                                        })
                                                                                                                        .error(function (error) {
                                                                                                                            $ionicLoading.hide();
                                                                                                                            if(error.message){
                                                                                                                                PublicFunction.showToast(error.message)
                                                                                                                            } else {
                                                                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                            }
                                                                                                                        })
                                                                                                                        .finally(function () {
                                                                                                                            $scope.view.disabled = false;
                                                                                                                        })
                                                                                                                }else{
                                                                                                                    $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                                                                        TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                                            .success(function (data) {
                                                                                                                                $ionicLoading.hide();
                                                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                                $timeout(function () {
                                                                                                                                    $scope.view.goBack();
                                                                                                                                }, 500);
                                                                                                                            })
                                                                                                                            .error(function (error) {
                                                                                                                                $ionicLoading.hide();
                                                                                                                                if(error.message){
                                                                                                                                    PublicFunction.showToast(error.message)
                                                                                                                                } else {
                                                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                                }
                                                                                                                            })
                                                                                                                            .finally(function () {
                                                                                                                                $scope.view.disabled = false;
                                                                                                                            })
                                                                                                                    })
                                                                                                                }
                                                                                                            })
                                                                                                            .error(function(error){
                                                                                                                $ionicLoading.hide();
                                                                                                                if(error.message){
                                                                                                                    PublicFunction.showToast(error.message)
                                                                                                                } else {
                                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                }
                                                                                                            })

                                                                                                    } else if ($scope.view.applicationData.formType === 2002) {
                                                                                                        //费用申请
                                                                                                        if($scope.view.applicationData.closeEnabled){
                                                                                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                                                                $scope.view.applicationData.closeDate = new Date();
                                                                                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                                                            } else {
                                                                                                                $scope.view.applicationData.closeDate = new Date();
                                                                                                            }
                                                                                                        }
                                                                                                        InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                                                            .success(function (data) {
                                                                                                                $ionicLoading.hide();
                                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                $timeout(function () {
                                                                                                                    $scope.view.goBack();
                                                                                                                }, 500);
                                                                                                            })
                                                                                                            .error(function (error) {
                                                                                                                $ionicLoading.hide();
                                                                                                                if(error.message){
                                                                                                                    PublicFunction.showToast(error.message)
                                                                                                                } else {
                                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                }
                                                                                                            })
                                                                                                            .finally(function () {
                                                                                                                $scope.view.disabled = false;
                                                                                                            })
                                                                                                    } else if ($scope.view.applicationData.formType === 2003) {
                                                                                                        //订票申请
                                                                                                        CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                                                            .success(function (data) {
                                                                                                                $ionicLoading.hide();
                                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                $timeout(function () {
                                                                                                                    $scope.view.goBack();
                                                                                                                }, 500);
                                                                                                            })
                                                                                                            .error(function (error) {
                                                                                                                $ionicLoading.hide();
                                                                                                                if(error.message){
                                                                                                                    PublicFunction.showToast(error.message)
                                                                                                                } else {
                                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                }
                                                                                                            })
                                                                                                            .finally(function () {
                                                                                                                $scope.view.disabled = false;
                                                                                                            })
                                                                                                    } else if ($scope.view.applicationData.formType === 1001) {
                                                                                                        //普通表单
                                                                                                    } else if ($scope.view.applicationData.formType === 2005) {
                                                                                                        //借款申请
                                                                                                        CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                                                            .success(function () {
                                                                                                                $ionicLoading.hide();
                                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                $scope.view.goBack();
                                                                                                            })
                                                                                                            .error(function (error) {
                                                                                                                $ionicLoading.hide();
                                                                                                                if(error.message){
                                                                                                                    PublicFunction.showToast(error.message)
                                                                                                                } else {
                                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                }
                                                                                                            })
                                                                                                            .finally(function () {
                                                                                                                $scope.view.disabled = false;
                                                                                                            })
                                                                                                    }
                                                                                                }
                                                                                            }, function () {
                                                                                                $scope.view.disabled = false;
                                                                                            })
                                                                                        }
                                                                                        else {
                                                                                            //不选择部门
                                                                                            if ($scope.view.applicationData.formType === 2001) {
                                                                                                //差旅申请
                                                                                                //差旅申请需要校验预算
                                                                                                TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                                                    .then(function (res) {
                                                                                                        //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                                                        if(res){
                                                                                                            TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                                .success(function (data) {
                                                                                                                    $ionicLoading.hide();
                                                                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                    $timeout(function () {
                                                                                                                        $scope.view.goBack();
                                                                                                                    }, 500);
                                                                                                                })
                                                                                                                .error(function (error) {
                                                                                                                    $ionicLoading.hide();
                                                                                                                    if(error.message){
                                                                                                                        PublicFunction.showToast(error.message)
                                                                                                                    } else {
                                                                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                    }
                                                                                                                })
                                                                                                                .finally(function () {
                                                                                                                    $scope.view.disabled = false;
                                                                                                                })
                                                                                                        }else{
                                                                                                            $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                                                                TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                                    .success(function (data) {
                                                                                                                        $ionicLoading.hide();
                                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                        $timeout(function () {
                                                                                                                            $scope.view.goBack();
                                                                                                                        }, 500);
                                                                                                                    })
                                                                                                                    .error(function (error) {
                                                                                                                        $ionicLoading.hide();
                                                                                                                        if(error.message){
                                                                                                                            PublicFunction.showToast(error.message)
                                                                                                                        } else {
                                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                        }
                                                                                                                    })
                                                                                                                    .finally(function () {
                                                                                                                        $scope.view.disabled = false;
                                                                                                                    })
                                                                                                            })
                                                                                                        }
                                                                                                    });

                                                                                            }
                                                                                            else if ($scope.view.applicationData.formType === 2002) {
                                                                                                //费用申请
                                                                                                if($scope.view.applicationData.closeEnabled){
                                                                                                    if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                                                        $scope.view.applicationData.closeDate = new Date();
                                                                                                        $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                                                        $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                                                    } else {
                                                                                                        $scope.view.applicationData.closeDate = new Date();
                                                                                                    }
                                                                                                }
                                                                                                InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                                                    .success(function (data) {
                                                                                                        $ionicLoading.hide();
                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                        $timeout(function () {
                                                                                                            $scope.view.goBack();
                                                                                                        }, 500);
                                                                                                    })
                                                                                                    .error(function (error) {
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })
                                                                                                    .finally(function () {
                                                                                                        $scope.view.disabled = false;
                                                                                                    })
                                                                                            } else if ($scope.view.applicationData.formType === 2003) {
                                                                                                //订票申请
                                                                                                CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                                                    .success(function (data) {
                                                                                                        $ionicLoading.hide();
                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                        $timeout(function () {
                                                                                                            $scope.view.goBack();
                                                                                                        }, 500);
                                                                                                    })
                                                                                                    .error(function (error) {
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })
                                                                                                    .finally(function () {
                                                                                                        $scope.view.disabled = false;
                                                                                                    })
                                                                                            } else if ($scope.view.applicationData.formType === 1001) {
                                                                                                //普通表单
                                                                                            } else if ($scope.view.applicationData.formType === 2005) {
                                                                                                //借款申请
                                                                                                CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                                                    .success(function () {
                                                                                                        $ionicLoading.hide();
                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                        $scope.view.goBack();
                                                                                                    })
                                                                                                    .error(function (error) {
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })
                                                                                                    .finally(function () {
                                                                                                        $scope.view.disabled = false;
                                                                                                    })
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            } else {
                                                                                $scope.view.disabled = false;
                                                                                $ionicLoading.hide();
                                                                            }
                                                                        })
                                                                    }
                                                                    else {
                                                                        //选择部门
                                                                        if ($scope.view.departmentOID) {
                                                                            DepartmentService.getDepartmentInfo($scope.view.departmentOID).then(function (response) {
                                                                                if ($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode === 1002 && !response.data.managerOID) {
                                                                                    PublicFunction.showToast(ManagerPrompt);
                                                                                    $timeout(function () {
                                                                                        $ionicLoading.hide();
                                                                                    }, 1000)
                                                                                    $scope.view.disabled = false;
                                                                                } else {
                                                                                    PublicFunction.showLoading();
                                                                                    if ($scope.view.applicationData.formType === 2001) {
                                                                                        //差旅申请
                                                                                        //差旅申请需要校验预算
                                                                                        TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                                            .success(function (res) {
                                                                                                $ionicLoading.hide();
                                                                                                //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                                                if(res){
                                                                                                    TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                        .success(function (data) {
                                                                                                            $ionicLoading.hide();
                                                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                            $timeout(function () {
                                                                                                                $scope.view.goBack();
                                                                                                            }, 500);
                                                                                                        })
                                                                                                        .error(function (error) {
                                                                                                            $ionicLoading.hide();
                                                                                                            if(error.message){
                                                                                                                PublicFunction.showToast(error.message)
                                                                                                            } else {
                                                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                            }
                                                                                                        })
                                                                                                        .finally(function () {
                                                                                                            $scope.view.disabled = false;
                                                                                                        })
                                                                                                }else{
                                                                                                    $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                                                        TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                            .success(function (data) {
                                                                                                                $ionicLoading.hide();
                                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                $timeout(function () {
                                                                                                                    $scope.view.goBack();
                                                                                                                }, 500);
                                                                                                            })
                                                                                                            .error(function (error) {
                                                                                                                $ionicLoading.hide();
                                                                                                                if(error.message){
                                                                                                                    PublicFunction.showToast(error.message)
                                                                                                                } else {
                                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                }
                                                                                                            })
                                                                                                            .finally(function () {
                                                                                                                $scope.view.disabled = false;
                                                                                                            })
                                                                                                    })
                                                                                                }
                                                                                            })
                                                                                            .error(function(error){
                                                                                                $ionicLoading.hide();
                                                                                                if(error.message){
                                                                                                    PublicFunction.showToast(error.message)
                                                                                                } else {
                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                }
                                                                                            })

                                                                                    } else if ($scope.view.applicationData.formType === 2002) {
                                                                                        //费用申请
                                                                                        if($scope.view.applicationData.closeEnabled){
                                                                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                                                $scope.view.applicationData.closeDate = new Date();
                                                                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                                            } else {
                                                                                                $scope.view.applicationData.closeDate = new Date();
                                                                                            }
                                                                                        }
                                                                                        InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                                            .success(function (data) {
                                                                                                $ionicLoading.hide();
                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                $timeout(function () {
                                                                                                    $scope.view.goBack();
                                                                                                }, 500);
                                                                                            })
                                                                                            .error(function (error) {
                                                                                                $ionicLoading.hide();
                                                                                                if(error.message){
                                                                                                    PublicFunction.showToast(error.message)
                                                                                                } else {
                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                }
                                                                                            })
                                                                                            .finally(function () {
                                                                                                $scope.view.disabled = false;
                                                                                            })
                                                                                    } else if ($scope.view.applicationData.formType === 2003) {
                                                                                        //订票申请
                                                                                        CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                                            .success(function (data) {
                                                                                                $ionicLoading.hide();
                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                $timeout(function () {
                                                                                                    $scope.view.goBack();
                                                                                                }, 500);
                                                                                            })
                                                                                            .error(function (error) {
                                                                                                $ionicLoading.hide();
                                                                                                if(error.message){
                                                                                                    PublicFunction.showToast(error.message)
                                                                                                } else {
                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                }
                                                                                            })
                                                                                            .finally(function () {
                                                                                                $scope.view.disabled = false;
                                                                                            })
                                                                                    } else if ($scope.view.applicationData.formType === 1001) {
                                                                                        //普通表单
                                                                                    } else if ($scope.view.applicationData.formType === 2005) {
                                                                                        //借款申请
                                                                                        CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                                            .success(function () {
                                                                                                $ionicLoading.hide();
                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                $scope.view.goBack();
                                                                                            })
                                                                                            .error(function (error) {
                                                                                                $ionicLoading.hide();
                                                                                                if(error.message){
                                                                                                    PublicFunction.showToast(error.message)
                                                                                                } else {
                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                }
                                                                                            })
                                                                                            .finally(function () {
                                                                                                $scope.view.disabled = false;
                                                                                            })
                                                                                    }
                                                                                }
                                                                            }, function () {
                                                                                $scope.view.disabled = false;
                                                                            })
                                                                        }
                                                                        else {
                                                                            //不选择部门
                                                                            if ($scope.view.applicationData.formType === 2001) {
                                                                                //差旅申请
                                                                                //差旅申请需要校验预算
                                                                                TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                                    .then(function (res) {
                                                                                        //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                                        if(res){
                                                                                            TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                .success(function (data) {
                                                                                                    $ionicLoading.hide();
                                                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                    $timeout(function () {
                                                                                                        $scope.view.goBack();
                                                                                                    }, 500);
                                                                                                })
                                                                                                .error(function (error) {
                                                                                                    $ionicLoading.hide();
                                                                                                    if(error.message){
                                                                                                        PublicFunction.showToast(error.message)
                                                                                                    } else {
                                                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                    }
                                                                                                })
                                                                                                .finally(function () {
                                                                                                    $scope.view.disabled = false;
                                                                                                })
                                                                                        }else{
                                                                                            $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                                                TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                    .success(function (data) {
                                                                                                        $ionicLoading.hide();
                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                        $timeout(function () {
                                                                                                            $scope.view.goBack();
                                                                                                        }, 500);
                                                                                                    })
                                                                                                    .error(function (error) {
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })
                                                                                                    .finally(function () {
                                                                                                        $scope.view.disabled = false;
                                                                                                    })
                                                                                            })
                                                                                        }
                                                                                    });

                                                                            }
                                                                            else if ($scope.view.applicationData.formType === 2002) {
                                                                                //费用申请
                                                                                if($scope.view.applicationData.closeEnabled){
                                                                                    if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                                        $scope.view.applicationData.closeDate = new Date();
                                                                                        $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                                        $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                                    } else {
                                                                                        $scope.view.applicationData.closeDate = new Date();
                                                                                    }
                                                                                }
                                                                                InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                                    .success(function (data) {
                                                                                        $ionicLoading.hide();
                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                        $timeout(function () {
                                                                                            $scope.view.goBack();
                                                                                        }, 500);
                                                                                    })
                                                                                    .error(function (error) {
                                                                                        $ionicLoading.hide();
                                                                                        if(error.message){
                                                                                            PublicFunction.showToast(error.message)
                                                                                        } else {
                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                        }
                                                                                    })
                                                                                    .finally(function () {
                                                                                        $scope.view.disabled = false;
                                                                                    })
                                                                            } else if ($scope.view.applicationData.formType === 2003) {
                                                                                //订票申请
                                                                                CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                                    .success(function (data) {
                                                                                        $ionicLoading.hide();
                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                        $timeout(function () {
                                                                                            $scope.view.goBack();
                                                                                        }, 500);
                                                                                    })
                                                                                    .error(function (error) {
                                                                                        $ionicLoading.hide();
                                                                                        if(error.message){
                                                                                            PublicFunction.showToast(error.message)
                                                                                        } else {
                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                        }
                                                                                    })
                                                                                    .finally(function () {
                                                                                        $scope.view.disabled = false;
                                                                                    })
                                                                            } else if ($scope.view.applicationData.formType === 1001) {
                                                                                //普通表单
                                                                            } else if ($scope.view.applicationData.formType === 2005) {
                                                                                //借款申请
                                                                                CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                                    .success(function () {
                                                                                        $ionicLoading.hide();
                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                        $scope.view.goBack();
                                                                                    })
                                                                                    .error(function (error) {
                                                                                        $ionicLoading.hide();
                                                                                        if(error.message){
                                                                                            PublicFunction.showToast(error.message)
                                                                                        } else {
                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                        }
                                                                                    })
                                                                                    .finally(function () {
                                                                                        $scope.view.disabled = false;
                                                                                    })
                                                                            }
                                                                        }
                                                                    }

                                                                }
                                                            })
                                                            .error(function (error) {
                                                                $scope.view.disabled = false;
                                                                $ionicLoading.hide();

                                                                if(error && error.validationErrors && error.validationErrors.length > 0 && error.validationErrors[0].externalPropertyName){
                                                                    // 2010: 申请人为空  2011:部门为空  2012：成本中心为空
                                                                    if(error.validationErrors[0].externalPropertyName == '2012'){
                                                                        PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_costCenter')); //请先选择成本中心
                                                                    } else if(error.validationErrors[0].externalPropertyName == '2010'){
                                                                        PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_applicant')); //请先选择申请人
                                                                    } else if(error.validationErrors[0].externalPropertyName == '2011'){
                                                                        PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_department')); //请先选择部门
                                                                    }
                                                                } else {
                                                                    PublicFunction.showToast($filter('translate')('custom.application.tip.check_appliant_error')); //校验参与人数据权限出错
                                                                }


                                                            })
                                                    }
                                                }
                                                else {
                                                    //选择部门
                                                    if ($scope.view.departmentOID) {
                                                        DepartmentService.getDepartmentInfo($scope.view.departmentOID).then(function (response) {
                                                            if ($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode === 1002 && !response.data.managerOID) {
                                                                PublicFunction.showToast(ManagerPrompt);
                                                                $timeout(function () {
                                                                    $ionicLoading.hide();
                                                                }, 1000)
                                                                $scope.view.disabled = false;
                                                            } else {
                                                                PublicFunction.showLoading();
                                                                if ($scope.view.applicationData.formType === 2001) {
                                                                    //差旅申请
                                                                    //差旅申请需要校验预算
                                                                    TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                        .success(function (res) {
                                                                            $ionicLoading.hide();
                                                                            //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                            if(res){
                                                                                TravelERVService.submitTravel($scope.view.applicationData)
                                                                                    .success(function (data) {
                                                                                        $ionicLoading.hide();
                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                        $timeout(function () {
                                                                                            $scope.view.goBack();
                                                                                        }, 500);
                                                                                    })
                                                                                    .error(function (error) {
                                                                                        $ionicLoading.hide();
                                                                                        if(error.message){
                                                                                            PublicFunction.showToast(error.message)
                                                                                        } else {
                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                        }
                                                                                    })
                                                                                    .finally(function () {
                                                                                        $scope.view.disabled = false;
                                                                                    })
                                                                            }else{
                                                                                $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                                    TravelERVService.submitTravel($scope.view.applicationData)
                                                                                        .success(function (data) {
                                                                                            $ionicLoading.hide();
                                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                            $timeout(function () {
                                                                                                $scope.view.goBack();
                                                                                            }, 500);
                                                                                        })
                                                                                        .error(function (error) {
                                                                                            $ionicLoading.hide();
                                                                                            if(error.message){
                                                                                                PublicFunction.showToast(error.message)
                                                                                            } else {
                                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                                            }
                                                                                        })
                                                                                        .finally(function () {
                                                                                            $scope.view.disabled = false;
                                                                                        })
                                                                                })
                                                                            }
                                                                        })
                                                                        .error(function(error){
                                                                            $ionicLoading.hide();
                                                                            if(error.message){
                                                                                PublicFunction.showToast(error.message)
                                                                            } else {
                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                            }
                                                                        })

                                                                } else if ($scope.view.applicationData.formType === 2002) {
                                                                    //费用申请
                                                                    if($scope.view.applicationData.closeEnabled){
                                                                        if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                            $scope.view.applicationData.closeDate = new Date();
                                                                            $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                            $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                        } else {
                                                                            $scope.view.applicationData.closeDate = new Date();
                                                                        }
                                                                    }
                                                                    InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                        .success(function (data) {
                                                                            $ionicLoading.hide();
                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                            $timeout(function () {
                                                                                $scope.view.goBack();
                                                                            }, 500);
                                                                        })
                                                                        .error(function (error) {
                                                                            $ionicLoading.hide();
                                                                            if(error.message){
                                                                                PublicFunction.showToast(error.message)
                                                                            } else {
                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                            }
                                                                        })
                                                                        .finally(function () {
                                                                            $scope.view.disabled = false;
                                                                        })
                                                                } else if ($scope.view.applicationData.formType === 2003) {
                                                                    //订票申请
                                                                    CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                        .success(function (data) {
                                                                            $ionicLoading.hide();
                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                            $timeout(function () {
                                                                                $scope.view.goBack();
                                                                            }, 500);
                                                                        })
                                                                        .error(function (error) {
                                                                            $ionicLoading.hide();
                                                                            if(error.message){
                                                                                PublicFunction.showToast(error.message)
                                                                            } else {
                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                            }
                                                                        })
                                                                        .finally(function () {
                                                                            $scope.view.disabled = false;
                                                                        })
                                                                } else if ($scope.view.applicationData.formType === 1001) {
                                                                    //普通表单
                                                                } else if ($scope.view.applicationData.formType === 2005) {
                                                                    //借款申请
                                                                    CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                        .success(function () {
                                                                            $ionicLoading.hide();
                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                            $scope.view.goBack();
                                                                        })
                                                                        .error(function (error) {
                                                                            $ionicLoading.hide();
                                                                            if(error.message){
                                                                                PublicFunction.showToast(error.message)
                                                                            } else {
                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                            }
                                                                        })
                                                                        .finally(function () {
                                                                            $scope.view.disabled = false;
                                                                        })
                                                                }
                                                            }
                                                        }, function () {
                                                            $scope.view.disabled = false;
                                                        })
                                                    }
                                                    else {
                                                        //不选择部门
                                                        if ($scope.view.applicationData.formType === 2001) {
                                                            //差旅申请
                                                            //差旅申请需要校验预算
                                                            TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                .then(function (res) {
                                                                    //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                    if(res){
                                                                        TravelERVService.submitTravel($scope.view.applicationData)
                                                                            .success(function (data) {
                                                                                $ionicLoading.hide();
                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                $timeout(function () {
                                                                                    $scope.view.goBack();
                                                                                }, 500);
                                                                            })
                                                                            .error(function (error) {
                                                                                $ionicLoading.hide();
                                                                                if(error.message){
                                                                                    PublicFunction.showToast(error.message)
                                                                                } else {
                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                }
                                                                            })
                                                                            .finally(function () {
                                                                                $scope.view.disabled = false;
                                                                            })
                                                                    }else{
                                                                        $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                            TravelERVService.submitTravel($scope.view.applicationData)
                                                                                .success(function (data) {
                                                                                    $ionicLoading.hide();
                                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                    $timeout(function () {
                                                                                        $scope.view.goBack();
                                                                                    }, 500);
                                                                                })
                                                                                .error(function (error) {
                                                                                    $ionicLoading.hide();
                                                                                    if(error.message){
                                                                                        PublicFunction.showToast(error.message)
                                                                                    } else {
                                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                                    }
                                                                                })
                                                                                .finally(function () {
                                                                                    $scope.view.disabled = false;
                                                                                })
                                                                        })
                                                                    }
                                                                });

                                                        }
                                                        else if ($scope.view.applicationData.formType === 2002) {
                                                            //费用申请
                                                            if($scope.view.applicationData.closeEnabled){
                                                                if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                    $scope.view.applicationData.closeDate = new Date();
                                                                    $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                    $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                } else {
                                                                    $scope.view.applicationData.closeDate = new Date();
                                                                }
                                                            }
                                                            InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                .success(function (data) {
                                                                    $ionicLoading.hide();
                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                    $timeout(function () {
                                                                        $scope.view.goBack();
                                                                    }, 500);
                                                                })
                                                                .error(function (error) {
                                                                    $ionicLoading.hide();
                                                                    if(error.message){
                                                                        PublicFunction.showToast(error.message)
                                                                    } else {
                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                    }
                                                                })
                                                                .finally(function () {
                                                                    $scope.view.disabled = false;
                                                                })
                                                        } else if ($scope.view.applicationData.formType === 2003) {
                                                            //订票申请
                                                            CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                .success(function (data) {
                                                                    $ionicLoading.hide();
                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                    $timeout(function () {
                                                                        $scope.view.goBack();
                                                                    }, 500);
                                                                })
                                                                .error(function (error) {
                                                                    $ionicLoading.hide();
                                                                    if(error.message){
                                                                        PublicFunction.showToast(error.message)
                                                                    } else {
                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                    }
                                                                })
                                                                .finally(function () {
                                                                    $scope.view.disabled = false;
                                                                })
                                                        } else if ($scope.view.applicationData.formType === 1001) {
                                                            //普通表单
                                                        } else if ($scope.view.applicationData.formType === 2005) {
                                                            //借款申请
                                                            CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                .success(function () {
                                                                    $ionicLoading.hide();
                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                    $scope.view.goBack();
                                                                })
                                                                .error(function (error) {
                                                                    $ionicLoading.hide();
                                                                    if(error.message){
                                                                        PublicFunction.showToast(error.message)
                                                                    } else {
                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                    }
                                                                })
                                                                .finally(function () {
                                                                    $scope.view.disabled = false;
                                                                })
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                        else {
                                            $scope.view.disabled = false;
                                        }
                                    })
                                }
                                else {
                                    if($scope.view.applicationData.formType == 2001 && (($scope.view.hasOuterMember || $scope.view.hasOuter || $scope.view.hasInter) && (($scope.view.outParticipantNum && (parseInt($scope.view.outParticipantNum) + $scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0) ||
                                        (!$scope.view.outParticipantNum && ($scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0 )))){
                                        PublicFunction.showToast($filter('translate')('custom.application.tip.add_applicant'));  //请添加参与人或外部参与人
                                        $scope.view.disabled = false;
                                    }
                                    else {
                                        PublicFunction.showLoading();
                                        //校验参与人是否符合数据权限
                                        if($scope.view.interMemberList.length > 0){
                                            var finish = false;
                                            var userList = [];
                                            for(var i = 0; i < $scope.view.interMemberList.length; i++){
                                                userList.push($scope.view.interMemberList[i].userOID);
                                                if(i >= $scope.view.interMemberList.length -1){
                                                    finish = true;
                                                }
                                            }
                                            if(finish){
                                                $scope.view.authorityData.participantsOID = angular.copy(userList);
                                                CustomApplicationServices.getUserInForm($scope.view.authorityData)
                                                    .success(function (data) {
                                                        var loopFinish = false;
                                                        $scope.view.errorUserOID = [];
                                                        $scope.view.errorUserName = '';
                                                        for(var i = 0; i < data.length; i++){
                                                            if(data[i].errorDetail != null && data[i].errorDetail != '' && data[i].errorDetail != undefined){
                                                                if($scope.view.errorUserOID.length == 0){
                                                                    $scope.view.errorUserOID.push(data[i].userOID);
                                                                    $scope.view.errorUserName += data[i].fullName;
                                                                } else {
                                                                    $scope.view.errorUserOID.push(data[i].userOID);
                                                                    $scope.view.errorUserName += '、' + data[i].fullName;
                                                                }
                                                            }
                                                            if(i >= (data.length -1)){
                                                                loopFinish = true;
                                                            }
                                                        }
                                                        if(loopFinish){
                                                            if($scope.view.errorUserOID.length > 0){
                                                                $ionicLoading.hide();
                                                                var confirmPopup = $ionicPopup.confirm({
                                                                    scope: $scope,
                                                                    title: $filter('translate')('custom.application.tip.applicant'), //参与人员提示
                                                                    template: '<p style="text-align: center">' + $scope.view.errorUserName + $filter("translate")("custom.application.tip.error_applicant_mssage") +' </p>' +  //不在可选参与人范围内，是否删除以上人员
                                                                    '<span ng-if="view.applicationData.travelApplication && view.applicationData.travelApplication.travelSubsidies && view.applicationData.travelApplication.travelSubsidies.length > 0">*' + $filter("translate")("custom.application.tip.delete_all_allowance") + '</span>',  //更改参与人员将清空已添加的差补，您需重新添加餐补
                                                                    cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                                    cancelType: 'button-calm',
                                                                    okText: $filter('translate')('custom.application.button.sure_delete'),  //确认删除
                                                                    cssClass: 'stop-time-popup'
                                                                });
                                                                confirmPopup.then(function (res) {
                                                                    if (res) {
                                                                        PublicFunction.showLoading();
                                                                        var i =0;
                                                                        var interMemberListCopy = [];
                                                                        for(; i < $scope.view.interMemberList.length; i++){
                                                                            if($scope.view.errorUserOID.indexOf($scope.view.interMemberList[i].userOID) == -1){
                                                                                interMemberListCopy.push($scope.view.interMemberList[i]);
                                                                            }
                                                                        }
                                                                        if(i == $scope.view.interMemberList.length){
                                                                            $scope.view.interMemberList = angular.copy(interMemberListCopy);
                                                                            if ($scope.view.interMemberList.length > 0) {
                                                                                $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = JSON.stringify(interMemberListCopy);
                                                                                //选择部门
                                                                                if ($scope.view.departmentOID) {
                                                                                    DepartmentService.getDepartmentInfo($scope.view.departmentOID).then(function (response) {
                                                                                        if ($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode === 1002 && !response.data.managerOID) {
                                                                                            PublicFunction.showToast(ManagerPrompt);
                                                                                            $timeout(function () {
                                                                                                $ionicLoading.hide();
                                                                                            }, 1000);
                                                                                            $scope.view.disabled = false;
                                                                                        } else {
                                                                                            PublicFunction.showLoading();
                                                                                            if ($scope.view.applicationData.formType === 2001) {
                                                                                                //差旅申请
                                                                                                //差旅申请需要校验预算
                                                                                                TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                                                    .success(function (res) {
                                                                                                        $ionicLoading.hide();
                                                                                                        //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                                                        if(res){
                                                                                                            TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                                .success(function (data) {
                                                                                                                    $ionicLoading.hide();
                                                                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                    $timeout(function () {
                                                                                                                        $scope.view.goBack();
                                                                                                                    }, 500);
                                                                                                                })
                                                                                                                .error(function (error) {
                                                                                                                    $ionicLoading.hide();
                                                                                                                    if(error.message){
                                                                                                                        PublicFunction.showToast(error.message)
                                                                                                                    } else {
                                                                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                    }
                                                                                                                })
                                                                                                                .finally(function () {
                                                                                                                    $scope.view.disabled = false;
                                                                                                                })
                                                                                                        }else{
                                                                                                            $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                                                                TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                                    .success(function (data) {
                                                                                                                        $ionicLoading.hide();
                                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                        $timeout(function () {
                                                                                                                            $scope.view.goBack();
                                                                                                                        }, 500);
                                                                                                                    })
                                                                                                                    .error(function (error) {
                                                                                                                        $ionicLoading.hide();
                                                                                                                        if(error.message){
                                                                                                                            PublicFunction.showToast(error.message)
                                                                                                                        } else {
                                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                        }
                                                                                                                    })
                                                                                                                    .finally(function () {
                                                                                                                        $scope.view.disabled = false;
                                                                                                                    })
                                                                                                            })
                                                                                                        }
                                                                                                    })
                                                                                                    .error(function(error){
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })

                                                                                            } else if ($scope.view.applicationData.formType === 2002) {
                                                                                                //费用申请
                                                                                                if($scope.view.applicationData.closeEnabled){
                                                                                                    if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                                                        $scope.view.applicationData.closeDate = new Date();
                                                                                                        $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                                                        $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                                                    } else {
                                                                                                        $scope.view.applicationData.closeDate = new Date();
                                                                                                    }
                                                                                                }
                                                                                                InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                                                    .success(function (data) {
                                                                                                        $ionicLoading.hide();
                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                        $timeout(function () {
                                                                                                            $scope.view.goBack();
                                                                                                        }, 500);
                                                                                                    })
                                                                                                    .error(function (error) {
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })
                                                                                                    .finally(function () {
                                                                                                        $scope.view.disabled = false;
                                                                                                    })
                                                                                            } else if ($scope.view.applicationData.formType === 2003) {
                                                                                                //订票申请
                                                                                                CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                                                    .success(function (data) {
                                                                                                        $ionicLoading.hide();
                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                        $timeout(function () {
                                                                                                            $scope.view.goBack();
                                                                                                        }, 500);
                                                                                                    })
                                                                                                    .error(function (error) {
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })
                                                                                                    .finally(function () {
                                                                                                        $scope.view.disabled = false;
                                                                                                    })
                                                                                            } else if ($scope.view.applicationData.formType === 1001) {
                                                                                                //普通表单
                                                                                            } else if ($scope.view.applicationData.formType === 2005) {
                                                                                                //借款申请
                                                                                                CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                                                    .success(function () {
                                                                                                        $ionicLoading.hide();
                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                        $scope.view.goBack();
                                                                                                    })
                                                                                                    .error(function (error) {
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })
                                                                                                    .finally(function () {
                                                                                                        $scope.view.disabled = false;
                                                                                                    })
                                                                                            }
                                                                                        }
                                                                                    }, function () {
                                                                                        $scope.view.disabled = false;
                                                                                    })
                                                                                }
                                                                                else {
                                                                                    //不选择部门
                                                                                    if ($scope.view.applicationData.formType === 2001) {
                                                                                        //差旅申请
                                                                                        //差旅申请需要校验预算
                                                                                        TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                                            .then(function (res) {
                                                                                                //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                                                if(res){
                                                                                                    TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                        .success(function (data) {
                                                                                                            $ionicLoading.hide();
                                                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                            $timeout(function () {
                                                                                                                $scope.view.goBack();
                                                                                                            }, 500);
                                                                                                        })
                                                                                                        .error(function (error) {
                                                                                                            $ionicLoading.hide();
                                                                                                            if(error.message){
                                                                                                                PublicFunction.showToast(error.message)
                                                                                                            } else {
                                                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                            }
                                                                                                        })
                                                                                                        .finally(function () {
                                                                                                            $scope.view.disabled = false;
                                                                                                        })
                                                                                                }else{
                                                                                                    $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                                                        TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                            .success(function (data) {
                                                                                                                $ionicLoading.hide();
                                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                                $timeout(function () {
                                                                                                                    $scope.view.goBack();
                                                                                                                }, 500);
                                                                                                            })
                                                                                                            .error(function (error) {
                                                                                                                $ionicLoading.hide();
                                                                                                                if(error.message){
                                                                                                                    PublicFunction.showToast(error.message)
                                                                                                                } else {
                                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                                }
                                                                                                            })
                                                                                                            .finally(function () {
                                                                                                                $scope.view.disabled = false;
                                                                                                            })
                                                                                                    })
                                                                                                }
                                                                                            });

                                                                                    }
                                                                                    else if ($scope.view.applicationData.formType === 2002) {
                                                                                        //费用申请
                                                                                        if($scope.view.applicationData.closeEnabled){
                                                                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                                                $scope.view.applicationData.closeDate = new Date();
                                                                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                                            } else {
                                                                                                $scope.view.applicationData.closeDate = new Date();
                                                                                            }
                                                                                        }
                                                                                        InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                                            .success(function (data) {
                                                                                                $ionicLoading.hide();
                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                $timeout(function () {
                                                                                                    $scope.view.goBack();
                                                                                                }, 500);
                                                                                            })
                                                                                            .error(function (error) {
                                                                                                $ionicLoading.hide();
                                                                                                if(error.message){
                                                                                                    PublicFunction.showToast(error.message)
                                                                                                } else {
                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                }
                                                                                            })
                                                                                            .finally(function () {
                                                                                                $scope.view.disabled = false;
                                                                                            })
                                                                                    } else if ($scope.view.applicationData.formType === 2003) {
                                                                                        //订票申请
                                                                                        CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                                            .success(function (data) {
                                                                                                $ionicLoading.hide();
                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                $timeout(function () {
                                                                                                    $scope.view.goBack();
                                                                                                }, 500);
                                                                                            })
                                                                                            .error(function (error) {
                                                                                                $ionicLoading.hide();
                                                                                                if(error.message){
                                                                                                    PublicFunction.showToast(error.message)
                                                                                                } else {
                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                }
                                                                                            })
                                                                                            .finally(function () {
                                                                                                $scope.view.disabled = false;
                                                                                            })
                                                                                    } else if ($scope.view.applicationData.formType === 1001) {
                                                                                        //普通表单
                                                                                    } else if ($scope.view.applicationData.formType === 2005) {
                                                                                        //借款申请
                                                                                        CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                                            .success(function () {
                                                                                                $ionicLoading.hide();
                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                $scope.view.goBack();
                                                                                            })
                                                                                            .error(function (error) {
                                                                                                $ionicLoading.hide();
                                                                                                if(error.message){
                                                                                                    PublicFunction.showToast(error.message)
                                                                                                } else {
                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                }
                                                                                            })
                                                                                            .finally(function () {
                                                                                                $scope.view.disabled = false;
                                                                                            })
                                                                                    }
                                                                                }
                                                                            }
                                                                            else if ($scope.view.applicationData.custFormValues[$scope.view.participantIndex].required) {
                                                                                $ionicLoading.hide();
                                                                                PublicFunction.showToast($filter('translate')('form.please.input') + $scope.view.applicationData.custFormValues[$scope.view.participantIndex].fieldName);
                                                                                $scope.view.disabled = false;
                                                                            } else if($scope.view.applicationData.formType == 2001 && (($scope.view.hasOuterMember || $scope.view.hasOuter || $scope.view.hasInter) && (($scope.view.outParticipantNum && (parseInt($scope.view.outParticipantNum) + $scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0) ||
                                                                                (!$scope.view.outParticipantNum && ($scope.view.outerMemberList.length + $scope.view.interMemberList.length) == 0 )))){
                                                                                $ionicLoading.hide();
                                                                                PublicFunction.showToast($filter('translate')('custom.application.tip.add_applicant'));  //请添加参与人或外部参与人
                                                                                $scope.view.disabled = false;
                                                                            } else {
                                                                                $scope.view.applicationData.custFormValues[$scope.view.participantIndex].value = null;
                                                                                PublicFunction.showLoading();
                                                                                if ($scope.view.applicationData.formType === 2001) {
                                                                                    //差旅申请
                                                                                    //差旅申请需要校验预算
                                                                                    TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                                        .success(function (res) {
                                                                                            $ionicLoading.hide();
                                                                                            //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                                            if(res){
                                                                                                TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                    .success(function (data) {
                                                                                                        $ionicLoading.hide();
                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                        $timeout(function () {
                                                                                                            $scope.view.goBack();
                                                                                                        }, 500);
                                                                                                    })
                                                                                                    .error(function (error) {
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })
                                                                                                    .finally(function () {
                                                                                                        $scope.view.disabled = false;
                                                                                                    })
                                                                                            }else{
                                                                                                $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                                                    TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                        .success(function (data) {
                                                                                                            $ionicLoading.hide();
                                                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                            $timeout(function () {
                                                                                                                $scope.view.goBack();
                                                                                                            }, 500);
                                                                                                        })
                                                                                                        .error(function (error) {
                                                                                                            $ionicLoading.hide();
                                                                                                            if(error.message){
                                                                                                                PublicFunction.showToast(error.message)
                                                                                                            } else {
                                                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                            }
                                                                                                        })
                                                                                                        .finally(function () {
                                                                                                            $scope.view.disabled = false;
                                                                                                        })
                                                                                                })
                                                                                            }
                                                                                        })
                                                                                        .error(function(error){
                                                                                            $ionicLoading.hide();
                                                                                            if(error.message){
                                                                                                PublicFunction.showToast(error.message)
                                                                                            } else {
                                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                                            }
                                                                                        })

                                                                                } else if ($scope.view.applicationData.formType === 2002) {
                                                                                    //费用申请
                                                                                    if($scope.view.applicationData.closeEnabled){
                                                                                        if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                                            $scope.view.applicationData.closeDate = new Date();
                                                                                            $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                                            $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                                        } else {
                                                                                            $scope.view.applicationData.closeDate = new Date();
                                                                                        }
                                                                                    }
                                                                                    InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                                        .success(function (data) {
                                                                                            $ionicLoading.hide();
                                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                            $timeout(function () {
                                                                                                $scope.view.goBack();
                                                                                            }, 500);
                                                                                        })
                                                                                        .error(function (error) {
                                                                                            $ionicLoading.hide();
                                                                                            if(error.message){
                                                                                                PublicFunction.showToast(error.message)
                                                                                            } else {
                                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                                            }
                                                                                        })
                                                                                        .finally(function () {
                                                                                            $scope.view.disabled = false;
                                                                                        })
                                                                                } else if ($scope.view.applicationData.formType === 2003) {
                                                                                    //订票申请
                                                                                    CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                                        .success(function (data) {
                                                                                            $ionicLoading.hide();
                                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                            $timeout(function () {
                                                                                                $scope.view.goBack();
                                                                                            }, 500);
                                                                                        })
                                                                                        .error(function (error) {
                                                                                            $ionicLoading.hide();
                                                                                            if(error.message){
                                                                                                PublicFunction.showToast(error.message)
                                                                                            } else {
                                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                                            }
                                                                                        })
                                                                                        .finally(function () {
                                                                                            $scope.view.disabled = false;
                                                                                        })
                                                                                } else if ($scope.view.applicationData.formType === 1001) {
                                                                                    //普通表单
                                                                                } else if ($scope.view.applicationData.formType === 2005) {
                                                                                    //借款申请
                                                                                    CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                                        .success(function () {
                                                                                            $ionicLoading.hide();
                                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                            $scope.view.goBack();
                                                                                        })
                                                                                        .error(function (error) {
                                                                                            $ionicLoading.hide();
                                                                                            if(error.message){
                                                                                                PublicFunction.showToast(error.message)
                                                                                            } else {
                                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                                            }
                                                                                        })
                                                                                        .finally(function () {
                                                                                            $scope.view.disabled = false;
                                                                                        })
                                                                                }
                                                                            }
                                                                        }
                                                                    } else {
                                                                        $scope.view.disabled = false;
                                                                        $ionicLoading.hide();
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                //选择部门
                                                                if ($scope.view.departmentOID) {
                                                                    DepartmentService.getDepartmentInfo($scope.view.departmentOID).then(function (response) {
                                                                        if ($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode === 1002 && !response.data.managerOID) {
                                                                            PublicFunction.showToast(ManagerPrompt);
                                                                            $timeout(function () {
                                                                                $ionicLoading.hide();
                                                                            }, 1000)
                                                                            $scope.view.disabled = false;
                                                                        } else {
                                                                            PublicFunction.showLoading();
                                                                            if ($scope.view.applicationData.formType === 2001) {
                                                                                //差旅申请
                                                                                //差旅申请需要校验预算
                                                                                TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                                    .success(function (res) {
                                                                                        $ionicLoading.hide();
                                                                                        //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                                        if(res){
                                                                                            TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                .success(function (data) {
                                                                                                    $ionicLoading.hide();
                                                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                    $timeout(function () {
                                                                                                        $scope.view.goBack();
                                                                                                    }, 500);
                                                                                                })
                                                                                                .error(function (error) {
                                                                                                    $ionicLoading.hide();
                                                                                                    if(error.message){
                                                                                                        PublicFunction.showToast(error.message)
                                                                                                    } else {
                                                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                    }
                                                                                                })
                                                                                                .finally(function () {
                                                                                                    $scope.view.disabled = false;
                                                                                                })
                                                                                        }else{
                                                                                            $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                                                TravelERVService.submitTravel($scope.view.applicationData)
                                                                                                    .success(function (data) {
                                                                                                        $ionicLoading.hide();
                                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                        $timeout(function () {
                                                                                                            $scope.view.goBack();
                                                                                                        }, 500);
                                                                                                    })
                                                                                                    .error(function (error) {
                                                                                                        $ionicLoading.hide();
                                                                                                        if(error.message){
                                                                                                            PublicFunction.showToast(error.message)
                                                                                                        } else {
                                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                        }
                                                                                                    })
                                                                                                    .finally(function () {
                                                                                                        $scope.view.disabled = false;
                                                                                                    })
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                    .error(function(error){
                                                                                        $ionicLoading.hide();
                                                                                        if(error.message){
                                                                                            PublicFunction.showToast(error.message)
                                                                                        } else {
                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                        }
                                                                                    })

                                                                            } else if ($scope.view.applicationData.formType === 2002) {
                                                                                //费用申请
                                                                                if($scope.view.applicationData.closeEnabled){
                                                                                    if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                                        $scope.view.applicationData.closeDate = new Date();
                                                                                        $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                                        $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                                    } else {
                                                                                        $scope.view.applicationData.closeDate = new Date();
                                                                                    }
                                                                                }
                                                                                InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                                    .success(function (data) {
                                                                                        $ionicLoading.hide();
                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                        $timeout(function () {
                                                                                            $scope.view.goBack();
                                                                                        }, 500);
                                                                                    })
                                                                                    .error(function (error) {
                                                                                        $ionicLoading.hide();
                                                                                        if(error.message){
                                                                                            PublicFunction.showToast(error.message)
                                                                                        } else {
                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                        }
                                                                                    })
                                                                                    .finally(function () {
                                                                                        $scope.view.disabled = false;
                                                                                    })
                                                                            } else if ($scope.view.applicationData.formType === 2003) {
                                                                                //订票申请
                                                                                CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                                    .success(function (data) {
                                                                                        $ionicLoading.hide();
                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                        $timeout(function () {
                                                                                            $scope.view.goBack();
                                                                                        }, 500);
                                                                                    })
                                                                                    .error(function (error) {
                                                                                        $ionicLoading.hide();
                                                                                        if(error.message){
                                                                                            PublicFunction.showToast(error.message)
                                                                                        } else {
                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                        }
                                                                                    })
                                                                                    .finally(function () {
                                                                                        $scope.view.disabled = false;
                                                                                    })
                                                                            } else if ($scope.view.applicationData.formType === 1001) {
                                                                                //普通表单
                                                                            } else if ($scope.view.applicationData.formType === 2005) {
                                                                                //借款申请
                                                                                CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                                    .success(function () {
                                                                                        $ionicLoading.hide();
                                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                        $scope.view.goBack();
                                                                                    })
                                                                                    .error(function (error) {
                                                                                        $ionicLoading.hide();
                                                                                        if(error.message){
                                                                                            PublicFunction.showToast(error.message)
                                                                                        } else {
                                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                                        }
                                                                                    })
                                                                                    .finally(function () {
                                                                                        $scope.view.disabled = false;
                                                                                    })
                                                                            }
                                                                        }
                                                                    }, function () {
                                                                        $scope.view.disabled = false;
                                                                    })
                                                                }
                                                                else {
                                                                    //不选择部门
                                                                    if ($scope.view.applicationData.formType === 2001) {
                                                                        //差旅申请
                                                                        //差旅申请需要校验预算
                                                                        TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                            .then(function (res) {
                                                                                //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                                if(res){
                                                                                    TravelERVService.submitTravel($scope.view.applicationData)
                                                                                        .success(function (data) {
                                                                                            $ionicLoading.hide();
                                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                            $timeout(function () {
                                                                                                $scope.view.goBack();
                                                                                            }, 500);
                                                                                        })
                                                                                        .error(function (error) {
                                                                                            $ionicLoading.hide();
                                                                                            if(error.message){
                                                                                                PublicFunction.showToast(error.message)
                                                                                            } else {
                                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                                            }
                                                                                        })
                                                                                        .finally(function () {
                                                                                            $scope.view.disabled = false;
                                                                                        })
                                                                                }else{
                                                                                    $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                                        TravelERVService.submitTravel($scope.view.applicationData)
                                                                                            .success(function (data) {
                                                                                                $ionicLoading.hide();
                                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                                $timeout(function () {
                                                                                                    $scope.view.goBack();
                                                                                                }, 500);
                                                                                            })
                                                                                            .error(function (error) {
                                                                                                $ionicLoading.hide();
                                                                                                if(error.message){
                                                                                                    PublicFunction.showToast(error.message)
                                                                                                } else {
                                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                                }
                                                                                            })
                                                                                            .finally(function () {
                                                                                                $scope.view.disabled = false;
                                                                                            })
                                                                                    })
                                                                                }
                                                                            });

                                                                    }
                                                                    else if ($scope.view.applicationData.formType === 2002) {
                                                                        //费用申请
                                                                        if($scope.view.applicationData.closeEnabled){
                                                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                                $scope.view.applicationData.closeDate = new Date();
                                                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                            } else {
                                                                                $scope.view.applicationData.closeDate = new Date();
                                                                            }
                                                                        }

                                                                        InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                            .success(function (data) {
                                                                                $ionicLoading.hide();
                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                $timeout(function () {
                                                                                    $scope.view.goBack();
                                                                                }, 500);
                                                                            })
                                                                            .error(function (error) {
                                                                                $ionicLoading.hide();
                                                                                if(error.message){
                                                                                    PublicFunction.showToast(error.message)
                                                                                } else {
                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                }
                                                                            })
                                                                            .finally(function () {
                                                                                $scope.view.disabled = false;
                                                                            })
                                                                    } else if ($scope.view.applicationData.formType === 2003) {
                                                                        //订票申请
                                                                        CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                            .success(function (data) {
                                                                                $ionicLoading.hide();
                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                $timeout(function () {
                                                                                    $scope.view.goBack();
                                                                                }, 500);
                                                                            })
                                                                            .error(function (error) {
                                                                                $ionicLoading.hide();
                                                                                if(error.message){
                                                                                    PublicFunction.showToast(error.message)
                                                                                } else {
                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                }
                                                                            })
                                                                            .finally(function () {
                                                                                $scope.view.disabled = false;
                                                                            })
                                                                    } else if ($scope.view.applicationData.formType === 1001) {
                                                                        //普通表单
                                                                    } else if ($scope.view.applicationData.formType === 2005) {
                                                                        //借款申请
                                                                        CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                            .success(function () {
                                                                                $ionicLoading.hide();
                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                $scope.view.goBack();
                                                                            })
                                                                            .error(function (error) {
                                                                                $ionicLoading.hide();
                                                                                if(error.message){
                                                                                    PublicFunction.showToast(error.message)
                                                                                } else {
                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                }
                                                                            })
                                                                            .finally(function () {
                                                                                $scope.view.disabled = false;
                                                                            })
                                                                    }
                                                                }
                                                            }

                                                        }
                                                    })
                                                    .error(function (error) {
                                                        $scope.view.disabled = false;
                                                        $ionicLoading.hide();

                                                        if(error && error.validationErrors && error.validationErrors.length > 0 && error.validationErrors[0].externalPropertyName){
                                                            // 2010: 申请人为空  2011:部门为空  2012：成本中心为空
                                                            if(error.validationErrors[0].externalPropertyName == '2012'){
                                                                PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_costCenter')); //请先选择成本中心
                                                            } else if(error.validationErrors[0].externalPropertyName == '2010'){
                                                                PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_applicant')); //请先选择申请人
                                                            } else if(error.validationErrors[0].externalPropertyName == '2011'){
                                                                PublicFunction.showToast($filter('translate')('approval_selector_js.please_select_department')); //请先选择部门
                                                            }
                                                        } else {
                                                            PublicFunction.showToast($filter('translate')('custom.application.tip.check_appliant_error')); //校验参与人数据权限出错
                                                        }


                                                    })
                                            }
                                        }
                                        else {
                                            //选择部门
                                            if ($scope.view.departmentOID) {
                                                DepartmentService.getDepartmentInfo($scope.view.departmentOID).then(function (response) {
                                                    if ($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode === 1002 && !response.data.managerOID) {
                                                        PublicFunction.showToast(ManagerPrompt);
                                                        $timeout(function () {
                                                            $ionicLoading.hide();
                                                        }, 1000)
                                                        $scope.view.disabled = false;
                                                    } else {
                                                        PublicFunction.showLoading();
                                                        if ($scope.view.applicationData.formType === 2001) {
                                                            //差旅申请
                                                            //差旅申请需要校验预算
                                                            TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                                .success(function (res) {
                                                                    $ionicLoading.hide();
                                                                    //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                                    if(res){
                                                                        TravelERVService.submitTravel($scope.view.applicationData)
                                                                            .success(function (data) {
                                                                                $ionicLoading.hide();
                                                                                PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                $timeout(function () {
                                                                                    $scope.view.goBack();
                                                                                }, 500);
                                                                            })
                                                                            .error(function (error) {
                                                                                $ionicLoading.hide();
                                                                                if(error.message){
                                                                                    PublicFunction.showToast(error.message)
                                                                                } else {
                                                                                    PublicFunction.showToast($filter('translate')('status.error'));
                                                                                }
                                                                            })
                                                                            .finally(function () {
                                                                                $scope.view.disabled = false;
                                                                            })
                                                                    }else{
                                                                        $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                            TravelERVService.submitTravel($scope.view.applicationData)
                                                                                .success(function (data) {
                                                                                    $ionicLoading.hide();
                                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                                    $timeout(function () {
                                                                                        $scope.view.goBack();
                                                                                    }, 500);
                                                                                })
                                                                                .error(function (error) {
                                                                                    $ionicLoading.hide();
                                                                                    if(error.message){
                                                                                        PublicFunction.showToast(error.message)
                                                                                    } else {
                                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                                    }
                                                                                })
                                                                                .finally(function () {
                                                                                    $scope.view.disabled = false;
                                                                                })
                                                                        })
                                                                    }
                                                                })
                                                                .error(function(error){
                                                                    $ionicLoading.hide();
                                                                    if(error.message){
                                                                        PublicFunction.showToast(error.message)
                                                                    } else {
                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                    }
                                                                })

                                                        } else if ($scope.view.applicationData.formType === 2002) {
                                                            //费用申请
                                                            if($scope.view.applicationData.closeEnabled){
                                                                if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                    $scope.view.applicationData.closeDate = new Date();
                                                                    $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                    $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                                } else {
                                                                    $scope.view.applicationData.closeDate = new Date();
                                                                }
                                                            }
                                                            InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                                .success(function (data) {
                                                                    $ionicLoading.hide();
                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                    $timeout(function () {
                                                                        $scope.view.goBack();
                                                                    }, 500);
                                                                })
                                                                .error(function (error) {
                                                                    $ionicLoading.hide();
                                                                    if(error.message){
                                                                        PublicFunction.showToast(error.message)
                                                                    } else {
                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                    }
                                                                })
                                                                .finally(function () {
                                                                    $scope.view.disabled = false;
                                                                })
                                                        } else if ($scope.view.applicationData.formType === 2003) {
                                                            //订票申请
                                                            CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                                .success(function (data) {
                                                                    $ionicLoading.hide();
                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                    $timeout(function () {
                                                                        $scope.view.goBack();
                                                                    }, 500);
                                                                })
                                                                .error(function (error) {
                                                                    $ionicLoading.hide();
                                                                    if(error.message){
                                                                        PublicFunction.showToast(error.message)
                                                                    } else {
                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                    }
                                                                })
                                                                .finally(function () {
                                                                    $scope.view.disabled = false;
                                                                })
                                                        } else if ($scope.view.applicationData.formType === 1001) {
                                                            //普通表单
                                                        } else if ($scope.view.applicationData.formType === 2005) {
                                                            //借款申请
                                                            CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                                .success(function () {
                                                                    $ionicLoading.hide();
                                                                    PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                    $scope.view.goBack();
                                                                })
                                                                .error(function (error) {
                                                                    $ionicLoading.hide();
                                                                    if(error.message){
                                                                        PublicFunction.showToast(error.message)
                                                                    } else {
                                                                        PublicFunction.showToast($filter('translate')('status.error'));
                                                                    }
                                                                })
                                                                .finally(function () {
                                                                    $scope.view.disabled = false;
                                                                })
                                                        }
                                                    }
                                                }, function () {
                                                    $scope.view.disabled = false;
                                                })
                                            }
                                            else {
                                                //不选择部门
                                                if ($scope.view.applicationData.formType === 2001) {
                                                    //差旅申请
                                                    //差旅申请需要校验预算
                                                    TravelERVService.checkBudgetTravel($scope.view.applicationData)
                                                        .then(function (res) {
                                                            //res true 代表可提交, res false ,弹框提示,点击确定仍可继续提交
                                                            if(res){
                                                                TravelERVService.submitTravel($scope.view.applicationData)
                                                                    .success(function (data) {
                                                                        $ionicLoading.hide();
                                                                        PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                        $timeout(function () {
                                                                            $scope.view.goBack();
                                                                        }, 500);
                                                                    })
                                                                    .error(function (error) {
                                                                        $ionicLoading.hide();
                                                                        if(error.message){
                                                                            PublicFunction.showToast(error.message)
                                                                        } else {
                                                                            PublicFunction.showToast($filter('translate')('status.error'));
                                                                        }
                                                                    })
                                                                    .finally(function () {
                                                                        $scope.view.disabled = false;
                                                                    })
                                                            }else{
                                                                $scope.view.checkBudget($filter('translate')('custom.application.travel.Hint'),$filter('translate')('custom.application.travel.applicationFormExcessBudget')).then(function (data) {//提示--该申请单超预算,是否继续提交?
                                                                    TravelERVService.submitTravel($scope.view.applicationData)
                                                                        .success(function (data) {
                                                                            $ionicLoading.hide();
                                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                                            $timeout(function () {
                                                                                $scope.view.goBack();
                                                                            }, 500);
                                                                        })
                                                                        .error(function (error) {
                                                                            $ionicLoading.hide();
                                                                            if(error.message){
                                                                                PublicFunction.showToast(error.message)
                                                                            } else {
                                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                                            }
                                                                        })
                                                                        .finally(function () {
                                                                            $scope.view.disabled = false;
                                                                        })
                                                                })
                                                            }
                                                        });

                                                }
                                                else if ($scope.view.applicationData.formType === 2002) {
                                                    //费用申请
                                                    if($scope.view.applicationData.closeEnabled){
                                                        if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                            $scope.view.applicationData.closeDate = new Date();
                                                            $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                            $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                        } else {
                                                            $scope.view.applicationData.closeDate = new Date();
                                                        }
                                                    }
                                                    InvoiceApplyERVService.submitInvoiceApply($scope.view.applicationData)
                                                        .success(function (data) {
                                                            $ionicLoading.hide();
                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                            $timeout(function () {
                                                                $scope.view.goBack();
                                                            }, 500);
                                                        })
                                                        .error(function (error) {
                                                            $ionicLoading.hide();
                                                            if(error.message){
                                                                PublicFunction.showToast(error.message)
                                                            } else {
                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                            }
                                                        })
                                                        .finally(function () {
                                                            $scope.view.disabled = false;
                                                        })
                                                } else if ($scope.view.applicationData.formType === 2003) {
                                                    //订票申请
                                                    CustomApplicationServices.submitCustomApplication($scope.view.applicationData)
                                                        .success(function (data) {
                                                            $ionicLoading.hide();
                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                            $timeout(function () {
                                                                $scope.view.goBack();
                                                            }, 500);
                                                        })
                                                        .error(function (error) {
                                                            $ionicLoading.hide();
                                                            if(error.message){
                                                                PublicFunction.showToast(error.message)
                                                            } else {
                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                            }
                                                        })
                                                        .finally(function () {
                                                            $scope.view.disabled = false;
                                                        })
                                                } else if ($scope.view.applicationData.formType === 1001) {
                                                    //普通表单
                                                } else if ($scope.view.applicationData.formType === 2005) {
                                                    //借款申请
                                                    CustomApplicationServices.submitBorrowApply($scope.view.applicationData)
                                                        .success(function () {
                                                            $ionicLoading.hide();
                                                            PublicFunction.showToast($filter('translate')('status.submitted'));
                                                            $scope.view.goBack();
                                                        })
                                                        .error(function (error) {
                                                            $ionicLoading.hide();
                                                            if(error.message){
                                                                PublicFunction.showToast(error.message)
                                                            } else {
                                                                PublicFunction.showToast($filter('translate')('status.error'));
                                                            }
                                                        })
                                                        .finally(function () {
                                                            $scope.view.disabled = false;
                                                        })
                                                }
                                            }
                                        }
                                    }
                                }
                            }, function () {
                                $scope.view.disabled = false;
                                $scope.view.disableSubmit = false;
                            })
                    }

                },
                changeItinerary: function () {
                    //如果时间改变，触发该函数
                    if ($scope.view.startDate && $scope.view.endDate) {
                        //if both start and end exist
                        if ($scope.view.applicationData.travelApplication.travelItinerarys.length == 0) {
                            //行程表是空的，则一一创建
                            var itinerary_date = $scope.view.startDate;
                            while (itinerary_date <= $scope.view.endDate) {
                                var itinerary = {
                                    itineraryDate: itinerary_date, //行程日期
                                    travelItineraryTraffics: []
                                };
                                $scope.view.applicationData.travelApplication.travelItinerarys.push(itinerary);
                                itinerary_date = moment(itinerary_date).add(1, 'day').toDate();//startdate加一天
                            }
                            if (itinerary_date > $scope.view.endDate) {
                                $scope.view.hasChangeDate = false;
                            }
                        }
                        else {
                            //行程表不是空的，则根据修改时间来一一修改
                            var itineraryLength = $scope.view.applicationData.travelApplication.travelItinerarys.length;
                            var firstItineraryDate = $scope.view.applicationData.travelApplication.travelItinerarys[0].itineraryDate;
                            var lastItineraryDate = $scope.view.applicationData.travelApplication.travelItinerarys[itineraryLength - 1].itineraryDate;
                            var isStartFinish = false;
                            var isEndFinish = false;
                            if ($scope.view.startDate < firstItineraryDate || $scope.view.endDate > lastItineraryDate) {
                                //如果时间范围扩大的话，就自动扩大时间就像新建时一样
                                if ($scope.view.startDate < firstItineraryDate) {
                                    //开始时间前移
                                    var itinerary_date = moment(firstItineraryDate).subtract(1, 'day').toDate();
                                    while (itinerary_date >= $scope.view.startDate) {
                                        var itinerary = {
                                            itineraryDate: itinerary_date, //行程日期
                                            travelItineraryTraffics: []
                                        };
                                        $scope.view.applicationData.travelApplication.travelItinerarys.unshift(itinerary);
                                        itinerary_date = moment(itinerary_date).subtract(1, 'day').toDate();//减一天
                                    }
                                    if (itinerary_date < $scope.view.startDate) {
                                        isStartFinish = true;
                                    }

                                } else {
                                    isStartFinish = true;
                                }

                                if ($scope.view.endDate > lastItineraryDate) {
                                    //结束时间后移
                                    var itinerary_date = moment(lastItineraryDate).add(1, 'day').toDate();
                                    while (itinerary_date <= $scope.view.endDate) {
                                        var itinerary = {
                                            itineraryDate: itinerary_date, //行程日期
                                            travelItineraryTraffics: []
                                        };
                                        $scope.view.applicationData.travelApplication.travelItinerarys.push(itinerary);
                                        itinerary_date = moment(itinerary_date).add(1, 'day').toDate();
                                    }
                                    if (itinerary_date > $scope.view.endDate) {
                                        isEndFinish = true;
                                    }
                                } else {
                                    isEndFinish = true;
                                }
                            }
                            else if ($scope.view.startDate > firstItineraryDate || $scope.view.endDate < lastItineraryDate) {
                                //时间范围缩小的话，需要删除部分时间，如果没有添加，自动删除，如果添加了，会有提示
                                var removeIndexList = [];//需要移除的index放在这个列表里
                                var dirty = false;//如果是true，需要提醒用户确认是否移除脏数据
                                if ($scope.view.startDate > firstItineraryDate) {
                                    //开始时间后移
                                    $scope.view.applicationData.travelApplication.travelItinerarys.forEach(function (itineraryItem, index) {
                                        if (itineraryItem.itineraryDate < $scope.view.startDate) {
                                            //如果现有时间在范围之外，小于新选的开始时间，则需要移除
                                            removeIndexList.push(index);
                                            if (itineraryItem.travelItineraryTraffics.length > 0) {
                                                //如果有traffic，则为脏数据，需要提醒用户删除
                                                dirty = true;
                                            }
                                        }
                                    });
                                    if (itinerary_date < $scope.view.startDate) {
                                        isStartFinish = true;
                                    }
                                } else {
                                    isStartFinish = true;
                                }

                                if ($scope.view.endDate < lastItineraryDate) {
                                    //结束时间前移
                                    $scope.view.travelItinerarys.forEach(function (itineraryItem, index) {
                                        if (itineraryItem.itineraryDate > $scope.view.endDate) {
                                            //如果现有时间在范围之外，大于结束时间，则需要移除
                                            removeIndexList.push(index);
                                            if (itineraryItem.travelItineraryTraffics.length > 0) {
                                                //如果有traffic，则为脏数据，需要提醒用户删除
                                                dirty = true;
                                            }
                                        }
                                    });
                                    if (itinerary_date > $scope.view.endDate) {
                                        isEndFinish = true;
                                    }
                                } else {
                                    isEndFinish = true;
                                }
                                var deleteItinerary = function (removeIndexList) {
                                    for (var i = removeIndexList.length - 1; i >= 0; i--) {
                                        //从后往前删除，因为每删一次，都会调整index
                                        $scope.travelItinerarys.splice(removeIndexList[i], 1);
                                    }

                                };

                                if (dirty) {
                                    $ionicPopup.confirm({
                                        title: $filter('translate')('common.tip'),
                                        template: "<p style='text-align: center'>" + $filter('translate')('custom.application.travel.updateDate') + "</p>",//更改日期将删除部分行程
                                        cancelText: $filter('translate')('common.cancel'),
                                        cancelType: 'button-calm',
                                        okText: $filter('translate')('common.ok')
                                    }).then(function () {
                                        deleteItinerary(removeIndexList);
                                    }, function () {
                                        //取消，将开始和结束时间都复原
                                        $scope.view.startDate = firstItineraryDate;
                                        $scope.view.endDate = lastItineraryDate;
                                    });
                                }
                                else {
                                    //如果没有脏数据，自动删除行程，不需要提醒用户
                                    deleteItinerary(removeIndexList);
                                }

                            }

                            if (isStartFinish && isEndFinish) {
                                $scope.view.hasChangeDate = false;
                            }
                        }

                    }
                },
                selectHandDate: function (string) {
                    if($scope.view.isReadOnly || (string === 'closeDate' && !$scope.view.applicationData.customFormProperties.changeEnabled)){

                    } else {
                        var date = null;
                        if (string === 'startDate' && $scope.view.startDate) {
                            date = new Date($scope.view.startDate).Format('yyyy-MM-dd');
                        } else if (string === 'endDate' && $scope.view.endDate) {
                            date = new Date($scope.view.endDate).Format('yyyy-MM-dd');
                        }else if(string ==='date'){
                            date =$scope.view.timeDate ? new Date($scope.view.timeDate).Format('yyyy-MM-dd'): new Date().Format('yyyy-MM-dd');
                        } else if(string === 'closeDate' ){
                            date = $scope.view.applicationData.customFormProperties.closeDay ? new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd'): new Date().Format('yyyy-MM-dd');
                        }
                        var success = function (response) {
                            try {
                                if(ionic.Platform.isAndroid()){
                                    $scope.result = new Date(response);
                                } else {
                                    $scope.result = new Date(response.result);
                                }
                                if (string === 'startDate') {
                                    if($scope.view.content != 'create'){
                                        //有行程 有差补
                                        if($scope.view.hasAllowance && $scope.view.hasItinerary){
                                            var confirmPopup = $ionicPopup.confirm({
                                                title: $filter('translate')('custom.application.travel.Hint'), //提示
                                                template: '<p style="text-align: center">' + $filter("translate")("custom.application.tip.change_start_date_allowance") +'</p>' +  //更改开始日期将清空已添加的差补
                                                '<span>' + $filter("translate")("custom.application.tip.date_suit") + '</span>',  //并可能会导致行程与出差日期不匹配
                                                cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                cancelType: 'button-calm',
                                                okText: $filter('translate')('custom.application.button.sure_modify'), //确认更改
                                                cssClass: 'stop-time-popup'
                                            });
                                            confirmPopup.then(function (res) {
                                                if (res) {
                                                    $scope.view.startDate = $scope.result;
                                                    $scope.view.applicationData.travelApplication.travelSubsidies = null;
                                                    if (((Date.parse($scope.view.endDate) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                                        $scope.view.endDate = $scope.view.startDate;
                                                        if($scope.view.applicationData.closeEnabled){
                                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                            } else {
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                            }
                                                        }
                                                    }
                                                }
                                            })
                                        } else if($scope.view.hasItinerary){
                                            var confirmPopup = $ionicPopup.confirm({
                                                title: $filter('translate')('custom.application.travel.Hint'), //提示
                                                template: '<p style="text-align: center">' + $filter("translate")("custom.application.tip.change_start_date_allowance") +'</p>',  //更改开始日期可能会导致行程与出差日期不匹配
                                                cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                cancelType: 'button-calm',
                                                okText: $filter('translate')('custom.application.button.sure_modify'), //确认更改
                                                cssClass: 'stop-time-popup'
                                            });
                                            confirmPopup.then(function (res) {
                                                if (res) {
                                                    $scope.view.startDate = $scope.result;
                                                    $scope.view.applicationData.travelApplication.travelSubsidies = null;
                                                    if (((Date.parse($scope.view.endDate) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                                        $scope.view.endDate = $scope.view.startDate;
                                                        if($scope.view.applicationData.closeEnabled){
                                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                            } else {
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                            }
                                                        }
                                                    }
                                                }
                                            })
                                        } else if($scope.view.hasAllowance){
                                            var confirmPopup = $ionicPopup.confirm({
                                                title: $filter('translate')('custom.application.travel.Hint'), //提示
                                                template: '<p style="text-align: center">' + $filter("translate")("custom.application.tip.change_start_date_allowance") +'</p>',  //更改开始日期将清空已添加的差补
                                                cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                cancelType: 'button-calm',
                                                okText: $filter('translate')('custom.application.button.sure_modify'), //确认更改
                                                cssClass: 'stop-time-popup'
                                            });
                                            confirmPopup.then(function (res) {
                                                if (res) {
                                                    $scope.view.startDate = $scope.result;
                                                    $scope.view.applicationData.travelApplication.travelSubsidies = null;
                                                    if (((Date.parse($scope.view.endDate) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                                        $scope.view.endDate = $scope.view.startDate;
                                                        if($scope.view.applicationData.closeEnabled){
                                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                            } else {
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                            }
                                                        }
                                                    }
                                                }
                                            })
                                        } else {
                                            $scope.view.startDate = $scope.result;
                                            if (((Date.parse($scope.view.endDate) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                                $scope.view.endDate = $scope.view.startDate;
                                                if($scope.view.applicationData.closeEnabled){
                                                    if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                        $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                        $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                        $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                    } else {
                                                        $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        $scope.view.startDate = $scope.result;
                                        if (((Date.parse($scope.view.endDate) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                            $scope.view.endDate = $scope.view.startDate;
                                            if($scope.view.applicationData.closeEnabled){
                                                if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                    $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                    $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                    $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                } else {
                                                    $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                }
                                            }
                                        }
                                    }
                                    if (((Date.parse($scope.view.endDate) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                        $scope.view.endDate = $scope.view.startDate;
                                        if($scope.view.applicationData.closeEnabled){
                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                            } else {
                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                            }
                                        }
                                    }
                                } else if (string === 'endDate') {
                                    if($scope.view.content != 'create'){
                                        //有行程 有差补
                                        if($scope.view.hasAllowance && $scope.view.hasItinerary){
                                            var confirmPopup = $ionicPopup.confirm({
                                                title: $filter('translate')('custom.application.travel.Hint'), //提示
                                                template: '<p style="text-align: center">' + $filter("translate")("custom.application.tip.change_end_date_allowance") +'</p>' +  //更改结束日期将清空已添加的差补
                                                '<span>' + $filter("translate")("custom.application.tip.date_suit") + '</span>',  //并可能会导致行程与出差日期不匹配
                                                cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                cancelType: 'button-calm',
                                                okText: $filter('translate')('custom.application.button.sure_modify'), //确认更改
                                                cssClass: 'stop-time-popup'
                                            });
                                            confirmPopup.then(function (res) {
                                                if (res) {
                                                    $scope.view.applicationData.travelApplication.travelSubsidies = null;
                                                    if (((Date.parse($scope.result) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                                        PublicFunction.showToast($filter('translate')('custom.application.error.end.date.error')); //结束日期不能早于开始日期
                                                    } else {
                                                        $scope.view.endDate = $scope.result;
                                                        if($scope.view.applicationData.closeEnabled){
                                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                            } else {
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                            }
                                                        }
                                                        $scope.$apply();
                                                    }
                                                }
                                            })
                                        } else if($scope.view.hasItinerary){
                                            var confirmPopup = $ionicPopup.confirm({
                                                title: $filter('translate')('custom.application.travel.Hint'), //提示
                                                template: '<p style="text-align: center">' + $filter("translate")("custom.application.tip.change_end_date_itinerary") +'</p>',  //更改结束日期可能会导致行程与出差日期不匹配
                                                cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                cancelType: 'button-calm',
                                                okText: $filter('translate')('custom.application.button.sure_modify'), //确认更改
                                                cssClass: 'stop-time-popup'
                                            });
                                            confirmPopup.then(function (res) {
                                                if (res) {
                                                    $scope.view.applicationData.travelApplication.travelSubsidies = null;
                                                    if (((Date.parse($scope.result) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                                        PublicFunction.showToast($filter('translate')('custom.application.error.end.date.error')); //结束日期不能早于开始日期
                                                    } else {
                                                        $scope.view.endDate = $scope.result;
                                                        if($scope.view.applicationData.closeEnabled){
                                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                            } else {
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                            }
                                                        }
                                                        $scope.$apply();
                                                    }
                                                }
                                            })
                                        } else if($scope.view.hasAllowance){
                                            var confirmPopup = $ionicPopup.confirm({
                                                title: $filter('translate')('custom.application.travel.Hint'), //提示
                                                template: '<p style="text-align: center">' + $filter("translate")("custom.application.tip.change_end_date_allowance") +'</p>',  //更改结束日期将清空已添加的差补
                                                cancelText: $filter('translate')('custom.application.button.cancel'),  //取消
                                                cancelType: 'button-calm',
                                                okText: $filter('translate')('custom.application.button.sure_modify'), //确认更改
                                                cssClass: 'stop-time-popup'
                                            });
                                            confirmPopup.then(function (res) {
                                                if (res) {
                                                    $scope.view.applicationData.travelApplication.travelSubsidies = null;
                                                    if (((Date.parse($scope.result) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                                        PublicFunction.showToast($filter('translate')('custom.application.error.end.date.error')); //结束日期不能早于开始日期
                                                    } else {
                                                        $scope.view.endDate = $scope.result;
                                                        if($scope.view.applicationData.closeEnabled){
                                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                            } else {
                                                                $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                            }
                                                        }
                                                        $scope.$apply();
                                                    }
                                                }
                                            })
                                        } else {
                                            $scope.view.applicationData.travelApplication.travelSubsidies = null;
                                            if (((Date.parse($scope.result) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                                PublicFunction.showToast($filter('translate')('custom.application.error.end.date.error')); //结束日期不能早于开始日期
                                            } else {
                                                $scope.view.endDate = $scope.result;
                                                if($scope.view.applicationData.closeEnabled){
                                                    if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                        $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                        $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                        $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                    } else {
                                                        $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                    }
                                                }
                                                $scope.$apply();
                                            }
                                        }
                                    } else {
                                        if (((Date.parse($scope.result) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                            PublicFunction.showToast($filter('translate')('custom.application.error.end.date.error')); //结束日期不能早于开始日期
                                        } else {
                                            $scope.view.endDate = $scope.result;
                                            if($scope.view.applicationData.closeEnabled){
                                                if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                    $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                    $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                    $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                                } else {
                                                    $scope.view.applicationData.closeDate = new Date($scope.view.endDate);
                                                }
                                            }
                                            $scope.$apply();
                                        }
                                    }
                                }else if(string ==='date'){
                                    $scope.view.timeDate = $scope.result;
                                    $scope.$apply();
                                } else if(string === 'closeDate' ){
                                    if($scope.view.content != 'create'){
                                        if(((Date.parse($scope.result) - Date.parse(new Date().setDate(new Date().getDate() + 1))) / 3600 / 1000) < 0){
                                            PublicFunction.showToast($filter('translate')('custom.application.error.closd_date_error'));//停用日期不能小于当前日期
                                        } else {
                                            var closeDate = angular.copy($scope.view.applicationData.closeDate);
                                            $scope.view.applicationData.closeDate = $scope.result;
                                            $scope.$apply();
                                            CustomApplicationServices.modifyCloseDate($stateParams.applicationOID, $scope.view.userOID, $scope.view.applicationData.travelApplication.closeDate)
                                                .success(function () {

                                                })
                                                .error(function () {
                                                    $scope.view.applicationData.closeDate = angular.copy(closeDate);
                                                    $scope.$apply();
                                                    PublicFunction.showToast($filter('translate')('custom.application.tip.modify_stop_time_error')); //修改停用时间出错了
                                                })
                                        }
                                    } else {
                                        $scope.view.applicationData.closeDate = $scope.result;
                                        $scope.$apply();
                                    }
                                }
                                $scope.$apply();
                            } catch (e) {
                            }
                        };
                        var error = function (response) {
                        };

                        if (ionic.Platform.isWebView()) {
                            var startTime = '-';
                            var endTime = '-';
                            if(string === 'endDate' && $scope.view.startDate){
                                startTime = new Date($scope.view.startDate).Format('yyyy-MM-dd');
                            }
                            if(string === 'startDate' && $scope.view.endDate){
                                endTime = new Date($scope.view.endDate).Format('yyyy-MM-dd');
                            }
                            var banPick = {};
                            if(date){
                                banPick = {"startTime": startTime, "endTime": endTime, "dates":[], "selectedDate": date};
                            } else {
                                banPick = {"startTime": startTime, "endTime": endTime, "dates":[]};
                            }
                            if($sessionStorage.lang != 'zh_cn'){
                                banPick.language = "en";
                            }
                            HmsCalendar.openCalendar(success, error, 2, banPick);
                        }
                    }

                },
                selectDate: function (string) {
                    var date = null;
                    if (string === 'startDate') {
                        date = new Date($scope.view.startDate);
                    } else if (string === 'endDate') {
                        date = new Date($scope.view.endDate);
                    }else if(string==='date'){
                        //
                        date =$scope.view.timeDate ? new Date($scope.view.timeDate): new Date();
                    }
                    var dateOptions = {
                        date: date,
                        mode: 'date',
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('common.ok'),
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('common.cancel'),
                        cancelButtonColor: '#cdcdcd',
                        locale: $sessionStorage.lang
                    };
                    if (!$scope.view.isReadOnly) {
                        $cordovaDatePicker.show(dateOptions).then(function (date) {
                            if (date) {
                                date = new Date(date).Format('yyyy-MM-dd');
                                $scope.view.hasChangeDate = true;
                                if (string === 'startDate') {
                                    $scope.view.startDate = date;
                                    if (((Date.parse($scope.view.endDate) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                        $scope.view.endDate = $scope.view.startDate;
                                    }
                                } else if (string === 'endDate') {
                                    if (((Date.parse(date) - Date.parse($scope.view.startDate)) / 3600 / 1000) < 0) {
                                        PublicFunction.showToast($filter('translate')('custom.application.error.end.date.error'));
                                    } else {
                                        $scope.view.endDate = date;
                                    }
                                }else if(string === 'date'){
                                    //差旅出差日期flag不变
                                    $scope.view.hasChangeDate = false;
                                    if(Date.parse(new Date().Format('yyyy-MM-dd')) > Date.parse(date)){
                                        PublicFunction.showToast($filter('translate')('custom.application.travel.RepaymentDate'));//还款日期要大于当前日期
                                    }else{
                                        $scope.view.timeDate = date;
                                    }
                                }
                            }
                        });
                    }
                },
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
                //获取成本中心的长度
                getCostCenterLength: function (costCenterOID, index) {
                    if(costCenterOID){
                        CostCenterService.getMyCostCenter(costCenterOID, 0, 1)
                            .success(function (data, status, headers) {
                                $scope.view.applicationData.custFormValues[index].costCenterLength = headers('x-total-count');
                            })
                    }
                },
                getCostCenterName: function (index) {
                    var indexCostCenter = index;
                    var json = JSON.parse($scope.view.applicationData.custFormValues[indexCostCenter].dataSource);
                    $scope.view.applicationData.custFormValues[indexCostCenter].costCenterOID = json.costCenterOID;
                    if ($scope.view.applicationData.custFormValues[indexCostCenter].value) {
                        CostCenterService.getCostCenterItemDetail($scope.view.applicationData.custFormValues[indexCostCenter].value)
                            .success(function (data) {
                                $scope.view.applicationData.custFormValues[indexCostCenter].costCenterName = data.name;
                            })
                            .error(function () {
                                $scope.view.applicationData.custFormValues[indexCostCenter].costCenterName = null;
                            })
                    } else {
                        $scope.view.applicationData.custFormValues[indexCostCenter].costCenterName = null;
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
                getDepartmentName: function (index) {
                    SelfDefineExpenseReport.getDepartmentInfo($scope.view.applicationData.custFormValues[index].value)
                        .success(function (data) {
                            // 以后从表单里面拿字段
                            $scope.view.departmentInfo = data;
                            if($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]){
                                $scope.view.applicationData.custFormValues[index].departmentName = data.name;
                                $scope.view.departmentInfo.departmentName = data.name;
                            } else {
                                $scope.view.applicationData.custFormValues[index].departmentName = data.path;
                                $scope.view.departmentInfo.departmentName = data.path;
                            }
                        })
                },
                //获取供应商列表
                getSupplierList: function (index) {
                    TravelERVService.getSuppliers()
                        .success(function (data) {
                            $scope.view.applicationData.custFormValues[index].SupplierList = data;
                            if ($scope.view.applicationData.custFormValues[index].value) {
                                for (var i = 0; i < $scope.view.applicationData.custFormValues[index].SupplierList.length; i++) {
                                    if ($scope.view.applicationData.custFormValues[index].value === $scope.view.applicationData.custFormValues[index].SupplierList[i].supplierOID) {
                                        $scope.view.applicationData.custFormValues[index].selectedSupplier = $scope.view.applicationData.custFormValues[index].SupplierList[i];
                                        break;
                                    }
                                }
                            }
                        })
                },
                //获取已选择审批人的名字
                getSelectedApproval: function (index) {
                    var uerOID = [];
                    if ($scope.view.applicationData.custFormValues[index].value !== null && $scope.view.applicationData.custFormValues[index].value !== '') {
                        uerOID = $scope.view.applicationData.custFormValues[index].value.split(":");
                        $scope.view.applicationData.custFormValues[index].approvalSelectedName = '';
                        if (uerOID.length > 0) {
                            $scope.memberList = [uerOID.length];
                            TravelERVService.getBatchUsers(uerOID)
                                .success(function (data) {
                                    var num = 0;
                                    for (; num < data.length; num++) {
                                        for (var j = 0; j < uerOID.length; j++) {
                                            if (uerOID[j] === data[num].userOID) {
                                                $scope.memberList[j] = data[num];
                                            }
                                        }
                                    }
                                    if (num === data.length) {
                                        for (var i = 0; i < $scope.memberList.length; i++) {
                                            if (i !== ($scope.memberList.length - 1)) {
                                                $scope.view.applicationData.custFormValues[index].approvalSelectedName += $scope.memberList[i].fullName + ','
                                            } else {
                                                $scope.view.applicationData.custFormValues[index].approvalSelectedName += $scope.memberList[i].fullName;
                                            }
                                        }
                                    }
                                })
                        } else {
                            $scope.memberList = [];
                            $scope.view.applicationData.custFormValues[index].approvalSelectedName = '';
                        }

                    } else {
                        $scope.view.applicationData.custFormValues[index].approvalSelectedName = '';
                    }
                },
                //获取订票专员信息
                getBookerName: function (index) {
                    if ($scope.view.applicationData.custFormValues[index].value) {
                        var uerOID = [];
                        uerOID.push($scope.view.applicationData.custFormValues[index].value);
                        TravelERVService.getBatchUsers(uerOID)
                            .success(function (data) {
                                if (data.length > 0) {
                                    $scope.view.applicationData.custFormValues[index].bookerName = data[0].fullName;
                                }
                            })
                    } else {
                        $scope.view.applicationData.custFormValues[index].bookerName = null;
                    }
                },
                //计算汇率差异,保留一位小数的百分数;四舍五入
                getRateDiff:function (actualCurrencyRate,companyCurrencyRate){
                    var a= (actualCurrencyRate-companyCurrencyRate)*100/companyCurrencyRate;
                    var b=parseInt(a*10);
                    var c=b/10;
                    if(c<0){
                        c=(-c);
                    }
                    return c+"%";
                },
                //获取费用列表
                getInvoiceList: function (index) {
                    //其他申请
                    var json = JSON.parse($scope.view.applicationData.custFormValues[index].value);
                    if(json){
                        $scope.view.applicationData.custFormValues[index].invoiceList = json.budgetDetail;
                        $scope.view.applicationData.custFormValues[index].amount = json.amount;

                        $scope.view.applicationData.custFormValues[index].invoiceList.forEach(function(item,i){
                            item.selfCurrencyRateCurrencyRate=$scope.view.getRateDiff(item.actualCurrencyRate,item.companyCurrencyRate);
                            item.updateRate =$scope.view.rateCanChangeAble;
                        })

                    } else {
                        $scope.view.applicationData.custFormValues[index].invoiceList = [];
                        $scope.view.applicationData.custFormValues[index].amount = 0;
                    }
                },
                //获取值列表名字
                getValueName: function (index) {
                    CustomValueService.getMessageKey($scope.view.applicationData.custFormValues[index].customEnumerationOID, $scope.view.applicationData.custFormValues[index].value)
                        .then(function (data) {
                            $scope.view.applicationData.custFormValues[index].valueKey = data;
                        })
                },
                //根据值列表value获取值列表key(用于显示)
                getMessageKeyDetail: function(index, customEnumerationOID, value){
                    CustomValueService.getCustomValueDetail(customEnumerationOID)
                        .then(function (res) {
                            var enabled=res.data.enabled;
                            //enabled为false时，该值列表不可打开
                            if(enabled){
                                $scope.view.applicationData.custFormValues[index].enabledStatus=true;
                            }else{
                                $scope.view.applicationData.custFormValues[index].enabledStatus=false;
                                $scope.view.applicationData.custFormValues[index].required=false;
                            }
                            //根据值列表oid查询值列表项，获取默认值
                            CustomValueService.getCustomValueItemDetail(res.data.dataFrom,customEnumerationOID, value)
                                .then(function (data) {
                                    //enabled为true时，处理messagekey
                                    if(enabled){
                                        $scope.view.applicationData.custFormValues[index].valueKey = data.data.messageKey;
                                    }
                                });
                        })
                },
                //初始化选择参与人 文本
                initParticipantHolder: function () {
                    if($scope.view.applicationData.customFormProperties && $scope.view.applicationData.customFormProperties.participantsScope){
                        switch ($scope.view.applicationData.customFormProperties.participantsScope){
                            case 1:
                                $scope.view.participantHolder = $filter('translate')('custom.application.user.search_company_all_employee'); //搜索姓名或者工号
                                break;
                            case 2:
                                $scope.view.participantHolder = $filter('translate')('custom.application.user.search_appliant_department_employee'); //搜索同部门员工姓名或者工号
                                break;
                            case 3:
                                $scope.view.participantHolder = $filter('translate')('custom.application.user.search_appliant_department_and_child_employee'); //'搜索同部门及子部门员工姓名或工号';
                                break;
                            case 4:
                                $scope.view.participantHolder = $filter('translate')('custom.application.user.search_from_department_employee'); //'搜索所选部门下员工姓名或工号';
                                break;
                            case 5:
                                $scope.view.participantHolder = $filter('translate')('custom.application.user.search_from_department_and_child_employee'); //'搜索所选部门及子部门员工姓名或工号';
                                break;
                            case 6:
                                $scope.view.participantHolder = $filter('translate')('custom.application.user.search_company_all_employee'); //'搜索已选成本中心员工姓名或工号';
                                break;
                            default:
                                $scope.view.participantHolder = $filter('translate')('custom.application.user.search_from_cost_center_employee'); //搜索姓名或者工号
                                break;
                        }
                    }
                },
                //新建时处理值列表的默认值
                getMessageKeyDetailByCreate:function(index,customEnumerationOID){
                    CustomValueService.getCustomValueDetail(customEnumerationOID)
                        .then(function (res) {
                            var enabled=res.data.enabled;
                            //enabled为false时，该值列表不可打开
                            if(enabled){
                                $scope.view.applicationData.custFormValues[index].enabledStatus=true;
                            }else{
                                $scope.view.applicationData.custFormValues[index].enabledStatus=false;
                                $scope.view.applicationData.custFormValues[index].required=false;
                            }
                            //根据值列表oid查询值列表项，获取默认值
                            CustomValueService.getCustomValueListByPagination(res.data.dataFrom,customEnumerationOID, 0, 1000, '', $scope.view.applicantOID)
                                .then(function (data) {
                                    var itemEnabled=false;//值列表项是否可用
                                    if(data.data && data.data.length >0){
                                        data.data.forEach(function(item){
                                            //值列表启用，值列表项启用才显示默认值
                                            if(item.patientia && enabled){
                                                $scope.view.applicationData.custFormValues[index].valueKey=item.messageKey;
                                                $scope.view.applicationData.custFormValues[index].value=item.value;
                                            }
                                        })
                                    }
                                    //没有值列表项的时候显示未启用
                                    else{
                                        $scope.view.applicationData.custFormValues[index].enabledStatus=false;
                                        $scope.view.applicationData.custFormValues[index].required=false;
                                    }

                                });
                        })
                },
                //获取法人实体名字
                getCorporationEntityName: function (index) {
                    if($scope.view.corporationOID){
                        CorporationEntityService.getCorporationEntityDetail($scope.view.corporationOID)
                            .success(function (data) {
                                $scope.view.applicationData.custFormValues[index].entityName = data.companyName;
                                if($scope.view.content === 'create'){
                                    $scope.view.applicationData.customFormFields[index].entityName = data.companyName;
                                    $scope.view.applicationData.customFormFields[index].value = $scope.view.corporationOID;
                                    $scope.view.applicationData.custFormValues[index].value = $scope.view.corporationOID;
                                }
                            })
                    }
                },
                //选择币种
                selectCode: function () {
                    $scope.selectCurrencyCode.show();
                },
                changeCurrencyCode: function (item) {
                    $scope.view.currencyCode = item.currencyCode;
                    for (var i = 0; i < $scope.view.applicationData.custFormValues.length; i++) {
                        if ($scope.view.applicationData.custFormValues[i].messageKey === 'currency_code') {
                            $scope.view.applicationData.custFormValues[i].value = item.currencyCode;
                            break;
                        }
                    }
                    $scope.view.cashName = item.fullName;
                    $scope.selectCurrencyCode.hide();
                },
                //选择框
                getSelectBoxId: function (index) {
                    $scope.view.applicationData.custFormValues[index].selectID = [];
                    for (var i = 0; i < $scope.view.applicationData.custFormValues[index].selectValue.length; i++) {
                        $scope.view.applicationData.custFormValues[index].selectID.push($scope.view.applicationData.custFormValues[index].selectValue[i].id);
                    }
                },
                //银行卡
                getContactBankAccountName: function (index) {
                    if($scope.view.applicationData.custFormValues[index].value){
                        CompanyService.getBankAccountDetail($scope.view.applicationData.custFormValues[index].value)
                            .success(function (data) {
                                $scope.view.applicationData.custFormValues[index].bankAccountNo = data.bankAccountNo;
                            })
                    }
                },
                //提交预算校验
                checkBudget: function (message,content) {
                    var deferred = $q.defer();
                    var confirm = $ionicPopup.confirm({
                        title: message,
                        cssClass: 'refund-confirm-popup',
                        template: '<span>' + content + '</span>',
                        buttons: [
                            {
                                text: $filter('translate')('custom.application.travel.return'),//返回
                                type: 'cancel-button',
                                onTap: function (e) {
                                    deferred.reject(false);
                                }
                            },
                            {
                                text: $filter(translate)('custom.application.travel.submit'),//提交
                                type: 'sure-button',
                                onTap: function(e) {
                                    deferred.resolve(true);
                                }
                            }]
                    });
                    return deferred.promise;
                },
                //根据申请人OID获取默认银行卡
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
                                        $scope.view.defaultBankAccount = [];
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
                    if(costCenterOID && costCenterOID != '' && costCenterOID != null){
                        CostCenterService.getDefaultValueOfCostCenter(applicantOID, costCenterOID).success(function (res) {
                            //获取默认的成本中心项OID,
                            item.value = res.costCenterItemOID;
                            for(var i = 0; i < $scope.view.authorityData.costCentreOID.length; i++){
                                if($scope.view.authorityData.costCentreOID[i].fieldOID == item.fieldOID){
                                    $scope.view.authorityData.costCentreOID[i].name = res.costCenterItemOID;
                                    if($scope.view.applicationData.customFormProperties.participantsScope == 6){
                                        CustomApplicationServices.getUserInForm($scope.view.authorityData)
                                            .success(function (data) {
                                                if(data && data.length > 0){
                                                    if(!data[0].errorDetail){
                                                        $scope.view.applicationParticipants.push($scope.currentUser);
                                                        $scope.view.interMemberList.push($scope.currentUser);
                                                    }
                                                }
                                            })
                                    }
                                }
                            }
                            //根据默认的成本中心项OID获取成本中心
                            $scope.view.getCostcenterAndSetCenterItemName(item);
                        }).error(function (err) {
                            //当报错时，将成本中心项初始化为null,让用户自己选择
                            item.value = null;
                            item.costCenterName = null;
                        });
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

            // 代理相关内容
            $scope.agency = {
                // 清空成本中心内容
                costCenterClear: function (index){
                    var formValues = $scope.view.applicationData.custFormValues;
                    formValues[index].costCenterName = null;
                    formValues[index].value = null;
                    for(var i = 0; i < $scope.view.authorityData.costCentreOID.length; i++){
                        if($scope.view.authorityData.costCentreOID[i].fieldOID == formValues[index].fieldOID){
                            $scope.view.authorityData.costCentreOID[i].name = null;
                        }
                    }

                },
                //当申请人发生变化，会调用该函数，去修改该申请单的默认成本中心
                costCenterChange: function (index, applicant) {
                    var formValues = $scope.view.applicationData.custFormValues;
                    formValues[index].costCenterName = null;
                    formValues[index].value = null;
                    var costCenterItem = $scope.view.applicationData.custFormValues[index];
                    $scope.view.getDefaultCostCenter(applicant.userOID, costCenterItem.costCenterOID, costCenterItem);
                },

                // 修改部门为申请人所在的部门
                departmentChange: function (index, applicant){

                    // 先清空部门信息,避免拿不到数据时还是使用之前的数据
                    $scope.view.applicationData.custFormValues[index].value = null;
                    $scope.view.applicationData.custFormValues[index].path = null;

                    // 获取用户所在部门信息
                    AgencyService.getUserDetail(applicant.userOID).then(function(response){
                        var data = response.data.department;

                        $scope.view.applicationData.custFormValues[index].value = data.departmentOID;
                        $scope.view.authorityData.departmentOID = data.departmentOID;
                        if($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]){
                            $scope.view.applicationData.custFormValues[index].departmentName = data.name;
                        } else {
                            $scope.view.applicationData.custFormValues[index].departmentName = data.path;
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

                //当申请人发生变化，会调用该函数，去修改该申请单的默认账号
                bankAccountChange: function (index, applicant){
                    //根据申请人OID，获取默认银行账户
                    $scope.view.defaultBankAccount = null;
                    $scope.view.getDefaultBankAccount(applicant.userOID).then(function (res) {
                        if(res){
                            $scope.view.applicationData.custFormValues[index].bankAccountNo = res.bankAccountNo;
                            $scope.view.applicationData.custFormValues[index].promptInfo = res.bankName;
                            $scope.view.applicationData.custFormValues[index].value = res.contactBankAccountOID;
                        }
                    });

                },

                // 清除银行卡信息
                bankAccountClear: function (index){
                    $scope.view.applicationData.custFormValues[index].value = null;
                    $scope.view.applicationData.custFormValues[index].bankAccountNo = null;
                },

                // 修改默认参与人
                participantChange: function(index, applicant){
                    applicant.participantOID = applicant.userOID;
                    $scope.view.outerMemberList = [applicant];
                },

                // 申请人改变时的处理
                applicantChange: function(applicant){
                    // 关联申请人信息,成本中心清空,银行卡信息
                    function relativeHandle(){
                        var custFormValues = $scope.view.applicationData.custFormValues;
                        for(var i=0; i< custFormValues.length; i++){
                            switch (custFormValues[i].messageKey){
                                // 修改部门为申请人所在的部门
                                case 'select_department':
                                    $scope.agency.departmentChange(i, applicant);
                                    break;
                                // 清空成本中心内容
                                case 'select_cost_center':
                                    $scope.agency.costCenterChange(i, applicant);
                                    // $scope.agency.costCenterClear(i);
                                    break;
                                // 修改法人实体为申请人所在的法人实体
                                case 'select_corporation_entity':
                                    $scope.agency.corporationEntityChange(i, applicant);
                                    break;
                                // 清除银行卡信息
                                case 'contact_bank_account':
                                    // $scope.agency.bankAccountClear(i);
                                    $scope.agency.bankAccountChange(i, applicant);
                                    break;
                                // 修改默认参与人
                                case 'select_participant':
                                    $scope.agency.participantChange(i, applicant);
                                    break;
                                //修改值列表
                                case 'cust_list':
                                    $scope.view.applicationData.custFormValues[i].value = null;
                                    $scope.view.applicationData.custFormValues[i].valueKey = null;
                                    break
                            }
                        }
                    }

                    // 修改申请人OID
                    $scope.view.applicantOID = applicant.userOID;
                    // 获取申请人FunctionProfile信息
                    FunctionProfileService.getUserFunctionProfile(applicant.userOID).then(function (response) {
                        $scope.view.functionProfileList = response.data;
                        //最大参与人数量
                        if($scope.view.functionProfileList && $scope.view.functionProfileList['ca.max.accompanies'] && Math.floor($scope.view.functionProfileList['ca.max.accompanies']) == $scope.view.functionProfileList['ca.max.accompanies']){
                            $scope.view.maxLengthParticipants = parseInt($scope.view.functionProfileList['ca.max.accompanies']);
                        } else {
                            $scope.view.maxLengthParticipants = -1;
                        }
                        relativeHandle();
                        $rootScope.applicationApplicantChanged = false;  // 释放变量
                    })
                }
            };

            var init = function () {
                PublicFunction.showLoading();
                $scope.view.hasInit = false;
                $scope.view.currentLocation = LocationService.getExpenseCreateLocation();
                Principal.identity().then(function (data) {
                    // 默认申请人为本人
                    var defaultApplicant = AgencyService.getApplicantItem(data);

                    // 设置FormOID
                    AgencyService.setFormOID($stateParams.formOID);
                    // 初始化申请人OID为当前用户OID,避免没有代理关系的时候选不到银行卡
                    $scope.view.applicantOID = data.userOID;
                    $scope.view.userOID = data.userOID;
                    $scope.view.corporationOID = data.corporationOID;

                    //根据申请人OID，获取默认银行账户
                    $scope.view.getDefaultBankAccount($scope.view.applicantOID);

                    $scope.view.companyOID = data.companyOID;

                    //获取公司管理员列表
                    if($scope.view.companyOID){
                        CustomApplicationServices.getAdminList($scope.view.companyOID)
                            .success(function (data) {
                                $scope.view.adminList = data;
                            })
                    }
                    $scope.view.departmentInfo.departmentOID = data.departmentOID;
                    $scope.view.departmentInfo.departmentName = data.departmentName;
                    $scope.currentUser = {};
                    $scope.currentUser.avatar = data.filePath;
                    $scope.currentUser.fullName = data.fullName;
                    $scope.currentUser.participantOID = data.userOID;
                    $scope.currentUser.userOID = data.userOID;
                    FunctionProfileService.getFunctionProfileList().then(function (data) {
                        $scope.view.functionProfileList = data;

                        //最大参与人数量
                        if($scope.view.functionProfileList && $scope.view.functionProfileList['ca.max.accompanies'] && Math.floor($scope.view.functionProfileList['ca.max.accompanies']) == $scope.view.functionProfileList['ca.max.accompanies']){
                            $scope.view.maxLengthParticipants = parseInt($scope.view.functionProfileList['ca.max.accompanies']);
                        } else {
                            $scope.view.maxLengthParticipants = -1;
                        }
                        //返回过来的数据,默认为false,代表可修改
                        if (data['web.expense.rate.edit.disabled'] == "true" || data['web.expense.rate.edit.disabled'] == true) {
                            $scope.view.rateCanChangeAble = false;
                        } else {
                            $scope.view.rateCanChangeAble = true;
                        }


                        if($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]){
                            var array = $scope.view.departmentInfo.departmentName.split('|');
                            $scope.view.departmentInfo.departmentName = array[array.length -1];
                            $scope.view.getDepartmentDetail($scope.view.departmentInfo.departmentOID);
                        } else {
                            $scope.view.getDepartmentDetail($scope.view.departmentInfo.departmentOID);
                        }
                    });
                    //获取币种
                    SelfDefineExpenseReport.getCashCategoryList()
                        .success(function (data) {
                            data = data.filter(function (item) {
                                return item.enable === true;
                            });
                            $scope.view.cashCategoryList = data;
                        });
                    //获取费用类型
                    // ExpenseService.getExpenseTypes($scope.view.companyOID)
                    //     .then(function (data) {
                    //         $scope.view.expenseTypeList = data;
                    //     })
                    CompanyConfigurationService.getCompanyConfiguration()
                        .then(function (configuration) {
                            //设置本位币
                            $scope.view.originCurrencyCode = configuration.currencyCode;
                            $scope.view.currencyCode = configuration.currencyCode;
                            $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                            if ($scope.view.content === 'create') {

                                var userList = [];
                                userList.push($scope.view.userOID);
                                $scope.view.authorityData.participantsOID = userList;
                                $scope.view.authorityData.proposerOID = $scope.view.userOID;
                                $scope.view.authorityData.formOID = $stateParams.formOID;

                                // $scope.view.showSupplierList = data.configuration.ui.showSupplierList;//供应商选择
                                SelfDefineExpenseReport.getCustomForm($stateParams.formOID)
                                    .success(function (data) {
                                        $scope.view.applicationData = data;
                                        if($scope.view.applicationData.customFormProperties){
                                            $scope.view.applicationData.closeEnabled = $scope.view.applicationData.customFormProperties.enabled;
                                        }
                                        //计算 停用日期
                                        if($scope.view.applicationData.closeEnabled){
                                            if($scope.view.applicationData.customFormProperties.closeDay && parseInt($scope.view.applicationData.customFormProperties.closeDay) == $scope.view.applicationData.customFormProperties.closeDay){
                                                $scope.view.applicationData.closeDate = new Date();
                                                $scope.view.applicationData.closeDate = $scope.view.applicationData.closeDate.setDate(new Date($scope.view.applicationData.closeDate).getDate() + $scope.view.applicationData.customFormProperties.closeDay);
                                                $scope.view.applicationData.closeDate = new Date($scope.view.applicationData.closeDate).Format('yyyy-MM-dd');
                                            } else {
                                                $scope.view.applicationData.closeDate = new Date();
                                            }
                                        }
                                        $scope.view.initParticipantHolder();
                                        SelfDefineExpenseReport.getFormExpenseType($scope.view.applicationData.formOID)
                                            .success(function (data) {
                                                $scope.view.expenseTypeList = data.expenseTypes;
                                            })
                                        //差旅申请
                                        if ($scope.view.applicationData.formType === 2001) {
                                            $scope.view.hasChangeDate = true;
                                            // $scope.view.applicationData.travelApplication = {};
                                            // if($scope.view.applicationData.customFormProperties.enabled == 1){
                                            //     $scope.view.applicationData.travelApplication.closeDate = new Date().setDate(new Date().getDate + $scope.view.applicationData.customFormProperties.closeDay);
                                            // } else if($scope.view.applicationData.customFormProperties.enabled == 0){
                                            //     $scope.view.applicationData.travelApplication.closeDate = new Date();
                                            // }
                                            $scope.view.applicationData.travelApplication = {};
                                            $scope.view.applicationData.travelApplication.travelItinerarys = [];
                                            if($scope.view.applicationData.customFormPropertyMap){
                                                $scope.view.applicationData.travelApplication.manageType = $scope.view.applicationData.customFormPropertyMap['application.property.manage.type'];
                                            }
                                            //获取差旅申请配置，区分走1001地点集管控(旧的申请单) 1002行程管控(新的申请单)
                                        }
                                        //费用申请
                                        // if($scope.view.applicationData.formType === 2002){
                                        //     if($scope.view.applicationData.customFormProperties.enabled == 1){
                                        //         $scope.view.applicationData.expenseApplication.closeDate = new Date().setDate(new Date().getDate + $scope.view.applicationData.customFormProperties.closeDay);
                                        //     } else if($scope.view.applicationData.customFormProperties.enabled == 0){
                                        //         $scope.view.applicationData.expenseApplication.closeDate = new Date();
                                        //     }
                                        // }

                                        $scope.view.applicationData.custFormValues = [];
                                        if ($scope.view.applicationData.customFormFields && $scope.view.applicationData.customFormFields.length > 0) {
                                            var finishLoop = false;
                                            for (var i = 0; i < $scope.view.applicationData.customFormFields.length; i++) {
                                                var field = $scope.view.applicationData.customFormFields[i];
                                                if (field.fieldType === 'CUSTOM_ENUMERATION' || field.messageKey === 'cust_list') {
                                                    if(field.dataSource && JSON.parse(field.dataSource)){
                                                        var json = JSON.parse(field.dataSource);
                                                        field.customEnumerationOID = json.customEnumerationOID;
                                                    } else {
                                                        field.customEnumerationOID = null;
                                                    }
                                                    $scope.view.getMessageKeyDetailByCreate(i,field.customEnumerationOID );
                                                }else if(field.fieldType === 'BOOLEAN'){
                                                    field.value = false;
                                                }else if (field.messageKey === 'applicant') {
                                                    $scope.view.applicantIndex = i;
                                                    field.applicant = defaultApplicant;
                                                    field.value = null;
                                                } else if(field.messageKey === 'out_participant_name'){
                                                    field.value = null;
                                                } else if (field.messageKey === 'writeoff_flag') {
                                                    field.value = false;
                                                } else if(field.messageKey === 'select_corporation_entity'){
                                                    field.entityName = null;
                                                    field.value = $scope.view.corporationOID;
                                                    $scope.view.getCorporationEntityName(i);
                                                } else if (field.messageKey === 'start_date' || field.messageKey === 'end_date') {
                                                    $scope.view.hasStartEndDate ++;
                                                    field.value = new Date();
                                                } else if (field.messageKey === 'currency_code') {
                                                    field.value = $scope.view.currencyCode;
                                                } else if (field.messageKey === 'select_department') {
                                                    field.value = $scope.view.departmentInfo.departmentOID;
                                                    $scope.view.authorityData.departmentOID =  $scope.view.departmentInfo.departmentOID;
                                                    $scope.view.departmentOID = $scope.view.departmentInfo.departmentOID;
                                                    field.departmentName = $scope.view.departmentInfo.departmentName;
                                                    if(field.fieldConstraint && JSON.parse(field.fieldConstraint)){
                                                        var json = JSON.parse(field.fieldConstraint);
                                                        field.valueReadonly = json.valueReadonly;
                                                    }
                                                } else if (field.messageKey === 'select_cost_center') {
                                                    var item = {};
                                                    item.fieldOID = field.fieldOID;
                                                    item.name = null;
                                                    $scope.view.authorityData.costCentreOID.push(item);
                                                    field.costCenterName = null;
                                                    try{
                                                        if (field.dataSource !== null && field.dataSource !== "" && field.dataSource != "{}" && JSON.parse(field.dataSource)) {
                                                            var json = JSON.parse(field.dataSource);
                                                            field.costCenterOID = json.costCenterOID;
                                                            //获取成本中心默认值
                                                            $scope.view.getDefaultCostCenter($scope.view.applicantOID, json.costCenterOID, field);
                                                            $scope.view.getCostCenterLength(field.costCenterOID, i);
                                                        }
                                                    } catch(error){

                                                    }

                                                    if(field.fieldConstraint && JSON.parse(field.fieldConstraint)){
                                                        var json = JSON.parse(field.fieldConstraint);
                                                        field.valueReadonly = json.valueReadonly;
                                                    }
                                                } else if (field.messageKey === 'select_approver') {
                                                    //选人
                                                    field.approvalSelectedName = null;
                                                    if (field.fieldConstraint !== null && field.fieldConstraint !== "") {
                                                        var json = JSON.parse(field.fieldConstraint);
                                                        field.maxApprovalChain = json.maxApprovalChain;
                                                    }
                                                }  else if (field.messageKey === 'select_user') {
                                                    field.approvalSelectedName = null;
                                                    if (field.fieldConstraint !== null && field.fieldConstraint !== "") {
                                                        var json = JSON.parse(field.fieldConstraint);
                                                        if(json.selectMode === 0){
                                                            field.maxApprovalChain = 1;
                                                        } else {
                                                            field.maxApprovalChain = -1;
                                                        }
                                                    }
                                                } else if (field.messageKey === 'select_special_booking_person') {
                                                    field.bookerName = null;
                                                    field.value = null;
                                                } else if (field.messageKey === 'budget_detail') {
                                                    field.invoiceList = [];
                                                    field.amount = 0;
                                                    field.expenseTotalAmount = 0;
                                                    field.value = null;
                                                } else if (field.messageKey === 'select_air_ticket_supplier') {
                                                    var supplyIndex = i;
                                                    $scope.view.applicationData.customFormFields[supplyIndex].selectedSupplier = null;
                                                    $scope.view.applicationData.customFormFields[supplyIndex].SupplierList = null;
                                                    $scope.view.applicationData.customFormFields[supplyIndex].value = null;
                                                    $scope.view.getSupplierList(supplyIndex);
                                                } else if (field.messageKey === 'select_participant') {
                                                    // 参与人员
                                                    $scope.view.hasInter = true;
                                                    field.value = null;
                                                    $scope.view.participantIndex = i;
                                                }  else if(field.messageKey === 'linkage_switch'){
                                                    field.value = false;
                                                    if(field.fieldContent && JSON.parse(field.fieldContent)){
                                                        field.content = JSON.parse(field.fieldContent);
                                                    } else {
                                                        field.content = [];
                                                    }
                                                }  else if(field.messageKey === 'select_box'){
                                                    //选择框
                                                    field.selectValue = [];
                                                    field.value = [];
                                                    field.selectID = [];
                                                    if(field.fieldContent && JSON.parse(field.fieldContent)){
                                                        field.content = JSON.parse(field.fieldContent);
                                                    }
                                                    if(field.fieldConstraint && JSON.parse(field.fieldConstraint)){
                                                        var json = JSON.parse(field.fieldConstraint);
                                                        field.type = json.type;
                                                    }
                                                } else if(field.messageKey === 'attachment' && field.fieldConstraint){
                                                    //获取并设置上传最大数量
                                                    field.attachmentImages = [];
                                                    if (field.fieldConstraint && JSON.parse(field.fieldConstraint)){
                                                        var conditions = JSON.parse(field.fieldConstraint);
                                                        field.maxLength = conditions.maxNumber;
                                                    }

                                                } else if(field.messageKey === 'contact_bank_account'){
                                                    if($scope.view.defaultBankAccount){
                                                        //银行卡
                                                        field.bankAccountNo = $scope.view.defaultBankAccount.bankAccountNo;
                                                        field.promptInfo = $scope.view.defaultBankAccount.bankName;
                                                        field.value = $scope.view.defaultBankAccount.contactBankAccountOID;
                                                    }else{
                                                        field.value = null;
                                                    }

                                                } else if(field.messageKey === 'out_participant_num'){
                                                    //外部参与人数量
                                                    $scope.view.hasOuter = true;
                                                    field.value = null;
                                                } else if(field.messageKey === 'number'){
                                                    field.value = null;
                                                } else if(field.messageKey === 'out_participant_name'){
                                                    //外部参与人
                                                    $scope.view.hasOuterMember = true;
                                                    field.value = null;
                                                } else {
                                                    field.value = null;
                                                }
                                                $scope.view.applicationData.custFormValues.push(field);
                                                if(i >= $scope.view.applicationData.customFormFields.length -1){
                                                    finishLoop = true;
                                                }
                                            }
                                            if(finishLoop){
                                                $scope.view.custFormValuesCopy = angular.copy($scope.view.applicationData.custFormValues);
                                                $scope.view.hasInit = true;
                                                if($scope.view.applicationData.customFormProperties.participantsScope != 6){
                                                    CustomApplicationServices.getUserInForm($scope.view.authorityData)
                                                        .success(function (data) {
                                                            if(data && data.length > 0){
                                                                if(!data[0].errorDetail){
                                                                    $scope.view.applicationParticipants.push($scope.currentUser);
                                                                    $scope.view.interMemberList.push($scope.currentUser);
                                                                    $scope.view.authorityData.participantsOID.push($scope.currentUser.userOID);
                                                                }
                                                            }
                                                        })
                                                }

                                                    // .error(function (error) {
                                                    //     $scope.view.disabled = false;
                                                    //     $ionicLoading.hide();
                                                    //     if(error && error.validationErrors && error.validationErrors.length > 0 && error.validationErrors[0]){
                                                    //         PublicFunction.showToast(error.validationErrors[0].message);
                                                    //     } else {
                                                    //         PublicFunction.showToast('校验参与人数据权限出错');
                                                    //     }
                                                    //
                                                    // })
                                            }

                                        }
                                    })
                                    .finally(function () {
                                        $ionicLoading.hide();
                                    });
                            } else if ($scope.view.content === 'edit') {
                                if ($stateParams.formType == 1001) {
                                    //普通表单
                                    $scope.view.currentUrl = '';
                                } else if ($stateParams.formType == 2001) {
                                    //差旅申请单
                                    $scope.view.currentUrl = '/api/travel/applications/my/get/';
                                } else if ($stateParams.formType == 2002) {
                                    //费用申请单
                                    $scope.view.currentUrl = '/api/expense/applications/';
                                } else if ($stateParams.formType == 2003) {
                                    //订票申请单
                                    $scope.view.currentUrl = '/api/travel/booker/applications/my/get/';
                                } else if ($stateParams.formType == 2005) {
                                    //借款申请单
                                    $scope.view.currentUrl = '/api/loan/application/';
                                }
                                $scope.view.hasChangeDate = false;
                                CustomApplicationServices.getApplicationDetail($scope.view.currentUrl, $stateParams.applicationOID)
                                    .success(function (data) {
                                        $scope.view.applicationData = data;
                                        $scope.view.authorityData.proposerOID = $scope.view.applicationData.applicantOID;
                                        $scope.view.initParticipantHolder();
                                        $scope.view.authorityData.formOID = $scope.view.applicationData.formOID;
                                        SelfDefineExpenseReport.getFormExpenseType($scope.view.applicationData.formOID)
                                            .success(function (data) {
                                                $scope.view.expenseTypeList = data.expenseTypes;
                                            });
                                        //币种获取
                                        if ($stateParams.formType == 2001) {
                                            //差旅申请单
                                            if($scope.view.applicationData.travelApplication.currencyCode){
                                                $scope.view.currencyCode = $scope.view.applicationData.travelApplication.currencyCode;
                                                $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                                            }
                                            //是否有差补
                                            if($scope.view.applicationData.travelApplication
                                                && $scope.view.applicationData.travelApplication.travelSubsidies && $scope.view.applicationData.travelApplication.travelSubsidies != null
                                                && $scope.view.applicationData.travelApplication.travelSubsidies != ''){
                                                $scope.view.hasAllowance = true;
                                            } else {
                                                $scope.view.hasAllowance = false;
                                            }
                                            //是否有行程

                                        } else if ($stateParams.formType == 2002) {
                                            //费用申请单
                                            if($scope.view.applicationData.expenseApplication.currencyCode){
                                                $scope.view.currencyCode = $scope.view.applicationData.expenseApplication.currencyCode;
                                                $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                                            }
                                        } else if ($stateParams.formType == 2003) {
                                            //订票申请单
                                            if($scope.view.applicationData.travelBookerApplication.currencyCode){
                                                $scope.view.currencyCode = $scope.view.applicationData.travelBookerApplication.currencyCode;
                                                $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                                            }
                                        } else if ($stateParams.formType == 2005) {
                                            //借款申请单
                                            if($scope.view.applicationData.loanApplication.currencyCode){
                                                $scope.view.currencyCode = $scope.view.applicationData.loanApplication.currencyCode;
                                                $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                                            }
                                        }
                                        // 设置FormOID
                                        AgencyService.setFormOID($scope.view.applicationData.formOID);

                                        function dataParse(){
                                            var dataParseFinish = false;
                                            for (var i = 0; i < $scope.view.applicationData.custFormValues.length; i++) {
                                                var formValue = $scope.view.applicationData.custFormValues[i];
                                                // 开关
                                                if(formValue.fieldType === 'BOOLEAN'){
                                                    formValue.value = formValue.value === 'true';
                                                } else if (formValue.messageKey === 'applicant') {
                                                    // 申请人
                                                    $scope.view.applicantIndex = i;
                                                    // 获取申请人信息
                                                    AgencyService.getUserDetail(formValue.value).then(function(response){
                                                        formValue.applicant = AgencyService.getApplicantItem(response.data);
                                                    });
                                                    // 修改申请人OID
                                                    $scope.view.applicantOID = formValue.value;
                                                    $scope.view.authorityData.proposerOID = formValue.value;
                                                } else if ((formValue.fieldType && formValue.fieldType === 'CUSTOM_ENUMERATION') || formValue.messageKey === 'cust_list') {
                                                    //值列表
                                                    if(formValue.dataSource && JSON.parse(formValue.dataSource)){
                                                        var json = JSON.parse(formValue.dataSource);
                                                        formValue.customEnumerationOID = json.customEnumerationOID;
                                                    } else {
                                                        formValue.customEnumerationOID = null;
                                                    }
                                                    if (formValue.value) {
                                                        //$scope.view.getValueName(i);
                                                        $scope.view.getMessageKeyDetail(i,formValue.customEnumerationOID,formValue.value);
                                                    }else{
                                                        //值列表修改状态下，当值列表状态由禁用变成启用时，该值列表没有value
                                                        $scope.view.getMessageKeyDetailByCreate(i,formValue.customEnumerationOID );

                                                    }
                                                } else if (formValue.messageKey === 'select_cost_center') {
                                                    //成本中心项目名字获取
                                                    var item = {};
                                                    item.fieldOID = formValue.fieldOID;
                                                    item.name = formValue.value;
                                                    $scope.view.authorityData.costCentreOID.push(item);
                                                    if (formValue.dataSource !== null && formValue.dataSource !== "") {
                                                        var json = JSON.parse(formValue.dataSource);
                                                        formValue.costCenterOID = json.costCenterOID;
                                                        $scope.view.getCostCenterName(i);
                                                        $scope.view.getCostCenterLength(formValue.costCenterOID, i);
                                                    }
                                                }
                                                if(formValue.messageKey === 'contact_bank_account'){
                                                    //银行卡
                                                    formValue.bankAccountNo = null;
                                                    $scope.view.getContactBankAccountName(i);
                                                }
                                                if (formValue.messageKey === 'select_department') {
                                                    //部门名称获取
                                                    $scope.view.departmentOID = formValue.value;
                                                    $scope.view.authorityData.departmentOID = formValue.value;
                                                    $scope.view.getDepartmentName(i);
                                                    if(formValue.fieldConstraint && JSON.parse(formValue.fieldConstraint)){
                                                        var json = JSON.parse(formValue.fieldConstraint);
                                                        formValue.valueReadonly = json.valueReadonly;
                                                    }

                                                }
                                                if (formValue.messageKey === 'select_approver') {
                                                    if (formValue.fieldConstraint && formValue.fieldConstraint !== null && formValue.fieldConstraint !== "") {
                                                        var json = JSON.parse(formValue.fieldConstraint);
                                                        formValue.maxApprovalChain = json.maxApprovalChain;
                                                    }
                                                    $scope.view.getSelectedApproval(i);
                                                }
                                                if (formValue.messageKey === 'select_user') {
                                                    if (formValue.fieldConstraint && formValue.fieldConstraint !== null && formValue.fieldConstraint !== "") {
                                                        var json = JSON.parse(formValue.fieldConstraint);
                                                        if(json.selectMode === 0){
                                                            formValue.maxApprovalChain = 1;
                                                        } else {
                                                            formValue.maxApprovalChain = -1;
                                                        }
                                                    }
                                                    $scope.view.getSelectedApproval(i);
                                                }
                                                if (formValue.messageKey === 'out_participant_num') {
                                                    $scope.view.hasOuter = true;
                                                    if(formValue.value && Math.floor(formValue.value) == formValue.value){
                                                        formValue.value = parseInt(formValue.value);
                                                        $scope.view.outParticipantNum = parseInt(formValue.value);
                                                    } else {
                                                        formValue.value = null;
                                                        $scope.view.outParticipantNum = null;
                                                    }

                                                }
                                                if (formValue.messageKey === 'number') {
                                                    if(formValue.value && Math.floor(formValue.value) == formValue.value){
                                                        formValue.value = Math.floor(formValue.value);
                                                    } else {
                                                        formValue.value = null;
                                                    }
                                                }
                                                if (formValue.messageKey === 'total_budget') {
                                                    formValue.value = parseFloat(formValue.value);
                                                }
                                                if (formValue.messageKey === 'average_budget' && formValue.value) {
                                                    formValue.value = parseFloat(formValue.value);
                                                }
                                                if (formValue.messageKey === 'select_special_booking_person') {
                                                    $scope.view.getBookerName(i);
                                                }
                                                if (formValue.messageKey === 'budget_detail') {
                                                    $scope.view.invoiceIndex = i;
                                                    $scope.view.getInvoiceList($scope.view.invoiceIndex);
                                                }
                                                if (formValue.messageKey === 'select_air_ticket_supplier') {
                                                    var supplyIndex = i;
                                                    $scope.view.applicationData.custFormValues[supplyIndex].selectedSupplier = null;
                                                    $scope.view.applicationData.custFormValues[supplyIndex].SupplierList = null;
                                                    $scope.view.getSupplierList(supplyIndex);
                                                }
                                                if (formValue.messageKey === 'start_date') {
                                                    $scope.view.hasStartEndDate ++;
                                                    $scope.view.startDate = formValue.value;
                                                    $scope.view.oldStartDate = $scope.view.startDate;
                                                    if($scope.view.hasStartEndDate == 2){
                                                        //获取所有差旅行程
                                                        if(!$scope.view.hasGetItinerary){
                                                            $scope.view.hasGetItinerary = true;
                                                            $scope.view.getAllItineraryDetail();
                                                        }
                                                    }
                                                }
                                                if (formValue.messageKey === 'end_date') {
                                                    $scope.view.hasStartEndDate ++;
                                                    $scope.view.endDate = formValue.value;
                                                    $scope.view.oldEndDate = $scope.view.endDate;
                                                    if($scope.view.hasStartEndDate == 2){
                                                        //获取所有差旅行程
                                                        if(!$scope.view.hasGetItinerary){
                                                            $scope.view.hasGetItinerary = true;
                                                            $scope.view.getAllItineraryDetail();
                                                        }
                                                    }
                                                }
                                                if (formValue.messageKey === 'date') {
                                                    if (formValue.value) {
                                                        $scope.view.timeDate = formValue.value;
                                                    }else{
                                                        $scope.view.timeDate= formValue.lastModifiedDate;
                                                    }
                                                }
                                                if (formValue.messageKey === 'currency_code') {
                                                    $scope.view.currencyCode = formValue.value;
                                                    $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                                                }
                                                if(formValue.messageKey === 'select_corporation_entity'){
                                                    $scope.view.corporationOID = formValue.value;
                                                    $scope.view.getCorporationEntityName(i);
                                                }
                                                if (formValue.messageKey === 'select_participant') {
                                                    $scope.view.hasInter = true;
                                                    $scope.view.participantIndex = i;
                                                    $scope.view.authorityData.participantsOID = [];
                                                    if (formValue.value !== null && formValue.value !== '') {
                                                        $scope.view.interMemberList = JSON.parse(formValue.value);
                                                        if($scope.view.interMemberList && $scope.view.interMemberList.length > 0){
                                                            for(var j = 0; j < $scope.view.interMemberList.length; j++){
                                                                $scope.view.authorityData.participantsOID.push($scope.view.interMemberList[j].userOID);
                                                            }
                                                        }
                                                    } else {
                                                        $scope.view.interMemberList = [];
                                                    }
                                                }
                                                //外部参与人
                                                if(formValue.messageKey === 'out_participant_name'){
                                                    $scope.view.hasOuterMember = true;
                                                    if (formValue.value !== null && formValue.value !== '') {
                                                        $scope.view.outerMemberList = JSON.parse(formValue.value);
                                                    } else {
                                                        $scope.view.outerMemberList = [];
                                                    }
                                                }
                                                //联动开关
                                                if(formValue.messageKey === 'linkage_switch'){
                                                    if(formValue.value === 'true'){
                                                        formValue.value = true;
                                                    } else {
                                                        formValue.value = false;
                                                    }
                                                    if(formValue.fieldContent && JSON.parse(formValue.fieldContent)){
                                                        formValue.content = JSON.parse(formValue.fieldContent);
                                                    } else {
                                                        formValue.content = [];
                                                    }
                                                }
                                                if(formValue.messageKey === 'select_box'){
                                                    //选择框
                                                    formValue.selectValue = JSON.parse(formValue.value);
                                                    $scope.view.getSelectBoxId(i);
                                                    if(formValue.fieldContent && JSON.parse(formValue.fieldContent)){
                                                        formValue.content = JSON.parse(formValue.fieldContent);
                                                    }
                                                    if(formValue.fieldConstraint && JSON.parse(formValue.fieldConstraint)){
                                                        var json = JSON.parse(formValue.fieldConstraint);
                                                        formValue.type = json.type;
                                                    }
                                                }

                                                //action2：获取附件 && 设置最大上传数量
                                                if(formValue.messageKey === 'attachment'){
                                                    // 获取附件
                                                    if(formValue.attachmentImages && formValue.attachmentImages.length){
                                                        $scope.view.attachments = formValue.attachmentImages;
                                                    }
                                                    // 设置最大上传数量
                                                    if (formValue.fieldConstraint){
                                                        //bug修复，如果这个值不为空，才能parse
                                                        var conditions = JSON.parse(formValue.fieldConstraint);
                                                        formValue.maxLength = conditions.maxNumber;
                                                    }
                                                }
                                                if(i >= $scope.view.applicationData.custFormValues.length -1){
                                                    dataParseFinish = true;
                                                }
                                            }
                                            if(dataParseFinish){
                                                $scope.view.custFormValuesCopy = angular.copy($scope.view.applicationData.custFormValues);
                                                $scope.view.hasInit = true;
                                                //费用预算
                                                if($scope.view.invoiceIndex > -1){
                                                    var json = JSON.parse($scope.view.applicationData.custFormValues[$scope.view.invoiceIndex].value);
                                                    if(json){
                                                        $scope.view.applicationData.custFormValues[$scope.view.invoiceIndex].invoiceList = json.budgetDetail;
                                                        $scope.view.applicationData.custFormValues[$scope.view.invoiceIndex].amount = json.amount;
                                                    } else {
                                                        $scope.view.applicationData.custFormValues[$scope.view.invoiceIndex].invoiceList = [];
                                                        $scope.view.applicationData.custFormValues[$scope.view.invoiceIndex].amount = 0;
                                                    }
                                                }
                                            }
                                        }

                                        // 判断是否有申请人字段并且申请人是否为当前用户
                                        var formValues = $scope.view.applicationData.custFormValues;
                                        var index = AgencyService.getDetailFromFormValuesByKey('applicant', formValues);
                                        // 如果没有申请人字段或者申请人为当前用户,直接解析数据,否则,获取申请人的function profile,再处理
                                        if (!index || formValues[index].value===$scope.view.userOID){
                                            FunctionProfileService.getUserFunctionProfile($scope.view.userOID).then(function(response){
                                                $scope.view.functionProfileList = response.data;
                                                //最大参与人数量
                                                if($scope.view.functionProfileList && $scope.view.functionProfileList['ca.max.accompanies'] && Math.floor($scope.view.functionProfileList['ca.max.accompanies']) == $scope.view.functionProfileList['ca.max.accompanies']){
                                                    $scope.view.maxLengthParticipants = parseInt($scope.view.functionProfileList['ca.max.accompanies']);
                                                } else {
                                                    $scope.view.maxLengthParticipants = -1;
                                                }
                                                dataParse();
                                            })
                                            // dataParse();
                                        } else {
                                            FunctionProfileService.getUserFunctionProfile(formValues[index].value).then(function(response){
                                                $scope.view.functionProfileList = response.data;
                                                //最大参与人数量
                                                if($scope.view.functionProfileList && $scope.view.functionProfileList['ca.max.accompanies'] && Math.floor($scope.view.functionProfileList['ca.max.accompanies']) == $scope.view.functionProfileList['ca.max.accompanies']){
                                                    $scope.view.maxLengthParticipants = parseInt($scope.view.functionProfileList['ca.max.accompanies']);
                                                } else {
                                                    $scope.view.maxLengthParticipants = -1;
                                                }
                                                dataParse();
                                            })
                                        }
                                    })
                                    .finally(function () {
                                        $ionicLoading.hide();
                                    });
                            }
                        })
                })
            };

            init();

            $ionicPopover.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/base.popover.tpl.html', {
                scope: $scope
            }).then(function(popover) {
                $scope.popover = popover;
            });
            $scope.openPopover = function($event) {
                $scope.view.rightNavList = [
                    {
                        name: $filter('translate')('custom.application.nav.delete'),  //'删除该申请单'
                        id: 'delete'
                    }
                ]
                $scope.popover.show($event);
            };

            $scope.$watch('view.departmentInfo.departmentOID', function (newValue, oldValue) {
                if (newValue !== oldValue && newValue) {
                    $scope.view.authorityData.departmentOID = $scope.view.departmentInfo.departmentOID;
                }
            });




            //选择币种
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/self_define_expense_report/select.currency.code.tpl.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.selectCurrencyCode = modal;
            });
            //借款须知
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/custom_application/modal/didi.refund.tips.modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.refundTipsModal = modal;
            });
            //结束时 销毁modal
            $scope.$on('$destroy', function() {
                $scope.refundTipsModal.remove();
            });

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
            $scope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    // 清空申请人OID,单据OID,报销单关联的申请单OID
                    AgencyService.clearAll();

                    $rootScope.applicationApplicantChanged = false;  // 释放变量
                });
            // 监听申请人的变化,进行相应关联处理
            $rootScope.$watch('applicationApplicantChanged', function (newValue, oldValue) {
                if (newValue) {
                    // 延时100ms,让选人控件先执行完
                    $timeout(function(){
                        var custFormValues = $scope.view.applicationData.custFormValues;
                        // 获取申请人字段
                        // var index = AgencyService.getDetailFromFormValuesByKey('applicant', custFormValues);
                        if ($scope.view.applicantIndex > -1){
                            var index = $scope.view.applicantIndex;
                            custFormValues[index].value = custFormValues[index].applicant.userOID;
                            $scope.agency.applicantChange(custFormValues[index].applicant);
                            var userIndex = $scope.view.authorityData.participantsOID.indexOf($scope.view.authorityData.proposerOID);
                            if(userIndex > -1){
                                $scope.view.authorityData.participantsOID.splice(userIndex, 1);
                                $scope.view.interMemberList.splice(userIndex, 1);
                                $scope.view.authorityData.proposerOID = custFormValues[index].applicant.userOID;
                                var authorityDataCopy = angular.copy($scope.view.authorityData);
                                if($scope.view.authorityData.participantsOID.indexOf($scope.view.authorityData.proposerOID) <= -1){
                                    //需判断当前申请人符不符合权限
                                    authorityDataCopy.participantsOID.push($scope.view.authorityData.proposerOID);
                                    CustomApplicationServices.getUserInForm(authorityDataCopy)
                                        .success(function (data) {
                                            for(var i = 0; i < data.length; i++){
                                                if(data[i].userOID == $scope.view.authorityData.proposerOID && !data[i].errorDetail){
                                                    $scope.view.interMemberList.push(custFormValues[index].applicant);
                                                    $scope.view.authorityData.participantsOID.push($scope.view.authorityData.proposerOID);
                                                }
                                            }
                                        })
                                }
                            } else {
                                $scope.view.authorityData.proposerOID = custFormValues[index].applicant.userOID;
                            }
                        }
                    }, 100);
                }
            });
        }]);
