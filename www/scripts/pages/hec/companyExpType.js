/**
 * Created by Dawn on 2017/8/6.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.companyExpType', {
                cache: false,
                url: '/companyExpType',
                params: {
                    chooseValue: ""
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/companyExpType.html',
                        controller: 'companyExpTypeCtrl',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecexp.common');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('companyExpTypeCtrl', ['$scope', '$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout', '$stateParams',
        'localStorageService', 'LocalStorageKeys', 'PublicFunction', 'PageValueService', 'ServiceBaseURL', '$http',
        function ($scope, $filter, $ionicHistory, $document, Auth, $state, $ionicLoading, $timeout, $stateParams, localStorageService,
                  LocalStorageKeys, PublicFunction, PageValueService, ServiceBaseURL, $http) {
            var vm = this;

            vm.type = $stateParams.chooseValue;
            vm.reqRefLoanInfo  = PageValueService.get("reqRefLoanInfo");
            vm.isReadOnly = false;
            vm.docType = {};
            vm.initPage = initPage;
            vm.initPage();

            function getDefaultResp() {
                var url = ServiceBaseURL.hec_interface_url;
                var params = {
                    "data_type": "employee_default_resp",
                    "action": "query",
                    "company_id": vm.companyId,
                    "employee_id": vm.employeeId,
                    "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                    "pagenum": 1,
                    "pagesize": LocalStorageKeys.hec_pagesize
                };
                return $http.post(url, params);
            }

            function initPage() {
                if (PublicFunction.isNull(vm.type)) {
                    vm.type = "ExpReq";
                }
                var comDocData = PageValueService.get("comDocData");
                if (!PublicFunction.isNull(comDocData) && comDocData) {
                    vm.employeeId = comDocData.employeeId;
                    vm.employeeName = comDocData.employeeName;
                    vm.companyId = comDocData.companyId;
                    vm.companyName = comDocData.companyName;
                    vm.functionCry = comDocData.functionCry;
                    vm.docTypeId = comDocData.docTypeId;
                    vm.docTypeName = comDocData.docTypeName;
                    vm.docTypeCode = comDocData.docTypeCode;
                    vm.unitId = comDocData.unitId;
                    vm.unitName = comDocData.unitName;
                    vm.respName = comDocData.respName;
                    vm.respId = comDocData.respId;
                    vm.reqRequiredFlag = comDocData.reqRequiredFlag;//报销单单据类型是否需关联申请单
                    vm.cryCode = comDocData.cryCode;
                    PageValueService.set("comDocData", "");
                } else {
                    var user = localStorageService.get(LocalStorageKeys.hec_user_default);
                    //取当前用户employeeId，用于company lov取值
                    vm.sessionEmployeeId = user.employee_id;
                    vm.employeeId = user.employee_id;
                    vm.employeeName = user.employee_name;
                    vm.companyId = user.company_id;
                    vm.companyName = user.company_name;
                    vm.respName = user.responsibility_center_name;
                    vm.respId = user.responsibility_center_id;
                    vm.unitId = user.unit_id;
                    vm.unitName = user.unit_name;
                    vm.functionCry = user.currency_code;//取公司对应的本文币
                    vm.docTypeId = "";
                    vm.docTypeName = "";
                    vm.docTypeCode = "";
                    if(vm.type == 'reqRefLoan' && !PublicFunction.isNull(vm.reqRefLoanInfo)){
                        vm.companyId = vm.reqRefLoanInfo.companyId;
                        vm.companyName = vm.reqRefLoanInfo.companyName;
                        vm.employeeId = vm.reqRefLoanInfo.employeeId;
                        vm.employeeName = vm.reqRefLoanInfo.employeeName;
                        vm.cryCode = vm.reqRefLoanInfo.cryCode;
                        vm.functionCry = vm.reqRefLoanInfo.functionCry
                        console.log("reqRefLoanInfo:"+angular.toJson(vm.reqRefLoanInfo));
                    }
                }
            }

            //页面跳转
            vm.goPage = goPage;

            //标题
            vm.title = "";
            if (vm.type === "ExpReq") {
                vm.title = $filter('translate')('choose_type.create.exp.application');//新建费用申请
            } else if (vm.type === "LoanReq" || vm.type === 'reqRefLoan') {
                vm.title = $filter('translate')('choose_type.create.loan.application');//新建借款申请
            } else {
                vm.title = $filter('translate')('choose_type.create.exp.reimb');//新建费用报销(ExpReim)
            }

            function validRequireItem() {
                if (PublicFunction.isNull(vm.employeeName)) {
                    PublicFunction.showToast($filter('translate')('choose_type.item.emp.required'));  // 经办人必须选择
                    return false;
                }
                if (PublicFunction.isNull(vm.companyName)) {
                    PublicFunction.showToast($filter('translate')('choose_type.item.company.required'));  // 公司必须选择
                    return false;
                }
                if (PublicFunction.isNull(vm.docTypeName)) {
                    PublicFunction.showToast($filter('translate')('choose_type.item.expType.required'));  // 单据类型必须选择
                    return false;
                }
                return true;
            }

            function goPage() {
                if (validRequireItem()) {
                    getDefaultResp().then(function (res) {
                        if (res.data.success) {
                            vm.respId = res.data.result.record[0].responsibility_center_id;
                            vm.respName = res.data.result.record[0].responsibility_center_name;
                            //从申请关联创建借款时，币种取申请单头币种，不受单据类型LOV控制
                            if(vm.type == 'reqRefLoan' && !PublicFunction.isNull(vm.reqRefLoanInfo)){
                                vm.cryCode = vm.reqRefLoanInfo.cryCode;
                            }
                            var data = {
                                employeeId: vm.employeeId,
                                employeeName: vm.employeeName,
                                companyId: vm.companyId,
                                companyName: vm.companyName,
                                functionCry: vm.functionCry,
                                docTypeId: vm.docTypeId,//单据类型id
                                docTypeName: vm.docTypeName,
                                docTypeCode: vm.docTypeCode,
                                unitId: vm.unitId,
                                unitName: vm.unitName,
                                respId: vm.respId,
                                respName: vm.respName,
                                reqRequiredFlag: vm.reqRequiredFlag,//报销单单据类型是否需关联申请单
                                documentPageType: vm.documentPageType,
                                cryCode: vm.cryCode,//报销单单据类型lov中获取
                                busAttrCode: vm.busAttrCode,//借款单单据类型Lov中获取：业务属性code
                                paymentMethodId: vm.paymentMethodId,//借款单单据类型Lov中获取：付款方式
                                paymentMethodDisplay: vm.paymentMethodDisplay
                            };
                            PageValueService.set("comDocData", data);
                            if (vm.type === "ExpReq") {//新建费用申请
                                if (vm.docTypeCode == '1010' || vm.docTypeCode == '1015') {//差旅申请
                                    $state.go('app.travelReqHeader');
                                } else if (vm.docTypeCode === "1070" || vm.docTypeCode === '1080' || vm.docTypeCode === '1100' || vm.docTypeCode === '1050') {//通用申请（日常1070、业务招待费1080、咨询费1100）
                                    $state.go('app.dailyReqHeader');
                                } else {
                                    PublicFunction.showToast("该单据类型待开发...");
                                }
                            } else if (vm.type === "LoanReq" || vm.type === 'reqRefLoan') {//新建借款申请
                                $state.go('app.loanReqHeader');
                            } else if (vm.type === "ExpReport") {//新建费用报销(ExpReim)
                                $state.go('app.reportHeader');//跳转到新建报销单
                            }
                        } else {
                            PublicFunction.showToast(res.data.error.message);
                        }
                    }, function (error) {
                        PublicFunction.showToast($filter('translate')('req.message.error.data.save'));
                    });
                }
            }

            //监听公司
            $scope.$watch("vm.companyName", function (newValue, oldValue) {
                if (!PublicFunction.isNull(newValue) && !PublicFunction.isNull(oldValue)) {
                    if (newValue != oldValue) {
                        vm.employeeId = "";
                        vm.employeeName = "";
                        vm.docTypeId = "";
                        vm.docTypeName = "";
                        vm.docTypeCode = "";
                    }
                }
            });

            $scope.goBack = function () {
                PageValueService.set("comDocData", "");
                if (vm.type === "ExpReport") {
                    $state.go('app.tab_erv.reportList');//跳转到报销单列表界面
                } else {
                    if (vm.type === 'reqRefLoan') {//申请关联借款模块
                        $state.go('app.reqRefLoanList');
                    } else {
                        $state.go('app.reqList'); //跳转到申请列表界面
                    }
                }
            };
        }]);
