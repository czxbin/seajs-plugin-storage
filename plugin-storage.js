/**
 * seajs-plugin-storage.js
 * a plugin for seajs use to storage javascript into localstorage 
 * version: v0.1
 * author: czxbin@gmail.com
 */
 
;(function (seajs, global, doc) {
    // util
    var STORAGE_KEY = 'seajs_localStorage_manifest';
    var STORAGE_PR = 'js_storage_';
    var REG_PR = new RegExp('^' + STORAGE_PR + 'http:\/\/');
    var noCacheStr = 'nocache=' + new Date().getTime();
    var notUpdateList = {};
    var updateList = {};
    var isEmptyObject = function (obj) {
        for (var name in obj) {
            return false;
        }
        return true;
    };
    var removeAllStorage = function () {
        for (var name in localStorage) {
            if (REG_PR.test(name)) {
                console.log(name);
                localStorage.removeItem(name);
            }
        }
    };
    var removeStorageWithoutList = function (list) {
        if (isEmptyObject(list)) {
            removeAllStorage();
            return;
        }
        for (var name in localStorage) {
            if (REG_PR.test(name)) {
                if (!list[name]) {
                    console.log(name);
                    localStorage.removeItem(name);
                }
            }
        }
    };
    var removeStorageWithList = function (list) {
        if (isEmptyObject(list)) {
            return;
        }
        for (var name in list) {
            console.log(name);
            localStorage.removeItem(name);
        }
    };

    // update
    // remove update file's storage
    // if debug, then remove the localStorage data and return
    if (seajs.config.data && seajs.config.data.debug) {
        removeAllStorage();
        return;
    }
    // if have not config.manifest object, or have not localStorage, then return
    var manifest = seajs.config.data.manifest;
    if (!manifest || !localStorage) {
        return;
    }
    noCacheStr = manifest.appVersion ? 'appVersion=' + manifest.appVersion : noCacheStr;
    var storageMF = localStorage[STORAGE_KEY];
    if (!storageMF) {
        removeAllStorage();
    } else {
        storageMF = JSON.parse(storageMF);
        if (storageMF.version !== manifest.version) {
            removeAllStorage();
        } else {
            if (manifest.common && storageMF.common) {
                for (var name in storageMF.common) {
                    if (storageMF.common[name] === manifest.common[name]) {
                        notUpdateList[STORAGE_PR + seajs.resolve(name)] = true;
                    } else {
                        updateList[STORAGE_PR + seajs.resolve(name)] = true;
                    }
                }
            }
            if (storageMF.appVersion !== manifest.appVersion) {
                removeStorageWithoutList(notUpdateList);
            } else {
                removeStorageWithList(updateList);
            }
        }
    }
    localStorage[STORAGE_KEY] = JSON.stringify(manifest);


    // storage
    // keep js file local storage
    var cacheList = {},
        readyList = {},
        waitCacheList = [],
        timer;

    var createScript = function (id, text) {
        var node = doc.createElement('script');
        node.type = 'text/javascript';
        node.id = id;
        node.innerHTML = text;
        doc.body.appendChild(node);
    };
    var storageWaitList = function () {
        var len = waitCacheList.length,
            noReadyList = [];
        for (var i = 0; i < len; i++) {
            var tmp = waitCacheList.pop(),
                funString = '',
                seaCacheTmp = seajs.cache[tmp];
            console.log(tmp);
            if (seaCacheTmp && seaCacheTmp.factory) {
                funString = ';define("' + seaCacheTmp.id + '",' +
                    JSON.stringify(seaCacheTmp.dependencies) + ',' + seaCacheTmp.factory.toString() + ')';
                localStorage[STORAGE_PR + seaCacheTmp.uri] = funString;
            } else {
                noReadyList.push(tmp);
            }
        }
        var tmpLen = noReadyList.length;
        for (var i = 0; i < tmpLen; i++) {
            waitCacheList.push(noReadyList[i]);
        }
    };
    seajs.on('resolve', function (a) {
        var uri = seajs.resolve(a.id, a.refUri),
            storage = localStorage;
        if (uri) {
            if (storage[STORAGE_PR + uri]) {
                if (!readyList[uri]) {
                    readyList[uri] = true;
                    createScript(uri, storage[STORAGE_PR + uri]);
                }
            } else {
                if (!cacheList[uri]) {
                    cacheList[uri] = true;
                    waitCacheList.push(uri);
                }
            }
        }
    });
    seajs.on('fetch', function (a) {
        console.log(a);
        if (!a.requestUri) {
            a.requestUri = a.uri + '?' + noCacheStr;
            return;
        }
        if (a.requestUri.indexOf('?') !== -1) {
            a.requestUri = a.requestUri + '&' + noCacheStr;
        } else {
            a.requestUri = a.requestUri + '?' + noCacheStr;
        }
    });
    seajs.on('define', function (a) {
        clearTimeout(timer);
        timer = setTimeout(storageWaitList, 300);
    });

    window.__seajs_plugin_storage = {
        cacheList: cacheList,
        readyList: readyList,
        waitCacheList: waitCacheList
    };
})(seajs, window, document);
