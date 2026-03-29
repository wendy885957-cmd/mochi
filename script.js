// 重新整理時回到頂部
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Sound effects
const SFX = {
    click: null,
    whoosh: null
};

// Generate cinematic swoosh sound
(function() {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var sr = ctx.sampleRate;

    // Soft click
    var clickLen = sr * 0.08;
    var clickBuf = ctx.createBuffer(1, clickLen, sr);
    var clickData = clickBuf.getChannelData(0);
    for (var i = 0; i < clickLen; i++) {
        var t = i / sr;
        clickData[i] = Math.sin(t * 3200 * Math.PI) * Math.exp(-t * 60) * 0.3;
    }

    // Cinematic whoosh (low sweep)
    var whooshLen = sr * 0.6;
    var whooshBuf = ctx.createBuffer(1, whooshLen, sr);
    var whooshData = whooshBuf.getChannelData(0);
    for (var i = 0; i < whooshLen; i++) {
        var t = i / sr;
        var freq = 120 + t * 400;
        var env = Math.sin(t * Math.PI / 0.6) * Math.exp(-t * 2.5);
        var noise = (Math.random() * 2 - 1) * 0.15 * env;
        whooshData[i] = (Math.sin(t * freq * Math.PI) * env * 0.4 + noise);
    }

    SFX._ctx = ctx;
    SFX._click = clickBuf;
    SFX._whoosh = whooshBuf;
})();

function playSound(name) {
    try {
        var ctx = SFX._ctx;
        if (!ctx) return;
        var buf = name === 'click' ? SFX._click : SFX._whoosh;
        if (!buf) return;
        var source = ctx.createBufferSource();
        source.buffer = buf;
        var gain = ctx.createGain();
        gain.gain.value = name === 'click' ? 0.2 : 0.3;
        source.connect(gain);
        gain.connect(ctx.destination);
        if (ctx.state === 'suspended') ctx.resume();
        source.start(0);
    } catch(e) {}
}

// Opening animation
window.addEventListener('load', function() {
    setTimeout(function() {
        document.body.classList.add('loaded');
        playSound('whoosh');
    }, 200);

    var curtain = document.getElementById('curtain');
    if (curtain) {
        var logo = curtain.querySelector('.curtain-logo');
        // Logo glow
        setTimeout(function() {
            if (logo) logo.classList.add('glow');
        }, 600);
        // Fade out
        setTimeout(function() {
            curtain.classList.add('curtain-done');
        }, 1000);
        setTimeout(function() { curtain.remove(); }, 1800);
    }
});

// Hero video controls
const heroSoundBtn = document.getElementById('heroSoundBtn');
const heroReplayBtn = document.getElementById('heroReplayBtn');
const heroVideo = document.getElementById('heroVideo');

if (heroSoundBtn && heroVideo) {
    heroSoundBtn.addEventListener('click', function() {
        if (heroVideo.muted) {
            heroVideo.muted = false;
            heroVideo.volume = 0.4;
            heroSoundBtn.classList.add('playing');
        } else {
            heroVideo.muted = true;
            heroSoundBtn.classList.remove('playing');
        }
    });

    heroVideo.addEventListener('ended', function() {
        if (heroReplayBtn) {
            heroReplayBtn.classList.add('show');
        }
    });

    if (heroReplayBtn) {
        heroReplayBtn.addEventListener('click', function() {
            heroVideo.currentTime = 0;
            heroVideo.play();
            heroReplayBtn.classList.remove('show');
        });
    }
}

// Blur background canvas (desktop only)
(function() {
    var blurLayer = document.querySelector('.hero-video-blur-layer');
    if (!blurLayer || !heroVideo || window.innerWidth <= 768) return;
    var canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 568;
    blurLayer.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    function drawFrame() {
        if (!heroVideo.paused && !heroVideo.ended) {
            ctx.drawImage(heroVideo, 0, 0, canvas.width, canvas.height);
        }
        requestAnimationFrame(drawFrame);
    }
    heroVideo.addEventListener('playing', drawFrame);
})()

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    navbar.classList.toggle('scrolled', currentScroll > 50);

    // Hide/show floating CTA based on footer visibility
    const mobileCta = document.querySelector('.mobile-cta');
    if (mobileCta) {
        const footer = document.querySelector('.footer');
        if (footer) {
            const footerTop = footer.getBoundingClientRect().top;
            mobileCta.style.opacity = footerTop < window.innerHeight ? '0' : '1';
            mobileCta.style.pointerEvents = footerTop < window.innerHeight ? 'none' : 'auto';
        }
    }

    lastScroll = currentScroll;
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Close menu when tapping outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Portfolio filter
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        portfolioItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.4s ease';
            } else {
                item.style.display = 'none';
            }
        });
    });
});


