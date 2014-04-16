
var ÖL = ÖL || {};

(function(win, doc) {

    'use strict';

    var fredagsÖl, now;

    fredagsÖl = {
        d: 5, // 0 = sunday, 6 = saturday
        h: 16,
        m: 30,
        s: 0
    };

    ÖL.fredagsÖl = fredagsÖl;

    ÖL.getNextDatetime = function (weekTime) {
        var d = new Date();
        d.setDate(d.getDate() + ((weekTime.d + 7) - d.getDay()) % 7);
        d.setHours(weekTime.h);
        d.setMinutes(weekTime.m);
        d.setSeconds(weekTime.s);
        return d;
    };

    ÖL.getNextFredagsÖl = function () {
        return ÖL.getNextDatetime(ÖL.fredagsÖl);
    };

    ÖL.isTime = function (weekTime) {
        var sameDay, sameHour, sameMinute, isAfterHour, isAfterMinute, isAfterSeconds;
        now = new Date();
        sameDay = now.getDay() === weekTime.d;
        sameHour = now.getHours() === weekTime.h;
        sameMinute = now.getMinutes() === weekTime.m;
        isAfterHour = now.getHours() > weekTime.h;
        isAfterMinute = now.getMinutes() > weekTime.m;
        isAfterSeconds = now.getSeconds() >= weekTime.s;
        return (sameDay && (isAfterHour || (sameHour && isAfterMinute) || (sameHour && sameMinute && isAfterSeconds)));
    };

    ÖL.isFredagsÖl = function () {
        return ÖL.isTime(ÖL.fredagsÖl);
    };

}(window, document));
