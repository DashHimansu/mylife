/* Visual & Audio Effects: stars, shooting stars, confetti, fireworks, smoke,
   interactive balloons, touch sparkles, haptics & Web Audio synthesizer. */
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bg = document.getElementById('bg'), fx = document.getElementById('fx');
  var bx = bg.getContext('2d'), fc = fx.getContext('2d');
  var W, H, stars = [], shootingStars = [], P = [];
  var COL = ['#ff8fc2', '#b79cff', '#f4d58d', '#ffffff', '#ff5fa2', '#8fd3ff', '#ffd166', '#06d6a0'];

  // ============ WEB AUDIO SYNTHESIZER ============
  var audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, duration, type, gainVal, delay) {
    var ctx = getAudioCtx();
    if (!ctx) return;
    delay = delay || 0;
    var t = ctx.currentTime + delay;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(gainVal || 0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  function playChime() {
    var ctx = getAudioCtx(); if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
      playTone(f, 0.4, 'sine', 0.1, i * 0.05);
    });
  }

  function playHarp() {
    var ctx = getAudioCtx(); if (!ctx) return;
    [329.63, 440, 554.37, 659.25, 880].forEach(function (f, i) {
      playTone(f, 0.6, 'sine', 0.12, i * 0.06);
    });
  }

  function playPop() {
    var ctx = getAudioCtx(); if (!ctx) return;
    var t = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.08);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.08);
  }

  function playBlow() {
    var ctx = getAudioCtx(); if (!ctx) return;
    var t = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.5);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.5);
  }

  function playCheer() {
    var ctx = getAudioCtx(); if (!ctx) return;
    // Triumphant fanfare: C4, E4, G4, C5, E5, G5
    var notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    notes.forEach(function (f, i) {
      playTone(f, 0.8, 'triangle', 0.15, i * 0.09);
    });
    setTimeout(function () {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f) {
        playTone(f, 1.2, 'sine', 0.18, 0);
      });
    }, 600);
  }

  function playCakeCut() {
    var ctx = getAudioCtx(); if (!ctx) return;
    [440, 554.37, 659.25, 880, 1108.7].forEach(function (f, i) {
      playTone(f, 0.5, 'sine', 0.12, i * 0.07);
    });
  }

  function playArrow() {
    var ctx = getAudioCtx(); if (!ctx) return;
    var t = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(950, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.16);
    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.16);
  }

  function playCrack() {
    var ctx = getAudioCtx(); if (!ctx) return;
    var t = ctx.currentTime;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1500, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.08);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.08);
    playTone(95, 0.12, 'sine', 0.25, 0.01);
  }

  function playShutter() {
    var ctx = getAudioCtx(); if (!ctx) return;
    playTone(1900, 0.035, 'sine', 0.22, 0);
    playTone(850, 0.07, 'triangle', 0.25, 0.06);
  }

  function playIgnite() {
    var ctx = getAudioCtx(); if (!ctx) return;
    [587.33, 739.99, 880, 1174.66].forEach(function (f, i) {
      playTone(f, 0.28, 'sine', 0.12, i * 0.04);
    });
  }

  function screenFlash() {
    var el = document.createElement('div');
    el.className = 'screen-flash-overlay';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 650);
  }

  function lanterns(count) {
    count = count || 8;
    for (var i = 0; i < count; i++) {
      var l = document.createElement('div');
      l.className = 'floating-lantern';
      l.textContent = '🏮';
      l.style.left = (Math.random() * 90 + 5) + 'vw';
      l.style.fontSize = (24 + Math.random() * 18) + 'px';
      l.style.animationDuration = (8 + Math.random() * 6) + 's';
      l.style.animationDelay = (i * 0.35) + 's';
      document.body.appendChild(l);
      setTimeout(function () { l.remove(); }, 15000);
    }
  }

  // ============ BOLLYWOOD ACOUSTIC SYNTHESIZER ============
  // "Tose Naina Jab Se Mile" (Mickey Virus / Arijit Singh) - Dedicated to Naina ❤️
  function playToseNainaMelody() {
    var ctx = getAudioCtx(); if (!ctx) return;

    var D2 = 73.42, G2 = 98.00, A2 = 110.00, Bb2 = 116.54, C3 = 130.81, D3 = 146.83;
    var A3 = 220.00, C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25, D5 = 587.33;

    var melody = [
      // Chorus 1: "Tose naina jab se mile..."
      { f: A3, d: 0.35, p: 0.38 }, { f: D4, d: 0.38, p: 0.4 }, { f: D4, d: 0.55, p: 0.6 },
      { f: D4, d: 0.3, p: 0.34 }, { f: E4, d: 0.3, p: 0.34 }, { f: F4, d: 0.42, p: 0.46 }, { f: E4, d: 0.38, p: 0.42 }, { f: D4, d: 0.95, p: 1.1 },

      // "Tose naina jab se mile..."
      { f: A3, d: 0.35, p: 0.38 }, { f: D4, d: 0.38, p: 0.4 }, { f: D4, d: 0.55, p: 0.6 },
      { f: D4, d: 0.3, p: 0.34 }, { f: E4, d: 0.3, p: 0.34 }, { f: F4, d: 0.38, p: 0.42 }, { f: G4, d: 0.38, p: 0.42 },
      { f: F4, d: 0.32, p: 0.36 }, { f: E4, d: 0.38, p: 0.42 }, { f: D4, d: 0.95, p: 1.1 },

      // "Ban gaye silsile..."
      { f: F4, d: 0.38, p: 0.42 }, { f: G4, d: 0.38, p: 0.42 }, { f: A4, d: 0.85, p: 0.95 },
      { f: A4, d: 0.35, p: 0.38 }, { f: G4, d: 0.35, p: 0.38 }, { f: F4, d: 0.35, p: 0.38 }, { f: E4, d: 0.4, p: 0.44 }, { f: D4, d: 1.2, p: 1.35 },

      // "Tose naina jab se mile..."
      { f: F4, d: 0.35, p: 0.38 }, { f: E4, d: 0.35, p: 0.38 }, { f: D4, d: 0.55, p: 0.6 },
      { f: D4, d: 0.3, p: 0.34 }, { f: E4, d: 0.3, p: 0.34 }, { f: F4, d: 0.38, p: 0.42 }, { f: E4, d: 0.38, p: 0.42 }, { f: D4, d: 1.3, p: 1.45 },

      // Antra: "O... sudh budh khoyi chain khoya..."
      { f: A4, d: 0.75, p: 0.85 }, { f: A4, d: 0.35, p: 0.38 }, { f: G4, d: 0.35, p: 0.38 }, { f: F4, d: 0.35, p: 0.38 },
      { f: G4, d: 0.35, p: 0.38 }, { f: A4, d: 0.65, p: 0.72 }, { f: F4, d: 0.35, p: 0.38 }, { f: G4, d: 0.35, p: 0.38 },
      { f: E4, d: 0.65, p: 0.72 }, { f: D4, d: 0.85, p: 0.95 },

      // "Duniya se bhi begaana hua..."
      { f: F4, d: 0.35, p: 0.38 }, { f: E4, d: 0.35, p: 0.38 }, { f: D4, d: 0.35, p: 0.38 },
      { f: E4, d: 0.35, p: 0.38 }, { f: F4, d: 0.65, p: 0.72 }, { f: E4, d: 0.4, p: 0.44 }, { f: D4, d: 1.1, p: 1.25 },

      // "Tere ishq mein paagal deewana hua..."
      { f: F4, d: 0.35, p: 0.38 }, { f: G4, d: 0.35, p: 0.38 }, { f: A4, d: 0.4, p: 0.44 }, { f: Bb4, d: 0.45, p: 0.5 },
      { f: A4, d: 0.4, p: 0.44 }, { f: G4, d: 0.35, p: 0.38 }, { f: F4, d: 0.35, p: 0.38 }, { f: E4, d: 0.4, p: 0.44 }, { f: D4, d: 1.4, p: 1.55 },

      // Chorus Reprise: "Tose naina jab se mile..."
      { f: A3, d: 0.35, p: 0.38 }, { f: D4, d: 0.38, p: 0.4 }, { f: D4, d: 0.55, p: 0.6 },
      { f: D4, d: 0.3, p: 0.34 }, { f: E4, d: 0.3, p: 0.34 }, { f: F4, d: 0.38, p: 0.42 }, { f: G4, d: 0.42, p: 0.46 }, { f: A4, d: 1.1, p: 1.25 },

      // "Ban gaye silsile... (Outro resolve)"
      { f: F4, d: 0.4, p: 0.44 }, { f: G4, d: 0.4, p: 0.44 }, { f: A4, d: 0.95, p: 1.1 },
      { f: G4, d: 0.4, p: 0.44 }, { f: F4, d: 0.4, p: 0.44 }, { f: E4, d: 0.45, p: 0.5 }, { f: D4, d: 1.8, p: 2.0 }
    ];

    var totalDelay = 0;
    melody.forEach(function (note, idx) {
      // Warm acoustic singing lead
      playTone(note.f, note.d * 1.15, 'sine', 0.23, totalDelay);
      playTone(note.f, note.d * 0.9, 'triangle', 0.08, totalDelay);
      playTone(note.f * 2, note.d * 0.5, 'sine', 0.06, totalDelay);

      // Acoustic chord roots & gentle bass
      if (idx === 0 || idx === 8 || idx === 19 || idx === 27 || idx === 35 || idx === 45 || idx === 54 || idx === 62) {
        var root = (idx === 8 || idx === 54) ? Bb2 : (idx === 19 ? C3 : D3);
        playTone(root, 1.8, 'sine', 0.16, totalDelay);
        playTone(root * 1.5, 1.4, 'sine', 0.08, totalDelay);
      }

      totalDelay += note.p;
    });
  }

  var playBollywoodMelody = playToseNainaMelody;
  var playMusicBoxTune = playToseNainaMelody;

  // ============ HAPTIC FEEDBACK ============
  function vibrate(ms) {
    if (RM) return;
    try {
      if (navigator.vibrate) {
        navigator.vibrate(ms || 15);
      }
    } catch (e) {}
  }

  // ============ CANVAS RENDERING ============
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    var d = Math.min(window.devicePixelRatio || 1, 2);
    [bg, fx].forEach(function (c) {
      c.width = W * d; c.height = H * d; c.style.width = W + 'px'; c.style.height = H + 'px';
      c.getContext('2d').setTransform(d, 0, 0, d, 0, 0);
    });
    stars = [];
    var count = Math.round((W * H) / 7500);
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        p: Math.random() * 6.28,
        s: Math.random() * 0.02 + 0.006,
        color: Math.random() < 0.2 ? '#ffeaa7' : (Math.random() < 0.4 ? '#ff9fc5' : '#ffffff')
      });
    }
  }

  function frame(t) {
    bx.clearRect(0, 0, W, H);
    // Draw twinkling stars
    stars.forEach(function (s) {
      bx.fillStyle = s.color;
      bx.globalAlpha = RM ? 0.75 : 0.35 + 0.65 * Math.abs(Math.sin(s.p + t * s.s * 0.1));
      bx.beginPath(); bx.arc(s.x, s.y, s.r, 0, 6.3); bx.fill();
    });

    // Draw shooting stars
    if (!RM) {
      if (shootingStars.length < 2 && Math.random() < 0.007) {
        shootingStars.push({
          x: Math.random() * W * 0.8,
          y: Math.random() * H * 0.4,
          dx: 12 + Math.random() * 6,
          dy: 5 + Math.random() * 3,
          l: 0,
          max: 45 + Math.random() * 20
        });
      }
      for (var k = shootingStars.length - 1; k >= 0; k--) {
        var shoot = shootingStars[k];
        shoot.x += shoot.dx; shoot.y += shoot.dy; shoot.l++;
        var g = bx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.dx * 7, shoot.y - shoot.dy * 7);
        g.addColorStop(0, 'rgba(255,255,255,0.95)');
        g.addColorStop(0.3, 'rgba(255,215,160,0.6)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        bx.globalAlpha = 1; bx.strokeStyle = g; bx.lineWidth = 2.2;
        bx.beginPath();
        bx.moveTo(shoot.x, shoot.y);
        bx.lineTo(shoot.x - shoot.dx * 7, shoot.y - shoot.dy * 7);
        bx.stroke();
        if (shoot.l > shoot.max) shootingStars.splice(k, 1);
      }
    }

    // Draw particle FX (confetti, sparks, smoke, fireworks)
    fc.clearRect(0, 0, W, H);
    P = P.filter(function (p) { return p.l > 0; });
    P.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= p.f; p.l--; p.r += 0.12;
      fc.globalAlpha = Math.min(1, p.l / 25);
      fc.fillStyle = p.c;

      if (p.t === 'c') { // confetti rectangle
        fc.save(); fc.translate(p.x, p.y); fc.rotate(p.r);
        fc.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.65);
        fc.restore();
      } else if (p.t === 'smoke') { // smoke puff
        fc.globalAlpha = Math.min(0.5, p.l / 40);
        fc.beginPath(); fc.arc(p.x, p.y, p.s, 0, 6.3); fc.fill();
        p.s += 0.3; // smoke expands
      } else if (p.t === 'heart') { // tiny floating heart particle
        fc.save(); fc.translate(p.x, p.y); fc.rotate(p.r);
        fc.font = Math.round(p.s * 2.5) + 'px system-ui, sans-serif';
        fc.fillText('❤️', -p.s, p.s);
        fc.restore();
      } else { // spark circle with glow
        fc.shadowBlur = 8; fc.shadowColor = p.c;
        fc.beginPath(); fc.arc(p.x, p.y, p.s, 0, 6.3); fc.fill();
        fc.shadowBlur = 0;
      }
    });
    requestAnimationFrame(frame);
  }

  function pick() { return COL[Math.random() * COL.length | 0]; }

  function confetti(x, y, n) {
    n = RM ? Math.min(n, 35) : (n || 80);
    x = x != null ? x : W / 2;
    y = y != null ? y : H / 3;
    for (var i = 0; i < n; i++) {
      P.push({
        t: Math.random() < 0.15 ? 'heart' : 'c',
        x: x, y: y,
        vx: (Math.random() - 0.5) * 16,
        vy: Math.random() * -15 - 3,
        g: 0.32, f: 0.99,
        s: Math.random() * 9 + 4,
        c: pick(),
        r: Math.random() * 6.28,
        l: 130 + Math.random() * 40
      });
    }
  }

  function spark(x, y, n, size) {
    n = n || 25;
    for (var i = 0; i < n; i++) {
      P.push({
        t: 's', x: x, y: y,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7 - 1,
        g: 0.04, f: 0.98,
        s: size || (Math.random() * 2.8 + 1),
        c: pick(),
        r: 0,
        l: 50 + Math.random() * 25
      });
    }
  }

  function smoke(x, y, n) {
    n = n || 18;
    for (var i = 0; i < n; i++) {
      P.push({
        t: 'smoke', x: x + (Math.random() - 0.5) * 16, y: y,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2.5 - 1,
        g: -0.01, f: 0.97,
        s: Math.random() * 4 + 4,
        c: 'rgba(235, 225, 245, 0.45)',
        r: 0,
        l: 60 + Math.random() * 30
      });
    }
  }

  function firework(x, y) {
    var c = pick(), n = RM ? 35 : 75;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * 6.283, v = 3.5 + Math.random() * 4.5;
      P.push({
        t: 's', x: x, y: y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        g: 0.065, f: 0.97,
        s: 2.2,
        c: Math.random() < 0.25 ? '#ffffff' : c,
        r: 0,
        l: 75 + Math.random() * 25
      });
    }
  }

  function fireworks(count) {
    var k = 0; count = count || 6;
    var iv = setInterval(function () {
      var rx = W * (0.15 + Math.random() * 0.7);
      var ry = H * (0.12 + Math.random() * 0.45);
      firework(rx, ry);
      playTone(400 + Math.random() * 300, 0.2, 'triangle', 0.08, 0);
      if (++k >= count) clearInterval(iv);
    }, 420);
  }

  function popBalloon(el) {
    if (!el || el.dataset.popped) return;
    el.dataset.popped = '1';
    var r = el.getBoundingClientRect();
    playPop();
    vibrate(30);
    confetti(r.left + r.width / 2, r.top + r.height / 2, 45);
    spark(r.left + r.width / 2, r.top + r.height / 2, 30);
    el.style.transform = 'scale(1.4)';
    el.style.opacity = '0';
    setTimeout(function () { el.remove(); }, 200);
  }

  function balloons(n) {
    n = n || 10;
    for (var i = 0; i < n; i++) {
      var b = document.createElement('div');
      b.className = 'balloon';
      b.setAttribute('role', 'button');
      b.setAttribute('aria-label', 'Tap to pop balloon');
      b.style.left = (Math.random() * 90 + 5) + 'vw';
      var c1 = pick(), c2 = pick();
      b.style.background = 'radial-gradient(circle at 30% 30%, #fff 10%, ' + c1 + ' 60%, ' + c2 + ' 100%)';
      b.style.animationDuration = (11 + Math.random() * 10) + 's';
      b.style.animationDelay = (-Math.random() * 12) + 's';
      b.addEventListener('pointerdown', function (e) {
        e.stopPropagation();
        popBalloon(this);
      });
      document.body.appendChild(b);
    }
  }

  function popAllBalloons() {
    var all = document.querySelectorAll('.balloon');
    if (!all.length) {
      balloons(12);
      all = document.querySelectorAll('.balloon');
    }
    all.forEach(function (b, idx) {
      setTimeout(function () { popBalloon(b); }, idx * 90);
    });
  }

  function hearts() {
    if (RM) return;
    setInterval(function () {
      var h = document.createElement('div');
      h.className = 'heart';
      h.textContent = ['💗', '💖', '💕', '🌸', '✨', '🎂', '🥰', '💐'][Math.random() * 8 | 0];
      h.style.left = Math.random() * 96 + 'vw';
      h.style.fontSize = (16 + Math.random() * 22) + 'px';
      h.style.animationDuration = (7 + Math.random() * 6) + 's';
      document.body.appendChild(h);
      setTimeout(function () { h.remove(); }, 14000);
    }, 850);
  }

  function spawnFloatingHeart(x, y, emoji) {
    var h = document.createElement('div');
    h.className = 'floating-heart-burst';
    h.textContent = emoji || ['❤️', '💖', '💕', '🥰', '✨'][Math.random() * 5 | 0];
    h.style.left = (x || (W / 2)) + 'px';
    h.style.top = (y || (H / 2)) + 'px';
    document.body.appendChild(h);
    setTimeout(function () { h.remove(); }, 1600);
  }

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  function observe(el) { if (el) io.observe(el); }
  function observeAll() { document.querySelectorAll('.rv').forEach(observe); }

  function tilt(el) {
    if (RM || !el) return;
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'perspective(750px) rotateY(' + (x * 12) + 'deg) rotateX(' + (-y * 12) + 'deg) translateY(-4px)';
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  }

  // Parallax variable + mobile touch sparkles
  addEventListener('scroll', function () {
    document.body.style.setProperty('--sy', window.scrollY);
  }, { passive: true });

  var lastSpark = 0;
  function handlePointerSpark(clientX, clientY) {
    if (RM) return;
    var n = Date.now();
    if (n - lastSpark < 45) return;
    lastSpark = n;
    spark(clientX, clientY, 2, 1.8);
  }

  addEventListener('pointerdown', function (e) {
    getAudioCtx(); // Prime Web Audio context on any user tap
    handlePointerSpark(e.clientX, e.clientY);
  }, { passive: true });

  addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'touch') {
      handlePointerSpark(e.clientX, e.clientY);
    }
  }, { passive: true });

  resize();
  addEventListener('resize', resize);
  requestAnimationFrame(frame);

  window.FX = {
    confetti: confetti,
    spark: spark,
    smoke: smoke,
    firework: firework,
    fireworks: fireworks,
    balloons: balloons,
    popBalloon: popBalloon,
    popAllBalloons: popAllBalloons,
    hearts: hearts,
    spawnFloatingHeart: spawnFloatingHeart,
    observe: observe,
    observeAll: observeAll,
    tilt: tilt,
    vibrate: vibrate,
    // Web Audio helpers:
    playChime: playChime,
    playHarp: playHarp,
    playPop: playPop,
    playBlow: playBlow,
    playCheer: playCheer,
    playCakeCut: playCakeCut,
    playToseNainaMelody: playToseNainaMelody,
    playBollywoodMelody: playToseNainaMelody,
    playMusicBoxTune: playToseNainaMelody,
    playArrow: playArrow,
    playCrack: playCrack,
    playShutter: playShutter,
    playIgnite: playIgnite,
    screenFlash: screenFlash,
    lanterns: lanterns,
    getAudioCtx: getAudioCtx
  };
})();
