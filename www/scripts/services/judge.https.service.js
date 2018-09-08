/**
 * Created by lizhi on 16/12/28.
 */
'use strict';

angular.module('huilianyi.services')
    .factory('JudgeHttpsService', ['$http', 'ServiceBaseURL', '$q',
        function ($http, ServiceBaseURL, $q) {
            return {
                judgeHttps: function(){
                    var def = $q.defer();
                    var url = ServiceBaseURL.url;

                    $http.get(ServiceBaseURL.url + "/api/system/https/enabled")
                        .success(function(data){
                            def.resolve(data ? "https:" + ServiceBaseURL.url.split(":")[1] : ServiceBaseURL.url);
                        })
                        .error(function(){
                            def.resolve(ServiceBaseURL.url);
                        });
                    return def.promise;
                }
            }
        }]);
