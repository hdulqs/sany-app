'use strict';
angular.module('huilianyi.pages')
    .directive('departmentSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: "=?",
                //控制是否只能选择叶子部门
                mode: '=',
                readonly: "=",
                departmentId: '=',
                departmentName: '=',
                //只显示list中包含的根部门
                departmentTopList: '=',
                //是否只显示自己所在的分公司
                ownDep: '='
            },
            templateUrl: 'scripts/components/directive/department.selector.tpl.html',
            controller: 'com.handchina.huilianyi.DepartmentSelectorController'
        }
    })
    .controller('com.handchina.huilianyi.DepartmentSelectorController',
        ['$scope', '$ionicModal', '$sessionStorage', 'DepartmentService', 'PublicFunction', 'ManagerPrompt', 'localStorageService', 'FunctionProfileService',
            function ($scope, $ionicModal, $sessionStorage, DepartmentService, PublicFunction, ManagerPrompt, localStorageService, FunctionProfileService) {
                // 保存带进来的信息
                $scope.isSearch = false;
                $scope.oldData = {
                    copy: function(){
                        $scope.oldData.selected = angular.copy($scope.selected);
                        $scope.oldData.mode = angular.copy($scope.mode);
                        $scope.oldData.readonly = angular.copy($scope.readonly);
                        $scope.oldData.departmentId = angular.copy($scope.departmentId);
                        $scope.oldData.departmentName = angular.copy($scope.departmentName);
                        $scope.oldData.departmentTopList = angular.copy($scope.departmentTopList);
                        $scope.oldData.ownDep = angular.copy($scope.ownDep);
                    },

                    // 恢复带进来的数据
                    resume: function(){
                        $scope.selected = $scope.oldData.selected;
                        $scope.mode = $scope.oldData.mode;
                        $scope.readonly = $scope.oldData.readonly;
                        $scope.departmentId = $scope.oldData.departmentId;
                        $scope.departmentName = $scope.oldData.departmentName;
                        $scope.departmentTopList = $scope.oldData.departmentTopList;
                        $scope.ownDep = $scope.oldData.ownDep;
                    }
                };

                //过滤掉不在departmentTopList列表中的部门
                $scope.filterRootDep = function (depList) {
                    if ($scope.departmentTopList && $scope.departmentTopList.length) {
                        depList = depList.filter (function(item) {
                            return $scope.departmentTopList.indexOf(item.departmentOID) > -1;
                        });
                    }
                    return depList;
                };
                $scope.getParentDepartment = function(departmentOID) {
                    DepartmentService.getDepartmentInfo(departmentOID)
                        .then(function(response) {
                            if (response.data && response.data.parentDepartmentOID) {
                                $scope.getParentDepartment(response.data.parentDepartmentOID);
                            } else {
                                $scope.department.data = [];
                                $scope.department.data.push(response.data);
                                //if ($scope.department.data.length) {
                                //    $scope.department.data = $scope.filterRootDep($scope.department.data);
                                //}
                                return;
                            }
                        });
                };

                $scope.department = {
                    keyword: null,
                    searchByKeywords: function () {
                        if($scope.department.keyword != null && $scope.department.keyword != ''){
                            //搜索已启用部门
                            $scope.isSearch = true;
                            DepartmentService.searchDepartment($scope.department.keyword, 1002)
                                .success(function (data) {
                                    $scope.hideDepartment = [];
                                    if (data && data.length) {
                                        $scope.department.data = $scope.filterRootDep(data);
                                        for(var i = 0; i < $scope.department.data.length; i++){
                                            if($scope.hideDepartment.indexOf($scope.department.data[i].departmentOID) == -1){
                                                $scope.hideDepartment.push($scope.department.data[i].departmentOID)
                                            }
                                        }
                                    } else {
                                        $scope.department.data = [];
                                    }
                                })
                        } else {
                            //获取已启用根部门
                            $scope.isSearch = false;
                            DepartmentService.getRootDepartment(1002)
                                .then(function (data) {
                                    $scope.hideDepartment = []
                                    if (data && data.length) {
                                        $scope.department.data = $scope.filterRootDep(data);
                                    } else {
                                        $scope.department.data = [];
                                    }
                                })
                        }
                    },
                    openDialog: function () {
                        if ($scope.readonly) {
                            return;
                        }
                        // 保存带进来的信息
                        $scope.oldData.copy();
                        this.modal.show();
                        $scope.isSearch = false;
                        //适用非跨部门报销的场景 只能查看到所在分公司的部门
                        if ($scope.ownDep) {
                            //此时会忽略top属性里存在的部门
                            $scope.getParentDepartment($scope.departmentId);
                        } else {
                            //获取已启用根部门
                            DepartmentService.getRootDepartment(1002).then(function (data) {
                                if (data && data.length) {
                                    $scope.department.data = $scope.filterRootDep(data);
                                } else {
                                    $scope.department.data = [];
                                }
                            });
                        }

                        $scope.history = [];
                        $scope.historyOIDs = $sessionStorage.historyDepartment ? $sessionStorage.historyDepartment : [];
                        $scope.historyOIDs.forEach(function (item) {
                            DepartmentService.getDepartmentInfo(item.departmentOID)
                                .then(function (response) {
                                    response.data.modifiedDate = item.modifiedDate;
                                    $scope.history.push(response.data);
                                });
                        });

                        // 获取部门经理OID
                        if ($scope.selected){
                            DepartmentService.getDepartmentInfo($scope.selected.departmentOID).then(function (response) {
                                $scope.selected.managerOID = response.data.managerOID;
                            });
                        }

                    },
                    selectDepartment: function (department) {
                        $scope.selected = department;
                        $scope.departmentName = department.path;
                        $scope.departmentId = department.departmentOID;
                        if ($sessionStorage.historyDepartment) {
                            var historyList = $sessionStorage.historyDepartment;
                            for (var i = 0; i < historyList.length; i++) {
                                if (historyList[i].departmentOID === department.departmentOID) {
                                    historyList[i].modifiedDate = (new Date()).Format('yyyy-MM-dd hh:mm:ss');
                                    break;
                                }
                            }
                            $sessionStorage.historyDepartment = historyList;
                        }
                    },
                    submitDepartment: function () {
                        var department = {};
                        if ($scope.selected) {
                            FunctionProfileService.getFunctionProfileList().then(function (data) {
                                $scope.functionProfileList = data;
                                //审批模式未启用新的审批模式时，并且公司配置为部门审批： 所选择部门没有经理,提示错误信息
                                if (!$scope.functionProfileList['approval.rule.enabled'] && localStorageService.get('company.configuration').data.configuration.approvalRule.approvalMode === 1002 && !$scope.selected.managerOID) {
                                    PublicFunction.showToast(ManagerPrompt);
                                    return
                                }
                                if (!$sessionStorage.historyDepartment) {
                                    var history = [];
                                    department.departmentOID = $scope.selected.departmentOID;
                                    department.modifiedDate = (new Date()).Format('yyyy-MM-dd hh:mm:ss');
                                    history.push(department);
                                    $sessionStorage.historyDepartment = history;
                                } else {
                                    var num = 0;
                                    for (; num < $sessionStorage.historyDepartment.length; num++) {
                                        if ($sessionStorage.historyDepartment[num].departmentOID === $scope.selected.departmentOID) {
                                            break;
                                        }
                                    }
                                    if (num === $sessionStorage.historyDepartment.length) {
                                        department.departmentOID = $scope.selected.departmentOID;
                                        department.modifiedDate = (new Date()).Format('yyyy-MM-dd hh:mm:ss');
                                        if ($sessionStorage.historyDepartment.length >= 3) {
                                            $sessionStorage.historyDepartment.splice(0, 1);
                                            $sessionStorage.historyDepartment.push(department);
                                        } else {
                                            $sessionStorage.historyDepartment.push(department);
                                        }
                                    }
                                }
                                $scope.department.modal.hide();
                            })
                        }
                    },
                    // 取消部门选择
                    cancelDepartment: function(){
                        // 恢复带进来的信息
                        $scope.oldData.resume();

                        this.modal.hide();
                    }
                };
                $ionicModal.fromTemplateUrl('department.selector.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    $scope.department.modal = modal;
                });

            }])
    .filter('departmentPathFilter', function () {
        return function (value) {
            if (!value) {
                return null;
            }
            var deps = value.split('|');
            if (deps.length > 3) {
                var first = deps[0];
                var last = deps.pop();
                var lastTwo = deps.pop();
                return first + ' > ... > ' + lastTwo + ' > ' + last;
            } else {
                return deps.join(' > ');
            }
        }
    })
    .filter('departmentPath', function () {
        return function (value) {
            if (!value) {
                return null;
            }
            var deps = value.split('|');
            return deps.join(' > ');
        }
    });
