/* ============================================================
   CONFIG & INTERACTIVE SURPRISE LOGIC FOR NAINA ❤️
   ============================================================ */

var CONFIG = {
  // Photos: All 9 personalized photos for Naina
  photos: [
    {
      src: 'assets/images/naina1.jpg?v=2',
      cap: 'That radiant smile that lights up the world ✨',
      secret: 'Your gentle warmth and effortless grace make every single moment brighter.'
    },
    {
      src: 'assets/images/naina2.jpg?v=2',
      cap: 'Soft grace and quiet beauty 🌸',
      secret: 'In every shy smile and soft glance, there is a poetry that words can never capture.'
    },
    {
      src: 'assets/images/naina3.jpg?v=2',
      cap: 'Elegance personified, always and forever 💫',
      secret: 'Standing tall, looking gorgeous, and making everyday places feel magical.'
    },
    {
      src: 'assets/images/naina4.jpg?v=2',
      cap: 'Vibrant colors and unmatched charm ❤️',
      secret: 'Bright, bold, and breathtaking—no color in the world shines quite like you do.'
    },
    {
      src: 'assets/images/naina5.jpg?v=2',
      cap: 'Cozy cafe vibes and sweetest conversations ☕',
      secret: 'Sitting across from you, talking about everything and nothing—pure comfort.'
    },
    {
      src: 'assets/images/naina6.jpg?v=2',
      cap: 'Pure innocence and mehendi whispers 🌿',
      secret: 'The sweetest soul, with hands colored in love and a heart of pure gold.'
    },
    {
      src: 'assets/images/naina7.jpg?v=2',
      cap: 'Cinematic moments and spontaneous fun 🎬',
      secret: 'Every movie date, every casual stroll, and every silly laugh is a memory to keep.'
    },
    {
      src: 'assets/images/naina8.jpg?v=2',
      cap: 'Classic beauty with an unforgettable aura 🏛️',
      secret: 'Effortlessly timeless and captivating—your presence brings calm and joy.'
    },
    {
      src: 'assets/images/naina9.jpg?v=2',
      cap: 'Sun-kissed glow and endless sparkle ✨',
      secret: 'That playful sparkle in your eyes makes the whole universe feel just right.'
    }
  ],

  memories: [
    {
      title: 'Where It All Began',
      text: 'The beginning of a bond that brought so much comfort, laughter, and light into life.',
      src: 'assets/images/naina1.jpg?v=2'
    },
    {
      title: 'Unforgettable Days & Adventures',
      text: 'The shared smiles, the spontaneous talks, and the little inside jokes that make every day special.',
      src: 'assets/images/naina5.jpg?v=2'
    },
    {
      title: 'Today, Tomorrow & Always',
      text: 'Still standing by you, cheering you on, and celebrating you with all our hearts.',
      src: 'assets/images/naina9.jpg?v=2'
    }
  ],

  celebrate: 'Today the whole universe shines a little brighter because it’s your special day. Make a secret wish and blow out the candles! 🌟',

  letter: 'Dearest Naina,\n\nHappy Birthday to the most wonderful soul!\n\nThank you for every burst of laughter, every quiet moment of understanding, and for simply being the genuine, beautiful person you are.\n\nYou make ordinary days feel extraordinary, and you bring a kind of warmth and brightness into the world that nobody else can.\n\nI hope this year brings you unmeasurable happiness, peace, success, and every single dream your heart holds.\n\nWith all my love and blessings,\nAlways ❤️',

  finalMessage: 'You are cherished beyond words,\nloved more than you will ever know,\nand celebrated today and every single day.\n\nHappy Birthday, Naina! 🎂❤️',

  // Bollywood Music Settings
  musicTrack: 'Tose Naina Jab Se Mile (For Naina) ❤️',
  musicFile: 'assets/music/tose_naina.wav'
};

