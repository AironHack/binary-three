
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

    // Crear partículas iniciales
    for (let i = 0; i < 50; i++) {
        particles.push(createParticle());
    }

    animate();
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

// --- DASHBOARD DE PROGRESO GLOBAL ---
function showGlobalProgress() {
    const phishingStats = JSON.parse(localStorage.getItem('phishingStats')) || { gamesPlayed: 0, bestScore: 0 };
    const firewallStats = JSON.parse(localStorage.getItem('firewallStats')) || { gamesPlayed: 0, bestScore: 0 };
    const userPoints = parseInt(localStorage.getItem('userPoints')) || 0;
    const badges = JSON.parse(localStorage.getItem('badges')) || [];
    
    const totalGames = phishingStats.gamesPlayed + firewallStats.gamesPlayed;
    const bestTotalScore = phishingStats.bestScore + firewallStats.bestScore;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3><i class="fas fa-trophy"></i> Tu Progreso Global</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); document.body.style.overflow = 'auto';" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div class="progress-card">
                        <div style="font-size: 2rem; color: var(--accent);">${userPoints}</div>
                        <div>Puntos Totales</div>
                    </div>
                    <div class="progress-card">
                        <div style="font-size: 2rem; color: var(--success);">${totalGames}</div>
                        <div>Juegos Jugados</div>
                    </div>
                    <div class="progress-card">
                        <div style="font-size: 2rem; color: var(--warning);">${bestTotalScore}</div>
                        <div>Mejor Puntuación</div>
                    </div>
                    <div class="progress-card">
                        <div style="font-size: 2rem; color: var(--danger);">${badges.length}</div>
                        <div>Insignias</div>
                    </div>
                </div>
                
                <h4>Insignias Desbloqueadas:</h4>
                <div id="badges-container" style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 15px;">
                    ${badges.map(badge => `<span class="badge-item">${badge}</span>`).join('')}
                </div>
                
                <div style="margin-top: 30px;">
                    <h4>Estadísticas por Juego:</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                        <div>
                            <h5>Phishing Detector</h5>
                            <p>Juegos: ${phishingStats.gamesPlayed}</p>
                            <p>Mejor: ${phishingStats.bestScore}</p>
                        </div>
                        <div>
                            <h5>Firewall Defender</h5>
                            <p>Juegos: ${firewallStats.gamesPlayed}</p>
                            <p>Mejor: ${firewallStats.bestScore}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// --- TEMAS PERSONALIZABLES ---
const themes = {
    default: {
        '--bg-deep': '#0a0a0a',
        '--bg-card': 'rgba(255, 255, 255, 0.05)',
        '--text-p': '#ffffff',
        '--text-s': '#b0b0b0',
        '--accent': '#00d4ff',
        '--success': '#00ff88',
        '--warning': '#ffaa00',
        '--danger': '#ff4444'
    },
    cyberpunk: {
        '--bg-deep': '#0d001a',
        '--bg-card': 'rgba(255, 0, 255, 0.05)',
        '--text-p': '#ffffff',
        '--text-s': '#ff00ff',
        '--accent': '#ff00ff',
        '--success': '#00ffff',
        '--warning': '#ffff00',
        '--danger': '#ff0000'
    },
    minimal: {
        '--bg-deep': '#ffffff',
        '--bg-card': 'rgba(0, 0, 0, 0.05)',
        '--text-p': '#000000',
        '--text-s': '#666666',
        '--accent': '#000000',
        '--success': '#008000',
        '--warning': '#ffa500',
        '--danger': '#ff0000'
    }
};

function changeTheme(themeName) {
    const theme = themes[themeName];
    if (theme) {
        Object.keys(theme).forEach(prop => {
            document.documentElement.style.setProperty(prop, theme[prop]);
        });
        localStorage.setItem('selectedTheme', themeName);
    }
}

// --- MODO ACCESIBILIDAD ---
function toggleAccessibilityMode() {
    document.body.classList.toggle('accessibility-mode');
    localStorage.setItem('accessibilityMode', document.body.classList.contains('accessibility-mode'));
}

function showThemeSelector() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3><i class="fas fa-palette"></i> Seleccionar Tema</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); document.body.style.overflow = 'auto';" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <button onclick="changeTheme('default')" class="theme-option" style="background: linear-gradient(135deg, #0a0a0a, #1a1a1a); color: white; padding: 20px; border-radius: 8px; border: none; cursor: pointer;">
                        <i class="fas fa-moon"></i><br>Default
                    </button>
                    <button onclick="changeTheme('cyberpunk')" class="theme-option" style="background: linear-gradient(135deg, #0d001a, #1a0033); color: #ff00ff; padding: 20px; border-radius: 8px; border: none; cursor: pointer;">
                        <i class="fas fa-robot"></i><br>Cyberpunk
                    </button>
                    <button onclick="changeTheme('minimal')" class="theme-option" style="background: linear-gradient(135deg, #ffffff, #f0f0f0); color: black; padding: 20px; border-radius: 8px; border: 1px solid #ccc; cursor: pointer;">
                        <i class="fas fa-circle"></i><br>Minimal
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// --- HERRAMIENTAS INTERACTIVAS ---
function generarPasswordSegura(largo = 16) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < largo; i++) {
        password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    // 1. Mostrar la contraseña de forma visible en el campo del generador
    const genInput = document.getElementById("generated-pass-input");
    if (genInput) genInput.value = password;

    // 2. Validar automáticamente en el analizador técnico si existe
    const inputChecker = document.getElementById("pass-checker");
    if (inputChecker) {
        inputChecker.value = password;
        inputChecker.dispatchEvent(new Event('input'));
    }
    
    // Mostrar en modal
    const modal = document.createElement('div'); // Crear el modal
    modal.id = 'generated-password-modal'; // Asignar un ID único al modal
    modal.className = 'modal-overlay show-modal'; // Clases para mostrarlo
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3><i class="fas fa-key"></i> Contraseña Generada</h3>
                <button class="close-modal" onclick="closeModal('generated-password-modal')"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div style="background: var(--bg-card); padding: 15px; border-radius: 8px; font-family: monospace; font-size: 1.2rem; word-break: break-all; margin: 15px 0;">
                    ${password}
                </div>
                <p style="color: var(--success); font-weight: bold;">¡Esta contraseña es muy segura!</p>
                <p style="font-size: 0.9rem; color: var(--text-s);">Cópiala y guárdala en un gestor de contraseñas. No la uses en múltiples sitios.</p>
            </div>
            <div class="modal-footer">
                <button onclick="navigator.clipboard.writeText('${password}'); showNotification('Contraseña copiada al portapapeles', 'success');" class="btn-primary">Copiar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    ganarPuntos(5, 'Generar contraseña segura');
}

function verificarURL() {
    const url = document.getElementById('url-checker').value;
    if (!url) {
        showNotification('Por favor ingresa una URL', 'error');
        return;
    }
    