// Premium Interactive Features for Samaneti Ashwini's Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // 1. Canvas Interactive Particle System
    initCanvasParticles();

    // 2. Typing Effect for Subtitle
    initTypingEffect();

    // 3. Scroll Interactions (Navbar Highlight & Reveal)
    initScrollInteractions();

    // 4. Contact Form Handling
    initContactForm();

    // 5. Certificate Modal Preview
    initCertificateModal();
});

/* ==========================================
   Canvas Particle Network (Constellation Effect)
   ========================================== */
function initCanvasParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    // Resize canvas to cover window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    // Particle Object
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6; // Subtle speed
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1; // Small elegant nodes
            this.color = Math.random() > 0.5 ? 'rgba(13, 148, 136, 0.45)' : 'rgba(6, 182, 212, 0.45)'; // Teal / Cyan
        }

        update() {
            // Collision check with boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Mouse interaction (gentle attraction)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    // Pull slightly towards mouse
                    this.x += dx * 0.005;
                    this.y += dy * 0.005;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 4;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset
        }
    }

    // Initialize Particle Swarm
    function initParticles() {
        particles = [];
        // Scale number of particles based on screen size
        const numParticles = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 100);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    // Draw lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    // Alpha scales with proximity
                    let alpha = (1 - distance / 110) * 0.15;
                    ctx.strokeStyle = `rgba(13, 148, 136, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            // Draw line to mouse
            if (mouse.x !== null && mouse.y !== null) {
                let dx = particles[i].x - mouse.x;
                let dy = particles[i].y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let alpha = (1 - distance / mouse.radius) * 0.25;
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    // Listeners
    window.addEventListener('resize', resizeCanvas);
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Handle touch events for mobile
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    });

    window.addEventListener('touchend', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Start
    resizeCanvas();
    animate();
}

/* ==========================================
   Auto-Typing Subtitle Animation
   ========================================== */
function initTypingEffect() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const words = JSON.parse(el.getAttribute('data-words') || '[]');
    if (words.length === 0) return;

    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIdx];
        
        if (isDeleting) {
            el.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 40; // Backspace faster
        } else {
            el.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 80; // Standard speed
        }

        // Handle word completions
        if (!isDeleting && charIdx === currentWord.length) {
            isDeleting = true;
            typeSpeed = 1500; // Pause at full word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typeSpeed = 400; // Brief pause before starting next word
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 500);
}

/* ==========================================
   Scroll Interactions: Active Nav & Reveal animations
   ========================================== */
function initScrollInteractions() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');
    const header = document.querySelector('header');

    // Add scroll listener for sticky nav style & active page tracking
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;

        // Header glassmorphism styling toggle on scroll
        if (scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Active link highlighting
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Smooth page transitions for internal links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.getBoundingClientRect().top + window.scrollY - 90;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* ==========================================
   Premium Contact Form Submissions
   ========================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Visual feedback upon sending
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Mock loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-dasharray="31.4 31.4" fill="none"></circle>
            </svg>
            Sending...
        `;

        setTimeout(() => {
            // Show checkmark / Success
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // Green gradient
            submitBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Message Sent!
            `;

            // Reset form
            form.reset();

            // Restore button back after some time
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.style.background = '';
                submitBtn.innerHTML = originalText;
            }, 3000);

        }, 1500);
    });
}

// Certificate Modal Preview initialization
function initCertificateModal() {
    const preview = document.querySelector('.pub-certificate-preview');
    const modal = document.getElementById('certificate-modal');
    
    if (preview && modal) {
        preview.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scroll
        });
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            // Close if clicking outside the image content or on the close icon
            if (e.target === modal || e.target.classList.contains('close-modal')) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto'; // Enable scroll
            }
        });
    }
}
