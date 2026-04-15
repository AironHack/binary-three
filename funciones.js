
// --- 1. CONFIGURACIÓN DEL SIMULADOR DE TERMINAL (Efecto de Escritura) ---
const terminalData = {
    elementId: "content-area", // Se inyectará en la sección de Protocolos
    texto: [
        "> Iniciando Protocolo Zero Trust...",
        "> Verificando integridad de la red académica...",
        "> Escaneando vectores de Phishing detectados...",
        "> [ESTADO: PROTEGIDO] - Sistema listo para análisis técnico."
    ],
    velocidad: 50
};

let lineaActual = 0;
let charIndex = 0;

function escribirTerminal() {
    const area = document.getElementById(terminalData.elementId);
    
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
    const container = document.createElement("div");
    container.className = "card";
    container.style.marginTop = "2rem";
    container.innerHTML = `
        <span class="card-tag">Toolbox</span>
        <h3>Shield-Check: Analizador de Claves</h3>
        <p>Las contraseñas débiles son el 80% de las brechas.</p>
        <input type="password" id="pass-checker" placeholder="Ingresa clave de prueba..." 
               style="width:100%; padding:12px; background:rgba(0,0,0,0.3); border:1px solid var(--border-glass); color:white; border-radius:8px; margin-top:10px;">
        <div id="meter" style="height:4px; width:0%; transition:0.5s; margin-top:10px; border-radius:2px;"></div>
        <p id="pass-msg" style="font-size:0.8rem; margin-top:5px; color:var(--text-s);">Esperando entrada...</p>
    `;
    area.appendChild(container);

    const input = document.getElementById("pass-checker");
    const meter = document.getElementById("meter");
    const msg = document.getElementById("pass-msg");

    input.addEventListener("input", () => {
        const val = input.value;
        let score = 0;

        if (val.length >= 8) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[!@#$%^&*]/.test(val)) score++;

        if (val.length === 0) {
            meter.style.width = "0%";
            msg.innerText = "Esperando entrada...";
        } else if (score < 2) {
            meter.style.width = "30%";
            meter.style.backgroundColor = "#ef4444"; // Rojo Tailwind
            msg.innerText = "CRÍTICO: Contraseña vulnerable.";
        } else if (score < 4) {
            meter.style.width = "60%";
            meter.style.backgroundColor = "#f59e0b"; // Ámbar Tailwind
            msg.innerText = "MEDIO: Añade símbolos o números.";
        } else {
            meter.style.width = "100%";
            meter.style.backgroundColor = "var(--accent)";
            msg.innerText = "SEGURO: Protocolo de cifrado óptimo.";
        }
    });
}

// --- 3. QUIZ DE EVALUACIÓN ---
const preguntas = [
    { q: "¿Cuál es el vector principal del 91% de ataques?", a: "Fuerza bruta", b: "Phishing", c: "Virus USB", correct: "b" },
    { q: "¿Qué significa Zero Trust?", a: "Confianza total", b: "No confiar en nadie", c: "Sin antivirus", correct: "b" }
];

let currentQ = 0;

function iniciarQuiz() {
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
        area.innerHTML = `<h4>Evaluación Finalizada</h4><p>Nivel de concienciación: ALTO. Sigue protegiendo tus datos.</p>`;
    }
}

function checkQuiz(ans) {
    if (ans === preguntas[currentQ].correct) {
        alert(" Respuesta técnica correcta.");
    } else {
        alert(" Error de protocolo. Revisa el catálogo de amenazas.");
    }
    currentQ++;
    mostrarPregunta();
}

// --- 4. INICIALIZADOR GLOBAL ---
window.onload = () => {
    // Iniciamos la terminal al cargar
    escribirTerminal();
    
    // Cargamos el verificador de claves después de un breve delay
    setTimeout(cargarVerificador, 2000);
    
    // Escuchar el botón del quiz (ya definido en tu HTML)
    // El botón de tu HTML ya tiene onclick="iniciarQuiz()", así que funcionará directo.
};
// Agrega esto a tus funciones de Verificador y Quiz
const logs = [];

