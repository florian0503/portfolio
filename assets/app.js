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
    
    // Créer des bulles qui suivent le scroll
    createScrollFollowingBubbles();
    
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

// Créer des bulles qui suivent le scroll et changent de couleur
function createScrollFollowingBubbles() {
    const body = document.body;
    const bubbles = [];
    
    // Créer plusieurs bulles avec des positions fixes pour éviter superposition
    for (let i = 0; i < 8; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'scroll-bubble';
        bubble.style.position = 'fixed';
        bubble.style.width = (30 + Math.random() * 40) + 'px'; // Tailles plus consistantes
        bubble.style.height = bubble.style.width;
        bubble.style.borderRadius = '50%';
        bubble.style.pointerEvents = 'none';
        bubble.style.zIndex = '999';
        bubble.style.transition = 'background-color 0.8s ease';
        bubble.style.opacity = '0.9';
        bubble.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        bubble.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        bubble.style.backgroundColor = 'rgba(255, 0, 0, 0.8)'; // Couleur initiale ROUGE
        
        // Positions initiales espacées pour éviter superposition
        const gridX = (i % 4) * (window.innerWidth / 4) + Math.random() * 100;
        const gridY = Math.floor(i / 4) * (window.innerHeight / 2) + Math.random() * 200;
        bubble.style.left = gridX + 'px';
        bubble.style.top = gridY + 'px';
        
        // Données de la bulle avec positions fixes
        bubble.baseY = gridY;
        bubble.baseX = gridX;
        bubble.speedMultiplier = 0.4 + Math.random() * 0.4; // Vitesses plus cohérentes
        bubble.horizontalAmplitude = 30 + Math.random() * 20; // Amplitude d'oscillation
        
        body.appendChild(bubble);
        bubbles.push(bubble);
        
        console.log(`Bulle ${i} créée à X:${gridX}, Y:${gridY}`);
    }
    
    // Définir les couleurs pour les bulles selon le thème
    function getSectionColors() {
        const isLightTheme = document.body.classList.contains('light-theme');
        
        if (isLightTheme) {
            return {
                hero: 'rgba(102, 126, 234, 0.3)',       // BLEU CLAIR
                about: 'rgba(118, 75, 162, 0.3)',       // VIOLET CLAIR
                skills: 'rgba(240, 147, 251, 0.3)',     // ROSE CLAIR
                projects: 'rgba(255, 159, 67, 0.3)',    // ORANGE CLAIR
                contact: 'rgba(54, 207, 201, 0.3)'      // CYAN CLAIR
            };
        } else {
            return {
                hero: 'rgba(102, 126, 234, 0.4)',       // BLEU SOMBRE
                about: 'rgba(118, 75, 162, 0.4)',       // VIOLET SOMBRE
                skills: 'rgba(240, 147, 251, 0.4)',     // ROSE SOMBRE
                projects: 'rgba(255, 159, 67, 0.4)',    // ORANGE SOMBRE
                contact: 'rgba(54, 207, 201, 0.4)'      // CYAN SOMBRE
            };
        }
    }
    
    // Fonction pour obtenir la couleur selon la section actuelle (seuils ajustés)
    function getCurrentSectionColor(scrollY) {
        const colors = getSectionColors();
        if (scrollY < 600) {
            return colors.hero; // BLEU
        } else if (scrollY < 1200) {
            return colors.about; // VIOLET
        } else if (scrollY < 1800) { // Seuil plus tôt pour les compétences
            return colors.skills; // ROSE
        } else if (scrollY < 2600) {
            return colors.projects; // ORANGE
        } else {
            return colors.contact; // CYAN
        }
    }
    
    // Les bulles commencent invisibles - apparaissent seulement au scroll
    bubbles.forEach(bubble => {
        bubble.style.opacity = '0';
        bubble.style.backgroundColor = getSectionColors().hero;
    });
    
    // Animation au scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const currentColor = getCurrentSectionColor(scrollY);
        
        // Debug couleur (moins fréquent)
        if (scrollY % 200 < 10) {
            console.log('ScrollY:', scrollY, 'Color:', currentColor);
        }
        
        bubbles.forEach((bubble, index) => {
            // Position Y qui suit le scroll
            let newY = bubble.baseY + (scrollY * bubble.speedMultiplier);
            
            // Gestion du cycle des bulles (repositionnement)
            if (newY > window.innerHeight + 100) {
                // Remettre en haut avec même X pour éviter saut visuel
                bubble.baseY = -100;
                newY = bubble.baseY + (scrollY * bubble.speedMultiplier);
            }
            
            if (newY < -200) {
                // Remettre en bas avec même X
                bubble.baseY = window.innerHeight + 100;
                newY = bubble.baseY + (scrollY * bubble.speedMultiplier);
            }
            
            // Oscillation horizontale douce
            const oscillation = Math.sin((scrollY + index * 100) * 0.003) * bubble.horizontalAmplitude;
            const finalX = bubble.baseX + oscillation;
            
            // Appliquer les positions sans transform compliqué
            bubble.style.left = finalX + 'px';
            bubble.style.top = newY + 'px';
            
            // Changer la couleur selon la section actuelle
            bubble.style.backgroundColor = currentColor;
            
            // Faire apparaître les bulles seulement quand on commence à descendre
            if (scrollY > 50) {
                bubble.style.opacity = '0.7';
            } else {
                bubble.style.opacity = '0';
            }
            
            bubble.style.display = 'block';
            
            // Debug position pour une bulle
            if (index === 0 && scrollY % 300 < 10) {
                console.log(`Bulle 0: X=${finalX}, Y=${newY}, opacity=${bubble.style.opacity}`);
            }
        });
    });
    
    // Repositionner les bulles au redimensionnement avec grille
    window.addEventListener('resize', () => {
        bubbles.forEach((bubble, index) => {
            const gridX = (index % 4) * (window.innerWidth / 4) + Math.random() * 100;
            const gridY = Math.floor(index / 4) * (window.innerHeight / 2) + Math.random() * 200;
            bubble.baseX = gridX;
            bubble.baseY = gridY;
            bubble.style.left = gridX + 'px';
            bubble.style.top = gridY + 'px';
        });
    });
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
