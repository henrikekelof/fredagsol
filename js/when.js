/*global ÖL */

(function(win, doc) {

    'use strict';

    var timerSet, nextFriday,
        party, clock,
        counter, d, h, m, s, interval;

    function $$(id) {
        return doc.getElementById(id);
    }

    party = $$('party');
    clock = $$('clock');
    d = $$('d');
    h = $$('h');
    m = $$('m');
    s = $$('s');

    function doParty() {
        clock.style.display = 'none';
        party.style.display = 'flex';
        doc.body.className = 'party';
    }

    function stopParty() {
        clock.style.display = 'flex';
        party.style.display = 'none';
        doc.body.className = '';
        clearInterval(interval);
    }

    function displayTime(c) {
        d.innerHTML = c.days;
        h.innerHTML = c.hours;
        m.innerHTML = c.minutes;
        s.innerHTML = c.seconds;
    }

    function run() {
        if (ÖL.isFredagsÖl()) {
            timerSet = false;
            doParty();
            interval = setInterval(run, 60000);
        } else {
            if (!timerSet) {
                stopParty();
                nextFriday = ÖL.getNextFredagsÖl();
            }
            counter = countdown(nextFriday);
            displayTime(counter);
            requestAnimationFrame(run);
        }
    }

    if (window.requestAnimationFrame) {
        run();
    }

}(window, document));
