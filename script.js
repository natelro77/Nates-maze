// Global variables
let konamiSequence = [];
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
let attemptCount = 0;

// Password checking function
function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const errorMessage = document.getElementById('errorMessage');
    const rememberMe = document.getElementById('rememberMe');
    const password = passwordInput.value.toLowerCase().trim();
    
    attemptCount++;
    
    if (password === 'sweeping') {
        if (rememberMe && rememberMe.checked) {
            localStorage.setItem('rememberMe', 'true');
        }
        window.location.href = 'chapter1.html';
    } else {
        // Progressive feedback based on attempt count
        let feedbackMessage = '';
        if (attemptCount === 1) {
            feedbackMessage = "Not quite right, my love. Think about what brooms do... 🧹";
        } else if (attemptCount === 2) {
            feedbackMessage = "Hmm, still not it. What action do brooms perform? 🤔";
        } else if (attemptCount === 3) {
            feedbackMessage = "You're making this harder than it needs to be! What do you do with a broom? 😅";
        } else if (attemptCount === 4) {
            feedbackMessage = "Seriously? It's what you do to clean floors... 🙄";
        } else if (attemptCount >= 5) {
            feedbackMessage = "I'm starting to think you're doing this on purpose! SWEEPING! The answer is SWEEPING! 😤";
        }
        
        errorMessage.textContent = feedbackMessage;
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Riddle checking function
function checkAnswer(correctAnswer, nextChapter) {
    const riddleInput = document.getElementById('riddleAnswer');
    const feedback = document.getElementById('feedback');
    const userAnswer = riddleInput.value.toLowerCase().trim();
    
    if (userAnswer === correctAnswer.toLowerCase()) {
        feedback.textContent = '✨ Correct! Moving to the next chapter... ✨';
        feedback.className = 'feedback correct';
        
        // Update progress
        const currentChapter = parseInt(document.body.dataset.chapter);
        if (currentChapter) {
            updateProgress(currentChapter);
        }
        
        setTimeout(() => {
            window.location.href = nextChapter;
        }, 1500);
    } else {
        feedback.textContent = 'Not quite right. Try again, my love! 💕';
        feedback.className = 'feedback';
        riddleInput.value = '';
        riddleInput.focus();
    }
}

// Progress tracking
function updateProgress(completedChapter) {
    const currentProgress = parseInt(localStorage.getItem('unlockedChapters') || '1');
    if (completedChapter >= currentProgress) {
        localStorage.setItem('unlockedChapters', (completedChapter + 1).toString());
    }
}

// Chapter access validation
function validateChapterAccess(chapterNumber) {
    const unlockedChapters = parseInt(localStorage.getItem('unlockedChapters') || '1');
    return chapterNumber <= unlockedChapters;
}

// Initialize chapter function
function initializeChapter() {
    const currentChapter = parseInt(document.body.dataset.chapter);
    
    if (currentChapter && !validateChapterAccess(currentChapter)) {
        alert('You need to complete the previous chapters first!');
        window.location.href = 'chapter1.html';
        return;
    }
    
    // Initialize music
    initializeMusic();
    
    // Add sparkle interactions
    addSparkleInteractions();
}

// Chapter 10 specific initialization
function initializeChapter10() {
    const timeLockMessage = document.getElementById('timeLockMessage');
    const secretUnlockMessage = document.getElementById('secretUnlockMessage');
    const chapter10Content = document.getElementById('chapter10Content');
    
    // Check if already unlocked via secret
    if (localStorage.getItem('chapter10SecretUnlock') === 'true') {
        showSecretUnlockMessage();
        return;
    }
    
    // Check time lock
    const lockTime = localStorage.getItem('chapter10LockTime');
    if (!lockTime) {
        // First time reaching chapter 10, set the lock
        localStorage.setItem('chapter10LockTime', Date.now().toString());
        showTimeLock();
    } else {
        const timeElapsed = Date.now() - parseInt(lockTime);
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        
        if (timeElapsed >= sevenDays) {
            showFinalChapter();
        } else {
            showTimeLock();
            startCountdown(sevenDays - timeElapsed);
        }
    }
    
    function showTimeLock() {
        timeLockMessage.style.display = 'block';
        secretUnlockMessage.style.display = 'none';
        chapter10Content.style.display = 'none';
    }
    
    function showSecretUnlockMessage() {
        timeLockMessage.style.display = 'none';
        secretUnlockMessage.style.display = 'block';
        chapter10Content.style.display = 'none';
        
        // Listen for any key to continue
        document.addEventListener('keydown', function(e) {
            showFinalChapter();
        }, { once: true });
    }
    
    function showFinalChapter() {
        timeLockMessage.style.display = 'none';
        secretUnlockMessage.style.display = 'none';
        chapter10Content.style.display = 'block';
    }
    
    function startCountdown(remainingTime) {
        const countdownElement = document.getElementById('countdown');
        
        function updateCountdown() {
            const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            
            countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            
            if (remainingTime <= 0) {
                showFinalChapter();
                return;
            }
            
            remainingTime -= 1000;
            setTimeout(updateCountdown, 1000);
        }
        
        updateCountdown();
    }
    
    // Initialize music and other effects
    initializeMusic();
    addSparkleInteractions();
}

// Konami code detection
document.addEventListener('keydown', function(e) {
    konamiSequence.push(e.code);
    
    // Keep only the last 8 keys
    if (konamiSequence.length > 8) {
        konamiSequence.shift();
    }
    
    // Check if sequence matches Konami code
    if (konamiSequence.length === 8) {
        const matches = konamiSequence.every((key, index) => key === konamiCode[index]);
        if (matches) {
            activateSecretUnlock();
        }
    }
});

function activateSecretUnlock() {
    localStorage.setItem('chapter10SecretUnlock', 'true');
    
    // If we're on chapter 10, show the secret unlock message
    if (window.location.pathname.includes('chapter10.html')) {
        const timeLockMessage = document.getElementById('timeLockMessage');
        const secretUnlockMessage = document.getElementById('secretUnlockMessage');
        
        if (timeLockMessage) timeLockMessage.style.display = 'none';
        if (secretUnlockMessage) {
            secretUnlockMessage.style.display = 'block';
            // Listen for any key to continue
            document.addEventListener('keydown', function(e) {
                const chapter10Content = document.getElementById('chapter10Content');
                if (chapter10Content) {
                    secretUnlockMessage.style.display = 'none';
                    chapter10Content.style.display = 'block';
                }
            }, { once: true });
        }
    } else {
        // If not on chapter 10, redirect there
        window.location.href = 'chapter10.html';
    }
}

// Music initialization
function initializeMusic() {
    const music = document.getElementById('backgroundMusic');
    if (music) {
        music.volume = 0.3;
        
        // Try to play music when user interacts with page
        const startMusic = () => {
            music.play().catch(e => console.log('Music autoplay prevented by browser'));
            document.removeEventListener('click', startMusic);
            document.removeEventListener('keydown', startMusic);
        };
        
        document.addEventListener('click', startMusic);
        document.addEventListener('keydown', startMusic);
    }
}

// Bunny click interaction
function bunnyClick() {
    const bunny = document.querySelector('.bunny-icon');
    if (bunny) {
        bunny.style.animation = 'none';
        setTimeout(() => {
            bunny.style.animation = 'float 3s ease-in-out infinite';
        }, 10);
    }
}

// Add sparkle interactions
function addSparkleInteractions() {
    const sparkles = document.querySelectorAll('.sparkle');
    sparkles.forEach(sparkle => {
        sparkle.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'twinkle 3s infinite';
            }, 10);
        });
    });
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
});
