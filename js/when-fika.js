/*global ÖL, FIKA */

(function(win, doc) {

    'use strict';

    var timerSet, nextFriday, nextWednesday,
        party, clock,
        fridayCounter, wednesdayCounter,
        d, h, m, s, interval;

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

    function displayLabel(fika) {
        var title, clocklabel, partylabel;
        title = 'When is the next ' + (fika ? 'Onsdagsfika?': 'Fredagsöl?');
        clocklabel = 'Next ' + (fika ? 'onsdagsfika:' : 'fredagsöl:');
        partylabel = (fika ? 'Onsdagsfika' : 'Fredagsöl') + ' is now!'
        doc.title = title;
        $$('clocklabel').innerHTML = clocklabel;
        $$('partylabel').innerHTML = partylabel;
    }

    function run() {
        var fikaApproaching;
        if (ÖL.isFredagsÖl() || FIKA.isOnsdagsFika()) {
            timerSet = false;
            displayLabel(FIKA.isOnsdagsFika());
            doParty();
            interval = setInterval(run, 60000);
        } else {
            if (!timerSet) {
                stopParty();
                nextFriday = ÖL.getNextFredagsÖl();
                nextWednesday = FIKA.getNextOnsdagsFika();
            }
            fridayCounter = countdown(nextFriday);
            wednesdayCounter = countdown(nextWednesday);
            fikaApproaching = wednesdayCounter.days < fridayCounter.days;
            displayTime(fikaApproaching ? wednesdayCounter : fridayCounter);
            displayLabel(fikaApproaching);
            requestAnimationFrame(run);
        }
    }

    if (window.requestAnimationFrame) {
        run();
    }

}(window, document));
