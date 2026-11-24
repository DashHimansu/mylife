/* Mobile-First Interactive Gallery with Story Mode, Double-Tap Hearts,
   Secret Memory Notes & Reaction Timeline. */
(function () {
  var items = [], cur = 0;
  var lb = document.getElementById('lightbox'),
      lbImg = lb ? lb.querySelector('img') : null,
      lbCap = lb ? lb.querySelector('figcaption') : null;

  var FALLBACK = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="#2b1155"/><text x="400" y="410" font-size="34" fill="#ffd6e8" text-anchor="middle" font-family="sans-serif">Our Beautiful Moment ❤️</text></svg>');

  function safe(im) {
    if (!im) return;
    var rawSrc = im.getAttribute('src') || '';
    var cleanSrc = rawSrc.split('?')[0];
    var q = rawSrc.indexOf('?') !== -1 ? '?' + rawSrc.split('?')[1] : '';
    var attempts = [
      rawSrc,
      cleanSrc,
      './' + cleanSrc.replace(/^(\.\/|\/)/, '') + q,
      'birthday-surprise/' + cleanSrc.replace(/^(\.\/|\/)/, '') + q,
      '../' + cleanSrc.replace(/^(\.\/|\/)/, '') + q
    ];
    var attemptIdx = 0;
    im.onerror = function () {
      attemptIdx++;
      if (attemptIdx < attempts.length) {
        im.src = attempts[attemptIdx];
      } else {
        im.onerror = null;
        im.src = FALLBACK;
      }
    };
  }

  // ============ STANDARD LIGHTBOX ============
  function show(n) {
    if (!items.length || !lbImg) return;
    cur = (n + items.length) % items.length;
    lbImg.classList.remove('in');
    safe(lbImg);
    lbImg.onload = function () { lbImg.classList.add('in'); };
    lbImg.src = items[cur].src;
    lbImg.alt = lbCap.textContent = items[cur].cap || 'Our favourite moment ❤️';
  }

  function open(n) {
    if (!lb) return;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    show(n);
    lb.focus();
    if (window.FX) FX.playChime();
  }

  function close() {
    if (!lb) return;
    lb.hidden = true;
    document.body.style.overflow = '';
  }

  // ============ MOBILE STORY SLIDESHOW MODE ============
  var storyModal = null;
  var storyCur = 0;
  var storyTimer = null;
  var storyPaused = false;
  var STORY_DURATION = 4200; // ms per story
  var storyStartTime = 0;
  var storyRemaining = STORY_DURATION;

  function createStoryModal() {
    if (storyModal) return;
    storyModal = document.createElement('div');
    storyModal.id = 'storyModal';
    storyModal.className = 'story-modal';
    storyModal.hidden = true;
    storyModal.innerHTML = [
      '<div class="story-overlay">',
      '  <div class="story-progress-bar" id="storyProgress"></div>',
      '  <div class="story-top-bar">',
      '    <div class="story-badge"><span class="story-avatar">🎂</span> Naina’s Story</div>',
      '    <button class="story-close-btn" id="storyClose" aria-label="Close stories">✕</button>',
      '  </div>',
      '  <div class="story-content" id="storyContent">',
      '    <img class="story-img" id="storyImg" alt="Story photo">',
      '    <div class="story-caption" id="storyCaption"></div>',
      '    <div class="story-tap-zone story-tap-prev" id="storyPrevZone"></div>',
      '    <div class="story-tap-zone story-tap-next" id="storyNextZone"></div>',
      '  </div>',
      '  <div class="story-actions">',
      '    <button class="btn btn-sm btn-glass story-love-btn" id="storyLoveBtn">❤️ Send Love</button>',
      '    <span class="story-hint">Tap left/right to browse • Hold to pause</span>',
      '  </div>',
      '</div>'
    ].join('');
    document.body.appendChild(storyModal);

    var closeBtn = document.getElementById('storyClose');
    if (closeBtn) closeBtn.onclick = closeStory;

    var prevZone = document.getElementById('storyPrevZone');
    var nextZone = document.getElementById('storyNextZone');
    var contentZone = document.getElementById('storyContent');

    if (prevZone) {
      prevZone.onclick = function (e) {
        e.stopPropagation();
        prevStory();
      };
    }
    if (nextZone) {
      nextZone.onclick = function (e) {
        e.stopPropagation();
        nextStory();
      };
    }

    // Touch & hold to pause
    if (contentZone) {
      contentZone.addEventListener('pointerdown', function () {
        pauseStory();
      });
      contentZone.addEventListener('pointerup', function () {
        resumeStory();
      });
      contentZone.addEventListener('pointercancel', function () {
        resumeStory();
      });
    }

    var loveBtn = document.getElementById('storyLoveBtn');
    if (loveBtn) {
      loveBtn.onclick = function (e) {
        e.stopPropagation();
        if (window.FX) {
          FX.playHarp();
          FX.vibrate(20);
          FX.spawnFloatingHeart(window.innerWidth / 2, window.innerHeight * 0.7, '💖');
          FX.confetti(window.innerWidth / 2, window.innerHeight * 0.7, 30);
        }
      };
    }
  }

  function renderStoryProgress() {
    var pContainer = document.getElementById('storyProgress');
    if (!pContainer) return;
    pContainer.innerHTML = '';
    items.forEach(function (_, i) {
      var bar = document.createElement('div');
      bar.className = 'story-bar-segment';
      var fill = document.createElement('div');
      fill.className = 'story-bar-fill';
      if (i < storyCur) fill.style.width = '100%';
      else if (i === storyCur) fill.id = 'storyActiveFill';
      bar.appendChild(fill);
      pContainer.appendChild(bar);
    });
  }

  function startStoryTimer() {
    clearTimeout(storyTimer);
    var activeFill = document.getElementById('storyActiveFill');
    if (activeFill) {
      activeFill.style.transition = 'none';
      activeFill.style.width = '0%';
      void activeFill.offsetWidth;
      activeFill.style.transition = 'width ' + storyRemaining + 'ms linear';
      activeFill.style.width = '100%';
    }
    storyStartTime = Date.now();
    storyTimer = setTimeout(function () {
      nextStory();
    }, storyRemaining);
  }

  function pauseStory() {
    storyPaused = true;
    clearTimeout(storyTimer);
    var elapsed = Date.now() - storyStartTime;
    storyRemaining = Math.max(200, storyRemaining - elapsed);
    var activeFill = document.getElementById('storyActiveFill');
    if (activeFill) {
      var currentWidth = (1 - (storyRemaining / STORY_DURATION)) * 100;
      activeFill.style.transition = 'none';
      activeFill.style.width = currentWidth + '%';
    }
  }

  function resumeStory() {
    if (!storyPaused) return;
    storyPaused = false;
    startStoryTimer();
  }

  function showStory(idx) {
    if (!items.length) return;
    storyCur = idx;
    if (storyCur >= items.length) {
      closeStory();
      if (window.FX) FX.confetti(window.innerWidth / 2, window.innerHeight / 2, 70);
      return;
    }
    if (storyCur < 0) storyCur = 0;

    renderStoryProgress();
    var sImg = document.getElementById('storyImg');
    var sCap = document.getElementById('storyCaption');
    if (sImg) {
      safe(sImg);
      sImg.src = items[storyCur].src;
    }
    if (sCap) {
      sCap.textContent = items[storyCur].cap || 'A timeless memory with Naina ❤️';
    }

    storyRemaining = STORY_DURATION;
    storyPaused = false;
    startStoryTimer();
    if (window.FX) FX.playChime();
  }

  function nextStory() {
    clearTimeout(storyTimer);
    showStory(storyCur + 1);
  }

  function prevStory() {
    clearTimeout(storyTimer);
    showStory(Math.max(0, storyCur - 1));
  }

  function openStory(idx) {
    createStoryModal();
    storyModal.hidden = false;
    document.body.style.overflow = 'hidden';
    showStory(idx || 0);
  }

  function closeStory() {
    clearTimeout(storyTimer);
    if (storyModal) storyModal.hidden = true;
    document.body.style.overflow = '';
  }

  // ============ GRID & PHOTO CARD INITIALIZATION ============
  function init(list) {
    items = list;
    var g = document.getElementById('grid');
    if (!g) return;
    g.innerHTML = '';

    list.forEach(function (p, n) {
      var f = document.createElement('div');
      f.className = 'ph-card show';
      f.tabIndex = 0;

      var likeCount = 18 + Math.floor(Math.random() * 25);
      var secretText = p.secret || p.cap || 'One of the most cherished smiles we will remember forever.';

      f.innerHTML = [
        '<div class="ph-wrapper">',
        '  <img class="ph-img" loading="eager" decoding="async" src="' + p.src + '" alt="' + (p.cap || '') + '">',
        '  <div class="ph-heart-overlay" aria-hidden="true">❤️</div>',
        '  <div class="ph-badge">✨ Memory #' + (n + 1) + '</div>',
        '  <div class="ph-secret-panel" hidden><p class="ph-secret-text">' + secretText + '</p></div>',
        '</div>',
        '<div class="ph-info">',
        '  <p class="ph-cap">' + (p.cap || 'Cherished moment ❤️') + '</p>',
        '  <div class="ph-actions">',
        '    <button class="btn-action ph-like-btn" aria-label="Heart photo">',
        '      <span class="ph-like-icon">❤️</span> <span class="ph-like-count">' + likeCount + '</span>',
        '    </button>',
        '    <button class="btn-action ph-secret-btn" aria-label="Read secret note">',
        '      <span>💭 Note</span>',
        '    </button>',
        '    <button class="btn-action ph-view-btn" aria-label="Enlarge photo">',
        '      <span>🔍 Enlarge</span>',
        '    </button>',
        '  </div>',
        '</div>'
      ].join('');

      var im = f.querySelector('.ph-img');
      safe(im);

      var heartOverlay = f.querySelector('.ph-heart-overlay');
      var likeBtn = f.querySelector('.ph-like-btn');
      var likeCountEl = f.querySelector('.ph-like-count');
      var secretBtn = f.querySelector('.ph-secret-btn');
      var secretPanel = f.querySelector('.ph-secret-panel');
      var viewBtn = f.querySelector('.ph-view-btn');
      var phWrapper = f.querySelector('.ph-wrapper');

      // Double tap / double click to heart
      var lastTap = 0;
      function triggerHeart(e) {
        likeCount++;
        likeCountEl.textContent = likeCount;
        likeBtn.classList.add('liked');
        heartOverlay.classList.remove('pop');
        void heartOverlay.offsetWidth;
        heartOverlay.classList.add('pop');
        if (window.FX) {
          FX.playHarp();
          FX.vibrate(25);
          var rect = f.getBoundingClientRect();
          FX.spawnFloatingHeart(rect.left + rect.width / 2, rect.top + rect.height / 3, '❤️');
          FX.spark(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
        }
      }

      phWrapper.addEventListener('pointerdown', function (e) {
        var now = Date.now();
        if (now - lastTap < 340) {
          e.preventDefault();
          triggerHeart(e);
          lastTap = 0;
        } else {
          lastTap = now;
        }
      });

      likeBtn.onclick = function (e) {
        e.stopPropagation();
        triggerHeart(e);
      };

      secretBtn.onclick = function (e) {
        e.stopPropagation();
        var isHidden = secretPanel.hidden;
        secretPanel.hidden = !isHidden;
        secretBtn.classList.toggle('active', !isHidden);
        secretBtn.innerHTML = !isHidden ? '<span>✕ Close</span>' : '<span>💭 Note</span>';
        if (window.FX) FX.playChime();
      };

      viewBtn.onclick = function (e) {
        e.stopPropagation();
        open(n);
      };

      f.onkeydown = function (e) {
        if (e.key === 'Enter') open(n);
      };

      g.appendChild(f);
      if (window.FX) FX.observe(f);
    });
  }

  // ============ MEMORIES TIMELINE INITIALIZATION ============
  function memories(list) {
    var t = document.getElementById('tl');
    if (!t) return;
    t.innerHTML = '';

    list.forEach(function (m, idx) {
      var d = document.createElement('div');
      d.className = 'ev show';

      var reactCounts = { love: 14 + idx * 3, cry: 7 + idx, star: 19 + idx * 2 };

      d.innerHTML = [
        '<div class="ev-card">',
        '  <div class="ev-badge">🌟 Chapter ' + (idx + 1) + '</div>',
        '  <div class="ev-img-wrapper"><img class="ev-img" loading="eager" decoding="async" src="' + m.src + '" alt="' + m.title + '"></div>',
        '  <h3 class="ev-title">' + m.title + '</h3>',
        '  <p class="ev-text">' + m.text + '</p>',
        '  <div class="ev-extra" hidden>',
        '    <p class="ev-quote">“Moments like this remind us how lucky we are to share our world with you.” ✨</p>',
        '  </div>',
        '  <div class="ev-actions">',
        '    <button class="btn-action ev-relive-btn"><span>💫 Relive This</span></button>',
        '    <div class="ev-reactions">',
        '      <button class="ev-react-btn" data-type="love"><span>🥰</span> <small>' + reactCounts.love + '</small></button>',
        '      <button class="ev-react-btn" data-type="star"><span>✨</span> <small>' + reactCounts.star + '</small></button>',
        '      <button class="ev-react-btn" data-type="cry"><span>🥹</span> <small>' + reactCounts.cry + '</small></button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('');

      var im = d.querySelector('.ev-img');
      safe(im);

      var reliveBtn = d.querySelector('.ev-relive-btn');
      var extraDiv = d.querySelector('.ev-extra');
      if (reliveBtn && extraDiv) {
        reliveBtn.onclick = function () {
          var willShow = extraDiv.hidden;
          extraDiv.hidden = !willShow;
          reliveBtn.classList.toggle('active', willShow);
          reliveBtn.innerHTML = willShow ? '<span>✨ Remembering</span>' : '<span>💫 Relive This</span>';
          if (window.FX) {
            FX.playChime();
            var r = d.getBoundingClientRect();
            FX.spark(r.left + r.width / 2, r.top + 60, 25);
          }
        };
      }

      d.querySelectorAll('.ev-react-btn').forEach(function (btn) {
        btn.onclick = function (e) {
          e.stopPropagation();
          var small = btn.querySelector('small');
          var count = parseInt(small.textContent, 10) || 0;
          small.textContent = count + 1;
          btn.classList.add('popped');
          setTimeout(function () { btn.classList.remove('popped'); }, 300);
          if (window.FX) {
            FX.playHarp();
            FX.vibrate(15);
            var emoji = btn.querySelector('span').textContent;
            var r = btn.getBoundingClientRect();
            FX.spawnFloatingHeart(r.left + r.width / 2, r.top, emoji);
          }
        };
      });

      t.appendChild(d);
      if (window.FX) FX.observe(d);
    });
  }

  // Lightbox handlers
  var lbClose = document.getElementById('lbClose');
  if (lbClose) lbClose.onclick = close;
  var lbPrev = document.getElementById('lbPrev');
  if (lbPrev) lbPrev.onclick = function () { show(cur - 1); };
  var lbNext = document.getElementById('lbNext');
  if (lbNext) lbNext.onclick = function () { show(cur + 1); };

  if (lb) {
    lb.addEventListener('click', function (e) {
      if (e.target === lb) close();
    });
    var sx = 0;
    lb.addEventListener('touchstart', function (e) {
      sx = e.changedTouches[0].clientX;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 45) show(cur + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  addEventListener('keydown', function (e) {
    if (storyModal && !storyModal.hidden) {
      if (e.key === 'Escape') closeStory();
      else if (e.key === 'ArrowLeft') prevStory();
      else if (e.key === 'ArrowRight') nextStory();
      return;
    }
    if (lb && !lb.hidden) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(cur - 1);
      else if (e.key === 'ArrowRight') show(cur + 1);
    }
  });

  window.Gallery = {
    init: init,
    memories: memories,
    open: open,
    close: close,
    openStory: openStory,
    closeStory: closeStory,
    safe: safe
  };
})();
