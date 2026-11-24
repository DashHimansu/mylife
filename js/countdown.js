/* Countdown logic & Calendar export. Birthday = 27 November every year, in IST (UTC+5:30). */
(function () {
  var MONTH = 10, DAY = 27; // month is 0-based: 10 = November
  var OFF = 330 * 60000;    // IST offset in ms

  function state(now, force) {
    now = now || Date.now();
    var y = new Date(now + OFF).getUTCFullYear();
    var start = Date.UTC(y, MONTH, DAY) - OFF;             // 27 Nov 00:00 IST
    var end = start + 864e5;                               // 28 Nov 00:00 IST
    if (force || (now >= start && now < end)) {
      return { mode: 'birthday', target: start, year: y };
    }
    var ty = now < start ? y : y + 1;
    return { mode: 'count', target: Date.UTC(ty, MONTH, DAY) - OFF, year: ty };
  }

  function parts(ms) {
    ms = Math.max(0, ms);
    return {
      d: Math.floor(ms / 864e5),
      h: Math.floor(ms / 36e5) % 24,
      m: Math.floor(ms / 6e4) % 60,
      s: Math.floor(ms / 1e3) % 60
    };
  }

  // Generates and triggers download of .ics file for iPhone & Android Calendar
  function downloadCalendarEvent() {
    var s = state();
    var yr = s.year || new Date().getFullYear();
    var dtStr = yr + '1127';
    var icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Birthday Surprise//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:bday-naina-' + yr + '@surprise.love',
      'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART;VALUE=DATE:' + dtStr,
      'DTEND;VALUE=DATE:' + dtStr,
      'SUMMARY:🎂 Happy Birthday Naina! ❤️',
      'DESCRIPTION:Today is the special day celebrating the wonderful Naina! Don\'t forget to shower her with love and smiles! ✨',
      'LOCATION:Celebration Central ❤️',
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT9H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Happy Birthday Naina! 🎉',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    var blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'Birthday_Naina.ics';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 250);
  }

  function getGoogleCalendarUrl() {
    var s = state();
    var yr = s.year || new Date().getFullYear();
    var start = yr + '1127';
    var end = yr + '1128';
    var title = encodeURIComponent('🎂 Happy Birthday Naina! ❤️');
    var details = encodeURIComponent('Today is the special day celebrating the wonderful Naina! Don\'t forget to shower her with all the love in the world! ✨');
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + title + '&dates=' + start + '/' + end + '&details=' + details;
  }

  window.Countdown = {
    state: state,
    parts: parts,
    downloadCalendarEvent: downloadCalendarEvent,
    getGoogleCalendarUrl: getGoogleCalendarUrl
  };
})();
