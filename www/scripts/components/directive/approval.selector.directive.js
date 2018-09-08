/**
 * Created by Yuko on 16/8/8.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('approvalSelector', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                maxLength: '=',
                styleClass: '@',
                readonly: '=',
                callback: '='
            },
            templateUrl: 'scripts/components/directive/approval.selector.directive.tpl.html',
            controller: 'com.handchina.huilianyi.ApprovalSelectorController'
        }
    }])
    .controller('com.handchina.huilianyi.ApprovalSelectorController', ['$scope', '$ionicModal', 'UserService', 'ParseLinks', '$ionicLoading','$filter',
        function ($scope, $ionicModal, UserService, ParseLinks, $ionicLoading,$filter) {

            $scope.view = {
                selectedUserOID: [],
                selectingUsers: [],
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                openApprovalChainDialog: function () {
                    $scope.approvalSelector.show();
                    $scope.view.selectedUserOID = [];
                    $scope.view.selectingUsers = [];
                    $scope.users.allUsers.get.data = [];
                    if ($scope.selected) {
                        for (var i = 0; i < $scope.selected.length; i++) {
                            var user = $scope.selected[i];
                            $scope.view.selectingUsers.push(user);
                            $scope.view.selectedUserOID.push(user.userOID);
                        }
                    }
                    $scope.users.loadMore(0);
                },
                closeApprovalChainDialog: function () {
                    $scope.approvalSelector.hide();
                    $scope.selected = $scope.view.selectingUsers;
                    if ($scope.callback) {
                        $scope.callback($scope.view.selectingUsers);
                    }
                },
                removeUserFromChain: function (user) {
                    var tobeDeletedIndex = -1;

                    for (var i = 0; i < $scope.view.selectingUsers.length; i++) {
                        var u = $scope.view.selectingUsers[i];
                        if (user.userOID === u.userOID) {
                            tobeDeletedIndex = i;
                        }
                    }
                    if (tobeDeletedIndex !== -1) {
                        $scope.view.selectingUsers.splice(tobeDeletedIndex, 1);
                        $scope.view.selectedUserOID.splice(tobeDeletedIndex, 1);
                    } else {
                    }

                }

            };
            $scope.users = {
                isSearching: false,
                openSearchUserResultPanel: function () {
                    $scope.users.isSearching = true;
                },
                selectUser: function (user) {
                    $scope.users.isSearching = false;
                    if ($scope.view.selectedUserOID.length === $scope.maxLength
                        && $scope.view.selectedUserOID.indexOf(user.userOID) === -1) {
                        $scope.view.openWarningPopup($filter('translate')('directive_js.Can.only.choose') + $scope.maxLength + $filter('translate')('directive_js.An.approver'));//最多只能选择  位审批人
                        //alert('最多只能选择' + $scope.maxLength + '位审批人');
                        return;
                    }
                    if ($scope.view.selectedUserOID.indexOf(user.userOID) === -1) {
                        $scope.view.selectingUsers.push(user);
                        $scope.view.selectedUserOID.push(user.userOID);
                    }

                },
                allUsers: {
                    lastPage: 0,
                    firstPage: 0,
                    get: {
                        page: 0,
                        size: 10,
                        links: null,
                        data: []
                    }

                },
                search: {
                    keyword: null
                },
                loadAllUsers: function (page) {
                    $scope.users.allUsers.firstPage = page;
                    $scope.users.allUsers.get.page = page;
                    UserService.getAllUsers($scope.users.allUsers.get.page, $scope.users.allUsers.get.size)
                        .success(function (data, status, headers) {
                            $scope.users.allUsers.get.links = ParseLinks.parse(headers('link'));
                            $scope.users.allUsers.lastPage = $scope.users.allUsers.get.links.last;
                            for (var i = 0; i < data.length; i++) {
                                $scope.users.allUsers.get.data.push(data[i]);
                            }

                        }).finally(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    });
                },
                searchUsers: function (page) {
                    $scope.users.allUsers.firstPage = page;
                    $scope.users.allUsers.get.page = 0;
                    var lastSearchTIme = $scope.users.allUsers.search.lastSearchTime;
                    var now = new Date().getTime();
                    if (lastSearchTIme !== null && now - lastSearchTIme < 200) {
                        return;
                    } else {
                        $scope.users.allUsers.search.lastSearchTime = now;
                    }
                    $scope.users.allUsers.search.page = page;
                    UserService.searchUser($scope.users.search.keyword, page, $scope.users.allUsers.search.size)
                        .success(function (data, status, headers) {
                            $scope.users.allUsers.search.links = ParseLinks.parse(headers('link'));
                            $scope.users.allUsers.lastPage = $scope.users.allUsers.search.links.last;
                            for (var i = 0; i < data.length; i++) {
                                $scope.users.allUsers.search.data.push(data[i]);
                            }
                            //$scope.users.allUsers.search.data = data;
                        })
                        .finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        })
                    ;
                },
                loadMore: function (page) {
                    if(page === 0){
                        $scope.users.allUsers.get.data = [];
                    }
                    $scope.users.allUsers.get.page = page;
                    if ($scope.users.search.keyword === null || $scope.users.search.keyword === '') {
                        UserService.getAllUsers(page, $scope.users.allUsers.get.size)
                            .success(function (data, status, headers) {
                                $scope.users.allUsers.get.links = ParseLinks.parse(headers('link'));
                                $scope.users.allUsers.lastPage = $scope.users.allUsers.get.links.last;
                                for (var i = 0; i < data.length; i++) {
                                    $scope.users.allUsers.get.data.push(data[i]);
                                }
                            }).finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });
                    } else {
                        UserService.searchUser($scope.users.search.keyword, page, $scope.users.allUsers.get.size)
                            .success(function (data, status, headers) {
                                $scope.users.allUsers.get.links = ParseLinks.parse(headers('link'));
                                $scope.users.allUsers.lastPage = $scope.users.allUsers.get.links.last;
                                for (var i = 0; i < data.length; i++) {
                                    $scope.users.allUsers.get.data.push(data[i]);
                                }
                            }).finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        });
                    }
                }
            };

            $scope.$watch('users.search.keyword', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.users.loadMore(0);
                }
            });


            $ionicModal.fromTemplateUrl('approval.selector.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.approvalSelector = modal;
            });
        }]);
