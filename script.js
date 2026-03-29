// 重新整理時回到頂部
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Sound effects
const SFX = {
    click: 'data:audio/wav;base64,UklGRqQCAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YYACAAAAAGYWXR/1FQAAe+re4ejqAACtFPQcRRQAACLsL+SH7AAAFhO6GrYSAACp7VLmBu4AAJ8RrBhFEQAAEu9M6GjvAABEEMYW8Q8AAF/wHuqv8AAABA8GFbgOAACT8c3r3PEAANwNaBOWDQAAr/Jb7fPyAADLDOoRigwAALXzyu7z8wAAzwuJEJQLAACn9B3w4fQAAOcKRA+wCgAAh/VV8bz1AAAQChcO3QkAAFX2dvKG9gAASgkCDRsJAAAT94HzQPcAAJMIAgxoCAAAw/d59O33AADqBxYLwgcAAGX4WvWM+AAATwc7CioHAAD7+Cv2HvkAAL8GcgmdBgAAhfnt9qb5AAA6BrgIGgYAAAX6oPcj+gAAvwUMCKIFAAB6+kT4lvoAAE4FbgczBQAA5/rd+AH7AADmBNwGzQQAAEv7aflj+wAAhQRVBm4EAACo++v5vvsAACwE2AUXBAAA/vtj+hL8AADaA2UFxwMAAE380fpf/AAAjgP7BHwDAACV/Df7p/wAAEgDmQQ4AwAA2fyV++n8AAAIAz4E+AIAABf97Psm/QAAzALrA74CAABQ/T38Xv0AAJUCngOIAgAAhf2H/JL9AABiAlYDVgIAALb9y/zC/QAAMwIVAygCAADj/Qr97v0AAAgC2AL9AQAADf5F/Rf+AADgAaAC1gEAADP+ev08/gAAuwFsArIBAABX/qz9X/4AAJkBPAKRAQAAd/7a/X/+AAB5ARACcgEAAJb+BP6d/gAAXAHoAVUBAACx/iv+uP4AAEEBwgE7AQAAy/5P/tH+AAApAaABIwEAAOP+cf7p/gAAEgGAAQwBAAD5/o/+/v4AAP0AYgH4AAAADf+s/hL/',
    whoosh: 'data:audio/wav;base64,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'
};

function playSound(name) {
    try {
        const audio = new Audio(SFX[name]);
        audio.volume = 0.15;
        audio.play().catch(() => {});
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

// Reviews infinite auto-scroll
(function() {
    var scroll = document.querySelector('.reviews-scroll');
    var track = document.querySelector('.reviews-track');
    if (!scroll || !track) return;

    var speed = 0.5; // px per frame
    var paused = false;
    var dragging = false;
    var startX, startScrollLeft;

    // Auto scroll
    function autoScroll() {
        if (!paused && !dragging) {
            scroll.scrollLeft += speed;
            // When scrolled past half (the duplicated set), reset to start
            if (scroll.scrollLeft >= track.scrollWidth / 2) {
                scroll.scrollLeft = 0;
            }
        }
        requestAnimationFrame(autoScroll);
    }
    requestAnimationFrame(autoScroll);

    // Pause on hover
    scroll.addEventListener('mouseenter', function() { paused = true; });
    scroll.addEventListener('mouseleave', function() { paused = false; dragging = false; });

    // Pause on touch
    scroll.addEventListener('touchstart', function() { paused = true; }, { passive: true });
    scroll.addEventListener('touchend', function() {
        setTimeout(function() { paused = false; }, 2000); // resume after 2s
    });

    // Drag to scroll (desktop)
    scroll.addEventListener('mousedown', function(e) {
        dragging = true;
        startX = e.pageX - scroll.offsetLeft;
        startScrollLeft = scroll.scrollLeft;
        scroll.style.cursor = 'grabbing';
    });
    scroll.addEventListener('mousemove', function(e) {
        if (!dragging) return;
        e.preventDefault();
        var x = e.pageX - scroll.offsetLeft;
        scroll.scrollLeft = startScrollLeft - (x - startX);
    });
    scroll.addEventListener('mouseup', function() {
        dragging = false;
        scroll.style.cursor = 'grab';
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
