import './bootstrap.js';
import './styles/app.css';


createLoadingScreen();

document.addEventListener('DOMContentLoaded', function() {
    
    // Removed skill bars animation - no longer needed
    
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
    
    createCircuitBackground();
    createProfileImageEffect();
    createHeroBackgroundEffect();
    createTypingAnimation();
    createScrollProgressBar();
    createCustomCursor();
    createBackToTopButton();
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
    
    // Debug: forcer le mode sombre au démarrage
    body.classList.remove('light-theme');
    body.style.backgroundColor = '#1a202c';
    body.style.color = '#f7fafc';
    
    if (!themeToggle) {
        console.error('Theme toggle not found');
        return;
    }
    
    // Force toujours le mode sombre par défaut
    body.classList.remove('light-theme');
    themeIcon.className = 'fas fa-moon';
    localStorage.setItem('theme', 'dark');
    
    function toggleTheme() {
        body.classList.toggle('light-theme');
        
        if (body.classList.contains('light-theme')) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    }

    // Support pour les événements tactiles et souris
    themeToggle.addEventListener('click', toggleTheme);
    themeToggle.addEventListener('touchend', (e) => {
        e.preventDefault();
        toggleTheme();
    });

    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Skill bars observer removed - no longer needed

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const animatedElements = document.querySelectorAll('.project-card, .skill-item, .about-text, .about-image');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateOnScroll.observe(el);
    });

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.2 });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
                
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (result.success) {
                    contactForm.reset();
                    showNotification(result.message, 'success');
                } else {
                    showNotification(result.message, 'error');
                }
            } catch (error) {
                showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                }
                .notification.success {
                    background: linear-gradient(135deg, #4ade80, #22c55e);
                }
                .notification.error {
                    background: linear-gradient(135deg, #f87171, #ef4444);
                }
                .notification.show {
                    transform: translateX(0);
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
});

function createCircuitBackground() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.6';
    
    document.body.insertBefore(canvas, document.body.firstChild);
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const circuits = [];
    const numCircuits = 12;
    
    for (let i = 0; i < numCircuits; i++) {
        const circuit = {
            startX: Math.random() * canvas.width,
            startY: Math.random() * canvas.height,
            endX: Math.random() * canvas.width,
            endY: Math.random() * canvas.height,
            progress: Math.random(),
            speed: 0.002 + Math.random() * 0.005,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.02 + Math.random() * 0.03,
            nodes: []
        };
        
        const numNodes = 3 + Math.floor(Math.random() * 4);
        for (let j = 0; j < numNodes; j++) {
            const t = j / (numNodes - 1);
            circuit.nodes.push({
                x: circuit.startX + (circuit.endX - circuit.startX) * t,
                y: circuit.startY + (circuit.endY - circuit.startY) * t,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.03 + Math.random() * 0.02
            });
        }
        
        circuits.push(circuit);
    }
    
    function getCurrentSectionColor() {
        const scrollY = window.pageYOffset;
        const isLightTheme = document.body.classList.contains('light-theme');
        
        let baseColor;
        if (scrollY < 600) {
            baseColor = '102, 126, 234';
        } else if (scrollY < 1200) {
            baseColor = '118, 75, 162';
        } else if (scrollY < 1800) {
            baseColor = '240, 147, 251';
        } else if (scrollY < 2600) {
            baseColor = '255, 159, 67';
        } else {
            baseColor = '54, 207, 201';
        }
        
        return baseColor;
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const baseColor = getCurrentSectionColor();
        
        circuits.forEach(circuit => {
            circuit.progress += circuit.speed;
            if (circuit.progress > 1) {
                circuit.progress = 0;
                circuit.startX = Math.random() * canvas.width;
                circuit.startY = Math.random() * canvas.height;
                circuit.endX = Math.random() * canvas.width;
                circuit.endY = Math.random() * canvas.height;
                
                circuit.nodes.forEach((node, index) => {
                    const t = index / (circuit.nodes.length - 1);
                    node.x = circuit.startX + (circuit.endX - circuit.startX) * t;
                    node.y = circuit.startY + (circuit.endY - circuit.startY) * t;
                });
            }
            
            ctx.strokeStyle = `rgba(${baseColor}, 0.4)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(circuit.startX, circuit.startY);
            ctx.lineTo(circuit.endX, circuit.endY);
            ctx.stroke();
            
            circuit.pulse += circuit.pulseSpeed;
            const pulsePos = (Math.sin(circuit.pulse) + 1) / 2;
            const pulseX = circuit.startX + (circuit.endX - circuit.startX) * pulsePos;
            const pulseY = circuit.startY + (circuit.endY - circuit.startY) * pulsePos;
            
            ctx.shadowBlur = 15;
            ctx.shadowColor = `rgb(${baseColor})`;
            ctx.fillStyle = `rgba(${baseColor}, 0.8)`;
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            circuit.nodes.forEach(node => {
                node.pulse += node.pulseSpeed;
                const nodeIntensity = (Math.sin(node.pulse) + 1) / 2;
                
                ctx.fillStyle = `rgba(${baseColor}, ${0.6 + nodeIntensity * 0.4})`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.shadowBlur = 8;
                ctx.shadowColor = `rgb(${baseColor})`;
                ctx.fillStyle = `rgba(${baseColor}, ${0.3 + nodeIntensity * 0.3})`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function createProfileImageEffect() {
    const aboutImage = document.querySelector('.about-image img');
    if (!aboutImage) return;
    
    const effectContainer = document.createElement('div');
    effectContainer.className = 'profile-image-effect';
    effectContainer.style.position = 'absolute';
    effectContainer.style.top = '-10px';
    effectContainer.style.left = '-10px';
    effectContainer.style.right = '-10px';
    effectContainer.style.bottom = '-10px';
    effectContainer.style.borderRadius = '25px';
    effectContainer.style.zIndex = '-1';
    effectContainer.style.opacity = '0.3';
    effectContainer.style.pointerEvents = 'none';
    
    aboutImage.parentElement.style.position = 'relative';
    aboutImage.parentElement.insertBefore(effectContainer, aboutImage);
    
    function getAboutSectionColor() {
        const isLightTheme = document.body.classList.contains('light-theme');
        return '118, 75, 162';
    }
    
    let time = 0;
    function animateProfileGradient() {
        time += 0.01;
        const baseColor = getAboutSectionColor();
        
        const angle = (time * 30) % 360;
        const gradient = `linear-gradient(${angle}deg, 
            rgba(${baseColor}, 0.1) 0%, 
            rgba(${baseColor}, 0.2) 30%, 
            rgba(${baseColor}, 0.15) 60%, 
            rgba(${baseColor}, 0.1) 100%)`;
        
        effectContainer.style.background = gradient;
        effectContainer.style.boxShadow = `
            0 0 20px rgba(${baseColor}, 0.1),
            0 0 40px rgba(${baseColor}, 0.05),
            inset 0 0 20px rgba(${baseColor}, 0.03)
        `;
        
        requestAnimationFrame(animateProfileGradient);
    }
    
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                effectContainer.style.opacity = '0.4';
            } else {
                effectContainer.style.opacity = '0.2';
            }
        });
    }, { threshold: 0.3 });
    
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        aboutObserver.observe(aboutSection);
    }
    
    animateProfileGradient();
    
    aboutImage.addEventListener('mouseenter', () => {
        effectContainer.style.opacity = '0.6';
        effectContainer.style.transition = 'opacity 0.3s ease';
    });
    
    aboutImage.addEventListener('mouseleave', () => {
        const aboutSection = document.querySelector('#about');
        const rect = aboutSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        effectContainer.style.opacity = isInView ? '0.4' : '0.2';
    });
}

function createHeroBackgroundEffect() {
    const heroSection = document.querySelector('#home');
    
    if (!heroSection) {
        return;
    }
    
    const effectContainer = document.createElement('div');
    effectContainer.className = 'hero-background-effect';
    effectContainer.style.position = 'absolute';
    effectContainer.style.top = '0';
    effectContainer.style.left = '0';
    effectContainer.style.width = '100%';
    effectContainer.style.height = '100%';
    effectContainer.style.zIndex = '1';
    effectContainer.style.pointerEvents = 'none';
    effectContainer.style.opacity = '0.8';
    effectContainer.style.overflow = 'hidden';
    
    heroSection.style.position = 'relative';
    heroSection.appendChild(effectContainer);
    
    const shapes = [];
    const numShapes = 12;
    
    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        shape.style.position = 'absolute';
        shape.style.borderRadius = i % 2 === 0 ? '50%' : '20%';
        shape.style.pointerEvents = 'none';
        
        const size = 80 + Math.random() * 120;
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
        
        shape.style.left = (10 + Math.random() * 80) + '%';
        shape.style.top = (10 + Math.random() * 80) + '%';
        
        const shapeData = {
            element: shape,
            baseX: 10 + Math.random() * 80,
            baseY: 10 + Math.random() * 80,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
            rotationSpeed: (Math.random() - 0.5) * 0.5,
            rotation: 0,
            scale: 0.8 + Math.random() * 0.4,
            pulseSpeed: 0.01 + Math.random() * 0.02,
            pulseOffset: Math.random() * Math.PI * 2
        };
        
        shapes.push(shapeData);
        effectContainer.appendChild(shape);
        
    }
    
    function getHeroColor() {
        const isLightTheme = document.body.classList.contains('light-theme');
        return '102, 126, 234';
    }
    
    let time = 0;
    function animateHeroShapes() {
        time += 0.01;
        const baseColor = getHeroColor();
        
        shapes.forEach((shapeData, index) => {
            const shape = shapeData.element;
            
            shapeData.baseX += shapeData.speedX;
            shapeData.baseY += shapeData.speedY;
            
            if (shapeData.baseX < -10 || shapeData.baseX > 110) {
                shapeData.speedX *= -1;
            }
            if (shapeData.baseY < -10 || shapeData.baseY > 110) {
                shapeData.speedY *= -1;
            }
            
            const pulse = Math.sin(time + shapeData.pulseOffset) * 0.5 + 0.5;
            const opacity = 0.8 + pulse * 0.2;
            
            shapeData.rotation += shapeData.rotationSpeed;
            
            shape.style.left = shapeData.baseX + '%';
            shape.style.top = shapeData.baseY + '%';
            shape.style.transform = `
                rotate(${shapeData.rotation}deg) 
                scale(${shapeData.scale + pulse * 0.1})
            `;
            shape.style.background = `radial-gradient(circle, 
                rgba(${baseColor}, ${opacity * 0.6}) 0%, 
                rgba(${baseColor}, ${opacity * 0.3}) 50%, 
                transparent 80%)`;
            shape.style.border = 'none';
                
        });
        
        requestAnimationFrame(animateHeroShapes);
    }
    
    animateHeroShapes();
    
    function updateShapesOnResize() {
        shapes.forEach(shapeData => {
            shapeData.baseX = Math.random() * 100;
            shapeData.baseY = Math.random() * 100;
        });
    }
    
    window.addEventListener('resize', updateShapesOnResize);
}

function createTypingAnimation() {
    const titleElement = document.getElementById('typing-title');
    if (!titleElement) return;
    
    const texts = [
        'Florian DIMBERT',
        'Développeur Full Stack',
        'Passionné de Code',
        'Florian DIMBERT'
    ];
    
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let isDone = false;
    
    function type() {
        if (isDone) return;
        
        const currentText = texts[currentTextIndex];
        
        if (!isDeleting) {
            titleElement.textContent = currentText.slice(0, currentCharIndex + 1);
            currentCharIndex++;
            
            if (currentCharIndex === currentText.length) {
                if (currentTextIndex === texts.length - 1) {
                    isDone = true;
                    titleElement.classList.add('typing-done');
                    return;
                }
                
                setTimeout(() => {
                    isDeleting = true;
                }, 1500);
            }
        } else {
            titleElement.textContent = currentText.slice(0, currentCharIndex - 1);
            currentCharIndex--;
            
            if (currentCharIndex === 0) {
                isDeleting = false;
                currentTextIndex++;
                if (currentTextIndex >= texts.length) {
                    currentTextIndex = 0;
                }
            }
        }
        
        const typeSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typeSpeed);
    }
    
    setTimeout(type, 500);
}

function createScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '4px';
    progressBar.style.background = 'linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--accent-color))';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.3s ease';
    progressBar.style.borderRadius = '0 2px 2px 0';
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.position = 'fixed';
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursor.style.borderRadius = '50%';
    cursor.style.background = 'rgba(255, 255, 255, 0.9)';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9998';
    cursor.style.transition = 'transform 0.1s ease';
    cursor.style.mixBlendMode = 'difference';
    cursor.style.opacity = '0.8';
    
    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    cursorTrail.style.position = 'fixed';
    cursorTrail.style.width = '8px';
    cursorTrail.style.height = '8px';
    cursorTrail.style.borderRadius = '50%';
    cursorTrail.style.background = 'rgba(255, 255, 255, 0.7)';
    cursorTrail.style.pointerEvents = 'none';
    cursorTrail.style.zIndex = '9997';
    cursorTrail.style.transition = 'all 0.3s ease';
    cursorTrail.style.opacity = '0.6';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorTrail);
    
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    
    document.body.style.cursor = 'none';
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = (mouseX - 10) + 'px';
        cursor.style.top = (mouseY - 10) + 'px';
    });
    
    function animateTrail() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        cursorTrail.style.left = (trailX - 4) + 'px';
        cursorTrail.style.top = (trailY - 4) + 'px';
        
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
    
    const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, select');
    
    interactiveElements.forEach(element => {
        element.style.cursor = 'none';
        
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'var(--accent-color)';
            cursorTrail.style.transform = 'scale(2)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'var(--primary-color)';
            cursorTrail.style.transform = 'scale(1)';
        });
    });
    
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        cursorTrail.style.display = 'none';
        document.body.style.cursor = 'auto';
    }
}

function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.position = 'fixed';
    backToTop.style.bottom = '30px';
    backToTop.style.right = '30px';
    backToTop.style.width = '50px';
    backToTop.style.height = '50px';
    backToTop.style.borderRadius = '50%';
    backToTop.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    backToTop.style.color = 'white';
    backToTop.style.border = 'none';
    backToTop.style.cursor = 'pointer';
    backToTop.style.fontSize = '18px';
    backToTop.style.zIndex = '1000';
    backToTop.style.transition = 'all 0.3s ease';
    backToTop.style.opacity = '0';
    backToTop.style.transform = 'scale(0)';
    backToTop.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
    
    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = 'scale(1.1)';
        backToTop.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
    });
    
    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = 'scale(1)';
        backToTop.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTop);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.transform = 'scale(1)';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.transform = 'scale(0)';
        }
    });
}



function createLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <div class="loading-text">FD</div>
                <div class="loading-circle"></div>
            </div>
            <div class="loading-bar-container">
                <div class="loading-bar"></div>
            </div>
            <div class="loading-status">Chargement en cours...</div>
            <div class="loading-particles">
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
                <div class="particle"></div>
            </div>
        </div>
    `;
    
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        #loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, 
                rgba(20, 30, 48, 0.95) 0%, 
                rgba(36, 59, 85, 0.95) 50%, 
                rgba(20, 30, 48, 0.95) 100%);
            backdrop-filter: blur(10px);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }
        
        .loading-content {
            text-align: center;
            color: white;
            position: relative;
        }
        
        .loading-logo {
            position: relative;
            margin-bottom: 3rem;
        }
        
        .loading-text {
            font-size: 4rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            animation: pulse 2s ease-in-out infinite;
        }
        
        .loading-circle {
            width: 80px;
            height: 80px;
            border: 3px solid transparent;
            border-top: 3px solid #667eea;
            border-right: 3px solid #764ba2;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
            position: relative;
        }
        
        .loading-circle::after {
            content: '';
            position: absolute;
            top: -3px;
            left: -3px;
            right: -3px;
            bottom: -3px;
            border: 3px solid transparent;
            border-bottom: 3px solid #f093fb;
            border-left: 3px solid #f5576c;
            border-radius: 50%;
            animation: spin 1.5s linear infinite reverse;
        }
        
        .loading-bar-container {
            width: 300px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            margin: 2rem auto;
            overflow: hidden;
            position: relative;
        }
        
        .loading-bar {
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
            border-radius: 2px;
            animation: loadProgress 2s ease-in-out forwards;
            position: relative;
        }
        
        .loading-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(255,255,255,0.4) 50%, 
                transparent 100%);
            animation: shimmer 1.5s ease-in-out infinite;
        }
        
        .loading-status {
            font-size: 1rem;
            opacity: 0.8;
            margin-top: 1rem;
            animation: fadeInOut 2s ease-in-out infinite;
        }
        
        .loading-particles {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            height: 300px;
            pointer-events: none;
        }
        
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #667eea;
            border-radius: 50%;
            opacity: 0.6;
        }
        
        .particle:nth-child(1) {
            top: 20%;
            left: 20%;
            animation: float1 3s ease-in-out infinite;
        }
        
        .particle:nth-child(2) {
            top: 30%;
            right: 15%;
            animation: float2 3.5s ease-in-out infinite;
        }
        
        .particle:nth-child(3) {
            bottom: 25%;
            left: 30%;
            animation: float3 4s ease-in-out infinite;
        }
        
        .particle:nth-child(4) {
            bottom: 20%;
            right: 25%;
            animation: float4 3.2s ease-in-out infinite;
        }
        
        .particle:nth-child(5) {
            top: 50%;
            left: 10%;
            animation: float5 3.8s ease-in-out infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes loadProgress {
            0% { width: 0%; }
            100% { width: 100%; }
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300px); }
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }
        
        @keyframes float1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(20px, -15px) scale(1.2); }
        }
        
        @keyframes float2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-15px, 20px) scale(0.8); }
        }
        
        @keyframes float3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(25px, 10px) scale(1.1); }
        }
        
        @keyframes float4 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-20px, -25px) scale(0.9); }
        }
        
        @keyframes float5 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(30px, 15px) scale(1.3); }
        }
        
        .loading-screen-hide {
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.8s ease-in-out;
        }
    `;
    
    document.head.appendChild(loadingStyles);
    document.body.appendChild(loadingScreen);
    
    const statusMessages = [
        'Initialisation...',
        'Chargement des ressources...',
        'Préparation de l\'interface...',
        'Finalisation...',
        'Prêt !'
    ];
    
    let messageIndex = 0;
    const statusElement = loadingScreen.querySelector('.loading-status');
    
    const messageInterval = setInterval(() => {
        if (messageIndex < statusMessages.length) {
            statusElement.textContent = statusMessages[messageIndex];
            messageIndex++;
        } else {
            clearInterval(messageInterval);
        }
    }, 400);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('loading-screen-hide');
        setTimeout(() => {
            loadingScreen.remove();
        }, 800);
    }
}

