//piwik分析代码
var _paq = _paq || [];
//var companyInfo = localStorageService.get('companyInfo');
//var userInfo = localStorageService.get('userInfo');
var companyInfo = JSON.parse(localStorage.getItem('hly.companyInfo'));
var userInfo = JSON.parse(localStorage.getItem('hly.userInfo'));
if (companyInfo){
    _paq.push(['setCustomDimension', 1, companyInfo.name]);
}

if (userInfo){
    _paq.push(['setCustomDimension', 2, userInfo.name]);
    _paq.push(['setCustomDimension', 3, userInfo.userOID]);
}
// have to comment this according to document
// _paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
var u="https://report.huilianyi.com/";
_paq.push(['setTrackerUrl', u+'piwik.php']);
_paq.push(['setSiteId', 2]);
