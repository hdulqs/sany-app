/**
 * 差旅行程确认
 * Created by Dawn on 2017/8/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.confirmTravelTrip', {
                cache: false,
                url: '/confirmTravelTrip',
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_book/travel_trip/confirmTravelTrip.html',
                        controller: 'confirmTravelTripCtrl',
                        controllerAs:'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hectravel.trip');
                        $translatePartialLoader.addPart('components');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('confirmTravelTripCtrl', ['$scope','$filter','$q','$ionicPopup','PageValueService','confirmTravelTripService','subsidyListService','localStorageService','LocalStorageKeys','PublicFunction','$stateParams', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout',
        function ($scope,  $filter,$q,$ionicPopup,PageValueService,confirmTravelTripService,subsidyListService,localStorageService,LocalStorageKeys,PublicFunction,$stateParams,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout) {
            var vm = this;
            vm.confirmTripParams =PageValueService.get("confirmTripParams");//参数
            vm.head = {}; //差旅行程头信息
            vm.head.special_type_code = 'N';//特批-默认为N
            vm.selfExpInfo = []; //自导入费用信息
            vm.flyList = []; //航班信息
            vm.showFlyList = false;
            vm.showSelfList = false;
            vm.ImportFlag = false; //导入费用账本标志

            //导入费用
            vm.importBookExp = importBookExp;
            //获取费用账本简要信息
            vm.getSelfExpInfo = getSelfExpInfo;
            //获取费用账本详细信息
            vm.toExpBookDetail = toExpBookDetail;
            //删除已导入的费用账本信息
            vm.deleteExpense = deleteExpense;
            //获取航班信息
            vm.getFlyList = getFlyList;
            vm.toFlyDetail = toFlyDetail;
            //判读是否导入补贴信息
            vm.setImportFlag = setImportFlag;
            vm. setImportFlag();
            vm.toAddSubsidy = toAddSubsidy;
            //完成确认
            vm.confirm = confirm;
            vm.toCancelTrip = toCancelTrip;
            //页面初始化
            vm.initPage = initPage;
            vm.initPage();

            //页面初始化
            function initPage() {
                PublicFunction.showLoading(150);
                //1.获取差旅行程头上信息
                confirmTravelTripService.getHeadInfo(vm.confirmTripParams.expReqHeaderId,vm.confirmTripParams.confirmHeadId).success(function (data) {
                    if(data.success){
                        if(data.result.record){
                            vm.head = data.result.record[0];
                            vm.oldHead = angular.copy(vm.head);
                            //2.获取已导入的账本费用
                            vm.getSelfExpInfo();
                            //3.根据国内国外的单据，获取不同的数据
                            if(vm.confirmTripParams.expReqTypeCode === '1010'){
                                //4.国内存在机票，酒店信息，国外不存在
                                vm.getFlyList();
                            }
                        }else{
                            vm.head = {};
                            console.log('差旅行程信息不存在');
                        }
                        $ionicLoading.hide();
                    }else if(data.error.message){
                        PublicFunction.showToast(data.error.message);
                    }else{
                        PublicFunction.showToast(data.error);
                    }
                }).error(function (error) {
                    console.log("差旅行程确认头信息请求出错了");
                    PublicFunction.showToast($filter('translate')('error.request'));
                });
            }

            /**
             * 判断行程是否已导入补贴信息
             */
            function setImportFlag() {
                var q = subsidyListService.getImportSubsidyList(vm.confirmTripParams.expReqHeaderId, 1);
                q.success(function (data) {
                    if(data.success && data.result.pageCount>0){
                        vm.ImportFlag = true;
                    }else{
                        vm.ImportFlag = false;
                    }
                });
            }


            function toCancelTrip() {
                if(vm.ImportFlag || vm.selfExpInfo.length>0){
                    PublicFunction.showToast($filter('translate')('confirm_travel_trip.message.cancel.trip'));
                }else{
                    $scope.showPopup($filter('translate')('confirm_travel_trip.cancel.tip'));
                }
            }

            $scope.showPopup = function (message) {
                var confirmPopup = $ionicPopup.confirm({
                    title: $filter('translate')('common.tip'),//提示
                    template: "<div style='font-size: 15px;color: #959595;'>"+message+"</div>",
                    cancelText: $filter('translate')('common.cancel'),//取消
                    okText: $filter('translate')('common.ok')//确定
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        PublicFunction.showLoading(150);
                        confirmTravelTripService.toCancelTrip(vm.confirmTripParams.expReqHeaderId,vm.oldHead.currency_code,vm.oldHead.special_type_code).then(function (res) {
                            if(res.data.success){
                                $ionicLoading.hide();
                                $state.go('app.chooseTravelTrip');
                            }else{
                                PublicFunction.showToast($filter('translate')('error.request'));
                            }
                        },function (error) {
                            PublicFunction.showToast($filter('translate')('error.request'));
                        });
                    } else {

                    }
                });
            }

            //跳转至补贴信息
            function toAddSubsidy() {
                var subsidyParam = {
                    expReqHeaderId:vm.confirmTripParams.expReqHeaderId,
                    confirmHeadId:vm.confirmTripParams.confirmHeadId,
                    expReqTypeCode:vm.confirmTripParams.expReqTypeCode,
                    specialTypeCode:vm.head.special_type_code,//是否特批
                    currencyCode:vm.head.currency_code,//结算币种
                    actualTreatmentLevelFlag:vm.head.actual_treatment_level_flag//员工级别是否大于等于21级，N：否；Y：是
                };
                PageValueService.set("subsidyParam",subsidyParam);
                console.log('差旅确认界面=expReqHeaderId='+vm.confirmTripParams.expReqHeaderId+';confirmHeadId='+vm.confirmTripParams.confirmHeadId+';国际/国外编码='+vm.confirmTripParams.expReqTypeCode+';specialTypeCode:'+vm.head.special_type_code);
                $state.go('app.subsidyList');
            }

            /**
             * 获取差旅行程已导入账本信息
             * @param id 差旅行程头id
             */
            function getSelfExpInfo() {
                confirmTravelTripService.getSelfExpInfo(vm.confirmTripParams.expReqHeaderId).success(function (data) {
                    if(data.success){
                            if(data.result.record){
                                vm.selfExpInfo = data.result.record;
                            }else{
                                vm.selfExpInfo = [];
                            }
                    }else if(data.error.message){
                        PublicFunction.showToast(data.error.message);
                    }else{
                        PublicFunction.showToast(data.error);
                    }
                }).error(function (error) {
                    console.log("获取差旅行程已导入账本信息请求出错了");
                    PublicFunction.showToast($filter('translate')('error.request'));
                });
            }

            //查看自导入费用的详情
            function toExpBookDetail(exp) {
                $state.go('app.createExp',{expenseId:exp.expense_id,companyId:vm.head.company_id});
            }

            //导入费用
            function importBookExp() {
                if(vm.ImportFlag){
                    $state.go('app.expList',{isImport:true,currencyCode:vm.head.currency_code,companyId:vm.head.company_id,headId:vm.head.exp_requisition_header_id});
                }else{
                    PublicFunction.showToast($filter('translate')('flyinfo.Please.fill.in.basic.data.first'));
                }
            }

            /**
             * 删除关联的我的账本信息
             * @param ref_id
             */
            function deleteExpense(refBook){
                PublicFunction.showLoading(150);
                var params =[{
                    "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                    "ref_id":refBook.ref_id,
                    "_status":"delete"
                }];
                confirmTravelTripService.deleteExpense(params).then(function (res) {
                    if(res.data.success){
                        vm.selfExpInfo.splice(vm.selfExpInfo.indexOf(refBook), 1);
                        PublicFunction.showToast($filter('translate')('confirm.trip.deleted')+"<br>"+$filter('translate')('confirm.trip.exp.back'));
                    }else{
                        PublicFunction.showToast($filter('translate')('confirm.trip.delete.failed'));
                    }
                }, function (error) {
                    console.log("删除已导入账本信息请求出错了");
                    PublicFunction.showToast($filter('translate')('error.request'));
                });
            }

            //获取航班信息
            function getFlyList() {
                confirmTravelTripService.getFlyList(vm.confirmTripParams.expReqHeaderId).success(function (data) {
                    if(data.success){
                        if(data.result.record) {
                            var record = data.result.record;
                            //转换后的航班信息集合
                            var formatList = [];
                            //定义航班明细对象flyFormat
                            var flyFormat = {};
                            //定义航班明细的费用业务类型
                            var list = [];
                            for (var i = 0;i <  record.length; i++) {
                                var type = record[i];
                                var tempTickerNo =  -1;
                                if(i != 0){
                                    tempTickerNo = record[i-1]['tickerno_s'];//等于上一条的票号
                                }
                                //票号与上一条记录相同时，将费用项目附加到上一条的list中
                                if(type['tickerno_s'] == tempTickerNo){
                                    if(type.order_detail_type) {
                                        var item = type;
                                        list.push(item);
                                    }
                                }else {//2.2报销类型id与上一条记录不相同时，则重新新增一条记录
                                    list = [];
                                    flyFormat = {};
                                    if (type.order_detail_type) {
                                        flyFormat['tickerno']=type.tickerno;
                                        flyFormat['place_to']= type.place_to;
                                        flyFormat['place_from']= type.place_from;
                                        flyFormat['passenger_name'] = type.passenger_name;
                                        flyFormat['amount']= 0;
                                        flyFormat['service_fee'] = 0;
                                        flyFormat['price'] = 0;
                                        flyFormat['tax'] = 0;
                                        flyFormat['refund'] = 0;
                                        flyFormat['rebook_query_fee'] = 0;
                                        list.push(type);
                                        flyFormat['list'] = list;
                                        formatList.push(flyFormat);
                                    }
                                }
                            }
                            vm.flyList = vm.flyList.concat(formatList);
                            for(var i=0;i < vm.flyList.length;i++){
                                var list = vm.flyList[i].list;
                               for(var j=0;j < list.length;j++){
                                   vm.flyList[i].amount = vm.flyList[i].amount +list[j].amount;
                                   vm.flyList[i].service_fee =  vm.flyList[i].service_fee +(list[j].service_fee?list[j].service_fee:0);
                                   vm.flyList[i].price = vm.flyList[i].price +list[j].price;
                                   vm.flyList[i].tax =vm.flyList[i].tax+ list[j].tax;
                                   vm.flyList[i].refund = vm.flyList[i].refund + list[j].refund;
                                   vm.flyList[i].rebook_query_fee = vm.flyList[i].rebook_query_fee + (list[j].rebook_query_fee?list[j].rebook_query_fee:0);
                               };
                            };
                           //console.log(angular.toJson(vm.flyList));
                        }else{
                            vm.flyList = [];
                        }
                    }else if(data.error.message){
                        PublicFunction.showToast(data.error.message);
                    }else{
                        PublicFunction.showToast(data.error);
                    }
                }).error(function (error) {
                    PublicFunction.showToast($filter('translate')('error.request.failed'));
                });

            }

            function toFlyDetail(flyItem) {
                $state.go('app.flyInfo',{fly:flyItem,expReqHeaderId:vm.confirmTripParams.expReqHeaderId,confirmHeadId:vm.confirmTripParams.confirmHeadId,expReqTypeCode:vm.confirmTripParams.expReqTypeCode});
            }

            //行程确认
            function confirm() {
                PublicFunction.showLoading(150);
                var param =[{
                    "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                    "exp_requisition_header_id":vm.confirmTripParams.expReqHeaderId,
                    "_status":"update"
                }];
               confirmTravelTripService.confirm(param).success(function (data) {
                   if(data.success){
                       console.log("差旅行程完成确认成功，expReqHeaderId="+vm.confirmTripParams.expReqHeaderId);
                       PageValueService.set("confirmTripParams", "");
                       PageValueService.set("subsidyParam","");
                       PageValueService.set("subsidyItem","");
                       PageValueService.set("updateSubsidyFlag","");
                       // $state.go('app.tab_erv.homepage');
                       var result = data.result;
                       if(result.record){
                           $state.go('app.reportHeader', {headerId: result.record.exp_report_header_id});
                       }
                   }else if(data.error.message){
                       PublicFunction.showToast(data.error.message);
                   }else{
                       PublicFunction.showToast(data.error);
                   }
                }).error(function (data) {
                   console.log("行程确认请求出错了");
                   PublicFunction.showToast($filter('translate')('error.request'));
               })/*.finally(function () {
                   $ionicLoading.hide();
               });*/
            }

            //控制显示航班信息
            $scope.showFlyInfo = function () {
                vm.showFlyList =  !vm.showFlyList;
            };

            //控制显示账本信息
            $scope.showOtherInfo = function () {
                vm.showSelfList = !vm.showSelfList;
            };

            $scope.goBack = function () {
                PageValueService.set("confirmTripParams", "");//清空参数
                PageValueService.set("subsidyParam","");
                PageValueService.set("subsidyItem","");
                PageValueService.set("updateSubsidyFlag","");
                if ($ionicHistory.backView()) {
                    $state.go('app.chooseTravelTrip');
                } else {
                    $state.go('app.tab_erv.homepage');
                }
            };
        }]);
