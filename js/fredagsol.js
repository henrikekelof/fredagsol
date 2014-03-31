
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

    ÖL.getNextFredagsÖl = function () {
        var d = new Date();
        d.setDate(d.getDate() + ((fredagsÖl.d + 7) - d.getDay()) % 7);
        d.setHours(fredagsÖl.h);
        d.setMinutes(fredagsÖl.m);
        d.setSeconds(fredagsÖl.s);
        return d;
    };

    ÖL.isFredagsÖl = function () {
        now = new Date();
        return (now.getDay() === fredagsÖl.d && (now.getHours() > fredagsÖl.h || (now.getHours() === fredagsÖl.h && now.getMinutes() > fredagsÖl.m) || (now.getHours() === fredagsÖl.h && now.getMinutes() === fredagsÖl.m && now.getSeconds() >= fredagsÖl.s)));
    };

}(window, document));
