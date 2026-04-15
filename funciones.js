
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