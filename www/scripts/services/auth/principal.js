'use strict';

angular.module('huilianyi.services')
    .factory('Principal', function Principal($q, Account, $cacheFactory, ServiceBaseURL, localStorageService) {
        var _identity,
            _authenticated = false;

        return {
            isIdentityResolved: function () {
                return angular.isDefined(_identity);
            },
            isAuthenticated: function () {
                return _authenticated;
            },
            hasAuthority: function (authority) {
                if (!_authenticated) {
                    return $q.when(false);
                }

                return this.identity().then(function(_id) {
                    return _id.authorities && _id.authorities.indexOf(authority) !== -1;
                }, function(err){
                    return false;
                });
            },
            hasAnyAuthority: function (authorities) {
                if (!_authenticated || !_identity || !_identity.authorities) {
                    return false;
                }

                for (var i = 0; i < authorities.length; i++) {
                    if (_identity.authorities.indexOf(authorities[i]) !== -1) {
                        return true;
                    }
                }

                return false;
            },
            authenticate: function (identity) {
                _identity = identity;
                _authenticated = identity !== null;
            },
            identity: function (force) {
                var deferred = $q.defer();

                if (force === true) {
                    _identity = undefined;
                    //非常重要，如果是true，需要清空缓存，这样才会发送请求，如果不是true，只获取缓存
                    var httpCache = $cacheFactory.get('$http');
                    httpCache.remove(ServiceBaseURL.url + '/api/account');
                }

                // check and see if we have retrieved the identity data from the server.
                // if we have, reuse it by immediately resolving
                if (angular.isDefined(_identity)) {
                    deferred.resolve(_identity);

                    return deferred.promise;
                }

                if (!force){
                //    如果force不是true，并且缓存里面已经有了，则优先从localstorage里面获取缓存
                    var identitySaved = localStorageService.get('identity');
                    if (identitySaved && identitySaved.companyOID && identitySaved.userOID){
                        //如果变量存在，并且结构正确，则直接返回
                        _identity = identitySaved;
                        _authenticated = true;
                        deferred.resolve(identitySaved);
                        return deferred.promise;
                    }
                }

                // retrieve the identity data from the server, update the identity object, and then resolve.
                Account.getAccount()
                    .then(function (account) {
                        _identity = account.data;
                        _authenticated = true;
                        //把identity放在localstorage里面作为缓存，下一次再重新从localstorage里面获取，不去后台拿。只有当force==true和退出重新登录的时候再重新获取
                        localStorageService.set('identity', _identity);
                        deferred.resolve(_identity);
                    })
                    .catch(function() {
                        _identity = null;
                        _authenticated = false;
                        deferred.resolve(_identity);
                    });
                return deferred.promise;
            },
            changeAvatar: function (avatarURL) {
                if (_identity) {
                    _identity.filePath = avatarURL;
                }
            }
        };
    });
