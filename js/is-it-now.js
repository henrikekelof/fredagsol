/*global ÖL */

(function(win, doc) {

    'use strict';

    var now, notNow, interval,
        fredagsÖlSet;

    function $$(id) {
        return doc.getElementById(id);
    }

    now = $$('now');
    notNow = $$('not-now');

    function isItNow() {
        if (ÖL.isFredagsÖl() && !fredagsÖlSet) {
            now.style.display = 'block';
            notNow.style.display = 'none';
            doc.body.className = 'party';
            fredagsÖlSet = true;
        }
        if (!ÖL.isFredagsÖl() && fredagsÖlSet) {
            now.style.display = 'none';
            notNow.style.display = 'block';
            doc.body.className = '';
            fredagsÖlSet = false;
        }
    }

    interval = setInterval(isItNow, 10000);

    now.style.display = 'none';
    notNow.style.display = 'block';
    doc.body.className = '';
    fredagsÖlSet = false;

    isItNow();

}(window, document));
