/**
 * Created with WebStorm.
 * Author: xbin
 * Date  : 13-12-30
 * Time  : 下午4:30
 *
 * Describe:
 */
/*global define:false*/
define(function (require, exports, module) {
    'use strict';
    var $ = require('$');

    var util = {
        alert: function (msg) {
            alert(msg);
        },
        log: function (msg) {
            console.log(msg);
        },
        write: function (msg) {
            $('body').append('<p>' + msg + '</p>');
        }
    };

    return util;
});