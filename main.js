/**
 * ==========================================================================
 * MAIN JAVASCRIPT LOGIC
 * Portfolio of Chaithra.N - Software Engineer
 * Left Vertical Navigation Bar, Theme System, ScrollSpy, & Interactive Terminal
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. NIGHT MODE / THEME TOGGLE LOGIC (CSS MEDIA QUERY DETECTION + MANUAL OVERRIDE)
    // --------------------------------------------------------------------------
    const headerThemeBtn = document.getElementById('night-mode-toggle');
    const heroThemeBtn = document.getElementById('pixel-hero-theme-toggle');
    const heroThemeStatus = document.getElementById('pixel-theme-status-text');
    const heroThemeIcon = document.getElementById('pixel-theme-icon-glyph');
    const sidebarThemeBtn = document.getElementById('sidebar-theme-toggle');
    const sidebarThemeGlyph = document.getElementById('sidebar-theme-glyph');
    const sidebarThemeText = document.getElementById('sidebar-theme-text');
    const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
    const mobileThemeIcon = document.getElementById('mobile-theme-icon');

    const htmlElement = document.documentElement;
    const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to synchronize UI elements across all widgets with current theme state
    function applyTheme(theme, isManual = false) {
        htmlElement.setAttribute('data-theme', theme);
        const isDark = (theme === 'dark');

        if (headerThemeBtn) {
            headerThemeBtn.setAttribute('aria-pressed', isDark);
        }

        if (heroThemeStatus) {
            heroThemeStatus.textContent = isDark ? (isManual ? 'NIGHT' : 'NIGHT (AUTO)') : (isManual ? 'DAY' : 'DAY (AUTO)');
        }

        if (heroThemeIcon) {
            heroThemeIcon.textContent = isDark ? '☾' : '☼';
        }

        if (sidebarThemeGlyph) {
            sidebarThemeGlyph.textContent = isDark ? '☾' : '☼';
        }

        if (sidebarThemeText) {
            sidebarThemeText.textContent = isDark ? 'NIGHT MODE' : 'DAY MODE';
        }

        if (sidebarThemeBtn) {
            sidebarThemeBtn.setAttribute('aria-pressed', isDark);
        }

        if (mobileThemeIcon) {
            mobileThemeIcon.textContent = isDark ? '☾' : '☼';
        }

        if (mobileThemeBtn) {
            mobileThemeBtn.setAttribute('aria-pressed', isDark);
        }
    }

    // Determine initial theme: localStorage preference or browser media query detection
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        applyTheme(savedTheme, true);
    } else {
        // Auto-detected from browser/system media query
        const systemTheme = mediaQueryDark.matches ? 'dark' : 'light';
        applyTheme(systemTheme, false);
    }

    // Toggle handler function
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme') || (mediaQueryDark.matches ? 'dark' : 'light');
        const nextTheme = (currentTheme === 'dark') ? 'light' : 'dark';

        localStorage.setItem('portfolio-theme', nextTheme);
        applyTheme(nextTheme, true);
    }

    // Bind event listeners to all theme buttons
    [headerThemeBtn, heroThemeBtn, sidebarThemeBtn, mobileThemeBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', toggleTheme);
        }
    });

    // Listen to OS/browser theme preference changes dynamically
    mediaQueryDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            applyTheme(e.matches ? 'dark' : 'light', false);
        }
    });

    // --------------------------------------------------------------------------
    // 2. VERTICAL SIDEBAR DRAWER & RESPONSIVE MOBILE NAVIGATION
    // --------------------------------------------------------------------------
    const pixelSidebar = document.getElementById('pixel-sidebar');
    const pixelSidebarToggle = document.getElementById('pixel-sidebar-toggle');
    const pixelSidebarBackdrop = document.getElementById('pixel-sidebar-backdrop');
    const pixelNavLinks = document.querySelectorAll('.pixel-nav-link');

    function openMobileSidebar() {
        if (pixelSidebar) {
            pixelSidebar.classList.add('open');
        }
        if (pixelSidebarBackdrop) {
            pixelSidebarBackdrop.classList.add('active');
        }
        if (pixelSidebarToggle) {
            pixelSidebarToggle.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMobileSidebar() {
        if (pixelSidebar) {
            pixelSidebar.classList.remove('open');
        }
        if (pixelSidebarBackdrop) {
            pixelSidebarBackdrop.classList.remove('active');
        }
        if (pixelSidebarToggle) {
            pixelSidebarToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    }

    if (pixelSidebarToggle) {
        pixelSidebarToggle.addEventListener('click', () => {
            const isOpen = pixelSidebar && pixelSidebar.classList.contains('open');
            if (isOpen) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        });
    }

    if (pixelSidebarBackdrop) {
        pixelSidebarBackdrop.addEventListener('click', closeMobileSidebar);
    }

    // Close sidebar on link click (mobile view)
    pixelNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                closeMobileSidebar();
            }
        });
    });

    // Close sidebar on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && pixelSidebar && pixelSidebar.classList.contains('open')) {
            closeMobileSidebar();
            if (pixelSidebarToggle) pixelSidebarToggle.focus();
        }
    });

    // --------------------------------------------------------------------------
    // 3. SCROLL SPY (ACTIVE NAVIGATION INDICATOR FOR ALL 8 SECTIONS)
    // --------------------------------------------------------------------------
    const sectionIds = ['hero', 'about', 'skills', 'timeline', 'projects', 'testimonials', 'chat', 'contact'];

    function updateActiveNavLink() {
        const scrollPosition = window.pageYOffset + 140;

        let currentSectionId = '';

        for (let i = 0; i < sectionIds.length; i++) {
            const secId = sectionIds[i];
            const sectionEl = document.getElementById(secId);
            if (sectionEl) {
                const top = sectionEl.offsetTop;
                const height = sectionEl.offsetHeight;
                if (scrollPosition >= top && scrollPosition < top + height) {
                    currentSectionId = secId;
                    break;
                }
            }
        }

        // If at the very bottom, highlight the last section (contact)
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50) {
            currentSectionId = 'contact';
        }

        if (currentSectionId) {
            pixelNavLinks.forEach(link => {
                const targetHref = link.getAttribute('href');
                if (targetHref === `#${currentSectionId}`) {
                    link.classList.add('active');
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                }
            });
        }
    }

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();

    // --------------------------------------------------------------------------
    // 4. INTERACTIVE RETRO TERMINAL BOT (SIMULATOR FOR INSTANT Q&A)
    // --------------------------------------------------------------------------
    const chatLog = document.getElementById('terminal-chat-log');
    const chatForm = document.getElementById('terminal-chat-form');
    const userInput = document.getElementById('terminal-user-input');
    const quickPromptBtns = document.querySelectorAll('.quick-prompt-btn');

    function appendMessage(sender, text, isBot = false) {
        if (!chatLog) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${isBot ? 'bot-msg' : 'user-msg'}`;

        const senderSpan = document.createElement('span');
        senderSpan.className = 'msg-sender';
        senderSpan.textContent = isBot ? `[CHAITHRA_BOT]:` : `[USER]:`;

        const textSpan = document.createElement('span');
        textSpan.className = 'msg-text';
        textSpan.textContent = text;

        msgDiv.appendChild(senderSpan);
        msgDiv.appendChild(textSpan);
        chatLog.appendChild(msgDiv);

        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function generateBotReply(query) {
        const q = query.toLowerCase().trim();

        if (q.includes('skill') || q === '1' || q.includes('tech') || q.includes('stack')) {
            return "Core Tech Stack: Java, Python, C, SQL (MySQL), HTML5/CSS3/JavaScript. Specializing in Data Science, Machine Learning algorithms (Random Forest, SVM), and REST architectures.";
        }
        if (q.includes('project') || q.includes('crop') || q === '2') {
            return "Key Project: Crop Shield AI — An intelligent plant disease diagnosis & prevention system built with Python, Random Forest/SVM, and Flask, serving real-time agricultural advisories. Also built Rural Product e-commerce & IoT Smart Irrigation.";
        }
        if (q.includes('hire') || q.includes('available') || q.includes('job') || q === '3') {
            return "STATUS: READY_FOR_HIRE! Chaithra is actively seeking Software Engineer & Data Science roles/internships. Graduating B.E. CSE (Data Science) from AIT in 2026.";
        }
        if (q.includes('contact') || q.includes('email') || q.includes('phone') || q === '4') {
            return "Direct contact channels: Email: chaithra31208@gmail.com | Phone: +91 7892291145 | LinkedIn: linkedin.com/in/chaithra-n | GitHub: github.com/Chaithra-N-ship-it";
        }
        if (q.includes('resume') || q.includes('cv')) {
            return "You can download Chaithra's complete resume via the 'DOWNLOAD RESUME' button in the Hero section or from chaithra_resume.pdf!";
        }
        if (q.includes('timeline') || q.includes('education') || q.includes('college')) {
            return "Education: B.E. in Computer Science & Engineering (Data Science) at Adhichunchanagiri Institute of Technology (2022-2026), with consistent high academic performance.";
        }
        if (q.includes('hackathon') || q.includes('adhitantra') || q.includes('achievement')) {
            return "Hackathons: Adhi Tantra 2026 Hackathon participant — built rapid full-stack prototypes under 24-hour competitive sprint constraints.";
        }
        if (q.includes('clear') || q.includes('cls')) {
            if (chatLog) {
                chatLog.innerHTML = '';
                return "Terminal screen cleared. Systems nominal.";
            }
        }
        if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
            return "Hello player! How can I assist you in exploring Chaithra's engineering portfolio today?";
        }

        return "Command recognized. Feel free to ask about 'skills', 'projects', 'education', 'resume', or hiring availability!";
    }

    function handleUserSubmission(queryText) {
        if (!queryText.trim()) return;

        appendMessage('USER', queryText, false);

        // Simulated terminal computation delay
        setTimeout(() => {
            const reply = generateBotReply(queryText);
            appendMessage('CHAITHRA_BOT', reply, true);
        }, 320);
    }

    if (chatForm && userInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = userInput.value.trim();
            if (val) {
                handleUserSubmission(val);
                userInput.value = '';
            }
        });
    }

    quickPromptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query') || btn.textContent.trim();
            handleUserSubmission(query);
        });
    });

    // --------------------------------------------------------------------------
    // 5. CONTACT FORM SUBMISSION PLACEHOLDER
    // --------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !subject || !message) {
                if (statusMsg) {
                    statusMsg.textContent = 'Please complete all required fields.';
                    statusMsg.className = 'form-status-msg error';
                }
                return;
            }

            // Simulate form submission
            if (statusMsg) {
                statusMsg.textContent = 'Thank you! Chaithra will respond to your message shortly.';
                statusMsg.className = 'form-status-msg success';
            }

            contactForm.reset();

            setTimeout(() => {
                if (statusMsg) statusMsg.textContent = '';
            }, 6000);
        });
    }

    // --------------------------------------------------------------------------
    // 6. CURRENT YEAR UPDATE
    // --------------------------------------------------------------------------
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --------------------------------------------------------------------------
    // 7. ABOUT ME — AVATAR SWITCHER (Pixel Art <-> Real Photo)
    // --------------------------------------------------------------------------
    const aboutProfilePic = document.getElementById('about-profile-pic');
    const btnPixel = document.getElementById('btn-avatar-pixel');
    const btnReal = document.getElementById('btn-avatar-real');

    const PIXEL_AVATAR_SRC = 'pixel_avatar.jpg';
    const REAL_PHOTO_SRC = 'my image.jpeg';

    if (aboutProfilePic && btnPixel && btnReal) {
        function setAvatar(mode) {
            if (mode === 'pixel') {
                aboutProfilePic.src = PIXEL_AVATAR_SRC;
                aboutProfilePic.alt = 'Pixel art avatar of software engineer Chaithra.N';
                btnPixel.classList.add('active');
                btnReal.classList.remove('active');
            } else {
                aboutProfilePic.src = REAL_PHOTO_SRC;
                aboutProfilePic.alt = 'Real photograph of Chaithra.N, Software Engineer';
                btnReal.classList.add('active');
                btnPixel.classList.remove('active');
            }
        }

        btnPixel.addEventListener('click', () => setAvatar('pixel'));
        btnReal.addEventListener('click', () => setAvatar('real'));
    }

    // --------------------------------------------------------------------------
    // 8. SCROLL REVEAL — Stagger-animate About section cards on first view
    // --------------------------------------------------------------------------
    if ('IntersectionObserver' in window) {
        const revealTargets = document.querySelectorAll(
            '.highlight-item, .interest-pill-card, .about-bio-card, .about-avatar-card, .about-video-card'
        );

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealTargets.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(22px)';
            el.style.transition = `opacity 0.45s ease ${i * 0.07}s, transform 0.45s ease ${i * 0.07}s`;
            revealObserver.observe(el);
        });

        // Add revealed class style via JS (avoid extra CSS file modification)
        document.addEventListener('scroll', () => {}, { passive: true });
        document.querySelectorAll('.revealed').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });

        // MutationObserver shim for revealed class
        const styleTag = document.createElement('style');
        styleTag.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
        document.head.appendChild(styleTag);
    }
});
