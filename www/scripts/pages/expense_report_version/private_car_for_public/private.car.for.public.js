/**
 * Created by Yuko on 16/12/5.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.private_car_for_public', {
            cache: false,
            url: '/private/car/for/public',
            views: {
                'page-content@app': {
                    templateUrl: 'scripts/pages/expense_report_version/private_car_for_public/private.car.for.public.tpl.html',
                    controller: 'com.handchina.huilianyi.PrivateCarForPublicController'
                }
            },
            resolve:{
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    //$translatePartialLoader.addPart('homepage');
                    $translatePartialLoader.addPart('private');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.huilianyi.PrivateCarForPublicController', ['$scope', '$ionicLoading', '$filter', 'LocationService', '$timeout',
        'localStorageService', '$ionicPopover', 'PrivateCarForPublicService', '$ionicModal', '$sessionStorage', 'CompanyConfigurationService', 'CurrencyCodeService',
        'PublicFunction', '$ionicHistory', '$state', 'ExpenseService', 'InvoiceService', 'NetworkInformationService', 'WaveTravelService',
        function ($scope, $ionicLoading, $filter, LocationService, $timeout, localStorageService, $ionicPopover, PrivateCarForPublicService, $ionicModal,
                  $sessionStorage, CompanyConfigurationService, CurrencyCodeService, PublicFunction, $ionicHistory, $state, ExpenseService, InvoiceService,
                  NetworkInformationService, WaveTravelService) {
            $scope.view = {
                modifyString: 'start',
                isStart: true,
                isEnd: false,
                isFinish: false,
                isStartError: false,  //定位失败
                isEndError: false,    //定位失败
                privateData: {
                    price: 0,
                    city: null,
                    startTime: null,
                    startLocation: {
                        longitude: null,
                        latitude: null,
                        address: null
                    },
                    endTime: null,
                    endLocation: {
                        longitude: null,
                        latitude: null,
                        address: null
                    },
                    mileage: 0,
                    distance: 0,
                    total: 0,
                },
                language: $sessionStorage.lang,
            };
            $scope.content = {
                errorText: $filter('translate')('error.location.failed.please.try.again.or.manually.input') /*定位失败，请重试或手动输入*/,
                disabled: false,
                networkError: false,
                networkErrorText:  $filter('translate')('error.network')/*哎呀,网络出错了!*/,
                networkErrorIcon: "img/error-icon/network-error.png",
                systemError: false,
                systemErrorText: $filter('translate')('error.server')/*服务器开小差了*/,
                systemErrorSubText: $filter('translate')('error.system')/* 技术小哥正在努力修复!*/,
                systemErrorIcon: "img/error-icon/system-error.png",
                noSetting: false,
            };
            $scope.public = {
                expenseType: null,
                errorText: $filter('translate')('error.no.unit.price.per.kilometer') /*未设置每公里单价*/,
                currencyCode: null,
                companyExpenseTypes: [], //所有费用类型
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                goBack: function () {
                    if ($ionicHistory.backView()) {
                        $ionicHistory.goBack();
                    } else {
                        $state.go('app.tab_erv.homepage');
                    }
                },
                submit: function () {
                    var createExpense = function(cityCode, cityName) {
                        var expenseInfo = {
                            expenseTypeOID: $scope.public.expenseType.expenseTypeOID,
                            expenseTypeName: $scope.public.expenseType.name,
                            expenseTypeIconName: $scope.public.expenseType.iconName,
                            amount: parseFloat($scope.view.privateData.total).toFixed(2),
                            currencyCode: $scope.public.currencyCode,
                            invoiceCurrencyCode: $scope.public.currencyCode,
                            createdDate: new Date(),
                            invoiceInstead: false,
                            //!!!创建私车公用费用传的参数要以中文命名，参数的name不要进行多语言处理
                            data: [
                                {
                                    "name": "出发时间",//$filter('translate')('private.time.of.departure')//出发时间
                                    "value": $filter('date')($scope.view.privateData.startTime,"yyyy-MM-dd'T'HH:mm:ss'Z'")
                                },
                                {
                                    "name": "出发地",//$filter('translate')('private.place.of.departure')//出发地
                                    "value": JSON.stringify($scope.view.privateData.startLocation)
                                },
                                {
                                    "name": "目的地",//$filter('translate')('private.place.of.arrival')//目的地
                                    "value": JSON.stringify($scope.view.privateData.endLocation)
                                },
                                {
                                    "name": "到达时间",//$filter('translate')('private.time.of.arrival')//到达时间
                                    "value": $filter('date')($scope.view.privateData.endTime,"yyyy-MM-dd'T'HH:mm:ss'Z'")
                                },
                                {
                                    // 旧的城市字段,存城市名称
                                    "name": "城市名称",//$filter('translate')('private.city')//城市
                                    "value": cityName || ""
                                },
                                {
                                    // 新的城市字段,存城市编码
                                    "name": "城市",//$filter('translate')('private.city')//城市
                                    "value": cityCode || ""
                                },
                                {
                                    "name": "单价",//$filter('translate')('private.price')//单价
                                    "value": $scope.view.privateData.price.toString()
                                },
                                {
                                    "name": "参考里程",//$filter('translate')('private.distance')//参考里程
                                    "value": $scope.view.privateData.distance.toString()
                                },
                                {
                                    "name": "里程",//$filter('translate')('private.mileage')//里程
                                    "value": $scope.view.privateData.mileage.toString()
                                }
                            ]
                        };
                        InvoiceService.upsertInvoice(expenseInfo)
                            .success(function (data) {
                                $ionicLoading.hide();
                                localStorageService.remove('privateLocation');
                                PublicFunction.showToast($filter('translate')('private.submitted')/*已提交*/);
                                $timeout(function () {
                                    $state.go('app.account_book');
                                }, 500);
                            })
                            .error(function (error) {
                                $ionicLoading.hide();
                                $scope.content.disabled = false;
                                PublicFunction.showToast($filter('translate')('error.error')/*出错了*/);
                            })
                    };

                    var pattDay, number, validDate;

                    if (!$scope.content.disabled && $scope.view.isFinish) {
                        pattDay = /^(\d+(\.\d{0,1})?)$/g;
                        number = ($scope.view.privateData.mileage.toString().split('.'));
                        validDate = pattDay.test($scope.view.privateData.mileage);
                        if(number[1] && number[1].length > 1){
                            $scope.public.openWarningPopup( $filter('translate')('private.mileage.to.retain.a.decimal') /*里程最多保留一位小数*/);
                        } else if (!validDate) {
                            $scope.public.openWarningPopup( $filter('translate')('private.please.enter.a.valid.range')/*请输入合法的里程*/);
                        } else if($scope.view.privateData.mileage <= 0){
                            $scope.public.openWarningPopup( $filter('translate')('private.mileage.must.be.greater.than.0')/*里程必须大于0*/);
                        } else {
                            PublicFunction.showLoading();
                            $scope.content.disabled = true;
                            // 城市控件将定位城市转为城市编码
                            if($scope.view.privateData.city){
                                LocationService.getCodeByCity($scope.view.privateData.city).then(function(response) {
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
                        }
                    }

                },
                getStartLocation: function () {
                    WaveTravelService.resetLocation();
                    WaveTravelService.getLocation();
                    $ionicLoading.show({
                        template: $filter('translate')('private.position')/*定位中...*/
                    });
                    $timeout(function(){
                        $ionicLoading.hide();
                        $scope.view.privateData.startLocation = angular.copy(WaveTravelService.getParam());
                        $scope.view.privateData.startTime = $scope.public.getDetailTime();
                        if(!$scope.view.privateData.startLocation.address){
                            $scope.view.isStartError = true;
                            $scope.view.isEnd = false;
                        } else {
                            $scope.view.privateData.city = WaveTravelService.getCity();
                            $scope.view.isEnd = true;
                            $scope.view.isStart = false;
                            localStorageService.set('privateLocation', $scope.view);
                            if ($scope.view.privateData.startLocation.address && $scope.view.privateData.endLocation.address) {
                                $scope.public.getDistance();
                                $scope.view.isFinish = true;
                            }
                        }
                    },4000);
                },
                getEndLocation: function () {
                    $scope.view.isStart = false;
                    $ionicLoading.show({
                        template: $filter('translate')('private.position') /*定位中..*/
                    });
                    WaveTravelService.resetLocation();
                    WaveTravelService.getLocation();
                    $timeout(function(){
                        $ionicLoading.hide();
                        $scope.view.privateData.endLocation = angular.copy(WaveTravelService.getParam());
                        $scope.view.privateData.endTime = $scope.public.getDetailTime();
                        if(!$scope.view.privateData.endLocation.address){
                            $scope.view.isEndError = true;
                            $scope.view.isFinish = false;
                        } else {
                            $scope.view.isFinish = true;
                            $scope.view.isEnd = false;
                            localStorageService.set('privateLocation', $scope.view);
                            if ($scope.view.privateData.startLocation.address && $scope.view.privateData.endLocation.address) {
                                $scope.public.getDistance();
                                $scope.view.isFinish = true;
                            }
                        }
                    },4000);
                },
                getDetailTime: function () {
                    var now = new Date();
                    return now;
                },
                //显示提示
                showTips: function ($event) {
                    $scope.popover.show($event);
                },
                modifyStartLocation: function () {
                    $scope.view.modifyString = 'start';
                    $scope.location.loadMore(1);
                    $scope.locationModal.show();
                },
                modifyEndLocation: function () {
                    $scope.view.modifyString = 'end';
                    $scope.location.loadMore(1);
                    $scope.locationModal.show();
                },
                //获取行程
                getDistance: function () {
                    LocationService.getDistance($scope.view.privateData.startLocation, $scope.view.privateData.endLocation)
                        .then(function (data) {
                            // if (data.indexOf($filter('translate')('private.meter')) >= 0) {//米
                            //     $scope.view.privateData.distance = parseFloat(data) / 1000;
                            //     $scope.view.privateData.mileage = angular.copy($scope.view.privateData.distance.toFixed(1));
                            //     $scope.view.privateData.total = ($scope.view.privateData.distance * $scope.view.privateData.price).toFixed(2);
                            // } else if (data.indexOf($filter('translate')('private.kilometer')) >= 0) {//公里
                            //     $scope.view.privateData.distance = parseFloat(data);
                            //     $scope.view.privateData.mileage = angular.copy($scope.view.privateData.distance.toFixed(1));
                            //     $scope.view.privateData.total = ($scope.view.privateData.distance * $scope.view.privateData.price).toFixed(2);
                            // } else {
                            //     $scope.view.privateData.distance = parseFloat(data);
                            //     $scope.view.privateData.mileage = angular.copy($scope.view.privateData.distance.toFixed(1));
                            //     $scope.view.privateData.total = ($scope.view.privateData.distance * $scope.view.privateData.price).toFixed(2);
                            // }


                            //纯数字，单位为 米
                            $scope.view.privateData.distance = parseFloat(data) / 1000;
                            $scope.view.privateData.mileage = angular.copy($scope.view.privateData.distance.toFixed(1));
                            $scope.view.privateData.total = ($scope.view.privateData.distance * $scope.view.privateData.price).toFixed(2);
                            localStorageService.set('privateLocation', $scope.view);
                        })
                }
            }
            $scope.location = {
                mode: 'nearby',
                placeType: null,
                map: null,
                searchKeyword: '',
                page: 1,
                size: 15,
                locations: [],
                markers: [],
                searchLocation: function () {
                    $scope.location.mode = 'keyword';
                    $scope.location.locations = [];
                    $scope.location.loadMore(1, $scope.location.searchKeyword);
                },
                loadMore: function (page, keyword) {
                    $scope.location.page = page;
                    var q = null;
                    var position = null;
                    if ($scope.view.modifyString === 'start') {
                        position = $scope.view.privateData.startLocation;
                    } else {
                        position = $scope.view.privateData.endLocation;
                    }
                    if (!position.latitude && $scope.location.mode === 'nearby') {
                        $scope.location.mode = 'keyword';
                    }
                    if ($scope.location.mode === 'nearby') {
                        q = LocationService.searchNearby($scope.location.placeType, position.longitude, position.latitude, page, $scope.location.size);
                    } else {
                        q = LocationService.searchKeywords(keyword, $scope.location.placeType, $sessionStorage.currentCity, page, $scope.location.size);
                    }
                    q.then(function (data) {
                        $scope.location.locations = $scope.location.locations.concat(data);
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }, function (error) {

                    });
                },
                selectItem: function (item) {
                    var result = {
                        address: item.name,
                        longitude: item.longitude,
                        latitude: item.latitude
                    };
                    if ($scope.view.modifyString === 'end') {
                        $scope.view.privateData.endLocation = result;
                        $scope.view.isFinish = true;
                        $scope.view.isEnd = false;
                        localStorageService.set('privateLocation', $scope.view);
                        if ($scope.view.privateData.startLocation.address && $scope.view.privateData.endLocation.address) {
                            $scope.public.getDistance();
                            $scope.view.isFinish = true;
                        }
                    } else {
                        $scope.view.privateData.startLocation = result;
                        $scope.view.isStart = false;
                        $scope.view.isEnd = true;
                        localStorageService.set('privateLocation', $scope.view);
                        if ($scope.view.privateData.startLocation.address && $scope.view.privateData.endLocation.address) {
                            $scope.public.getDistance();
                            $scope.view.isFinish = true;
                        }
                    }
                    $scope.locationModal.hide();
                }
            }
            $scope.getTransExpenseType = function () {
                var i = 0
                for (; i < $scope.public.companyExpenseTypes.length; i++) {
                    if ('private.car.for.public' === $scope.public.companyExpenseTypes[i].messageKey) {
                        $scope.public.expenseType = $scope.public.companyExpenseTypes[i];
                        break;
                    }
                }
                if(i === $scope.public.companyExpenseTypes.length){
                    $ionicLoading.show({
                        template: $filter('translate')('error.this.type.is.not.available.please.contact.administrator')/*该类型不可用，请联系管理员*/
                    });
                    $timeout(function () {
                        $ionicLoading.hide();
                        $state.go('app.tab_erv.homepage');
                    }, 1000);
                }
            };
            $scope.doRefresh = function () {
                init();
            }
            var init = function () {
                PublicFunction.showLoading();
                $scope.expenseOID = 'a97a0627-bdbe-11e6-9ff7-705a0fcb9108';
                PrivateCarForPublicService.getPrivateCarExpenseType($scope.expenseOID)
                    .success(function (data) {
                        $scope.public.expenseType = data;
                    })
                //获取公司所有的费用类型
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (data) {
                        ExpenseService.getExpenseTypes(data.companyOID)
                            .then(function (data) {
                                $scope.public.companyExpenseTypes = data;
                            });
                    });
                $scope.content.noSetting = false;
                if (localStorageService.get('privateLocation')) {
                    $scope.view = localStorageService.get('privateLocation');
                    PrivateCarForPublicService.getMyUnitPrice()
                        .success(function (data) {
                            $scope.content.networkError = false;
                            $scope.content.systemError = false;
                            if(data && data.unitPrice){
                                $scope.view.privateData.price = data.unitPrice;
                            } else {
                                $scope.public.errorText = $filter('translate')('error.no.unit.price.per.kilometer')/*未设置每公里单价*/;
                                $scope.content.noSetting = true;
                            }
                        })
                        .error(function (error, status) {
                            if ((!ionic.Platform.is('browser') && NetworkInformationService.isOffline()) || status === -1) {
                                $scope.content.networkError = true;
                            } else if (status === 503) {
                                $scope.content.systemError = true;
                            } else {
                                $scope.content.noSetting = true;
                                $scope.public.errorText =  $filter('translate')('error.error')/*出错了*/;
                            }
                        })
                        .finally(function () {
                            $ionicLoading.hide();
                        })
                } else {
                    PrivateCarForPublicService.getMyUnitPrice()
                        .success(function (data) {
                            $scope.content.networkError = false;
                            $scope.content.systemError = false;
                            if(data && data.unitPrice){
                                $scope.view.privateData.price = data.unitPrice;
                            } else {
                                $scope.public.errorText = $filter('translate')('error.no.unit.price.per.kilometer') /*未设置每公里单价*/;
                                $scope.content.noSetting = true;
                            }
                        })
                        .error(function (error, status) {
                            if ((!ionic.Platform.is('browser') && NetworkInformationService.isOffline()) || status === -1) {
                                $scope.content.networkError = true;
                            } else if (status === 503) {
                                $scope.content.systemError = true;
                            } else {
                                $scope.content.noSetting = true;
                                $scope.public.errorText =  $filter('translate')('error.error')/*出错了*/;
                            }
                        })
                        .finally(function () {
                            $ionicLoading.hide();
                        })
                }
                //本位币
                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (configuration) {
                        $scope.public.currencyCode = configuration.currencyCode;
                        $scope.code = CurrencyCodeService.getCurrencySymbol($scope.view.currencyCode);
                    })
            }
            init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
            // 里程提示
            $ionicPopover.fromTemplateUrl("scripts/pages/expense_report_version/private_car_for_public/mileage.tips.popover.html", {
                scope: $scope
            }).then(function (popover) {
                $scope.popover = popover;
            });
            //定位
            $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/private_car_for_public/location.select.modal.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.locationModal = modal;
            });

            // $scope.$watch('view.privateData.endLocation.address', function (newValue, oldValue) {
            //     if (newValue !== oldValue) {
            //         if ($scope.view.privateData.startLocation.address && $scope.view.privateData.endLocation.address) {
            //             $scope.public.getDistance();
            //             $scope.view.isFinish = true;
            //         } else {
            //             $scope.view.isFinish = false;
            //         }
            //     }
            // });
            // $scope.$watch('view.privateData.startLocation.address', function (newValue, oldValue) {
            //     if (newValue !== oldValue) {
            //         if ($scope.view.privateData.startLocation.address && $scope.view.privateData.endLocation.address) {
            //             $scope.public.getDistance();
            //             $scope.view.isFinish = true;
            //         } else {
            //             $scope.view.isFinish = false;
            //         }
            //     }
            // });

            $scope.$watch('view.privateData.mileage', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.view.privateData.total = $scope.view.privateData.price * $scope.view.privateData.mileage;
                }
            });
            $scope.$watch('view.privateData.price', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.view.privateData.total = $scope.view.privateData.price * $scope.view.privateData.mileage;
                }
            })

        }]);
