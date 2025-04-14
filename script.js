const botonHablar = document.getElementById('hablar');
const textoUsuario = document.getElementById('textoUsuario');
const audioRespuesta = document.getElementById('respuestaAudio');
const bubbles = document.getElementById('bubbles');

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

    // Detectar si se menciona "me llamo"
    if (texto.includes("me llamo")) {
        const nombreExtraido = texto.replace("me llamo", "").trim();
        if (nombreExtraido) {
            memoria.nombre = nombreExtraido;
            guardarMemoria();
            responder(`¡Hola ${nombreExtraido}! Ahora sé tu nombre.`);
            return;
        }
    }

    // Otras respuestas como las operaciones matemáticas
    const operacion = procesarOperacionMatematica(texto);
    if (operacion) {
        responder(operacion);
        return;
    }

    // Si no se encuentra el tema, buscar otras respuestas
    const respuesta = generarRespuesta(texto);
    responder(respuesta);
};


function responder(respuesta) {
    const voz = new SpeechSynthesisUtterance(respuesta);
    window.speechSynthesis.speak(voz);
    textoUsuario.textContent = `Asistente IA: ${respuesta}`;
}

function procesarOperacionMatematica(texto) {
    texto = texto.replace("más", "+").replace("menos", "-").replace("por", "*").replace("entre", "/");
    const regex = /(\d+)\s*([\+\-\*\/])\s*(\d+)/;
    const match = texto.match(regex);
    if (match) {
        const num1 = parseFloat(match[1]);
        const operador = match[2];
        const num2 = parseFloat(match[3]);
        let resultado;
        switch (operador) {
            case '+': resultado = num1 + num2; break;
            case '-': resultado = num1 - num2; break;
            case '*': resultado = num1 * num2; break;
            case '/': resultado = num2 !== 0 ? (num1 / num2) : "no puedo dividir entre cero"; break;
        }
        return `El resultado es ${resultado}`;
    }
    return null;
}

