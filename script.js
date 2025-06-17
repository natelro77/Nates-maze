// Global variables
let keySequence = [];
const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
let backgroundMusic = null;

// Initialize background music
function initializeMusic() {
    backgroundMusic = document.getElementById('backgroundMusic');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.3;
        // Try to play music when user interacts with the page
        document.addEventListener('click', function() {
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(e => console.log('Music autoplay prevented'));
            }
        }, { once: true });
    }
}

// Initialize chapter functionality
function initializeChapter() {
    initializeMusic();
    
    // Check if user should have access to this chapter
    const currentChapter = parseInt(document.body.dataset.chapter);
    const unlockedChapters = parseInt(localStorage.getItem('unlockedChapters') || '1');
    
    if (currentChapter > unlockedChapters && currentChapter !== 10) {
        // Redirect to the highest unlocked chapter
        window.location.href = `chapter${unlockedChapters}.html`;
        return;
    }
    
    // Set up secret code listener for all chapters
    document.addEventListener('keydown', handleSecretCode);
    
    // Add enter key listener for riddle answers
    const riddleInput = document.getElementById('riddleAnswer');
    if (riddleInput) {
        riddleInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const submitBtn = document.querySelector('.submit-btn');
                if (submitBtn) {
                    submitBtn.click();
                }
            }
        });
    }
}

// Password checking function for homepage
function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const errorElement = document.getElementById('errorMessage');
    const rememberCheckbox = document.getElementById('rememberMe');
    
    if (!passwordInput) return;
    
    const password = passwordInput.value.toLowerCase();
    let attemptCount = parseInt(localStorage.getItem('passwordAttempts') || '0');
    
    if (password === 'brooming') {
        localStorage.setItem('mazeLocked', 'false');
        localStorage.removeItem('passwordAttempts');
        
        // Handle remember me functionality
        if (rememberCheckbox && rememberCheckbox.checked) {
            localStorage.setItem('rememberMe', 'true');
        }
        
        window.location.href = 'chapter1.html';
    } else {
        attemptCount++;
        localStorage.setItem('passwordAttempts', attemptCount.toString());
        
        let message = "";
        if (attemptCount === 1) {
            message = "You're close. I believe in you 😌";
        } else if (attemptCount === 2) {
            message = "Getting warmer... think about what brooms do!";
        } else if (attemptCount === 3) {
            message = "Bugzy, I'm starting to sweat.";
        } else if (attemptCount < 7) {
            const messages = [
                "The broom is still waiting...",
                "Come on, you know this one!",
                "Think about cleaning actions..."
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        } else if (attemptCount === 7) {
            message = "We're gonna be here forever, huh?";
        } else {
            const desperateMessages = [
                "Seriously? The broom is taking a nap now.",
                "I'm ordering pizza while we wait...",
                "The broom has given up and started Netflix.",
                "Maybe try thinking about what action a broom performs?"
            ];
            message = desperateMessages[Math.floor(Math.random() * desperateMessages.length)];
        }
        
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                errorElement.style.animation = '';
            }, 500);
        }
    }
}

