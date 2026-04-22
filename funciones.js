
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
    // Simulación de verificación (en producción usar API real)
    const esSospechosa = url.includes('bit.ly') || url.includes('tinyurl') || url.includes('suspicious') || Math.random() > 0.7;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3><i class="fas fa-search"></i> Resultado del Análisis</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); document.body.style.overflow = 'auto';" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin: 20px 0;">
                    <i class="fas fa-${esSospechosa ? 'exclamation-triangle' : 'check-circle'}" style="font-size: 3rem; color: var(--${esSospechosa ? 'danger' : 'success'});"></i>
                </div>
                <h4 style="color: var(--${esSospechosa ? 'danger' : 'success'}); text-align: center;">
                    ${esSospechosa ? '¡URL Sospechosa Detectada!' : 'URL Parece Segura'}
                </h4>
                <p style="font-size: 0.9rem; margin: 15px 0;">
                    ${esSospechosa ? 
                        'Esta URL podría ser peligrosa. Contiene acortadores o dominios sospechosos. No hagas clic si no confías en la fuente.' : 
                        'No se detectaron indicadores obvios de peligro, pero siempre verifica la fuente antes de hacer clic.'}
                </p>
                <div style="background: var(--bg-card); padding: 10px; border-radius: 4px; font-family: monospace; font-size: 0.8rem; word-break: break-all;">
                    ${url}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    if (!esSospechosa) {
        ganarPuntos(3, 'Verificar URL segura');
    }
}

function calcularFuerzaPassword() {
    const password = document.getElementById('password-strength').value;
    if (!password) {
        showNotification('Por favor ingresa una contraseña', 'error');
        return;
    }
    
    // Cálculo simplificado de tiempo de cracking
    let score = 0;
    let timeToCrack = 'instantáneo';
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    if (score <= 2) timeToCrack = 'segundos';
    else if (score <= 4) timeToCrack = 'minutos a horas';
    else if (score <= 5) timeToCrack = 'días a semanas';
    else timeToCrack = 'años o más';
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3><i class="fas fa-chart-bar"></i> Análisis de Fuerza</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); document.body.style.overflow = 'auto';" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 3rem; color: var(--${score >= 5 ? 'success' : score >= 3 ? 'warning' : 'danger'});">
                        ${score}/6
                    </div>
                    <div style="color: var(--text-s);">Puntuación de Seguridad</div>
                </div>
                <div style="background: var(--bg-card); padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <strong>Tiempo estimado para crackear:</strong> ${timeToCrack}
                </div>
                <div style="font-size: 0.9rem; color: var(--text-s);">
                    ${score >= 5 ? 
                        '¡Excelente! Tu contraseña es muy fuerte.' : 
                        score >= 3 ? 
                        'Buena contraseña, pero considera agregarle más caracteres especiales.' : 
                        'Esta contraseña es vulnerable. Úsala solo para cuentas no importantes.'}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    if (score >= 5) {
        ganarPuntos(5, 'Analizar contraseña fuerte');
    }
}
const terminalData = {
    elementId: "content-area", // Se inyectará en la sección de Protocolos
    texto: [
        "> Bienvenido al Asistente de Configuración.",
        "> Analizando opciones de privacidad de tu dispositivo...",
        "> Identificando áreas de mejora en tus contraseñas...",
        "> [LISTO] - Sigue nuestras guías para optimizar tu seguridad."
    ],
    velocidad: 50
};

let lineaActual = 0;
let charIndex = 0;

function escribirTerminal() {
    const area = document.getElementById(terminalData.elementId);
    if (!area) return; // Previene error si no existe el elemento
    
    if (lineaActual < terminalData.texto.length) {
        if (charIndex === 0) {
            const p = document.createElement("p");
            p.style.fontFamily = "'JetBrains Mono', monospace";
            p.style.color = "var(--accent)";
            p.style.fontSize = "0.9rem";
            p.id = `linea-${lineaActual}`;
            area.appendChild(p);
        }

        const parrafo = document.getElementById(`linea-${lineaActual}`);
        parrafo.textContent += terminalData.texto[lineaActual].charAt(charIndex);
        charIndex++;

        if (charIndex < terminalData.texto[lineaActual].length) {
            setTimeout(escribirTerminal, terminalData.velocidad);
        } else {
            lineaActual++;
            charIndex = 0;
            setTimeout(escribirTerminal, 500); // Pausa entre líneas
        }
    }
}

