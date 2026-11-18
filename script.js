/* Mochi Film — 互動與作品渲染（作品資料請改 works.js） */
(function () {
    'use strict';
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var works = typeof WORKS !== 'undefined' ? WORKS : [];
    var brand = typeof BRAND_WORKS !== 'undefined' ? BRAND_WORKS : [];
    var interviews = typeof INTERVIEWS !== 'undefined' ? INTERVIEWS : [];
    var people = typeof PEOPLE !== 'undefined' ? PEOPLE : [];
    var reviews = typeof REVIEWS !== 'undefined' ? REVIEWS : [];

    /* ---------- 數字 ---------- */
    // 公開作品數已移除
    // 合作人數改為固定顯示 100+（小琪 2026-11-18 指定）
    var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

    /* ---------- 跑馬燈：作品類型 ---------- */
    var mt = $('#marqueeTrack');
    if (mt) {
        var types = [];
        works.forEach(function (w) { if (w.type && types.indexOf(w.type) < 0) types.push(w.type); });
        ['門市介紹', '產品介紹', '質感訪談'].forEach(function (t) { if (types.indexOf(t) < 0) types.push(t); });
        var row = types.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('');
        mt.innerHTML = row + row;
    }

    /* ---------- 作品卡片 ---------- */
    var grid = $('#worksGrid');
    if (grid) {
        grid.innerHTML = works.map(function (w, i) {
            var isLink = !w.video && w.link;
            var tagName = isLink ? 'a' : 'button';
            var attrs = isLink
                ? 'href="' + esc(w.link) + '" target="_blank" rel="noopener"'
                : 'type="button" data-video="' + esc(w.video) + '"';
            return '<' + tagName + ' class="work reveal" ' + attrs + ' data-tag="' + esc(w.tag) + '" style="--d:' + (i % 4) * 0.06 + 's" aria-label="' + esc(w.title + '，' + (isLink ? '在 Instagram 開啟' : '播放影片')) + '">' +
                '<img src="' + esc(w.cover) + '" alt="' + esc(w.title) + '" loading="lazy" width="406" height="720">' +
                (w.video && canHover ? '<video muted loop playsinline preload="none" data-src="' + esc(w.video) + '"></video>' : '') +
                '<span class="work-play" aria-hidden="true">' + (isLink
                    ? '<svg viewBox="0 0 24 24" style="fill:none;stroke:currentColor;margin:0"><path d="M7 17 17 7M8 7h9v9"/></svg>'
                    : '<svg viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20"/></svg>') + '</span>' +
                '<span class="work-info"><small>' + esc(w.tag) + '</small><h3>' + esc(w.title) + '</h3><p>' + esc(w.type) + '</p></span>' +
                '</' + tagName + '>';
        }).join('');

        // 桌機：滑鼠移上去預覽（只在需要時才載入影片）
        if (canHover) {
            grid.querySelectorAll('.work video').forEach(function (v) {
                var card = v.parentElement;
                var timer = null;
                card.addEventListener('mouseenter', function () {
                    // 停留 250ms 才載入，避免滑過去就下載整支影片
                    timer = setTimeout(function () {
                        if (!v.src) v.src = v.dataset.src;
                        var p = v.play(); if (p && p.catch) p.catch(function () {});
                        card.classList.add('previewing');
                    }, 250);
                });
                card.addEventListener('mouseleave', function () {
                    clearTimeout(timer); v.pause(); card.classList.remove('previewing');
                });
            });
        }
        grid.addEventListener('click', function (e) {
            var card = e.target.closest('.work[data-video]');
            if (card) openLightbox(card.dataset.video, card);
        });
    }

    /* ---------- 篩選 ---------- */
    var filters = $('#filters');
    if (filters && grid) {
        var tags = [];
        works.forEach(function (w) { if (w.tag && tags.indexOf(w.tag) < 0) tags.push(w.tag); });
        var count = function (t) { return works.filter(function (w) { return w.tag === t; }).length; };
        if (tags.length > 1) {
            filters.innerHTML = ['全部'].concat(tags).map(function (t, i) {
                return '<button type="button" class="filter-btn" aria-pressed="' + (i === 0) + '" data-filter="' + esc(i === 0 ? '*' : t) + '">' + esc(t) + '<small>' + (i === 0 ? works.length : count(t)) + '</small></button>';
            }).join('');
            filters.addEventListener('click', function (e) {
                var b = e.target.closest('.filter-btn'); if (!b) return;
                filters.querySelectorAll('.filter-btn').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
                var f = b.dataset.filter;
                grid.querySelectorAll('.work').forEach(function (c) { c.hidden = !(f === '*' || c.dataset.tag === f); });
            });
        } else { filters.remove(); }
    }

    /* ---------- 品牌合作 / 訪談 ---------- */
    var stillHTML = function (s) {
        return '<figure class="still reveal"><img src="' + esc(s.cover) + '" alt="' + esc(s.type + ' ' + s.name) + '" loading="lazy">' +
            '<figcaption><span>' + esc(s.type) + '</span><span>' + esc(s.name) + '</span></figcaption></figure>';
    };
    var bg = $('#brandGrid'); if (bg) bg.innerHTML = brand.map(stillHTML).join('');
    var ig = $('#interviewGrid'); if (ig) ig.innerHTML = interviews.map(stillHTML).join('');

    /* ---------- 合作藝人與網紅 ---------- */
    var pg = $('#peopleGrid');
    if (pg) {
        pg.innerHTML = people.map(function (p, i) {
            return '<div class="person reveal" style="--d:' + (i % 6) * 0.04 + 's"' + (p.photos ? ' data-i="' + i + '"' : '') + '>' +
                '<div class="person-photo"><img src="' + esc(p.photo) + '" alt="' + esc(p.name) + '" loading="lazy" width="400" height="400">' +
                (p.times ? '<span class="person-badge">' + esc(p.times) + '</span>' : '') + '</div>' +
                '<h3>' + esc(p.name) + '</h3><p>' + esc(p.role) + '</p></div>';
        }).join('');
        // 多次合作：照片自動輪播
        if (!reduceMotion) {
            pg.querySelectorAll('.person[data-i]').forEach(function (el) {
                var p = people[+el.dataset.i], img = el.querySelector('img'), k = 0;
                p.photos.forEach(function (src) { var im = new Image(); im.src = src; });
                setInterval(function () {
                    k = (k + 1) % p.photos.length;
                    img.style.opacity = 0;
                    setTimeout(function () { img.src = p.photos[k]; img.alt = (p.names && p.names[k]) || p.name; img.style.opacity = 1; }, 350);
                }, 2600);
            });
        }
    }

    /* ---------- 好評跑馬燈：內容複製一份做無縫循環，點擊開燈箱 ---------- */
    var rt = $('#reviewsTrack'), rs = $('#reviewsScroller');
    if (rt && rs) {
        var cardHTML = function (hidden) {
            return reviews.map(function (src, i) {
                var label = hidden ? '' : ' aria-label="查看客戶好評截圖 ' + (i + 1) + '"';
                var hide = hidden ? ' tabindex="-1" aria-hidden="true"' : '';
                var alt = hidden ? '' : '客戶好評截圖';
                return '<button type="button" class="review-card" data-review="' + esc(src) + '"' + hide + label + '>' +
                    '<img src="' + esc(src) + '" alt="' + alt + '" loading="lazy"></button>';
            }).join('');
        };
        rt.innerHTML = '<div class="reviews-set">' + cardHTML(false) + '</div>' +
            '<div class="reviews-set" aria-hidden="true">' + cardHTML(true) + '</div>';
        rs.addEventListener('click', function (e) {
            var card = e.target.closest('.review-card[data-review]');
            if (card) openLightbox(card.dataset.review, card, 'image');
        });
    }

    /* ---------- 燈箱 ---------- */
    var lb = $('#lightbox'), lbBody = $('#lightboxBody'), lbClose = $('#lightboxClose'), lastFocus = null;
    function openLightbox(src, from, kind) {
        lastFocus = from || document.activeElement;
        var isImage = kind === 'image';
        lb.classList.toggle('is-image', isImage);
        lb.setAttribute('aria-label', isImage ? '客戶好評截圖' : '影片播放');
        lbBody.innerHTML = isImage
            ? '<img src="' + esc(src) + '" alt="客戶好評截圖">'
            : '<video src="' + esc(src) + '" controls autoplay playsinline></video>';
        lb.hidden = false;
        requestAnimationFrame(function () { lb.classList.add('open'); });
        document.body.style.overflow = 'hidden';
        if (heroVideo) heroVideo.pause();
        lbClose.focus();
    }
    function closeLightbox() {
        lb.classList.remove('open');
        var v = lbBody.querySelector('video'); if (v) v.pause();
        setTimeout(function () { lb.hidden = true; lbBody.innerHTML = ''; lb.classList.remove('is-image'); }, 250);
        document.body.style.overflow = '';
        if (heroVideo) { var p = heroVideo.play(); if (p && p.catch) p.catch(function () {}); }
        if (lastFocus) lastFocus.focus();
    }
    lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
        if (lb.hidden) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'Tab') {
            var v = lbBody.querySelector('video');
            if (!v) { e.preventDefault(); lbClose.focus(); }
            else if (e.shiftKey && document.activeElement === lbClose) { e.preventDefault(); v.focus(); }
            else if (!e.shiftKey && document.activeElement === v) { e.preventDefault(); lbClose.focus(); }
        }
    });

    /* ---------- 首頁影片聲音 ---------- */
    var heroVideo = $('#heroVideo'), soundBtn = $('#soundBtn');
    if (heroVideo && soundBtn) {
        soundBtn.addEventListener('click', function () {
            heroVideo.muted = !heroVideo.muted;
            if (!heroVideo.muted) { heroVideo.volume = 0.6; heroVideo.play(); }
            soundBtn.setAttribute('aria-pressed', String(!heroVideo.muted));
            soundBtn.setAttribute('aria-label', heroVideo.muted ? '開啟聲音' : '關閉聲音');
        });
        // 畫面外暫停，省電省流量
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (en) {
                en.forEach(function (x) {
                    if (x.isIntersecting && lb.hidden) { var p = heroVideo.play(); if (p && p.catch) p.catch(function () {}); }
                    else heroVideo.pause();
                });
            }, { threshold: 0.15 }).observe(heroVideo);
        }
    }

    /* ---------- 導覽列 ---------- */
    var nav = $('#nav'), toggle = $('#navToggle'), links = $('#navLinks'), cta = $('#mobileCta'), footer = $('.footer');
    var setMenu = function (open) {
        links.classList.toggle('open', open); nav.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    };
    toggle.addEventListener('click', function (e) { e.stopPropagation(); setMenu(!links.classList.contains('open')); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('click', function (e) { if (!links.contains(e.target)) setMenu(false); });

    var lastY = 0;
    window.addEventListener('scroll', function () {
        var y = window.scrollY;
        nav.classList.toggle('scrolled', y > 20);
        var down = y > lastY && y > 140;
        if (!links.classList.contains('open')) nav.classList.toggle('hide', down);
        if (cta) {
            var nearFooter = footer && footer.getBoundingClientRect().top < window.innerHeight;
            cta.classList.toggle('hide', nearFooter || down);
        }
        lastY = y;
    }, { passive: true });

    /* ---------- 進場動畫 ---------- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var io = new IntersectionObserver(function (en) {
            en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
        reveals.forEach(function (el) { io.observe(el); });
    } else {
        reveals.forEach(function (el) { el.classList.add('in'); });
    }
})();
