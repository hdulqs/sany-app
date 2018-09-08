/**
 * Created by Yuko on 16/7/30.
 */

// supplierName 选中的供应商请在控件内传入对应的参数给supplier-name (eg:add.plane.itinerary.modal.html)

// ctsho_air  中旅机场
// ctrip_air 携程机场
// ctrip_train 携程火车
// ctrip_hotel 携程酒店
// baoku_air 宝库机场
// standard 标准


'use strict';
angular.module('huilianyi.pages')
    //.config(['$stateProvider', function ($stateProvider) {
    //    $stateProvider
    //        .state('app.erv_person_selector', {
    //            url: '/erv/person/selector',
    //            views: {
    //                'page-content@app': {
    //                    templateUrl: 'scripts/components/modal/person_selector/person.selector.tpl.html',
    //                    controller: 'com.handchina.huilianyi.ErvPersonSelectorController'
    //                }
    //            }
    //        })
    //
    //}])
    .directive('citySelector', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                city: '=',
                readonly: '=',
                type: '=?', // 1001 飞机, 1002  全部, （已废弃）
                holder: '=',
                code: '=?',
                allowanceTip: '=?', //修改城市  差补提醒
                hideHotCity: '=?', //是否隐藏热门城市
                supplierName: '=',
                hideForeign:'=?',//是否隐藏国外城市
                allowanceCallback: '&'
            },
            templateUrl: 'scripts/components/modal/city_selector/city.selector.tpl.html',
            controller: 'com.handchina.huilianyi.CitySelectorController'
        }
    }])
    .controller('com.handchina.huilianyi.CitySelectorController', ['$scope', '$ionicModal', 'UserService', 'ParseLinks',
        'TravelService', '$ionicLoading', 'TravelERVService', 'FunctionProfileService', '$filter', '$timeout',
        'localStorageService', 'PublicFunction', '$ionicPopup',
        function ($scope, $ionicModal, UserService, ParseLinks, TravelService, $ionicLoading, TravelERVService,
                  FunctionProfileService, $filter, $timeout, localStorageService, PublicFunction, $ionicPopup) {

            var historyCity = [];//历史访问城市
            $scope.self = {
                cityLists: [],
                //城市列表
                searchCityDatas: [],
                //搜索出来的城市列表
                tabIndex: 0,
                //默认第一个tab
                hotCitys: [],
                //热门城市
                hideFirstBotton: true,
                //隐藏搜索界面的取消按钮
                focusOnBlur: false,
                country: $filter('translate')('city_js.china'),
                //是否一直聚焦
                tabs: [
                    {"name": $filter('translate')('city_js.china.city')},
                    {"name": $filter('translate')('city_js.inter.city')}
                ],
                history: $filter('translate')('city_js.history'),
                popular: $filter('translate')('city_js.popular'),
                //tab
                closeSearchCitys: function () {
                    $scope.searchCity.hide();

                },
                //关闭搜索别表
                scrollContentToOne: function () {

                },
                //聚焦事件
                scrollContentToTwo: function () {

                },
                //失去焦点事件
                clearData: function () {
                    $scope.self.focusOnBlur = true;
                    $scope.self.getValue = "";
                    setTimeout(function () {
                        $scope.self.focusOnBlur = false;
                    }, 10)
                },
                //清空搜索列表的inpu输入内容
                showCity: function () {
                    if (!$scope.readonly) {
                        $scope.self.tabIndex = 0;
                        $scope.self.changeCityDatas($scope.self.tabIndex);
                        $scope.self.init();
                        $scope.selectCity.show();
                        // 加这个可以使ion-content中加了overflow-scroll="true"之后页面的点击不会触发下一个页面的点击
                        $timeout(function () {
                            $(".contactQuickContent").attr("overflow-scroll", "false");
                        }, 100);
                    }
                },
                //弹出城市控件
                chooseCity: function (item, string) {
                    if (JSON.stringify($scope.self.cityLists[1].customLocationDetailDTOS).indexOf(item.code) === -1 && JSON.stringify(historyCity).indexOf(item.code) === -1) {
                        if(!historyCity){
                            historyCity = []
                        }
                        if (historyCity.length < 6) {
                            historyCity.push(item)
                        } else {
                            historyCity.splice(0, 1);
                            historyCity.push(item)
                        }
                        switch ($scope.supplierName) {
                            case "ctsho_air":
                                if (localStorageService.get('language') === "zh_cn") {
                                    localStorageService.set('ctsho_air', historyCity);
                                } else {
                                    localStorageService.set('en_ctsho_air', historyCity);
                                }
                                //中旅机场本地历史
                                break;
                            case "ctrip_air":
                                if (localStorageService.get('language') === "zh_cn") {
                                    localStorageService.set('ctrip_air', historyCity);
                                } else {
                                    localStorageService.set('en_ctrip_air', historyCity);
                                }
                                //携程机场本地历史
                                break;
                            case "ctrip_train":
                                if (localStorageService.get('language') === "zh_cn") {
                                    localStorageService.set('ctrip_train', historyCity);
                                } else {
                                    localStorageService.set('en_ctrip_train', historyCity);
                                }
                                //携程火车本地历史
                                break;
                            case "ctrip_hotel":
                                if (localStorageService.get('language') === "zh_cn") {
                                    localStorageService.set('ctrip_hotel', historyCity);
                                } else {
                                    localStorageService.set('en_ctrip_hotel', historyCity);
                                }
                                //携程酒店本地历史
                                break;
                            case "baoku_air":
                                if (localStorageService.get('language') === "zh_cn") {
                                    localStorageService.set('baoku_air', historyCity);
                                } else {
                                    localStorageService.set('en_baoku_air', historyCity);
                                }
                                //获取宝库机场本地历史
                                break;
                            case "standard":
                                if (localStorageService.get('language') === "zh_cn") {
                                    localStorageService.set('standard', historyCity);
                                } else {
                                    localStorageService.set('en_standard', historyCity);
                                }
                                //获取标准本地历史
                                break;
                            default:
                                if (localStorageService.get('language') === "zh_cn") {
                                    localStorageService.set('standard', historyCity);
                                } else {
                                    localStorageService.set('en_standard', historyCity);
                                }
                                //标准本地历史
                                break;
                                $scope.self.cityLists[0].customLocationDetailDTOS = historyCity;
                        }
                    }
                    $scope.self.closeCity(item, string);
                },
                //选中城市列表
                chooseSearchCity: function (item) {
                    if($scope.allowanceTip){
                        var confirmPopup = $ionicPopup.confirm({
                            scope: $scope,
                            title: $filter('translate')('common.tip'), //提示
                            template: '<p style="text-align: center">' + $filter('translate')('custom.application.tip.change_city_clear_allowance') + '</p> ', //更改城市将清空已添加的差补
                            cancelText: $filter('translate')('common.cancel'), //取消
                            cancelType: 'button-calm',
                            okText: $filter('translate')('common.sure_modify'), //确认更改
                            cssClass: 'stop-time-popup'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                var params = {};
                                params.code = item.code;
                                if (item.district) {
                                    params.city = item.district
                                } else {
                                    if (item.city) {
                                        params.city = item.city
                                    } else {
                                        if (item.state) {
                                            params.city = item.state
                                        } else {
                                            params.city = item.country
                                        }
                                    }
                                }
                                $scope.self.chooseCity(params, 'hideAllowanceTip');
                                $scope.allowanceCallback();
                                $scope.searchCity.hide();
                            } else {

                            }
                        })
                    } else {
                        var params = {};
                        params.code = item.code;
                        if (item.district) {
                            params.city = item.district
                        } else {
                            if (item.city) {
                                params.city = item.city
                            } else {
                                if (item.state) {
                                    params.city = item.state
                                } else {
                                    params.city = item.country
                                }
                            }
                        }
                        $scope.self.chooseCity(params);
                        $scope.searchCity.hide();
                    }

                },
                //选中搜索列表的城市
                closeCity: function (item, hideAllowanceTip) {
                    if(!hideAllowanceTip && $scope.allowanceTip && item && item.code && item.code != $scope.code){
                        var confirmPopup = $ionicPopup.confirm({
                            scope: $scope,
                            title: $filter('translate')('common.tip'), //提示
                            template: '<p style="text-align: center">' + $filter('translate')('custom.application.tip.change_city_clear_allowance') + '</p> ', //更改城市将清空已添加的差补
                            cancelText: $filter('translate')('common.cancel'), //取消
                            cancelType: 'button-calm',
                            okText: $filter('translate')('common.sure_modify'), //确认更改
                            cssClass: 'stop-time-popup'
                        });
                        confirmPopup.then(function (res) {
                            if (res) {
                                if (item) {
                                    $scope.city = item.city;
                                    $scope.code = item.code;
                                }
                                $scope.allowanceCallback();
                                $scope.searchCity.hide();
                                $scope.selectCity.hide();
                                $timeout(function () {
                                    $scope.selectCity.remove();
                                    $scope.self.initModal();
                                }, 200);
                            } else {

                            }
                        })

                    } else {
                        if (item) {
                            $scope.city = item.city;
                            $scope.code = item.code;
                        }
                        $scope.searchCity.hide();
                        $scope.selectCity.hide();
                        $timeout(function () {
                            $scope.selectCity.remove();
                            $scope.self.initModal();
                        }, 200);
                    }

                },
                //关闭城市控件
                changeTab: function (index, item) {
                    if (index === $scope.self.tabIndex)
                        return;
                    if (index === 1 && ($scope.supplierName === "ctsho_air" || $scope.supplierName === "baoku_air" || $scope.hideForeign)) {//通过hideForeign来禁止国外城市的tab的切换
                        $ionicLoading.show({
                            template: $filter('translate')('city_js.sorry'),
                            duration: '1000'
                        });
                    } else {
                        $scope.self.tabIndex = index;
                        $scope.self.changeCityDatas(index);
                    }
                },
                //切换tab
                changeCityDatas: function (index) {
                    TravelERVService.getCitys($scope.supplierName, index).then(function (data) {
                        data[0].customLocationDetailDTOS = historyCity;
                        angular.copy(data, $scope.self.cityLists);
                    }, function (reason) {

                    })
                },
                //切换tab的时候数据改变
                searchCitys: function (keyWords) {
                    if (!keyWords)
                        return;
                    $scope.showSerch = false;
                    var params = {};
                    params.keyWord = keyWords;
                    params.vendorType = $scope.supplierName;
                    if ($scope.supplierName === undefined)
                        params.vendorType = 'standard';
                    if($scope.supplierName === 'ctrip_hotel' && $scope.self.tabIndex === 1)
                        params.vendorType = 'standard';
                    if($scope.self.tabIndex === 0)
                        params.country = 'china';
                    else
                        params.country = 'foreign';
                    TravelERVService.searchALLCity(params).then(function (data) {
                        $scope.showSerch = true;
                        angular.copy(data, $scope.self.searchCityDatas);
                    }, function (error) {
                        $scope.showSerch = true;
                        PublicFunction.showToast($filter('translate')('city_js.failed'));
                    });
                },
                //搜索功能,根据供应商来搜索
                searchContacts: function () {
                    $scope.searchCity.show();
                    $timeout(function () {
                        $scope.self.focusOnBlur = false;
                        document.getElementById('employeeInputSearch').focus();
                        $scope.$apply();
                    }, 700)

                },
                //点击控件头顶的时候弹出搜索框 并且自动聚焦
                init: function () {
                    $scope.showSerch = true;
                    $scope.self.searchCityDatas = [];
                    switch ($scope.supplierName) {
                        case "ctsho_air":
                            if (localStorageService.get('language') === "zh_cn") {
                                //因为后台数据英文跟中文的数据的量不能够达到一致.
                                if (localStorageService.get('ctsho_air') === null) {
                                    localStorageService.set('ctsho_air', historyCity);
                                } else {
                                    historyCity = localStorageService.get('ctsho_air')
                                }
                            } else {
                                if (localStorageService.get('en_ctsho_air') === null) {
                                    localStorageService.set('en_ctsho_air', historyCity);
                                } else {
                                    historyCity = localStorageService.get('en_ctsho_air')
                                }
                            }
                            //获取中旅机场本地历史
                            break;
                        case "ctrip_air":
                            if (localStorageService.get('language') === "zh_cn") {
                                //因为后台数据英文跟中文的数据的量不能够达到一致.
                                if (localStorageService.get('ctrip_air') === null) {
                                    localStorageService.set('ctrip_air', historyCity);
                                } else {
                                    historyCity = localStorageService.get('ctrip_air')
                                }
                            } else {
                                if (localStorageService.get('en_ctrip_air') === null) {
                                    localStorageService.set('en_ctrip_air', historyCity);
                                } else {
                                    historyCity = localStorageService.get('en_ctrip_air')
                                }
                            }
                            //获取携程机场本地历史
                            break;
                        case "ctrip_train":
                            if (localStorageService.get('language') === "zh_cn") {
                                //因为后台数据英文跟中文的数据的量不能够达到一致.
                                if (localStorageService.get('ctrip_train') === null) {
                                    localStorageService.set('ctrip_train', historyCity);
                                } else {
                                    historyCity = localStorageService.get('ctrip_train')
                                }
                            } else {
                                if (localStorageService.get('en_ctrip_train') === null) {
                                    localStorageService.set('en_ctrip_train', historyCity);
                                } else {
                                    historyCity = localStorageService.get('en_ctrip_train')
                                }
                            }
                            //获取携程火车本地历史
                            break;
                        case "ctrip_hotel":
                            if (localStorageService.get('language') === "zh_cn") {
                                //因为后台数据英文跟中文的数据的量不能够达到一致.
                                if (localStorageService.get('ctrip_hotel') === null) {
                                    localStorageService.set('ctrip_hotel', historyCity);
                                } else {
                                    historyCity = localStorageService.get('ctrip_hotel')
                                }
                            } else {
                                if (localStorageService.get('en_ctrip_hotel') === null) {
                                    localStorageService.set('en_ctrip_hotel', historyCity);
                                } else {
                                    historyCity = localStorageService.get('en_ctrip_hotel')
                                }
                            }
                            //获取携程酒店本地历史
                            break;
                        case "baoku_air":
                            if (localStorageService.get('language') === "zh_cn") {
                                //因为后台数据英文跟中文的数据的量不能够达到一致.
                                if (localStorageService.get('baoku_air') === null) {
                                    localStorageService.set('baoku_air', historyCity);
                                } else {
                                    historyCity = localStorageService.get('baoku_air')
                                }
                            } else {
                                if (localStorageService.get('en_baoku_air') === null) {
                                    localStorageService.set('en_baoku_air', historyCity);
                                } else {
                                    historyCity = localStorageService.get('en_baoku_air')
                                }
                            }
                            //获取宝库机场本地历史
                            break;
                        case "standard":
                            if (localStorageService.get('language') === "zh_cn") {
                                //因为后台数据英文跟中文的数据的量不能够达到一致.
                                if (localStorageService.get('standard') === null) {
                                    localStorageService.set('standard', historyCity);
                                } else {
                                    historyCity = localStorageService.get('standard')
                                }
                            } else {
                                if (localStorageService.get('en_standard') === null) {
                                    localStorageService.set('en_standard', historyCity);
                                } else {
                                    historyCity = localStorageService.get('en_standard')
                                }
                            }

                            //获取标准本地历史
                            break;
                        default:
                            if (localStorageService.get('language') === "zh_cn") {
                                //因为后台数据英文跟中文的数据的量不能够达到一致.
                                if (localStorageService.get('standard') === null) {
                                    localStorageService.set('standard', historyCity);
                                } else {
                                    historyCity = localStorageService.get('standard')
                                }
                            } else {
                                if (localStorageService.get('en_standard') === null) {
                                    localStorageService.set('en_standard', historyCity);
                                } else {
                                    historyCity = localStorageService.get('en_standard')
                                }
                            }

                            //获取标准本地历史
                            break
                    }
                },
                initModal: function () {
                    $ionicModal.fromTemplateUrl('city.selector.html', {
                        scope: $scope,
                        animation: 'none'
                    }).then(function (modal) {
                        $scope.selectCity = modal;
                    });
                    //城市列表
                    $ionicModal.fromTemplateUrl('scripts/components/modal/city_selector/city.search.modal.html', {
                        scope: $scope,
                        animation: 'none'
                    }).then(function (modal) {
                        $scope.searchCity = modal;
                    });
                }
                //数据初始化
            };
            $scope.self.initModal();
            $scope.self.init();
            $scope.$on('$destroy', function () {
                $scope.selectCity.remove();
            });
            //当页面关闭的时候,即使的摧毁掉当前的modal
        }]);


