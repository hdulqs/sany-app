'use strict';
angular.module('huilianyi.pages')
    .directive('approvalChainSelector', function () {
        return {
            restrict: 'E',
            scope: {
                selected: '=',
                maxLength: '=',
                styleClass: '@',
                readonly: '=',
                callback: '='
            },
            templateUrl: 'scripts/components/directive/approval.chain.selector.tpl.html',
            controller: 'com.handchina.huilianyi.ApprovalChainSelectorController'
        }
    })
    .controller('com.handchina.huilianyi.ApprovalChainSelectorController', [
        '$scope', '$ionicModal', 'UserService', 'ParseLinks', '$ionicLoading',
        function ($scope, $ionicModal, UserService, ParseLinks, $ionicLoading) {
            $scope.approvalChain = {
                selectedUserOID: [],
                selectingUsers: [],
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                openApprovalChainDialog: function () {
                    this.modal.show();
                    $scope.approvalChain.selectedUserOID = [];
                    $scope.approvalChain.selectingUsers = [];
                    $scope.users.allUsers.get.data=[];
                    $scope.users.allUsers.search.data=[];
                    if ($scope.selected) {
                        for (var i = 0; i < $scope.selected.length; i++) {
                            var user = $scope.selected[i];
                            $scope.approvalChain.selectingUsers.push(user);
                            $scope.approvalChain.selectedUserOID.push(user.userOID);
                        }
                    }
                    $scope.users.loadMore(0);
                },
                closeApprovalChainDialog: function () {
                    this.modal.hide();
                    $scope.selected = $scope.approvalChain.selectingUsers;
                    if ($scope.callback) {
                        $scope.callback($scope.approvalChain.selectingUsers);
                    }
                },
                removeUserFromChain: function (user) {
                    var tobeDeletedIndex = -1;

                    for (var i = 0; i < $scope.approvalChain.selectingUsers.length; i++) {
                        var u = $scope.approvalChain.selectingUsers[i];
                        if (user.userOID === u.userOID) {
                            tobeDeletedIndex = i;
                        }
                    }
                    if (tobeDeletedIndex !== -1) {
                        $scope.approvalChain.selectingUsers.splice(tobeDeletedIndex, 1);
                        $scope.approvalChain.selectedUserOID.splice(tobeDeletedIndex, 1);
                    } else {
                    }

                }

            };
            $scope.users = {
                isSearching: false,
                openSearchUserResultPanel : function () {
                    this.isSearching = true;
                },
                selectUser: function (user) {
                    this.isSearching = false;
                    if ($scope.approvalChain.selectedUserOID.length === $scope.maxLength
                        && $scope.approvalChain.selectedUserOID.indexOf(user.userOID) === -1) {
                        $scope.approvalChain.openWarningPopup($filter('translate')('value_tpl.onlyChoose') + $scope.maxLength + $filter('translate')('value_tpl.Approver'));//最多只能选择--位审批人
                        return;
                    }
                    if ($scope.approvalChain.selectedUserOID.indexOf(user.userOID) === -1) {
                        $scope.approvalChain.selectingUsers.push(user);
                        $scope.approvalChain.selectedUserOID.push(user.userOID);
                    }

                },
                allUsers: {
                    lastPage:0,
                    firstPage:0,
                    get: {
                        page: 0,
                        size: 10,
                        links: null,
                        data:[]
                    },
                    search: {
                        lastSearchTime: null,
                        page: 0,
                        size: 10,
                        links: null,
                        data: []

                    }
                },
                search:{
                    keyword:null
                },
                loadAllUsers: function (page) {
                    $scope.users.allUsers.firstPage=page;
                    this.allUsers.get.page = page;
                    UserService.getAllUsers(this.allUsers.get.page, this.allUsers.get.size)
                        .success(function (data, status, headers) {
                            $scope.users.allUsers.get.links = ParseLinks.parse(headers('link'));
                            $scope.users.allUsers.lastPage=$scope.users.allUsers.get.links.last;
                            for(var i=0;i<data.length;i++){
                                $scope.users.allUsers.get.data.push(data[i]);
                            }

                        }).finally(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');

                    });
                },
                searchUsers: function (page) {
                    $scope.users.allUsers.firstPage=page;
                    this.allUsers.get.page = 0;
                    var lastSearchTIme = $scope.users.allUsers.search.lastSearchTime;
                    var now = new Date().getTime();
                    if (lastSearchTIme !== null && now - lastSearchTIme < 200) {
                        return;
                    } else {
                        $scope.users.allUsers.search.lastSearchTime = now;
                    }
                    this.allUsers.search.page = page;
                    UserService.searchUser($scope.users.search.keyword, page, this.allUsers.search.size)
                        .success(function (data, status, headers) {
                            $scope.users.allUsers.search.links = ParseLinks.parse(headers('link'));
                            $scope.users.allUsers.lastPage= $scope.users.allUsers.search.links .last;
                            for(var i=0;i<data.length;i++){
                                $scope.users.allUsers.search.data.push(data[i]);
                            }
                            //$scope.users.allUsers.search.data = data;
                        })
                        .finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                        })
                    ;
                },
                loadMore:function(page){
                    $scope.users.allUsers.search.data = [];
                    if($scope.users.search.keyword === null || $scope.users.search.keyword === ''){
                        $scope.users.loadAllUsers(page);
                    } else {
                        $scope.users.searchUsers(page);
                    }
                    //if(this.isSearching){
                    //    this.searchUsers(page);
                    //}else{
                    //    this.loadAllUsers(page);
                    //}
                    //if (!$scope.users.search.keyword && this.isSearching) {
                    //    this.isSearching = false;
                    //    this.loadAllUsers(page);
                    //}
                }
            };

            $scope.$watch('users.search.keyword', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.users.loadMore(0)
                }
            });

            // init modal
            $ionicModal.fromTemplateUrl('approval.chain.selector.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.approvalChain.modal = modal;
            });
        }
    ])
    .filter('approvalChainDisplay', function () {
        return function (users) {
            if (users && users.length > 0) {
                var result = '';
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    result += user.fullName;
                    result += ', ';
                }
                return result.substring(0, result.length - 2);
            } else {
                return null;
            }
        }
    });