// Initialize Chapter 10 with time lock and secret code
function initializeChapter10() {
    initializeMusic();
    
    const timeLockMessage = document.getElementById('timeLockMessage');
    const secretUnlockMessage = document.getElementById('secretUnlockMessage');
    const chapter10Content = document.getElementById('chapter10Content');
    
    // Check if Chapter 10 is time-locked
    const lockTimestamp = localStorage.getItem('chapter10LockTime');
    const secretUnlocked = localStorage.getItem('chapter10SecretUnlock') === 'true';
    const now = new Date().getTime();
    
    if (!lockTimestamp) {
        // First time visiting Chapter 10, set the lock
        const lockTime = now + (7 * 24 * 60 * 60 * 1000); // 7 days from now
        localStorage.setItem('chapter10LockTime', lockTime.toString());
        localStorage.setItem('chapter10SecretUnlock', 'false');
    }
    
    const lockTime = parseInt(localStorage.getItem('chapter10LockTime'));
    const timeRemaining = lockTime - now;
    
    if (secretUnlocked) {
        // Show secret unlock message
        if (secretUnlockMessage) {
            secretUnlockMessage.style.display = 'block';
            
            // Wait for any key press to show content
            document.addEventListener('keydown', function() {
                secretUnlockMessage.style.display = 'none';
                if (chapter10Content) {
                    chapter10Content.style.display = 'block';
                }
            }, { once: true });
        }
        
    } else if (timeRemaining > 0) {
        // Show time lock message with countdown
        if (timeLockMessage) {
            timeLockMessage.style.display = 'block';
            startCountdown(timeRemaining);
        }
        
        // Set up secret code listener
        document.addEventListener('keydown', handleSecretCode);
        
    } else {
        // Time has passed, show content
        if (chapter10Content) {
            chapter10Content.style.display = 'block';
        }
    }
}

// Handle secret code input
function handleSecretCode(event) {
    keySequence.push(event.key);
    
    // Keep only the last 8 keys
    if (keySequence.length > secretCode.length) {
        keySequence.shift();
    }
    
    // Check if the sequence matches
    if (keySequence.length === secretCode.length && 
        keySequence.every((key, index) => key === secretCode[index])) {
        
        // Secret code entered correctly!
        unlockChapter10Secret();
        keySequence = []; // Reset sequence
    }
}

// Unlock Chapter 10 with secret code
function unlockChapter10Secret() {
    localStorage.setItem('chapter10SecretUnlock', 'true');
    
    const timeLockMessage = document.getElementById('timeLockMessage');
    const secretUnlockMessage = document.getElementById('secretUnlockMessage');
    
    if (timeLockMessage) {
        timeLockMessage.style.display = 'none';
    }
    
    if (secretUnlockMessage) {
        secretUnlockMessage.style.display = 'block';
        
        // Add sparkle effect
        createSparkleEffect();
        
        // Wait for any key press to show content
        document.addEventListener('keydown', function() {
            secretUnlockMessage.style.display = 'none';
            const chapter10Content = document.getElementById('chapter10Content');
            if (chapter10Content) {
                chapter10Content.style.display = 'block';
            }
        }, { once: true });
    }
}

// Create sparkle effect for secret unlock
function createSparkleEffect() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.position = 'fixed';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.width = '8px';
            sparkle.style.height = '8px';
            sparkle.style.background = 'radial-gradient(circle, #ffd700, transparent)';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.animation = 'sparkle 1s ease-out forwards';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1000);
        }, i * 100);
    }
}

