/**
 * Created by Dawn on 2017/8/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.subsidyInfo', {
                cache: false,
                url: '/subsidyInfo',
                params:{
                    isUpdate:""
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_book/travel_trip/subsidyInfo/subsidyInfo.html',
                        controller: 'subsidyInfoCtrl',
                        controllerAs:'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hectravel.trip');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('subsidyInfoCtrl', ['$scope','$filter','$ionicPopup','PageValueService','LANG','PublicFunction','$cordovaDatePicker','$stateParams','localStorageService','LocalStorageKeys','$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout','subsidyListService','$sessionStorage',
        function ($scope,  $filter,$ionicPopup,PageValueService,LANG,PublicFunction,$cordovaDatePicker,$stateParams,localStorageService,LocalStorageKeys,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,subsidyListService,$sessionStorage) {
            var vm = this;
            vm.subsidy = PageValueService.get("subsidyItem");
            vm.roommate_tip = "同住人";
            var oldObject = JSON.stringify(vm.subsidy);
            vm.confirmTripParams = PageValueService.get("confirmTripParams");
            vm.expReqTypeCode = vm.confirmTripParams.expReqTypeCode;
            vm.expReqHeaderId = vm.confirmTripParams.expReqHeaderId;
            vm.subsidyParam = PageValueService.get("subsidyParam");
            vm.updateSubsidyFlag = $stateParams.isUpdate;
            PageValueService.set("updateSubsidyFlag",vm.updateSubsidyFlag);//手机的返回键
            vm.readOnly = false;

            //补贴信息保存
            vm.save = save;
            //保存并新建一笔
            vm.saveAndMore = saveAndMore;
            //监听实住天数，补贴天数
            vm.onChange = onChange;
            //计算出发日期和离开日期相隔天数
            vm.calculateDays = calculateDays;
            vm.vaildInfo = vaildInfo;

            /**
             * 监听页面文本框实住天数，补贴天数
             */
            function onChange() {
                //国际路途天数计算
                    subsidyListService.tripSubsidyGet(vm.subsidy,vm.expReqTypeCode,vm.expReqHeaderId).success(function (data) {
                        if(data.success){
                            var newSubsidy =  data.result.record;
                            //住宿标准
                            vm.subsidy.accom_subsidy_amount = newSubsidy.accom_amount;//住宿标准金额
                            vm.subsidy.accom_subsidy_currency_name = newSubsidy.accom_currency_name;//住宿标准币种
                            vm.subsidy.accom_subsidy_currency = newSubsidy.accom_currency;//住宿标准币种
                            if(vm.expReqTypeCode ==='1010'){//国内
                                vm.subsidy.subsidy_amount = newSubsidy.subsidy_amount;//补贴金额
                                vm.subsidy.subsidy_currency_code = newSubsidy.subsidy_currency_code;//补贴币种
                                vm.subsidy.subsidy_currency_name = newSubsidy.subsidy_currency_name;
                            }else{//国外
                                //路途
                                vm.subsidy.journey_days = newSubsidy.journey_days;
                                vm.subsidy.journey_subsidy_currency_name = newSubsidy.journey_currency_name;
                                vm.subsidy.journey_subsidy_currency = newSubsidy.journey_currency;
                                vm.subsidy.journey_subsidy_amount = newSubsidy.journey_amount;
                                //通讯
                                vm.subsidy.com_subsidy_currency = newSubsidy.com_currency;
                                vm.subsidy.com_subsidy_amount = newSubsidy.com_amount;
                                vm.subsidy.com_subsidy_currency_name = newSubsidy.com_currency_name;
                                //伙食天数
                                vm.subsidy.meals_days = newSubsidy.meals_days;
                                vm.subsidy.meals_subsidy_currency_name =newSubsidy.meals_currency_name;
                                vm.subsidy.meals_subsidy_currency =newSubsidy.meals_currency;
                                vm.subsidy.meals_subsidy_amount =newSubsidy.meals_amount;
                            }
                        }else{
                            PublicFunction.showToast($filter('translate')('error.message.Subscription.information.data.failed.to.load'));
                        }
                    }).error(function (data) {
                        console.log('补贴信息重新获取数据请求出错了');
                        PublicFunction.showToast($filter('translate')('error.request'));
                    });
           }



           function vaildInfo() {
               if(PublicFunction.isNull(vm.subsidy.travel_start_date)){
                   PublicFunction.showToast($filter('translate')('subsidy_info.please.input.travel_start_date'));
                   return false;
               }else if(PublicFunction.isNull(vm.subsidy.travel_end_date)){
                   PublicFunction.showToast($filter('translate')('subsidy_info.please.input.travel_end_date'));
                   return false;
               }else if(PublicFunction.isNull(vm.subsidy.place_from)){
                   PublicFunction.showToast($filter('translate')('subsidy_info.please.select.place_from'));
                   return false;
               }else if(PublicFunction.isNull(vm.subsidy.place_to)){
                   PublicFunction.showToast($filter('translate')('subsidy_info.please.select.place_to'));
                   return false;
               }else if(PublicFunction.isNull(vm.subsidy.planned_days)){
                   PublicFunction.showToast($filter('translate')('subsidy_info.please.input.planned_days'));
                   return false;
               }else if(PublicFunction.isNull(vm.subsidy.actual_days)){
                   PublicFunction.showToast($filter('translate')('subsidy_info.please.input.actual_days'));
                   return false;
               }else if(PublicFunction.isNull(vm.subsidy.travel_days)){
                   PublicFunction.showToast($filter('translate')('subsidy_info.please.input.travel_days'));
                   return false;
               }else{
                   if(vm.expReqTypeCode==='1010' && PublicFunction.isNull(vm.subsidy.subsidy_days)) {
                       PublicFunction.showToast($filter('translate')('subsidy_info.please.input.subsidy_days'));
                       return false;
                   }
                   if(vm.expReqTypeCode==='1015' && vm.subsidy.to_state_flag ==='Y'&& vm.subsidyParam.actualTreatmentLevelFlag ==='Y' && PublicFunction.isNull(vm.subsidy.treatment_level_type)){
                       PublicFunction.showToast($filter('translate')('subsidy_info.please.select.treatment_level_type'));
                       return false;
                   }
                   if(vm.expReqTypeCode==='1015' &&  PublicFunction.isNull(vm.subsidy.meals_days)){
                       PublicFunction.showToast($filter('translate')('subsidy_info.please.input.meals_days'));
                       return false;
                   }
                   if(vm.expReqTypeCode==='1015' &&  PublicFunction.isNull(vm.subsidy.provided_meals_days)){
                       PublicFunction.showToast($filter('translate')('subsidy_info.please.input.provided_meals_days'));
                       return false;
                   }
                   if(vm.expReqTypeCode==='1015' &&  PublicFunction.isNull(vm.subsidy.meals_number)){
                       PublicFunction.showToast($filter('translate')('subsidy_info.please.input.meals_number'));
                       return false;
                   }
                   return true;
               }

           }

            /**
             * 补贴信息保存
             * @param more 是否保存更多标志
             */
            function save(more) {
               if(vm.vaildInfo()) {
                   if(vm.subsidy.travel_days < vm.subsidy.planned_days){
                       PublicFunction.showToast($filter('translate')('subsidy_info.tip.live.and.travel'));  // 应住天数不能大于差旅总天数
                       return;
                   }else if (vm.subsidy.planned_days < vm.subsidy.actual_days) {
                       PublicFunction.showToast($filter('translate')('subsidy_info.tip.actual.and.live'));  // 实住天数不能大于应住天数
                       return;
                   } else if (vm.expReqTypeCode==='1010'&& (vm.subsidy.travel_days < vm.subsidy.subsidy_days)) {
                       PublicFunction.showToast($filter('translate')('subsidy_info.tip.subsidy.and.travel'));  // 补贴天数不能大于差旅总天数
                       return;
                   } else if (vm.expReqTypeCode==='1015'&& (vm.subsidy.planned_days < vm.subsidy.provided_meals_days)) {
                       PublicFunction.showToast($filter('translate')('subsidy_info.tip.provided.and.live'));  // 已提供伙食天数不能大于应住天数
                       return;
                   } else{
                       PublicFunction.showLoading(150);
                       if(PublicFunction.isNull(vm.subsidy.travel_standard)){
                           vm.subsidy.travel_standard = 'N';
                       }
                       if(PublicFunction.isNull(vm.subsidy.meanwhile_report_flag)){
                           vm.subsidy.meanwhile_report_flag = 'N';
                       }
                       vm.subsidy.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                       vm.subsidy._status = 'update';
                       var param = [vm.subsidy];
                       subsidyListService.save(param).success(function (data) {
                           if(data.success){
                               PageValueService.set("subsidyItem","");//清空
                               PageValueService.set("updateSubsidyFlag","");
                               if (more) {
                                   $state.go('app.subsidyAddList');
                               } else {
                                   $state.go('app.subsidyList');
                               }
                               $ionicLoading.hide();
                           }else if(data.error.message){
                               PublicFunction.showToast(data.error.message);
                           }else{
                               PublicFunction.showToast($filter('translate')('subsidy_info.Subscription.information.failed.to.save'));
                           }
                       }).error(function (data) {
                           console.log("补贴信息保存请求出错了");
                           PublicFunction.showToast($filter('translate')('error.request'));
                       }).finally(function () {
                           $ionicLoading.hide();
                       });
                   }
               }
            }

            function saveAndMore() {
                vm.save(true);
            }

            /**
             * 监听目的地的变化：
             * 目的地不同住宿币种、补贴币种可能同
             */
            $scope.$watch("vm.subsidy.place_to_id + vm.subsidy.travel_days + vm.subsidy.travel_standard + vm.subsidy.treatment_level_type +vm.subsidy.roommate_id + vm.subsidy.meanwhile_report_flag ", function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if(vm.subsidy.to_state_flag === 'Y'){//当到达地为国外的时
                        vm.subsidy.travel_standard = 'N';
                        vm.subsidy.roommate_name = '';
                        vm.subsidy.roommate_id = '';
                        vm.subsidy.employee_code = '';
                        vm.subsidy.meanwhile_report_flag = 'N';
                    }else{
                        if(vm.subsidy.travel_standard === 'N'){
                            vm.subsidy.roommate_name = '';
                            vm.subsidy.roommate_id = '';
                            vm.subsidy.employee_code = '';
                            vm.subsidy.meanwhile_report_flag = 'N';
                        }
                        if(vm.expReqTypeCode ==='1015'){
                            vm.subsidy.treatment_level_type = '';
                            vm.subsidy.treatment_level_type_code='';
                            vm.sysCodeId = '';
                        }
                    }
                    vm.onChange();
                }
            });

            /**
             * 计算出发日期和离开日期相隔天数
             */
            function calculateDays() {
                if (PublicFunction.isNull(vm.subsidy.travel_start_date) || PublicFunction.isNull(vm.subsidy.travel_end_date)) {
                    vm.subsidy.travel_days = "";
                } else {
                    if (PublicFunction.compareDate(vm.subsidy.travel_start_date, vm.subsidy.travel_end_date)) {
                        vm.subsidy.travel_days = "";
                        PublicFunction.showToast($filter('translate')('subsidy_info.date.from.to'));
                    } else {
                        if(vm.subsidy.end_date_flag === 'Y'){
                            vm.subsidy.travel_days = PublicFunction.calculateDays(vm.subsidy.travel_start_date, vm.subsidy.travel_end_date)+1;
                        }else{
                            vm.subsidy.travel_days = PublicFunction.calculateDays(vm.subsidy.travel_start_date, vm.subsidy.travel_end_date);
                        }
                    }
                }
            }

            $scope.$watch("vm.subsidy.end_date_flag",function (n,o) {
                if(n != o){
                    if( n === 'Y' ){
                        vm.subsidy.travel_days = vm.subsidy.travel_days + 1;
                    }else if( n === 'N' ){
                        vm.subsidy.travel_days = vm.subsidy.travel_days - 1;
                    }
                }
            });



            //选择时间
            $scope.datePicker = {
                selectDate: function (string) {
                    var itemDate = vm.subsidy.travel_start_date;
                    if (string === 'dateTo') {
                        itemDate = vm.subsidy.travel_end_date;
                    }
                    var dateOptions = {
                        date: itemDate,
                        mode: 'date',
                        allowOldDates: false,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('common.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('common.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        locale: $sessionStorage.lang //$sessionStorage.lang
                    };

                    // 如果费用不是只读,或者是第三方费用,或者是报销单中编辑费用,可以编辑
                    if (!vm.isReadOnly) {
                        $cordovaDatePicker.show(dateOptions).then(function (date) {
                            if (date) {
                                if (string === 'dateFrom') {
                                    vm.subsidy.travel_start_date = date.Format('yyyy-MM-dd');
                                } else {
                                    vm.subsidy.travel_end_date = date.Format('yyyy-MM-dd');
                                }
                                vm.calculateDays();
                            }
                        });
                    }
                },
                selectHandDate: function (string) {
                    var date = null;
                    if (string === 'dateFrom' && vm.subsidy.travel_start_date) {
                        date = new Date(vm.subsidy.travel_start_date).Format('yyyy-MM-dd');
                    }
                    if (string === 'dateTo' && vm.subsidy.travel_end_date) {
                        date = new Date(vm.subsidy.travel_end_date).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if (ionic.Platform.isAndroid()) {
                                $scope.result = new Date(response).Format('yyyy-MM-dd');
                            } else {
                                $scope.result = new Date(response.result).Format('yyyy-MM-dd');
                            }
                            if (string === 'dateFrom') {
                                vm.subsidy.travel_start_date = $scope.result;
                            } else {
                                vm.subsidy.travel_end_date = $scope.result;
                            }
                            vm.calculateDays();
                            $scope.$apply();
                        } catch (e) {
                        }
                    };
                    var error = function (response) {
                    };
                    if (!vm.isReadOnly) {
                        if (ionic.Platform.isWebView()) {
                            var startTime = '-';
                            var endTime = '-';
                            var banPick = {};
                            if (date) {
                                banPick = {
                                    "startTime": startTime,
                                    "endTime": endTime,
                                    "dates": [],
                                    "selectedDate": date
                                };
                            } else {
                                banPick = {"startTime": startTime, "endTime": endTime, "dates": []};
                            }
                            if ($sessionStorage.lang != 'zh_cn') {
                                banPick.language = "en";
                            }
                            HmsCalendar.openCalendar(success, error, 2, banPick);
                        }
                    }
                }
            };


            /*
             * 退出提示框
             * */
            $scope.showPopup = function () {
                if($stateParams.isUpdate){
                    var newObject = JSON.stringify(vm.subsidy);
                    if(newObject != oldObject){
                        var confirmPopup = $ionicPopup.confirm({
                            title: $filter('translate')('subsidy_info.prompt'),//提示
                            template: $filter('translate')('subsidy_info.Information.not.saved.exit'),//信息未保存,是否退出?
                            cancelText: $filter('translate')('common.cancel'),//取消
                            okText: $filter('translate')('common.ok'),//确定
                            cssClass: 'delete-ordinary-application-popup'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                $scope.goBack();
                            }
                        });
                    }else{
                        $scope.goBack();
                    }
                }else{
                    var confirmPopup = $ionicPopup.confirm({
                        title: $filter('translate')('subsidy_info.prompt'),//提示
                        template: $filter('translate')('subsidy_info.Information.not.saved.exit'),//信息未保存,是否退出?
                        cancelText: $filter('translate')('common.cancel'),//取消
                        okText: $filter('translate')('common.ok'),//确定
                        cssClass: 'delete-ordinary-application-popup'
                    });
                    confirmPopup.then(function (res) {
                        if (res) {
                            //删除已关联的补贴信息
                            PublicFunction.showLoading(150);
                            var param = [{
                                "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                                "confirm_id":  vm.subsidy.confirm_id,
                                "_status":"delete"
                            }];
                            subsidyListService.deleteSubsidy(param).then(function (data) {
                                if(data.data.success){
                                    $scope.goBack();
                                }else if(data.data.error.message){
                                    PublicFunction.showToast(data.data.error.message);
                                }else{
                                    PublicFunction.showToast($filter('translate')('error.message.Subscription.message.deletion.failed'));
                                }
                                $ionicLoading.hide();
                            });
                        }
                    });
                }
            }

            $scope.goBack = function () {
                PageValueService.set("subsidyItem","");//清空
                PageValueService.set("updateSubsidyFlag","");
                if ($ionicHistory.backView()) {
                    $state.go('app.subsidyList');
                } else {
                    $state.go('app.tab_erv.homepage');
                }
            };
        }]);
