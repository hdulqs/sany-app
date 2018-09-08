/**
 * 类型：lov
 * 费用账本--费用类型(与费用项目级联)
 * Created by changyu.duan on 2017/8/15.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('hecexptypeSelector', function () {
        return {
            restrict: 'E',
            scope: {
                expenseId: '@',
                expReportTypeId:'@',//报销单单据类型id
                companyId:'=',
                employeeId:'=',
                expValue:'=',//发票金额
                expTypeId:'=',
                expItemName:'=',//费用项目
                expItemId:'=',
                refCryCode:'=',//发票币种
                mustInvoiceItems:'=',//判断发票项目是否必输
                flexes:'=',//弹性域集合
                readonly: '='

            },
            templateUrl: 'scripts/components/hec/exptype/hecexptype.selector.directive.tpl.html',
            controller: 'com.handchina.hly.dialog.HecexptypeSelectorController',
            resolve: {
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        }
    })
    .controller('com.handchina.hly.dialog.HecexptypeSelectorController', [
        '$scope', '$http', '$ionicModal', '$state','$q','$ionicLoading', 'HecexptypeService', '$sessionStorage','$filter', 'PublicFunction','LocalStorageKeys',
        function ($scope, $http, $ionicModal,$state,$q,$ionicLoading, HecexptypeService, $sessionStorage,$filter, PublicFunction,LocalStorageKeys) {

            $scope.typePrompt = $filter('translate')('hec_lov.type.prompt');
            $scope.isRed =true;

            $scope.searchKeyword = {
                value:""
            };
            $scope.expItemTypeId = {
                value:""
            };
            $scope.cryCode= {
                value:""
            };
            $scope.currency ={
                value:$scope.expValue
            };
            $scope.nothing =false;
            $scope.page = 1;
            $scope.size = LocalStorageKeys.hec_pagesize;

            //费用项目列表
            $scope.exptypes = [];
            //背景层
            $scope.isShowKeyboard =false;

            $scope.isReadOnly = false;

            var memoryObject = {};

            $scope.view ={
                isUpdate:false,
                equational:'',
                hasCalculate: false,
                isSymbol: false,
                firstEnter: true,
                hasNumber: false,
                push: function (text) {
                    if (text === '+' || text === '-' || text === 'x' || text === '/') {
                        $scope.view.equational = $scope.expense.amount.toString();
                        $scope.view.hasCalculate = false;
                        $scope.view.isZero = false;
                        $scope.view.isNum = false;
                        if ($scope.view.isSymbol) {
                            $scope.view.equational = $scope.view.equational.substring(0, $scope.view.equational.length);
                            $scope.view.equational += text;

                        } else {
                            $scope.view.isSymbol = true;
                            $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                            try {
                                $scope.expense.amount = eval($scope.view.equal);
                                $scope.view.equational = $scope.expense.amount + text;
                            } catch (error) {
                                $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.amount')/*请输入合法的金额*/);
                            }
                        }
                    }
                    else {
                        if (text === '.') {
                            if ($scope.view.equational === '' || $scope.view.equational === null || $scope.view.equational.substr($scope.view.equational.length - 1) === '.') {
                                $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.expression')/*请输入合法的表达式*/);
                            } else {
                                $scope.view.isSymbol = false;
                                $scope.view.hasNumber = true;
                                $scope.view.isZero = false;
                                if ($scope.view.hasCalculate) {
                                    $scope.view.equational = text;
                                    $scope.expense.amount = parseInt($scope.view.equational);
                                    $scope.view.hasCalculate = false;
                                } else {
                                    $scope.view.equational += text;
                                    if ($scope.view.firstEnter) {
                                        $scope.expense.amount = $scope.view.equational;
                                    }
                                }
                            }
                        } else if (text === '0') {
                            if ($scope.view.isZero) {
                                $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.expression')/*请输入合法的表达式*/);
                            } else {
                                if ($scope.view.equational === '' || $scope.view.equational === null || $scope.view.isSymbol) {
                                    $scope.view.isZero = true;
                                }
                                $scope.view.isSymbol = false;
                                $scope.view.hasNumber = true;
                                if ($scope.view.hasCalculate) {
                                    $scope.view.equational = text;
                                    $scope.expense.amount = parseInt($scope.view.equational);
                                    $scope.view.hasCalculate = false;
                                } else {
                                    $scope.view.equational += text;
                                    if ($scope.view.firstEnter) {
                                        $scope.expense.amount = parseInt($scope.view.equational);
                                    }
                                }
                            }
                        } else {
                            if ($scope.view.isZero) {
                                $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.expression')/*请输入合法的表达式*/);
                            } else {
                                $scope.view.isSymbol = false;
                                $scope.view.hasNumber = true;
                                $scope.view.isZero = false;
                                if ($scope.view.hasCalculate) {
                                    $scope.view.equational = text;
                                    $scope.expense.amount = parseInt($scope.view.equational);
                                    $scope.view.hasCalculate = false;
                                } else {
                                    $scope.view.equational += text;
                                    if ($scope.view.firstEnter) {
                                        $scope.expense.amount = parseInt($scope.view.equational);
                                    }
                                }
                            }
                        }
                    }
                },
                clear: function () {
                    $scope.view.equational = '';
                    $scope.expense.amount = 0;
                    $scope.view.hasCalculate = true;
                    $scope.view.isZero = false;
                    $scope.view.firstEnter = true;
                },
                clearOne: function () {
                    if ($scope.view.equational.length > 0) {
                        $scope.view.equational = $scope.view.equational.substring(0, $scope.view.equational.length - 1);
                        if ($scope.view.isSymbol) {
                            $scope.view.isSymbol = false;
                        }
                    }
                },
                calculate: function () {
                    if ($scope.view.isSymbol) {

                    } else {
                        $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                        try {
                            $scope.expense.amount = eval($scope.view.equal);
                            if (!isFinite($scope.expense.amount)) {
                                //请输入合法的表达式
                                $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.expression'));
                                return
                            }
                            $scope.view.hasCalculate = true;
                        } catch (error) {
                            //请输入合法的金额
                            $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.amount'));
                        }
                    }
                },
                //验证输入是否合法
                validateData: function () {
                    var deferred = $q.defer();
                    if (PublicFunction.isNull($scope.expItemId)) {
                        /*请选择费用类型*/
                        $scope.view.openWarningPopup($filter('translate')('hec_lov.please.select.the.type.of.cost'));
                        $scope.view.isSymbol = false;
                        deferred.reject(false);
                    } else if (!isFinite($scope.expense.amount)) {
                        /*请输入合法的金额*/
                        $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.amount'));
                        $scope.view.isSymbol = false;
                        deferred.reject(false);
                    } else if ($scope.expense.amount <= 0) {
                        /*请输入合法的金额*/
                        $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.amount'));
                        $scope.view.isSymbol = false;
                        deferred.reject(false);
                    } else {
                        deferred.resolve(true);
                    }
                    return deferred.promise;
                },
                calculationOver: function () {

                    if ($scope.view.isSymbol) {
                        //请输入合法的金额
                        $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.amount'));
                    } else {
                        if ($scope.view.equational === null || $scope.view.equational === '') {
                            $scope.view.validateData().then(function () {
                                $scope.view.equational = '';
                                $scope.view.hasCalculate = false;
                                $scope.view.isSymbol = false;
                                $scope.expValue = $scope.expense.amount;
                                if(memoryObject.expItemId !=$scope.expItemId || memoryObject.expTypeId != $scope.expTypeId){
                                    if(PublicFunction.isNull($scope.expReportTypeId)){
                                        $scope.initFlex();
                                    }
                                }
                                $scope.view.goBack();
                            });
                        } else {
                            if (!$scope.view.firstEnter) {
                                $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                                try {
                                    //费用输入的金额
                                    $scope.expense.amount = eval($scope.view.equal);
                                    $scope.view.validateData().then(function () {
                                        $scope.view.equational = '';
                                        $scope.view.hasCalculate = false;
                                        $scope.view.isSymbol = false;
                                        $scope.view.firstEnter = true;
                                        $scope.expValue = $scope.expense.amount;
                                        if(memoryObject.expItemId !=$scope.expItemId || memoryObject.expTypeId != $scope.expTypeId){
                                            if(PublicFunction.isNull($scope.expReportTypeId)){
                                                $scope.initFlex();
                                            }
                                        }
                                        $scope.view.goBack();
                                        //$scope.modal.hide();
                                    });
                                } catch (error) {
                                    /*请输入合法的金额*/
                                    $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.amount')
                                    );
                                }
                            } else {
                                $scope.view.equal = $scope.view.equational.replace(/x/g, "*");
                                try {
                                    $scope.expense.amount = eval($scope.view.equal);
                                    $scope.view.validateData().then(function () {
                                        $scope.view.equational = '';
                                        $scope.view.hasCalculate = false;
                                        $scope.view.isSymbol = false;
                                        $scope.expValue = $scope.expense.amount;
                                        if(memoryObject.expItemId !=$scope.expItemId ||memoryObject.expTypeId != $scope.expTypeId){
                                            if(PublicFunction.isNull($scope.expReportTypeId)){
                                                $scope.initFlex();
                                            }
                                        }
                                        $scope.view.goBack();
                                        //$scope.modal.hide();
                                    });
                                } catch (error) {
                                    /*请输入合法的金额*/
                                    $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.amount')
                                    );
                                }
                            }
                        }

                    }
                },
                //提示消息
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                goBack: function () {
                    try {
                        $scope.expense.amount = eval($scope.expense.amount);
                        if ($scope.expense.amount > 0) {
                            $scope.expense.amount = $scope.expense.amount.toFixed(2);
                            $scope.modal.hide();
                        } else {
                            $scope.expense.amount = 0;
                            $scope.view.equational = '';
                            $scope.view.isZero = false;
                            /*请输入合法的金额*/
                            $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.amount'));
                        }
                    } catch (error) {
                        $scope.expense.amount = 0;
                        $scope.view.equational = '';
                        /*请输入合法的金额*/
                        $scope.view.openWarningPopup($filter('translate')('hec_lov.please.enter.a.valid.amount'));
                    }
                }

            };

            $ionicModal.fromTemplateUrl('hecexpense.type.selector.dialog.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.changeDialog = function (expense) {
                $scope.view.firstEnter = true;
                $scope.expense={
                    amount:expense*1
                };
                $scope.view.equational = $scope.expense.amount.toString();
                $scope.view.hasCalculate = true;
                $scope.view.isUpdate = true;
                $scope.modal.show();
                $scope.loadMore(1);
            };

            $scope.openDialog = function () {
                $scope.nothing = false;
                //费用项目列表
                $scope.exptypes = [];
                $scope.searchKeyword.value = "";
                //背景层
                $scope.isShowKeyboard =false;
                //发票币种
                if(!$scope.refCryCode) {
                    $scope.refCryCode = "RMB";
                    $scope.cryCode= {
                        value:"RMB"
                    };
                }else{
                    $scope.cryCode= {
                        value:$scope.refCryCode
                    };
                }
                if($scope.expValue){
                    //记忆原始值
                    memoryObject = {
                        expTypeId: $scope.expTypeId,
                        expItemName:$scope.expItemName,
                        expItemId:$scope.expItemId,
                        expValue:$scope.expValue,
                        refCryCode:$scope.refCryCode,//发票币种
                        mustInvoiceItems:$scope.mustInvoiceItems,
                        flexes:$scope.flexes
                    };
                    $scope.view.isUpdate = true;
                    $scope.changeDialog($scope.expValue);
                }else{
                    $scope.expense={
                        amount: 0,//费用最终保存的金额
                        currencyCode: $scope.cryCode.value//费用的币种
                    };
                    $scope.view.isUpdate = false;
                    memoryObject = {
                        expTypeId: $scope.expTypeId,
                        expItemName:$scope.expItemName,
                        expItemId:$scope.expItemId,
                        expValue:$scope.expValue,
                        refCryCode:$scope.refCryCode,//发票币种
                        mustInvoiceItems:$scope.mustInvoiceItems,
                        flexes:$scope.flexes
                    };
                    $scope.modal.show();
                    $scope.view.firstEnter = true;
                    $scope.view.isZero = false;
                    $scope.loadMore(1);
                }
            };

            $scope.selectItem = function (expType,expItem) {
                $scope.expTypeId = expType.expense_type_id;
                $scope.expItemId = expItem.expense_item_id;
                $scope.expItemName = expItem.expense_item_description;
                $scope.mustInvoiceItems = expItem.must_invoice_items;
                console.log($scope.refCryCode);
                $scope.isShowKeyboard = true;
            };


            $scope.$watch(function () {
                return $scope.cryCode.value;
            },function (n,o) {
                if(!PublicFunction.isNull(n) && !PublicFunction.isNull(o)){
                    if(n!=o){
                        $scope.refCryCode = $scope.cryCode.value;
                    }
                }
            });

            $scope.searchExptype = function () {
                $scope.nothing = false;
                $scope.exptypes = [];
                $scope.loadMore(1);
            };


            $scope.loadMore = function (page) {
                $scope.nothing = false;
                PublicFunction.showLoading(150);
                $scope.page = page;
                if(page === 0){
                    $scope.exptypes = [];
                    $scope.nothing = true;
                }
                var q = HecexptypeService.searchKeywords($scope.searchKeyword.value,$scope.companyId,$scope.employeeId,$scope.expReportTypeId, page, $scope.size);
                q.then(function (res) {
                    if(res.data.success === true){
                        $scope.lastPage = res.data.result.pageCount;
                        if($scope.lastPage>0){
                            $scope.total = res.data.result.totalCount;
                            var record = res.data.result.record;
                            var expTypeSize = $scope.exptypes.length;

                            /*
                             * 分页时：判断上一页最后的报销类型是否与这一页开头相同，若相同则追加到上一个报销类型中
                             */
                            if(expTypeSize!=0){
                                //取已显示数据的最后一条
                                var lastExpType = $scope.exptypes[expTypeSize-1];
                                // console.log("pageLastExpType:"+angular.toJson(lastExpType));
                                //报销类型ID
                                var lastExpTypeId = lastExpType.expense_type_id;
                                // console.log("expense_type_id:"+lastExpTypeId);
                                //费用项目list
                                var lastList =   lastExpType.list;
                                // console.log("pageLastExpType:"+angular.toJson(lastList));
                            }else{
                                var lastExpTypeId = -1;
                                var lastList = [];
                            }

                            //定义转换后的报销类型集合formatList
                            var formatList = [];
                            //定义报销类型对象formatType
                            var formatType = {};
                            //定义费用项目集合list
                            var list = [];
                            for (var i = 0;i <  record.length; i++) {
                                var type = record[i];
                                //1.判断判断上一页最后的报销类型是否与这一页开头相同
                                if(type['expense_type_id']==lastExpTypeId){
                                    var item = {};
                                    item['expense_item_id'] = type['expense_item_id'];
                                    item['expense_type_id'] = type['expense_type_id'];
                                    item['expense_item_code'] = type['expense_item_code'];
                                    item['expense_item_description'] = type['expense_item_description'];
                                    item['type_item_description'] = type['type_item_description'];
                                    item['expense_item_types_id'] = type['expense_item_types_id'];
                                    item['must_invoice_items'] = type['must_invoice_items'];
                                    lastList.push(item);
                                }else{
                                    //2.
                                    var tempType =  -1;
                                    if(i != 0){
                                        tempType = record[i-1]['expense_type_id'];
                                    }
                                    //2.1报销类型id与上一条记录相同时，将费用项目附加到上一条的list中
                                    if(type['expense_type_id'] == tempType){
                                        //定义费用项目对象item
                                        var item = {};
                                        item['expense_item_id'] = type['expense_item_id'];
                                        item['expense_type_id'] = type['expense_type_id'];
                                        item['expense_item_code'] = type['expense_item_code'];
                                        item['expense_item_description'] = type['expense_item_description'];
                                        item['type_item_description'] = type['type_item_description'];
                                        item['expense_item_types_id'] = type['expense_item_types_id'];
                                        item['must_invoice_items'] = type['must_invoice_items'];
                                        list.push(item);
                                    }else{//2.2报销类型id与上一条记录不相同时，则重新新增一条记录
                                        list = [];
                                        formatType = {};
                                        formatType['expense_type_id'] = type['expense_type_id'];
                                        formatType['expense_type_description'] = type['expense_type_description'];
                                        formatType['expense_type_code'] = type['expense_type_code'];

                                        //定义费用项目对象item
                                        var item = {};
                                        item['expense_item_id'] = type['expense_item_id'];
                                        item['expense_type_id'] = type['expense_type_id'];
                                        item['expense_item_code'] = type['expense_item_code'];
                                        item['expense_item_description'] = type['expense_item_description'];
                                        item['type_item_description'] = type['type_item_description'];
                                        item['expense_item_types_id'] = type['expense_item_types_id'];
                                        item['must_invoice_items'] = type['must_invoice_items'];
                                        list.push(item);
                                        formatType["list"] = list;
                                        formatList.push(formatType);
                                    }
                                }

                            }
                            $scope.exptypes = $scope.exptypes.concat(formatList);
                        }else{
                            $scope.nothing = true;
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        $ionicLoading.hide();
                    }else{
                        PublicFunction.showToast($filter('translate')('hec_lov.load.cost.type.data.failed'));//加载费用类型数据失败
                    }
                }, function (error) {
                    PublicFunction.showToast($filter('translate')('error.request'));
                    console.log("获取费用类型请求出错了");
                });

            };


            //保存时初始化弹性域、费用类型补充明细
            $scope.initFlex = function () {
                HecexptypeService.bookInitFlexs($scope.expenseId,$scope.expTypeId,$scope.expItemId).then(function (data) {
                    if(data.success){
                        HecexptypeService.bookFlexs($scope.expenseId).success(function (res) {
                            if(res.success){
                                if(res.result.record){
                                    var flexs = res.result.record;
                                    $scope.flexes = flexs;
                                }else{
                                    $scope.flexes = [];
                                }
                            }else{
                                PublicFunction.showToast($filter('translate')('hec_lov.flexfield.loading.failed'));  // 弹性域加载失败
                            }
                            $scope.modal.hide();
                        }).error( function (res) {
                            console.log("获取弹性域失败了");
                            PublicFunction.showToast($filter('translate')('error.request'));
                        });
                    }else{
                        PublicFunction.showToast($filter('translate')('hec_lov.flexfield.initialization.failed'));  // 弹性域初始化失败
                    }
                }, function (data) {
                    console.log("弹性域初始化请求出错了");
                    PublicFunction.showToast($filter('translate')('error.request'));
                });
            }


            $scope.showKeyboard= function () {
                $scope.isShowKeyboard = !$scope.isShowKeyboard;
            }

            $scope.cancel = function () {
                $scope.selected = memoryObject.selected;
                $scope.expItemName=  memoryObject.expItemName;
                $scope.expItemId =   memoryObject.expItemId;
                $scope.expTypeId = memoryObject.expTypeId;
                $scope.refCryCode = memoryObject.refCryCode;//发票币种
                $scope.mustInvoiceItems= memoryObject.mustInvoiceItems;
                $scope.expValue = memoryObject.expValue;
                $scope.flexes = memoryObject.flexes;
                $scope.modal.hide();
            }

            $scope.clear = function () {
                $scope.nothing = false;
                $scope.searchKeyword.value = "";
                $scope.exptypes = [];
                $scope.loadMore(1);
            }

        }
    ]);
