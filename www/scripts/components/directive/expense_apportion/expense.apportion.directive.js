/**
 * 费用分摊directive
 *
 * Created by lizhi on 17/4/11.
 */
angular.module('huilianyi.pages')
    .directive('expenseApportion', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                expense: '=',   // 费用数据
                readonly: '=',  // 是否只读
                expenseReportData: '=',  // 报销单数据
                currencyCode: '=',     // 费用币种,本来应该用expense.invoiceCurrencyCode,但是多币种单独用了这个.
                originCurrencyCode: '='     // 公司本位币
            },
            templateUrl: 'scripts/components/directive/expense_apportion/expense.apportion.directive.tpl.html',
            controller: 'com.handchina.hly.ExpenseApportionController'
        }
    }])
    .controller('com.handchina.hly.ExpenseApportionController',
        ['$scope', '$ionicModal', '$ionicLoading', '$ionicPopup', '$ionicScrollDelegate','$filter', 'SelfDefineExpenseReport',
            'Principal', 'PublicFunction', '$location', '$ionicPlatform', 'FunctionProfileService',
        function ($scope, $ionicModal, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $filter, SelfDefineExpenseReport,
                  Principal, PublicFunction, $location, $ionicPlatform, FunctionProfileService) {

            // 费用分摊编辑modal定义
            $ionicModal.fromTemplateUrl('expense.apportion.modal.tpl.html', {
                scope: $scope,
                animation: 'slide-in-up',
                backdropClickToClose: false,    // 点击空白不关闭modal
                hardwareBackButtonClose: false  // 安卓物理返回键不直接关闭modal,单独处理
            }).then(function (modal) {
                $scope.modal = modal;
            });

            // 费用编辑modal定义
            $ionicModal.fromTemplateUrl('expense.amount.modal.tpl.html', {
                scope: $scope,
                animation: 'slide-in-right',
                backdropClickToClose: false,    // 点击空白不关闭modal
                hardwareBackButtonClose: false  // 安卓物理返回键不直接关闭modal,单独处理
            }).then(function (modal) {
                $scope.amountModal.modal = modal;
            });

            // 页面提示信息
            $scope.promptMessage = {
                moreThanZero: $filter('translate')('expenseApportion.message.moreThanZero'),  // 分摊金额必须大于0
                noLessZero: $filter('translate')('expenseApportion.message.noLessZero'),   // 分摊金额不能有负 请重新编辑
                noLeft: $filter('translate')('expenseApportion.message.noLeft'),   // 已无可分摊金额
                emptyError: $filter('translate')('expenseApportion.message.emptyError'),   // 有未填写完整的分摊信息
                noMoreThan: $filter('translate')('expenseApportion.message.noMoreThan')   //分摊金额不能大于
            };

            // 输入金额modal
            $scope.amountModal = {
                modal: null,
                amount: 0,      // 计算出来的金额
                equational: 0,   // 输入的表达式
                apportionIndex: -1, // 对应分摊的index

                // 安卓物理返回键时的操作
                backButton: {
                    // 处理逻辑
                    handle: function() {
                        $scope.amountModal.cancel();
                    },

                    // 监听返回键
                    listen: function() {
                        $ionicPlatform.onHardwareBackButton(this.handle);
                    },

                    // 取消监听
                    cancelListen: function() {
                        $ionicPlatform.offHardwareBackButton(this.handle);
                    }
                },

                // 点击输入金额的OK按钮,处理成功时执行的函数
                finish: function() {
                    var leftAmount = 0;     // 剩余金额

                    // 输入金额必须大于0
                    if(this.amount<=0) {
                        $scope.view.showToast($scope.promptMessage.moreThanZero);
                    } else {
                        // 保存费用及计算默认分摊金额,保留两位小数
                        $scope.expense.expenseApportion[this.apportionIndex].amount = Number(this.amount).toFixed(2);
                        $scope.view.calculateDefaultAmount();
                        this.apportionIndex = -1;
                        this.closeModal();
                    }
                },

                /**
                 * 打开输入金额modal
                 * @param index 点击的费用对应分摊的index
                 */
                openModal: function(index) {
                    var apportion = $scope.expense.expenseApportion[index];     // 对应的分摊

                    // 相关数据处理
                    this.apportionIndex = index;
                    this.amount = apportion.amount;
                    this.equational = "";

                    // 打开modal
                    this.modal.show();
                    // 取消上一层modal返回键监听
                    $scope.view.backButton.cancelListen();
                    // 监听返回键
                    this.backButton.listen();
                },

                // 取消输入,恢复输入前的值
                cancel: function() {
                    this.closeModal();
                    this.apportionIndex = -1;
                },

                // 关闭modal
                closeModal: function() {
                    this.modal.hide();
                    // 取消当前返回键监听
                    this.backButton.cancelListen();
                    // 监听上一层modal返回键
                    $scope.view.backButton.listen();
                }
            };

            $scope.view = {
                functionProfileList: null,
                oldApportion: null,     // 保存初始的分摊数据

                // 1500毫秒的提示
                showToast: function(text) {
                    PublicFunction.showToast(text, 1500);
                },

                // 页面滚动到对应的item
                scrollToItem: function(index) {
                    $location.hash('item'+index);
                    $ionicScrollDelegate.anchorScroll(true);
                },

                /**
                 * 计算剩余的分摊金额
                 * @param index 需要排除计算的分摊index
                 * @returns {number} 剩余的分摊金额
                 */
                calculateLeftAmount: function(index) {
                    var totalAmount = $scope.expense.amount,
                        apportions = $scope.expense.expenseApportion,
                        amount = totalAmount,
                        i;

                    for(i=1; i<apportions.length; i++) {
                        // 如果有index,去除index对应的分摊的金额
                        if(index!==i) {
                            amount = amount - apportions[i].amount;
                        }
                    }

                    return amount;
                },

                // 计算默认分摊的分摊金额
                calculateDefaultAmount: function() {
                    var apportions = $scope.expense.expenseApportion,
                        amount = this.calculateLeftAmount(0);
                    // 计算出来的amount可能是null
                    amount = amount ? amount : 0;
                    apportions[0].amount = Number(amount).toFixed(2);
                },

                // 判断分摊是否改变
                handleChange: function() {
                    var i,
                        j,
                        expenseApportion = $scope.expense.expenseApportion;

                    // 如果分摊的数量改变
                    if(expenseApportion.length!==this.oldApportion.length) {
                        return true;
                    }

                    for(i=0; i<expenseApportion.length; i++) {
                        // 判断相关人和金额是否改变
                        if(expenseApportion[i].relevant.userOID!==this.oldApportion[i].relevantPerson ||
                            expenseApportion[i].amount!==this.oldApportion[i].amount) {

                            return true
                        }

                        // 判断成本中心是否改变
                        for(j=0; j<expenseApportion[i].costCenterItems.length; j++) {
                            if(expenseApportion[i].costCenterItems[j].costCenterItemOID!==
                                this.oldApportion[i].costCenterItems[j].costCenterItemOID) {

                                return true
                            }
                        }
                    }

                    return false
                },

                // 验证数据.验证通过返回true
                validate: function() {
                    var i,
                        j,
                        isCostCenterValid,       // 成本中心是否有任一必填或者是否有任一不为空
                        expenseApportion = $scope.expense.expenseApportion,
                        defaultApportion = expenseApportion[0];

                    // 如果默认金额小于0,提示信息并跳到顶部
                    if(defaultApportion.amount<0) {
                        this.showToast($scope.promptMessage.noLessZero);
                        return false;
                    }

                    for(i=0; i<expenseApportion.length; i++) {
                        // 保存相关人信息.由于相关人默认会取报销单申请人,所以不会为空
                        expenseApportion[i].relevantPerson = expenseApportion[i].relevant.userOID;
                        expenseApportion[i].personName = expenseApportion[i].relevant.fullName;
                        expenseApportion[i].personAvatar = expenseApportion[i].relevant.avatar;
                        isCostCenterValid = false;

                        // 判断金额是否为空或者0,是则提示信息,并滚动到对应的item
                        if(!expenseApportion[i].amount) {
                            this.showToast($scope.promptMessage.emptyError);
                            this.scrollToItem(i);
                            return false;
                        }

                        // 判断必填的成本中心是否为空,是则提示信息,并滚动到对应的item
                        for(j=0; j<expenseApportion[i].costCenterItems.length; j++) {
                            if(expenseApportion[i].costCenterItems[j].required &&
                                !expenseApportion[i].costCenterItems[j].costCenterItemOID) {

                                this.showToast($scope.promptMessage.emptyError);
                                this.scrollToItem(i);
                                return false;
                            }
                            // 判断成本中心是否有任一必填或者是否有任一不为空
                            if(expenseApportion[i].costCenterItems[j].required ||
                                expenseApportion[i].costCenterItems[j].costCenterItemOID) {

                                isCostCenterValid = true;
                            }
                        }
                        // 如果成本中心都为非必填,并且都为空,则提示信息,并滚动到对应的item
                        if(!isCostCenterValid) {
                            this.showToast($scope.promptMessage.emptyError);
                            this.scrollToItem(i);
                            return false;
                        }
                    }

                    return true
                },

                // 分摊modal初始化
                modalInit: function() {
                    // 相关人信息
                    angular.forEach($scope.expense.expenseApportion, function(expenseApportion) {
                        expenseApportion.relevant = {
                            fullName: expenseApportion.personName,
                            userOID: expenseApportion.relevantPerson,
                            avatar: expenseApportion.personAvatar
                        }
                    });

                    // 保存初始的分摊数据
                    this.oldApportion = angular.copy($scope.expense.expenseApportion);
                    // 初始化分摊是否改变标志
                    this.isApportionChanged = false;
                },

                // 安卓物理返回键时的操作
                backButton: {
                    // 处理逻辑
                    handle: function() {
                        $scope.view.cancel();
                    },

                    // 监听返回键
                    listen: function() {
                        $ionicPlatform.onHardwareBackButton(this.handle);
                    },

                    // 取消监听
                    cancelListen: function() {
                        $ionicPlatform.offHardwareBackButton(this.handle);
                    }
                },

                // 打开编辑分摊modal
                openModal: function() {
                    if($scope.readonly) {
                        return
                    }

                    // modal初始化
                    $scope.view.modalInit();
                    // 打开modal
                    $scope.modal.show();

                    // 监听返回键
                    this.backButton.listen();
                },

                // 关闭编辑分摊modal
                cancel: function() {

                    var _closeModal = function() {
                        // 关闭modal
                        $scope.modal.hide();
                        // 滚动到顶部
                        $ionicScrollDelegate.scrollTop(true);

                        // 撤销监听返回键
                        $scope.view.backButton.cancelListen();
                    };

                    if(this.handleChange()) {
                        // 弹框提示是否退出
                        // 提示分摊金额改变
                        var alertPopup = $ionicPopup.confirm({
                            title: $filter('translate')('expenseApportion.message.popupTitle'),   // 提示
                            template: $filter('translate')('expenseApportion.message.noSave'),  // 数据尚未保存, 是否返回
                            cancelText: $filter('translate')('expenseApportion.message.stay'), // 留在当页
                            cancelType: "button-left",
                            okText: $filter('translate')('expenseApportion.message.backButton'), // 返回
                            cssClass: "expense-amount-popup"
                        });
                        alertPopup.then(function(result) {
                            if(result) {
                                // 返回
                                // 恢复初始的分摊数据
                                $scope.expense.expenseApportion = $scope.view.oldApportion;
                                // 关闭modal
                                _closeModal();
                            } else {
                                // 留在当页
                            }
                        });
                    } else {
                        // 返回
                        // 关闭modal
                        _closeModal();
                    }
                },

                // 新增分摊
                addApportion: function() {
                    var expenseApportion = $scope.expense.expenseApportion,     // 分摊数据
                        defaultApportion = expenseApportion[0],     // 默认分摊
                        // 新建的分摊
                        apportion = {
                            "amount": null,
                            "costCenterItems": [],
                            "relevantPerson": $scope.expenseReportData.applicantOID,
                            "personName": $scope.expenseReportData.applicantName,
                            "personAvatar": "",
                            "relevant": null,
                            "defaultApportion": false
                        }
                        ;

                    // 判断默认分摊金额是否为0,提示信息
                    if(Number(defaultApportion.amount)===0) {
                        this.showToast($scope.promptMessage.noLeft);
                        return
                    }

                    // 验证相关数据
                    if(!this.validate()) {
                        return
                    }

                    // 处理相关人控件需要的数据
                    apportion.relevant = {
                        fullName: apportion.personName,
                        userOID: apportion.relevantPerson,
                        avatar: apportion.personAvatar
                    };
                    // 处理成本中心
                    angular.forEach(defaultApportion.costCenterItems, function(costCenterItem) {
                        var item = {
                            fieldName: costCenterItem.fieldName,
                            costCenterOID: costCenterItem.costCenterOID,
                            costCenterItemName: "",
                            costCenterItemOID: "",
                            required: costCenterItem.required
                        };
                        apportion.costCenterItems.push(item);
                    });

                    // 添加到分摊中
                    expenseApportion.push(apportion);

                    // 页面滚动到底部
                    $ionicScrollDelegate.scrollBottom(true);
                },

                // 删除分摊
                delete: function(index) {
                    $scope.expense.expenseApportion.splice(index, 1);
                    // 重新计算默认分摊金额
                    this.calculateDefaultAmount();
                },

                // 确认
                confirm: function() {
                    // 验证相关数据
                    if(!this.validate()) {
                        return
                    }

                    $scope.modal.hide();
                    // 滚动到顶部
                    $ionicScrollDelegate.scrollTop(true);
                }
            };

            // 获取functionProfileList
            FunctionProfileService.getFunctionProfileList().then(function(data) {
                $scope.view.functionProfileList = data;

                // 相关人字段: 相关人或者收款人
                $scope.relevantFiledName = data['expense.apportion.payee.enabled'] ?
                    $filter('translate')('expenseApportion.payee') : $filter('translate')('expenseApportion.relevantPerson');

            }, function() {});

            // 监听输入的金额变化
            $scope.$watch('amountModal.amount', function() {
                // 如果小数点大于2位,四舍五入只取两位
                var amountSplit = $scope.amountModal.amount ? $scope.amountModal.amount.toString().split('.') : [];
                if(amountSplit.length>1 && amountSplit[1].length>2) {
                    $scope.amountModal.amount = Number($scope.amountModal.amount).toFixed(2);
                }
            });
        }])
;
