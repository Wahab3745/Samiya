// DOM Elements
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const successSection = document.getElementById('successSection');
const introSection = document.getElementById('introSection');
const beginBtn = document.getElementById('beginBtn');
const proposalStage = document.getElementById('proposalStage');
const proposalCard = document.getElementById('proposalCard');
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = document.getElementById('backgroundMusic');
const popup = document.getElementById('popup');
const popupText = document.getElementById('popupText');
const popupClose = document.getElementById('popupClose');
const heartsContainer = document.getElementById('heartsContainer');
const confettiContainer = document.getElementById('confettiContainer');
const fireworksCanvas = document.getElementById('fireworksCanvas');

// State
let noClickCount = 0;
let musicPlaying = false;
let fireworksAnimationId = null;
let hasRunAwayMode = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    setupFireworks();
    setupEventListeners();
    wireIntro();
});

function wireIntro() {
    // Always start on intro (needed for reliable music start on mobile browsers)
    if (introSection) introSection.classList.remove('is-hidden');
    if (proposalStage) proposalStage.setAttribute('aria-hidden', 'true');

    const begin = async () => {
        await startMusic(true);
        startStoryTransition();
    };

    if (beginBtn) beginBtn.addEventListener('click', begin);

    // Try autoplay anyway (some browsers allow muted/previously-granted)
    // If it succeeds, we can fade the intro automatically.
    startMusic(false).then((ok) => {
        if (ok) {
            setTimeout(() => startStoryTransition(), 600);
        }
    });
}

function startStoryTransition() {
    if (introSection) introSection.classList.add('is-hidden');
    if (proposalStage) proposalStage.removeAttribute('aria-hidden');
}

async function startMusic(fromUserGesture) {
    try {
        // A tiny seek helps on some browsers after a gesture
        if (fromUserGesture) {
            backgroundMusic.currentTime = Math.min(backgroundMusic.currentTime || 0, 0.1);
        }

        await backgroundMusic.play();
        musicPlaying = true;
        musicToggle.classList.add('active');
        return true;
    } catch (_) {
        // Autoplay blocked: user must tap Begin / music button.
        musicPlaying = false;
        musicToggle.classList.remove('active');
        return false;
    }
}

// Create floating hearts continuously
function createFloatingHearts() {
    const heartEmojis = ['💕', '💖', '💗', '💝', '💞', '💓', '💟', '❤️'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (10 + Math.random() * 10) + 's';
        heart.style.fontSize = (15 + Math.random() * 15) + 'px';
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 20000);
    }, 800);
}

// YES Button Handler
yesBtn.addEventListener('click', () => {
    triggerHeartRain();
    triggerConfetti();
    triggerFireworks();
    showSuccessMessage();
    addBackgroundGlow();
    
    // Hide proposal card and buttons
    const buttonsContainer = document.querySelector('.buttons-container');
    proposalCard.style.opacity = '0';
    proposalCard.style.transform = 'scale(0.92)';
    proposalCard.style.transition = 'all 0.5s ease-out';
    if (buttonsContainer) {
        buttonsContainer.style.opacity = '0';
        buttonsContainer.style.transform = 'translateY(20px)';
        buttonsContainer.style.transition = 'all 0.5s ease-out';
    }
    
    setTimeout(() => {
        proposalCard.style.display = 'none';
        if (buttonsContainer) buttonsContainer.style.display = 'none';
    }, 500);
});

// NO Button Handler
noBtn.addEventListener('click', () => {
    noClickCount++;
    
    if (noClickCount === 1) {
        showPopup("Are you sure? 💔\n\nThink about all those beautiful moments we've shared...");
    } else if (noClickCount === 2) {
        showPopup("Really? 😢\n\nOur love story deserves a happy ending...");
    } else if (noClickCount === 3) {
        showPopup("Last chance! 💕\n\nSay yes and let's write our forever together...");
    } else {
        makeButtonRunAway();
    }
});

