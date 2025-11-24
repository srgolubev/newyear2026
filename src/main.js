document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Accordion
    document.querySelectorAll('.accordion__header').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            item.classList.toggle('active');
        });
    });

    // Snow Animation
    const canvas = document.getElementById('snow-canvas');
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const particleCount = 100; // Number of snowflakes

    let wind = 0;

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * height; // Random start height
        }

        reset() {
            this.x = Math.random() * width;
            this.y = -10;
            this.baseVx = Math.random() * 1 - 0.5;
            this.baseVy = Math.random() * 2 + 1;
            this.vx = this.baseVx;
            this.vy = this.baseVy;
            this.size = Math.random() * 3 + 1;
            this.color = `rgba(200, 220, 255, ${Math.random() * 0.5 + 0.3})`;
        }

        update(mouseX, mouseY) {
            // Apply wind
            this.x += this.vx + wind;
            this.y += this.vy;

            // Mouse interaction
            if (mouseX && mouseY) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    const angle = Math.atan2(dy, dx);
                    const pushX = Math.cos(angle) * force * 2; // Push away
                    const pushY = Math.sin(angle) * force * 2;

                    this.vx += pushX;
                    this.vy += pushY;
                }
            }

            // Friction (return to base speed)
            this.vx += (this.baseVx - this.vx) * 0.05;
            this.vy += (this.baseVy - this.vy) * 0.05;

            // Reset if out of bounds
            if (this.y > height + 10 || this.x > width + 10 || this.x < -10) {
                this.reset();
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let mouseX = null;
    let mouseY = null;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Gyroscope support for mobile
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            const tiltX = e.gamma; // Left/Right tilt
            // Update global wind instead of iterating all particles
            if (tiltX) {
                wind = tiltX * 0.05;
            }
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update(mouseX, mouseY);
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    // Mobile Menu
    const burgerBtn = document.querySelector('.burger-btn');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav a');

    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved user preference, if any, on load of the website
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else if (systemTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Cookie Consent
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');

    if (!localStorage.getItem('cookie_consent')) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }

    cookieAcceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'true');
        cookieBanner.classList.remove('visible');
    });
});
