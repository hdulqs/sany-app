(function () {
    'use strict';
    angular.module('huilianyi')
        .config(LocalStorageConfig)
    LocalStorageConfig.inject = ['localStorageServiceProvider'];
    function LocalStorageConfig(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('hly');

    }
})();
