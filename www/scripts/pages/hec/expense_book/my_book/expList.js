/**
 * Created by Dawn on 2017/8/2.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.expList', {
                cache: false,
                url: '/expList',
                params: {
                    isImport:"",//导入标志
                    currencyCode:"",//差旅行程导入
                    companyId:"",//差旅行程导入
                    headId:"",
                    assReqFlag:""//报销单关联申请关联账本费用导入标志
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_book/my_book/expList.html',
                        controller: 'expListCtrl',
                        controllerAs:'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecexp.book');
                        $translatePartialLoader.addPart('filter');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('expListCtrl', ['$scope','$filter','$http','$q','ServiceBaseURL','PageValueService','$stateParams','$rootScope','MAX_ER_INVOICE_NUM','localStorageService', '$ionicHistory', '$document', 'Auth', '$state', '$ionicLoading', '$timeout','expListService','LocalStorageKeys','PublicFunction',
        function ($scope,  $filter, $http,$q,ServiceBaseURL,PageValueService,$stateParams,$rootScope,MAX_ER_INVOICE_NUM,localStorageService,$ionicHistory, $document, Auth, $state, $ionicLoading, $timeout,expListService,LocalStorageKeys,PublicFunction) {
            var vm = this;
            //没有数据标志
            vm.nothing = false;
            //网络错误标志
            vm.networkError = false;
            vm.networkErrorText = $filter('translate')('error.network');
            vm.networkErrorIcon = "img/error-icon/network-error.png";
            //系统错误
            vm.systemError = false;
            vm.systemErrorText = $filter('translate')('error.server');
            vm.systemErrorSubText = $filter('translate')('error.system');
            vm.systemErrorIcon = "img/error-icon/system-error.png";
            //页面参数
            vm.isImport = $stateParams.isImport;
            vm.assReqFlag = $stateParams.assReqFlag;
            vm.expList = []; //费用列表
            vm.expenseObjects = [];//存放被勾选的费用
            var params = {};//获取导入列表请求参数

            vm.page = 1;
            vm.size = LocalStorageKeys.hec_pagesize;
            vm.selectAll = false;
            //方法
            vm.countSelect = countSelect; //统计选择的费用项
            vm.loadMore = loadMore;//加载数据
            vm.goPage = goPage;//页面跳转
            vm.deleteExpense = deleteExpense; //删除费用
            vm.doRefresh = doRefresh;//刷新页面
            vm.importTravel = importTravel; //费用账本导入
            vm.selectAllAction = selectAllAction;
            vm.setSelectExpInfo = setSelectExpInfo;
            vm.toImport = toImport;
            vm.loadMore(1);//初始化我的账本

            /**
             * 我的账本-获取费用列表信息
             * @param page      页数
             * @param refresh   是否为刷新
             */
            function loadMore(page,refresh) {
                PublicFunction.showLoading(150);
                vm.page = page;
                if (page === 0) {
                    vm.expList = [];
                    vm.nothing = true;
                }
                if(vm.isImport){
                    vm.reportHeaderParams = PageValueService.get("reportHeaderParams");//报销单头信息
                    vm.confirmTripParams =PageValueService.get("confirmTripParams"); //差旅头信息
                    params= {//差旅行程确认请求参数
                        cryCode: $stateParams.currencyCode,
                        companyId:$stateParams.companyId,
                        headId:$stateParams.headId,
                        fetchall: false//批量
                    };
                    if(vm.reportHeaderParams.exp_report_type_id){
                        if(vm.assReqFlag){ //报销单关联申请
                            vm.reqItem = PageValueService.get("reqItem");
                            params = {
                                cryCode: vm.reportHeaderParams.exp_report_currency_code,
                                headId:vm.reportHeaderParams.exp_report_header_id,
                                companyId: vm.reqItem.company_id,
                                expense_type_id:vm.reqItem.expense_type_id,
                                exp_req_item_id:vm.reqItem.exp_req_item_id,
                                fetchall: false
                            }
                        }else{ //报销单不关联申请账本导入
                            params = {
                                cryCode: vm.reportHeaderParams.exp_report_currency_code,
                                companyId: vm.reportHeaderParams.company_id,
                                expReportTypeId:vm.reportHeaderParams.exp_report_type_id,
                                headId:vm.reportHeaderParams.exp_report_header_id,
                                fetchall: false
                            }
                        }
                    }
                }else{
                    params = {};
                    PageValueService.set("confirmTripParams","");
                    PageValueService.set("reportHeaderParams","");
                }
                expListService.initExpList(page ,vm.size,params).then(function (res) {
                    if(res.data.success){
                        vm.pageCnt = res.data.result.pageCount;
                        if(vm.pageCnt == 0){
                            vm.nothing = true;
                        }else if(page <= vm.pageCnt){
                            vm.total = res.data.result.totalCount;
                            vm.expList = vm.expList.concat(res.data.result.record);
                            angular.forEach(vm.expList,function (item) {
                                item.week = new Date(item.creation_date).getDay();
                            });
                            if(vm.isImport){
                                angular.forEach(vm.expList,function(item){
                                    if (vm.expenseObjects.indexOf(item.expense_id) > -1) {
                                        item.checked = true;
                                    } else {
                                        item.checked = false;
                                    }
                                });
                            }
                            if(vm.expList.length==0){
                                vm.nothing = true;
                            }
                        }
                        if (refresh) {
                            $scope.$broadcast('scroll.refreshComplete');
                        }else{
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        }
                        $ionicLoading.hide();
                    }else{
                        $ionicLoading.hide();
                        vm.systemError = true;//系统错误
                    }
                }, function (error) {
                    $ionicLoading.hide();
                    //网络错误标志
                    vm.networkError = true;
                    PublicFunction.showToast(vm.networkErrorText); // 哎呀,网络出错了!
                });
                $rootScope.$on('NETWORKERROR', function (data, event) {
                    vm.networkError = true;
                });
                $rootScope.$on('SYSTEMERROR', function (data, event) {
                    vm.systemError = true;
                });
            }

            /**
             * 设置报销单导入参数信息
             */
            function setSelectExpInfo(more) {
                var tempImportBooks = [];
                var reqRateList = [];
                angular.forEach(vm.expList,function (item,index) {
                    if(item.checked == true){
                        item.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
                        item.exp_report_header_id = vm.reportHeaderParams.exp_report_header_id;
                        //报销单头上字段
                        item.payment_flag = vm.reportHeaderParams.payment_flag;
                        item.payment_type_id = vm.reportHeaderParams.payment_method_id;//收款方式id
                        item.payment_type = vm.reportHeaderParams.exp_report_payment_method;//收款方式名称
                        item.payee_category = vm.reportHeaderParams.exp_report_payee_category;//付款对象
                        item.payee_category_name = vm.reportHeaderParams.exp_report_payee_category_name;
                        item.payee_id = vm.reportHeaderParams.exp_report_payee_id;//收款方
                        item.payee_name = vm.reportHeaderParams.exp_report_payee_name;
                        item.account_name = vm.reportHeaderParams.account_name;
                        item.account_number = vm.reportHeaderParams.account_number;
                        item.primary_quantity = 1;
                        item.exchange_rate = vm.reportHeaderParams.exp_report_rate;//头上收款-本位币
                        item.exchange_rate_type = vm.reportHeaderParams.exchange_rate_type;//"HL001"
                        item.exchange_rate_quotation = vm.reportHeaderParams.exchange_rate_quotation;
                        item.report_amount = ((item.reference_amount * item.reference_rate).toFixed(2))*1;//账本查询接口未返回report_amount
                        item.finance_amount = item.reference_amount;
                        item.finance_rate = item.reference_rate;//发票-收款汇率
                        item.report_functional_amount = ((item.report_amount*item.exchange_rate).toFixed(2))*1; //本位币收款金额，必须保存字段
                        item.description = item.notes;
                        //delete item.notes;
                        delete item.invoice_category_desc;
                        if(vm.reqItem){
                            item.exp_requisition_dists_id = vm.reqItem.exp_requisition_dists_id; //关联申请导入时需传递的参数
                        }
                        item.price = ((item.report_amount/ item.primary_quantity).toFixed(2))*1;//报销金额
                        item._status ='insert';
                        tempImportBooks.push(item);
                        reqRateList.push($http({
                            url: ServiceBaseURL.hec_interface_url,
                            method: 'POST',
                            data: {
                                "data_type": "book_get_exchange_rate",
                                "action": "query",
                                "company_id": item.company_id,
                                "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                                "exchange_period_name": item.period_name,
                                "requisition_date": vm.reportHeaderParams.exp_report_date,
                                "from_currency": item.reference_currency_code,
                                "to_currency": item.currency_code,
                                "pagenum": 1,
                                "pagesize": LocalStorageKeys.hec_pagesize,
                                "fetchall": "false"
                            }
                        }));
                    }
                });
                $q.all(reqRateList).then(function (arr) {
                    console.log(arr);
                    angular.forEach(arr,function(res,index){
                        /*console.log(res);
                        console.log(res.data);*/
                        if(res.data.result.totalCount>0){
                            tempImportBooks[index].reference_rate1 = res.data.result.record[0].exchange_rate;
                        }
                    });
                    vm.toImport(tempImportBooks,true,more);
                });
            }

            /**
             * 费用账本导入-导入按钮
             * 说明：将费用导入到我的差旅行程确认中
             */
            function importTravel(more) {
                var importReportFlag = false;
                if(vm.reportHeaderParams.exp_report_type_id){//报销单不关联申请账本导入
                    vm.setSelectExpInfo(more);
                }else{//差旅行程确认账本导入
                    var importBooks =[];//导入的数据
                    angular.forEach(vm.expList,function (item) {
                        if(item.checked == true){
                            var expBook = {
                                "session_user_id":localStorageService.get(LocalStorageKeys.hec_user_id),
                                "expense_id":item.expense_id,
                                "requisition_header_id": vm.confirmTripParams.expReqHeaderId,
                                "_status":"insert"
                            };
                            importBooks.push(expBook);
                        }
                    });
                    vm.toImport(importBooks,importReportFlag,more);
                }
            }

            /**
             * 调用导入接口
             * @param importBooks
             * @param importReportFlag
             * @param more
             */
            function toImport(importBooks,importReportFlag,more) {
                if(importBooks.length === 0){
                    return;
                }else{
                    PublicFunction.showLoading(150);
                    expListService.importToTravel(importBooks,importReportFlag).success(function (data) {
                        if(data.success){
                            if(vm.reportHeaderParams.exp_report_type_id){
                                if(more){
                                    $state.go('app.needReq');
                                }else{
                                    $state.go('app.reportHeader',{headerId:vm.reportHeaderParams.exp_report_header_id});
                                }
                            }else{
                                $state.go('app.confirmTravelTrip');
                            }
                            $ionicLoading.hide();
                        }else if(data.error.message){
                            PublicFunction.showToast(data.error.message);
                        }else{
                            PublicFunction.showToast($filter('translate')('account_js.error.Data.import.failed'));//数据导入失败
                        }
                    }).error(function (error) {
                        PublicFunction.showToast($filter('translate')('error.request'));
                        console.log("导入费用账本请求出错了");
                    });
                }
            }

            /**
             * 页面跳转
             * @param exp 费用对象
             */
            function goPage(exp) {
                if(exp){
                    $state.go('app.createExp',{expenseId:exp.expense_id,companyId:exp.company_id});//跳转到费用详情页
                }else{
                    $state.go('app.createExp'); //跳转至创建账本
                }
            }

            /**
             * 统计被选中的账本
             * @param index
             * @param expense
             */
            function countSelect(index,expense) {
                var num = vm.expenseObjects.indexOf(expense.expense_id);
                if (num > -1) {
                    expense.checked = false;
                    vm.expenseObjects.splice(num, 1);
                    if (vm.selectAll) {
                        vm.selectAll = false;
                    }
                } else {
                    expense.checked = true;
                    vm.expenseObjects.push(expense.expense_id);
                    if (vm.expenseObjects.length === vm.total) {
                        vm.selectAll = true;
                    }
                }
            }

            //费用账本导入-全选按钮
            function selectAllAction() {
                if(vm.selectAll){
                    params.fetchall = true;
                    expListService.initExpList(vm.page ,vm.size,params).then(function (res) {
                        if(res.data.success){
                            if(res.data.result.totalCount>0){
                                var selectedOids = res.data.result.record;
                                angular.forEach(selectedOids,function (item) {
                                    vm.expenseObjects.push(item.expense_id);
                                });
                                angular.forEach(vm.expList,function(item){
                                    if (vm.expenseObjects.indexOf(item.expense_id) > -1) {
                                        item.checked = true;
                                    } else {
                                        item.checked = false;
                                    }
                                });
                            }
                        }
                    });
                }else{
                    //清空expenseObjects
                    vm.expenseObjects = [];
                    //checked状态全部set成false
                    if (vm.expList && vm.expList.length) {
                        angular.forEach(vm.expList,function(item) {
                            item.checked = false;
                        });
                    }
                }
            }

            /**
             * 我的账本-删除费用项
             * @param expense_id  费用ID
             */
            function deleteExpense(expense_id){
                PublicFunction.showLoading(150);
                console.log("===hr:expense_id"+ expense_id);
                expListService.deleteExpense(expense_id).then(function (res) {
                    if(res.data.success){
                        PublicFunction.showToast($filter('translate')('account_is.message.delete.success'));
                        $state.go('app.expList',{},{reload:true});
                    }else if(res.data.error.message){
                        PublicFunction.showToast(res.data.error.message);
                    }else{
                        PublicFunction.showToast($filter('translate')('account_is.message.delete.failed'));
                    }
                }, function (error) {
                    PublicFunction.showToast($filter('translate')('error.request')); //请求出错了
                });
            }

            //页面刷新
            function doRefresh() {
                vm.networkError = false;
                vm.systemError = false;
                vm.page = 0;
                vm.expList = [];
                vm.loadMore(1,true);
                $scope.$broadcast('scroll.refreshComplete');
            }

            $scope.goBack = function () {
                if(vm.isImport){
                    if(vm.reportHeaderParams.exp_report_type_id){
                        if(vm.assReqFlag){
                            $state.go('app.needReq');
                        }else{
                            $state.go('app.reportHeader',{headerId:vm.reportHeaderParams.exp_report_header_id});
                        }
                    }else{
                        $state.go('app.confirmTravelTrip');
                    }
                }else{
                    $state.go('app.tab_erv.homepage');
                }
            };
        }]);
