/**
 * Created by lizhi on 17/5/8.
 */
angular.module('huilianyi')
//removeIf(notDev)
    .value("ServiceBaseURL", {
        "url": "http://113.247.241.66:9083",
        "hec_login_url": "http://113.247.241.66:9083/hec/api/login",
        "hec_interface_url": "http://113.247.241.66:9083/hec/api/interface_handle",
        "xiaer_url": "http://113.247.241.66:9083/dms/filecontrol.cm?IMGTYPE=1&IMGNAME=GENERAL&CURRENTIMGTYPE=1&CURRENTIMGNAME=GENERAL"
    })
    //endRemoveIf(notDev)

    //removeIf(notUat)
    .value("ServiceBaseURL", {
        "url": "http://113.247.241.66:9083",
        "hec_login_url": "http://113.247.241.66:9083/uat/hec/api/login",
        "hec_interface_url": "http://113.247.241.66:9083/uat/hec/api/interface_handle",
        "xiaer_url": "http://113.247.241.66:9083/dms/filecontrol.cm?IMGTYPE=1&IMGNAME=GENERAL&CURRENTIMGTYPE=1&CURRENTIMGNAME=GENERAL"
    })
    //endRemoveIf(notUat)

    //removeIf(notProd)
    .value("ServiceBaseURL", {
        "url": "http://222.240.233.81",
        "hec_login_url": "http://222.240.233.81/hec/api/login",
        "hec_interface_url": "http://222.240.233.81/hec/api/interface_handle",
        "xiaer_url": "http://222.240.233.81/dms/filecontrol.cm?IMGTYPE=1&IMGNAME=GENERAL&CURRENTIMGTYPE=1&CURRENTIMGNAME=GENERAL"
    })
    /*.value("ServiceBaseURL", {
        "url": "http://222.240.233.81",
        "hec_login_url": "https://nems.sany.com.cn:8080/hand_hec_hly_service/api/login",
        "hec_interface_url": "https://nems.sany.com.cn:8080/hand_hec_hly_service/api/interface_handle",
        "xiaer_url": "https://nems.sany.com.cn:8080/dms/filecontrol.cm?IMGTYPE=1&IMGNAME=GENERAL&CURRENTIMGTYPE=1&CURRENTIMGNAME=GENERAL"
    })*/
//endRemoveIf(notProd)
