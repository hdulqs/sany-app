'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.tab_erv.homepage', {
                url: '/homepage',
                cache: false,
                data: {
                    roles: ['ROLE_USER'],
                    pageClass: 'dashboard'
                },
                views: {
                    'tab-erv-dash': {
                        templateUrl: 'scripts/pages/expense_report_version/homepage/homepage.tpl.html',
                        controller: 'com.handchina.hly.HomePageERVController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('homepage');
                        $translatePartialLoader.addPart('global');
                        $translatePartialLoader.addPart('home_page');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.hly.HomePageERVController', ['$scope', '$state', 'ExpenseService', 'CtripService',
        'PushService', '$rootScope', 'CarouselService', 'CompanyService', '$ionicPopup', 'localStorageService', 'LocalStorageKeys',
        'ApprovalERVService', 'TravelERVService', '$ionicHistory', '$ionicLoading', '$ionicSlideBoxDelegate', 'CompanyConfigurationService',
        'ENV', 'LocationService', 'Principal', 'ThirdPartService', 'ScannerService', 'BaoKuService', 'NotificationService',
        '$sessionStorage', 'VersionService', 'FunctionProfileService', 'PublicFunction', '$ionicPopover', 'CustomApplicationServices',
        '$location', 'JingDongApplicationServices', '$timeout', '$filter','Auth','CasService','approvalService',
        function ($scope, $state, ExpenseService, CtripService, PushService, $rootScope, CarouselService, CompanyService, $ionicPopup,
                  localStorageService, LocalStorageKeys, ApprovalERVService, TravelERVService, $ionicHistory, $ionicLoading,
                  $ionicSlideBoxDelegate, CompanyConfigurationService, ENV, LocationService, Principal, ThirdPartService,
                  ScannerService, BaoKuService, NotificationService, $sessionStorage, VersionService, FunctionProfileService,
                  PublicFunction, $ionicPopover, CustomApplicationServices, $location, JingDongApplicationServices, $timeout, $filter,Auth,
                  CasService,approvalService) {
            var reference = null;

            function inAppBrowserLoadStart(event) {
                var url = event.url;

                if (url.indexOf('closeInAppBrowser.html') !== -1) {
                    reference.close();
                }

                // ios下载附件
                // 如果是下载文件的链接,在系统浏览器打开下载.图片例外,图片H5已经处理
                // window.location = window.location.href.split('#')[0] + '#' + res.result.download_uri+'&attachdownload=true&meikeNew=true';
                // 链接进行特殊处理,把链接加上'#'放在当前链接后面,避免美克H5查看附件是在app内打开之后不能返回.使用时截取'#'后面的内容
                else if (url.indexOf("meikeNew=true") !== -1) {
                    var urlNew = url.split('#')[1];
                    var refNew = cordova.InAppBrowser.open(encodeURI(urlNew), '_system', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' + $filter('translate')('back.to.HuiLianYi') + ',disallowoverscroll=no');
                    refNew.addEventListener('exit', inAppBrowserClose);
                    refNew.addEventListener('loadstart', inAppBrowserLoadStart);
                }

                // android下载附件
                // 如果是下载文件的链接,在系统浏览器打开下载.图片例外,图片H5已经处理
                else if (url.indexOf("?down_id") !== -1) {
                    var ref = cordova.InAppBrowser.open(encodeURI(url), '_system', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' + $filter('translate')('back.to.HuiLianYi') + ',disallowoverscroll=no');
                    ref.addEventListener('exit', inAppBrowserClose);
                    ref.addEventListener('loadstart', inAppBrowserLoadStart);
                }
            }

            function inAppBrowserClose() {
                reference.removeEventListener('loadstart', inAppBrowserLoadStart);
                reference.removeEventListener('exit', inAppBrowserClose);
                reference = null;
            }

            $scope.hasNotification = true;
            $scope.view = {
                hasInit: false, //是否已初始化完毕
                isJiaNong: false,
                showSupplierList: false,
                configuration: [],
                hasFinanceRole: false,
                hasClickSSO: false,
                functionProfileList: null,
                // 是否使用默认轮播图, 默认不使用
                defaultBanner: false,
                // 轮播图白色背景
                blankBanner: true,
                jumpToCtripDisabled: false,//防止连续点击携程,inappbrowser打开系统浏览器
                jumpToJingdongDisabled: false,////防止连续点击京东,inappbrowser打开系统浏览器
                jumpBannerOutLinkDisabled: false,//当轮播图链接为外部链接时,防止连续点击轮播图打开系统浏览器
                language: $sessionStorage.lang,//判断当前语言环境使用相应的样式
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1500
                    });
                },
                goTo: function (state) {
                    if (state === 'app.erv_approval_list') {
                        ApprovalERVService.setStatus('waitApproval');
                        $state.go(state);
                    } else if (state === 'app.erv_travel_list') {
                        TravelERVService.setTab('init');
                        $state.go(state);
                    } else {
                        $state.go(state);
                    }
                },
                showAlert: function () {
                    var alertPopup = $ionicPopup.alert({
                        title: $filter('translate')('vendor.hint')/*提示*/,
                        template: '<p>' + $filter('translate')('vendor.coming.soon') + '</p>'/*敬请期待*/,
                        cssClass: 'show-alert',
                        okText: $filter('translate')('vendor.confirm')/*确定*/
                    })
                },
                validatePermission: function () {
                    if (window.cordova && window.cordova.plugins) {
                        ScannerService.hasPermission().then(function (res) {
                            if (ionic.Platform.isAndroid() && res === "false") {
                                $ionicPopup.alert({
                                    title: $filter('translate')('vendor.hint') /*提示*/,
                                    template: '<p>' + $filter('translate')('vendor.settings.other') + '</p>' /*<p>请前往设置->其他应用管理->汇联易->相机授权应用访问相机权限</p>*/,
                                    cssClass: 'show-alert',
                                    okText: $filter('translate')('vendor.confirm') /*确定*/
                                });
                            } else if ((ionic.Platform.isIOS() || ionic.Platform.isIPad()) && res === "false") {
                                $ionicPopup.alert({
                                    title: $filter('translate')('vendor.hint') /*提示*/,
                                    template: '<p>' + $filter('translate')('vendor.settings.other') + '</p>'/*<p>请前往设置->其他应用管理->汇联易->相机授权应用访问相机权限</p>*/,
                                    cssClass: 'show-alert',
                                    okText: $filter('translate')('vendor.confirm') /*确定*/
                                });
                            } else {
                                $state.go('app.erv_approval_expense_scanner');
                            }
                        }, function (error) {
                        });
                    }
                },
                functionProfileVenderJudge: function (type, id_list) {
                    if (!$scope.view.functionProfileList || !$scope.view.functionProfileList[type]) {
                        return true
                    }

                    for (var i = 0; i < id_list.length; i++) {
                        if ($scope.view.functionProfileList[type].indexOf(id_list[i]) != -1) {
                            return true
                        }
                    }

                    return false
                },
                judgeApproval: function () {
                    if (!$scope.view.functionProfileList['approval.disabled']) {
                        $scope.view.goTo('app.erv_approval_list');
                    } else if (!$scope.view.functionProfileList['approval.external.disabled']) {
                        $scope.meiKeApproval();
                    }
                },
                getUnReadMessageCount: function () {
                    NotificationService.countUnReadMessage()
                        .success(function (data) {
                            $scope.total = data;
                            if ($scope.total > 0) {
                                $scope.hasMessageTips = true;
                            } else {
                                $scope.hasMessageTips = false;
                            }
                        });
                }
            };
            $scope.data = {
                companyOID: null,
                carouselList: []
                //    初始化list为空，在init函数里面获取列表
            };

            /*获取当前登录用户的角色，并存储到localstorage中供以后使用*/
            Principal.identity().then(function (data) {
                //if (data.companyOID === '84b6c95a-d45d-42c5-8218-84440e72d84d') {
                //    $scope.view.isJiaNong = true;
                //} else {
                //    $scope.view.isJiaNong = false;
                //}
                $scope.view.isJiaNong = (data.companyOID === '84b6c95a-d45d-42c5-8218-84440e72d84d');
                angular.forEach(data.authorities, function (item) {
                    if (angular.equals("ROLE_COMPANY_FINANCE_ADMIN", item) || angular.equals("ROLE_COMPANY_FINANCE_RECEIVED", item)) {
                        $scope.view.hasFinanceRole = true;
                    }
                    localStorageService.set('roles', data.authorities);
                });
                //存储用户姓名，oid在localstorage中，发送给piwik
                var userInfo = {
                    name: data.fullName,
                    userOID: data.userOID
                };
                localStorageService.set('userInfo', userInfo);

                //存储用户公司名在localstorage中，发送给piwik
                var companyInfo = {
                    name: data.companyName
                };
                localStorageService.set('companyInfo', companyInfo);
            });

            //判断轮播图的内容 是否为网址
            function extractUrl(content) {
                var result = content.match(/^<p>(.*)<\/p>$/),
                    url = '';
                if (result && result.length) {
                    if (result[1].startsWith('http')) {
                        url = result[1];
                    } else {
                        //匹配attribute中的href属性
                        var tmp = result[1].match(/href="([^\"]*)"/);
                        if (tmp && tmp[1]) {
                            url = tmp[1];
                        }
                    }
                }
                return url;
            }

            $scope.goToContent = function (event, index) {
                event.preventDefault();
                if ($scope.data.carouselList[index].outLink) {
                    CarouselService.getCarouselDetail($scope.data.carouselList[index].carouselOID)
                        .then(function (response) {
                            var carousel = response.data;
                            var url = extractUrl(carousel.content);
                            if (url) {
                                if ($scope.view.jumpBannerOutLinkDisabled) {
                                    return
                                }
                                $scope.view.jumpBannerOutLinkDisabled = true;
                                var ref = cordova.InAppBrowser.open(url, '_blank', 'EnableViewPortScale=yes,location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' + $filter('translate')('back.to.HuiLianYi'));
                                $timeout(function () {
                                    $scope.view.jumpBannerOutLinkDisabled = false;
                                }, 3000);
                            } else {
                                $state.go('app.erv_carousel_detail', {carouselOID: $scope.data.carouselList[index].carouselOID});
                            }
                        });
                } else {
                    $state.go('app.erv_carousel_detail', {carouselOID: $scope.data.carouselList[index].carouselOID});
                }
                // $timeout(function () {
                //     $scope.view.carouselClick = false;
                // }, 500);
            };
            $scope.orderTrain = function () {
                var index = $.inArray(1004, $scope.view.configuration);
                if (index > -1) {
                    if (!$scope.view.hasClickSSO) {
                        $scope.view.hasClickSSO = true;
                        TravelERVService.getTongChengOrderUrl()
                            .success(function (data) {
                                $scope.view.hasClickSSO = false;
                                var ref = cordova.InAppBrowser.open(data.url, '_blank',
                                    'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' +
                                    $filter('translate')('back.to.HuiLianYi'), $filter('translate')('vendor.train'));
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('error.error')/*出错了*/);
                                $scope.view.hasClickSSO = false;
                            })
                    }

                } else {
                    $scope.view.openWarningPopup($filter('translate')('error.the.service.has.not.yet.been.opened')/*尚未开通该服务*/);
                }
            };
            $scope.getYget = function () {
                var index = $.inArray(1006, $scope.view.configuration);
                if (index > -1) {
                    if (!$scope.view.hasClickSSO) {
                        $scope.view.hasClickSSO = true;
                        ThirdPartService.getYgetSSO()
                            .success(function (data) {
                                $scope.view.hasClickSSO = false;
                                var ref = cordova.InAppBrowser.open(data.url, '_blank',
                                    'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' +
                                    $filter('translate')('back.to.HuiLianYi') + ',disallowoverscroll=no',
                                    $filter('translate')('vendor.oil.card.fee'));
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('error.error')/*出错了*/);
                                $scope.view.hasClickSSO = false;
                            })
                    }
                } else {
                    $scope.view.openWarningPopup($filter('translate')('error.the.service.has.not.yet.been.opened')/*尚未开通该服务*/);
                }
            };
            $scope.orderSecretary = function () {
                var index = $.inArray(1008, $scope.view.configuration);
                if (index > -1) {
                    var location = LocationService.getParam();
                    var locationParams = {};
                    locationParams.dLongitude = location.longitude;
                    locationParams.dLatitude = location.latitude;
                    locationParams.initPage = 'rest';
                    ThirdPartService.getSecretary(locationParams)
                } else {
                    $scope.view.openWarningPopup($filter('translate')('error.the.service.has.not.yet.been.opened')/*尚未开通该服务*/);
                }


            };
            $scope.meiKeApproval = function () {
                if (!$scope.view.hasClickSSO) {
                    $scope.view.hasClickSSO = true;
                    ThirdPartService.getMeiKeApproval()
                        .success(function (data) {
                            $scope.view.hasClickSSO = false;
                            reference = cordova.InAppBrowser.open(encodeURI(data.url), '_blank', 'location=no,toolbar=no,hardwareback=no');
                            reference.addEventListener('loadstart', inAppBrowserLoadStart);
                            reference.addEventListener('exit', inAppBrowserClose);
                        })
                        .error(function () {
                            PublicFunction.showToast($filter('translate')('error.error')/*出错了*/);
                            $scope.view.hasClickSSO = false;
                        })
                }

            };
            $scope.getDiDi = function () {
                //var env = ENV;
                //if(env === 'demo'){
                //    $state.go('app.didi_fake_demo');
                //}else {
                //    var index = $.inArray(1001, $scope.view.configuration);
                //    if(index > -1){
                //        didiJK.didiPluginFun();
                //    } else {
                //        $scope.view.openWarningPopup('尚未开通该服务');
                //    }
                //}
                /*var index = $.inArray(1001, $scope.view.configuration);
                 if(index > -1){
                 if(ionic.Platform.isAndroid()){
                 BDLoc.getLocation(function (response) {
                 if(typeof response === "string" && response === "noroot"){
                 //android 当用户没有打开定位权限时，执行这个分支，插件会自动给出没有定位权限的toast
                 }else{
                 didiJK.didiPluginFun();
                 }
                 });
                 }else{  //ios
                 didiJK.didiPluginFun();
                 }
                 } else {
                 $scope.view.openWarningPopup($filter('translate')('error.the.service.has.not.yet.been.opened'));//尚未开通该服务
                 }
                 //Uri.parse("didies://passenger");*/
                //window.location.href = 'http://common.diditaxi.com.cn/general/webEntry?app_type=es&page=jump';

                window.location.href = 'http://common.diditaxi.com.cn/general/webEntry?app_type=es&page=jump';
                /*window.location.href = 'didies://passenger';
                setTimeout(function () {
                    window.location.href = 'http://common.diditaxi.com.cn/general/webEntry?app_type=es&page=jump';
                }, 10000);*/
            };

            $scope.otherApply = function () {
                if (!$scope.view.hasClickSSO) {
                    $scope.view.hasClickSSO = true;
                    ThirdPartService.getOtherApplyUrl()
                        .success(function (data) {
                            $scope.view.hasClickSSO = false;
                            var ref = cordova.InAppBrowser.open(encodeURI(data.url), '_system', 'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' + $filter('translate')('back.to.HuiLianYi') + ',disallowoverscroll=no');
                        })
                        .error(function () {
                            PublicFunction.showToast($filter('translate')('error.error')/*出错了*/);
                            $scope.view.hasClickSSO = false;
                        })
                }

            };
            $scope.jumpToCtrip = function (data) {
                // 跳转携程页面,飞机/火车/酒店
                var _jumpSSO = function (vendor) {
                    var index = $.inArray(vendor, $scope.view.configuration);
                    if (index > -1) {
                        // 防止重复点击
                        if ($scope.view.jumpToCtripDisabled) {
                            return
                        }
                        $scope.view.jumpToCtripDisabled = true;
                        // 判断是否开启携程服务
                        CtripService.judgeCardEnable().then(function (res) {
                            if (res.data.result) {
                                // 跳转携程网站
                                CtripService.goTravelBefore(data);
                            } else {
                                $state.go('app.ctrip_no_card');
                            }
                        });
                        $timeout(function () {
                            $scope.view.jumpToCtripDisabled = false;
                        }, 3000);
                    } else {
                        // 尚未开通该服务
                        $scope.view.openWarningPopup($filter('translate')('error.the.service.has.not.yet.been.opened'));
                    }
                };

                switch (data) {
                    case 'FlightSearch':
                        // 飞机
                        if ($scope.view.showSupplierList) {
                            var pageType = 1002;
                            $state.go('app.supplier_list', {pageType: pageType});
                        } else {
                            _jumpSSO(1002);
                        }
                        break;
                    case 'HotelSearch':
                        // 酒店
                        _jumpSSO(1002);
                        break;
                    case 'TrainSearch':
                        // 火车
                        _jumpSSO(1010);
                        break;
                    default:
                    // 其他,暂时没有执行的代码
                }
            };

            $scope.jumpToCas = function () {
                //是否开通中航服服务
                var index = $.inArray(1019, $scope.view.configuration);
                if (index > -1) {
                    CasService.goCasBefore();
                } else {
                    $scope.view.openWarningPopup($filter('translate')('error.the.service.has.not.yet.been.opened')/*尚未开通该服务*/);
                }
            };

            $scope.jumpToBestTo = function () {
                var index = $.inArray(1003, $scope.view.configuration);
                var location = LocationService.getParam();
                if (index > -1) {
                    if (!$scope.view.hasClickSSO) {
                        $scope.view.hasClickSSO = true;
                        TravelERVService.getBestDoUrl(location)
                            .success(function (data) {
                                $scope.view.hasClickSSO = false;
                                var ref = cordova.InAppBrowser.open(data.url, '_blank',
                                    'location=no,toolbar=yes,toolbarposition=top,closebuttoncaption=' +
                                    $filter('translate')('back.to.HuiLianYi') + ',disallowoverscroll=no',
                                    $filter('translate')('vendor.venue'));
                            })
                            .error(function () {
                                PublicFunction.showToast($filter('translate')('error.error')/*出错了*/);
                                $scope.view.hasClickSSO = false;
                            })
                    }

                } else {
                    $scope.view.openWarningPopup($filter('translate')('error.the.service.has.not.yet.been.opened')/*尚未开通该服务*/);
                }
            };

            // 跳转京东H5
            $scope.jumpJD = function () {
                if ($scope.view.jumpToJingdongDisabled) {
                    return
                }
                $scope.view.jumpToJingdongDisabled = true;
                JingDongApplicationServices.jumpJD($location.path());
                $timeout(function () {
                    $scope.view.jumpToJingdongDisabled = false;
                }, 3000);
            };

            // 第三方供应商
            $scope.jumpThirdPart = function (data) {
                ThirdPartService.jumpThirdPart(data);
            };

            $scope.goFirstSlide = function (index) {
                if (index === ($scope.data.carouselList.length - 1)) {
                    $ionicSlideBoxDelegate.slide(0);
                }

            };
            $scope.$on('$ionicView.beforeEnter', function () {
                FunctionProfileService.getFunctionProfileList().then(function (data) {
                    $scope.view.functionProfileList = data;

                    // 首页logo url
                    $scope.view.homepageLogoUrl = data['homepage.logo.url'] ? data['homepage.logo.url'] : "img/logo.png";
                }, function () {
                    // 首页logo url, 获取失败时用默认logo
                    $scope.view.homepageLogoUrl = "img/logo.png";
                });
            });

            $scope.$on("$ionicView.enter", function () {
                $sessionStorage.approvalListPosition = null;//将审批列表的缓存在$sessionStorage中记录的点击的记录清除
                $ionicHistory.clearCache();//进入首页清除 ionic cache
                $ionicHistory.clearHistory();//进入首页清除 ionic history
                ExpenseService.setTab('INIT');
                CustomApplicationServices.setTab('init');
                $ionicHistory.clearHistory();
                FunctionProfileService.getCompanyVendor().then(function (data) {
                    $scope.view.configuration = data;  // 获取开通服务的供应商列表
                });
                approvalService.getApprovalTotal().then(function (res) {
                    if (res.data.success) {
                        $scope.hecTotalApproval = res.data.result.record[0].count_rec;
                    }else{
                        PublicFunction.showToast(res.error.message);
                    }
                });
                ApprovalERVService.getApprovalList(0, 1)
                    .success(function (data, status, headers) {
                        $scope.totalApproval = headers('x-total-count');
                    });

                CompanyConfigurationService.getCompanyConfiguration()
                    .then(function (data) {
                        $scope.view.showSupplierList = data.configuration.ui.showSupplierList;//供应商选择
                        //$scope.view.configuration = data.configuration.integrations; // 获取开通服务的供应商列表,后来改成另一个接口
                    });
            });

            $rootScope.$on('NOTIFICATIONTOTAL', function (data, event) {    // 监听通知数量变化事件
                if (angular.isDefined(data) && data > 0) {
                    $scope.total = data;
                }
            });
            $scope.$watch('total', function (newValue, oldValue, scope) {   // 监听通知数量变化并设置角标
                if (newValue !== oldValue) {
                    PushService.setBadge($scope.total);
                }
            });

            var hotfixUpdate = function (companyName) {
                //    获取公司名称，判断是否热更新该公司的app
                //window.codePush.sync(syncStatus, { installMode: InstallMode.IMMEDIATE }, downloadProgress);
                function syncStatus(status) {
                    switch (status) {
                        case SyncStatus.DOWNLOADING_PACKAGE:
                            // Show "downloading" modal
                            //navigator.notification.alert("一个更新被成功从云端安装。"+$scope.download, null, '提示', '我知道了');("一个更新被成功从云端安装。", null, '提示', '我知道了');
                            $ionicPopup.show({
                                title: $filter('translate')('vendor.downloadUpdate'),//正在下载小更新
                                template: '<p style="text-align: center" id="percentage">0%</p>',
                                //cancelText: '取消',
                                //cancelType: 'button-calm',
                                //okText: '确定',
                                scope: $scope,
                            })
                            break;
                        case SyncStatus.INSTALLING_UPDATE:
                            // Hide "downloading" modal
                            //navigator.notification.alert("云端更新出现错误。", null, '提示', '我知道了');
                            break;
                    }
                }

                function downloadProgress(downloadProgress) {
                    if (downloadProgress) {
                        // Update "downloading" modal with current download %
                        $scope.download = Math.round((downloadProgress.receivedBytes / downloadProgress.totalBytes) * 100) + "%";
                        //如果下载完了显示文字，如果没有下载完，显示百分比。只能用dom操作，angular双向绑定会有问题
                        if (downloadProgress.receivedBytes == downloadProgress.totalBytes) {
                            document.getElementById('percentage').innerHTML = $filter('translate')('vendor.Restart');//重启中，请稍后
                        }
                        else {
                            document.getElementById('percentage').innerHTML = $scope.download;
                        }
                        //$scope.download = downloadProgress.receivedBytes;
                        //console.log($scope.download)
                    }
                }

                //check if companyName includes description, not that name is separated with comma
                function checkCompanyName(companyName, description) {
                    //splitter is comma
                    var nameList = description.split(',');
                    for (var i = 0; i < nameList.length; i++) {
                        if (nameList[i] && companyName.includes(nameList[i])) {
                            return true;
                        }
                    }
                    return false;
                }

                if (!ionic.Platform.is('browser') && ENV === 'prod') {
                    //code push，如果是正式版，提示下载更新包，
                    window.codePush.checkForUpdate(
                        function (update) {
                            //！！！如果description 和companyName相符合或者description是all，则进行热更新
                            if (update && update.description && (update.description == 'all' || checkCompanyName(companyName, update.description))) {
                                //如果符合，就提示下载
                                //热更新
                                $ionicPopup.confirm({
                                    title: $filter('translate')('vendor.updateHint'),//更新提示
                                    template: '<p style="text-align: center">' + $filter('translate')('vendor.yesOrNoBownload') + '</p>',//有一个小更新，是否下载
                                    cancelText: $filter('translate')('vendor.cancel'),//取消
                                    cancelType: 'button-calm',
                                    okText: $filter('translate')('vendor.confirm')//确定
                                }).then(function (result) {
                                    //如果已经提示过了，就不再提示，第一次进入时提示
                                    $rootScope.hotfixPrompt = true;
                                    if (result) {
                                        //执行热更新
                                        window.codePush.sync(syncStatus, {installMode: InstallMode.IMMEDIATE}, downloadProgress);
                                    }
                                });
                            }
                        },
                        function () {
                        })
                }
            };

            var init = function () {
                console.log("homepage init method---------------");
                //从resolve里面移到这里，避免首页白屏的问题
                Principal.identity()
                    .then(function (data) {
                        if (data && data.companyOID) {
                            CarouselService.getCarouselList(data.companyOID)
                                .then(function (data) {
                                    $scope.view.hasInit = true;
                                    $scope.data.carouselList = data;
                                    //过滤掉禁用的轮播图
                                    $scope.data.carouselList = $scope.data.carouselList.filter(function (item) {
                                        return item.enable
                                    });
                                    // 如果没有配置,则使用默认轮播图
                                    if ($scope.data.carouselList.length <= 0) {
                                        $scope.view.defaultBanner = true;
                                    }
                                }, function () {
                                    $scope.view.hasInit = true;
                                })
                        }
                    });
                //获取未读的消息的数量
                $scope.view.getUnReadMessageCount();
                // 去掉白色背景
                $scope.view.blankBanner = false;

                //非常重要，获取公司名称存入storage，发给piwik，还有检查是否有热更新
                CompanyService.getMyCompany()
                    .then(function (data) {
                        //存储用户公司名在localstorage中，发送给piwik
                        var companyInfo = {
                            name: data.name
                        };
                        localStorageService.set('companyInfo', companyInfo);
                        //热更新检查
                        //如果已经提示过了，就不再提示，第一次进入时提示
                        if (!$rootScope.hotfixPrompt) {
                            hotfixUpdate(data.name);
                        }
                    });

                var hecToken = localStorageService.get(LocalStorageKeys.hec_token);
                var userDefault = localStorageService.get(LocalStorageKeys.hec_user_default);
                if(PublicFunction.isNull(hecToken) || PublicFunction.isNull(userDefault)){
                    $ionicPopup.alert({
                        title: $filter('translate')('error.error.title'),
                        template: '<p style="text-align: center">' + $filter('translate')('error.error.get.hec.info') + '</p>',
                        okText: $filter('translate')('common.sure')
                    }).then(function (result) {
                        localStorageService.remove('token');
                        Auth.logout();
                        $state.go('login');
                    });
                }
            };
            init();
            //if ($sessionStorage.isLoginOut) {
            //    $sessionStorage.isLoginOut = false;
            //    VersionService.getCompanyVersion().then(function (data) {
            //        if (!data.enable) {
            //            $ionicPopup.confirm({
            //                title: '检测到新版本',
            //                template: '<p style="text-align: center">该版本不可用,请更新新版本</p>',
            //                cancelText: '取消',
            //                cancelType: 'button-calm',
            //                okText: '确定'
            //            }).then(function (result) {
            //                if (result) {
            //                    if (ionic.Platform.isAndroid()) {
            //                        window.open(updateVersionUrl.android, '_system');
            //                    } else if (ionic.Platform.isIOS()) {
            //                        window.open(updateVersionUrl.ios, '_system');
            //                    } else {
            //                        $ionicLoading.show({
            //                            template: '您的手机平台暂时不支持',
            //                            duration: '1000'
            //                        });
            //                    }
            //                } else {
            //                    $ionicLoading.show({
            //                        template: '即将退出汇联易',
            //                        duration: '1000'
            //                    });
            //                    ionic.Platform.exitApp();
            //                }
            //            })
            //        } else {
            //            var localVersion = VersionService.getLocalVersion();
            //            if (localVersion < data.appVersion) {
            //                $ionicPopup.confirm({
            //                    title: '检测到新版本',
            //                    template: '<p style="text-align: center">是否立刻更新？</p>',
            //                    cancelText: '取消',
            //                    cancelType: 'button-calm',
            //                    okText: '确定'
            //                }).then(function (result) {
            //                    if (result) {
            //                        if (ionic.Platform.isAndroid()) {
            //                            window.open(updateVersionUrl.android, '_system');
            //                        } else if (ionic.Platform.isIOS()) {
            //                            window.open(updateVersionUrl.ios, '_system');
            //                        } else {
            //                            $ionicLoading.show({
            //                                template: '您的手机平台暂时不支持',
            //                                duration: '1000'
            //                            });
            //                        }
            //                    }
            //                });
            //            }
            //        }
            //    });
            //}

        }]);
