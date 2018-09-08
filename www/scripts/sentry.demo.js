//sentry追踪代码，把console的错误都记录发送到云端
Raven
    .config('http://9e00c7f4540c4e89a9a7659ab6fc330a@report.huilianyi.com:8001/5')
    .addPlugin(Raven.Plugins.Angular)
    .setUserContext({
        phone: JSON.parse(localStorage.getItem('hly.username')),
        company: JSON.parse(localStorage.getItem('hly.companyInfo'))['name'],
        id: JSON.parse(localStorage.getItem('hly.userInfo'))['userOID'],
        name: JSON.parse(localStorage.getItem('hly.userInfo'))['name']
    })
    .install();
