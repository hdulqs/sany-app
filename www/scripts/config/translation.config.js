(function () {
    'use strict';
    angular
        .module('huilianyi')
        .config(translationConfig)
        .factory('translationStorageProvider', translationStorageProvider);

    translationConfig.$inject = ['$translateProvider', 'tmhDynamicLocaleProvider'];
    function translationConfig($translateProvider, tmhDynamicLocaleProvider) {
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'i18n/{lang}/{part}.json'
        });

        // $translateProvider.preferredLanguage('zh_cn');
        $translateProvider.useStorage('translationStorageProvider');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.addInterpolation('$translateMessageFormatInterpolation');

        tmhDynamicLocaleProvider.localeLocationPattern('i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage();
        tmhDynamicLocaleProvider.storageKey('NG_TRANSLATE_LANG_KEY');
    }

    translationStorageProvider.$inject = ['$cookies', '$log', 'LANGUAGES'];
    function translationStorageProvider($cookies, $log, LANGUAGES) {
        return {
            get: get,
            put: put
        };

        function get(name) {
            if (LANGUAGES.indexOf($cookies.getObject(name)) === -1) {
                $log.info('Resetting invalid cookie language "' + $cookies.getObject(name) + '" to prefered language "zh_cn"');
                $cookies.putObject(name, 'zh_cn');
            }
            return $cookies.getObject(name);
        }

        function put(name, value) {
            $cookies.putObject(name, value);
        }
    }
})();