/* ============================================================
   APPLICATION CORE
   ============================================================ */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var forceCelebration = /[?&]mode=birthday/.test(location.search);
  var mode = null, target = 0, partyInterval = null;
  var typewriterActive = false, typewriterFullText = '';

  function toast(msg) {
    var t = $('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('on'); }, 3400);
  }

  function type(el, text, onDone) {
    typewriterFullText = text;
    typewriterActive = true;
    if (RM) {
      el.textContent = text;
      typewriterActive = false;
      if (onDone) onDone();
      return;
    }
    var i = 0;
    el.textContent = '';
    el.classList.add('cur');
    (function step() {
      if (!typewriterActive) {
        el.textContent = typewriterFullText;
        el.classList.remove('cur');
        if (onDone) onDone();
        return;
      }
      el.textContent = text.slice(0, ++i);
      if (i < text.length) {
        setTimeout(step, 32);
      } else {
        el.classList.remove('cur');
        typewriterActive = false;
        if (onDone) onDone();
      }
    })();
  }

  // ============ COUNTDOWN & PARTY LOGIC ============
  function setNum(id, val) {
    var el = $(id);
    if (!el) return;
    var s = String(val).padStart(2, '0');
    if (el.textContent !== s) {
      el.textContent = s;
      el.classList.remove('t');
      void el.offsetWidth;
      el.classList.add('t');
    }
  }

  function tick() {
    var s = Countdown.state(null, forceCelebration);
    if (s.mode !== mode) {
      mode = s.mode;
      $('count').hidden = (mode !== 'count');
      $('bday').hidden = (mode !== 'birthday');
      var bdayPill = $('navBdayPill');
      if (bdayPill) bdayPill.hidden = (mode !== 'birthday');

      if (mode === 'birthday') {
        startParty();
      } else if (partyInterval) {
        clearInterval(partyInterval);
        partyInterval = null;
      }
    }
    if (mode === 'count') {
      target = s.target;
      var p = Countdown.parts(target - Date.now());
      setNum('cd-d', p.d);
      setNum('cd-h', p.h);
      setNum('cd-m', p.m);
      setNum('cd-s', p.s);
      var whenEl = $('when');
      if (whenEl) {
        whenEl.textContent = new Date(target).toLocaleDateString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    }
  }

  function startParty() {
    var msg = $('celebrateMsg');
    if (msg) msg.textContent = CONFIG.celebrate;
    FX.balloons(14);
    FX.confetti(window.innerWidth / 2, window.innerHeight / 3, 220);
    FX.fireworks(8);
    FX.playCheer();
    if (!partyInterval) {
      partyInterval = setInterval(function () {
        FX.fireworks(3);
        FX.confetti(Math.random() * window.innerWidth, 0, 50);
      }, 7500);
    }
  }

  // Action: Celebrate Right Now button
  $('partyBtn').onclick = function () {
    forceCelebration = true;
    FX.playCheer();
    FX.vibrate(40);
    tick();
    toast('🎉 Opening Birthday Celebration Mode! 🎂');
    $('bday').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
  };

  // Action: Send Virtual Hug button
  var hugs = 18;
  $('hugBtn').onclick = function () {
    hugs++;
    var countEl = $('hugCount');
    if (countEl) countEl.textContent = hugs;
    FX.playHarp();
    FX.vibrate(25);
    var rect = this.getBoundingClientRect();
    FX.spawnFloatingHeart(rect.left + rect.width / 2, rect.top, '🤗');
    FX.spawnFloatingHeart(rect.left + rect.width / 2 + 20, rect.top - 20, '💖');
    FX.confetti(rect.left + rect.width / 2, rect.top, 25);
    toast('🤗 You sent Naina a warm hug #' + hugs + '! 💕');
  };

  // Action: Save to Phone Calendar
  $('calBtn').onclick = function () {
    FX.playChime();
    FX.vibrate(20);
    Countdown.downloadCalendarEvent();
    toast('📅 Downloading birthday reminder! 📲');
  };

  // ============ CELEBRATION & CAKE CEREMONY ============
  var candlesBlown = false;
  $('blowCandlesBtn').onclick = function () {
    if (candlesBlown) {
      toast('Candles are already blown! Cut the cake now! 🍰');
      return;
    }
    candlesBlown = true;
    this.disabled = true;
    this.innerHTML = '<span>✨ Wish Made! Candles Blown! 💨</span>';

    // Blow flames & create smoke
    document.querySelectorAll('.candle').forEach(function (c) {
      c.classList.add('blown');
      var r = c.getBoundingClientRect();
      FX.smoke(r.left + r.width / 2, r.top, 20);
    });

    FX.playBlow();
    FX.vibrate([30, 50, 40]);

    setTimeout(function () {
      FX.playCheer();
      FX.confetti(window.innerWidth / 2, window.innerHeight * 0.45, 200);
      FX.fireworks(6);
      toast('🎉 May every wish you whispered come true! ✨');
      var cutBtn = $('cutCakeBtn');
      if (cutBtn) {
        cutBtn.disabled = false;
        cutBtn.classList.add('pulse-btn');
      }
    }, 500);
  };

  $('cutCakeBtn').onclick = function () {
    FX.playCakeCut();
    FX.vibrate(35);
    this.disabled = true;
    this.innerHTML = '<span>🍰 Cake Sliced with Love!</span>';
    var slice = $('servedSlice');
    if (slice) {
      slice.hidden = false;
      var r = slice.getBoundingClientRect();
      FX.confetti(r.left + r.width / 2, r.top + 20, 60);
      FX.spark(r.left + r.width / 2, r.top + 20, 40);
    }
    toast('🍰 Serving the first slice of sweetness to Naina! ❤️');
  };

  $('popBalloonsBtn').onclick = function () {
    FX.popAllBalloons();
    toast('🎈 Pop! Pop! Balloons burst with confetti! 🥳');
  };

  // singSongBtn removed

  // ============ GALLERY ACTIONS ============
  $('storyModeBtn').onclick = function () {
    FX.playChime();
    Gallery.openStory(0);
  };

  $('loveAllBtn').onclick = function () {
    FX.playHarp();
    FX.vibrate(30);
    document.querySelectorAll('.ph-like-btn').forEach(function (btn) {
      btn.click();
    });
    FX.confetti(window.innerWidth / 2, window.innerHeight * 0.6, 90);
    toast('💖 Showered all photos with infinite love! 🥰');
  };

  // ============ LETTER ACTIONS ============
  function openEnvelope() {
    var e = $('env');
    if (e.classList.contains('open')) return;
    e.classList.add('open');
    FX.playChime();
    FX.vibrate(30);
    var r = e.getBoundingClientRect();
    FX.spark(r.left + r.width / 2, r.top + 90, 40);

    setTimeout(function () {
      $('letter').classList.add('show');
      $('letterActions').hidden = false;
      type($('lt'), CONFIG.letter, function () {
        $('quickReadBtn').hidden = true;
      });
      // Setup WhatsApp reply link
      var replyText = encodeURIComponent('Happy Birthday Naina! ❤️ I just read your heartfelt letter and it touched my heart so much! Thank you for this beautiful surprise! 🎂✨');
      $('replyLetterBtn').href = 'https://api.whatsapp.com/send?text=' + replyText;
    }, 850);
  }

  $('env').onclick = openEnvelope;
  $('env').onkeydown = function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  };

  $('quickReadBtn').onclick = function () {
    typewriterActive = false;
    $('lt').textContent = typewriterFullText;
    $('quickReadBtn').hidden = true;
    FX.playChime();
  };

  // ============ BIRTHDAY COUPONS REDEMPTION ============
  document.querySelectorAll('.btn-coupon-redeem').forEach(function (btn) {
    btn.onclick = function (e) {
      e.stopPropagation();
      var card = this.closest('.coupon-card');
      var name = this.getAttribute('data-name');
      var stamp = card.querySelector('.coupon-stamp');

      if (!card.classList.contains('claimed')) {
        card.classList.add('claimed');
        if (stamp) stamp.hidden = false;
        this.classList.add('claimed');
        this.innerHTML = '<span>📲 Claim on WhatsApp</span>';

        FX.playCheer();
        FX.vibrate(40);
        var rect = card.getBoundingClientRect();
        FX.confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
        toast('🎉 Coupon Claimed! Tap again to confirm on WhatsApp! 📲');
      } else {
        // Open WhatsApp with coupon claim message
        var claimMsg = encodeURIComponent('Hey! I am officially redeeming my Birthday Coupon: "' + name + '"! When are we planning this? 🥳✨❤️');
        window.open('https://api.whatsapp.com/send?text=' + claimMsg, '_blank');
      }
    };
  });

  // ============ FINAL MYSTERY GIFT ============
  $('giftBtn').onclick = function () {
    var b = this, g = $('gift');
    b.disabled = true;
    g.classList.add('shake');
    FX.playPop();
    FX.vibrate(30);

    setTimeout(function () {
      g.classList.remove('shake');
      g.classList.add('open');
      var r = g.getBoundingClientRect();
      FX.playCheer();
      FX.confetti(r.left + 70, r.top + 30, 240);
      FX.spark(r.left + 70, r.top + 30, 80);
      FX.fireworks(8);

      $('final').classList.add('show');
      type($('ft'), CONFIG.finalMessage);
      $('final').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
    }, 950);
  };
  $('gift').onclick = function () {
    if (!$('giftBtn').disabled) $('giftBtn').click();
  };

  // ============ COSMIC WISH MAKER ============
  document.querySelectorAll('.wish-pill').forEach(function (pill) {
    pill.onclick = function () {
      document.querySelectorAll('.wish-pill').forEach(function (p) { p.classList.remove('active'); });
      this.classList.add('active');
      $('wishInput').value = this.getAttribute('data-wish');
      FX.playChime();
    };
  });

  $('sendWishBtn').onclick = function () {
    var val = $('wishInput').value.trim();
    if (!val) {
      val = 'May your year be filled with radiant health, joy, and dreams coming true! 🌸';
    }
    FX.playHarp();
    FX.vibrate([20, 40, 20]);
    FX.fireworks(5);
    FX.confetti(window.innerWidth / 2, window.innerHeight * 0.3, 100);
    toast('🌠 Your wish has been launched into the cosmos for Naina! ✨');
    $('wishInput').value = '';
    document.querySelectorAll('.wish-pill').forEach(function (p) { p.classList.remove('active'); });
  };

  $('fireworksBtn').onclick = function () {
    FX.fireworks(8);
    FX.playCheer();
    FX.vibrate(35);
    toast('🎆 Spectacular Sky Fireworks launched! 🎇');
  };

  $('shareBtn').onclick = function () {
    var shareData = {
      title: 'A Surprise for Naina ❤️',
      text: 'Look at this special birthday surprise crafted with love for Naina! 🎂✨',
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(function () {});
    } else {
      var waUrl = 'https://api.whatsapp.com/send?text=' + encodeURIComponent(shareData.text + ' ' + shareData.url);
      window.open(waUrl, '_blank');
    }
  };

  $('replayBtn').onclick = function () {
    window.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });
    FX.playChime();
    FX.confetti(window.innerWidth / 2, 200, 60);
  };

  // ============ MUSIC & FLOATING DOCK ============
  var audio = null, isPlaying = false;
  function updateMusicUI() {
    var btn = $('musicBtn');
    if (!btn) return;
    btn.setAttribute('aria-pressed', isPlaying);
    btn.classList.toggle('playing', isPlaying);
  }

  function toggleMusic(wantPlay) {
    if (audio) {
      audio.pause();
      audio = null;
    }
    isPlaying = false;
  }

  // musicBtn removed

  // vol input removed

  // Dock Hug Button
  $('dockHugBtn').onclick = function () {
    $('hugBtn').click();
  };

  // Dock Chapters Menu Button
  $('dockNavBtn').onclick = function () {
    var drawer = $('quickNavDrawer');
    if (drawer) {
      drawer.hidden = !drawer.hidden;
      FX.playChime();
    }
  };
  $('closeDrawerBtn').onclick = function () {
    $('quickNavDrawer').hidden = true;
  };
  document.querySelectorAll('.drawer-link').forEach(function (link) {
    link.onclick = function () {
      $('quickNavDrawer').hidden = true;
    };
  });

  // ============ WELCOME BUTTON UNWRAP ============
  $('openBtn').onclick = function () {
    $('welcome').classList.add('out');
    $('app').classList.add('on');
    $('dock').classList.add('on');
    $('journeyHeader').hidden = false;

    window.scrollTo(0, 0);
    FX.playCheer();
    FX.vibrate([30, 40, 50]);
    FX.confetti(window.innerWidth / 2, window.innerHeight / 2, 120);
    FX.hearts();
    // sound disabled

    setTimeout(function () {
      FX.observeAll();
      document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('show'); });
    }, 150);

    setTimeout(function () {
      $('welcome').remove();
    }, 1200);
  };

  // ============ JOURNEY ACTIVE PILL TRACKING ============
  var navPills = document.querySelectorAll('.journey-pill');
  window.addEventListener('scroll', function () {
    var fromTop = window.scrollY + 140;
    navPills.forEach(function (pill) {
      var targetId = pill.getAttribute('data-target');
      var sec = $(targetId);
      if (sec && !sec.hidden) {
        if (sec.offsetTop <= fromTop && sec.offsetTop + sec.offsetHeight > fromTop) {
          pill.classList.add('active');
        } else {
          pill.classList.remove('active');
        }
      }
    });
  }, { passive: true });

  // ============ INITIALIZE ============
  try {
    if (window.Gallery && typeof window.Gallery.init === 'function') {
      window.Gallery.init(CONFIG.photos);
    }
  } catch (err) {
    console.error('Gallery init error:', err);
  }

  try {
    if (window.Gallery && typeof window.Gallery.memories === 'function') {
      window.Gallery.memories(CONFIG.memories);
    }
  } catch (err) {
    console.error('Memories init error:', err);
  }

  try {
    document.querySelectorAll('img').forEach(function (im) {
      if (window.Gallery && window.Gallery.safe) window.Gallery.safe(im);
    });
    document.querySelectorAll('.card').forEach(FX.tilt);
    document.querySelectorAll('#letterSec > *, #surprise > *, #wishSec > *, #couponsSec > *').forEach(function (el) {
      el.classList.add('rv');
    });
    FX.observeAll();
  } catch (err) {
    console.error('FX init error:', err);
  }

  // Guaranteed countdown tick
  try {
    tick();
    setInterval(tick, 1000);
  } catch (err) {
    console.error('Countdown tick error:', err);
  }
})();
