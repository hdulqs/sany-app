'use strict';
angular.module('huilianyi.services')
    .factory('PatternLockService', ['$q', 'localStorageService',
        function ($q, localStorageService) {
            return {
                getPatternLock: function() {
                    return localStorageService.get('patternLock');
                },
                setPatternLock: function(username, pattern, errorTime) {
                    var patternLocks = this.getPatternLock();
                    if (patternLocks){
                        patternLocks.forEach(function (patternLock, i) {
                            if (username===patternLock.username){
                                patternLocks.splice(i, 1)
                            }
                        });
                    } else {
                        patternLocks = []
                    }

                    patternLocks.push({
                        username: username,
                        patternLock: pattern,
                        errorTime: errorTime
                    });
                    localStorageService.set('patternLock', patternLocks);
                },
                getPatternLockByUsername: function(username) {
                    var patternLocks = this.getPatternLock();
                    for (var index in patternLocks){
                        if (username===patternLocks[index].username){
                            return patternLocks[index].patternLock;
                        }
                    }
                    return null;
                },
                getPatternLockErrorTimeByUsername: function(username) {
                    var patternLocks = this.getPatternLock();
                    for (var index in patternLocks){
                        if (username===patternLocks[index].username){
                            return patternLocks[index].errorTime;
                        }
                    }
                    return null;
                },
                setPatternLockErrorTimeByUsername: function(username, times) {
                    var patternLocks = this.getPatternLock();
                    if (patternLocks){
                        patternLocks.forEach(function (patternLock, i) {
                            if (username===patternLock.username){
                                patternLocks[i].errorTime = times;
                            }
                        });
                    }
                    localStorageService.set('patternLock', patternLocks);
                },
                checkPatternLock: function(username, pattern) {
                    var deferred = $q.defer();
                    var promise = deferred.promise;

                    promise.success = function(fn) {
                        promise.then(fn);
                        return promise;
                    };
                    promise.error = function(fn) {
                        promise.then(null, fn);
                        return promise;
                    };

                    if (pattern == this.getPatternLockByUsername(username)) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }

                    return promise;
                }
            };
        }]);
