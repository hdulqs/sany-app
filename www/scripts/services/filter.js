/**
 * Created by Yuko on 16/7/9.
 */
'use strict';
angular.module('huilianyi.pages')
    .filter("convertFlag", function ($filter) {
        return function (flag) {
            if(flag == undefined || flag == '' || flag === 'N' || flag === 'n' ){
                return $filter('translate')('filter_js.hec.no');
            }else if(flag == 'Y' || flag == 'y'){
                return $filter('translate')('filter_js.hec.yes');
            }
            return flag;
        };
    })
    .filter("convertNothing", function ($filter) {
        return function (message) {
            if(message == undefined || message == ''){
                return $filter('translate')('filter_js.hec.nothing');
            }
            return message;
        };
    })
    .filter("travelAmountFilter", function ($filter) {
        return function (amount) {
            if(amount == '' || amount == undefined || amount === 0){
                return '';
            }
            return amount;
        };
    })
    .filter("currencyFilter", function ($filter) {
        return function (currencyCode) {
            if(currencyCode == '' || currencyCode == undefined){
                return '';
            }
            if(currencyCode === "CNY"){
                return "RMB";
            }
            return currencyCode;
        };
    })
    .filter("amountFilter", function ($filter) {
        return function (amount) {
            if(amount == '' || amount == undefined){
                return '0.00';
            }
            return $filter('number')(amount,2);
        };
    })
    .filter("hecDateFilter", function ($filter) {
        return function (date) {
            if(date == '' || date == undefined || date == null){
                return '';
            }
            return $filter('date')($filter('limitTo')(date,10),'yyyy-MM-dd');
        };
    })
    .filter("hecWeekFilter", function ($filter) {
        return function (oldDate) {
            if(oldDate == '' || oldDate == undefined || oldDate == null){
                return '';
            }
            var temp = $filter('date')($filter('limitTo')(oldDate,10),'EEE');
            switch (temp) {
                case 'Sun':
                    return $filter('translate')('filter_js.Day');//周日
                    break;
                case 'Mon':
                    return $filter('translate')('filter_js.one');//周一
                    break;
                case 'Tue':
                    return $filter('translate')('filter_js.two');//周二
                    break;
                case 'Wed':
                    return $filter('translate')('filter_js.three');//周三
                    break;
                case 'Thu':
                    return $filter('translate')('filter_js.four');//周四
                    break;
                case 'Fri':
                    return $filter('translate')('filter_js.five');//周五
                    break;
                case 'Sat':
                    return $filter('translate')('filter_js.six');//周六
                    break;
            }
        };
    })
    .filter("dateFilter", function ($filter) {
        return function (oldDate) {
            if( oldDate == undefined  || oldDate == ''){
                return '';
            }else{
                var newDate = new Date(oldDate);
                return $filter('date')(newDate, "yyyy-MM-dd");
            }
        };
    })
    .filter("dateTimeFilter", function ($filter) {
        return function (oldDate) {
            var newDate = new Date(oldDate);
            return $filter('date')(newDate, 'yyyy-MM-dd HH:mm');
        };
    })
    .filter("dayFilter", function ($filter) {
        return function (oldDate) {
            var newDate = new Date(oldDate);
            return $filter('date')(newDate, 'MM-dd');
        };
    })
    .filter("dayDotFilter", function ($filter) {
        return function (oldDate) {
            var newDate = new Date(oldDate);
            return $filter('date')(newDate, 'MM.dd');
        };
    })
    .filter("dayCharFilter", function ($filter) {
        return function (oldDate) {
            var newDate = new Date(oldDate);
            return $filter('date')(newDate, $filter('translate')('filter_js.MM_Month_dd_Day'));//MM月dd日
        };
    })
    .filter("dateDotFilter", function ($filter) {
        return function (oldDate) {
            var newDate = new Date(oldDate);
            return $filter('date')(newDate, 'yyyy.MM.dd');
        };
    })
    .filter("oldMonthFilter", function ($filter) {
        return function (oldDate) {
            var newDate = new Date(oldDate);
            return $filter('date')(newDate, 'MM');
        };
    })
    .filter("timeFilter", function ($filter) {
        return function (oldDate) {
            var newDate = new Date(oldDate);
            return $filter('date')(newDate, 'HH:mm');
        };
    })
    .filter("newTimeFilter", function ($filter) {
        return function (oldDate) {
            var newDate = new Date(oldDate.replace(/-/g, "/"));
            return $filter('date')(newDate, 'HH:mm');
        };
    })
    .filter("dayChineseFilter", function ($filter) {
        return function (oldDate) {
            var newDate = new Date(oldDate);
            return $filter('date')(newDate, $filter('translate')('filter_js.MM_Month_dd_Day'));//MM月dd日
        };
    })
    .filter("newDayChineseFilter", function ($filter) {
        return function (oldDate) {
            var newDate = new Date(oldDate.replace(/-/g, "/"));
            return $filter('date')(newDate, $filter('translate')('filter_js.MM_Month_dd_Day'));//MM月dd日
        };
    })
    .filter('weekFilter', function ($filter) {
        return function (day) {
            switch (day) {
                case 0:
                    return $filter('translate')('filter_js.Day');//周日
                    break;
                case 1:
                    return $filter('translate')('filter_js.one');//周一
                    break;
                case 2:
                    return $filter('translate')('filter_js.two');//周二
                    break;
                case 3:
                    return $filter('translate')('filter_js.three');//周三
                    break;
                case 4:
                    return $filter('translate')('filter_js.four');//周四
                    break;
                case 5:
                    return $filter('translate')('filter_js.five');//周五
                    break;
                case 6:
                    return $filter('translate')('filter_js.six');//周六
                    break;
            }
        }
    })
    .filter("weekDayFilter", function ($filter) {
        return function (oldDate) {
            var weekday = '';
            var week = new Date(oldDate).getDay();
            switch (week) {
                case 0:
                    weekday = $filter('translate')('filter_js.Sunday');//周日
                    break;
                case 1:
                    weekday = $filter('translate')('filter_js.Monday');//周一
                    break;
                case 2:
                    weekday = $filter('translate')('filter_js.Tuesday');//周二
                    break;
                case 3:
                    weekday = $filter('translate')('filter_js.Wednesday');//周三
                    break;
                case 4:
                    weekday = $filter('translate')('filter_js.Thursday');//周四
                    break;
                case 5:
                    weekday = $filter('translate')('filter_js.Friday');//周五
                    break;
                case 6:
                    weekday = $filter('translate')('filter_js.Saturday');//周六
                    break;
            }
            return weekday;
        };

    })
    .filter("newWeekDayFilter", function ($filter) {
        return function (oldDate) {
            var weekday = '';
            var week = new Date(oldDate.replace(/-/g, "/")).getDay();
            switch (week) {
                case 0:
                    weekday = $filter('translate')('filter_js.Sunday');//周日
                    break;
                case 1:
                    weekday = $filter('translate')('filter_js.Monday');//周一
                    break;
                case 2:
                    weekday = $filter('translate')('filter_js.Tuesday');//周二
                    break;
                case 3:
                    weekday = $filter('translate')('filter_js.Wednesday');//周三
                    break;
                case 4:
                    weekday = $filter('translate')('filter_js.Thursday');//周四
                    break;
                case 5:
                    weekday = $filter('translate')('filter_js.Friday');//周五
                    break;
                case 6:
                    weekday = $filter('translate')('filter_js.Saturday');//周六
                    break;
            }
            return weekday;
        };

    })
    .filter('monthFilter', function ($filter) {
        return function (month) {
            switch (month) {
                case 0:
                    return $filter('translate')('filter_js.Jan');//1月
                    break;
                case 1:
                    return $filter('translate')('filter_js.Feb');//2月
                    break;
                case 2:
                    return $filter('translate')('filter_js.Mar');//3月
                    break;
                case 3:
                    return $filter('translate')('filter_js.Apr');//4月
                    break;
                case 4:
                    return $filter('translate')('filter_js.May');//5月
                    break;
                case 5:
                    return $filter('translate')('filter_js.Jun');//6月
                    break;
                case 6:
                    return $filter('translate')('filter_js.Jul');//7月
                    break;
                case 7:
                    return $filter('translate')('filter_js.Aug');//8月
                    break;
                case 8:
                    return $filter('translate')('filter_js.Sep');//9月
                    break;
                case 9:
                    return $filter('translate')('filter_js.Oct');//10月
                    break;
                case 10:
                    return $filter('translate')('filter_js.Nov');//11月
                    break;
                case 11:
                    return $filter('translate')('filter_js.Dec');//12月
                    break;
            }
        }
    })
    .filter('operateFilter', function ($filter) {
        return function (day) {
            switch (day) {
                case 'SUBMIT_FOR_APPROVAL':
                    return $filter('translate')('filter_js.submitApproval');//提交审批
                    break;
                case 'WITHDRAW':
                    return $filter('translate')('filter_js.withdraw');//撤回
                    break;
                case 'SUBMIT_FOR_REPRESENTATION':
                    return $filter('translate')('filter_js.SubmitTicket');//提交贴票
                    break;
                case 'APPROVAL_PASS':
                    return $filter('translate')('filter_js.approvePass');//审批通过
                    break;
                case 'APPROVAL_REJECT':
                    return $filter('translate')('filter_js.approveReject');//审批驳回
                    break;
                case 'AUDIT_RECEIVE':
                    return $filter('translate')('filter_js.receive');//收到
                    break;
                case 'REPRESENTATION_PASS':
                    return $filter('translate')('filter_js.ticketPass');//贴票通过
                    break;
                case 'REPRESENTATION_REJECT':
                    return $filter('translate')('filter_js.ticketReject');//贴票驳回
                    break;
            }
        }
    })
    .filter('operate', function ($filter) {
        return function (operate) {
            switch (operate) {
                case 1:
                    return $filter('translate')('filter_js.submit');//提交
                    break;
                case 2:
                    return $filter('translate')('filter_js.withdraw');//撤回
                    break;
                case 3:
                    return $filter('translate')('filter_js.SubmitTicket');//提交贴票
                    break;
                case 11:
                    return $filter('translate')('filter_js.approvePass');//审批通过
                    break;
                case 12:
                    return $filter('translate')('filter_js.approveReject');//审批驳回
                    break;
                case 21:
                    return $filter('translate')('filter_js.ticketPass');//贴票通过
                    break;
                case 22:
                    return $filter('translate')('filter_js.ticketReject');//贴票驳回
                    break;
                case 31:
                    return $filter('translate')('filter_js.verifyPass');//审核通过
                    break;
                case 32:
                    return $filter('translate')('filter_js.verifyReject');//审核驳回
                    break;
            }
        }
    })
    .filter('operation', function ($filter) {
        return function (operate) {
            switch (operate) {
                case 1001:
                    return $filter('translate')('filter_js.submitApproval');//提交审批
                    break;
                case 1002:
                    return $filter('translate')('filter_js.withdraw');//撤回
                    break;
                case 2001:
                    return $filter('translate')('filter_js.approvePass');//审批通过
                    break;
                case 2002:
                    return $filter('translate')('filter_js.approveReject');//审批驳回
                    break;
                case 3001:
                    return $filter('translate')('filter_js.verifyPass');//审核通过
                    break;
                case 3002:
                    return $filter('translate')('filter_js.verifyReject');//审核驳回
                    break;
                case 3003:
                    return $filter('translate')('filter_js.receive');//收到
                case 3004:
                    return $filter('translate')('filter_js.audit_check');//财务预检
                    break;
                case 4000:
                    return $filter('translate')('filter_js.pay_in_process');//付款中
                    break;
                case 4001:
                    return $filter('translate')('filter_js.yetPayment');//已付款
                    break;
                case 4011:
                    return $filter('translate')('filter_js.openTicketPass');//开票通过
                    break;
                case 4012:
                    return $filter('translate')('filter_js.openTicketFail');//开票失败
                    break;
                case 5000:
                    return $filter('translate')('filter_js.submit');//提交
                    break;
                case 5001:
                    return $filter('translate')('filter_js.createRepaymentRecord');//创建还款记录
                    break;
                case 5002:
                    return $filter('translate')('filter_js.RepaymentAccomplish');//确认,还款完成
                    break;
                case 5003:
                    return $filter('translate')('filter_js.refuse');//拒绝
                    break;
                case 5005:
                    return $filter('translate')('filter_js.enterprise_close');//企业停用
                    break;
                case 5006:
                    return $filter('translate')('filter_js.close_application');//停用申请
                    break;
                case 5007:
                    return $filter('translate')('filter_js.restart_application');//重新启用
                    break;
                case 5008:
                    return $filter('translate')('filter_js.central_close');//统一停用
                    break;
            }
        }
    })
    .filter('statusFilter', function ($filter) {
        return function (status) {
            switch (status) {
                case "1001":
                    return $filter('translate')('filter_js.underway');//进行中
                    break;
                case "1003":
                    return $filter('translate')('filter_js.RepaymentFail');//还款失败
                    break;
                case "1002":
                    return $filter('translate')('filter_js.RepaymentOK');//还款成功
                    break;
            }
        }
    })
    .filter('typeFilter', function ($filter) {
        return function (status) {
            switch (status) {
                case "0":
                    return $filter('translate')('filter_js.financeEstablish');//财务创建
                    break;
                case "1":
                    return $filter('translate')('filter_js.transferAccountsRepayment');//转账还款
                    break;
                case "2":
                    return $filter('translate')('filter_js.applyRepayment');//报销单还款
                    break;
            }
        }
    })
    .filter('currencyChineseName', function ($filter) {
        return function (currencyCode) {
            switch (currencyCode) {
                case 'USD':
                    return $filter('translate')('filter_js.USD');//美元
                    break;
                case 'EUR':
                    return $filter('translate')('filter_js.EUR');//欧元
                    break;
                case 'JPY':
                    return $filter('translate')('filter_js.JPY');//日元
                    break;
                case 'HKD':
                    return $filter('translate')('filter_js.HKD');//港元
                    break;
                case 'GBP':
                    return $filter('translate')('filter_js.GBP');//英镑
                    break;
                case 'AUD':
                    return $filter('translate')('filter_js.AUD');//澳元
                    break;
                case 'CAD':
                    return $filter('translate')('filter_js.CAD');//加元
                    break;
                case 'RMB':
                    return $filter('translate')('filter_js.RMB');//人民币
                    break;
                case 'TWD':
                    return $filter('translate')('filter_js.TWD');//台币
                    break;
                case 'KRW':
                    return $filter('translate')('filter_js.KRW');//韩元
                    break;
                case 'SGD':
                    return $filter('translate')('filter_js.SGD');//新元
                    break;
                case 'CNY':
                    return $filter('translate')('filter_js.RMB');//人民币
                    break;
            }
        }
    })
    .filter('currencyChar', function ($filter) {
        return function (currencyCode) {
            switch (currencyCode) {
                case 'USD':
                    return "$";
                    break;
                case 'EUR':
                    return "€";
                    break;
                case 'JPY':
                    return "￥";
                    break;
                case 'HKD':
                    return "$";
                    break;
                case 'GBP':
                    return "￡";
                    break;
                case 'AUD':
                    return "$";
                    break;
                case 'CAD':
                    return "$";
                    break;
                case 'RMB':
                    return "¥";
                    break;
                case 'TWD':
                    return "$";
                    break;
                case 'KRW':
                    return "₩";
                    break;
                case 'SGD':
                    return "$";
                    break;
                case 'CNY':
                    return "¥";
                    break;
                case 'CHF':
                    return "Fr";
                    break;
                case 'NZD':
                    return "$";
                    break;
                case 'BRL':
                    return "R$";
                    break;
                case 'RUB':
                    return "₽";
                    break;
                default:
                    return "¥";
                    break;
            }
        }
    })

    .filter('bookMessageTitle', function ($filter) {
        return function (messageType) {
            switch (messageType) {
                case 'TRAVEL_BOOKER_APPLY':
                    return $filter('translate')('filter_js.reserve');//订票
                    break;
                case 'TRAVEL_BOOKER_REFUND':
                    return $filter('translate')('filter_js.returnTicket');//退票
                    break;
                case 'TRAVEL_BOOKER_ENDORSE':
                    return $filter('translate')('filter_js.gaiqian');//改签
                    break;
                default:
                    return "";
                    break;
            }
        }
    })

    .filter('customApplicationType', function ($filter) {
        return function (type) {
            switch (type) {
                case 1001:
                    return $filter('translate')('filter_js.moneyApply');//费用申请
                    break;
                case 1002:
                    return $filter('translate')('filter_js.travelApply');//差旅申请
                    break;
                case 1003:
                    return $filter('translate')('filter_js.reserveApply');//订票申请
                    break;
                case 1004:
                    return $filter('translate')('filter_js.jingDongApply');//京东申请
                    break;
                case 2005:
                    return $filter('translate')('filter_js.borrowApply');//借款申请
                    break;
                case 4100:
                    return $filter('translate')('filter_js.FlybackApply');//Flyback申请
                    break;
                default:
                    return "";
                    break;
            }
        }
    })

    // 判断对应的数据是否是指定类型
    .filter('typeof', function() {
        return function(obj, type) {
            return typeof obj === type
        };
    })
;


Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Array.prototype.unique = function(){
    var a = {};
    for(var i = 0; i < this.length; i++){
        if(typeof a[this[i]] == "undefined")
            a[this[i]] = 1;
    }
    this.length = 0;
    for(var i in a)
        this[this.length] = i;
    return this;
}
