'use strict';

angular.module('huilianyi.services')
    .factory('ScannerService', ['$http', 'ServiceBaseURL', '$q', function($http, ServiceBaseURL, $q) {
            return {
                /**
                 *
                 * @param options
                 *        {
                 *            'code': barcodeData, // 二维码信息,和报销单号二传一
                 *            'inputCode': businessCode, // 报销单号,和二维码信息二传一
                 *            'operate': operate // 操作类型
                 *        }
                 * @returns {*}
                 */
                getScannerInfo: function(options) {
                    return $q(function (resolve, reject) {
                        $http({
                            url: ServiceBaseURL.url + '/api/audit/scancode',
                            method: 'POST',
                            data: options
                        }).then(function (res) {
                            // console.log(res);
                            resolve(res);
                        }, function (err) {
                            // console.log(err);
                            reject(err);
                        })
                    })
                },

                /**
                 * 财务扫一扫
                 * @param tips 对象, 扫一扫页面的所有提示信息(不包括后端的错误提示)
                 * @param operation 字符串, 扫码模式 REVIEW: 读图审核 AUDIT_PASS: 通过 AUDIT: 驳回 RECEIVE: 收到
                 * @param httpRequests 数组, 需要调用的后端接口
                 * @returns {Promise<T>}
                 * 插件返回的数据:
                 * type: AUDIT,驳回  REVIEW,读图审核  INPUT,手动输入单号
                 * message: {
                 *      code: 二维码信息
                 *      response: 接口返回信息
                 * }
                 */
                expenseScan: function (tips, operation, httpRequests) {
                    var q = $q.defer(),
                        options = {
                            message: tips,
                            operationType: operation,
                            requests: httpRequests
                        };

                    com.jieweifu.plugins.barcode.startScan(options, function (result) {
                        q.resolve(result);
                    }, function (err) {
                        q.reject(err);
                    });

                    return q.promise;
                },

                hasPermission: function () {
                    var q = $q.defer();

                    com.jieweifu.plugins.barcode.hasPermission(function (result) {
                        q.resolve(result);
                    }, function (err) {
                        q.reject(err);
                    });

                    return q.promise;
                }
            }
        }
    ])

    .factory('barcodeScannerService', ['$q', function ($q) {

        return {
            scan: function (options) {
                var q = $q.defer();

                com.jieweifu.plugins.barcode.startScan(options, function (result) {
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                });

                return q.promise;
            },

            hasPermission: function () {
                var q = $q.defer();

                com.jieweifu.plugins.barcode.hasPermission(function (result) {
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                });

                return q.promise;
            }
        };
    }]);
