//sentry追踪代码，把console的错误都记录发送到云端
Raven
    .config('http://9ea3737be1c7494581cdea4f5936da69@report.huilianyi.com:8001/3')
    .addPlugin(Raven.Plugins.Angular)
    .setUserContext({
        phone: JSON.parse(localStorage.getItem('hly.username')),
        company: JSON.parse(localStorage.getItem('hly.companyInfo'))['name'],
        id: JSON.parse(localStorage.getItem('hly.userInfo'))['userOID'],
        name: JSON.parse(localStorage.getItem('hly.userInfo'))['name']
    })
    .install();
