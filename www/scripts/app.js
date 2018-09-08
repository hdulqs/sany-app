// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('huilianyi', [
    'ionic',
    'huilianyi.pages',
    'huilianyi.services',
    'ngAnimate',
    'ngResource',
    'ngMessages',
    'ngStorage',
    'LocalStorageModule',
    'ngCordova',
    'timer',
    'ionic-zoom-view',
    'angular-carousel',
    'ion-datetime-picker',
    'ng-currency',
    'ionic-cache-src',
    'angulartics', //these two are for angular js and piwik(data analytics)
    'angulartics.piwik',
    'pascalprecht.translate',
    'ion-gallery',
    //'mockData'
])

    .run(['$ionicPlatform', '$rootScope', 'Principal', 'Auth', '$ionicPickerI18n', 'DatePickI18N', '$sessionStorage',
        '$cordovaSplashscreen', 'localStorageService', 'HLYVersion', '$state', '$cordovaToast', '$location',
        '$ionicHistory', 'VersionService', '$ionicPopup', '$ionicLoading', 'ApprovalPopupService', 'LocationService',
        'updateVersionUrl', 'PushService', '$timeout', 'PatternLockService', 'AutoUpdateService', 'NetworkInformationService',
        'FunctionProfileService', 'ENV', 'ServiceBaseURL', 'JudgeHttpsService', '$translate', '$filter',
        '$translatePartialLoader', 'ServerService', 'PublicFunction', '$cordovaStatusbar', 'PageValueService','$http','LocalStorageKeys',
        function ($ionicPlatform, $rootScope, Principal, Auth, $ionicPickerI18n, DatePickI18N, $sessionStorage,
                  $cordovaSplashscreen, localStorageService, HLYVersion, $state, $cordovaToast, $location, $ionicHistory,
                  VersionService, $ionicPopup, $ionicLoading, ApprovalPopupService, LocationService, updateVersionUrl,
                  PushService, $timeout, PatternLockService, AutoUpdateService, NetworkInformationService,
                  FunctionProfileService, ENV, ServiceBaseURL, JudgeHttpsService, $translate, $filter,
                  $translatePartialLoader, ServerService, PublicFunction, $cordovaStatusbar, PageValueService,$http,LocalStorageKeys) {

            /**
             * 设置ServiceBaseURL,必须放在最前面
             * 如果是正式环境和预发布环境,直接设置为InitialServiceBaseURL,否则根据localStorageService判断
             */
            if (ServerService.judgeENV()) {
                ServerService.setInitServiceBaseURL();
            } else {
                ServerService.setLocalServiceBaseURL();
            }

            $rootScope.backButtonPressedOnceToExit = false;
            $rootScope.httpTimeout = 120000; // http超时时间.
            $rootScope.approvalCount = 0;
            $rootScope.totalCount = 0;
            $rootScope.functionProfileList = null;
            $rootScope.openNotification = false;
            $rootScope.$on('openNotification:success', function () {
                $rootScope.openNotification = true;
            });
            $ionicPlatform.on("pause", function (event) {
                $rootScope.appPauseTime = new Date().getTime();
                if ($location.path() === '/pattern_lock/gesture') {
                    $ionicHistory.goBack();
                }
            });

            $ionicPlatform.on("resume", function (event) {
                // isOpenedCamera用来判断是否在扫描页面,在扫描界面时on resume时不打开手势锁.pause小于2分钟时不打开手势锁.每次打开手势锁,刷新token
                if (!$rootScope.isOpenedCamera && (new Date().getTime() - $rootScope.appPauseTime) >= 120 * 1000 && $location.path() !== '/pattern_lock/gesture' && PatternLockService.getPatternLockByUsername(localStorageService.get('username')) && localStorageService.get('token')) {
                    Auth.refreshToken().then(function () {
                        $state.go('app.pattern_lock');
                    })
                } else {  // 没有手势锁
                    if (!$rootScope.openNotification) {   // 如果不是从通知栏点击通知进来的，则弹框
                        ApprovalPopupService.getCount();
                    } else { // 从通知栏进来，不弹框，openNotification取反，防止下次app唤醒不弹框
                        $rootScope.openNotification = false;
                    }
                }
            });

            $rootScope.$on('loginSuccess', function () {
                //启动app,登录成功后获取并显示审批数量
                ApprovalPopupService.getCount();
            });
            $rootScope.$on('deblocking:success', function () {
                //当有手势锁时进入前台页面，则审核数弹框待解锁后弹出
                ApprovalPopupService.getCount();
            });

            $ionicPlatform.ready(function () {

                // Calling this function is required during the first application run after an update.
                // If not called, the application will be reverted to the previous version.
                /*if (!ionic.Platform.is('browser')) {
                 window.codePush.notifyApplicationReady();
                 }*/

                // if (window.StatusBar) {
                //     // org.apache.cordova.statusbar required
                //     //StatusBar.styleDefault();
                //     $cordovaStatusbar.overlaysWebView(false);
                //     $cordovaStatusbar.style(1);
                //     StatusBar.styleLightContent();
                // }


                // 把热更新放到homepage.js里面，因为需要根据公司的名称来获取更新信息
                //if (!ionic.Platform.is('browser') && NetworkInformationService.isWiFi() && ENV === 'prod'){
                //    //code push，如果是wifi，正式版，下载更新包，下次重启后正式生效
                //    window.codePush.sync(
                //        function (syncStatus) {
                //            switch (syncStatus) {
                //                // Result (final) statuses
                //                case SyncStatus.UP_TO_DATE:
                //                    navigator.notification.alert("一个更新被成功从云端安装。", null, '提示', '我知道了');("一个更新被成功从云端安装。", null, '提示', '我知道了');
                //                    break;
                //                //case SyncStatus.ERROR:
                //                //    console.log(SyncStatus);
                //                //    break;
                //            }
                //        },
                //        {
                //            updateDialog: false, installMode: InstallMode.ON_NEXT_RESUME
                //        }
                //    );
                //}

                try {
                    $rootScope.isOpenedCamera = false; // isOpenedCamera用来判断是否在扫描页面,在扫描界面时on resume时不打开手势锁.
                    if ($location.path() !== '/pattern_lock/gesture' && PatternLockService.getPatternLockByUsername(localStorageService.get('username')) && localStorageService.get('token')) {
                        Auth.refreshToken().then(function () {
                            $state.go('app.pattern_lock');
                        })
                    }
                } catch (e) {
                    console.log("error when execute Auth.refreshToken()");
                }

                try {
                    if (ionic.Platform.isAndroid()) {
                        // app重新启动时,执行
                        if (!$rootScope.openNotification) {   // 如果不是从通知栏点击通知进来的，则弹框
                            ApprovalPopupService.getCount();
                        } else { // 从通知栏进来，不弹框，openNotification取反，防止下次app唤醒不弹框
                            $rootScope.openNotification = false;
                        }
                    }
                } catch (e) {
                    console.log("error when execute ApprovalPopupService.getCount");
                }

                /*try{
                 LocationService.getCurrentLocation();
                 }catch (e){
                 console.log("Exception when execute LocationService.getCurrentLocation");
                 console.log(e);
                 }*/

                $sessionStorage.hasCheckedVersion = false;
                $sessionStorage.isLoginOut = false;

                //.run里的多语言依赖
                $translatePartialLoader.addPart('global');
                $translate.refresh();

                // ionic serve时忽略
                //if (!ionic.Platform.is('browser') && (ionic.Platform.isAndroid() || ENV !== 'prod')){
                try {
                    if (!ionic.Platform.is('browser')) {
                        VersionService.checkVersionEnabled().then(function (data) {
                            if (!PublicFunction.isNull(data)) {
                                if (!data.enable) {
                                    $ionicPopup.confirm({
                                        title: $filter('translate')('system_check.The.new.version.is.detected'),
                                        template: '<p style="text-align: center">' + $filter('translate')('system_check.Version.unavailable') + '</p>',
                                        cancelText: $filter('translate')('system_check.cancel'),
                                        cancelType: 'button-calm',
                                        okText: $filter('translate')('system_check.ok')
                                    }).then(function (result) {
                                        if (result) {
                                            if (ionic.Platform.isAndroid()) {
                                                AutoUpdateService.androidUpdate();
                                            } else if (ionic.Platform.isIOS()) {
                                                AutoUpdateService.iosUpdate();
                                            } else {
                                                $ionicLoading.show({
                                                    template: $filter('translate')('system_check.Your.mobile.phone.platform.does.not.support.for.the.time.being'),
                                                    duration: '1000'
                                                });
                                            }
                                        } else {
                                            $ionicLoading.show({
                                                template: $filter('translate')('system_check.About.to.exit'),
                                                duration: '1000'
                                            });
                                            ionic.Platform.exitApp();
                                        }
                                    })
                                } else {
                                    var localVersion = VersionService.getLocalVersion();
                                    if (VersionService.checkUpdate(localVersion, data.appVersion)) {
                                        if (data.mandatory) {
                                            $ionicPopup.alert({
                                                title: $filter('translate')('system_check.The.new.version.is.detected'),
                                                template: '<p style="text-align: center">' + $filter('translate')('system_check.mandatory.update') + '</p>',
                                                okText: $filter('translate')('system_check.ok')
                                            }).then(function (result) {
                                                if (result) {
                                                    if (ionic.Platform.isAndroid()) {
                                                        AutoUpdateService.androidUpdate();
                                                    } else if (ionic.Platform.isIOS()) {
                                                        AutoUpdateService.iosUpdate();
                                                    }
                                                } else {
                                                    $ionicLoading.show({
                                                        template: $filter('translate')('system_check.Your.mobile.phone.platform.does.not.support.for.the.time.being'),//您的手机平台暂时不支持
                                                        duration: '1000'
                                                    });
                                                }
                                            })
                                        } else {
                                            $ionicPopup.confirm({
                                                title: $filter('translate')('system_check.The.new.version.is.detected'),
                                                template: '<p style="text-align: center">' + $filter('translate')('system_check.immediatelyUpdate') + '</p>',
                                                cancelText: $filter('translate')('system_check.cancel'),
                                                cancelType: 'button-calm',
                                                okText: $filter('translate')('system_check.ok')
                                            }).then(function (result) {
                                                if (result) {
                                                    if (ionic.Platform.isAndroid()) {
                                                        AutoUpdateService.androidUpdate();
                                                    } else if (ionic.Platform.isIOS()) {
                                                        AutoUpdateService.iosUpdate();
                                                    } else {
                                                        $ionicLoading.show({
                                                            template: $filter('translate')('system_check.Your.mobile.phone.platform.does.not.support.for.the.time.being'),//您的手机平台暂时不支持
                                                            duration: '1000'
                                                        });
                                                    }
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        })
                    }
                } catch (e) {
                    console.log("error when execute update app");
                }

                try {
                    PushService.initPushService();
                    PushService.setTag();
                    PushService.clearNotification();
                } catch (e) {
                    console.log("error when execute PushService");
                }

                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                    cordova.plugins.Keyboard.disableScroll(true);
                }

                // if (window.StatusBar) {
                //     // org.apache.cordova.statusbar required
                //     StatusBar.styleDefault();
                // }

                setTimeout(function () {
                    $cordovaSplashscreen.hide();
                }, 100);
                if (localStorageService.get('welcomeVersion') !== VersionService.getLocalVersion()) {
                    $state.go('no_header.welcome');
                }
                $ionicPickerI18n.weekdays = DatePickI18N.zh_cn.weekdays;
                $ionicPickerI18n.months = DatePickI18N.zh_cn.months;
                $ionicPickerI18n.ok = DatePickI18N.zh_cn.ok;
                $ionicPickerI18n.cancel = DatePickI18N.zh_cn.cancel;

                $ionicPlatform.registerBackButtonAction(function (e) {
                    var messageFlag = PageValueService.get('messageFlag');
                    //判断处于哪个页面时双击退出
                    console.log("$location.path()   === " + $location.path());
                    if ($location.path() === '/login' || $location.path() === '/tab/erv/homepage' || $location.path() === '/pattern_lock') {
                        if ($rootScope.backButtonPressedOnceToExit) {
                            ionic.Platform.exitApp();
                        } else {
                            $rootScope.backButtonPressedOnceToExit = true;
                            $cordovaToast.showShortCenter($filter('translate')('common.exit'));
                            $timeout(function () {
                                $rootScope.backButtonPressedOnceToExit = false;
                            }, 1500);
                        }
                    } else if ($location.path() === '/travelReqHeader' || $location.path() === '/dailyReqHeader') {
                        PageValueService.set("messageFlag", "");
                        PageValueService.set("reqHeader", "");
                        PageValueService.set("reqRefLoanInfo","");
                        if (messageFlag === 'Y') {
                            $state.go('app.erv_notification');
                        } else {
                            $state.go('app.reqList');
                        }
                    } else if ($location.path() === '/travelReqLine'){
                        $state.go('app.travelReqHeader');
                    } else if ($location.path() === '/dailyReqLine'){
                        $state.go('app.dailyReqHeader');
                    } else if ($location.path() === '/loanReqHeader') {
                        PageValueService.set("reqHeader", "");
                        var reqRefLoanInfo = PageValueService.get("reqRefLoanInfo");
                        var type = "";
                        if (!PublicFunction.isNull(reqRefLoanInfo)) {
                            type = reqRefLoanInfo.type;//类型：reqRefLoans 申请单关联借款跳转
                        }
                        if (type == 'reqRefLoan') {
                            $state.go('app.reqRefLoanList');
                        } else {
                            PageValueService.set("messageFlag", "");
                            if (messageFlag === 'Y') {
                                $state.go('app.erv_notification');
                            } else {
                                $state.go('app.reqList');
                            }
                        }
                    } else if ($location.path() === '/loanReqLine'){
                        $state.go('app.loanReqHeader');
                    } else if ($location.path() === '/reqRefLoanList'){
                        var reqRefLoanInfo = PageValueService.get("reqRefLoanInfo");
                        if (!PublicFunction.isNull(reqRefLoanInfo)) {
                            var reqHeaderId = reqRefLoanInfo.reqHeaderId;
                            var docType = reqRefLoanInfo.docType;
                            PageValueService.set("reqRefLoanInfo", "");
                            if(docType == 'travel'){
                                $state.go('app.travelReqHeader',{reqHeaderId:reqHeaderId});
                            }else{
                                $state.go('app.dailyReqHeader',{reqHeaderId:reqHeaderId});
                            }
                        }else{
                            $ionicHistory.goBack();
                        }
                    } else if ($location.path() === '/reportHeader') {
                        PageValueService.set("comDocData", "");
                        PageValueService.set("reportHeaderParams","");
                        PageValueService.set("messageFlag", "");
                        if (messageFlag === 'Y') {
                            $state.go('app.erv_notification');
                        } else {
                            $state.go('app.tab_erv.reportList');
                        }
                    } else if ($location.path() === '/confirmTravelTrip') {
                        $state.go('app.chooseTravelTrip');
                    } else if($location.path() === '/subsidyAddList'){
                        $state.go('app.subsidyList');
                    }else if ($location.path() === '/createExp'){
                        var confirmTripParams = PageValueService.get("confirmTripParams");
                        var reportHeaderParams = PageValueService.get("reportHeaderParams");
                        if(PublicFunction.isNull(confirmTripParams) && PublicFunction.isNull(reportHeaderParams)){
                            $state.go('app.expList');
                        }else{
                            $ionicHistory.goBack();
                        }
                    }else if ($location.path() === '/subsidyList'){
                        $state.go('app.confirmTravelTrip');
                    }else if ($location.path() === '/welcome') {
                        ionic.Platform.exitApp();
                    }else if($location.path() === '/subsidyInfo'){
                        var updateSubsidyFlag = PageValueService.get("updateSubsidyFlag");
                        if(PublicFunction.isNull(updateSubsidyFlag)){//新增
                            var subsidy = PageValueService.get("subsidyItem");
                            $http({
                                url: ServiceBaseURL.hec_interface_url,
                                method: 'POST',
                                data: {
                                    "data_type": "trip_subsidy_delete",
                                    "action": "submit",
                                    "lang": localStorageService.get(LocalStorageKeys.hec_language_code),
                                    "parameter":[{
                                        "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                                        "confirm_id":subsidy.confirm_id,
                                        "_status":"delete"
                                    }]
                                }
                            });
                            PageValueService.set("subsidyItem","");//清空
                            PageValueService.set("updateSubsidyFlag","");
                            $state.go('app.subsidyAddList');
                        }else{//查看
                            PageValueService.set("subsidyItem","");//清空
                            PageValueService.set("updateSubsidyFlag","");
                            $state.go('app.subsidyList');
                        }
                    }else if ($location.path() === '/expList') {
                        var confirmTripParams = PageValueService.get("confirmTripParams");
                        var reportHeaderParams = PageValueService.get("reportHeaderParams");
                        if (confirmTripParams) {
                            $state.go('app.confirmTravelTrip');
                        } else if (reportHeaderParams) {
                            $ionicHistory.goBack();
                        } else {
                            PageValueService.set("confirmTripParams", "");
                            PageValueService.set("reportHeaderParams", "");
                            $state.go('app.tab_erv.homepage');
                        }
                    } else if ($location.path() === '/reqList' || $location.path() === '/approvalList' ||
                        $location.path() === '/tab/erv/account' || $location.path() === '/tab/erv/reportList' ||
                        $location.path() === '/chooseTravelTrip' || $location.path() === '/erv/notification') {
                        // 扫码页面,报销单tab,我的tab,申请单列表,安卓返回键返回首页
                        $state.go('app.tab_erv.homepage');
                    } else {
                        $ionicHistory.goBack();
                    }
                    e.preventDefault();
                    return false;
                }, 101);
                //    priority>200，是覆盖dismiss modal，否则新建费用directive时，modal打开后会使得返回键失效。
            });
            $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
                $rootScope.toState = toState;
                $rootScope.toStateParams = toStateParams;

                // 清空申请人OID,单据OID,报销单关联的申请单OID
                //AgencyService.clearAll();

                if (Principal.isIdentityResolved()) {
                    Auth.authorize();
                }
            });
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (toState.name != 'login' && $rootScope.previousStateName) {
                    $rootScope.previousStateName = fromState.name;
                    $rootScope.previousStateParams = fromParams;
                }
                if (toState.data.pageClass) {
                    $rootScope.pageClass = toState.data.pageClass;
                } else {
                    $rootScope.pageClass = '';
                }
            });

            // 延时300ms，当用户调用自定义返回事件
            $rootScope.back = function () {
                // If previous state is 'activate' or do not exist go to 'home'
                $timeout(function () {  //延时300ms
                    if ($rootScope.previousStateName === 'login'
                        || $state.get($rootScope.previousStateName) === null
                        || $state.previousStateName === 'app.activate_finish') {
                        $state.go('app.tab_erv.homepage');
                    } else {
                        $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
                    }
                }, 300);
            };

            //重写全局返回按钮事件
            $rootScope.$ionicGoBack = function () {
                //延时300ms,确认用户是否进行双击操作，同时阻止冒泡事件
                $timeout(function () {  //
                    //查看历史记录ionicHistory stack中是否有backview
                    if ($ionicHistory.backView()) {
                        //有，返回上一页
                        $ionicHistory.goBack();
                    } else {
                        //没有，默认返回首页，特殊情况，可以在此进行条件判断
                        $state.go('app.tab_erv.homepage');
                    }
                }, 300);
            };
            $rootScope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
            $sessionStorage.currentCity = '长沙';

            //如果杀死进程的方式退出再等录的时候不会再进入login直接从localstorage拿token后进入相应页面，这时多语言就会以最初的config为准
            //重载app，localstorage里的language更为准确，如果首次登入，会以config中的多语言设置为准
            if (localStorageService.get('language')) {
                $sessionStorage.lang = localStorageService.get('language');
                $translate.use($sessionStorage.lang);
            }
        }])
    .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$httpProvider', '$translateProvider', '$translatePartialLoaderProvider', 'LANG', '$sessionStorageProvider', function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider, LANG, $sessionStorageProvider) {
        //$urlRouterProvider.otherwise('/tab/dash');
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'i18n/{lang}/{part}.json'
        });
        //手机可支持的语言列表
        var langList = ["zh_cn", "en"];
        var clientLocale = $translateProvider.resolveClientLocale().toLowerCase();
        //如果手机不支持语言列表里的语言，默认显示英文
        console.log("手机语言环境"+clientLocale+"===========session中的语言环境"+$sessionStorageProvider.get('lang'));
        if (!$sessionStorageProvider.get('lang')) {
            //console.log("session中没有设置lang,langList.indexOf(clientLocale)==="+langList.indexOf(clientLocale));
            var reg = new RegExp("^[en|En|EN]");
            if(reg.test(clientLocale)){
                $sessionStorageProvider.set('lang', 'en');
            }else{
                $sessionStorageProvider.set('lang', 'zh_cn');
            }
            console.log("===========设置后session中的语言环境"+$sessionStorageProvider.get('lang'));
           /*if (langList.indexOf(clientLocale) === -1) {
                $sessionStorageProvider.set('lang', 'zh_cn');
            } else {
                //获取当前手机的语言
                $sessionStorageProvider.set('lang', clientLocale);
            }*/
        }
        $translateProvider.preferredLanguage($sessionStorageProvider.get('lang'));

        //$urlRouterProvider.otherwise('/tab/erv/homepage');
        $urlRouterProvider.otherwise(function ($injector, $location) {
            $injector.invoke(['$state', function ($state) {
                $state.go('app.tab_erv.homepage');
            }]);
        });

        $httpProvider.defaults.transformRequest = function(obj) {
            if (obj) {
                if(obj instanceof Object){//费控接口处理
                    obj = JSON.stringify(obj);
                   /* obj = encodeURIComponent(obj);不能全部编码，会把"",{,:也进行编码*/
                    obj = obj.replace(/\%/g, encodeURIComponent("%"));
                    obj = obj.replace(/\+/g, encodeURIComponent("+"));
                    obj = obj.replace(/\&/g, encodeURIComponent("&"));
                   /* console.log(obj);*/
                    return obj;
                }else{//汇联易token处理
                  /*  obj = obj.replace(/\%/g, encodeURIComponent("%"));*/
                    /*console.log(obj);*/
                    return obj;
                }
            }
        }

        $ionicConfigProvider.views.transition('none');
        $ionicConfigProvider.tabs.style('standard');
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.backButton.icon('ion-ios-arrow-left');
        $ionicConfigProvider.backButton.text('');
        $ionicConfigProvider.backButton.previousTitleText(null);
        $ionicConfigProvider.views.maxCache(10);//设置ionic cache 栈的cacheView 的数量为10,如果为0,则cache 机制启用不了
        $ionicConfigProvider.views.swipeBackEnabled(false);
        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');

        $stateProvider
            .state('app', {
                abstract: true,
                data: {
                    roles: ['ROLE_USER']
                },
                views: {
                    'main': {
                        templateUrl: 'scripts/components/page.layout.html',
                        controller: 'MainAppController'
                    }
                },
                resolve: {
                    authorize: ['Auth', function (Auth) {
                        return Auth.authorize();
                    }],
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('components');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.tab', {
                url: '/tab',
                abstract: true,
                data: {
                    roles: ['ROLE_USER']
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/components/tabs.html',
                        controller: 'MainTabsController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('components');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.tab_erv', {
                url: '/tab/erv',
                abstract: true,
                data: {
                    roles: ['ROLE_USER']
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/components/tabs.erv.html',
                        controller: 'MainTabsERVController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('components');
                        return $translate.refresh();
                    }]
                }
            })
            .state('no_header', {
                abstract: true,
                data: {
                    roles: []
                },
                resolve: {
                    authorize: ['Auth', function (Auth) {
                        return Auth.authorize();
                    }],
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('components');
                        return $translate.refresh();
                    }]
                },
                views: {
                    'main': {
                        templateUrl: 'scripts/components/no.header.page.tpl.html'
                    }
                }
            });
    }]);
