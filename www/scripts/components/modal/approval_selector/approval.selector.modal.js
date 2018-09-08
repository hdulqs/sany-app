/**
 * Created by Yuko on 16/8/9.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('approvalSelectorModal', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                title: '=',
                selector: '=',
                readonly: '=',
                maxLength: '=',
                selectedName: '=',
                hideArrow: '=',
                isBooker: '=',
                approvalList: '=?',
                textRight: '=?'
            },
            templateUrl: 'scripts/components/modal/approval_selector/approval.selector.modal.tpl.html',
            controller: 'com.handchina.huilianyi.ApprovalSelectorModalController'
        }
    }])
    .controller('com.handchina.huilianyi.ApprovalSelectorModalController', ['$scope', '$ionicModal', 'UserService', 'ParseLinks', 'TravelERVService', '$ionicLoading', 'CustomApplicationServices', '$sessionStorage', '$filter',
        function ($scope, $ionicModal, UserService, ParseLinks, TravelERVService, $ionicLoading, CustomApplicationServices, $sessionStorage, $filter) {
            $scope.lang = $sessionStorage.lang;
            $scope.person = {
                isSearching: false,
                member: [],
                userOIDList: [],
                memberInfo: {
                    currentPage: 0,
                    size: 10,
                    links: null,
                    searchName: null,
                    nothing: false,
                    lastPage: 0
                },
                openWarningPopup: function (message) {
                    $ionicLoading.show({
                        template: message,
                        duration: 1000
                    });
                },
                removeMember: function (item, index) {
                    for (var i = 0; i < $scope.person.member.length; i++) {
                        if (item.userOID === $scope.person.member[i].userOID) {
                            $scope.person.member[i].checked = false;
                            break;
                        }
                    }
                    $scope.memberList.splice(index, 1);
                    $scope.person.userOIDList.splice(index, 1);

                },
                openPersonSelector: function () {
                    var uerOID = [];
                    if ($scope.selector) {
                        uerOID = $scope.selector.split(":");
                        if (uerOID.length > 0) {
                            $scope.memberList = [uerOID.length];
                            $scope.person.userOIDList = [uerOID.length];
                            TravelERVService.getBatchUsers(uerOID)
                                .success(function (data) {
                                    var num = 0;
                                    for(; num < data.length; num ++){
                                        for(var j = 0; j < uerOID.length; j++){
                                            if(uerOID[j] === data[num].userOID){
                                                $scope.memberList[j] = data[num];
                                                $scope.person.userOIDList[j] = data[num].userOID;
                                            }
                                        }
                                    }
                                    if(num === data.length){
                                        $scope.person.memberInfo.searchName = null;
                                        $scope.person.member = [];
                                        $scope.person.loadMore(0);
                                        $scope.approvalSelectorModal.show();
                                    }
                                })
                        } else {
                            $scope.memberList = [];
                            $scope.person.userOIDList = [];
                            $scope.person.memberInfo.searchName = null;
                            $scope.person.member = [];
                            $scope.person.loadMore(0);
                            $scope.approvalSelectorModal.show();
                        }
                    } else {
                        $scope.memberList = [];
                        $scope.person.userOIDList = [];
                        for (var i = 0; i < $scope.memberList.length; i++) {
                            $scope.person.userOIDList.push($scope.memberList.userOID);
                        }
                        $scope.person.memberInfo.searchName = null;
                        $scope.person.member = [];
                        $scope.person.loadMore(0);
                        $scope.approvalSelectorModal.show();
                    }
                },
                addMember: function (item, index) {
                    if($scope.isBooker && $scope.person.userOIDList.length > 0){
                        var userOID = $scope.person.userOIDList[0];
                        $scope.person.member[index].checked = true;
                        $scope.memberList = [];
                        $scope.person.userOIDList = [];
                        $scope.memberList.push(item);
                        $scope.person.userOIDList.push(item.userOID);
                        for (var i = 0; i < $scope.person.member.length; i++) {
                            if (userOID === $scope.person.member[i].userOID) {
                                $scope.person.member[i].checked = false;
                                break;
                            }
                        }
                        if ($scope.person.memberInfo.searchName !== null && $scope.person.memberInfo.searchName !== '') {
                            $scope.person.member = [];
                            $scope.person.memberInfo.searchName = null;
                        }
                    } else {
                        var numIndex = $.inArray(item.userOID, $scope.person.userOIDList);
                        if (numIndex > -1) {
                            $scope.person.member[index].checked = false;
                            $scope.memberList.splice(numIndex, 1);
                            $scope.person.userOIDList.splice(numIndex, 1);
                        } else {
                            if ($scope.maxLength <= $scope.memberList.length && $scope.maxLength !== -1) {
                                $scope.person.openWarningPopup($filter('translate')('approval_selector_js.The.most.optional') + $scope.maxLength + $filter('translate')('approval_selector_js.unit') + $scope.title);//最多可选
                            } else {
                                $scope.person.member[index].checked = true;
                                $scope.memberList.push(item);
                                $scope.person.userOIDList.push(item.userOID);
                                if ($scope.person.memberInfo.searchName !== null && $scope.person.memberInfo.searchName !== '') {
                                    $scope.person.member = [];
                                    $scope.person.memberInfo.searchName = null;
                                }
                            }
                        }
                    }
                },
                cancelPersonSelector: function(){
                    $scope.approvalSelectorModal.hide();
                },
                closePersonSelector: function () {
                    $scope.selector = '';
                    $scope.selectedName = '';
                    var i = 0;
                    for (; i < $scope.memberList.length; i++) {
                        if (i !== $scope.memberList.length - 1) {
                            $scope.selector += $scope.memberList[i].userOID + ':';
                            $scope.selectedName += $scope.memberList[i].fullName + ',';
                        } else {
                            $scope.selector += $scope.memberList[i].userOID;
                            $scope.selectedName += $scope.memberList[i].fullName;
                        }
                    }
                    if (i === $scope.memberList.length) {
                        $scope.approvalSelectorModal.hide();

                    }
                },
                loadMore: function (page) {
                    $scope.person.memberInfo.currentPage = page;
                    if($scope.approvalList){
                        if ($scope.approvalList.length > 0) {
                            $scope.person.memberInfo.nothing = false;
                            for (var i = 0; i < $scope.approvalList.length; i++) {
                                var index = $.inArray($scope.approvalList[i].userOID, $scope.person.userOIDList);
                                if (index > -1) {
                                    $scope.approvalList[i].checked = true;
                                    $scope.person.member.push($scope.approvalList[i]);
                                } else {
                                    $scope.approvalList[i].checked = false;
                                    $scope.person.member.push($scope.approvalList[i]);
                                }
                            }
                        } else {
                            $scope.person.memberInfo.nothing = true;
                        }
                    } else {
                        if($scope.isBooker){
                            CustomApplicationServices.getBookers($scope.person.memberInfo.searchName, page, $scope.person.memberInfo.size)
                                .success(function (data, status, headers) {
                                    if (data.length > 0) {
                                        $scope.person.memberInfo.nothing = false;
                                        for (var i = 0; i < data.length; i++) {
                                            var index = $.inArray(data[i].userOID, $scope.person.userOIDList);
                                            if (index > -1) {
                                                data[i].checked = true;
                                                $scope.person.member.push(data[i]);
                                            } else {
                                                data[i].checked = false;
                                                $scope.person.member.push(data[i]);
                                            }

                                        }
                                    }
                                    if (page === 0) {
                                        $scope.person.memberInfo.lastPage = ParseLinks.parse(headers('link')).last;
                                        $scope.person.memberInfo.links = ParseLinks.parse(headers('link'));
                                        if (data.length === 0) {
                                            $scope.person.memberInfo.nothing = true;
                                        }
                                    }
                                })
                                .finally(function () {
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                })
                        }
                        else {
                            if ($scope.person.memberInfo.searchName !== null && $scope.person.memberInfo.searchName !== '') {
                                UserService.searchUser($scope.person.memberInfo.searchName, page, $scope.person.memberInfo.size)
                                    .success(function (data, status, headers) {
                                        if (data.length > 0) {
                                            $scope.person.memberInfo.nothing = false;
                                            for (var i = 0; i < data.length; i++) {
                                                var index = $.inArray(data[i].userOID, $scope.person.userOIDList);
                                                if (index > -1) {
                                                    data[i].checked = true;
                                                    $scope.person.member.push(data[i]);
                                                } else {
                                                    data[i].checked = false;
                                                    $scope.person.member.push(data[i]);
                                                }

                                            }
                                        }
                                        if (page === 0) {
                                            $scope.person.memberInfo.lastPage = ParseLinks.parse(headers('link')).last;
                                            $scope.person.memberInfo.links = ParseLinks.parse(headers('link'));
                                            if (data.length === 0) {
                                                $scope.person.memberInfo.nothing = true;
                                            }
                                        }
                                    })
                                    .finally(function () {
                                        $scope.$broadcast('scroll.infiniteScrollComplete');
                                    })
                            } else {
                                UserService.getAllUsers(page, $scope.person.memberInfo.size)
                                    .success(function (data, status, headers) {
                                        if (data.length > 0) {
                                            $scope.person.memberInfo.nothing = false;
                                            for (var i = 0; i < data.length; i++) {
                                                var index = $.inArray(data[i].userOID, $scope.person.userOIDList);
                                                if (index > -1) {
                                                    data[i].checked = true;
                                                    $scope.person.member.push(data[i]);
                                                } else {
                                                    data[i].checked = false;
                                                    $scope.person.member.push(data[i]);
                                                }
                                            }
                                        }
                                        if (page === 0) {
                                            $scope.person.memberInfo.links = ParseLinks.parse(headers('link'));
                                            $scope.person.memberInfo.lastPage = ParseLinks.parse(headers('link')).last;
                                        }
                                    })
                                    .finally(function () {
                                        $scope.$broadcast('scroll.infiniteScrollComplete');
                                    })
                            }
                        }
                    }

                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
            };

            $scope.$watch('person.memberInfo.searchName', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.person.memberInfo.nothing = false;
                    $scope.person.member = [];
                    $scope.person.loadMore(0);
                }
            });
            $ionicModal.fromTemplateUrl('approval.selector.modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.approvalSelectorModal = modal;
            });
        }]);

