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

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
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

// Pain points tab switching
const painTabs = document.querySelectorAll('.pain-tab');
const painGroups = document.querySelectorAll('.pain-group');

painTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        painTabs.forEach(t => t.classList.remove('active'));
        painGroups.forEach(g => g.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('pain-' + tab.dataset.target).classList.add('active');
    });
});

// Portfolio videos: hover play (desktop) + tap to lightbox
const isTouch = 'ontouchstart' in window;

document.querySelectorAll('.portfolio-thumb video').forEach(video => {
    const item = video.closest('.portfolio-item');

    if (!isTouch) {
        // Desktop: hover to play
        item.addEventListener('mouseenter', () => video.play());
        item.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
    }

    // Click/tap to open lightbox
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

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .pricing-card, .process-step, .portfolio-item, .pain-card, .testimonial-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
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
