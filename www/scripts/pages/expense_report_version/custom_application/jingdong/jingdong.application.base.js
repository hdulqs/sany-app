/**
 * Created by lizhi on 16/11/8.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.jingdong_application_create', {
                url: '/jingdong/application/create?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/jingdong/jingdong.application.base.tpl.html',
                        controller: 'com.handchina.huilianyi.JingDongApplicationBaseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'create';
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
            .state('app.jingdong_application_edit', {
                url: '/jingdong/application/edit?applicationOID',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/expense_report_version/custom_application/jingdong/jingdong.application.base.tpl.html',
                        controller: 'com.handchina.huilianyi.JingDongApplicationBaseController'
                    }
                },
                resolve: {
                    content: function () {
                        return 'edit';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('jingdong');
                        $translatePartialLoader.addPart('components');
                        return $translate.refresh();
                    }]
                }
            })

    }])
    .controller('com.handchina.huilianyi.JingDongApplicationBaseController', ['$scope', '$state', 'PublicFunction', 'Principal',
        'CompanyConfigurationService', 'CustomApplicationServices', '$stateParams', '$ionicLoading', 'SelfDefineExpenseReport',
        'content', '$q', '$ionicHistory', '$timeout', 'CostCenterService', 'TravelERVService', 'InvoiceApplyERVService',
        'FunctionProfileService', 'ExpenseService', 'CurrencyCodeService', '$ionicPopup', 'JingDongApplicationServices',
        'FUNCTION_PROFILE', 'DepartmentService', 'localStorageService', 'ManagerPrompt', '$location','$filter', 'AgencyService',
        '$rootScope',
        function ($scope, $state, PublicFunction, Principal, CompanyConfigurationService, CustomApplicationServices, $stateParams,
                  $ionicLoading, SelfDefineExpenseReport, content, $q, $ionicHistory, $timeout, CostCenterService, TravelERVService,
                  InvoiceApplyERVService, FunctionProfileService, ExpenseService, CurrencyCodeService, $ionicPopup, JingDongApplicationServices,
                  FUNCTION_PROFILE, DepartmentService, localStorageService, ManagerPrompt, $location,$filter, AgencyService,
                  $rootScope) {
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

                // 表单数据验证
                validate: function () {
                    var deferred = $q.defer();
                    var i = 0;
                    for (; i < $scope.view.application.custFormValues.length; i++) {
                        var field = $scope.view.application.custFormValues[i];
                        if (field.required && (field.value===null || field.value==='')) {
                            if(field.messageKey==='select_cost_center' && field.costCenterLength == 0){
                                PublicFunction.showToast($filter('translate')('base_js.Cost.center.is.not.configured'));//成本中心未配置，请联系管理员
                                deferred.reject(false);
                            } else if(field.messageKey==='select_department' || field.messageKey==='select_cost_center' || field.messageKey==='select_approver') {
                                PublicFunction.showToast($filter('translate')('base_js.Please.select.a') + field.fieldName);//请选择
                                deferred.reject(false);
                            } else {
                                PublicFunction.showToast($filter('translate')('base_js.Please.enter.the') + field.fieldName);//请输入
                                deferred.reject(false);
                            }
                            return deferred.promise;
                        }
                        if (field.messageKey==="select_department") {
                            $scope.view.departmentOID = field.value;
                        }
                    }
                    if (i===$scope.view.application.custFormValues.length) {
                        deferred.resolve(true);
                        return deferred.promise;
                    }
                },

                // confirm弹框
                prompt: function (head, content, cancelText, okText, okFunction){
                    $ionicPopup.confirm({
                        template: '<div class="jingdong-application-base" style="text-align: center">' + '<p style="font-size: 16px"><b>'+head+'</b></p>' + '<p style="font-size: 14px">'+content+'</p>' + '</div>',
                        cancelText: cancelText?cancelText:$filter('translate')('base_js.cancel'),//取消
                        cancelType: 'button-light',
                        okText: okText?okText:$filter('translate')('base_js.determine'),//确定
                        okType: 'button-danger'
                    }).then(function (result) {
                        if(result){
                            okFunction()
                        }
                    }, function() {
                            //return
                        });
                },

                // 申请单错误处理
                applicationError: function(errMessage){
                    errMessage = errMessage?errMessage:$filter('translate')('base_js.Application.form.is.invalid');//申请单无效
                    PublicFunction.showToast(errMessage);
                    $timeout(function(){
                        $scope.view.goBack();
                    }, 1000);
                },

                // 保存
                saveApplication: function () {
                    // 保存时判断事由是否填
                    for (var i=0; i < $scope.view.application.custFormValues.length; i++) {
                        var field = $scope.view.application.custFormValues[i];
                        if (field.messageKey==='title' && field.required && (field.value===null || field.value==='')) {
                            PublicFunction.showToast($filter('translate')('base_js.Please.enter.the') + field.fieldName);//请输入
                            return
                        }
                    }

                    // 申请单保存
                    JingDongApplicationServices.saveApplication($scope.view.application)
                        .success(function(){
                            CustomApplicationServices.setTab('init');
                            PublicFunction.showToast($filter('translate')('base_js.The.saved'));//已保存
                            $timeout(function () {
                                $scope.view.goBack('app.custom_application_list');
                            }, 500);
                        })
                        .error(function(error){
                            if(error.message){
                                PublicFunction.showToast(error.message);
                            } else {
                                PublicFunction.showToast($filter('translate')('base_js.Save.failed'));//保存失败
                            }
                        })
                },

                // 提交
                submitApplication: function () {
                    if($scope.view.application.jingDongOrderApplication.jingDongOrder.status===1003){
                        PublicFunction.showToast($filter('translate')('base_js.The.order.was.cancelled'));//订单已取消，该申请不可提交
                        return
                    }

                    var submit = function(){
                        JingDongApplicationServices.submitApplication($scope.view.application)
                            .success(function(){
                                CustomApplicationServices.setTab('submit');
                                PublicFunction.showToast($filter('translate')('base_js.Has.been.submitted'));//已提交
                                $timeout(function () {
                                    $scope.view.goBack('app.custom_application_list');
                                }, 500);
                            })
                            .error(function(error){
                                if(error.message){
                                    PublicFunction.showToast(error.message);
                                } else {
                                    PublicFunction.showToast($filter('translate')('base_js.submit.failure'));//提交失败
                                }
                            })
                    };

                    $scope.view.validate()
                        .then(function(){
                            // 如果表单有部门并且公司配置为部门经理审批并且所选择部门没有部门经理,提示错误信息
                            if($scope.view.departmentOID){
                                DepartmentService.getDepartmentInfo($scope.view.departmentOID).then(function(response){
                                    if($scope.view.functionProfileList && !$scope.view.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode===1002 && !response.data.managerOID){
                                        PublicFunction.showToast(ManagerPrompt);
                                    } else {
                                        submit();
                                    }
                                })
                            } else {
                                submit();
                            }
                        })
                },

                // 删除
                deleteApplication: function () {
                    var deleteFunction = function(){
                        JingDongApplicationServices.deleteApplication($scope.view.application.applicationOID)
                            .success(function(){
                                PublicFunction.showToast($filter('translate')('base_js.Delete.the.success'));//删除成功
                                $timeout(function(){
                                    $scope.view.goBack();
                                }, 500)
                            })
                            .error(function(error){
                                if(error.message){
                                    PublicFunction.showToast(error.message);
                                } else {
                                    PublicFunction.showToast($filter('translate')('base_js.Delete.failed'))//删除失败
                                }
                            })
                    };
                    $scope.view.prompt($filter('translate')('base_js.After.deleting.will.cancel.the.jingdong.orders.at.the.same.time'), $filter('translate')('base_js.Confirm.to.delete'), $filter('translate')('base_js.cancel'), $filter('translate')('base.delete'), deleteFunction)//'删除后将同时取消京东订单', '是否确认删除？', '取消', '删除'
                }
            };

            // 代理相关内容
            $scope.agency = {
                // 清空成本中心内容
                costCenterClear: function (index){
                    var formValues = $scope.view.application.custFormValues;
                    formValues[index].costCenterName = null;
                    formValues[index].value = null;
                },

                // 修改部门为申请人所在的部门
                departmentChange: function (index, applicant){

                    // 先清空部门信息,避免拿不到数据时还是使用之前的数据
                    $scope.view.application.custFormValues[index].value = null;
                    $scope.view.application.custFormValues[index].path = null;

                    // 获取用户所在部门信息
                    AgencyService.getUserDetail(applicant.userOID).then(function(response){
                        var data = response.data.department;

                        $scope.view.application.custFormValues[index].value = data.departmentOID;
                        if($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]){
                            $scope.view.application.custFormValues[index].departmentName = data.name;
                        } else {
                            $scope.view.application.custFormValues[index].departmentName = data.path;
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

                // 清除银行卡信息
                bankAccountClear: function (index){
                    $scope.view.application.custFormValues[index].value = null;
                    $scope.view.application.custFormValues[index].bankAccountNo = null;
                },

                // 申请人改变时的处理
                applicantChange: function(applicant){

                    // 关联申请人信息,成本中心清空
                    function relativeHandle(){
                        var custFormValues = $scope.view.application.custFormValues;
                        for(var i=0; i< custFormValues.length; i++){
                            switch (custFormValues[i].messageKey){
                                // 修改部门为申请人所在的部门
                                case 'select_department':
                                    $scope.agency.departmentChange(i, applicant);
                                    break;
                                // 清空成本中心内容
                                case 'select_cost_center':
                                    $scope.agency.costCenterClear(i);
                                    break;
                                // 修改法人实体为申请人所在的法人实体
                                case 'select_corporation_entity':
                                    //$scope.agency.corporationEntityChange(i, applicant);
                                    break;
                                // 清除银行卡信息
                                case 'contact_bank_account':
                                    //$scope.agency.bankAccountClear(i);
                                    break;
                            }
                        }
                    }

                    // 获取申请人FunctionProfile信息
                    FunctionProfileService.getUserFunctionProfile(applicant.userOID).then(function (response) {
                        $scope.view.functionProfileList = response.data;
                        relativeHandle();
                        $rootScope.jingdongApplicantChanged = false;  // 释放变量
                    })
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
                        $scope.view.applicationError($filter('translate')('base_js.Jingdong.order.time.error'));  //京东订单时间出错
                    } else if (remainDay<1){
                        $scope.view.remainTime = String(remainHour) + $filter('translate')('base_js.hours');//小时
                        $scope.view.lessThanOneDay = true;
                    } else {
                        $scope.view.remainTime = String(remainDay) + $filter('translate')('base_js.day')/*天*/ + String(remainHour) + $filter('translate')('base_js.hours');//小时
                        $scope.view.lessThanOneDay = false;
                    }
                },

                // 获取申请人
                getApplicant: function (field) {
                    if (field.value){
                        // 获取申请人信息
                        AgencyService.getUserDetail(field.value).then(function(response){
                            field.applicant = AgencyService.getApplicantItem(response.data);
                        });
                    } else {
                        field.applicant = $scope.view.defaultApplicant;
                    }
                },

                // 获取成本中心
                getCostCenter: function(field){
                    field.costCenterOID = JSON.parse(field.dataSource).costCenterOID;
                    if (field.value) {
                        CostCenterService.getCostCenterItemDetail(field.value)
                            .success(function (data) {
                                field.costCenterName = data.name;
                            })
                            .error(function () {
                                field.costCenterName = null;
                            })
                    } else {
                        field.costCenterName = null;
                    }
                },

                // 获取部门
                getDepartment: function(field){
                    if(field.value){
                        DepartmentService.getDepartmentInfo(field.value).then(function(response){
                            if($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]){
                                field.departmentName = response.data.name;
                            } else {
                                field.departmentName = response.data.path;
                            }
                        })
                    } else {
                        field.value = $scope.view.departmentInfo.departmentOID;
                        SelfDefineExpenseReport.getDepartmentInfo(field.value)
                            .then(function (response) {
                                // 以后从表单里面拿字段(拷贝自定义申请.部门是否显示全路径.)
                                if($scope.view.functionProfileList && $scope.view.functionProfileList["department.full.path.disabled"]){
                                    field.departmentName = response.data.name;
                                } else {
                                    field.departmentName = response.data.path;
                                }
                            });
                    }
                },

                // 获取审批人
                getApprover: function(field){
                    field.approvalSelectedName = '';
                    if (field.value) {
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
                    }

                    if (field.fieldConstraint){
                        field.maxApprovalChain = JSON.parse(field.fieldConstraint).maxApprovalChain;
                    }
                },

                dataParse: function(){
                    var data = $scope.view.application;

                    // 计算剩余支付时间
                    this.remainTimeCaculate(data.jingDongOrderApplication.createdDate);

                    for(var i=0; i<data.custFormValues.length; i++){
                        var field = data.custFormValues[i];

                        switch (field.messageKey){
                            case 'applicant':
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
                    // 默认申请人
                    $scope.view.defaultApplicant = AgencyService.getApplicantItem(data);
                });

                // 获取申请单详情
                JingDongApplicationServices.getApplicationDetail($scope.applicationOID)
                    .success(function(data){
                        // 申请单类型 1001-费用申请, 1002-差旅申请,1003-订票申请，1004 -京东订单申请
                        // 订单状态，1001-初始，1002-待付款，1003-已取消，1004-已付款
                        // 申请单状态 status 1001-初始，1002-提交审批，1003-审批通过
                        if(data.type!==1004 || data.status!==1001){
                            $scope.view.applicationError();
                            return
                        }
                        if(!data.jingDongOrderApplication.jingDongOrder || (data.jingDongOrderApplication.jingDongOrder.status!==1001 && data.jingDongOrderApplication.jingDongOrder.status!==1003)){
                            $scope.view.applicationError($filter('translate')('base_js.Jingdong.order.is.invalid'));//京东订单无效
                            return
                        }

                        // 设置FormOID
                        AgencyService.setFormOID(data.formOID);

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

            $scope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    // 清空申请人OID,单据OID,报销单关联的申请单OID
                    AgencyService.clearAll();

                    $rootScope.jingdongApplicantChanged = false;  // 释放变量
                });

            // 监听申请人的变化,进行相应关联处理
            $rootScope.$watch('jingdongApplicantChanged', function (newValue, oldValue) {
                if (newValue) {
                    // 延时100ms,让选人控件先执行完
                    $timeout(function(){
                        var custFormValues = $scope.view.application.custFormValues;
                        // 获取申请人字段
                        var index = AgencyService.getDetailFromFormValuesByKey('applicant', custFormValues);
                        if (index!==null){
                            $scope.agency.applicantChange(custFormValues[index].applicant);
                        }
                    }, 100);
                }
            });
        }]);
