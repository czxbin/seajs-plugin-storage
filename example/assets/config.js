/**
 * Created with WebStorm.
 * Author: xbin
 * Date  : 13-12-30
 * Time  : 下午3:50
 *
 * Describe:
 */

;(function () {
    var debug = false;//true;
    //update app version to update app js without common
    var appVersion = '0.0.1';
    var isUseLocal = true;
    //update version to update all project js
    var version = '0.1.0';
    var fileVersion = '0.1.0';
    var path = isUseLocal ? 'gallery/../../util/src/' : 'mthunder/util/' + fileVersion + '/';
    var base = isUseLocal ? './assets/app/src/' : 'mthunder/app/' + fileVersion + '/';
    var scripts = document.getElementsByTagName("script");
    var loaderScript = document.getElementById("seajs-config") || scripts[scripts.length - 1];
    var jsName = loaderScript.getAttribute("data-name");
    var plugins = isUseLocal ? ['nocache', 'shim', 'storage'] : ['storage'];
    seajs.config({
        debug: debug,
        alias:{
            '$': 'gallery/zepto/1.0.2/zepto',
            'util': path + 'util',
            'iscroll': 'gallery/iscroll/4.2.5/iscroll-lite',
            'backbone': 'gallery/backbone/1.0.0/backbone',
            'underscore': 'gallery/underscore/1.4.4/underscore',
            '_': 'gallery/underscore/1.4.4/underscore'
        },
        plugins: plugins,
        manifest: {
            // update this version for update all script
            version: version,
            // update this appVersion for update the scripts without common
            appVersion: appVersion,
            // update the common
            common: {
                // must exist in alias, and the key must be same
                '$': '1.0.2',
                'util': '2.8',
                'iscroll': '4.2.5',
                'backbone': '1.0.0',
                'underscore': '1.4.4',
                '_': '1.4.4'
            }
        }
    });

    if (jsName) {
        seajs.use(base + jsName);
    }
})();