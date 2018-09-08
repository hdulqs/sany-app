'use strict';

angular.module('huilianyi.pages')
    .directive('departmentItem', function (RecursionHelper) {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                data: '=',
                callback: '=',
                //判断是否只能选择叶子部门, 0: 默认, 1:只能选择叶子部门
                mode: '=',
                search: '=', //是否是搜索状态
                searchDepartment: '='  //搜索出来的部门的oid
            },
            templateUrl: 'scripts/components/directive/department.item.tpl.html',
            controller: 'com.handchina.huilianyi.department.DepartmentItemController',
            compile: function(element) {
                return RecursionHelper.compile(element);
            }
        }
    })
    .controller('com.handchina.huilianyi.department.DepartmentItemController', [
        '$scope', 'DepartmentService',
        function ($scope, DepartmentService) {
            $scope.expanded = false;
            $scope.level = $scope.data.path.split('|').length - 1;
            $scope.toggleItem = function (department) {
                if ($scope.mode) {
                    //只有叶子节点 可以被选
                    if (!department.hasChildrenDepartments) {
                        $scope.callback(department);
                    }
                } else {
                    $scope.callback(department);
                }
                //获取已启用的子部门
                DepartmentService.getChildrenDepartmentInType(department.departmentOID, 1002)
                    .then(function (data) {
                        department.children = data;
                    });
                $scope.expanded = !$scope.expanded;
            }
        }
    ]);
