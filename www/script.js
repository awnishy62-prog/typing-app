// Web2App Interactive Demo Script
// This script demonstrates the interactive features of the example website

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Web2App is ready!');
    
    // Initialize the demo
    initializeDemo();
    
    // Add some entrance animations
    animateOnScroll();
    
    // Add touch feedback for mobile
    addTouchFeedback();
});

function initializeDemo() {
    // Add some initial styling and setup
    const demoOutput = document.getElementById('demoOutput');
    if (demoOutput) {
        demoOutput.style.transition = 'all 0.3s ease';
    }
    
    // Add click effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-5px)';
            }, 150);
        });
    });
}

function showNotification() {
    const demoOutput = document.getElementById('demoOutput');
    const messages = [
        '🎉 Awesome! Your app is working perfectly!',
        '✨ This notification shows your JavaScript is running!',
        '🚀 Your website is ready to become an APK!',
        '📱 Mobile app features are working great!',
        '💫 Interactive elements are functioning!'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    demoOutput.innerHTML = `
        <div style="animation: fadeInUp 0.5s ease;">
            <p style="color: #4ecdc4; font-weight: 600; margin-bottom: 10px;">📢 Notification</p>
            <p>${randomMessage}</p>
        </div>
    `;
    
    // Add a subtle animation
    demoOutput.style.background = 'rgba(78, 205, 196, 0.2)';
    setTimeout(() => {
        demoOutput.style.background = 'rgba(255, 255, 255, 0.1)';
    }, 2000);
    
    // Show a toast notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Web2App Demo', {
            body: randomMessage,
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🚀</text></svg>'
        });
    }
}

function changeTheme() {
    const body = document.body;
    const currentTheme = body.dataset.theme || 'default';
    
    const themes = {
        default: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            name: 'Default'
        },
        sunset: {
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
            name: 'Sunset'
        },
        ocean: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            name: 'Ocean'
        },
        forest: {
            background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
            name: 'Forest'
        },
        dark: {
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            name: 'Dark'
        }
    };
    
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    const nextTheme = themeKeys[nextIndex];
    
    body.style.background = themes[nextTheme].background;
    body.dataset.theme = nextTheme;
    
    const demoOutput = document.getElementById('demoOutput');
    demoOutput.innerHTML = `
        <div style="animation: fadeInUp 0.5s ease;">
            <p style="color: #ff6b6b; font-weight: 600; margin-bottom: 10px;">🎨 Theme Changed</p>
            <p>Switched to <strong>${themes[nextTheme].name}</strong> theme!</p>
        </div>
    `;
    
    // Add theme transition effect
    demoOutput.style.background = 'rgba(255, 107, 107, 0.2)';
    setTimeout(() => {
        demoOutput.style.background = 'rgba(255, 255, 255, 0.1)';
    }, 2000);
}

function animateCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    const demoOutput = document.getElementById('demoOutput');
    
    // Reset any existing animations
    featureCards.forEach(card => {
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
    });
    
    // Animate each card with a delay
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'bounce 0.6s ease';
            card.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                card.style.transform = 'translateY(-5px)';
            }, 600);
        }, index * 200);
    });
    
    demoOutput.innerHTML = `
        <div style="animation: fadeInUp 0.5s ease;">
            <p style="color: #a8edea; font-weight: 600; margin-bottom: 10px;">✨ Animation Complete</p>
            <p>Feature cards are now dancing! 🕺</p>
        </div>
    `;
    
    // Add animation feedback
    demoOutput.style.background = 'rgba(168, 237, 234, 0.2)';
    setTimeout(() => {
        demoOutput.style.background = 'rgba(255, 255, 255, 0.1)';
    }, 2000);
}

function animateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.hero, .interactive-demo, .getting-started');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

function addTouchFeedback() {
    // Add touch feedback for mobile devices
    if ('ontouchstart' in window) {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            button.addEventListener('touchend', function() {
                this.style.transform = 'translateY(-2px)';
            });
        });
        
        // Add haptic feedback if available
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            });
        });
    }
}

// Add some utility functions for mobile app features
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted');
            }
        });
    }
}

// Add service worker registration for PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add some performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`🚀 Page loaded in ${Math.round(loadTime)}ms`);
    
    // Show load time in demo output if it's the first load
    if (sessionStorage.getItem('firstLoad') !== 'false') {
        setTimeout(() => {
            const demoOutput = document.getElementById('demoOutput');
            if (demoOutput && demoOutput.textContent.includes('Click the buttons')) {
                demoOutput.innerHTML = `
                    <div style="animation: fadeInUp 0.5s ease;">
                        <p style="color: #4ecdc4; font-weight: 600; margin-bottom: 10px;">⚡ Performance</p>
                        <p>Page loaded in <strong>${Math.round(loadTime)}ms</strong> - Great performance!</p>
                    </div>
                `;
            }
        }, 2000);
        sessionStorage.setItem('firstLoad', 'false');
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                showNotification();
                break;
            case '2':
                e.preventDefault();
                changeTheme();
                break;
            case '3':
                e.preventDefault();
                animateCards();
                break;
        }
    }
});

// Export functions for potential external use
window.Web2AppDemo = {
    showNotification,
    changeTheme,
    animateCards,
    requestNotificationPermission
};

