/**
 * Created by Yuko on 16/8/6.
 */
'use strict';
angular.module('huilianyi.pages')
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('app.erv_approval_history_list', {
            url: 'erv/approval/history/list',
            cache: false,
            views: {
                'page-content@app': {
                    'templateUrl': 'scripts/pages/expense_report_version/approval/approval.list.history.tpl.html',
                    'controller': 'com.handchina.huilianyi.ErvApprovalHistoryListController'
                }
            },
            resolve:{
                mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    //$translatePartialLoader.addPart('homepage');
                    $translatePartialLoader.addPart('approval');
                    $translatePartialLoader.addPart('components');
                    $translatePartialLoader.addPart('filter');
                    return $translate.refresh();
                }]
            }
        })
    }])
    .controller('com.handchina.huilianyi.ErvApprovalHistoryListController', ['$scope', 'ApprovalERVService', 'ParseLinks', '$state', '$ionicScrollDelegate',
        function ($scope, ApprovalERVService, ParseLinks, $state, $ionicScrollDelegate) {
            $scope.view = {
                status: null, //审批状态(已审批hasApproval, 待审批 waitApproval)
                isShowType: true,
                pageable: {
                    page: 0,
                    size: 10
                },
                dataNum: {
                    lastPage: 0,
                    total: 0
                },
                nothing: false,
                apporvalList: [],
                refresh: function(){
                    $scope.view.apporvalList =[];
                    $scope.view.loadMore(0, true);
                    $scope.$broadcast('scroll.refreshComplete');
                },
                waitApproval: function(){
                    $state.go('app.erv_approval_list');
                },
                loadMore: function (page, refreshData) {
                    $scope.view.nothing = false;
                    $scope.view.pageable.page = page;
                    if($scope.view.pageable.page === 0){
                        $ionicScrollDelegate.scrollTop();
                    }
                    ApprovalERVService.getApprovalHistoryList(page, $scope.view.pageable.size)
                        .success(function (data, status, headers) {
                            if (data.length > 0){
                                for (var i = 0; i < data.length; i++) {
                                    $scope.view.apporvalList.push(data[i]);
                                }
                            }
                            if (page === 0) {
                                $scope.view.dataNum.lastPage = ParseLinks.parse(headers('link')).last;
                                $scope.view.dataNum.total = headers('x-total-count');
                                if(data.length === 0){
                                    $scope.view.nothing = true;
                                }
                            }
                        })
                        .finally(function () {
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            if (refreshData) {
                                $scope.$broadcast('scroll.refreshComplete');
                            }
                        });
                },
                goDetail: function(item){
                    if(item.entityType === 1002){
                        //报销单
                        $state.go('app.tab_erv_expense_detail_passed',{expenseReportOID: item.expenseReport.expenseReportOID});
                    } else if(item.entityType === 1001){
                        if(item.application.type === 1001){
                            //费用
                            $state.go('app.erv_invoice_apply_approve_detail',{applicationOID: item.application.applicationOID});
                        } else if(item.application.type === 1002){
                            //差旅
                            $state.go('app.erv_travel_detail',{applicationOID: item.application.applicationOID});
                        }
                    }
                }
            };
            var init = function(){
                $scope.view.loadMore(0);
            };
            init();
            $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
                viewData.enableBack = true;
            })
        }]);
