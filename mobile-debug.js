// Test mobile - colle ça dans la console mobile
console.log('=== DEBUG MOBILE ===');

// Test 1: Éléments présents
const skillsSection = document.querySelector('.skills');
const skillBars = document.querySelectorAll('.skill-progress');
const themeToggle = document.getElementById('theme-toggle');

console.log('Skills section:', !!skillsSection);
console.log('Skill bars:', skillBars.length);
console.log('Theme toggle:', !!themeToggle);

// Test 2: Force l'animation des barres
if (skillBars.length > 0) {
    console.log('Forçage animation barres...');
    skillBars.forEach((bar, i) => {
        const skillItem = bar.closest('.skill-item');
        const percentage = skillItem ? skillItem.querySelector('.skill-percentage').textContent : '85%';
        bar.style.setProperty('--progress-width', percentage);
        bar.classList.add('animate');
        console.log(`Barre ${i}: ${percentage}`);
    });
}

// Test 3: Force le thème sombre
document.body.classList.remove('light-theme');
console.log('Thème forcé en sombre');

console.log('=== FIN DEBUG ===');