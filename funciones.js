// --- ANIMACIONES DE SCROLL Y EFECTOS VISUALES ---
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observar todas las secciones con clase reveal
    document.querySelectorAll('.reveal').forEach(section => {
        observer.observe(section);
    });
}

// --- EFECTOS DE PARTÍCULAS ---
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 123, 255, ${p.opacity})`;
            ctx.fill();
        });
    }

    function animate() {
        updateParticles();
        drawParticles();
        requestAnimationFrame(animate);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}
// --- SONIDOS AMBIENTALES ---
let ambientAudio = null;
let isAmbientPlaying = false;

function initAmbientSounds() {
    // Crear audio de fondo (tonos suaves de "conexión digital")
    ambientAudio = new (window.AudioContext || window.webkitAudioContext)();
    
    function playAmbientTone() {
        if (!isAmbientPlaying) return;
        
        const oscillator = ambientAudio.createOscillator();
        const gainNode = ambientAudio.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ambientAudio.destination);
        
        oscillator.frequency.setValueAtTime(220, ambientAudio.currentTime); // Nota A3
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.05, ambientAudio.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ambientAudio.currentTime + 2);
        
        oscillator.start(ambientAudio.currentTime);
        oscillator.stop(ambientAudio.currentTime + 2);
        
        // Repetir cada 5-10 segundos
        setTimeout(playAmbientTone, Math.random() * 5000 + 5000);
    }
    
    // Control de volumen
    window.toggleAmbientSound = function() {
        isAmbientPlaying = !isAmbientPlaying;
        if (isAmbientPlaying) {
            playAmbientTone();
        }
    };
}

// --- SISTEMA DE NOTIFICACIONES ---
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
        <button onclick="this.parentElement.remove()" class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remover
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}