/**
 * Created by lizhi on 2017/03/14.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.erv_approval_expense_scanner', {
            url: '/erv/approval/expense/scanner',
            params:{reject:false},
            data: {
                roles: ['ROLE_COMPANY_FINANCE_ADMIN', 'ROLE_COMPANY_FINANCE_RECEIVED']
            },
            cache: false,
            views: {
                'page-content@app': {
                    'templateUrl': 'scripts/pages/expense_report_version/approval/scanner/approval.expense.scanner.tpl.html',
                    'controller': 'com.handchina.huilianyi.ErvApprovalExpenseScannerController'
                }
            },
            resolve:{
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('approval');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.huilianyi.ErvApprovalExpenseScannerController', ['$scope', '$rootScope', '$state',
        '$stateParams', '$ionicPlatform', 'ScannerService', '$ionicLoading', '$ionicModal', '$timeout',
        'localStorageService', 'FunctionProfileService', 'ApprovalERVService', '$ionicGesture', 'ServiceBaseURL',
        'Auth', 'PublicFunction', '$filter',
        function ($scope, $rootScope, $state, $stateParams, $ionicPlatform, ScannerService, $ionicLoading, $ionicModal,
                  $timeout, localStorageService, FunctionProfileService, ApprovalERVService, $ionicGesture, ServiceBaseURL,
                  Auth, PublicFunction, $filter) {

            // 用户权限
            $scope.roles = localStorageService.get('roles');

            // 扫一扫页面相关内容
            $scope.expenseScan = {
                opened: false,      // 扫码页面是否打开

                // 扫码页面返回的所有类型
                types: {
                    CLOSE: "CLOSE",     // 关闭
                    AUDIT: "AUDIT",     // 驳回
                    REVIEW: "REVIEW",   // 读图审核
                    INPUT: "INPUT"      // 手动输入单号
                },

                // 扫码模式
                operation: "",

                // 扫一扫页面的所有提示信息(不包括后端的错误提示)
                tips: {
                    title: "",                                  // 扫码框上方的标题，可空
                    tipScan: $filter('translate')('approval.scan.plugin.tipScan'),  // 扫码框下方的提示(请扫描…二维码),可空."请扫描单据上的二维码"
                    tipInput: $filter('translate')('approval.scan.plugin.tipInput'), // 输入单号提示."输入单号"
                    tipLoading: $filter('translate')('approval.scan.plugin.tipLoading'), // 调接口的过程中的提示."正在处理中... "
                    tipNetworkError: $filter('translate')('approval.scan.plugin.tipNetworkError'), // 网络错误时的提示."当前网络不可用, 请检查网络设置"
                    tipOffline: $filter('translate')('approval.scan.plugin.tipOffline'),  //  没有打开web时的提示."请按照页面下方提示 先打开汇联易网站"
                    openButton: $filter('translate')('approval.scan.plugin.openButton'),  //  我已打开按钮文字."我已打开"
                    footerFirst: "",        // 底部提示第一行,可空
                    footerSecond: ""        //  底部提示第二行,可空
                },

                // 扫码审核的接口
                expenseScanRequest: {
                    url: ServiceBaseURL.url + '/api/audit/scancode', // 请求的链接(字符串)
                    method: "POST", // 请求的方法(字符串，"GET","POST"等等)
                    headers: {
                        Authorization: 'Bearer ',    // +accessToken
                        'Content-Type': 'application/json'
                    },
                    config: {
                        timeout: $rootScope.httpTimeout // 超时时间
                    },
                    data: {
                        code: "", // 二维码信息
                        operate: "" // 扫码模式
                    }
                },

                // 判断中控是否连接接口
                webJudgeRequest: {
                    url: ServiceBaseURL.url + "/api/audit/scancode/online/check?scanMode=REVIEW", // 请求的链接(字符串)
                    method: "GET", // 请求的方法(字符串，"GET","POST"等等)
                    headers: {
                        Authorization: 'Bearer ',    // +accessToken
                        'Content-Type': 'application/json'
                    },
                    config: {
                        timeout: $rootScope.httpTimeout // 超时时间
                    }
                }
            };

            $scope.view = {
                loadingTime: 1500,      // loading的时间,1500ms
                isButtonClick: false,    // 按钮是否点击,防止重复点击
                hasFinancePermission: $scope.roles.indexOf("ROLE_COMPANY_FINANCE_ADMIN")!==-1,    // 是否有财务审核权限
                hasReceivePermission: $scope.roles.indexOf("ROLE_COMPANY_FINANCE_RECEIVED")!==-1,   // 是否有财务收到权限
                backLocked: false,      // 左上角返回键是否锁定,避免打开modal时点击modal的返回键导致页面返回

                // 所有的扫码模式
                operations: {
                    REVIEW: "REVIEW",           // 读图审核
                    AUDIT_PASS: "AUDIT_PASS",   // 通过
                    AUDIT: "AUDIT",             // 驳回
                    RECEIVE: "RECEIVE"          // 收到
                },

                // 扫一扫页面的提示信息(不包括后端的错误提示)
                tips: {
                    title: {
                        // 扫码框上方的标题，可空
                        REVIEW: "",           // 读图审核
                        AUDIT_PASS: $filter('translate')('approval.scan.plugin.title.AUDIT_PASS'),   // "锁定审核通过"
                        AUDIT: $filter('translate')('approval.scan.plugin.title.AUDIT'),             // "锁定审核驳回"
                        RECEIVE: $filter('translate')('approval.scan.plugin.title.RECEIVE')        // "锁定报销单收到"
                    },
                    footerFirst: {
                        // 底部提示第一行,可空
                        REVIEW: $filter('translate')('approval.scan.plugin.footerFirst.REVIEW'), // 读图审核."请先在电脑游览器打开https://hly.xiaojukeji.com"
                        AUDIT_PASS: "",   // 通过
                        // 驳回."如需通过键盘输入驳回理由，可在电脑游览器打开https://hly.xiaojukeji.com，在财务管理>单据审核页面切换到扫码审核模式"
                        AUDIT: $filter('translate')('approval.scan.plugin.footerFirst.AUDIT'),
                        RECEIVE: ""          // 收到
                    },
                    footerSecond: {
                        // 底部提示第二行,可空
                        REVIEW: $filter('translate')('approval.scan.plugin.footerSecond.REVIEW'), // 读图审核."进入财务管理>单据审核页面，再进行app扫码"
                        AUDIT_PASS: "",   // 通过
                        AUDIT: "",             // 驳回
                        RECEIVE: ""          // 收到
                    }
                },

                // 延时1s解锁页面返回键
                unlockBackButton: function() {
                    $timeout(function() {
                        $scope.view.backLocked = false;
                    }, 1000);
                },

                // 锁定页面返回键
                lockBackButton: function() {
                    $scope.view.backLocked = true;
                },

                goBack: function(event) {
                    event.preventDefault();
                    event.stopPropagation();

                    // 是否是点击modal的返回
                    if(this.backLocked) {
                        return
                    }
                    $state.go('app.tab_erv.homepage');
                },

                showToast: function(message) {
                    $ionicLoading.show({template: message, noBackdrop: true, duration: $scope.view.loadingTime});
                },

                showLoading: function () {
                    PublicFunction.showLoading();
                },

                hideLoading: function(timeout) {
                    $timeout(function() {
                        $ionicLoading.hide();
                    }, timeout ? timeout : 0);
                },

                // 进入扫码页面
                openScanner: function() {
                    var operations = $scope.view.operations,
                    // 在扫码页面需要用到的http请求信息
                        httpRequest = [$scope.expenseScan.expenseScanRequest, $scope.expenseScan.webJudgeRequest]
                        ;

                    // 进入扫码页面
                    ScannerService.expenseScan($scope.expenseScan.tips, $scope.expenseScan.operation, httpRequest)
                        .then(function(success) {
                            // 扫码成功
                            var data = success,     // 插件返回的数据
                            // 扫描的二维码
                                code = data.message && data.message.code ? data.message.code : "",
                            // 扫描页面后端返回的数据
                                response = data.message && data.message.response ? data.message.response: null
                                ;

                            // 隐藏loading
                            $scope.view.hideLoading(0);

                            // 关闭所有已打开的modal
                            $scope.view.closeAllModals();

                            // 扫码页面已关闭
                            $scope.expenseScan.opened = false;

                            switch (data.type) {
                                // 驳回
                                case $scope.expenseScan.types.AUDIT:
                                    // 中控在线则打开scanModal,否则打开rejectModal输入驳回理由
                                    if(response.online) {
                                        $scope.modal.scanModal.openModal();
                                    } else {
                                        $scope.modal.rejectModal.openModal(response.expenseReport);
                                    }
                                    break;
                                // 读图审核
                                case $scope.expenseScan.types.REVIEW:
                                    // 打开scanModal
                                    $scope.modal.scanModal.openModal();
                                    break;
                                // 输入单号
                                case $scope.expenseScan.types.INPUT:
                                    // 打开inputModal输入单号
                                    $scope.modal.inputModal.openModal();
                                    break;
                                // 关闭
                                case $scope.expenseScan.types.CLOSE:
                                    // 解锁页面返回键
                                    $scope.view.unlockBackButton();
                                    break;
                            }

                        }, function(error){
                            // 扫码失败
                            var data = error;       // 返回数据
                            //alert(JSON.stringify(error));    // 打印测试

                            // 隐藏loading
                            $scope.view.hideLoading(0);

                            // 关闭所有已打开的modal
                            $scope.view.closeAllModals();

                            // 扫码页面已关闭
                            $scope.expenseScan.opened = false;
                        });
                },

                // 点击扫码按钮
                scan: function(operation) {
                    // 如果已经打开扫码页面,直接返回不再重新打开
                    if($scope.expenseScan.opened) {
                        return
                    }

                    // 扫码页面已打开
                    $scope.expenseScan.opened = true;

                    $scope.view.showLoading();

                    // 锁定页面返回键
                    $scope.view.lockBackButton();

                    $scope.expenseScan.operation = operation;
                    $scope.expenseScan.tips.title = $scope.view.tips.title[operation];  // 扫码框上方的标题
                    $scope.expenseScan.tips.footerFirst = $scope.view.tips.footerFirst[operation];  // 底部提示第一行
                    $scope.expenseScan.tips.footerSecond = $scope.view.tips.footerSecond[operation];  // 底部提示第二行
                    $scope.expenseScan.expenseScanRequest.data.operate = operation;
                    //console.log(localStorageService.get('token').access_token);   // 打印测试

                    // 刷新token
                    Auth.refreshToken().then(function(data) {
                        // loading不隐藏,直到从扫码页面返回才隐藏
                        //$scope.view.hideLoading(0);

                        // 拼接token
                        $scope.expenseScan.expenseScanRequest.headers.Authorization = 'Bearer ' + data.access_token;
                        $scope.expenseScan.webJudgeRequest.headers.Authorization = 'Bearer ' + data.access_token;

                        // 进入扫码页面
                        $scope.view.openScanner();
                    }, function() {
                        $scope.view.hideLoading($scope.view.loadingTime);
                    });
                },

                // 扫描下一张
                scanNext: function() {
                    $scope.view.scan($scope.expenseScan.operation);
                },

                // 关闭所有打开的modal
                closeAllModals: function() {
                    if($scope.modal.scanModal.opened) {
                        $scope.modal.scanModal.closeModal();
                    }
                    if($scope.modal.rejectModal.opened) {
                        $scope.modal.rejectModal.closeModal();
                    }
                    if($scope.modal.inputModal.opened) {
                        $scope.modal.inputModal.closeModal();
                    }
                }
            };

            // modal相关
            $scope.modal = {
                // 读图和打开中控时的驳回扫码完之后打开的modal
                scanModal: {
                    modal: null,
                    opened: false,  // modal是否打开

                    /**
                     * 打开scanModal
                     */
                    openModal: function() {
                        var self = this;

                        //  scanModal定义
                        $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/approval/scanner/modal/approval.scan.modal.tpl.html', {
                            scope: $scope,
                            animation: 'slide-in-right',
                            backdropClickToClose: false,    // 点击空白不关闭modal
                            hardwareBackButtonClose: false  // 安卓物理返回键不直接关闭modal,单独处理
                        }).then(function (modal) {
                            self.modal = modal;

                            self.modal.show();
                            self.opened = true;

                            // 锁定页面返回键
                            $scope.view.lockBackButton();
                        });
                    },

                    /**
                     * 关闭scanModal
                     */
                    closeModal: function() {
                        this.modal.remove();
                        this.opened = false;

                        // 解锁页面返回键
                        $scope.view.unlockBackButton();
                    },

                    // 扫描下一张
                    scanNext: function() {
                        //this.closeModal();
                        $scope.view.scanNext();
                    }
                },

                // 输入驳回理由modal
                rejectModal: {
                    modal: null,
                    opened: false,  // modal是否打开

                    /**
                     * 打开rejectModal
                     */
                    openModal: function(expenseReportData) {
                        var self = this;

                        //  rejectModal定义
                        $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/approval/scanner/modal/approval.reject.modal.tpl.html', {
                            scope: $scope,
                            animation: 'slide-in-right',
                            backdropClickToClose: false,    // 点击空白不关闭modal
                            hardwareBackButtonClose: false  // 安卓物理返回键不直接关闭modal,单独处理
                        }).then(function (modal) {
                            self.modal = modal;

                            self.view.clearModal();
                            self.view.expenseReportData = expenseReportData;
                            self.modal.show();
                            self.opened = true;

                            // 锁定页面返回键
                            $scope.view.lockBackButton();
                        });
                    },

                    /**
                     * 关闭rejectModal
                     */
                    closeModal: function() {
                        //this.view.clearModal();
                        this.modal.remove();
                        this.opened = false;

                        // 解锁页面返回键,这里还需要打开扫码界面,所以不需要解锁
                        //$scope.view.unlockBackButton();
                    },

                    // 扫描下一张
                    scanNext: function() {
                        //this.view.clearModal();
                        // 扫描下一张
                        $scope.view.scanNext();
                    },

                    view: {
                        replyContent : '',  // 驳回理由
                        emptyError: false,  // 驳回理由为空错误
                        expenseReportData: null,  // 报销单内容
                        replies : [
                            // 报销金额与原始票据不一致
                            {id : 0, content: $filter('translate')('approval.scan.rejectModal.quickReply.tip0')},
                            // 原始票据类型与费用类型不一致
                            {id : 1, content: $filter('translate')('approval.scan.rejectModal.quickReply.tip1')},
                            // 原始票据不符合规定
                            {id : 2, content: $filter('translate')('approval.scan.rejectModal.quickReply.tip2')},
                            // 不符合报销政策
                            {id : 3, content: $filter('translate')('approval.scan.rejectModal.quickReply.tip3')},
                            // 存在不合理报销事项
                            {id : 4, content: $filter('translate')('approval.scan.rejectModal.quickReply.tip4')}
                        ],

                        clearModal: function() {
                            this.replyContent = "";
                            this.expenseReportData = null;
                        },

                        // 选择快捷回复
                        selectReply : function (reply) {
                            this.replyContent = reply.content;
                        },

                        // 驳回
                        rejectReply : function () {
                            var self = $scope.modal.rejectModal.view,
                                options = null;  // 请求的参数

                            // 驳回理由为空
                            self.emptyError = false;
                            if(!self.replyContent){
                                self.emptyError = true;
                                return;
                            }

                            options = {
                                entities: [{
                                    "entityOID": self.expenseReportData.expenseReportOID,
                                    "entityType": 1002      // 1001: 申请单, 1002: 报销单
                                }],
                                approvalTxt: self.replyContent
                            };

                            // 调接口驳回
                            $scope.view.showLoading();
                            ApprovalERVService.rejectAudit(options).then(function (response) {

                                if(response.data.successNum === 1){
                                    // 驳回成功
                                    $scope.view.showToast($filter('translate')('approval.scan.toast.reject.success'));

                                    // 扫描下一张
                                    $timeout(function() {
                                        $scope.modal.rejectModal.scanNext();
                                    }, $scope.view.loadingTime);
                                }else{
                                    // 驳回失败
                                    $scope.view.showToast($filter('translate')('approval.scan.toast.reject.fail'));
                                }
                            }, function (err) {
                                // 驳回失败
                                $scope.view.showToast($filter('translate')('approval.scan.toast.reject.fail'));
                            })
                        }
                    }
                },

                //手动输入单号modal
                inputModal: {
                    modal: null,
                    opened: false,  // modal是否打开

                    /**
                     * 打开inputModal
                     */
                    openModal: function() {
                        var self = this;

                        //  inputModal定义
                        $ionicModal.fromTemplateUrl('scripts/pages/expense_report_version/approval/scanner/modal/approval.input.modal.tpl.html', {
                            scope: $scope,
                            animation: 'slide-in-right',
                            backdropClickToClose: false,    // 点击空白不关闭modal
                            hardwareBackButtonClose: false  // 安卓物理返回键不直接关闭modal,单独处理
                        }).then(function (modal) {
                            self.modal = modal;
                            self.view.clearModal();
                            self.modal.show();
                            self.opened = true;
                            // 锁定页面返回键
                            $scope.view.lockBackButton();

                            // 打开键盘,监听输入框右边清空按钮区域
                            $timeout(function() {
                                self.view.initModal();
                            }, 500);
                        });
                    },

                    /**
                     * 关闭inputModal
                     */
                    closeModal: function() {
                        var self = this;

                        //self.view.closeKeyboard();
                        self.modal.remove();
                        self.opened = false;
                        //self.view.clearModal();

                        // 解锁页面返回键,这里还需要打开扫码界面,所以不需要解锁
                        //$scope.view.unlockBackButton();
                    },

                    // 扫描下一张
                    scanNext: function() {
                        //this.view.clearModal();

                        // 扫描下一张
                        $scope.view.scanNext();
                    },

                    view: {
                        keyword: "",    // 搜索单号关键字
                        minLengthOfKeyword: 3,  // 关键字最小长度
                        expenseReport: null,    // 审核驳回时的报销单数据
                        expenseReportData: [],   // 搜索出来的报销单数据
                        expenseInputElementID: '#business-code-input',    // 输入框的css id
                        noResult: false,    // 是否有搜索结果
                        selected: false,    // 是否已选择
                        isRejectTipShow: true,  // 是否显示驳回的提示
                        searchLoading: false,   // 搜索时的loading
                        buttonContent: {
                            // 页面按钮显示文字
                            REVIEW: $filter('translate')('approval.scan.inputModal.buttonContent.REVIEW'), // 读图审核."确认"
                            AUDIT_PASS: $filter('translate')('approval.scan.inputModal.buttonContent.AUDIT_PASS'), // 通过."审核通过"
                            AUDIT: $filter('translate')('approval.scan.inputModal.buttonContent.AUDIT'), // 驳回."审核驳回"
                            RECEIVE: $filter('translate')('approval.scan.inputModal.buttonContent.RECEIVE') // 收到."确认收到"
                        },

                        // 打开modal时初始化
                        initModal: function() {
                            var self = this;

                            self.clearButtonListener();
                            self.openKeyboard();

                        },

                        // 监听输入框右边清空按钮区域,如果点击了该区域,清空输入框内容
                        clearButtonListener: function() {
                            var self = this,
                            // 输入框DOM
                                expenseInputElement = $(self.expenseInputElementID),
                                width = expenseInputElement.width()    // 输入框的宽度
                                ;

                            expenseInputElement.on('touchstart', function(event) {
                                var pageX = event.originalEvent.touches[0].pageX;

                                // 点击输入框区域的右边35px以内的地方时,清空输入框.(输入框的padding为左边15px,右边35px,加起来50px)
                                if(pageX >= width+15 && pageX <= width+50) {
                                    self.clearKeyword();
                                    $scope.$apply();
                                }
                            });
                        },

                        // 清空搜索的关键字
                        clearKeyword: function() {
                            this.keyword = "";
                        },

                        // 清空inputModal
                        clearModal: function() {
                            this.clearKeyword();
                            this.expenseReportData = [];
                            this.expenseReport = null;
                            this.selected = false;
                        },

                        // 打开键盘
                        openKeyboard: function() {
                            // 安卓
                            if(!ionic.Platform.is('browser') && ionic.Platform.is('android')){
                                // 打开键盘
                                $(this.expenseInputElementID).focus();
                                cordova.plugins.Keyboard.show();
                            } else {
                                // 其他打开键盘
                                $(this.expenseInputElementID).focus();
                            }
                        },

                        // 关闭键盘
                        closeKeyboard: function() {
                            if(!ionic.Platform.is('browser')){
                                cordova.plugins.Keyboard.close();
                            }
                        },

                        // 根据关键字分割报销单号
                        splitExpenseDataByKeyword: function() {
                            var self = this,
                                i;

                            for(i=0; i<self.expenseReportData.length; i++) {

                                var item = self.expenseReportData[i],
                                    position = item.toUpperCase().indexOf(self.keyword.toUpperCase()),// 第一个位置,忽略大小写
                                    positions = [],  // 关键字在字符串的所有下标起止位置的数组
                                    result = [],
                                    j;

                                // 获取报销单号包含关键字的所有下标
                                while (position>-1) {
                                    positions.push(position);
                                    positions.push(position + self.keyword.length);
                                    // 下一个位置,忽略大小写
                                    position = item.toUpperCase().indexOf(self.keyword.toUpperCase(), position+self.keyword.length);
                                }

                                // 如果没有包含关键字,直接加入整个字符串(这种情况不应该出现)
                                if(positions.length===0) {
                                    result.push({
                                        highlight: false,
                                        data: item
                                    })
                                } else {
                                    // 如果单号没有在开始匹配关键字,前面的不需要高亮
                                    if(positions[0]!==0) {
                                        result.push({
                                            highlight: false,
                                            data: item.substring(0, positions[0])
                                        })
                                    }
                                    for (j=0; j<positions.length; j+=2) {
                                        // 需要高亮
                                        result.push({
                                            highlight: true,
                                            data: item.substring(positions[j], positions[j+1])
                                        });
                                        // 不需要高亮
                                        // 如果不是最后一组
                                        if(j+2<positions.length){
                                            result.push({
                                                highlight: false,
                                                data: item.substring(positions[j+1], positions[j+2])
                                            });
                                        } else {
                                            // 最后一组
                                            result.push({
                                                highlight: false,
                                                data: item.substring(positions[j+1], item.length)
                                            });
                                        }
                                    }
                                }

                                // 将result添加到expenseReportData
                                self.expenseReportData[i] = {
                                    origin: self.expenseReportData[i],      // 初始单号
                                    new: result     //分割之后的数据
                                };
                            }
                        },

                        // 选择报销单号
                        selectExpenseReport: function(item) {
                            this.keyword = item.origin;
                            this.selected = true;   // 已选择
                            this.expenseReportData = []; // 清空搜索结果
                        },

                        // 搜索报销单号
                        getApprovalExpenseByBusinessCode: function() {
                            var self = this;

                            self.noResult = false;
                            self.searchLoading = true;

                            ApprovalERVService.getApprovalExpenseByBusinessCode(this.keyword)
                                .then(function(response) {
                                    self.searchLoading = false;

                                    self.expenseReportData = response.data;
                                    self.noResult = self.expenseReportData.length===0; // 是否没有结果
                                    // 如果有结果,进行结果分割
                                    if(!self.noResult){
                                        self.splitExpenseDataByKeyword();
                                    }
                                }, function() {
                                    self.searchLoading = false;
                                    //$scope.view.showToast("获取数据出错");
                                });
                        },

                        // 点击确定/审核通过/审核驳回/确认收到按钮
                        getScannerInfoByBusinessCode: function() {
                            var self = this,
                            // 请求参数
                                options = {
                                    operate: $scope.expenseScan.operation,
                                    inputCode: self.keyword
                                };

                            $scope.view.showLoading();
                            ScannerService.getScannerInfo(options).then(function(response){
                                var data = response.data,
                                    inputModal = $scope.modal.inputModal;

                                if(data.code==="0000") {
                                    // 处理成功
                                    if($scope.expenseScan.operation===$scope.view.operations.REVIEW) {
                                        // 读图审核

                                        // 处理成功!
                                        $scope.view.showToast($filter('translate')('approval.scan.toast.report.success'));

                                        // 关闭当前modal,并且打开扫描下一张的modal
                                        $timeout(function() {
                                            inputModal.closeModal();
                                            $scope.modal.scanModal.openModal();
                                        }, $scope.view.loadingTime);
                                    } else if($scope.expenseScan.operation===$scope.view.operations.AUDIT) {
                                        // 审核驳回,如果中控打开扫一扫页面,打开扫描下一张的modal,否则直接跳转审核modal

                                        // 处理成功!
                                        $scope.view.showToast($filter('translate')('approval.scan.toast.report.success'));
                                        $timeout(function() {
                                            inputModal.closeModal();
                                            if(data.online) {
                                                $scope.modal.scanModal.openModal();
                                            } else {
                                                $scope.modal.rejectModal.openModal(data.expenseReport);
                                            }
                                        }, $scope.view.loadingTime);
                                    } else {
                                        // 否则,扫描下一张
                                        $scope.view.showToast(data.msg);
                                        $timeout(function() {
                                            inputModal.scanNext();
                                        }, $scope.view.loadingTime);
                                    }
                                } else if(data.code==="0006" && $scope.expenseScan.operation===$scope.view.operations.REVIEW) {
                                    // 读图审核并且中控未打开:请先打开汇联易网站,进入财务管理>单据审核页面!
                                    $scope.view.showToast($filter('translate')('approval.scan.toast.report.offline'));
                                } else if(data.code==="0001"){
                                    // 二维码无效/单据无效:该单据无效!
                                    $scope.view.showToast($filter('translate')('approval.scan.toast.report.notValid'));
                                } else {
                                    // 其他错误
                                    $scope.view.showToast(data.msg);
                                }
                            }, function() {
                                // 处理失败!
                                $scope.view.showToast($filter('translate')('approval.scan.toast.report.fail'));
                            })
                        }
                    }
                }
            };

            // modal打开测试
            //$scope.modal.scanModal.openModal();
            //$scope.modal.rejectModal.openModal({applicantName: "lijia", businessCode: "ER00010049"});
            //$scope.modal.inputModal.openModal();

            // 扫码界面取消手势锁, 离开扫码界面重新打开手势锁.获取functionProfileList
            $scope.$on('$ionicView.beforeEnter', function(){
                $rootScope.isOpenedCamera = true;

                FunctionProfileService.getFunctionProfileList().then(function(data){
                    $scope.view.functionProfileList = data;
                });
            });
            $scope.$on('$ionicView.beforeLeave', function(){
                $rootScope.isOpenedCamera = false;
            });

            // 监听搜索单号时输入的关键字
            $scope.$watch('modal.inputModal.view.keyword', function(newValue, oldValue) {
                var self = $scope.modal.inputModal.view;

                // 如果已选择,直接返回
                if(self.selected) {
                    self.selected = false;      // 清除选择标记
                    self.isRejectTipShow = true;
                    return
                }

                // 输入三位以上才搜索,否则清空数据
                if(newValue.length>=self.minLengthOfKeyword) {
                    self.isRejectTipShow = false;
                    self.expenseReportData = [];
                    self.getApprovalExpenseByBusinessCode();
                } else {
                    self.noResult = false;
                    self.expenseReportData = [];
                    self.isRejectTipShow = true;
                }
            });

            // 当我们用完模型时，清除它！
            $scope.$on('$destroy', function () {
                // 执行动作
            });
            // 当隐藏模型时执行动作
            $scope.$on('modal.hide', function () {
                // 执行动作
            });
            // 当移动模型时执行动作
            $scope.$on('modal.removed', function () {
                // 执行动作
            });

            // 监听返回键
            $ionicPlatform.onHardwareBackButton(function () {
                // 判断哪个modal打开进行相应处理
                if($scope.modal.scanModal.opened) {
                    $scope.modal.scanModal.closeModal();
                } else if ($scope.modal.rejectModal.opened) {
                    $scope.modal.rejectModal.scanNext();
                } else if ($scope.modal.inputModal.opened) {
                    $scope.modal.inputModal.scanNext();
                }
            });
        }]);
