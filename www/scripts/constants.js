angular.module('huilianyi')
    .constant('LocalStorageKeys', {
        token: "token",

        hec_token: "hec_token",
        hec_token_username: "SANYHLY",
        hec_token_password: "sanyhly123",
        hec_token_type:"hec_token_type",

        hec_user_id:"hec_user_id",
        hec_company_id:"hec_company_id",
        hec_employee_id:"hec_employee_id",

        hec_user_default:"hec_user_default",

        hec_pagesize: 20,
        hec_language_code:"hec_language_code",

        company: {
            configuration: "company.configuration"
        },
        cost: {
            center: "cost.center"
        },
        push: {
            deviceID: "push.deviceID",
            registered: "push.registered",
            cleared: "push.cleared"
        }
    })
    .constant('HLYVersion', {
        currentVersion: '2.0.0'
    })
    .constant('Map', {
        key: {
            web: '174c8e2d376b5789cebbf78cd59f9e2f',
            js: 'a248914765f4a9ebeabd1dbda40d42d5'
        },
        default: 'http://webapi.amap.com/theme/v1.3/markers/b/mark_bs.png',
        highlighted: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png'
    })
    .constant('DefaultExpenseTypeOID', 'd30023be-45d5-4fed-994d-91a2d51d2de5')
    //有了多币种,这个CurrencyCode基本上已经废弃,不能存在前端,
    //现在这些币种符号($)规定不能显示在界面里面,但是项目中还有很多地方在使用CurrencyCode查询,
    //这个得统一删除与修改
    .constant('CurrencyCode', {
        USD: 'USD',
        CNY: 'CNY',
        EUR: 'EUR',
        JPY: 'JPY',
        SGD: 'SGD',
        KRW: 'KRW',
        GBP: 'GBP',
        CAD: 'CAD',
        TWD: 'TWD',
        HKD: 'HKD',
        AUD: 'AUD',
        CHF: 'CHF',
        MYR: 'MYR',
        ZAR: 'ZAR',
        THB: 'THB',
        SEK: 'SEK',
        KES: 'KES',
        DKK: 'DKK',
        CLP: 'CLP',
        PHP: 'PHP',
        MXN: 'MXN',
        AED: 'AED',
        INR: 'INR',
        RUB: 'RUB',
        BRL: 'BRL',
        NZD: 'NZD'
    })
    // 这个CashName也是由于历史原因,今晚要上线,时间紧张,这些名字对应关系暂时生成在前端(文件来自测试),
    // 因为程序里面很多地方在选择币种的时候,要来着查询币种名字,暂时没时间修改里面的逻辑,
    // 这个以后肯定得由后端维护,前端,不要在前端查询币名,直接做在接口里面
    .constant('CashName', {
        CNY: '人民币',
        HKD: '港元',
        TWD: '台币',
        EUR: '欧元',
        USD: '美元',
        GBP: '英镑',
        KRW: '韩元',
        JPY: '日元',
        ALL: '阿尔巴尼亚列克',
        DZD: '阿尔及利亚第纳尔',
        ARS: '阿根廷比索',
        AWG: '阿鲁巴岛弗罗林',
        AUD: '澳元',
        EGP: '埃及镑',
        ETB: '埃塞俄比亚比尔',
        MOP: '澳门元',
        OMR: '阿曼里亚尔',
        AED: '阿联酋迪尔汗',
        BSD: '巴哈马元',
        BHD: '巴林第纳尔',
        BBD: '巴巴多斯元',
        BYR: '白俄罗斯卢布',
        BZD: '伯利兹元',
        BMD: '百慕大元',
        BTN: '不丹卢比',
        BOB: '玻利维亚诺',
        BWP: '博茨瓦纳普拉',
        BRL: '巴西雷亚尔',
        BGN: '保加利亚列瓦',
        BIF: '布隆迪法郎',
        ISK: '冰岛克朗',
        PKR: '巴基斯坦卢比',
        PAB: '巴拿马巴尔博亚',
        PGK: '巴布亚新几内亚基那',
        PYG: '巴拉圭瓜拉尼',
        PLN: '波兰兹罗提',
        KPW: '朝鲜圆',
        XOF: '多哥非洲共同体法郎',
        DKK: '丹麦克朗',
        DOP: '多米尼加比索',
        RUB: '俄罗斯卢布',
        CVE: '佛得角埃斯库多',
        FKP: '福克兰群岛镑',
        FJD: '斐济元',
        PHP: '菲律宾比索',
        XAF: '刚果中非共同体法郎',
        COP: '哥伦比亚比索',
        CRC: '哥斯达黎加科朗',
        CUP: '古巴比索',
        XCD: '格林纳达东加勒比元',
        GMD: '冈比亚达拉西',
        GYD: '圭亚那元',
        HTG: '海地古德',
        HNL: '洪都拉斯伦皮拉',
        KZT: '哈萨克斯坦腾格',
        KHR: '柬埔寨利尔斯',
        CAD: '加拿大元',
        CZK: '捷克克朗',
        DJF: '吉布提法郎',
        GNF: '几内亚法郎',
        KMF: '科摩罗法郎',
        HRK: '克罗地亚库纳',
        KES: '肯尼亚先令',
        KWD: '科威特第纳尔',
        QAR: '卡塔尔利尔',
        LAK: '老挝基普',
        LVL: '拉脱维亚拉图',
        LBP: '黎巴嫩镑',
        LSL: '莱索托洛提',
        LRD: '利比里亚元',
        LYD: '利比亚第纳尔',
        LTL: '立陶宛里塔斯',
        ANG: '列斯荷兰盾',
        RON: '罗马尼亚新列伊',
        RWF: '卢旺达法郎',
        BDT: '孟加拉塔卡',
        MKD: '马其顿第纳尔',
        MWK: '马拉维克瓦查',
        MYR: '马来西亚林吉特',
        MVR: '马尔代夫卢非亚',
        MRO: '毛里塔尼亚乌吉亚',
        MUR: '毛里求斯卢比',
        MXN: '墨西哥比索',
        MDL: '摩尔多瓦列伊',
        MNT: '蒙古图格里克',
        MAD: '摩洛哥道拉姆',
        MMK: '缅甸元',
        PEN: '秘鲁索尔',
        NAD: '纳米比亚元',
        NPR: '尼泊尔卢比',
        NIO: '尼加拉瓜科多巴',
        NGN: '尼日利亚奈拉',
        NOK: '挪威克朗',
        ZAR: '南非兰特',
        SEK: '瑞典克朗',
        CHF: '瑞士法郎',
        SVC: '萨尔瓦多科朗',
        WST: '萨摩亚塔拉',
        STD: '圣多美多布拉',
        SAR: '沙特阿拉伯里亚尔',
        SCR: '塞舌尔法郎',
        SLL: '塞拉利昂利昂',
        SBD: '所罗门群岛元',
        SOS: '索马里先令',
        LKR: '斯里兰卡卢比',
        SHP: '圣赫勒拿群岛磅',
        SZL: '斯威士兰里兰吉尼',
        TRY: '土耳其新里拉',
        XPF: '太平洋法郎',
        TZS: '坦桑尼亚先令',
        THB: '泰铢',
        TOP: '汤加潘加',
        TTD: '特立尼达和多巴哥元',
        TND: '突尼斯第纳尔',
        BND: '文莱元',
        GTQ: '危地马拉格查尔',
        UAH: '乌克兰赫夫米',
        UYU: '乌拉圭新比索',
        VUV: '瓦努阿图瓦图',
        VND: '越南盾',
        HUF: '匈牙利福林',
        NZD: '新西兰元',
        SGD: '新加坡元',
        SYP: '叙利亚镑',
        INR: '印度卢比',
        IDR: '印度尼西亚卢比(盾)',
        IRR: '伊朗里亚尔',
        IQD: '伊拉克第纳尔',
        ILS: '以色列镑',
        JMD: '牙买加元',
        JOD: '约旦第纳尔',
        YER: '也门里亚尔',
        CLP: '智利比索',
        GIP: '直布罗陀镑'
    })
    .constant('DatePickI18N', {
        'zh_cn': {
            'weekdays': ['日', '一', '二', '三', '四', '五', '六'],
            'months': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            'ok': '确认',
            'cancel': '取消'
        },
        'en': {
            'weekdays': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            'months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            'ok': 'Ok',
            'cancel': 'Cancel'
        }
    })
    .constant('MAX_ER_INVOICE_NUM', 200)//单张报销单 最多200条费用
    .constant('FUNCTION_PROFILE', {
        leafDepSelectorRequired: 'department.leaf.selection.required'
    })
    .constant('ManagerPrompt', '找不到有效的审批人，请联系管理员!')
    //.constant('JingDongURL', 'http://jd.siqint.com')
    .constant('FORM_TYPE', {
        common: 1001,
        daily: 3001,
        //差旅报销单
        travel: 3002,
        //费用报销单
        invoice: 3003,
        travelApplication: 2001,
        expenseApplication: 2002,
        bookApplication: 2003,
        loanApplication: 2005
    })
;

