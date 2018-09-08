
var exec = require('cordova/exec');
var HmsCalendar = function(){};

// arg1：成功回调
// arg2：失败回调
// arg3：将要调用类配置的标识
// arg4：调用的原生方法名
// arg5：参数，

HmsCalendar.prototype.openCalendar=function(successCallBack, errorCallBack, type, banPick) {
    exec(successCallBack,errorCallBack, "HmsCalendar", "openCalendar", [type, banPick]);
};

module.exports = new HmsCalendar();

//调用方法 HmsCalendar

