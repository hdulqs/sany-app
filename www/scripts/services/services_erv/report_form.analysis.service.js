'use strict';
angular.module('huilianyi.services')
    .factory('reportFormService', ['$http', 'ServiceBaseURL', function ($http, ServiceBaseURL) {
        return {
            //个人
            getAccountIndividual: function (changeURL) {
                var url = ServiceBaseURL.url + changeURL;
                return $http.get(url);
            },
            //项目经理下的项目
            getAllProjects: function () {
                return $http.get(ServiceBaseURL.url + '/api/my/cost/centers/by_manage');
            },
            //项目下统计,人员,类别
            projectsTypes: function (url) {
                return $http.get(url);
            },
            //部门列表
            getDepartments: function () {
                return $http.get(ServiceBaseURL.url + '/api/my/department/by_manage');
            },
            //部门下统计,人员,类别
            departmentTypes: function (url) {
                return $http.get(url);
            },
            leadTypes: function (url) {
                return $http.get(url);
            }
        }
    }]);
