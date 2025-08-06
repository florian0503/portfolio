import './bootstrap.js';
/*
 * Welcome to your app's main JavaScript file!
 *
 * This file will be included onto the page via the importmap() Twig function,
 * which should already be in your base.html.twig.
 */
import './styles/app.css';

// Test simple d'abord
console.log('JS file loaded successfully!');

// Portfolio interactivity
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded!');
    
    
    // Créer arrière-plan circuit électronique
    createCircuitBackground();
    
    // Ajouter effet subtil pour l'image Florian DIMBERT
    createProfileImageEffect();
    
    // Ajouter effet subtil pour la section hero
    createHeroBackgroundEffect();
    
    // Ajouter bouton retour en haut
    createBackToTopButton();
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-sun';
    }
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        
        if (body.classList.contains('light-theme')) {
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            console.log('Added scrolled class');
        } else {
            navbar.classList.remove('scrolled');
            console.log('Removed scrolled class');
        }
    });

    // Mobile menu toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
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

    // Animate skill bars on scroll
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const percentage = bar.parentElement.parentElement.querySelector('.skill-percentage').textContent;
                    bar.style.setProperty('--progress-width', percentage);
                    bar.classList.add('animate');
                });
            }
        });
    }, observerOptions);

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }

    // Animate elements on scroll
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

    // Contact form handling
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

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            ${message}
        `;
        
        // Add notification styles if not already present
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
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
});

// Créer l'arrière-plan circuit électronique
function createCircuitBackground() {
    // Conteneur canvas pour les circuits
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Style du canvas
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.6';
    
    // Insérer le canvas en arrière-plan
    document.body.insertBefore(canvas, document.body.firstChild);
    
    // Redimensionner le canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Configuration des circuits
    const circuits = [];
    const numCircuits = 12; // Nombre de lignes de circuit
    
    // Créer les lignes de circuit
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
            nodes: [] // Points de connexion le long de la ligne
        };
        
        // Créer des nœuds le long de la ligne
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
    
    // Fonction pour obtenir la couleur selon la section actuelle
    function getCurrentSectionColor() {
        const scrollY = window.pageYOffset;
        const isLightTheme = document.body.classList.contains('light-theme');
        
        let baseColor;
        if (scrollY < 600) {
            baseColor = isLightTheme ? '102, 126, 234' : '102, 126, 234'; // Bleu
        } else if (scrollY < 1200) {
            baseColor = isLightTheme ? '118, 75, 162' : '118, 75, 162'; // Violet
        } else if (scrollY < 1800) {
            baseColor = isLightTheme ? '240, 147, 251' : '240, 147, 251'; // Rose
        } else if (scrollY < 2600) {
            baseColor = isLightTheme ? '255, 159, 67' : '255, 159, 67'; // Orange
        } else {
            baseColor = isLightTheme ? '54, 207, 201' : '54, 207, 201'; // Cyan
        }
        
        return baseColor;
    }
    
    // Animation des circuits
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const baseColor = getCurrentSectionColor();
        
        circuits.forEach(circuit => {
            // Animer le progrès de la ligne
            circuit.progress += circuit.speed;
            if (circuit.progress > 1) {
                circuit.progress = 0;
                // Repositionner aléatoirement la ligne
                circuit.startX = Math.random() * canvas.width;
                circuit.startY = Math.random() * canvas.height;
                circuit.endX = Math.random() * canvas.width;
                circuit.endY = Math.random() * canvas.height;
                
                // Recalculer les nœuds
                circuit.nodes.forEach((node, index) => {
                    const t = index / (circuit.nodes.length - 1);
                    node.x = circuit.startX + (circuit.endX - circuit.startX) * t;
                    node.y = circuit.startY + (circuit.endY - circuit.startY) * t;
                });
            }
            
            // Dessiner la ligne de circuit
            ctx.strokeStyle = `rgba(${baseColor}, 0.4)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(circuit.startX, circuit.startY);
            ctx.lineTo(circuit.endX, circuit.endY);
            ctx.stroke();
            
            // Dessiner le pulse lumineux le long de la ligne
            circuit.pulse += circuit.pulseSpeed;
            const pulsePos = (Math.sin(circuit.pulse) + 1) / 2; // 0 à 1
            const pulseX = circuit.startX + (circuit.endX - circuit.startX) * pulsePos;
            const pulseY = circuit.startY + (circuit.endY - circuit.startY) * pulsePos;
            
            // Glow effect pour le pulse
            ctx.shadowBlur = 15;
            ctx.shadowColor = `rgb(${baseColor})`;
            ctx.fillStyle = `rgba(${baseColor}, 0.8)`;
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Dessiner les nœuds de connexion
            circuit.nodes.forEach(node => {
                node.pulse += node.pulseSpeed;
                const nodeIntensity = (Math.sin(node.pulse) + 1) / 2;
                
                // Nœud principal
                ctx.fillStyle = `rgba(${baseColor}, ${0.6 + nodeIntensity * 0.4})`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Effet de glow autour du nœud
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

// Créer un effet subtil pour l'image de profil
function createProfileImageEffect() {
    const aboutImage = document.querySelector('.about-image img');
    if (!aboutImage) return;
    
    // Créer un conteneur pour l'effet
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
    
    // Rendre le conteneur parent relatif
    aboutImage.parentElement.style.position = 'relative';
    aboutImage.parentElement.insertBefore(effectContainer, aboutImage);
    
    // Fonction pour obtenir la couleur de la section About
    function getAboutSectionColor() {
        const isLightTheme = document.body.classList.contains('light-theme');
        return isLightTheme ? '118, 75, 162' : '118, 75, 162'; // Violet
    }
    
    // Animation du gradient
    let time = 0;
    function animateProfileGradient() {
        time += 0.01;
        const baseColor = getAboutSectionColor();
        
        // Créer un gradient animé très subtil
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
    
    // Observer pour détecter quand on est dans la section About
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
    
    // Démarrer l'animation
    animateProfileGradient();
    
    // Effet hover subtil
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

// Créer un effet de fond subtil pour la section hero
function createHeroBackgroundEffect() {
    const heroSection = document.querySelector('#home.hero');
    if (!heroSection) return;
    
    // Créer le conteneur pour l'effet
    const effectContainer = document.createElement('div');
    effectContainer.className = 'hero-background-effect';
    effectContainer.style.position = 'absolute';
    effectContainer.style.top = '0';
    effectContainer.style.left = '0';
    effectContainer.style.width = '100%';
    effectContainer.style.height = '100%';
    effectContainer.style.zIndex = '-1';
    effectContainer.style.pointerEvents = 'none';
    effectContainer.style.opacity = '1';
    effectContainer.style.overflow = 'hidden';
    
    // Rendre la section hero relative
    heroSection.style.position = 'relative';
    heroSection.appendChild(effectContainer);
    
    // Créer plusieurs formes géométriques flottantes
    const shapes = [];
    const numShapes = 6;
    
    for (let i = 0; i < numShapes; i++) {
        const shape = document.createElement('div');
        shape.style.position = 'absolute';
        shape.style.borderRadius = i % 2 === 0 ? '50%' : '20%';
        shape.style.pointerEvents = 'none';
        
        // Tailles variées
        const size = 80 + Math.random() * 120;
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
        
        // Positions initiales aléatoires
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        
        // Données d'animation
        const shapeData = {
            element: shape,
            baseX: Math.random() * 100,
            baseY: Math.random() * 100,
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
    
    // Fonction pour obtenir la couleur de la section hero
    function getHeroColor() {
        const isLightTheme = document.body.classList.contains('light-theme');
        return '102, 126, 234'; // Bleu pour la section hero
    }
    
    // Animation des formes
    let time = 0;
    function animateHeroShapes() {
        time += 0.01;
        const baseColor = getHeroColor();
        
        shapes.forEach((shapeData, index) => {
            const shape = shapeData.element;
            
            // Mouvement lent et fluide
            shapeData.baseX += shapeData.speedX;
            shapeData.baseY += shapeData.speedY;
            
            // Rebond sur les bords
            if (shapeData.baseX < -10 || shapeData.baseX > 110) {
                shapeData.speedX *= -1;
            }
            if (shapeData.baseY < -10 || shapeData.baseY > 110) {
                shapeData.speedY *= -1;
            }
            
            // Pulse d'opacité
            const pulse = Math.sin(time + shapeData.pulseOffset) * 0.5 + 0.5;
            const opacity = 0.6 + pulse * 0.4;
            
            // Rotation lente
            shapeData.rotation += shapeData.rotationSpeed;
            
            // Appliquer les transformations
            shape.style.left = shapeData.baseX + '%';
            shape.style.top = shapeData.baseY + '%';
            shape.style.transform = `
                rotate(${shapeData.rotation}deg) 
                scale(${shapeData.scale + pulse * 0.1})
            `;
            shape.style.background = `radial-gradient(circle, 
                rgba(${baseColor}, ${opacity}) 0%, 
                rgba(${baseColor}, ${opacity * 0.5}) 50%, 
                transparent 70%)`;
        });
        
        requestAnimationFrame(animateHeroShapes);
    }
    
    // Démarrer l'animation
    animateHeroShapes();
    
    // Effet responsive
    function updateShapesOnResize() {
        shapes.forEach(shapeData => {
            shapeData.baseX = Math.random() * 100;
            shapeData.baseY = Math.random() * 100;
        });
    }
    
    window.addEventListener('resize', updateShapesOnResize);
}

// Créer le bouton retour en haut
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
    
    // Effet hover
    backToTop.addEventListener('mouseenter', () => {
        backToTop.style.transform = 'scale(1.1)';
        backToTop.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
    });
    
    backToTop.addEventListener('mouseleave', () => {
        backToTop.style.transform = 'scale(1)';
        backToTop.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
    });
    
    // Clic pour remonter
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTop);
    
    // Afficher/masquer selon le scroll
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

console.log('Portfolio loaded successfully! 🚀');
