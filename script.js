const botonHablar = document.getElementById('hablar');
const textoUsuario = document.getElementById('textoUsuario');
const audioRespuesta = document.getElementById('respuestaAudio');
const bubbles = document.getElementById('bubbles');

// Aquí debes poner tu API key de OpenRouter.ai
const API_KEY = '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'; // reemplaza esto con tu clave

const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES';
reconocimiento.interimResults = false;

let memoria = JSON.parse(localStorage.getItem('memoria')) || {
    nombre: null,
    datos: {}
};

function guardarMemoria() {
    localStorage.setItem('memoria', JSON.stringify(memoria));
}

function limpiarMemoria(clave) {
    if (clave === 'nombre') {
        memoria.nombre = null;
    } else if (memoria.datos[clave]) {
        delete memoria.datos[clave];
    }
    guardarMemoria();
}

function borrarTodaMemoria() {
    memoria = { nombre: null, datos: {} };
    localStorage.removeItem('memoria');
    guardarMemoria();
}

botonHablar.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    textoUsuario.textContent = 'Escuchando...';
    bubbles.style.display = 'flex';
    reconocimiento.start();
});

reconocimiento.onresult = async (event) => {
    let texto = event.results[0][0].transcript;
    texto = texto.toLowerCase();
    textoUsuario.textContent = 'Tú: ' + texto;
    bubbles.style.display = 'none';

    // Aquí le decimos a OpenRouter.ai que nos dé una respuesta inteligente
    const respuesta = await obtenerRespuestaAI(texto);
    responder(respuesta);
};

// Función para interactuar con OpenRouter.ai
async function obtenerRespuestaAI(texto) {
    const respuesta = await fetch('https://api.openrouter.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo', // Usa el modelo que más te convenga
            messages: [{ role: 'user', content: texto }],
            max_tokens: 150,
        })
    });

    const data = await respuesta.json();
    return data.choices[0].message.content;
}

function responder(respuesta) {
    const voz = new SpeechSynthesisUtterance(respuesta);
    window.speechSynthesis.speak(voz);
    textoUsuario.textContent = `Asistente IA: ${respuesta}`;
}
