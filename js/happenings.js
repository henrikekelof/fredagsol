/*global countdown */

var H = {};

(function (win) {

    'use strict';

    var input = win.location.hash,
        defaultHappenings, happenings, i;

    defaultHappenings = [
        {
            name: 'Fredagsöl',
            start: { d: 5, h: 16, m: 30, s: 0 },
            end: { d: 5, h: 23, m: 59, s: 11 }
        },
        {
            name: 'Onsdagsfika',
            start: { d: 3, h: 15, m: 0, s: 0 },
            end: { d: 3, h: 15, m: 30, s: 11 }
        },
        {
            name: 'Måndagsfrukost',
            start: { d: 1, h: 8, m: 30, s: 0 },
            end: { d: 1, h: 9, m: 0, s: 11 }
        },
        {
            name: 'i Loungen',
            start: { d: 1, h: 14, m: 0, s: 0 },
            end: { d: 1, h: 14, m: 59, s: 11 }
        }
    ];

    happenings = defaultHappenings.slice(0);

    function getHappeningsFromUrl(s) {

        var i, h, tStart, tEnd;

        if (s.substring(0, 1) === '#') {
            s = s.substr(1);
        }

        s = s.split('|');

        // Check if input is predefined happening
        if (s.length === 1 && s[0].split(';').length === 1) {
            for (i = 0; i < happenings.length; i += 1) {
                if (happenings[i].name === decodeURIComponent(s[0])) {
                    happenings = [happenings[i]];
                    return;
                }
            }
            return;
        }

        for (i = 0; i < s.length; i += 1) {
            h = s[i].split(';');
            tStart = h[0].split('-');
            tEnd = h[1].split('-');
            if (h.length !== 3 || tStart.length !== 4 || tEnd.length !== 4) {
                break;
            }
            happenings.push({
                name: h[2],
                start: {
                    d: parseInt(tStart[0], 10),
                    h: parseInt(tStart[1], 10),
                    m: parseInt(tStart[2], 10),
                    s: parseInt(tStart[3], 10)
                },
                end: {
                    d: parseInt(tEnd[0], 10),
                    h: parseInt(tEnd[1], 10),
                    m: parseInt(tEnd[2], 10),
                    s: parseInt(tEnd[3], 10)
                }
            });
        }

    }

    function Happening(h) {

        function getDate(obj) {
            var d = new Date();
            d.setDate(d.getDate() + ((obj.d + 7) - d.getDay()) % 7);
            d.setHours(obj.h);
            d.setMinutes(obj.m);
            d.setSeconds(obj.s);
            return d;
        }

        var happening = this;

        this.name = h.name;

        this.startDate = function () {

            var now = new Date(),
                start = getDate(h.start),
                end = getDate(h.end);

            if (end < now) {
                start.setDate(start.getDate() + 7);
            }

            return start;

        };

        this.endDate  = function () {

            var now = new Date(),
                end = getDate(h.end);

            if (end < now) {
                end.setDate(end.getDate() + 7);
            }

            return end;

        };

        this.isHappening = function () {
            var now = new Date();
            return (happening.startDate() <= now && happening.endDate() > now);
        };

    }

    if (input) {
        getHappeningsFromUrl(input);
    }

    function getNextHappening() {

        var i, nextHappening, diff,
            now  = new Date(),
            smallestDiff = 605000000; // More than one week

        
        for (i = 0; i < H.happenings.length; i += 1) {
            
            // Happening now?
            if (H.happenings[i].isHappening()) {
                return H.happenings[i];
            }

            diff = H.happenings[i].startDate() - now;

            if (diff < smallestDiff) {
                nextHappening = H.happenings[i];
                smallestDiff = diff;
            }
        }

        return nextHappening;

    }

    function setSingleHappening() {
        if (happenings.length > defaultHappenings.length) {
            H.happenings = [new Happening(happenings[happenings.length - 1])];
        } else {
            H.happenings = [new Happening(happenings[0])];
        }
    }

    H.happenings = [];

    for (i = 0; i < happenings.length; i += 1) {
        H.happenings.push(new Happening(happenings[i]));
    }

    H.getNextHappening = getNextHappening;
    H.setSingleHappening = setSingleHappening;


}(window));



(function (win, doc) {

    'use strict';

    var happeningContainer, clockContainer, nowContainer, notNowContainer,
        happening, isCounting, happeningStartDate,
        d, h, m, s;

    happeningContainer = doc.getElementById('happening');
    clockContainer = doc.getElementById('clock');
    nowContainer = doc.getElementById('now');
    notNowContainer = doc.getElementById('not-now');

    d = doc.getElementById('d');
    h = doc.getElementById('h');
    m = doc.getElementById('m');
    s = doc.getElementById('s');

    function displayCountdown() {
        clockContainer.style.display = 'flex';
        happeningContainer.style.display = 'none';
        doc.body.className = '';
        doc.getElementById('clocklabel').innerHTML = happening.name;
    }

    function displayTime(c) {
        d.innerHTML = c.days;
        h.innerHTML = c.hours;
        m.innerHTML = c.minutes;
        s.innerHTML = c.seconds;
    }

    function displayHappening() {
        clockContainer.style.display = 'none';
        happeningContainer.style.display = 'flex';
        doc.body.className = 'happening';
        doc.getElementById('happeninglabel').innerHTML = happening.name;
    }

    function countownToHappeningEnd() {
        if (happening.isHappening()) {
            setTimeout(countownToHappeningEnd, 10000);
        } else {
            H.count();
        }
    }

    function countdownToHappening() {

        if (happening.isHappening()) {
            isCounting = false;
            displayHappening();
            countownToHappeningEnd();
        } else {
            if (!isCounting) {
                displayCountdown();
                isCounting = true;
            }
            displayTime(countdown(happeningStartDate));
            win.requestAnimationFrame(countdownToHappening);
        }

    }



    H.count = function () {
        if (win.requestAnimationFrame) {
            happening = H.getNextHappening();
            happeningStartDate = happening.startDate();
            doc.title = 'When is the next ' + happening.name + '?';
            countdownToHappening();
        }

    };

    // Is it now?

    function checkForHappeningEnd() {
        if (happening.isHappening()) {
            setTimeout(checkForHappeningEnd, 10000);
        } else {
            nowContainer.style.display = 'none';
            notNowContainer.style.display = 'block';
            doc.body.className = '';
            checkForHappening();
        }
    }

    function checkForHappening() {
        if (happening.isHappening()) {
            nowContainer.style.display = 'block';
            notNowContainer.style.display = 'none';
            doc.body.className = 'happening';
            checkForHappeningEnd();
        } else {
            setTimeout(checkForHappening, 1000);
        }
    }


    H.check = function () {

        H.setSingleHappening();
        happening = H.getNextHappening();

        nowContainer.style.display = 'none';
        notNowContainer.style.display = 'block';
        doc.getElementById('now-label-1').innerHTML = happening.name;
        doc.getElementById('now-label-2').innerHTML = happening.name;
        doc.title = 'Is it ' + happening.name + '?';

        checkForHappening();

    };


}(window, document));
