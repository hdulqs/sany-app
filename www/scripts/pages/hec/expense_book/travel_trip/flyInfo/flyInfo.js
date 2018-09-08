/**
 * Created by Dawn on 2017/8/7.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.flyInfo', {
                cache: false,
                url: '/flyInfo',
                params:{
                    fly:"",
                    expReqHeaderId:"",
                    confirmHeadId:"",
                    expReqTypeCode:""//行程头信息
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_book/travel_trip/flyInfo/flyInfo.html',
                        controller: 'flyInfoCtrl',
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
    .controller('flyInfoCtrl', ['$scope','$filter', 'PublicFunction','localStorageService','LocalStorageKeys','$stateParams','$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout','flyInfoService',
        function ($scope,  $filter,PublicFunction,localStorageService,LocalStorageKeys,$stateParams,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,flyInfoService) {
            var vm = this;
            vm.expReqHeaderId = $stateParams.expReqHeaderId;
            vm.confirmHeadId = $stateParams.confirmHeadId;
            vm.expReqTypeCode = $stateParams.expReqTypeCode;//国际、国外编号
            vm.flyItem = $stateParams.fly;
            //console.log(angular.toJson(vm.flyItem));
            vm.info = {};
            if(vm.flyItem.list){
                vm.info.expense_flag =vm.flyItem.list[0].expense_flag;
                vm.info.expense_note =vm.flyItem.list[0].expense_note;
            }
            vm.save =save;
            function save() {
                var param = [];
                if(vm.flyItem.list){
                    for(var i=0 ; i<vm.flyItem.list.length;i++){
                        var item ={};
                        item.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                        item.hly_plane_info_interface_id = vm.flyItem.list[i].hly_plane_info_interface_id;
                        item.expense_flag = vm.info.expense_flag;
                        item.expense_note = vm.info.expense_note;
                        item._status ="update";
                        param.push(item);
                    }
                }
                flyInfoService.save(param).then(function (res) {
                    if(res.data.success){
                        PublicFunction.showToast($filter('translate')('message.save.success'));
                        $state.go('app.confirmTravelTrip',{expReqHeaderId:vm.expReqHeaderId,confirmHeadId:vm.confirmHeadId,expReqTypeCode:vm.expReqTypeCode});
                    }else{
                        PublicFunction.showToast($filter('translate')('message.save.failed'));
                        console.log("保存失败");
                    }
                });
            }

            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.tab_erv.homepage');
                }
            };
        }]);
