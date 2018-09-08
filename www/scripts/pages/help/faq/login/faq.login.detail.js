/**
 * Created by Yuko on 16/6/3.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.faq_login_detail_account', {
                url: '/faq/login/detail/account',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'login';
                    },
                    content: function () {
                        return 'account';
                    },
                        mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                            $translatePartialLoader.addPart('help.and.feedback');
                            return $translate.refresh();
                        }]

                }
            })
            .state('app.faq_login_detail_install', {
                url: '/faq/login/detail/install',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'login';
                    },
                    content: function () {
                        return 'install';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_login_detail_hrms', {
                url: '/faq/login/detail/hrms',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'login';
                    },
                    content: function () {
                        return 'hrms';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_login_detail_mobile', {
                url: '/faq/login/detail/mobile',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'login';
                    },
                    content: function () {
                        return 'mobile';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_login_detail_didi', {
                url: '/faq/login/detail/didi',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'login';
                    },
                    content: function () {
                        return 'didi';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_didi_detail_invoice', {
                url: '/faq/login/detail/invoice',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'didi';
                    },
                    content: function () {
                        return 'invoice';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_didi_detail_approval', {
                url: '/faq/didi/detail/approval',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'didi';
                    },
                    content: function () {
                        return 'approval';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_didi_detail_type', {
                url: '/faq/didi/detail/type',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'didi';
                    },
                    content: function () {
                        return 'type';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_didi_detail_mobile', {
                url: '/faq/didi/detail/mobile',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'didi';
                    },
                    content: function () {
                        return 'mobile';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_didi_detail_change', {
                url: '/faq/didi/detail/change',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'didi';
                    },
                    content: function () {
                        return 'change';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_travel_detail_flyback_order', {
                url: '/faq/travel/detail/flyback/order',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'travel';
                    },
                    content: function () {
                        return 'flybackOrder';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_travel_detail_born_invoice', {
                url: '/faq/travel/detail/born/invoice',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'travel';
                    },
                    content: function () {
                        return 'bornInvoice';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_travel_detail_hrms', {
                url: '/faq/travel/detail/hrms',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'travel';
                    },
                    content: function () {
                        return 'hrms';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_invoice_detail_type', {
                url: '/faq/invoice/detail/type',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'invoice';
                    },
                    content: function () {
                        return 'type';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_invoice_detail_select_project', {
                url: '/faq/invoice/detail/select/project',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'invoice';
                    },
                    content: function () {
                        return 'selectProject';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_invoice_detail_find', {
                url: '/faq/invoice/detail/find',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'invoice';
                    },
                    content: function () {
                        return 'find';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_expense_detail_import', {
                url: '/faq/expense/detail/import',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'expense';
                    },
                    content: function () {
                        return 'import';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_expense_detail_status', {
                url: '/faq/expense/detail/status',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'expense';
                    },
                    content: function () {
                        return 'status';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_expense_detail_reject', {
                url: '/faq/expense/detail/reject',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'expense';
                    },
                    content: function () {
                        return 'reject';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_expense_detail_different', {
                url: '/faq/expense/detail/different',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'expense';
                    },
                    content: function () {
                        return 'different';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_expense_detail_cancel', {
                url: '/faq/expense/detail/cancel',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'expense';
                    },
                    content: function () {
                        return 'cancel';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_expense_detail_print', {
                url: '/faq/expense/detail/print',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'expense';
                    },
                    content: function () {
                        return 'print';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_bpo_detail_process', {
                url: '/faq/bpo/detail/process',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'bpo';
                    },
                    content: function () {
                        return 'process';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
            .state('app.faq_bpo_detail_send', {
                url: '/faq/bpo/detail/send',
                cache: false,
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/help/faq/login/faq.login.detail.html',
                        controller: 'com.handchina.huilianyi.FAQLoginDetailController'
                    }
                },
                resolve: {
                    category: function () {
                        return 'bpo';
                    },
                    content: function () {
                        return 'send';
                    },
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('help.and.feedback');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('com.handchina.huilianyi.FAQLoginDetailController', ['$scope', '$state', '$ionicHistory', 'category', 'content','$filter',
        function ($scope, $state, $ionicHistory, category, content, $filter) {
            $scope.view = {
                FAQLoginDetail: [
                    {
                        question:$filter('translate')('help.feedback.FAQLoginDetail.question1') /*'首次登录时提示我用户名和密码不正确，请问账号密码和公司HR系统一致吗？'*/,
                        answer:$filter('translate')('help.feedback.FAQLoginDetail.answer1') /*'首次登录汇联易，账号密码都是个人手机号，并且需要收到验证码激活后方才可以使用。'*/
                    },
                    {
                        question:$filter('translate')('help.feedback.FAQLoginDetail.question2') /*'我的安卓系统安装汇联易失败？'*/,
                        answer:$filter('translate')('help.feedback.FAQLoginDetail.answer2') /*'1.如果老版本的汇联易没有卸载清除干净，新版本会安装失败'*/,
                        answerTwo:$filter('translate')('help.feedback.FAQLoginDetail.answerTwo2')/* '2.安卓手机与部分app不兼容，如：星巴克，海底捞。'*/
                    },
                    {
                        question:$filter('translate')('help.feedback.FAQLoginDetail.question3') /*'汇联易与HRMS系统的关系？'*/,
                        answer:$filter('translate')('help.feedback.FAQLoginDetail.answer3') /*'汇联易与HRMS打通了接口，在汇联易创建的报销单会传入HRMS系统中。须开发票的报销单需要手动打印出来粘贴发票。滴滴API自动导入的费用无需发票，审批通过后状态就变为【审核通过】，15号之前完成审批的滴滴费用公司会在月底统一打款（老版本是【已通过】），无需打印报销单。'*/
                    },
                    {
                        question: $filter('translate')('help.feedback.FAQLoginDetail.question4')/*'手机号码需要变更，怎么解除当前绑定更改新手机号码？'*/,
                        answer:$filter('translate')('help.feedback.FAQLoginDetail.answer4') /*'首先修改hrms中的手机号，隔天会自动生成汇联易账号。'*/
                    },
                    {
                        question:$filter('translate')('help.feedback.FAQLoginDetail.question5')/* '滴滴中如果点错了个人支付/个人支付(需报销)选项,有没有补救的措施？'*/,
                        answer: $filter('translate')('help.feedback.FAQLoginDetail.answer5')/*'如果是不可报销的，但错点了“个人支付(需报销）”，可在汇联易费用列表删除该费用。如果是需要报销，但是错点了“个人支付”，可在滴滴的历史订单重新勾选企业报销，这种订单还会传到汇联易,但有一天的延时。'*/
                    }
                ],
                FAQDidiDetail: [
                    {
                        question:$filter('translate')('help.feedback.FAQDidiDetail.question1') /*'滴滴打车费用报销和其他类型费用报销有什么不同?'*/,
                        answer:$filter('translate')('help.feedback.FAQDidiDetail.answer1')/* '滴滴打车的费用目前是通过滴滴与汇联易的后台接口自动导入的费用，无需员工个人索要发票，月底公司统一向滴滴索取发票。只要项目经理审批通过，月底自动发放报销款，无需纸质报销单。'*/,
                        answerTwo: $filter('translate')('help.feedback.FAQDidiDetail.answerTwo1')/*'其他费用报销在汇联易中填写提交完毕后，需像以前一样打印报销单，粘贴该费用的发票，提交公司财务审核。'*/
                    },
                    {
                        question:$filter('translate')('help.feedback.FAQDidiDetail.question2') /*'在滴滴企业版后台也可以提交滴滴费用进行审批，是不是可以不用汇联易？'*/,
                        answer: $filter('translate')('help.feedback.FAQDidiDetail.answer2')/*'员工加入了滴滴企业版后，虽然可以选到审批人，但是此流程在公司不通，必须使用汇联易提交报销单，主管才能审批。'*/
                    },
                    {
                        question: $filter('translate')('help.feedback.FAQDidiDetail.question3')/*'滴滴打车的费用无法导入汇联易中？'*/,
                        answer: $filter('translate')('help.feedback.FAQDidiDetail.answer3')/*'支付方式为个人支付（需报销）的快车、专车订单才会导入汇联易，否则是默认为个人支付。如果选择了企业报销订单却仍未导入，联系service@yunmart.com帮你解决。'*/
                    },
                    {
                        question: $filter('translate')('help.feedback.FAQDidiDetail.question4')/*'绑定滴滴企业版的手机号码发生变更，新号无法认证到公司信息，导致滴滴出行无法选择报销，滴滴企业版又不能直接修改手机号，这种情况需要怎么处理？'*/,
                        answer: $filter('translate')('help.feedback.FAQDidiDetail.answer4')/*'需要员工登录滴滴网页版,点击右上角工号，选择“退出企业”菜单，取消关联企业后通知service加入汉得企业账户。滴滴企业版网址http://es.xiaojukeji.com，登录账户为员工HRMS中登记的手机号码。'*/
                    },
                    {
                        question:$filter('translate')('help.feedback.FAQDidiDetail.question5')/* '滴滴中如果点错了"个人支付/个人支付(需报销)选项,有没有补救的措施?'*/,
                        answer: $filter('translate')('help.feedback.FAQDidiDetail.answer5')/*'如果是不可报销的，但错点了“个人支付(需报销）”，可在汇联易费用列表删除该费用。'*/,
                        answerTwo:$filter('translate')('help.feedback.FAQDidiDetail.answerTwo5')/* '如果是需要报销，但是错点了“个人支付”，可在滴滴的历史订单重新勾选企业报销，这种订单还会传到汇联易，有1天的延时。'*/
                    }
                ],
                FAQTravelDetail: [
                    {
                        question: $filter('translate')('help.feedback.FAQTravelDetail.question1')/*'在汇联易中提交差旅申请、FLYBACK申请后如何预订机票？'*/,
                        answer: $filter('translate')('help.feedback.FAQTravelDetail.answer1')/*'在汇联易中提交差旅申请，flyback申请后，不再需要订票专员帮忙订票，而是自己在携程商旅界面选择航班，并关联差旅申请。因此在提交差旅申请的时候一定要将base地修改为你实际要去的地方，否则订票信息与差旅申请信息不匹配会导致无法订票。'*/
                    },
                    {
                        question: $filter('translate')('help.feedback.FAQTravelDetail.question2')/*'在汇联易中预订酒店后如何生成费用？'*/,
                        answer: $filter('translate')('help.feedback.FAQTravelDetail.answer2')/*'通过汇联易预订酒店，酒店预订成功后订单会导入汇联易，可在左侧酒店订单中查看，并且汇联易会自动生成酒店费用，并且提示您为费用归集成本。'*/
                    },
                    {
                        question:$filter('translate')('help.feedback.FAQTravelDetail.question3')/* 'FlyBack申请和之前HRMS中的操作完全相同吗？'*/,
                        answer: $filter('translate')('help.feedback.FAQTravelDetail.answer3')/*'(1)汇联易中提交flyback申请时，必须将base地修改为实际行程中要到达的地方，而非默认base地，否则会导致无法订票。'*/,
                        answerTwo: $filter('translate')('help.feedback.FAQTravelDetail.answerTwo3')/*'(2)汇联易中暂时不支持为base地添加机场城市，因此只能在提交差旅申请时确认好要去的实际地点。'*/,
                        answerThree:$filter('translate')('help.feedback.FAQTravelDetail.answerThree3') /*'(3)汇联易暂时不支持预留机票功能，后续版本会添加此功能。'*/,
                        answerFour:$filter('translate')('help.feedback.FAQTravelDetail.answerFour3')/* '注：在试用中如果提交差旅申请时操作失误（错选出发时间、base地等）请尽快左滑撤回，如果已经审批通过后才发现错误，请联系YunMart客服帮助您解决。'*/
                    }
                ],
                FAQInvoiceDetail: [
                    {
                        question:$filter('translate')('help.feedback.FAQInvoiceDetail.question1')/* '汇联易上能够提交什么类型的费用报销？'*/,
                        answer:$filter('translate')('help.feedback.FAQInvoiceDetail.answer1')/* 'HRMS已关闭固定通讯费、酒店住宿费、驻地交通费、机票及火车票费、邮寄快递费，这5类费用请到汇联易中报销，汇联易中对应费用类型为通讯、酒店、交通、差旅、快递。'*/
                    },
                    {
                        question:$filter('translate')('help.feedback.FAQInvoiceDetail.question2')/* '选不到项目？'*/,
                        answer:$filter('translate')('help.feedback.FAQInvoiceDetail.answer2')/* 'HRMS新增加的项目隔天同步至汇联易。'*/
                    },
                    {
                        question: $filter('translate')('help.feedback.FAQInvoiceDetail.question3')/*'误删的滴滴费用数据如何找回？'*/,
                        answer:$filter('translate')('help.feedback.FAQInvoiceDetail.answer3')/* '目前版本暂不支持找回，后续会新增回收站功能。'*/
                    }
                ],
                FAQExpenseDetail: [
                    {
                        question: $filter('translate')('help.feedback.FAQExpenseDetail.question1')/*'为什么我用汇联易提交的报销单没有导入到Hrms系统中去？'*/,
                        answer:$filter('translate')('help.feedback.FAQExpenseDetail.answer1') /*'只有在汇联易中完成审批的报销单（报销单状态会变成【已通过】），才会同步到HRMS。'*/
                    },
                    {
                        question: $filter('translate')('help.feedback.FAQExpenseDetail.question2')/*'我提交了报销单以后，如何关注后续的报销单状态？'*/,
                        answer: $filter('translate')('help.feedback.FAQExpenseDetail.answer2')/*'提交了报销单后，会自动返回到报销单列表界面，此时可以看到刚刚提交的报销单处于【待审批】的状态，这时候你的主管会收到审批报销单的消息提醒。他可以同意此笔报销单或者驳回报销单，相应地，你的报销单界面的报销单状态会变成【已通过】或者【已驳回】。'*/,
                        answerTwo:$filter('translate')('help.feedback.FAQExpenseDetail.answerTwo2')/* '新版本中还加入了以下状态：'*/,
                        answerThree:$filter('translate')('help.feedback.FAQExpenseDetail.answerThree2')/* '【发票收到】财务（BPO）收到发票'*/,
                        answerFour:$filter('translate')('help.feedback.FAQExpenseDetail.answerFour2')/* '【审核通过】财务审核通过'*/,
                        answerFive: $filter('translate')('help.feedback.FAQExpenseDetail.answerFive2')/*'【审核驳回】财务审核驳回'*/,
                        answerSix:$filter('translate')('help.feedback.FAQExpenseDetail.answerSix2') /*'【已付款】报销款已发放'*/,
                        answerSeven:$filter('translate')('help.feedback.FAQExpenseDetail.answerSeven2')/* '老版本生成的报销单状态不会变，新版本创建报销单使用新的报销单状态。'*/
                    },
                    {
                        question: $filter('translate')('help.feedback.FAQExpenseDetail.question3')/*'报销单已由项目经理审批通过，状态却是【已驳回】'*/,
                        answer:$filter('translate')('help.feedback.FAQExpenseDetail.answer3') /*'汇联易更新版本后增加了报销单的状态，所以造成的老版本报销单状态错乱，直接更新版本即可。只要HRMS中同步了该报销单，即说明审核已通过。'*/
                    },
                    {
                        question: $filter('translate')('help.feedback.FAQExpenseDetail.question4')/*'报销单状态【已通过】和【审核通过】之间的区别是什么？'*/,
                        answer:$filter('translate')('help.feedback.FAQExpenseDetail.answer4')/* '已通过：项目经理审批通过'*/,
                        answerTwo:$filter('translate')('help.feedback.FAQExpenseDetail.answerTwo4')/* '审核通过：财务审核通过'*/,
                        answerThree: $filter('translate')('help.feedback.FAQExpenseDetail.answerThree4')/*'审核是指发票的审核，审核通过的报销单就可以等待打款了。'*/
                    },
                    {
                        question:$filter('translate')('help.feedback.FAQExpenseDetail.question5')/* '汇联易自动生成的报销单，发现有问题后如何进行修改和取消？'*/,
                        answer: $filter('translate')('help.feedback.FAQExpenseDetail.answer5')/*'选中报销单左滑即可撤回，状态会由待审批变为编辑中，点击进入报销单点击右上角的编辑按钮，再次编辑即可。'*/
                    },
                    {
                        question:$filter('translate')('help.feedback.FAQExpenseDetail.question6')/* '对于酒店、通讯费等报销，汇联易系统中审批之后，还需要打印出来贴票邮寄吗？如何打印呢？'*/,
                        answer:$filter('translate')('help.feedback.FAQExpenseDetail.answer6')/* '目前都是需要打印贴票的哦，汇联易系统连接HRMS，审批通过的报销单会自动同步到HRMS，登录打印并贴票邮寄至前台即可。'*/
                    }
                ],
                FAQBPODetail: [
                    {
                        question:$filter('translate')('help.feedback.FAQBPODetail.question1')/* 'BPO发票拍照，提交报销单的流程是怎样的？'*/,
                        answer: $filter('translate')('help.feedback.FAQBPODetail.answer1')/*'新建费用时，根据费用合规发票图片为必填项。可一次性平铺多张发票批量拍照上传，比如本月打了5次出租车、每次10元，可以新建一笔总金额50的交通类费用，备注填写每次打车的金额，这5张发票平铺拍在一张照片里上传。'*/
                    },
                    {
                        question: $filter('translate')('help.feedback.FAQBPODetail.question2')/*'拍照上传发票后，我还需要寄送报销单吗？'*/,
                        answer: $filter('translate')('help.feedback.FAQBPODetail.answer2')/*'需要。请邮寄到公司SSC部门：上海市青浦区汇联路33号汉得园B栋2楼，邢津玮（收），186 0170 8281。'*/,
                        answerTwo: $filter('translate')('help.feedback.FAQBPODetail.answerTwo2')/*'同步到HRMS的报销单备注栏会自动标记“☆☆☆ BPO ，汉得园B栋2楼，邢津玮（收），186 0170 8281☆☆☆”，请不要修改该标记文字，前台收到报销单后会根据该备注标记进行分拣。'*/,
                        answerThree: $filter('translate')('help.feedback.FAQBPODetail.answerThree2') /*'如果试用中存在其他问题，请发邮件到YunMart service邮箱描述您的具体问题。 service@yunmart.com技术人员会帮您解决，谢谢支持！'*/
                    }
                ],
                FAQData: null
            };
            $scope.goTo = function (name) {
                $state.go(name)
            };
            $scope.goBack = function () {
                if ($ionicHistory.backView()) {
                    $ionicHistory.goBack();
                } else {
                    $state.go('app.faq_login_list');
                }
            };
            $scope.$on('$ionicView.enter', function () {
                if (category === 'login') {
                    if (content === 'account') {
                        $scope.view.FAQData = $scope.view.FAQLoginDetail[0];
                    } else if (content === 'install') {
                        $scope.view.FAQData = $scope.view.FAQLoginDetail[1];
                    } else if (content === 'hrms') {
                        $scope.view.FAQData = $scope.view.FAQLoginDetail[2];
                    } else if (content === 'mobile') {
                        $scope.view.FAQData = $scope.view.FAQLoginDetail[3];
                    } else if (content === 'didi') {
                        $scope.view.FAQData = $scope.view.FAQLoginDetail[4];
                    }
                } else if (category === 'didi') {
                    if (content === 'invoice') {
                        $scope.view.FAQData = $scope.view.FAQDidiDetail[0];
                    } else if (content === 'approval') {
                        $scope.view.FAQData = $scope.view.FAQDidiDetail[1];
                    } else if (content === 'type') {
                        $scope.view.FAQData = $scope.view.FAQDidiDetail[2];
                    } else if (content === 'mobile') {
                        $scope.view.FAQData = $scope.view.FAQDidiDetail[3];
                    } else if (content === 'change') {
                        $scope.view.FAQData = $scope.view.FAQDidiDetail[4];
                    }
                } else if (category === 'travel') {
                    if (content === 'flybackOrder') {
                        $scope.view.FAQData = $scope.view.FAQTravelDetail[0];
                    } else if (content === 'bornInvoice') {
                        $scope.view.FAQData = $scope.view.FAQTravelDetail[1];
                    } else if (content === 'hrms') {
                        $scope.view.FAQData = $scope.view.FAQTravelDetail[2];
                    }
                } else if (category === 'invoice') {
                    if (content === 'type') {
                        $scope.view.FAQData = $scope.view.FAQInvoiceDetail[0];
                    } else if (content === 'selectProject') {
                        $scope.view.FAQData = $scope.view.FAQInvoiceDetail[1];
                    } else if (content === 'find') {
                        $scope.view.FAQData = $scope.view.FAQInvoiceDetail[2];
                    }
                } else if (category === 'expense') {
                    if (content === 'import') {
                        $scope.view.FAQData = $scope.view.FAQExpenseDetail[0];
                    } else if (content === 'status') {
                        $scope.view.FAQData = $scope.view.FAQExpenseDetail[1];
                    } else if (content === 'reject') {
                        $scope.view.FAQData = $scope.view.FAQExpenseDetail[2];
                    } else if (content === 'different') {
                        $scope.view.FAQData = $scope.view.FAQExpenseDetail[3];
                    } else if (content === 'cancel') {
                        $scope.view.FAQData = $scope.view.FAQExpenseDetail[4];
                    } else if (content === 'print') {
                        $scope.view.FAQData = $scope.view.FAQExpenseDetail[5];
                    }
                } else if (category === 'bpo') {
                    if (content === 'process') {
                        $scope.view.FAQData = $scope.view.FAQBPODetail[0];
                    } else if (content === 'send') {
                        $scope.view.FAQData = $scope.view.FAQBPODetail[1];
                    }
                }
            });
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            });
        }]);