// Portfolio videos: hover play (desktop) + tap to lightbox
const isTouch = 'ontouchstart' in window;

document.querySelectorAll('.portfolio-thumb video').forEach(video => {
    const item = video.closest('.portfolio-item');

    // Skip inline video items — handled separately
    if (item.classList.contains('portfolio-video-inline')) return;

    if (!isTouch) {
        item.addEventListener('mouseenter', () => video.play());
        item.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
    }

    item.addEventListener('click', () => {
        openLightbox(video.src);
    });
});

// Video Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightboxContent');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(videoSrc) {
    lightboxContent.innerHTML = `<video src="${videoSrc}" controls autoplay playsinline webkit-playsinline></video>`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxContent.innerHTML = '';
    document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Close lightbox with back gesture / escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// Portfolio YouTube videos — open in lightbox
document.querySelectorAll('.portfolio-video[data-youtube]').forEach(function(item) {
    item.style.cursor = 'pointer';
    item.addEventListener('click', function() {
        var id = item.getAttribute('data-youtube');
        lightboxContent.innerHTML = '<iframe src="https://www.youtube.com/embed/' + id + '?rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:90vw; max-width:900px; height:50.6vw; max-height:506px; border-radius:12px;"></iframe>';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Portfolio inline videos — play in grid
document.querySelectorAll('.portfolio-video-inline').forEach(function(item) {
    item.style.cursor = 'pointer';
    var video = item.querySelector('.portfolio-inline-video');

    // Click on video itself to pause/play
    video.addEventListener('click', function() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    // Click on cover/play button to start, not on video or expand btn
    item.addEventListener('click', function(e) {
        if (e.target.closest('.portfolio-inline-video')) return;
        if (e.target.closest('.portfolio-expand-btn')) return;
        if (item.classList.contains('playing')) {
            video.pause();
            item.classList.remove('playing');
        } else {
            video.play();
            item.classList.add('playing');
        }
    });

    // Expand button — open in lightbox (portrait friendly)
    var expandBtn = item.querySelector('.portfolio-expand-btn');
    if (expandBtn) {
        expandBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            var currentTime = video.currentTime;
            video.pause();
            item.classList.remove('playing');
            lightboxContent.innerHTML = '<video src="' + video.src + '" controls autoplay playsinline webkit-playsinline style="max-width:90vw; max-height:85vh; border-radius:12px;"></video>';
            lightboxContent.querySelector('video').currentTime = currentTime;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    video.addEventListener('pause', function() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            item.classList.remove('playing');
        }
    });
    video.addEventListener('play', function() {
        item.classList.add('playing');
    });
    video.addEventListener('ended', function() {
        item.classList.remove('playing');
    });
});

// Click sounds on buttons and interactive elements
document.querySelectorAll('.btn, .filter-btn, .nav-links a, .contact-btn, .mobile-cta-btn').forEach(el => {
    el.addEventListener('click', () => playSound('click'));
});

// Smooth scroll for anchor links (iOS-compatible)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
    });
});

// Scroll reveal animations
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Section titles - underline reveal
document.querySelectorAll('.section-title').forEach(el => {
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
});

// Section tags
document.querySelectorAll('.section-tag').forEach(el => {
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
});

// Service cards, pricing cards - stagger via parent
document.querySelectorAll('.services-grid, .pricing-grid, .about-tags').forEach(grid => {
    grid.classList.add('stagger-children');
    revealObserver.observe(grid);
});

// Chat rows - stagger children
document.querySelectorAll('.chat-list').forEach(grid => {
    grid.classList.add('stagger-children');
    revealObserver.observe(grid);
});

