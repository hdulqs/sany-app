/**
 * Created by Dawn on 2017/8/2.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.createExp', {
                cache: false,
                url: '/createExp',
                params:{
                    expenseId:"",//费用账本查询
                    companyId:"",//费用账本查询
                    assReportFlag:"",//报销单关联费用账本expReport
                    assReqFlag:"",//关联申请
                    reportLineId:""//报销单费用查看
                },
                views: {
                    'page-content@app': {
                        templateUrl: 'scripts/pages/hec/expense_book/my_book/expense/createExp.html',
                        controller: 'createExpCtrl',
                        controllerAs:'vm'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('hecexp.book');
                        $translatePartialLoader.addPart('components');
                        return $translate.refresh();
                    }]
                }
            })
    }])
    .controller('createExpCtrl', ['$scope','$filter','$q','PageValueService','$http','ServiceBaseURL','$ionicPopup','$cordovaDatePicker','$stateParams','LANG','localStorageService',
        'PublicFunction', '$ionicHistory', '$document', 'LocalStorageKeys','Auth', '$state'
        , '$ionicLoading', '$timeout','createExpService','HecexptypeService','HecImageService','$sessionStorage',
        function ($scope,  $filter,$q,PageValueService,$http,ServiceBaseURL,$ionicPopup,$cordovaDatePicker,$stateParams,LANG,localStorageService,PublicFunction,$ionicHistory,
                  $document,LocalStorageKeys, Auth, $state, $ionicLoading, $timeout,createExpService,HecexptypeService,HecImageService,$sessionStorage) {
            var vm = this;
            //参数
            vm.page = 1;
            vm.size = 50;
            vm.title = $filter('translate')('create_expense_js.Create.a.cost');//标题
            vm.view = {}; //视图对象
            var oldObject ={};//查询时对比数据有没有修改
            var saveParams = {};
            vm.isReadOnly =false;//是否为只读
            vm.isReadOnlyInvCate = false;//发票类别为只读
            //上传照片
            vm.attachments = [];//附件
            vm.deleteAttachment = [];//删除附件
            vm.typeName = "exp";
            vm.uploadFinish = true;
            vm.showAddPhoto = false;

            vm.view.expense_id = $stateParams.expenseId;//账本id
            vm.companyId = $stateParams.companyId;
            //报销单创建费用行参数
            vm.assReportFlag = $stateParams.assReportFlag;//判断是否来源于报销单
            vm.assReqFlag = $stateParams.assReqFlag;
            vm.reportLineId = $stateParams.reportLineId;//报销单行id

            //保存更多的标志
            vm.isSaveAndMore = false;
            vm.isSearch = false;
            console.log("当前费用账本id："+ vm.view.expense_id);

            //初始化费用id，以及维度初始化
            vm.initExpID = initExpID;
            vm.initMyBook = initMyBook;
            //报销单初始化
            vm.initReportBook = initReportBook;
            //报销单查询
            vm.searchReportLine = searchReportLine;
            //页面初始化
            vm.initPage = initPage;
            //配置保存信息
            vm.setSaveInfo = setSaveInfo;
            //费用账本保存修改
            vm.save =save;
            //保存并再记一笔
            vm.saveAndMore = saveAndMore;
            //公司切换时获取维度
            vm.getDimensionList = getDimensionList;
            vm.getReportFlexs = getReportFlexs;
            vm.saveReport = saveReport;
            //验证弹性域的必输性
            vm.vaildFlexs = vaildFlexs;
            vm.getRate1 = getRate1;
            vm.toSave = toSave;

            vm.initPage();

            /**
             * 页面初始化
             * 根据是否传递assReportFlag判断
             * false代表：我的账本-创建费用时：调用initMyBook()
             * true代表：报销单-新建费用时:调用initReportBook()
             */
            function initPage() {
                if(vm.assReportFlag){
                    vm.typeName = "erl";
                    vm.reportHeaderParams = PageValueService.get("reportHeaderParams");
                    vm.dimension_name = $filter('translate')('hec_lov.input.dimension.prompt');//设置维度标题默认为项目
                    vm.document_page_type = vm.reportHeaderParams.document_page_type;
                    if(vm.assReqFlag){
                        vm.reqItem = PageValueService.get("reqItem");//报销单导入申请行信息
                    }
                    if(vm.reportLineId){
                        //报销单行查询
                        vm.searchReportLine();
                    }else{
                        //创建费用行
                        vm.initReportBook();
                    }
                    var calendar = new LCalendar();
                    calendar.init({
                        'trigger': '#selectMonth', //标签id
                        'type': 'ym', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
//        'minDate': (new Date().getFullYear()-10) + '-' + 1 + '-' + 1, //最小日期
//        'maxDate': (new Date().getFullYear()) + '-' + 12 + '-' + 31 //最大日期
                    });
                }else{
                    vm.reportHeaderParams = {};
                    //图片上传参数
                    vm.imageHeaderId = vm.view.expense_id;
                    vm.initMyBook();
                }

            }

            //报销单费用行创建初始化
            function initReportBook() {
                PublicFunction.showLoading(150);
                vm.isSearch = false;
                vm.isSaveAndMore = false;
                vm.showAddPhoto = false;
                vm.isReadOnly =false;//是否为只读
                vm.isReadOnlyInvCate = false;//发票类别为只读
                vm.attachments = [];//附件
                vm.deleteAttachment = [];//删除附件
                vm.view ={};
                vm.view.invoice_date = new Date();
                vm.view.tax_type_rate = "";//监听时有作用
                vm.invCateId = "";//清空发票类别的id
                vm.view.exp_report_header_id = vm.reportHeaderParams.exp_report_header_id;//报销单头id
                vm.view.exp_report_type_id = vm.reportHeaderParams.exp_report_type_id;//单据类型id
                vm.view.period_name =new Date(vm.reportHeaderParams.exp_report_date).Format('yyyy-MM');
                vm.view.exchange_rate =vm.reportHeaderParams.exp_report_rate; //收款-本位币汇率
                //公司
                vm.view.company_id= vm.reportHeaderParams.company_id;
                vm.view.company_name = vm.reportHeaderParams.company_name;
                //经办人
                vm.view.employee_id = vm.reportHeaderParams.employee_id;
                vm.view.employee_name = vm.reportHeaderParams.employee_name;
                vm.view.reference_currency_code = vm.reportHeaderParams.exp_report_currency_code//报销类型费用项目中的发票币种默认值为收款币种
                vm.view.currency_code = vm.reportHeaderParams.exp_report_currency_code;//结算币种，不允许修改

                if (vm.view.reference_currency_code != 'RMB') {
                    vm.view.authenticating_flag = 'N';
                    vm.view.invoice_category_desc = $filter('translate')('create_expense_js.other');//发票类别
                    vm.view.invoice_type = "OTHER";
                    vm.view.invoice_category = "OTHER";
                    vm.isReadOnlyInvCate = true;
                }else{
                    vm.isReadOnlyInvCate = false;
                }
                if(vm.assReqFlag){//关联申请创建
                    //部门
                    vm.view.unit_id = vm.reqItem.unit_id;
                    vm.view.unit_name = vm.reqItem.unit_name;
                    vm.view.position_id = vm.reqItem.position_id;
                    vm.view.position_name = vm.reqItem.position_name;
                    //成本中心
                    vm.view.responsibility_center_id = vm.reqItem.responsibility_center_id;
                    vm.view.responsibility_center_name = vm.reqItem.responsibility_center_name;
                    //维度
                    vm.view.d2 = vm.reqItem.d2;
                    vm.view.e2 = vm.reqItem.e2;
                    //事由说明
                    vm.view.notes  = vm.reqItem.description;
                    //费用类型
                    vm.view.expense_type_id = vm.reqItem.expense_type_id;
                    vm.view.exp_req_item_id = vm.reqItem.expense_item_id;
                    vm.view.exp_req_item_name = vm.reqItem.expense_item_desc;
                    vm.view.must_invoice_items =  vm.reqItem.must_invoice_items;
                    //发票-报销金额
                    vm.view.reference_amount = vm.reqItem.req_unrelease_amount;
                    //vm.view.reference_amount = vm.reqItem.requisition_amount;
                    vm.view.reference_rate = 1;
                    vm.view.report_amount = vm.view.reference_amount;

                    vm.view.invoice_category_id = vm.reqItem.invoice_category_id;//发票项目id
                    vm.view.invoice_category_code = vm.reqItem.invoice_category_code;
                    vm.view.invoice_category_name = vm.reqItem.exp_invoice_category;//发票项目

                }else{//不关联申请
                    //部门
                    vm.view.unit_id = vm.reportHeaderParams.unit_id;
                    vm.view.unit_name = vm.reportHeaderParams.unit_name;
                    vm.view.position_id = vm.reportHeaderParams.position_id;
                    //成本中心
                    vm.view.responsibility_center_id = vm.reportHeaderParams.responsibility_center_id;
                    vm.view.responsibility_center_name = vm.reportHeaderParams.responsibility_center_name;
                    //维度
                    vm.view.d2 = vm.reportHeaderParams.value_description;
                    vm.view.e2 = vm.reportHeaderParams.default_dim_value_id;
                    //事由说明
                    vm.view.notes  = vm.reportHeaderParams.exp_report_description;
                }
                if(vm.reportHeaderParams.document_page_type ==='STREAMLINED'){//报销单类型为精简时发票类别默认为其他
                    vm.view.invoice_category_desc = $filter('translate')('create_expense_js.other');
                    vm.view.authenticating_flag = 'N';
                    vm.view.invoice_type = "OTHER";
                    vm.view.invoice_category = "OTHER";
                }
                $ionicLoading.hide();
            }

            function searchReportLine() {
                PublicFunction.showLoading(150);
                vm.isSearch = true;
                vm.showAddPhoto = true;
                createExpService.searchReportLine(vm.reportLineId).then(function (res) {
                    if(res.data.success){
                        var result = res.data.result;
                        if(result.totalCount>0){
                            vm.view = result.record[0];
                            vm.view.exp_report_type_id = vm.reportHeaderParams.exp_report_type_id;
                            vm.imageHeaderId = vm.view.barcode;
                            //加载附件
                            HecImageService.downloadImage("erl", vm.view.barcode).then(function (res) {
                                vm.attachments = res;
                            });
                            //界面上的发票类别：对应了返回数据中invoice_category_name
                            vm.view.invoice_category_desc = vm.view.invoice_category_name;
                            //发票项目
                            vm.view.invoice_category_name = vm.view.exp_invoice_category;
                            vm.view.notes = vm.view.description;
                            vm.view.invoice_date =vm.view.invoice_date?vm.view.invoice_date:new Date();

                            if(vm.view.tax_type_desc){//报销单行查询时字段有差别
                                vm.view.tax_type_rate = vm.view.tax_type_desc;
                            }
                            if(PublicFunction.isNull(vm.view.tax_type_rate)){
                                vm.view.tax_type_rate ="";
                            }
                            if (vm.view.reference_currency_code != 'RMB') {
                                vm.view.authenticating_flag = 'N';
                                vm.view.invoice_category_desc = $filter('translate')('create_expense_js.other');//发票类别
                                vm.view.invoice_type = "OTHER";
                                vm.view.invoice_category = "OTHER";
                                vm.isReadOnlyInvCate = true;
                            }else{
                                vm.isReadOnlyInvCate = false;
                            }

                            if(result.detail.totalCount == 0){
                                vm.view.flexs = [];
                            }else if(result.detail.totalCount == 1){//弹性域查询时有一个值时返回的是对象
                                vm.view.flexs = [];
                                vm.view.flexs.push(result.detail.record);
                            }else{
                                vm.view.flexs = result.detail.record;
                            }

                            if(vm.view.source_type === 'DIDI'){
                                vm.isReadOnly = true;
                                //发票类别-发票币种为外币时不允许修改，默认为其他
                                vm.isReadOnlyInvCate = true;
                            }

                            $scope.originObject = angular.copy(vm.view);
                            //存储查询时获取到的对象
                            oldObject = JSON.stringify(vm.view);
                            $ionicLoading.hide();
                        }
                    }else if(res.data.error.message){
                        PublicFunction.showToast(res.data.error.message);
                    }else{
                        PublicFunction.showToast(res.data.error);
                    }
                },function (error) {
                    PublicFunction.showToast($filter('translate')('error.request'));
                    console.log("查询报销单费用请求失败了");
                });
            }

            /**
             * 页面初始化，根据是否带有费用账本id
             * 判断进行新增还是修改查询
             */
            function initMyBook() {
                PublicFunction.showLoading(150);
                if(!PublicFunction.isNull(vm.view.expense_id)){//查询修改
                    vm.isSearch = true;
                    vm.showAddPhoto = true;
                    vm.view.company_id = $stateParams.companyId;
                    //差旅行程确认头id
                    vm.confirmTripParams =PageValueService.get("confirmTripParams");
                    if(vm.confirmTripParams){
                        vm.expReqHeaderId = vm.confirmTripParams.expReqHeaderId;
                        vm.confirmHeadId  = vm.confirmTripParams.confirmHeadId;
                        vm.expReqTypeCode  = vm.confirmTripParams.expReqTypeCode;
                    }
                    //差旅行程修改页面标题
                    if(vm.expReqHeaderId){
                        vm.title = $filter('translate')('create_expense_js.Cost.details');
                    }
                    //图片下载
                    HecImageService.downloadImage("exp",vm.view.expense_id).then(function (res) {
                        vm.attachments = res;
                    });
                    createExpService.searchExpBook(vm.view.company_id,vm.view.expense_id,vm.page,vm.size).then(function (res) {
                        if(res.data.success){
                            var result = res.data.result;
                            if(result.record){
                                vm.view = result.record[0];
                                vm.view.invoice_date =vm.view.invoice_date?vm.view.invoice_date:new Date();
                                //滴滴费用将页面修改为只读
                                if(vm.view.source_type === 'DIDI'){
                                    vm.isReadOnly = true;
                                    //发票类别-发票币种为外币时不允许修改，默认为其他
                                    vm.isReadOnlyInvCate = true;
                                }
                                if(PublicFunction.isNull(vm.view.tax_type_rate)){
                                    vm.view.tax_type_rate ="";
                                }
                                if (vm.view.reference_currency_code != 'RMB') {
                                    vm.view.authenticating_flag = 'N';
                                    vm.view.invoice_category_desc = $filter('translate')('create_expense_js.other');//发票类别
                                    vm.view.invoice_type = "OTHER";
                                    vm.view.invoice_category = "OTHER";
                                    vm.isReadOnlyInvCate = true;
                                }else{
                                    vm.isReadOnlyInvCate = false;
                                }
                            }

                            //弹性域
                            if(result.flexs.totalCount == 0){
                                vm.view.flexs = [];
                            }else if(result.flexs.totalCount == 1){//弹性域查询时有一个值时返回的是对象
                                vm.view.flexs = [];
                                vm.view.flexs.push(result.flexs.record);
                            }else{
                                vm.view.flexs = result.flexs.record;
                            }

                            //维度
                            if(result.dimensions.totalCount == 0){
                                vm.view.dimensions = [];
                            }else if(result.dimensions.totalCount == 1){//维度获取的时候有一个值时返回的是对象
                                vm.view.dimensions = [];
                                vm.view.dimensions.push(result.dimensions.record);
                            }else{
                                vm.view.dimensions = result.dimensions.record;
                            }
                            $scope.originObject = angular.copy(vm.view);
                            //存储查询时获取到的对象
                            oldObject = JSON.stringify(vm.view);
                            $ionicLoading.hide();
                        }else if(res.data.error.message){
                            PublicFunction.showToast(res.data.error.message);  // 加载失败
                        }else{
                            PublicFunction.showToast(res.data.error);
                        }
                    },function (error) {
                        PublicFunction.showToast($filter('translate')('error.request'));
                        console.log("获取费用账本数据请求失败了");
                    });
                }else{
                    //创建费用
                    var user ={};
                    createExpService.getUserDefault().success(function (data) {
                        if(data.success){
                            if(data.result.record[0]){
                                user = data.result.record[0];
                                //经办人
                                vm.view.employee_id = user.employee_id;
                                vm.view.employee_name = user.employee_name;

                                //公司
                                vm.view.company_id= user.company_id;
                                vm.view.company_name = user.company_name;

                                //部门
                                vm.view.unit_id = user.unit_id;
                                vm.view.unit_name = user.unit_name;
                                vm.view.position_id = user.position_id;

                                //成本中心
                                vm.view.responsibility_center_id = user.responsibility_center_id;
                                vm.view.responsibility_center_name = user.responsibility_center_name;

                                //币种
                                vm.view.currency_code = user.currency_code;
                            }
                        }else if(data.error.message){
                            PublicFunction.showToast(data.error.message);
                        }else{
                            PublicFunction.showToast(data.error);
                        }
                    }).error(function () {
                        PublicFunction.showToast($filter('translate')('error.request'));
                        console.log("获取默认值失败请求失败了");
                    });
                    //发生日期
                    vm.view.bussiness_date = new Date();
                    //业务区间
                    vm.view.period_name = new Date().Format('yyyy-MM');
                    //发票日期
                    vm.view.invoice_date = new Date();

                    //发票类别id
                    vm.invCateId = "";
                    vm.view.tax_type_rate = "";

                    //初始化费用id，以及维度初始化
                    vm.initExpID();
                }
            }

            /**
             * 创建费用-初始化费用账本id以及维度
             */
            function initExpID() {
                createExpService.initExpID().then(function (res) {
                    if(res.data.success){
                        var result = res.data.result;
                        vm.view.expense_id = result.expense_id;
                        vm.view.company_id = vm.view.company_id?vm.view.company_id:localStorageService.get(LocalStorageKeys.hec_company_id);
                        //初始化维度
                        createExpService.initDimension(vm.view.expense_id,vm.view.company_id).then(function (res) {
                            if(res.data.success){
                                console.log("请求成功-初始化费用账本id:"+ vm.view.expense_id +"-初始化维度");
                                vm.getDimensionList();
                                $ionicLoading.hide();
                            }else if(res.data.error.message){
                                PublicFunction.showToast(res.data.error.message);
                                console.log("=="+ vm.view.expense_id +"-初始化维度失败");
                            }else{
                                PublicFunction.showToast(res.data.error);
                            }
                        },function (error) {
                            console.log("维度初始化请求出错了");
                            PublicFunction.showToast($filter('translate')('error.request'));
                        });
                    }else if(res.data.error.message){
                        PublicFunction.showToast(res.data.error.message);
                    }else{
                        PublicFunction.showToast(res.data.error);
                    }
                }, function (error) {
                    console.log("费用账本初始化请求出错了");
                    PublicFunction.showToast($filter('translate')('error.request'));
                });
            }

            /**
             * 维度初始化完成之后获取费用关联的维度名称
             * 维度-系统级，维值-公司级
             */
            function getDimensionList() {
                //获取账本维度列表
                createExpService.getDimensionList(vm.view.company_id,vm.view.expense_id,vm.page,vm.size).success(function (data) {
                    if(data.success){
                        if(data.result.record){
                            vm.view.dimensions = data.result.record;
                            oldObject = JSON.stringify(vm.view);
                        }
                    }else if(data.error.message){
                        PublicFunction.showToast(data.error.message);
                    }else{
                        PublicFunction.showToast(data.error);
                    }
                }).error (function () {
                    PublicFunction.showToast($filter('translate')('error.request'));
                    console.log("获取维度列表请求失败了");
                });
            }

            //验证弹性域必输性
            function vaildFlexs() {
                if(vm.assReportFlag && PublicFunction.isNull(vm.view.d2)){
                    PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.d2'));
                    return false;
                }else{
                    if(Array.isArray(vm.view.dimensions) && vm.view.dimensions.length > 0){
                        for(var i =0;i<vm.view.dimensions.length;i++){
                            if(PublicFunction.isNull(vm.view.dimensions[i].dimension_value_description)){
                                PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.d2'));
                                return false;
                            }
                        }
                    }else{
                        vm.view.dimensions=[];
                    }
                }

                if(Array.isArray(vm.view.flexs) && vm.view.flexs.length > 0){
                    for(var i =0;i<vm.view.flexs.length;i++){
                        if(vm.view.flexs[i].required_flag==='Y' && PublicFunction.isNull(vm.view.flexs[i].value_name)){
                            PublicFunction.showToast(vm.view.flexs[i].flex_name+$filter('translate')('create_expense_js.The.field.must.not.be.empty'));
                            return false;
                        }
                        if(vm.assReportFlag) {
                            vm.view.flexs[i]['session_user_id']= localStorageService.get(LocalStorageKeys.hec_user_id);
                        }else{
                            vm.view.flexs[i]['_status'] = 'update';
                        }
                    }
                }else{
                    vm.view.flexs=[];
                }
                return true;
            }

            /**
             * 我的账本-保存按钮-费用新建，修改保存时数据校验
             * 校验通过之后调用接口请求参数参数配置方法
             */
            function save() {
                //我的账本保存,验证账本信息必输性
                vm.view.bussiness_date = new Date(vm.view.bussiness_date).Format('yyyy-MM-dd');
                vm.view.invoice_date = vm.view.invoice_date?new Date(vm.view.invoice_date).Format('yyyy-MM-dd'):"";
                if(PublicFunction.isNull(vm.view.company_name)&& !vm.assReportFlag){
                    vm.isSaveAndMore = false;
                    PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.company.name'));
                }else if(PublicFunction.isNull(vm.view.unit_name)){
                    vm.isSaveAndMore = false;
                    PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.unit.name'));
                }else if(PublicFunction.isNull(vm.view.responsibility_center_name)){
                    vm.isSaveAndMore = false;
                    PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.resp.name'));
                }else if(PublicFunction.isNull(vm.view.bussiness_date)&&!vm.assReportFlag){
                    vm.isSaveAndMore = false;
                    PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.bussiness.date'));
                }else if(PublicFunction.isNull(vm.view.exp_req_item_name)){
                    vm.isSaveAndMore = false;
                    PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.cost.type'));
                }else if(PublicFunction.isNull(vm.view.reference_rate)) {
                    vm.isSaveAndMore = false;
                    PublicFunction.showToast($filter('translate')('create_expense_js.exchange_rate'));
                }else if(PublicFunction.isNull(vm.view.report_amount)) {
                    vm.isSaveAndMore = false;
                    PublicFunction.showToast($filter('translate')('create_expense_js.Please.input.reim.price'));
                }else if(vm.view.must_invoice_items === 'Y' && vm.reportHeaderParams.document_page_type !='STREAMLINED' && PublicFunction.isNull(vm.view.invoice_category_name)){
                    vm.isSaveAndMore = false;
                    PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.invoice.item'));
                }else if(PublicFunction.isNull(vm.view.invoice_category_desc)){
                    vm.isSaveAndMore = false;
                    PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.invoice.type'));
                }else if(PublicFunction.isNull(vm.view.notes)&&!vm.assReportFlag){
                        vm.isSaveAndMore = false;
                        PublicFunction.showToast($filter('translate')('create_expense_js.Please.input.notes'));
                }else if(vm.view.authenticating_flag == 'Y') {
                    if(PublicFunction.isNull(vm.view.invoice_code)&&  vm.view.invoice_category != 'HIGH-SPEED-TOLL' ){ //&&  vm.view.invoice_category != 'E-INVOICE'
                        vm.isSaveAndMore = false;
                        PublicFunction.showToast($filter('translate')('create_expense_js.Please.input.invoice.code'));
                    }else if(PublicFunction.isNull(vm.view.invoice_number)){
                        vm.isSaveAndMore = false;
                        PublicFunction.showToast($filter('translate')('create_expense_js.Please.input.invoice.number'));
                    }else if(PublicFunction.isNull(vm.view.invoice_date)){
                        vm.isSaveAndMore = false;
                        PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.invoice.date'));
                    }else if(PublicFunction.isNull(vm.view.tax_type_desc) &&  vm.view.invoice_category != 'E-INVOICE'){
                        vm.isSaveAndMore = false;
                        PublicFunction.showToast($filter('translate')('create_expense_js.Please.select.a.rate.type'));
                    }else if(PublicFunction.isNull(vm.view.tax_amount) &&  vm.view.invoice_category != 'E-INVOICE'){
                        vm.isSaveAndMore = false;
                        PublicFunction.showToast($filter('translate')('create_expense_js.Please.input.rate.price'));
                    }else {
                        if(vm.vaildFlexs()){
                            vm.setSaveInfo();
                        }else{
                            vm.isSaveAndMore = false;
                        }
                    }
                }else{
                    //authenticating_flag = 'N',将已填写不需要字段清空
                    vm.view.invoice_code = "";//发票代码
                    vm.view.invoice_number = "";//发票号码
                    vm.view.invoice_date = "";//发票日期
                    vm.view.tax_type_desc = "";//税率描述
                    vm.view.tax_type_rate = "";//税率数值
                    vm.view.tax_type_id = "";//税率id
                    vm.view.tax_amount = "";//税额

                    if(vm.vaildFlexs()){
                        vm.setSaveInfo();
                    }else{
                        vm.isSaveAndMore = false;
                    }
                }
            }

            /**
             * 调用后台接口进行数据的保存
             */
            function setSaveInfo() {
                vm.view.session_user_id = localStorageService.get(LocalStorageKeys.hec_user_id);
               /* if(vm.view.invoice_category_desc === $filter('translate')('create_expense_js.other')){
                    vm.view.authenticating_flag = 'N';
                    vm.view.invoice_type = "OTHER";
                    vm.view.invoice_category = "OTHER";
                }*/
                //清空增值税电子发票不需要填字段的值
                if( vm.view.invoice_category === 'E-INVOICE'){
                    // vm.view.invoice_code ="";
                    vm.view.invoice_date = "";
                    vm.view.tax_type_desc = "";//税率描述
                    vm.view.tax_type_rate = "";//税率数值
                    vm.view.tax_type_id = "";//税率id
                    vm.view.tax_amount = "";
                }
                //清空高速通行不需要填字段的值
                if( vm.view.invoice_category === 'HIGH-SPEED-TOLL'){
                    vm.view.invoice_code ="";
                }
                //如果最后输入的税额不为空则四舍五入
                if(!PublicFunction.isNull(vm.view.tax_amount)){
                    vm.view.tax_amount = vm.view.tax_amount.toFixed(2)*1;
                }
                //报销单新建时状态为insert，修改时为update并且传入exp_report_line_id字段
                if(vm.assReportFlag){
                    //报销单头上字段
                    vm.view.payment_flag = vm.reportHeaderParams.payment_flag;
                    vm.view.payee_category = vm.reportHeaderParams.exp_report_payee_category;//付款对象
                    vm.view.payee_category_name = vm.reportHeaderParams.exp_report_payee_category_name;
                    vm.view.payee_id = vm.reportHeaderParams.exp_report_payee_id;//收款方
                    vm.view.payee_name = vm.reportHeaderParams.exp_report_payee_name;
                    vm.view.payment_type_id = vm.reportHeaderParams.payment_method_id;//收款方式id
                    vm.view.payment_type = vm.reportHeaderParams.exp_report_payment_method;//收款方式名称
                    vm.view.account_name = vm.reportHeaderParams.account_name;
                    vm.view.account_number = vm.reportHeaderParams.account_number;
                    vm.view.finance_amount = vm.view.reference_amount;//发票金额
                    vm.view.finance_rate = vm.view.reference_rate;//发票-收款汇率
                    //本位币收款金额，必须保存字段
                    vm.view.report_functional_amount = ((vm.view.report_amount*vm.view.exchange_rate).toFixed(2))*1;
                    console.log(vm.view.report_functional_amount+"===");
                    vm.view.description = vm.view.notes;
                    if(vm.assReqFlag){
                        vm.view.exp_requisition_dists_id = vm.reqItem.exp_requisition_dists_id;
                        vm.view.exchange_rate_type = vm.reqItem.exchange_rate_type;//固定值
                        vm.view.primary_quantity = vm.reqItem.primary_quantity;//固定值
                        vm.view.exchange_rate_quotation = vm.reqItem.exchange_rate_quotation;//汇率标价法
                    }else{
                        //固定值,非必传
                        vm.view.exchange_rate_type = vm.reportHeaderParams.exchange_rate_type;//"HL001"
                        vm.view.exchange_rate_quotation = vm.reportHeaderParams.exchange_rate_quotation;//汇率标价法
                        vm.view.primary_quantity = 1;//数量
                    }
                    vm.view.price = ((vm.view.report_amount/vm.view.primary_quantity).toFixed(2))*1;//报销金额
                    vm.view.bussiness_date ="";//报销单行不需要保存该字段
                    //根据是否有行id判断是修改还是新建
                    if(vm.view.exp_report_line_id){
                        vm.view._status ='update';
                    }else{
                        vm.view._status ='insert';
                    }
                }else{
                    if(Array.isArray(vm.view.dimensions) && vm.view.dimensions.length > 0){
                        angular.forEach(vm.view.dimensions,function (item) {
                            item['_status'] = 'update';
                        });
                    }else{
                        vm.view.dimensions=[];
                    }
                }
                if(vm.assReportFlag){
                    vm.getRate1(temp).then(function (data) {
                        if(data === 'S'){
                            vm.toSave(saveParams);
                        }
                    });
                }else{
                    var temp = angular.copy(vm.view);
                    if(!PublicFunction.isNull(temp.tax_type_desc)){
                        delete temp.tax_type_desc;
                    }
                    //删除发票类别描述字段，因为%影响后天接口解析请求参数
                    delete temp.invoice_category_desc;
                    saveParams = [temp];
                    vm.toSave(saveParams);
                }
            }

            function toSave(saveParams) {
                PublicFunction.showLoading(150);
                //调用保存费用账本接口
                createExpService.saveExpBook(saveParams,vm.assReportFlag).success(function (data) {
                    if(data.success === false){
                        vm.isSaveAndMore = false;
                        if(data.error.message){
                            PublicFunction.showToast(data.error.message);
                        }else{
                            PublicFunction.showToast(data.error);
                        }
                    }else{
                        if(vm.expReqHeaderId){//差旅行程确认
                            $state.go('app.confirmTravelTrip');
                        }else if(vm.assReportFlag){
                            vm.saveReport(data.result);
                        }else{//我的账本
                            if(vm.isSaveAndMore){
                                vm.isSaveAndMore = false;
                                if($stateParams.expenseId){
                                    $state.go('app.createExp',{expenseId:""});
                                }else{
                                    $state.go('app.createExp',null,{reload:true});
                                }
                            }else{
                                console.log(angular.toJson(data)+"调用保存费用账本接口");
                                $state.go('app.expList');
                            }
                        }
                        $ionicLoading.hide();
                    }
                }).error(function (error) {
                    vm.isSaveAndMore = false;
                    PublicFunction.showToast($filter('translate')('error.request'));
                    console.log("失败信息"+angular.toJson(error));
                });
            }

            function getRate1(temp) {
                var deferred = $q.defer();
                PublicFunction.queryExchangeRate(vm.view.company_id,vm.view.period_name,vm.view.exp_report_date,vm.view.reference_currency_code, vm.view.currency_code).then(function (res) {
                    if(res.data.success){
                        vm.view.reference_rate1 = res.data.result.record[0].exchange_rate;//系统标准汇率
                        var temp = angular.copy(vm.view);
                        if(!PublicFunction.isNull(temp.tax_type_desc)){
                            delete temp.tax_type_desc;
                        }
                        //删除发票类别描述字段，因为%影响后天接口解析请求参数
                        delete temp.invoice_category_desc;
                        saveParams = [temp];
                        deferred.resolve("S");
                    }else{
                        vm.view.reference_rate1 = "";
                        deferred.reject("E");
                    }
                },function (error) {
                    deferred.reject("E");
                });
                return deferred.promise;
            }

            function getReportFlexs(lineId) {
                createExpService.getReportFlex(lineId).then(function (res) {
                    if(res.data.success){
                        if(res.data.result.totalCount>0){//弹性域存在
                            vm.isSaveAndMore = false;
                            vm.view.flexs = res.data.result.record;
                            PublicFunction.showToast($filter('translate')('create_expense_js.maintain.flex'));
                        }else{//弹性域不存在则直接刷新界面
                            if(vm.isSaveAndMore ){
                                if(vm.reportHeaderParams.req_required_flag ==='N'){
                                    vm.initReportBook();
                                }else{
                                    $state.go('app.needReq');
                                }
                            }else{
                                $state.go('app.reportHeader',{headerId:vm.reportHeaderParams.exp_report_header_id});
                            }
                        }
                    }else if(res.data.error.message){
                        vm.isSaveAndMore = false;
                        PublicFunction.showToast(res.data.error.message);
                    }else {
                        vm.isSaveAndMore = false;
                        PublicFunction.showToast(res.data.error);
                    }
                },function (error) {
                    PublicFunction.showToast($filter('translate')('error.request'));
                    console.log("失败信息"+angular.toJson(error));
                });
            }
            //费用报销单的保存与再记一笔
            function saveReport(result) {
                if(vm.isSearch){
                    if(vm.view.flexs.length<=0){
                        vm.getReportFlexs(vm.view.exp_report_line_id);
                    }else{
                        if(vm.isSaveAndMore){
                            if(vm.reportHeaderParams.req_required_flag ==='N'){
                                vm.isSaveAndMore = false;
                                vm.initReportBook();
                            }else{
                                $state.go('app.needReq');
                            }
                        }else{
                            $state.go('app.reportHeader',{headerId:vm.reportHeaderParams.exp_report_header_id});
                        }
                    }
                }else{
                    if(result.record.exp_report_line_id){
                        vm.isSearch = true;
                        vm.showAddPhoto = true;
                        vm.view.exp_report_line_id = result.record.exp_report_line_id;
                        createExpService.searchReportLine(vm.view.exp_report_line_id).then(function (res) {
                            if(res.data.success){
                                var resultData = res.data.result;
                                if(resultData.totalCount>0){
                                    //加载附件
                                    vm.imageHeaderId = resultData.record[0].barcode;
                                    console.log("报销单保存之后获得到的barcode===="+vm.imageHeaderId);
                                    HecImageService.downloadImage("erl", resultData.record[0].barcode).then(function (res) {
                                        vm.attachments = res;
                                    });
                                }
                            }
                        });
                        vm.getReportFlexs(result.record.exp_report_line_id);
                    }
                }
            }

            //当报销单查询的时候动态更新弹性域
            $scope.$watch("vm.view.expense_type_id+vm.view.exp_req_item_id",function (n,o) {
                if(!PublicFunction.isNull(n) && !PublicFunction.isNull(o)){
                    if(vm.isSearch && n!=o){
                        vm.view.flexs =[];
                    }
                }
            });


            //选择时间
            $scope.datePicker = {
                selectDate: function (string) {
                    var itemDate = vm.view.bussiness_date;
                    if (string === 'invoiceDate') {
                        itemDate = vm.view.invoice_date;
                    }
                    var dateOptions = {
                        date: itemDate,
                        mode: 'date',
                        allowOldDates: true,
                        allowFutureDates: true,
                        doneButtonLabel: $filter('translate')('create_expense_js.ok'),//确定
                        doneButtonColor: '#0092da',
                        cancelButtonLabel: $filter('translate')('create_expense_js.cancel'),//取消
                        cancelButtonColor: '#cdcdcd',
                        locale: $sessionStorage.lang //LANG
                    };

                    // 如果费用不是只读,或者是第三方费用,或者是报销单中编辑费用,可以编辑
                    if (!vm.isReadOnly || string === 'expenseDate') {
                        $cordovaDatePicker.show(dateOptions).then(function (date) {
                            if (date) {
                                if (string === 'expenseDate') {
                                    vm.view.bussiness_date = date;
                                } else if (string === 'invoiceDate') {
                                    vm.view.invoice_date = date;
                                }
                                for (var i = 0; i < vm.view.flexs.length; i++) {
                                    if (vm.view.flexs[i].flex_name === string) {
                                        vm.view.flexs[i].value_name = date;
                                        break;
                                    }
                                }
                            }
                        });
                    }
                },
                selectHandDate: function (string) {
                    var date = null;
                    if(string === 'expenseDate' && vm.view.bussiness_date){
                        date = new Date(vm.view.bussiness_date).Format('yyyy-MM-dd');
                    }
                    if(string === 'invoiceDate' && vm.view.invoice_date){
                        date = new Date(vm.view.invoice_date).Format('yyyy-MM-dd');
                    }
                    var success = function (response) {
                        try {
                            if(ionic.Platform.isAndroid()){
                                $scope.result = new Date(response);
                            } else {
                                $scope.result = new Date(response.result);
                            }
                            if (string === 'expenseDate') {
                                vm.view.bussiness_date = $scope.result;
                            }else if (string === 'invoiceDate'){
                                vm.view.invoice_date = $scope.result;
                            }else{
                                for (var i = 0; i < vm.view.flexs.length; i++) {
                                    if (vm.view.flexs[i].flex_name === string) {
                                        vm.view.flexs[i].value_name = $scope.result;
                                        break;
                                    }
                                }
                            }
                            $scope.$apply();

                        } catch (e) {
                        }
                    };
                    var error = function (response) {
                    };
                    if (!vm.isReadOnly || string === 'expenseDate') {
                        if (ionic.Platform.isWebView()) {
                            var startTime = '-';
                            var endTime = '-';
                            var banPick = {};
                            if(date){
                                banPick = { "startTime": startTime, "endTime": endTime, "dates":[], "selectedDate": date };
                            } else {
                                banPick = { "startTime": startTime, "endTime": endTime, "dates":[]};
                            }
                            if($sessionStorage.lang != 'zh_cn'){
                                banPick.language = "en";
                            }
                            HmsCalendar.openCalendar(success, error, 2, banPick);
                        }
                    }
                },
                setMonthInfo: function (val) {
                    var itemDate = vm.view.spending_months;
                    // 如果费用不是只读,或者是第三方费用,或者是报销单中编辑费用,可以编辑
                    if (!vm.isReadOnly) {
                        alert(1);
                        $cordovaDatePicker.show(dateOptions).then(function (date) {
                            alert(2);
                            if (date) {
                                vm.view.spending_months = date;

                            }
                        });
                    }
                },
            };

            /**
             * 页面form表单数据发生修改时提示框
             */
            $scope.isDirtyForm = function () {
                var tempNewObject = angular.copy(vm.view);
                //查询的时候并没有返回该字段
                if(!vm.reportLineId){
                    delete tempNewObject.invoice_category_code;
                }
                if(tempNewObject.source_type=='DIDI' && tempNewObject.invoice_category_id){
                    delete tempNewObject.invoice_category_id;
                }
                if(tempNewObject.source_type=='DIDI' && tempNewObject.invoice_category_name){
                    delete tempNewObject.invoice_category_name;
                }
                angular.forEach(tempNewObject.flexs,function (item) {
                    delete item.$$hashKey;
                });
                angular.forEach(tempNewObject.dimensions,function (item) {
                    delete item.$$hashKey;
                });
                var nowObject =JSON.stringify(tempNewObject);
                /* console.log("旧的数据"+oldObject);
                 console.log("新的数据"+nowObject);*/
                if(oldObject != nowObject){
                    $scope.showPopup();
                }else{
                    $scope.goBack();
                }
            };
            /*
             * 退出提示框
             * */
            $scope.showPopup = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: $filter('translate')('create_expense_js.prompt'),//提示
                    template: $filter('translate')('create_expense_js.Information.not.saved.exit'),//信息未保存,是否退出?
                    cancelText: $filter('translate')('create_expense_js.cancel'),//取消
                    okText: $filter('translate')('create_expense_js.ok'),//确定
                    cssClass: 'delete-ordinary-application-popup'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        $scope.goBack();
                    } else {

                    }
                });
            }
            //保存并再记一笔
            function saveAndMore() {
                vm.isSaveAndMore = true;
                vm.save();
            }

            $scope.goBack = function () {
                if (vm.expReqHeaderId) {
                    $state.go('app.confirmTravelTrip');
                } else if(vm.assReportFlag){
                    if(vm.assReqFlag){
                        $state.go('app.needReq');
                    }else{
                        $state.go('app.reportHeader',{headerId:vm.reportHeaderParams.exp_report_header_id});
                    }
                }else {
                    $state.go('app.expList');
                }
            };

            //监听币种之间的汇率换算（发票-收款）
            $scope.$watch("vm.view.period_name+vm.view.currency_code+vm.view.reference_currency_code+vm.view.reference_amount",function (newValue,oldValue) {
                if (!PublicFunction.isNull(newValue) && !PublicFunction.isNull(oldValue)) {
                    if (newValue != oldValue) {
                        //当发票币种为外币时发票类别默认为其他
                        if (vm.view.reference_currency_code != 'RMB') {
                            vm.view.authenticating_flag = 'N';
                            vm.view.invoice_category_desc = $filter('translate')('create_expense_js.other');//发票类别
                            vm.view.invoice_type = "OTHER";
                            vm.view.invoice_category = "OTHER";
                            vm.isReadOnlyInvCate = true;
                        }else{
                            vm.isReadOnlyInvCate = false;
                        }
                        if(vm.view.currency_code && vm.view.reference_currency_code){
                            if (vm.view.currency_code === vm.view.reference_currency_code) {
                                vm.view.reference_rate = 1;
                                if(vm.view.reference_rate != undefined && vm.view.reference_amount != undefined){
                                    vm.view.report_amount =((vm.view.reference_rate * (vm.view.reference_amount)).toFixed(2))*1;
                                    if(!PublicFunction.isNull(vm.view.tax_type_rate)){
                                        vm.view.tax_amount = ((vm.view.reference_amount/(1+vm.view.tax_type_rate)*vm.view.tax_type_rate).toFixed(2))*1;
                                    }
                                }
                            }else{
                                createExpService.queryExchangeRate(vm.view.company_id,vm.view.period_name,vm.view.reference_currency_code, vm.view.currency_code).then(function (res) {
                                    if(res.data.success){
                                        if(res.data.result.record[0].exchange_rate){
                                            vm.view.reference_rate = res.data.result.record[0].exchange_rate;
                                            if(vm.view.reference_rate != undefined && vm.view.reference_amount != undefined){
                                                vm.view.report_amount =((vm.view.reference_rate * (vm.view.reference_amount)).toFixed(2))*1;
                                                if(!PublicFunction.isNull(vm.view.tax_type_rate)){
                                                    vm.view.tax_amount = ((vm.view.reference_amount/(1+vm.view.tax_type_rate)*vm.view.tax_type_rate).toFixed(2))*1;
                                                }
                                            }
                                            //vm.view.report_amount =((vm.view.reference_rate * (vm.view.reference_amount)).toFixed(2))*1;
                                        }else{
                                            vm.view.reference_rate = "";
                                            vm.view.report_amount ="";
                                            PublicFunction.showToast($filter('translate')('create_expense_js.exchange_rate'));
                                        }
                                    }else {
                                        PublicFunction.showToast(res.data.error.message);
                                        console.log('汇率获取失败:'+res.data.error.message);
                                    }
                                }, function (error) {
                                    console.log("获取汇率请求出错了");
                                    PublicFunction.showToast($filter('translate')('error.request'));
                                });
                            }

                        }
                    }
                }
            });

            //监听切换开支月份汇率赋值（发票-收款）
            $scope.$watch("vm.view.period_name",function (newValue,oldValue) {
                if (!PublicFunction.isNull(newValue) && !PublicFunction.isNull(oldValue)) {
                    if (newValue != oldValue) {
                        if(vm.view.currency_code && vm.view.reference_currency_code){
                            PublicFunction.queryExchangeRate(vm.view.company_id,vm.view.period_name,vm.view.exp_report_date,vm.view.reference_currency_code, vm.view.currency_code).then(function (res) {
                                if(res.data.success){
                                    vm.view.reference_rate = res.data.result.record[0].exchange_rate;//系统标准汇率
                                    // var temp = angular.copy(vm.view);
                                    // if(!PublicFunction.isNull(temp.tax_type_desc)){
                                    //     delete temp.tax_type_desc;
                                    // }
                                    // //删除发票类别描述字段，因为%影响后天接口解析请求参数
                                    // delete temp.invoice_category_desc;
                                    // saveParams = [temp];
                                }else{
                                    vm.view.reference_rate = "";
                                }
                            },function (error) {
                                    console.log("获取汇率请求出错了");
                                    PublicFunction.showToast($filter('translate')('error.request'));
                                });
                            }
                    }
                }
            });

            //监听公司
            $scope.$watch("vm.view.company_id",function (newValue,oldValue) {
                if(!PublicFunction.isNull(newValue)&&!PublicFunction.isNull(oldValue)){
                    if(newValue != oldValue){
                        //费用类型
                        vm.view.exp_req_item_name = "";
                        vm.view.exp_req_item_id = "";
                        vm.view.expense_type_id = "";
                        vm.view.reference_currency_code =  "RMB";//发票币种
                        vm.view.reference_amount ="";
                        //发票项目
                        vm.view.invoice_category_name = "";
                        vm.view.invoice_category_code = "";
                        vm.view.invoice_category_id = "";

                        //发票类别
                        vm.view.authenticating_flag = "";
                        vm.view.invoice_category_desc = "";
                        vm.view.invoice_type = "";
                        vm.view.invoice_category = "";
                        vm.invCateId = "";//发票类别id

                        //明细
                        vm.view.flexs =[];
                        //获取费用账本维度列表
                        vm.view.dimensions=[];
                        //初始化费用id，以及维度初始化
                        vm.initExpID();
                        // vm.getDimensionList();
                    }
                }
            });

            //监听税率计算税额
            $scope.$watch("vm.view.tax_type_rate",function (n,o) {
                if(n != undefined && o != undefined && n != o ){
                    if(vm.view.reference_amount != undefined && vm.view.tax_type_rate != undefined){
                        vm.view.tax_amount = ((vm.view.reference_amount/(1+vm.view.tax_type_rate)*vm.view.tax_type_rate).toFixed(2))*1;
                    }
                }else if (n == 0 && o == ''){
                    if(vm.view.reference_amount != undefined && vm.view.tax_type_rate != undefined){
                        vm.view.tax_amount = ((vm.view.reference_amount/(1+vm.view.tax_type_rate)*vm.view.tax_type_rate).toFixed(2))*1;
                    }
                }
            });

            //监听发生日期，改变业务期间取值
            $scope.$watch("vm.view.bussiness_date",function (n,o) {
                if(!PublicFunction.isNull(n) && !PublicFunction.isNull(o)){
                    if(n!=o){
                        vm.view.period_name = new Date(vm.view.bussiness_date).Format('yyyy-MM');
                    }
                }
            });

            $scope.$watch("vm.view.tax_amount", function (newValue, oldValue) {
                if (!PublicFunction.isNull(newValue) && !PublicFunction.isNull(oldValue)) {
                    var amount = vm.view.tax_amount+"";
                    if(amount.indexOf(".") != -1){
                        vm.view.tax_amount = parseFloat(amount.substring(0,amount.indexOf(".") + 3));
                    }
                }
            })

        }]);