// --- 2. VERIFICADOR DE CONTRASEÑAS TÉCNICO ---
// Vamos a inyectar el verificador dentro del área de protocolos después de la terminal
function cargarVerificador() {
    const area = document.getElementById(terminalData.elementId);
    if (!area) return; // Previene error si no existe el elemento
    
    const container = document.createElement("div");
    container.className = "card";
    container.style.marginTop = "2rem";
    container.innerHTML = `
        <span class="card-tag">Herramienta</span>
        <h3>Analizador de Contraseñas</h3>
        <p>Averigua qué tan segura es tu clave actual.</p>
        <div style="display:flex; gap:10px; margin-top:10px;">
            <input type="password" id="pass-checker" placeholder="Escribe aquí para probar..." 
                   style="flex-grow:1; padding:12px; background:rgba(0,0,0,0.2); border:1px solid var(--border-glass); color:white; border-radius:8px;">
            <button onclick="generarPasswordSegura()" class="btn-secondary" style="padding: 12px 20px; margin:0;" title="Generar Contraseña Segura"><i class="fas fa-random"></i></button>
        </div>
        <div id="meter" style="height:4px; width:0%; transition:0.5s; margin-top:10px; border-radius:2px;"></div>
        <p id="pass-msg" style="font-size:0.85rem; margin-top:8px; color:var(--text-s);">Esperando entrada...</p>
    `;
    area.appendChild(container);

    const input = document.getElementById("pass-checker");
    const meter = document.getElementById("meter");
    const msg = document.getElementById("pass-msg");

    input.addEventListener("input", async () => {
        const val = input.value;
        let score = 0;

        if (val.length >= 8) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[!@#$%^&*]/.test(val)) score++;

        // Simular consulta a Have I Been Pwned
        let breached = false;
        if (val.length > 0) {
            breached = await checkPasswordBreach(val);
        }

        if (val.length === 0) {
            meter.style.width = "0%";
            msg.innerText = "Esperando entrada...";
        } else if (breached) {
            meter.style.width = "20%";
            meter.style.backgroundColor = "var(--danger)"; 
            msg.innerText = "¡PELIGRO! Esta contraseña ha sido filtrada en brechas de datos. Cámbiala inmediatamente.";
        } else if (score < 2) {
            meter.style.width = "30%";
            meter.style.backgroundColor = "var(--danger)"; 
            msg.innerText = "Débil: Intenta que sea más larga y usa algún símbolo.";
        } else if (score < 4) {
            meter.style.width = "60%";
            meter.style.backgroundColor = "var(--warning)"; 
            msg.innerText = "Regular: ¡Vas bien! Agrega un número o mayúscula extra.";
        } else {
            meter.style.width = "100%";
            meter.style.backgroundColor = "var(--success)";
            msg.innerText = "Fuerte: ¡Excelente! Esta es una contraseña muy segura.";
        }
    });
}

// --- 3. QUIZ DE EVALUACIÓN ---
const preguntas = [
    { q: "¿Cuál es el vector principal del 91% de ataques?", a: "Fuerza bruta", b: "Phishing", c: "Virus USB", correct: "b" },
    { q: "¿Qué significa Zero Trust?", a: "Confianza total", b: "No confiar en nadie", c: "Sin antivirus", correct: "b" },
    { q: "¿Cuál es la contraseña más segura?", a: "123456", b: "Password123!", c: "Una frase larga con símbolos", correct: "c" },
    { q: "¿Qué es un firewall?", a: "Un antivirus", b: "Un muro de protección de red", c: "Un gestor de contraseñas", correct: "b" },
    { q: "¿Cómo se llama el ataque que cifra tus archivos?", a: "Phishing", b: "Ransomware", c: "Spyware", correct: "b" },
    { q: "¿Qué debes hacer con correos sospechosos?", a: "Abrirlos inmediatamente", b: "No abrir ni hacer clic en enlaces", c: "Responder al remitente", correct: "b" },
    { q: "¿Qué es 2FA?", a: "Dos firewalls activos", b: "Autenticación de dos factores", c: "Dos antivirus", correct: "b" },
    { q: "¿Cuál es un riesgo de Wi-Fi público?", a: "Es más rápido", b: "Puede ser interceptado", c: "Es gratis", correct: "b" },
    { q: "¿Qué protege contra malware?", a: "Un gestor de contraseñas", b: "Antivirus actualizado", c: "Cambiar el navegador", correct: "b" },
    { q: "¿Qué es una brecha de datos?", a: "Un agujero en la pared", b: "Filtración de información personal", c: "Un error de ortografía", correct: "b" }
];

let currentQ = 0;
let scoreQuiz = 0;

function iniciarQuiz() {
    currentQ = 0;
    scoreQuiz = 0;
    document.getElementById('cert-container').style.display = 'none';
    document.getElementById('diploma-area').style.display = 'none';
    
    const quizBox = document.querySelector(".quiz-box");
    quizBox.innerHTML = `<h3>Evaluación en curso...</h3><div id="q-area"></div>`;
    mostrarPregunta();
}

function mostrarPregunta() {
    const area = document.getElementById("q-area");
    if (currentQ < preguntas.length) {
        const p = preguntas[currentQ];
        area.innerHTML = `
            <p style="margin-bottom:1.5rem;">${p.q}</p>
            <div style="display:grid; gap:10px;">
                <button class="btn-secondary" onclick="checkQuiz('a')">${p.a}</button>
                <button class="btn-secondary" onclick="checkQuiz('b')">${p.b}</button>
                <button class="btn-secondary" onclick="checkQuiz('c')">${p.c}</button>
            </div>
        `;
    } else {
        area.innerHTML = `<h4>Evaluación Finalizada</h4><p>Puntaje: ${scoreQuiz}/${preguntas.length}</p>`;
        if (scoreQuiz === preguntas.length) {
            document.getElementById('cert-container').style.display = 'block';
        } else {
            area.innerHTML += `<p style="color:var(--warning); margin-top:10px;">Debes acertar todas para obtener tu certificado. ¡Vuelve a intentarlo!</p>`;
        }
    }
}

function checkQuiz(ans) {
    if (ans === preguntas[currentQ].correct) {
        alert(" Respuesta correcta.");
        scoreQuiz++;
        ganarPuntos(10, 'Respuesta correcta en el quiz');
    } else {
        alert(" Error. Revisa el glosario y las guías.");
    }
    currentQ++;
    mostrarPregunta();
}

function generarCertificado() {
    const nombre = document.getElementById('cert-name').value.trim();
    if (!nombre) {
        alert("Por favor, ingresa tu nombre.");
        return;
    }
    document.getElementById('cert-container').style.display = 'none';
    const diploma = document.getElementById('diploma-area');
    diploma.style.display = 'block';
    diploma.innerHTML = `
        <div class="diploma-card reveal active">
            <h2 style="color: var(--accent); margin-bottom: 10px;">CERTIFICADO DE CIBERSEGURIDAD</h2>
            <p>Se otorga la presente insignia a:</p>
            <h3 style="font-size: 1.8rem; margin: 15px 0; color: white;">${nombre}</h3>
            <p style="font-size: 0.9rem; color: var(--text-s);">Por completar exitosamente el entrenamiento de Binary Three y demostrar excelentes conocimientos preventivos.</p>
            <div style="margin-top: 20px; color: var(--success);"><i class="fas fa-check-circle fa-2x"></i></div>
        </div>
    `;
}

// --- 4. INICIALIZADOR GLOBAL Y CHECKLIST ---
window.onload = () => {
    // Iniciamos la terminal al cargar
    escribirTerminal();
    
    // Cargamos el verificador de claves después de un breve delay
    setTimeout(cargarVerificador, 2000);
    
    // Intersection Observer para animaciones de scroll (.reveal)
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    reveals.forEach(reveal => {
        observer.observe(reveal);
    });

    // Cargar Checklist de LocalStorage
    document.querySelectorAll('.checklist-item').forEach(item => {
        if (item.id) {
            const isChecked = localStorage.getItem('binary_three_' + item.id) === 'true';
            if (isChecked) {
                item.classList.add('checked');
            }
        }
    });
    actualizarProgreso();

    // Animación de Contadores
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let count = 0;
                const updateCount = () => {
                    const inc = target / 40;
                    if(count < target) {
                        count += inc;
                        entry.target.innerText = Math.ceil(count);
                        setTimeout(updateCount, 30);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(counter => counterObserver.observe(counter));