// Start countdown timer for Chapter 10
function startCountdown(timeRemaining) {
    const countdownElement = document.getElementById('countdown');
    
    function updateCountdown() {
        const now = new Date().getTime();
        const lockTime = parseInt(localStorage.getItem('chapter10LockTime'));
        const remaining = lockTime - now;
        
        if (remaining <= 0) {
            // Time's up! Show the content
            const timeLockMessage = document.getElementById('timeLockMessage');
            const chapter10Content = document.getElementById('chapter10Content');
            if (timeLockMessage) timeLockMessage.style.display = 'none';
            if (chapter10Content) chapter10Content.style.display = 'block';
            return;
        }
        
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        if (countdownElement) {
            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
        
        setTimeout(updateCountdown, 1000);
    }
    
    updateCountdown();
}

// Check riddle answer
function checkAnswer(correctAnswer, nextChapter) {
    const riddleInput = document.getElementById('riddleAnswer');
    const feedback = document.getElementById('feedback');
    
    if (!riddleInput || !feedback) return;
    
    const userAnswer = riddleInput.value.toLowerCase().trim();
    
    const wrongAnswers = [
        "That's cute but no 😌",
        "Nice try, beautiful, but not quite right! 💕",
        "Aww, you're adorable when you're wrong 😘",
        "Getting warmer... but still chilly! ❄️",
        "I love your creativity, but that's not it! 🎨",
        "You're so close I can almost taste it! 👄",
        "That answer made me smile, but it's not right 😊",
        "Good effort, my love, but try again! 💪",
        "Your brain is beautiful, but that's not the answer 🧠✨",
        "I believe in you! One more try? 🌟"
    ];
    
    const correctMessages = [
        "Good job, my love 🩷",
        "Perfect! You're amazing! 💖",
        "Yes! You know me so well 😍",
        "Brilliant! My smart cookie 🍪",
        "Exactly right! You're incredible 🌟",
        "Bingo! I'm so proud of you 🎉",
        "You got it! My genius partner 🧠💕",
        "Spot on! You're the best 👑",
        "Correct! You never fail to amaze me ✨",
        "YES! That's my brilliant love 💎"
    ];
    
    if (userAnswer === correctAnswer.toLowerCase()) {
        // Correct answer
        const randomMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
        feedback.textContent = randomMessage;
        feedback.className = 'feedback success';
        feedback.style.animation = 'glow 0.5s ease-in-out';
        
        // Update progress
        const currentChapter = parseInt(document.body.dataset.chapter);
        const unlockedChapters = parseInt(localStorage.getItem('unlockedChapters') || '1');
        if (currentChapter >= unlockedChapters) {
            localStorage.setItem('unlockedChapters', (currentChapter + 1).toString());
        }
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = nextChapter;
        }, 2000);
        
    } else {
        // Wrong answer
        const randomMessage = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
        feedback.textContent = randomMessage;
        feedback.className = 'feedback error';
        feedback.style.animation = 'shake 0.5s ease-in-out';
        
        // Clear the animation after it completes
        setTimeout(() => {
            feedback.style.animation = '';
        }, 500);
    }
}

// Bunny click handler
function bunnyClick() {
    const bunny = document.querySelector('.bunny-icon');
    
    // Create floating hearts effect
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = '💖';
            heart.style.position = 'fixed';
            heart.style.right = '50px';
            heart.style.top = '50px';
            heart.style.fontSize = '20px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            heart.style.animation = 'floatHeart 2s ease-out forwards';
            
            // Add CSS for floating heart animation if it doesn't exist
            if (!document.querySelector('#heartAnimation')) {
                const style = document.createElement('style');
                style.id = 'heartAnimation';
                style.textContent = `
                    @keyframes floatHeart {
                        0% {
                            opacity: 1;
                            transform: translateY(0px) translateX(0px) scale(1);
                        }
                        100% {
                            opacity: 0;
                            transform: translateY(-100px) translateX(${(Math.random() - 0.5) * 100}px) scale(0.5);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(heart);
            
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 2000);
        }, i * 200);
    }
    
    // Bunny bounce effect
    if (bunny) {
        bunny.style.animation = 'none';
        setTimeout(() => {
            bunny.style.animation = 'float 3s ease-in-out infinite';
        }, 10);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize music for all pages
    initializeMusic();
    
    // Check if user should bypass login
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        if (localStorage.getItem('rememberMe') === 'true') {
            window.location.href = 'chapter1.html';
            return;
        }
        
        // Allow Enter key to submit password
        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) {
            passwordInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    checkPassword();
                }
            });
        }
    }
    
    // Add some interactive polish
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (this.parentElement) {
                this.parentElement.style.transform = 'scale(1.02)';
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.parentElement) {
                this.parentElement.style.transform = 'scale(1)';
            }
        });
    });
    
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Start background music when user interacts
    document.addEventListener('click', function() {
        const music = document.getElementById('backgroundMusic');
        if (music && music.paused) {
            music.volume = 0.3;
            music.play().catch(e => console.log('Music autoplay prevented by browser'));
        }
    }, { once: true });
});