// Make NO button run away
function makeButtonRunAway() {
    if (hasRunAwayMode) return;
    hasRunAwayMode = true;
    noBtn.classList.add('running');
    
    const runAway = () => {
        const maxX = window.innerWidth - noBtn.offsetWidth;
        const maxY = window.innerHeight - noBtn.offsetHeight;
        
        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;
        
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
        noBtn.style.position = 'fixed';
        noBtn.style.transition = 'all 0.3s ease';
    };
    
    // Run away on mouse move
    document.addEventListener('mousemove', (e) => {
        const btnRect = noBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width / 2;
        const btnCenterY = btnRect.top + btnRect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(e.clientX - btnCenterX, 2) + 
            Math.pow(e.clientY - btnCenterY, 2)
        );
        
        if (distance < 150) {
            runAway();
        }
    });
    
    // Also run away randomly
    setInterval(runAway, 2000);
}

// Show Popup
function showPopup(message) {
    popupText.textContent = message;
    popup.classList.add('active');
}

// Close Popup
popupClose.addEventListener('click', () => {
    popup.classList.remove('active');
});

popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.classList.remove('active');
    }
});

// Heart Rain Animation
function triggerHeartRain() {
    const heartEmojis = ['💕', '💖', '💗', '💝', '💞', '💓', '💟', '❤️'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'heart-rain';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (20 + Math.random() * 20) + 'px';
            heart.style.animationDelay = Math.random() * 0.5 + 's';
            document.body.appendChild(heart);
            
            setTimeout(() => {
                heart.remove();
            }, 2000);
        }, i * 50);
    }
}

// Confetti Animation
function triggerConfetti() {
    const colors = ['#ff6b9d', '#c084fc', '#f43f5e', '#ffffff', '#fce7f3'];
    
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            confettiContainer.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 30);
    }
}

// Fireworks Setup
function setupFireworks() {
    const ctx = fireworksCanvas.getContext('2d');
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    });
}

// Trigger Fireworks
function triggerFireworks() {
    const ctx = fireworksCanvas.getContext('2d');
    const fireworks = [];
    const colors = ['#ff6b9d', '#c084fc', '#f43f5e', '#ffffff', '#fce7f3'];
    
    // Create multiple fireworks
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const firework = {
                x: Math.random() * fireworksCanvas.width,
                y: Math.random() * fireworksCanvas.height * 0.5,
                particles: []
            };
            
            // Create particles
            for (let j = 0; j < 30; j++) {
                firework.particles.push({
                    x: firework.x,
                    y: firework.y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    life: 1,
                    decay: Math.random() * 0.02 + 0.01
                });
            }
            
            fireworks.push(firework);
        }, i * 200);
    }
    
    // Animate fireworks
    function animate() {
        ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const firework = fireworks[i];
            let hasAliveParticles = false;
            
            for (let j = firework.particles.length - 1; j >= 0; j--) {
                const particle = firework.particles[j];
                
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.1; // Gravity
                particle.life -= particle.decay;
                
                if (particle.life > 0) {
                    hasAliveParticles = true;
                    ctx.globalAlpha = particle.life;
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            if (!hasAliveParticles) {
                fireworks.splice(i, 1);
            }
        }
        
        if (fireworks.length > 0) {
            fireworksAnimationId = requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// Show Success Message
function showSuccessMessage() {
    setTimeout(() => {
        successSection.classList.add('active');
    }, 500);
}

// Background Glow Effect
function addBackgroundGlow() {
    document.body.classList.add('success-glow');
}

// Music Toggle
musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
        backgroundMusic.pause();
        musicToggle.classList.remove('active');
        musicPlaying = false;
    } else {
        startMusic(true);
    }
});

// Setup Event Listeners
function setupEventListeners() {
    // Prevent context menu on long press
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance optimization: Reduce animation when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations or reduce frequency
        if (fireworksAnimationId) {
            cancelAnimationFrame(fireworksAnimationId);
        }
    }
});

// Add some extra romantic touches
setInterval(() => {
    // Occasionally add extra floating hearts
    if (Math.random() > 0.7) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = '💕';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (8 + Math.random() * 8) + 's';
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 16000);
    }
}, 2000);
