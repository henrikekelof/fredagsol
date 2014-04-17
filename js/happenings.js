/*global countdown */

var HAPPENING = {};

(function (win, doc) {
    
    'use strict';

    var happeningContainer, clockContainer, nowContainer, notNowContainer,
        d, h, m, s, interval, input,
        happenings, happening, happeningStartDate, happeningEndDate, isCounting;

    
    happeningContainer = doc.getElementById('happening');
    clockContainer = doc.getElementById('clock');
    nowContainer = doc.getElementById('now');
    notNowContainer = doc.getElementById('not-now');

    d = doc.getElementById('d');
    h = doc.getElementById('h');
    m = doc.getElementById('m');
    s = doc.getElementById('s');

    input = win.location.hash,
    
    // 0 = sunday, 6 = saturday
    happenings = [
        {
            name: 'Fredagsöl',
            start: {
                d: 5,
                h: 16,
                m: 30,
                s: 0
            },
            end: {
                d: 5,
                h: 23,
                m: 59,
                s: 59
            }
        },
        {
            name: 'Onsdagsfika',
            start: {
                d: 3,
                h: 15,
                m: 0,
                s: 0
            },
            end: {
                d: 3,
                h: 16,
                m: 0,
                s: 0
            }
        }
    ];

    function displayHappening() {
        clockContainer.style.display = 'none';
        happeningContainer.style.display = 'flex';
        doc.body.className = 'happening';
        doc.getElementById('happeninglabel').innerHTML = happening.name;
    }

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

    function getDate(obj) {
        var d = new Date(),
            n = new Date();
        d.setDate(d.getDate() + ((obj.d + 7) - d.getDay()) % 7);
        d.setHours(obj.h);
        d.setMinutes(obj.m);
        d.setSeconds(obj.s);
        if (d < n) {
            d.setDate(d.getDate() + 7);
        }
        return d;
    }


    function getNextHappening() {
        
        var i, next, previous, current;

        if (happenings.length === 1) {
            return happenings[0];
        }

        previous = getDate(happenings[0].start);
        next = happenings[0];

        for (i = 1; i < happenings.length; i += 1) {
            current = getDate(happenings[i].start);
            if (current < previous) {
                next = happenings[i];
            }
        }

        return next;

    }

    function isHappening() {
        var now = new Date();
        return (happeningStartDate < now && happeningEndDate > now);
    }
    

    function doHappening() {
        if (isHappening()) {
            setTimeout(doHappening, 10000);
        } else {
            initCountdown();
        }
    }

    function countdownToHappening() {

        if (isHappening()) {
            isCounting = false;
            displayHappening();
            doHappening();
        } else {
            if (!isCounting) {
                displayCountdown();
                isCounting = true;
            }
            displayTime(countdown(happeningStartDate));
            win.requestAnimationFrame(countdownToHappening);
        }

    }

    function setNextHappening() {
        happening = getNextHappening();
        happeningStartDate = getDate(happening.start);
        happeningEndDate = getDate(happening.end);
    }

    function initCountdown() {
        if (win.requestAnimationFrame) {
            setNextHappening();
            doc.title = 'When is the next ' + happening.name + '?';
            countdownToHappening(happeningStartDate);
        }

    }

    function isItNow() {
        if (isHappening() && !isCounting) {
            nowContainer.style.display = 'block';
            notNowContainer.style.display = 'none';
            doc.body.className = 'happening';
            isCounting = true;
        }
        if (!isHappening() && isCounting) {
            nowContainer.style.display = 'none';
            notNowContainer.style.display = 'block';
            doc.body.className = '';
            isCounting = false;
        }
    }

    function initIsItNow() {
        if (input) {
            happenings = [];
            parseHappenings(input);
            happenings = [happenings[0]];
            setNextHappening();
            nowContainer.style.display = 'none';
            notNowContainer.style.display = 'block';
            doc.getElementById('now-label-1').innerHTML = happening.name;
            doc.getElementById('now-label-2').innerHTML = happening.name;
            doc.title = 'Is it ' + happening.name + '?';

            interval = setInterval(isItNow, 10000);
        }
    }


    function parseHappenings(s) {
            
        var i, h, tStart, tEnd;

        if (s.substring(0, 1) === '#') {
            s = s.substr(1);
        }

        s = s.split('|');

        // Check if input is predefined happening
        if (s.length === 1 && s[0].split(';').length === 1) {
            for (i = 0; i < happenings.length; i += 1) {
                if (happenings[i].name === s[0]) {
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

    if (input) {
        parseHappenings(input);
    }

    
    HAPPENING.initCountdown = initCountdown;
    HAPPENING.initIsItNow = initIsItNow;

    
}(window, document));

