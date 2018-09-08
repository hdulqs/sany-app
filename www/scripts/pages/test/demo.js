/**
 * Created by Dawn on 2017/8/1.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.demo', {
                cache: false,
                url: '/demo',
                data: {
                    roles: []
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/test/demo.html',
                        controller: 'demoCtrl',
                        controllerAs:'vm'
                    }
                }
            })
    }])
    .controller('demoCtrl', ['$scope','$filter', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout','$ionicModal','localStorageService','LocalStorageKeys',
        function ($scope,  $filter,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,$ionicModal,localStorageService,LocalStorageKeys) {
            var vm=this;

            vm.isReadOnly = false;
            localStorageService.set(LocalStorageKeys.hec_user_id,1);

            //费用申请(差旅申请)的经办人
            vm.reqEmpId = "21";
            vm.reqEmpName = "";

            //费用报销的经办人
            vm.reimEmpId = "21";
            vm.reimEmpName = "";

            //公司
            vm.companyId="1";
            vm.companyNamy = "";
            vm.functionCry = "";

            //部门
            vm.unitId = "1";
            vm.unitName = "";

            //成本中心
            vm.respId = null;
            vm.respName = "";

            //币种
            vm.cryCode = "CNY";
            vm.cryCodeShow="RMB";

            //单据类型
            vm.docTypeId = "1089";
            vm.docTypeName="";
            vm.type = "ExpReq";

            //报销类型
            vm.reimTypeName="";
            vm.reimTypeId ="";

            //费用类型
            vm.expTypeName = "";
            vm.expTypeId="1183";

            //费用项目
            vm.expItemName = "";
            vm.expItemId="";

            //员工类型
            vm.empTypeCode = "";
            vm.empTypeId = "";
            vm.empTypeName = "";

            //受益人维护-员工工号选择（所有员工） lov
            vm.bemp = {};
            vm.bempCode ="";

            //业务区间  com box
            vm.periodName="";
            vm.periodId = "";

            //维度
            vm.dimensionId = "";
            vm.dimDesc = "";
            vm.dimPrompt="内部订单";

            //税率 com box
            vm.rateTypeName="";
            vm.rateTypeId="";

            //城市
            vm.locFromName = "";
            vm.locFromCode = "";
            vm.locToName = "";
            vm.locToCode = "";
            vm.locFromPrompt=$filter('translate')('hec_lov.input.location.from.prompt');
            vm.locToPrompt = $filter('translate')('hec_lov.input.location.to.prompt');

            //发票类别
            vm.item={};
            vm.taxTypeRate = "";

            //发票项目
            vm.invItemName="";
            vm.invItemId="";
            vm.expenseItemId="1180";
            vm.invItemCode="";

            vm.test="ddd";
            vm.value = '';
            vm.items = [
                "路飞", "娜美", "罗宾", "索隆", "香吉士",
                "乔巴", "布鲁克", "乌索普", "弗兰奇", "罗杰",
                "雷利", "龙", "艾斯", "鹰眼", "汉库克",
                "甚平", "特拉法尔加·罗", "香克斯"
            ];
            vm.showSelect = false;
            vm.searchModal = {
                key:''
            };

            vm.showSelectDiv = showSelectDiv;
            vm.selectItem = selectItem;
            vm.clearSelectFilter = clearSelectFilter;
            vm.searchSelectValue = searchSelectValue;

            $ionicModal.fromTemplateUrl('scripts/components/hec_modal/crmSelectModal.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal1) {
                vm.crmSelectModal = modal1;
            });
            //显示与关闭modal框
            function showSelectDiv() {
                vm.showSelect = !vm.showSelect;
                console.log(vm.showSelect);
                if(vm.showSelect == true){
                    vm.crmSelectModal.show();
                }else {
                    vm.crmSelectModal.hide();
                }

            }
            //选择值
            function selectItem(item) {
                vm.value = item;
                vm.showSelectDiv();
            }
            //清空搜索值
            function clearSelectFilter(){
                vm.searchModal.key = '';
            }
            //搜索
            function searchSelectValue(){
                console.log('开始搜索！');
            }

            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.setting_list');
                }
            };
        }]);
