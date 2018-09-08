/**
 * Created by tanbingqin on 2017/5/17.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('roommateSelectorModal', ['$http', function () {
        return {
            restrict: 'E',
            scope: {
                title: '=',
                selector: '=',
                readonly: '=',
                maxLength: '=',
                selectedName: '=',
                hideArrow: '=',
                textRight: '=?',
                status: '='
            },
            templateUrl: 'scripts/components/modal/roommate_selector/roommate.selector.modal.tpl.html',
            controller: 'com.handchina.huilianyi.RoommateSelectorModalController'
        }
    }])
    .controller('com.handchina.huilianyi.RoommateSelectorModalController', ['$scope', '$ionicModal', 'UserService', 'ParseLinks', 'TravelERVService', '$ionicLoading', 'CustomApplicationServices', '$sessionStorage', '$filter',
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
                clearSearch: function () {
                    $scope.person.memberInfo.searchName = '';
                    //清空搜索的时候关闭键盘
                    //关闭键盘在ios中还有点问题
                    //$scope.person.closeKeyboard();
                },
                // 关闭键盘
                closeKeyboard: function() {
                    if(!ionic.Platform.is('browser')){
                        cordova.plugins.Keyboard.close();
                    }
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
                                        $scope.roommateSelectorModal.show();
                                    }
                                })
                        } else {
                            $scope.memberList = [];
                            $scope.person.userOIDList = [];
                            $scope.person.memberInfo.searchName = null;
                            $scope.person.member = [];
                            $scope.person.loadMore(0);
                            $scope.roommateSelectorModal.show();
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
                        $scope.roommateSelectorModal.show();
                    }
                },
                addMember: function (item, index) {
                    var userOID = $scope.person.userOIDList[0];
                    $scope.person.member[index].checked = true;
                    if (item.userOID === userOID) {
                        //不添加新的，并把原来选中的删除
                        var numIndex = $.inArray(item.userOID, $scope.person.userOIDList);
                        if (numIndex > -1) {
                            $scope.person.member[index].checked = false;
                            $scope.memberList.splice(numIndex, 1);
                            $scope.person.userOIDList.splice(numIndex, 1);
                        }
                        if ($scope.person.memberInfo.searchName !== null && $scope.person.memberInfo.searchName !== '') {
                            $scope.person.member = [];
                            $scope.person.memberInfo.searchName = null;
                        }
                    } else {
                        //把原来的删除，并添加个新的同时关闭控件返回上一页
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
                    }

                    //同行人只能选一个，要求选完就直接关闭控件返回前一页
                    if ($scope.memberList.length) {
                        $scope.person.closePersonSelector();
                    }
                },
                cancelPersonSelector: function(){
                    $scope.roommateSelectorModal.hide();
                },
                closePersonSelector: function () {
                    $scope.selector = '';
                    $scope.selectedName = '';
                    $scope.status = 0;//status:1001 在职 status:1002 待离职 status:1003 已离职
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
                    //同行人只有一个，更新下同行人的状态
                    if ($scope.memberList.length) {
                        $scope.status = $scope.memberList[0].status;
                    }
                    if (i === $scope.memberList.length) {
                        $scope.roommateSelectorModal.hide();

                    }
                },
                loadMore: function (page) {
                    if(!$scope.person.isSearching){
                        $scope.person.isSearching = true;
                        $scope.person.memberInfo.currentPage = page;
                        if ($scope.person.memberInfo.searchName !== null && $scope.person.memberInfo.searchName !== '') {
                            UserService.getUsers(page, $scope.person.memberInfo.size, $scope.person.memberInfo.searchName)
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
                                    $scope.person.isSearching = false;
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                })
                        } else {
                            UserService.getUsers(page, $scope.person.memberInfo.size, '')
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
                                    $scope.person.isSearching = false;
                                    $scope.$broadcast('scroll.infiniteScrollComplete');
                                })
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                }
            };

            $scope.$watch('person.memberInfo.searchName', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.person.memberInfo.nothing = false;
                    $scope.person.member = [];
                    $scope.person.loadMore(0);
                }
            });
            $ionicModal.fromTemplateUrl('roommate.selector.modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.roommateSelectorModal = modal;
            });
        }]);
