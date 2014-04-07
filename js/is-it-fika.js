/*global FIKA */

(function(win, doc) {

    'use strict';

    var now, notNow, interval,
        onsdagsFikaSet;

    function $$(id) {
        return doc.getElementById(id);
    }

    now = $$('now');
    notNow = $$('not-now');

    function isItNow() {
        if (FIKA.isOnsdagsFika() && !onsdagsFikaSet) {
            now.style.display = 'block';
            notNow.style.display = 'none';
            doc.body.className = 'party';
            onsdagsFikaSet = true;
        }
        if (!FIKA.isOnsdagsFika() && onsdagsFikaSet) {
            now.style.display = 'none';
            notNow.style.display = 'block';
            doc.body.className = '';
            onsdagsFikaSet = false;
        }
    }

    interval = setInterval(isItNow, 10000);

    now.style.display = 'none';
    notNow.style.display = 'block';
    doc.body.className = '';
    onsdagsFikaSet = false;

    isItNow();

}(window, document));
