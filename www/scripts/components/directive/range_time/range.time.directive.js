/**
 * Created by Yuko on 17/4/16.
 */
'use strict';
angular.module('huilianyi.pages')
    .directive('infinityScroll', function () {
        return {
            restrict: 'AE',
            scope: {
                type: '=type',
                max: '=max',
                min: '=min',
                titleText: '=titleText'
            },
            templateUrl: 'scripts/components/directive/range_time/range.time.directive.html',
            link: function (scope, element, attrs) {
                scope.rotates = new Array();
                scope.rotates[0] = new Array();
                scope.rotates[1] = new Array();
                scope.rotates[2] = new Array();
                scope.rotates[3] = new Array();
                scope.sourceDeg = [180, 180, 180, 180]; //每个转轮的角度
                var hourLength = 24;
                var minutesLength = 60;
                scope.nowIndex = [12, 30, 12, 30]; //当前各个转轮选中的下标
                scope.stageRotate = [
                    {
                        "transform": "rotateX(" + scope.sourceDeg[0] + "deg)",
                        "-webkit-transform": "rotateX(" + scope.sourceDeg[0] + "deg)"
                    },
                    {
                        "transform": "rotateX(" + scope.sourceDeg[1] + "deg)",
                        "-webkit-transform": "rotateX(" + scope.sourceDeg[1] + "deg)"
                    },
                    {
                        "transform": "rotateX(" + scope.sourceDeg[2] + "deg)",
                        "-webkit-transform": "rotateX(" + scope.sourceDeg[2] + "deg)"
                    },
                    {
                        "transform": "rotateX(" + scope.sourceDeg[3] + "deg)",
                        "-webkit-transform": "rotateX(" + scope.sourceDeg[3] + "deg)"
                    },
                ];
                scope.baseDeg = [360 / 24, 360 / 60, 360 / 24, 360 / 60]; //每个转的角度


                for (var i = (hourLength - 1); i >= 0; i--) {
                    var deg = 360 / hourLength * (hourLength - i);
                    scope.rotates[0][i] = {
                        "transform": "rotateX(" + deg + "deg) translateZ(90px)",
                        "-webkit-transform": "rotateX(" + deg + "deg) translateZ(90px)"
                    };
                    scope.rotates[2][i] = {
                        "transform": "rotateX(" + deg + "deg) translateZ(90px)",
                        "-webkit-transform": "rotateX(" + deg + "deg) translateZ(90px)"
                    };
                }

                for (var i = (minutesLength - 1); i >= 0; i--) {
                    var deg = 360 / minutesLength * (minutesLength - i);
                    scope.rotates[1][i] = {
                        "transform": "rotateX(" + deg + "deg) translateZ(90px)",
                        "-webkit-transform": "rotateX(" + deg + "deg) translateZ(90px)"
                    };
                    scope.rotates[3][i] = {
                        "transform": "rotateX(" + deg + "deg) translateZ(90px)",
                        "-webkit-transform": "rotateX(" + deg + "deg) translateZ(90px)"
                    };
                }

                function getLastDeg(deg, index) {
                    return (Math.round(deg / scope.baseDeg[index]) + 1) * scope.baseDeg[index];
                }

                function getNextIndex(nowIndex) {
                    var temp = nowIndex + 1;
                    if (temp > (weekNum - 1))
                        temp = 0;
                    return temp;
                }

                function getPrevIndex(nowIndex) {
                    var temp = nowIndex - 1;
                    if (temp < 0)
                        temp = weekNum - 1;
                    return temp;
                }

                function getNowIndex(deg, index) {
                    if(index == 0 || index == 2){
                        var temp = deg / scope.baseDeg[index] % hourLength;
                        scope.nowIndex[index] = temp < 0 ? (hourLength + temp) : temp;
                    } else {
                        var temp = deg / scope.baseDeg[index] % minutesLength;
                        scope.nowIndex[index] = temp < 0 ? (hourLength + temp) : temp;
                    }
                    refreshData();
                }

                scope.lastDeg = [0, 0, 0, 0];
                scope.onDragScroll = function ($event, index) {
                    scope.lastDeg[index] = scope.sourceDeg[index] - $event.gesture.deltaY / 2;
                    scope.stageRotate[index] = {
                        "transform": "rotateX(" + scope.lastDeg[index] + "deg)",
                        "-webkit-transform": "rotateX(" + scope.lastDeg[index] + "deg)"
                    };
                    getNowIndex(scope.lastDeg[index], index);
                };

                scope.onReleaseScroll = function ($event, index) {
                    if ($event.gesture.deltaY > 0)
                        scope.sourceDeg[index] = getLastDeg(scope.lastDeg[index], index) - scope.baseDeg[index];
                    else
                        scope.sourceDeg[index] = getLastDeg(scope.lastDeg[index] - scope.baseDeg[index], index);
                    scope.stageRotate[index] = {
                        "transform": "rotateX(" + scope.sourceDeg[index] + "deg)",
                        "-webkit-transform": "rotateX(" + scope.sourceDeg[index] + "deg)"
                    };
                };

                if (attrs.type == 'number') {
                    scope.titleText = attrs.titleText ? attrs.titleText : 'title';
                    var min = attrs.min ? Number.parseInt(attrs.min) : 0;
                    var max = attrs.max ? attrs.max : 100;

                    function refreshData() {
                        for(var i = 0; i < scope.nowIndex.length; i++){
                            scope.nowIndex[i] = Math.round(scope.nowIndex[i]);
                            if(i == 0 || i ==2){ //小时
                                if (scope.nowIndex[i] > (hourLength - 1)){
                                    scope.nowIndex[i] -= hourLength;
                                }
                                var needChangeUpIndex = scope.nowIndex[i] - hourLength / 4;
                                if (needChangeUpIndex < 0){
                                    needChangeUpIndex = hourLength + needChangeUpIndex;
                                }
                                if (scope.hour[getNextIndex(needChangeUpIndex)] == '' || scope.hour[getNextIndex(needChangeUpIndex)] - 1 < min)
                                    scope.hour[needChangeUpIndex] = '';
                                else
                                    scope.hour[needChangeUpIndex] = scope.hour[getNextIndex(needChangeUpIndex)] - 1;

                                var needChangeDownIndex = scope.nowIndex[i] + hourLength / 4;
                                if (needChangeDownIndex > (hourLength - 1))
                                    needChangeDownIndex = needChangeDownIndex - hourLength;

                                if (scope.hour[getPrevIndex(needChangeDownIndex)] == '' || scope.hour[getPrevIndex(needChangeDownIndex)] + 1 > max)
                                    scope.hour[needChangeDownIndex] = '';
                                else
                                    scope.hour[needChangeDownIndex] = scope.hour[getPrevIndex(needChangeDownIndex)] + 1;
                            }
                        }








                    }

                    scope.weeks = [];
                    for (var i = min; i < weekNum + min; i++) {
                        scope.weeks[i - min] = i;
                    }

                    scope.getShowString = function (item) {
                        return item;
                    };

                    scope.selectItem = function () {
                        alert(scope.weeks[scope.nowIndex]);
                    };
                }

                else {
                    function refreshData() {
                        scope.nowIndex = Math.round(scope.nowIndex);
                        if (scope.nowIndex > (weekNum - 1))
                            scope.nowIndex -= weekNum;
                        var needChangeUpIndex = scope.nowIndex - weekNum / 4;
                        if (needChangeUpIndex < 0)
                            needChangeUpIndex = weekNum + needChangeUpIndex;
                        var UpDate = new Date(scope.weeks[getNextIndex(needChangeUpIndex)]);
                        UpDate.setDate(UpDate.getDate() - 7);
                        scope.weeks[needChangeUpIndex] = UpDate;

                        var needChangeDownIndex = scope.nowIndex + weekNum / 4;
                        if (needChangeDownIndex > (weekNum - 1))
                            needChangeDownIndex = needChangeDownIndex - weekNum;
                        var DownDate = new Date(scope.weeks[getPrevIndex(needChangeDownIndex)]);
                        DownDate.setDate(DownDate.getDate() + 7);
                        scope.weeks[needChangeDownIndex] = DownDate;
                    }
                    scope.chooseWeek = "";

                    var init = function() {
                        scope.hour = []; //时
                        scope.minutes = []; //分
                        for(var i = 0; i < 24; i++){
                            scope.hour.push(i+1);
                        }
                        for(var i = 0; i < 60; i++){
                            scope.minutes.push(i+1);
                        }
                    }

                    init();

                    scope.selectItem = function (nowIndex) {
                        alert(item);
                    };
                }

            }
        }
    });
