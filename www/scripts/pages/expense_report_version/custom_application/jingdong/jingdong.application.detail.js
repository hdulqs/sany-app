/**
 * Created by lizhi on 16/11/8.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.jingdong_application_wait_approval', {
                url: '/jingdong/application/wait/approval?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/jingdong/jingdong.application.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.JingDongApplicationDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'waitApproval';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('jingdong');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.jingdong_application_has_pass', {
                url: '/jingdong/application/has/pass?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/jingdong/jingdong.application.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.JingDongApplicationDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'hasPass';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('jingdong');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.jingdong_application_approval', {
                url: '/jingdong/application/approval?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/jingdong/jingdong.application.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.JingDongApplicationDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'approval';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('jingdong');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.jingdong_application_detail', {
                url: '/jingdong/application/detail?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/jingdong/jingdong.application.detail.tpl.html',
                        controller: 'com.handchina.huilianyi.JingDongApplicationDetailController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'detail';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('jingdong');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.huilianyi.JingDongApplicationDetailController', ['$scope', '$state', 'PublicFunction', 'Principal',
        'CompanyConfigurationService', 'CustomApplicationServices', '$stateParams', '$ionicLoading', 'SelfDefineExpenseReport', 'content',
        '$q', '$ionicHistory', '$timeout', 'CostCenterService', 'TravelERVService', 'InvoiceApplyERVService', 'FunctionProfileService',
        'ExpenseService', 'CurrencyCodeService', '$ionicPopup', 'JingDongApplicationServices', 'FUNCTION_PROFILE', 'DepartmentService',
        'ApprovalERVService', '$location','$filter', 'AgencyService',
        function ($scope, $state, PublicFunction, Principal, CompanyConfigurationService, CustomApplicationServices, $stateParams, $ionicLoading,
                  SelfDefineExpenseReport, content, $q, $ionicHistory, $timeout, CostCenterService, TravelERVService, InvoiceApplyERVService,
                  FunctionProfileService, ExpenseService, CurrencyCodeService, $ionicPopup, JingDongApplicationServices, FUNCTION_PROFILE,
                  DepartmentService, ApprovalERVService, $location,$filter, AgencyService) {

            $scope.applicationOID = $stateParams.applicationOID;

            $scope.view = {
                content: content,
                application: null,
                companyOID: null,
                departmentInfo: {},
                //判断是否只选择叶子节点的function profile key
                leafDepSelectorRequired: FUNCTION_PROFILE['leafDepSelectorRequired'],
                // 京东订单剩余支付时间
                remainTime: null,
                // 剩余时间是否小于一天
                lessThanOneDay: false,
                // 是否显示表单详情
                showFormDetail: false,

                goBack: function (state) {
                    if(state){
                        $state.go(state);
                        return
                    }

                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('app.tab_erv.homepage');
                    }
                },

                // 跳转京东H5
                jumpJD: function(){
                    JingDongApplicationServices.jumpJD($location.path(), $scope.view.application.jingDongOrderApplication.jingDongOrder.orderNum);
                },

                // 跳转京东付款
                jumpJDPay: function(){
                    JingDongApplicationServices.jumpJDPay();
                },

                // 申请单错误处理
                applicationError: function(errMessage){
                    errMessage = errMessage?errMessage:$filter('translate')('base_js.Application.form.is.invalid');//申请单无效
                    PublicFunction.showToast(errMessage);
                    $timeout(function(){
                        $scope.view.goBack();
                    }, 1000);
                },

                // 显示或者隐藏表单详情
                expandFormDetail: function () {
                    $scope.view.showFormDetail = !$scope.view.showFormDetail
                },

                // 撤回申请
                withdrawApplication: function(){
                    var data = {"entities":[{"entityOID":$scope.view.application.applicationOID, "entityType":1001}]};
                    JingDongApplicationServices.withdrawApplication(data)
                        .success(function(){
                            CustomApplicationServices.setTab('init');
                            PublicFunction.showToast($filter('translate')('detail_js.Has.withdrawn'));//已撤回
                            $timeout(function () {
                                $scope.view.goBack();
                            }, 500);
                        })
                        .error(function(error){
                            if(error.message){
                                PublicFunction.showToast(error.message);
                            } else {
                                PublicFunction.showToast($filter('translate')('detail_js.Withdraw.the.failure'));//撤回失败
                            }
                        })
                },

                // 审批通过
                agree: function () {
                    PublicFunction.showLoading();
                    var entry = {};
                    entry.entities = [];
                    var entryItem = {};
                    entryItem.entityOID = $scope.applicationOID;
                    entryItem.entityType = 1001;
                    entry.entities.push(entryItem);
                    entry.approvalTxt = '';
                    ApprovalERVService.agree(entry)
                        .success(function (data) {
                            $ionicLoading.hide();
                            if (data.failNum > 0) {
                                PublicFunction.showToast($filter('translate')('detail_js.failed'));//失败了
                            } else {
                                PublicFunction.showToast($filter('translate')('detail_js.Have.been.through'));//已通过
                                $timeout(function () {
                                    $scope.view.goBack();
                                }, 500);
                            }
                        })
                        .error(function (error) {
                            $ionicLoading.hide();
                            if(error.message){
                                PublicFunction.showToast(error.message);
                            } else {
                                PublicFunction.showToast($filter('translate')('detail_js.failed'));//失败了
                            }
                        })
                },

                // 审批驳回
                reject: function () {
                    // 驳回处理
                    var rejectDeal = function () {
                        PublicFunction.showLoading();
                        var entry = {};
                        entry.entities = [];
                        var entryItem = {};
                        entryItem.entityOID = $stateParams.applicationOID;
                        entryItem.entityType = 1001;
                        entry.entities.push(entryItem);
                        entry.approvalTxt = $scope.view.rejectReason;
                        ApprovalERVService.reject(entry)
                            .success(function (data) {
                                PublicFunction.showToast($filter('translate')('detail_js.Has.been.rejected'));//已驳回
                                $timeout(function () {
                                    $scope.view.goBack();
                                }, 500);
                            })
                            .error(function (error) {
                                $ionicLoading.hide();
                                if(error.message){
                                    PublicFunction.showToast(error.message);
                                } else {
                                    PublicFunction.showToast($filter('translate')('detail_js.failed'));//失败了
                                }
                            })
                    };

                    // 弹框输入驳回理由
                    $scope.view.rejectReason = null;
                    var opinionPopup = $ionicPopup.show({
                        template: '<textarea type="text" style="padding:10px;" placeholder="' + $filter('translate')('detail_js.Please.enter.the.reject.reason') + '" ng-model="view.rejectReason" rows="6" maxlength="100">',
                        title: '<h5>'+$filter('translate')('detail_js.Reason.for.rejection')+'</h5>',//<h5>驳回理由</h5>
                        scope: $scope,
                        buttons: [
                            {text: $filter('translate')('detail_js.cancel')},//取消
                            {
                                text: $filter('translate')('detail_js.ok'),//确认
                                type: 'button-positive',
                                onTap: function (e) {
                                    if (!$scope.view.rejectReason) {
                                        $ionicLoading.show({
                                            template: $filter('translate')('detail_js.Please.enter.the.reject.reason'),//请输入驳回理由
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
                            rejectDeal();
                        } else {
                        }
                    });
                }
            };

            // 申请单信息处理
            $scope.applicationDataParse = {
                // 京东订单剩余付款时间计算
                remainTimeCaculate: function(createDate){
                    // 计算剩余支付时间
                    var createTime = new Date(createDate);
                    var timeNow = new Date();
                    // 计算剩余毫秒数
                    var remainMs = timeNow.getTime() - createTime.getTime();
                    // 计算剩余天数
                    var remainDay = 7 - Math.ceil(remainMs/(1000*3600*24));  // 向上取整
                    // 计算除去天数之后剩余小时
                    var remainHour = 24 - Math.ceil(remainMs%(1000*3600*24)/(1000*3600));  // 向上取整
                    // 合成剩余时间
                    if (remainDay<0){
                        $scope.view.applicationError($filter('translate')('base_js.Jingdong.order.time.error'))//京东订单时间出错
                    } else if (remainDay<1){
                        $scope.view.remainTime = String(remainHour) + $filter('translate')('base_js.hours');//小时
                        $scope.view.lessThanOneDay = true;
                    } else {
                        $scope.view.remainTime = String(remainDay) + $filter('translate')('base_js.day')/*天*/ + String(remainHour) + $filter('translate')('base_js.hours');//小时
                        $scope.view.lessThanOneDay = false;
                    }
                },

                // 获取成本中心
                getCostCenter: function(field){
                    CostCenterService.getCostCenterItemDetail(field.value)
                        .success(function (data) {
                            field.costCenterName = data.name;
                        })
                        .error(function () {
                            field.costCenterName = null;
                        })
                },

                // 获取部门
                getDepartment: function(field){
                    DepartmentService.getDepartmentInfo(field.value).then(function(response){
                        field.departmentName = response.data.path
                    })
                },

                // 获取审批人
                getApprover: function(field){
                    field.approvalSelectedName = '';
                    var userOIDList = field.value.split(":");
                    var user = {};
                    TravelERVService.getBatchUsers(userOIDList)
                        .success(function (data) {
                            // 将userOID与userName组成键值对(对象),便于排序输出
                            for (var i = 0; i < data.length; i++) {
                                user[data[i].userOID] = data[i].fullName;
                            }
                            // 将userName按照userOIDList的顺序组成一个字符串
                            for (i = 0; i < userOIDList.length; i++) {
                                field.approvalSelectedName += (i===userOIDList.length-1?user[userOIDList[i]]:user[userOIDList[i]]+',')
                            }
                        })
                },

                // 获取申请人
                getApplicant: function(field){
                    AgencyService.getUserDetail(field.value).then(function(response){
                        field.applicant = AgencyService.getApplicantItem(response.data);
                    });
                },

                dataParse: function(){
                    var data = $scope.view.application;

                    // 申请单类型 type 1001-费用申请, 1002-差旅申请,1003-订票申请，1004 -京东订单申请
                    // 订单状态 jingDongOrderApplication.jingDongOrder 1001-初始，1002-待付款，1003-已取消，1004-已付款
                    // 申请单状态 status 1001-初始，1002-提交审批，1003-审批通过
                    // 驳回类型 rejectType 1000-正常, 1001-撤回, 1002-审批驳回，1003-财务审核驳回，1004-开票驳回

                    // 待审批
                    if (data.status===1002 && $scope.view.content==='waitApproval'){
                    }
                    // 审批通过
                    else if (data.status===1003 && $scope.view.content==='hasPass'){
                    }
                    // 审批
                    else if ((data.status===1002 || data.status===1003) && $scope.view.content==='approval'){
                    }
                    // 消息页面查看详情
                    else if ($scope.view.content==='detail'){
                    }
                    else {
                        $scope.view.applicationError()
                    }

                    // 如果状态正常, 进行数据处理

                    // 如果没付款并且没取消
                    if (data.jingDongOrderApplication.jingDongOrder.status===1001 || data.jingDongOrderApplication.jingDongOrder.status===1002){
                        this.remainTimeCaculate(data.jingDongOrderApplication.createdDate);
                    }

                    // 表单数据获取
                    for(var i=0; i<data.custFormValues.length; i++){
                        var field = data.custFormValues[i];

                        switch (field.messageKey){
                            case 'applicant':
                                // 申请人信息获取
                                this.getApplicant(field);
                                break;
                            case 'select_cost_center':
                                // 成本中心信息获取
                                this.getCostCenter(field);
                                break;
                            case 'select_department':
                                // 部门名字获取
                                this.getDepartment(field);
                                break;
                            case 'select_approver':
                                // 审批人
                                this.getApprover(field);
                                break;
                        }
                    }
                }
            };

            var init = function () {
                // 如果没有申请单OID,申请无效
                if (!$scope.applicationOID) {
                    $scope.view.applicationError()
                }

                // 获取货币信息
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (configuration) {
                        $scope.view.currencyCode = configuration.currencyCode;
                        $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                    });

                // 获取所属部门信息
                Principal.identity().then(function (data) {
                    $scope.view.companyOID = data.companyOID;
                    $scope.view.departmentInfo.departmentOID = data.departmentOID;
                    $scope.view.departmentInfo.departmentName = data.departmentName;
                });

                // 获取申请单详情
                JingDongApplicationServices.getApplicationDetail($scope.applicationOID)
                    .success(function(data){
                        // 申请单类型 type 1001-费用申请, 1002-差旅申请,1003-订票申请，1004 -京东订单申请
                        // 订单状态 jingDongOrderApplication.jingDongOrder.status 1001-初始，1002-待付款，1003-已取消，1004-已付款
                        // 申请单状态 status 1001-初始，1002-提交审批，1003-审批通过
                        // 驳回类型 rejectType 1000-正常, 1001-撤回, 1002-审批驳回，1003-财务审核驳回，1004-开票驳回

                        // 如果不是京东申请或者不是审批状态并且不是被驳回并且京东申请单未被取消,申请单无效
                        if(data.type!==1004){
                            $scope.view.applicationError();
                            return
                        }
                        // 如果没有京东订单,订单无效
                        if(!data.jingDongOrderApplication.jingDongOrder){
                            $scope.view.applicationError($filter('translate')('base_js.Jingdong.order.is.invalid'));//京东订单无效
                            return
                        }

                        $scope.view.application = data;

                        // 数据处理
                        $scope.applicationDataParse.dataParse();
                    })
                    .error(function(){
                        $scope.view.applicationError()
                    })
            };

            init();

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });
            });
        }]);