// Individual elements
document.querySelectorAll('.process-step, .pricing-bottom-note, .contact-faq, .section-desc, .pain-cta, .addons').forEach(el => {
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
});

// Company and interview sections
document.querySelectorAll('.company-section, .interview-section').forEach(el => {
    el.classList.add('scroll-reveal-scale');
    revealObserver.observe(el);
});

// Company grid, celeb grid, interview grid - stagger children
document.querySelectorAll('.company-grid, .celeb-grid, .interview-grid').forEach(grid => {
    grid.classList.add('stagger-children');
    revealObserver.observe(grid);
});

// About section
document.querySelectorAll('.about-image').forEach(el => {
    el.classList.add('scroll-reveal-left');
    revealObserver.observe(el);
});
document.querySelectorAll('.about-content').forEach(el => {
    el.classList.add('scroll-reveal-right');
    revealObserver.observe(el);
});

// Compact pricing card tap-to-select
document.querySelectorAll('.pricing-compact-card').forEach(function(card) {
    card.addEventListener('click', function() {
        document.querySelectorAll('.pricing-compact-card').forEach(function(c) {
            c.classList.remove('selected');
        });
        card.classList.add('selected');
        playSound('click');
    });
});

// Contact buttons
document.querySelectorAll('.contact-buttons').forEach(el => {
    el.classList.add('stagger-children');
    revealObserver.observe(el);
});

// Hero intro section
document.querySelectorAll('.hero-intro-section .container').forEach(el => {
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
});

// Add fadeIn keyframe
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Button ripple effect
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        var ripple = document.createElement('span');
        ripple.classList.add('ripple');
        var rect = this.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(ripple);
        setTimeout(function() { ripple.remove(); }, 600);
    });
});

// Celebrity photo flip (multiple collab)
document.querySelectorAll('.celeb-flip').forEach(card => {
    const images = JSON.parse(card.dataset.images);
    const names = card.dataset.names ? JSON.parse(card.dataset.names) : null;
    if (images.length <= 1) return;
    const img = card.querySelector('img');
    const nameEl = card.querySelector('.celeb-name');
    let idx = 0;

    // Smooth transition style
    img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    setInterval(() => {
        idx = (idx + 1) % images.length;
        // Fade out
        img.style.opacity = '0';
        img.style.transform = 'scale(0.97)';
        setTimeout(() => {
            img.src = images[idx];
            if (names && nameEl) nameEl.textContent = names[idx];
            // Fade in
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }, 500);
    }, 3000);
});

// Reviews infinite auto-scroll (CSS transform based, works on mobile)
(function() {
    var scroll = document.querySelector('.reviews-scroll');
    var track = document.querySelector('.reviews-track');
    if (!scroll || !track) return;

    var pos = 0;
    var speed = 0.5;
    var paused = false;
    var halfWidth = 0;

    // Calculate half width after images load
    function calcHalf() {
        halfWidth = track.scrollWidth / 2;
    }
    window.addEventListener('load', calcHalf);
    setTimeout(calcHalf, 2000);

    // Disable native scroll, use transform instead
    scroll.style.overflow = 'hidden';

    function animate() {
        if (!paused && halfWidth > 0) {
            pos += speed;
            if (pos >= halfWidth) pos = 0;
            track.style.transform = 'translateX(' + (-pos) + 'px)';
        }
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Pause on hover (desktop)
    scroll.addEventListener('mouseenter', function() { paused = true; });
    scroll.addEventListener('mouseleave', function() { paused = false; });

    // Pause on touch, resume after 2s
    scroll.addEventListener('touchstart', function() { paused = true; }, { passive: true });
    scroll.addEventListener('touchend', function() {
        setTimeout(function() { paused = false; }, 2000);
    });
})();

// Review screenshots click to enlarge
document.querySelectorAll('.reviews-track img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
        const lightbox = document.getElementById('lightbox');
        const lightboxContent = document.getElementById('lightboxContent');
        lightboxContent.innerHTML = `<img src="${img.src}" style="max-width:90vw; max-height:85vh; border-radius:12px;">`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Lazy load images
if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imgObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}