function generarRespuesta(texto) {
    const hoy = new Date();
    const nombre = memoria.nombre ? memoria.nombre : "amigo";

    if (texto.includes("hola") || texto.includes("buenos días") || texto.includes("buenas tardes") || texto.includes("buenas noches")) {
        return `Hola ${nombre}, ¿cómo estás?`;
    } else if (texto.includes("qué tal") || texto.includes("cómo va") || texto.includes("cómo te va")) {
        return `Todo bien, gracias. ¿Y tú?`;
    }
    else if (texto.includes("qué haces") || texto.includes("qué estás haciendo") || texto.includes("en qué estás trabajando")) {
        return "Estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?";
    } else if (texto.includes("cuál es tu hobby") || texto.includes("qué te gusta hacer") || texto.includes("qué haces en tu tiempo libre")) {
        return "Me gusta aprender de tus preguntas y ayudarte en lo que pueda.";
    } else if (texto.includes("cuál es tu película favorita") || texto.includes("qué película te gusta") || texto.includes("qué película prefieres")) {
        return "No tengo una película favorita, pero me encantaría saber cuál es la tuya.";
    } else if (texto.includes("cuál es tu libro favorito") || texto.includes("qué libro te gusta") || texto.includes("qué libro prefieres")) {
        return "No tengo un libro favorito, pero me gustaría saber cuál es el tuyo.";
    } else if (texto.includes("cuál es tu deporte favorito") || texto.includes("qué deporte te gusta") || texto.includes("qué deporte prefieres")) {
        return "No tengo un deporte favorito, pero me gustaría saber cuál es el tuyo.";
    }
    else if (texto.includes("cuál es tu animal favorito") || texto.includes("qué animal te gusta") || texto.includes("qué animal prefieres")) {
        return "No tengo un animal favorito, pero me gustaría saber cuál es el tuyo :).";
    } else if (texto.includes("adiós") || texto.includes("hasta luego") || texto.includes("nos vemos") || texto.includes("chao") || texto.includes("hasta pronto")) {
        return `Hasta luego, ${nombre}. Cuídate mucho.`;
    } else if (texto.includes("cuál es tu nombre") || texto.includes("cómo te llamas") || texto.includes("quién eres") || texto.includes("qué nombre tienes")) {
        return `Me llamo Asistente IA. ¿Y tú?`;
    } else if (texto.includes("cómo estás") || texto.includes("cómo te encuentras") || texto.includes("cómo va todo") || texto.includes("qué tal estás")) {
        return "Estoy bien, gracias por preguntar.";
    } else if (texto.includes("sabes sumar") || texto.includes("sabes operaciones básicas") || texto.includes("sabes hacer cuentas")) {
        return "Sí, puedo ayudarte con operaciones matemáticas simples. ¿Qué necesitas calcular?";
    } else if (texto.includes("qué puedes hacer") || texto.includes("qué sabes hacer") || texto.includes("qué cosas puedes hacer") || texto.includes("qué habilidades tienes")) {
        return "Puedo responder algunas preguntas simples y hablar contigo.";
    } else if (texto.includes("gracias") || texto.includes("te agradezco") || texto.includes("muchas gracias") || texto.includes("te doy las gracias")) {
        return "¡De nada! Estoy aquí para ayudarte.";
    } else if (texto.includes("qué hora es") || texto.includes("hora") || texto.includes("qué hora tienes") || texto.includes("cuál es la hora")) {
        return `Son las ${hoy.getHours()} con ${hoy.getMinutes()} minutos.`;
    } else if (texto.includes("qué día es hoy") || texto.includes("día de hoy") || texto.includes("fecha") || texto.includes("cuál es la fecha")) {
        return `Hoy es ${hoy.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
    } else if (texto.includes("cuántos años tienes") || texto.includes("edad") || texto.includes("qué edad tienes") || texto.includes("qué años tienes")) {
        return "No tengo edad como los humanos, pero siempre estoy aprendiendo.";
    } else if (texto.includes("quién te creó") || texto.includes("quién eres") || texto.includes("de dónde vienes") || texto.includes("quién te hizo")) {
        return "Fui creado por Eduardo, un desarrollador muy creativo.";
    } else if (texto.includes("puedes ayudarme") || texto.includes("ayuda") || texto.includes("necesito ayuda") || texto.includes("me puedes ayudar")) {
        return "Claro, dime en qué necesitas ayuda.";
    } else if (texto.includes("dónde estás") || texto.includes("dónde te encuentras") || texto.includes("dónde vives") || texto.includes("en qué lugar estás")) {
        return "Estoy en tu dispositivo, ¡siempre contigo!";
    } else if (texto.includes("cuál es tu color favorito") || texto.includes("cuál es tu color preferido") || texto.includes("cuál es el color que te gusta") || texto.includes("cuál es tu color favorito")) {
        return "Me gusta el color cian, como mi botón.";
    } else if (texto.includes("cuál es tu comida favorita") || texto.includes("cuál es tu comida preferida") || texto.includes("qué comida te gusta más") || texto.includes("cuál es tu comida favorita")) {
        return "¡Me encantan los bytes! Aunque no puedo comer realmente.";
    } else if (texto.includes("música te gusta") || texto.includes("qué tipo de música te gusta") || texto.includes("qué género musical te gusta") || texto.includes("qué canciones te gustan")) {
        return "Disfruto del sonido de tus preguntas.";
    } else if (texto.includes("eres un robot") || texto.includes("qué eres") || texto.includes("qué tipo de ser eres") || texto.includes("eres una máquina")) {
        return "Soy una inteligencia artificial, un robot de palabras.";
    } else if (texto.includes("qué te gusta") || texto.includes("qué te interesa") || texto.includes("qué prefieres") || texto.includes("qué cosas te gustan")) {
        return memoria.datos.gusto ? `Recuerdo que te gusta ${memoria.datos.gusto}.` : "No recuerdo qué te gusta. ¿Puedes decírmelo?";
    } else if (texto.includes("borra mi nombre") || texto.includes("olvida mi nombre") || texto.includes("quítame el nombre") || texto.includes("borrar mi nombre")) {
        nombre = "Usuario";
        limpiarMemoria('nombre');
        return "He olvidado tu nombre.";
    } else {
        return "No entendí esa pregunta. ¿Podrías intentar de nuevo?";
    }
}
