/*global ÖL */

var FIKA = FIKA || {};

(function(win, doc) {

    'use strict';

    var onsdagsFika, now;

    onsdagsFika = {
        d: 3, // 0 = sunday, 6 = saturday
        h: 15,
        m: 0,
        s: 0
    };

    FIKA.onsdagsFika = onsdagsFika;

    FIKA.getNextOnsdagsFika = function () {
        return ÖL.getNextDatetime(FIKA.onsdagsFika);
    };

    FIKA.isOnsdagsFika = function () {
        return ÖL.isTime(FIKA.onsdagsFika);
    };

}(window, document));