function registrarEvento(evento, severidad) {
    const timestamp = new Date().toLocaleTimeString();
    const nuevoLog = `[${timestamp}] [${severidad}] ${evento}`;
    logs.unshift(nuevoLog); // Añade al inicio del array
    actualizarVistaLogs();
}

function actualizarVistaLogs() {
    const logArea = document.getElementById("log-viewer"); // Necesitarás un div con este ID
    if(logArea) {
        logArea.innerHTML = logs.map(log => `<p>> ${log}</p>`).join("");
    }
}
function generarPasswordSegura(largo = 16) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0; i < largo; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    // Puedes inyectar esto en el input del password checker
    document.getElementById("pass-checker").value = retVal;
    // Disparar manualmente el evento 'input' para que el medidor se actualice
    document.getElementById("pass-checker").dispatchEvent(new Event('input'));
}
function simuladorAmenazas() {
    const amenazas = ["Fuerza Bruta en Puerto 22", "Inyección SQL detectada", "Intento de login: Admin"];
    setInterval(() => {
        const index = Math.floor(Math.random() * amenazas.length);
        console.warn(`ALERTA: ${amenazas[index]}`);
        // Aquí podrías hacer que el borde de la página parpadee en rojo un segundo
        document.body.style.border = "2px solid red";
        setTimeout(() => document.body.style.border = "none", 500);
        registrarEvento(`AMENAZA: ${amenazas[index]}`, "HIGH");
    }, 15000); // Cada 15 segundos 
}
// --- 5. ESCÁNER DE PUERTOS (AUDITORÍA ACTIVA) ---
function ejecutarEscaneo() {
    const puertos = [21, 22, 80, 443, 3306, 8080];
    registrarEvento("Iniciando escaneo de puertos de red...", "INFO");
    
    puertos.forEach((puerto, index) => {
        setTimeout(() => {
            // Simulación aleatoria de puertos abiertos/cerrados
            const estado = Math.random() > 0.7 ? "ABIERTO" : "FILTRADO";
            const severidad = estado === "ABIERTO" ? "HIGH" : "SUCCESS";
            registrarEvento(`Análisis Nodo Puerto ${puerto}: [${estado}]`, severidad);
        }, index * 800); // Aparecen uno tras otro cada 800ms
    });
}

// --- 6. PROTOCOLO DE EMERGENCIA (TECLADO) ---
// Si presionas 'ESC', el sistema simula un "Wipe" (limpieza) visual
window.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        registrarEvento("PROTOCOLO DE EMERGENCIA: Tecla ESC detectada", "HIGH");
        document.body.style.filter = "invert(1) grayscale(1) contrast(2)";
        setTimeout(() => {
            document.body.style.filter = "none";
            alert("⚠️ BINARY THREE: Protocolo de pánico ejecutado. Caché de sesión purgada.");
        }, 800);
    }
});

// --- 7. DETECTOR DE INACTIVIDAD (SEGURIDAD DE SESIÓN) ---
let tiempoInactivo;

function resetTimer() {
    clearTimeout(tiempoInactivo);
    tiempoInactivo = setTimeout(() => {
        registrarEvento("ADVERTENCIA: Sesión inactiva detectada.", "WARNING");
        // Efecto visual de advertencia
        const warningDiv = document.createElement("div");
        warningDiv.innerHTML = "SESIÓN INACTIVA - MUEVE EL MOUSE";
        warningDiv.style = "position:fixed; top:0; left:0; width:100%; background:red; color:white; text-align:center; z-index:9999; font-weight:bold; padding:5px;";
        document.body.appendChild(warningDiv);
        setTimeout(() => warningDiv.remove(), 3000);
    }, 60000); // Se activa tras 60 segundos de inactividad
}

// Escuchar movimientos para resetear el timer de inactividad
window.onmousemove = resetTimer;
window.onkeypress = resetTimer;