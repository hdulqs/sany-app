/**
 * Created by bin.zhu on 16/7/8.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('app.waveTravel', {
            cache: false,
            url: '/wave/travel',
            views: {
                'main@': {
                    templateUrl: 'scripts/pages/waveTravel/wave.travel.html',
                    controller: 'WaveTravelController'
                }
            },
            resolve:{
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    //$translatePartialLoader.addPart('homepage');
                    $translatePartialLoader.addPart('wave_travel');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('WaveTravelController', ['$scope', 'WaveTravelService', '$ionicLoading', '$timeout', '$filter',
        '$ionicPopup', '$ionicHistory', '$state', 'InvoiceService', '$localStorage', 'CompanyConfigurationService',
        'ExpenseService', 'LocationService',
        function($scope, WaveTravelService, $ionicLoading, $timeout, $filter, $ionicPopup, $ionicHistory, $state,
                 InvoiceService, $localStorage, CompanyConfigurationService, ExpenseService, LocationService) {
            $scope.data = {
                amount: null,
                pickUp: {
                    pickUpTime: null,
                    pickUpLocation: null,
                    pickUpLocationDetail: {
                        longitude: null,
                        latitude: null,
                        address: null
                    },
                    pickUpMessage: null,
                    startTime: null,
                    city: ''
                },
                getDown: {
                    getDownTime: null,
                    getDownLocation: null,
                    getDownLocationDetail: {
                        longitude: null,
                        latitude: null,
                        address: null
                    },
                    getDownMessage: null,
                    endTime: null
                },
                message:$filter('translate')('error.positioning.failure, after.submission.can.be.modified.manually.in.the.cost')/*定位失败，提交后可在费用中手动修改*/,
                companyExpenseTypes: null
            };
            $scope.view = {
                pickUp: true,
                getDown: false,
                finish: false,
                submit: false,
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                }
            };

            function getDetailTime() {
                var now = new Date();
                var current;
                current = $filter('date')(now, 'yyyy/MM/dd HH:mm');
                return current;
            }

            function prompt(text){
                $ionicPopup.confirm({
                    template: '<p style="text-align: center">' + text + '</p>',
                    cancelText: $filter('translate')('wave.cancel')/*取消*/,
                    cancelType: 'button-light',
                    okText:  $filter('translate')('wave.confirm')/*确定*/,
                    okType: 'button-positive'
                }).then(function (result) {
                    //$scope.createExpense();
                    $scope.goBack();
                },
                    function() {
                    //$scope.goBack();
                });
            }

            $scope.goBackConfirm = function() {
                prompt($filter('translate')('error.whether.to.clear.the.current.data')/*是否清除当前数据*/);
            };

            $scope.goBack = function() {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    //$state.go('app.tab.dash');
                    $state.go('app.tab_erv.homepage');
                }
            };

            $scope.pickUp = function() {
                $scope.view.getDown = true;
                $scope.data.pickUp.pickUpMessage = null;
                WaveTravelService.resetLocation();
                WaveTravelService.getLocation();
                $ionicLoading.show({
                    template: $filter('translate')('wave.position')/*定位中...*/
                });
                $timeout(function(){
                    $ionicLoading.hide();
                    $scope.data.pickUp.pickUpLocation = WaveTravelService.getParam().address;
                    $scope.data.pickUp.pickUpLocationDetail = angular.copy(WaveTravelService.getParam());
                    $scope.data.pickUp.city = WaveTravelService.getCity();
                    $scope.data.pickUp.pickUpTime = getDetailTime();
                    var start = new Date();
                    $scope.data.pickUp.startTime = $filter('date')(start,"yyyy-MM-dd'T'HH:mm:ss'Z'");
                    if( !$scope.data.pickUp.pickUpLocation){
                        $scope.data.pickUp.pickUpMessage = $scope.data.message;
                        $scope.data.pickUp.pickUpLocation = $filter('translate')('error.seek.failed');/*定位失败*/
                    } else {
                        $localStorage.pickUp = $scope.data.pickUp;
                    }
                },4000);
            };

            $scope.getDown = function() {
                $scope.view.pickUp = false;
                $scope.view.finish = true;
                $scope.data.getDown.getDownMessage = null;
                WaveTravelService.resetLocation();
                WaveTravelService.getLocation();
                $ionicLoading.show({
                    template:$filter('translate')('wave.position') /*定位中...*/
                });
                $timeout(function(){
                    $ionicLoading.hide();
                    $scope.data.getDown.getDownLocation = WaveTravelService.getParam().address;
                    $scope.data.pickUp.getDownLocationDetail = angular.copy(WaveTravelService.getParam());
                    $scope.data.getDown.getDownTime = getDetailTime();
                    var end = new Date();
                    $scope.data.getDown.endTime = $filter('date')(end,"yyyy-MM-dd'T'HH:mm:ss'Z'");
                    if( !$scope.data.getDown.getDownLocation){
                        $scope.data.getDown.getDownMessage = $scope.data.message;
                        $scope.data.getDown.getDownLocation = $filter('translate')('error.seek.failed');/*定位失败*/
                    } else {
                        $localStorage.getDown = $scope.data.getDown;
                    }
                },4000);
            };

            $scope.getTransExpenseType = function (expenseTypes) {
                for (var i = 0; i < (expenseTypes && expenseTypes.length); i++) {
                    if ('expense.type.transportation' === expenseTypes[i].messageKey) {
                        return expenseTypes[i];
                    }
                }
                return null;
            };

            $scope.createExpense = function(){
                var createExpense = function(cityCode, cityName) {
                    $scope.data.expenseType = $scope.getTransExpenseType($scope.data.companyExpenseTypes);
                    var expenseInfo = {
                        expenseTypeOID: $scope.data.expenseType.expenseTypeOID ,
                        expenseTypeName: $filter('translate')('wave.traffic')/*交通*/,
                        expenseTypeIconName: $scope.data.expenseType.iconName,
                        amount: $scope.data.amount,
                        currencyCode: "CNY",
                        invoiceCurrencyCode: 'CNY',
                        createdDate: new Date(),
                        //!!!创建杨招费用传的参数要以中文命名，参数的name不要进行多语言处理,后端需要匹配
                        data: [
                            {
                                name: "出发时间", // $filter('translate')('wave.time.of.departure')
                                value: $scope.data.pickUp.startTime
                            },
                            {
                                "name": "出发地", // $filter('translate')('wave.place.of.departure')
                                "value": JSON.stringify($scope.data.pickUp.pickUpLocationDetail)
                            },
                            {
                                "name": "目的地", // $filter('translate')('wave.place.of.arrival')
                                "value": JSON.stringify($scope.data.pickUp.getDownLocationDetail)
                            },
                            {
                                "name": "到达时间", // $filter('translate')('wave.time.of.arrival')
                                "value": $scope.data.getDown.endTime
                            },
                            {
                                // 旧的城市字段,中间多个空格,存城市名称
                                "name": "城市名称", // $filter('translate')('wave.city')
                                "value": cityName || ""
                            },
                            {
                                // 新的城市字段,存城市编码
                                "name": "城市", // $filter('translate')('wave.city')
                                "value": cityCode || ""
                            }
                        ]
                    };
                    $scope.view.submit = true;

                    InvoiceService.upsertInvoice(expenseInfo)
                        .success(function(data) {
                            $scope.view.openWarningPopup($filter('translate')('wave.cost.creation.success')/*费用创建成功*/);
                            $scope.view.submit = false;
                            $timeout(function () {
                                $state.go('app.account_book');
                            }, 500);
                        })
                        .error(function(){
                            $scope.view.submit = false;
                        });
                    delete $localStorage.pickUp;
                    delete $localStorage.getDown;
                };

                // 城市控件将定位城市转为城市编码
                if($scope.data.pickUp.city){
                    LocationService.getCodeByCity($scope.data.pickUp.city).then(function(response) {
                        // 只处理返回数据只有一个的情况
                        if(response.data.length===1) {
                            createExpense(response.data[0].code, response.data[0].state);
                        } else {
                            createExpense();
                        }
                    }, function() {
                        // 转换编码报错时
                        createExpense();
                    });
                } else {
                    // 没有定位城市时
                    createExpense();
                }
            };

            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
                //获取公司所有的费用类型
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function(data) {
                        ExpenseService.getExpenseTypes(data.companyOID)
                            .then(function (data) {
                                $scope.data.companyExpenseTypes = data;
                                if (!$scope.getTransExpenseType(data)) {
                                    $ionicLoading.show({
                                        template: $filter('translate')('error.this.type.is.not.available.please.contact.administrator')/*该类型不可用，请联系管理员*/
                                    });
                                    $timeout(function(){
                                        $ionicLoading.hide();
                                        $state.go('app.tab_erv.homepage');
                                    },1000);
                                }
                            });
                    });
            });

            $scope.$on('$ionicView.enter', function () {
                if ($localStorage.pickUp) {
                    $scope.data.pickUp = $localStorage.pickUp;
                    $scope.view.getDown = true;
                }
                if ($localStorage.getDown) {
                    $scope.data.getDown = $localStorage.getDown;
                    $scope.view.pickUp = false;
                    $scope.view.finish = true;
                }
            });
        }
    ]);
