/**
 * Created by Yuko on 16/9/20.
 */
'use strict';
angular.module('huilianyi.services')
    .factory('PublicFunction', ['$http', '$q', 'ServiceBaseURL', '$ionicLoading', '$rootScope', '$filter', 'localStorageService', 'LocalStorageKeys', function ($http, $q, ServiceBaseURL, $ionicLoading, $rootScope, $filter, localStorageService, LocalStorageKeys) {
        return {
            /**
             * 判断字段是否为空
             * @param data
             * @returns {boolean}
             */
            isNull: function (data) {
                if (data === '' || data === null || data == undefined) {
                    return true;
                } else {
                    return false;
                }
            },

            /**
             * 如果字符串为空，则返回0
             * @param str
             * @returns {*}
             */
            str2Number: function (str) {
                if (str === '' || str === null || str == undefined) {
                    return 0;
                } else {
                    return str;
                }
            },

            /**
             * 获取汇率
             * @param companyId 公司ID
             * @param periodName 期间
             * @param reqDate 选择的日期
             * @param fromCry 币种1
             * @param toCry   币种2
             * @returns {*}
             */
            queryExchangeRate: function (companyId, periodName, reqDate, fromCry, toCry) {
                /* var comId = companyId;
                 if (comId === '' || comId === null || comId == undefined) {
                 comId = localStorageService.get(LocalStorageKeys.hec_company_id);
                 }*/
                return $http({
                    url: ServiceBaseURL.hec_interface_url,
                    method: 'POST',
                    data: {
                        "data_type": "book_get_exchange_rate",
                        "action": "query",
                        "company_id": companyId,
                        "session_user_id": localStorageService.get(LocalStorageKeys.hec_user_id),
                        "exchange_period_name": periodName,
                        "requisition_date": reqDate,
                        "from_currency": fromCry,
                        "to_currency": toCry,
                        "pagenum": 1,
                        "pagesize": LocalStorageKeys.hec_pagesize,
                        "fetchall": "false"
                    }
                });
            },

            /**
             * 计算两个日期相隔的天数
             * @param startDate 日期1
             * @param endDate   日期2
             * @returns {Number}
             */
            calculateDays: function (startDate, endDate) {
                var startTime = new Date(Date.parse($filter('date')(startDate, 'yyyy-MM-dd'))).getTime();
                var endTime = new Date(Date.parse($filter('date')(endDate, 'yyyy-MM-dd'))).getTime();
                var days = parseInt(Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24));
                return days;
            },

            /**
             * 比较日期大小(日期格式为yyyy-MM-dd)
             * @param
             */
            compareDate: function (date1, date2) {
                var date1Time = new Date(Date.parse($filter('date')(date1, 'yyyy-MM-dd'))).getTime();
                var date2Time = new Date(Date.parse($filter('date')(date2, 'yyyy-MM-dd'))).getTime();
                if (date1Time - date2Time > 0) {
                    return true;
                }
                return false;
            },

            /**
             * 比较时间大小(时间格式为yyyy-MM-dd HH:mm:ss)
             * @param date1
             * @param date2
             * @returns {boolean}
             */
            compareTime: function (date1, date2) {
                var date1Time = new Date(Date.parse($filter('date')(date1, 'yyyy-MM-dd HH:mm:ss'))).getTime();
                var date2Time = new Date(Date.parse($filter('date')(date2, 'yyyy-MM-dd HH:mm:ss'))).getTime();
                if (date1Time - date2Time > 0) {
                    return true;
                }
                return false;
            },

            /**
             * 日期计算 加减多少天
             * @param date 日期
             * @param days 天数（往前算就传入负数，往后算就传入正数）
             */
            getDate: function getDate(date, days) {
                var date1 = date;
                if (date1 == '' || date1 == undefined || date1 == null) {
                    date1 = new Date();
                }
                return date1.setDate(date1.getDate() + days);
            },

            /**
             * 日期格式化 时分
             * @param date 日期
             * @returns {*}
             */
            getTimeString: function (date) {
                return $filter('date')(date, 'HH:mm');
            },

            /**
             * 日期格式化 年月日
             * @param date
             * @returns {*}
             */
            getDateString: function (date) {
                return $filter('date')(date, 'yyyy-MM-dd');
            },

            /**
             * 时间格式化 年月日时分
             * @param date 日期
             * @returns {*}
             */
            getDateTimeString: function (date) {
                return $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
            },

            /**
             * 时间格式化 年月日时分
             * @param date 日期 为空则格式化当前时间
             * @returns {*}
             */
            getDateTimeDString: function (date) {
                if (date) {
                    return $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
                } else {
                    return $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                }
            },

            /**
             * 判断是否是有效的手机号码
             * @param phone
             */
            isVaildPhone: function (phone) {
                return phone.match(/^1\d{10}$/);
            },

            /**
             * 判断是否是纯数字串
             * @param num
             */
            isNumStr: function (num) {
                return num.match(/^[0-9]*$/);
            },

            /**
             * 经纬度偏差
             * @param lat
             * @param lon
             * @returns {[*,*]}
             */
            bd2gcj: function (lat, lon) {
                var pi = 3.14159265358979324;
                var a = 6378245.0;
                var ee = 0.00669342162296594323;
                var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

                var x = lon, y = lat;
                var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
                var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
                var bd_lon = z * Math.cos(theta) + 0.0065;
                var bd_lat = z * Math.sin(theta) + 0.006;
                return [bd_lat, bd_lon];
            },

            /**
             * 显示Toast 消息
             * @param text
             * @param timeout
             */
            showToast: function (text, timeout) {
                $ionicLoading.show({
                    template: text,
                    duration: typeof timeout === "number" ? timeout : 2000
                });
            },

            /**
             * 显示正在加载的圈圈
             * @param timeout
             */
            showLoading: function (timeout) {
                $ionicLoading.show({
                    template: '<img style="height: 3em" ng-src="img/loading.gif">',
                    delay: typeof timeout === "number" ? timeout : 500,//0.5秒delay，如果页面加载时间小于0.5秒，不显示loading gif
                    noBackdrop: true,
                    duration:5000
                });
            },

            /**
             * 进度条
             */
            showProcessLoading: function () {
                $rootScope.waitProcess = 0;
                $rootScope.waitInterval = setInterval(function () {
                    $rootScope.waitProcess = $rootScope.waitProcess + 5;
                    if ($rootScope.waitProcess > 95) {
                        $rootScope.waitProcess = 95;
                    }
                    if ($rootScope.waitProcess > 0) {
                        $("#process-screen").html($rootScope.waitProcess + "%");
                        $("#progress-bar").css("width", $rootScope.waitProcess + "%");
                    }
                    $rootScope.$apply();
                }, 100);
                $ionicLoading.show({
                    templateUrl: 'scripts/pages/expense_report_version/custom_application/modal/budget.loading.html',
                    noBackdrop: false
                })
            },

            showCheckStandardLoading: function () {
                $ionicLoading.show({
                    template: '<span>正在检查差旅标准中...</span>',
                    noBackdrop: true
                });
            },

            /**
             * 将yyyy-mm-dd格式的日期转换成yyyy.mm/m.dd/d
             * @param array
             * @returns {string}
             */
            dataFormat: function (array) {
                var data = array.split('-');
                data[1] = parseInt(data[1]) < 10 ? parseInt(data[1]) : data[1];
                data[2] = parseInt(data[2]) < 10 ? parseInt(data[2]) : data[2];
                return data[0] + '.' + data[1] + '.' + data[2];
            }
        }
    }])
    //页面间的传值
    .factory('PageValueService', function () {
        var _variables = {};
        return {
            get: function (varname) {
                return (typeof _variables[varname] !== 'undefined') ? _variables[varname] : false;
            },
            set: function (varname, value) {
                _variables[varname] = value;
            }
        };
    });
