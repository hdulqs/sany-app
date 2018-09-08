'use strict';

angular.module('huilianyi.services')
    .factory('DepartmentService', ['$http', '$q', '$sessionStorage', '$localStorage', 'ServiceBaseURL',
        function ($http, $q, $sessionStorage, $localStorage, ServiceBaseURL) {
            return {
                getCompanyRootDepartment: function () {
                    var deferred = $q.defer();
                    var rootDepartments = $sessionStorage.rootDepartments;
                    if (!rootDepartments) {
                        $http.get(ServiceBaseURL.url + '/api/departments/root')
                            .success(function (data) {
                                $sessionStorage.rootDepartments = data;
                                deferred.resolve(data);
                            });
                    } else {
                        deferred.resolve(rootDepartments);
                    }
                    return deferred.promise;
                },
                //根据flag 获取不同的根部门： 1001  全部， 1002 已启用，  1003  已停用
                getRootDepartment: function (flag) {
                    var deferred = $q.defer();
                    var rootEnableDepartments = $sessionStorage.rootEnableDepartments;
                    if (!rootEnableDepartments) {
                        $http({
                            url: ServiceBaseURL.url + '/api/departments/root',
                            method: 'GET',
                            params: {
                                flag: flag
                            }
                        }).success(function (data) {
                                $sessionStorage.rootEnableDepartments = data;
                                deferred.resolve(data);
                            });
                    } else {
                        deferred.resolve(rootEnableDepartments);
                    }
                    return deferred.promise;
                },
                //获取子部门： 全部(1001), 1002启用, 1003 未启用
                getChildrenDepartmentInType: function (parentDepartmentOID, flag) {
                    var deferred = $q.defer();
                    var childrenEnableDepartments = $sessionStorage.childrenEnableDepartments;
                    if (childrenEnableDepartments && childrenEnableDepartments[parentDepartmentOID]) {
                        deferred.resolve(childrenEnableDepartments[parentDepartmentOID]);
                    } else {
                        $http({
                            url: ServiceBaseURL.url + '/api/department/child/' + parentDepartmentOID,
                            method: 'GET',
                            params: {
                                flag: flag
                            }
                        }).success(function (data) {
                            if (!childrenEnableDepartments) {
                                $sessionStorage.childrenEnableDepartments = {}
                            }
                            $sessionStorage.childrenEnableDepartments[parentDepartmentOID] = data;
                            deferred.resolve(data);
                        })
                            .error(function (error) {
                                deferred.reject('get.children.department.error')
                            })
                    }
                    return deferred.promise;
                },
                getChildrenDepartments: function (parentDepartmentOID) {
                    var deferred = $q.defer();
                    var departmentCache = $sessionStorage.childrenDepartments;
                    if (departmentCache && departmentCache[parentDepartmentOID]) {
                        deferred.resolve(departmentCache[parentDepartmentOID]);
                    } else {
                        $http.get(ServiceBaseURL.url + '/api/department/child/' + parentDepartmentOID)
                            .success(function (data) {
                                if (!departmentCache) {
                                    $sessionStorage.childrenDepartments = {}
                                }
                                $sessionStorage.childrenDepartments[parentDepartmentOID] = data;
                                deferred.resolve(data);
                            })
                            .error(function (error) {
                                deferred.reject('get.children.department.error')
                            })
                    }

                    return deferred.promise;
                },
                getDepartmentSelectionHistory: function () {
                    return $localStorage.departmentHistory;
                },
                saveDepartmentSelectionHistory: function (department) {
                    if (!$localStorage.departmentHistory) {
                        $localStorage.departmentHistory = [];
                    }
                    $localStorage.departmentHistory.unshift(department);
                    if ($localStorage.departmentHistory.length > 3) {
                        $localStorage.departmentHistory.pop();
                    }
                },
                getDepartmentInfo: function (departmentOID) {
                    return $http.get(ServiceBaseURL.url + '/api/departments/' + departmentOID);
                },
                searchDepartment: function (name, flag) {
                    return $http({
                        url: ServiceBaseURL.url + '/api/department/like',
                        method: 'GET',
                        params: {
                            name: name,
                            flag: flag
                        }
                    });
                }
            }
        }])
