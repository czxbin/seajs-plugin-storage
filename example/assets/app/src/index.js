/**
 * Created with WebStorm.
 * Author: xbin
 * Date  : 13-12-30
 * Time  : 下午4:33
 *
 * Describe:
 */
/*global define:false*/
define(function (require, exports, module) {
    'use strict';
    var $ = require('$'),
        util = require('util'),
        backbone = require('backbone');

    $(function () {
        $('body').append('<h3 id="waiting">waiting...</h3>');
        setTimeout(function () {
            $('#waiting').html('the localStorage now:');
            $('body').append('<div id="wrap"></div>');
            for (var name in localStorage) {
                var html = '<div class="item"><p><b>Name:</b>' + name + '</p>' +
                    '<p><b>Value:</b>' + encodeURIComponent(localStorage[name]) + '</p>' +
                    '</div>';
                $('#wrap').append(html);
            }
        }, 3000);
    });

});