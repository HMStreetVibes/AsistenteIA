const botonHablar = document.getElementById('hablar');
const textoUsuario = document.getElementById('textoUsuario');
const audioRespuesta = document.getElementById('respuestaAudio');
const bubbles = document.getElementById('bubbles');

const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = 'es-ES';
reconocimiento.interimResults = false;

let memoria = JSON.parse(localStorage.getItem('memoria')) || {
    nombre: null,
    datos: {},
    cumpleaños: {}
};

function guardarMemoria() {
    localStorage.setItem('memoria', JSON.stringify(memoria));
}

function limpiarMemoria(clave) {
    if (clave === 'nombre') {
        memoria.nombre = null;
    } else if (memoria.datos[clave]) {
        delete memoria.datos[clave];
    } else if (memoria.cumpleaños[clave]) {
        delete memoria.cumpleaños[clave];
    }
    guardarMemoria();
}

function borrarTodaMemoria() {
    memoria = { nombre: null, datos: {}, cumpleaños: {} };
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

    if (texto.includes("me llamo")) {
        const nombreExtraido = texto.replace("me llamo", "").trim();
        if (nombreExtraido) {
            memoria.nombre = nombreExtraido;
            guardarMemoria();
            responder(`¡Hola ${nombreExtraido}! Ahora sé tu nombre.`);
            return;
        }
    }

    if (texto.includes("mi cumpleaños es el")) {
        const fechaExtraida = texto.replace("mi cumpleaños es el", "").trim();
        if (fechaExtraida) {
            memoria.cumpleaños[memoria.nombre || "usuario"] = fechaExtraida;
            guardarMemoria();
            responder(`Perfecto, recordaré que tu cumpleaños es el ${fechaExtraida}.`);
            return;
        }
    }

    if (texto.includes("cuándo es mi cumpleaños")) {
        const fechaGuardada = memoria.cumpleaños[memoria.nombre || "usuario"];
        if (fechaGuardada) {
            responder(`Tu cumpleaños es el ${fechaGuardada}.`);
        } else {
            responder("Aún no me has dicho cuándo es tu cumpleaños.");
        }
        return;
    }

    if (texto.includes("cuéntame un chiste") || texto.includes("dime un chiste") || texto.includes("chiste")) {
        const chistes = [
            "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter.",
            "¿Qué le dice una iguana a su hermana gemela? ¡Iguanita!",
            "¿Cuál es el animal más antiguo? La cebra, porque está en blanco y negro.",
            "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
            "¿Por qué el libro de matemáticas se deprimió? Porque tenía demasiados problemas."
        ];
        const chiste = chistes[Math.floor(Math.random() * chistes.length)];
        responder(chiste);
        return;
    }

    if (texto.includes("dame un dato curioso") || texto.includes("cuéntame algo curioso") || texto.includes("dato curioso")) {
        const datos = [
            "Las abejas pueden reconocer rostros humanos.",
            "Los pulpos tienen tres corazones y sangre azul.",
            "El corazón de una ballena azul puede pesar tanto como un auto pequeño.",
            "Los flamencos rosados nacen grises.",
            "Las mariposas saborean con sus patas."
        ];
        const dato = datos[Math.floor(Math.random() * datos.length)];
        responder(dato);
        return;
    }

    const operacion = procesarOperacionMatematica(texto);
    if (operacion) {
        responder(operacion);
        return;
    }

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

    if (texto.includes("hola") || texto.includes("buenos días") || texto.includes("buenas tardes") || texto.includes("buenas noches") || texto.includes("qué tal") || texto.includes("qué onda") || texto.includes("cómo estás") || texto.includes("qué hay") || texto.includes("cómo te va")) {
        return `¡Hola ${nombre}, ¿cómo estás?`;
    } else if (texto.includes("cómo va todo") || texto.includes("qué tal todo") || texto.includes("cómo te encuentras") || texto.includes("qué tal te va") || texto.includes("todo bien")) {
        return "Todo bien, gracias. ¿Y tú?";
    } else if (texto.includes("qué haces") || texto.includes("qué estás haciendo") || texto.includes("en qué estás trabajando") || texto.includes("qué estás haciendo ahora") || texto.includes("qué estás haciendo en este momento")) {
        return "Estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?";
    } else if (texto.includes("cuál es tu hobby") || texto.includes("qué te gusta hacer") || texto.includes("qué haces en tu tiempo libre") || texto.includes("qué te apasiona") || texto.includes("qué te entretiene")) {
        return "Me gusta aprender de tus preguntas y ayudarte en lo que pueda.";
    } else if (texto.includes("cuál es tu película favorita") || texto.includes("qué película te gusta") || texto.includes("qué película prefieres") || texto.includes("qué película verías") || texto.includes("cuál es tu película preferida")) {
        return "No tengo una película favorita, pero me encantaría saber cuál es la tuya.";
    } else if (texto.includes("cuál es tu libro favorito") || texto.includes("qué libro te gusta") || texto.includes("qué libro prefieres") || texto.includes("cuál es el mejor libro para ti") || texto.includes("qué libro recomendarías")) {
        return "No tengo un libro favorito, pero me gustaría saber cuál es el tuyo.";
    } else if (texto.includes("cuál es tu deporte favorito") || texto.includes("qué deporte te gusta") || texto.includes("qué deporte prefieres") || texto.includes("qué deporte practicas") || texto.includes("cuál es tu deporte preferido")) {
        return "No tengo un deporte favorito, pero me gustaría saber cuál es el tuyo.";
    } else if (texto.includes("cual es tu animal favorito") || texto.includes("qué animal te gusta") || texto.includes("qué animal prefieres") || texto.includes("qué tipo de animales te gustan") || texto.includes("cuál es tu mascota favorita")) {
        return "No tengo un animal favorito, pero me gustaría saber cuál es el tuyo :)";
    } else if (texto.includes("adiós") || texto.includes("hasta luego") || texto.includes("nos vemos") || texto.includes("chao") || texto.includes("hasta pronto") || texto.includes("cuídate") || texto.includes("hasta la próxima")) {
        return `Hasta luego, ${nombre}. Cuídate mucho.`;
    } else if (texto.includes("cuál es tu nombre") || texto.includes("cómo te llamas") || texto.includes("quién eres") || texto.includes("qué nombre tienes") || texto.includes("quién es tu creador")) {
        return `Me llamo Asistente IA. ¿Y tú?`;
    } else if (texto.includes("cómo estás") || texto.includes("cómo te encuentras") || texto.includes("cómo va todo") || texto.includes("qué tal estás") || texto.includes("cómo te sientes")) {
        return "Estoy bien, gracias por preguntar.";
    } else if (texto.includes("sabes sumar") || texto.includes("sabes operaciones básicas") || texto.includes("sabes hacer cuentas") || texto.includes("sabes hacer matemáticas") || texto.includes("puedes hacer cálculos")) {
        return "Sí, puedo ayudarte con operaciones matemáticas simples. ¿Qué necesitas calcular?";
    } else if (texto.includes("qué puedes hacer") || texto.includes("qué sabes hacer") || texto.includes("qué cosas puedes hacer") || texto.includes("qué habilidades tienes") || texto.includes("qué funciones tienes")) {
        return "Puedo responder algunas preguntas simples, también puedo realizar cálculos matemáticos básicos como suma, resta, multiplicación y división. Igual puedo decirte qué día es hoy, la hora y contarte un chiste. ¿En qué gustas que te ayude hoy?";
    } else if (texto.includes("gracias") || texto.includes("te agradezco") || texto.includes("muchas gracias") || texto.includes("te doy las gracias") || texto.includes("mil gracias")) {
        return "¡De nada! Estoy aquí para ayudarte.";
    } else if (texto.includes("qué hora es") || texto.includes("hora") || texto.includes("qué hora tienes") || texto.includes("cuál es la hora") || texto.includes("dime la hora")) {
        return `Son las ${hoy.getHours()} con ${hoy.getMinutes()} minutos.`;
    } else if (texto.includes("qué día es hoy") || texto.includes("día de hoy") || texto.includes("fecha") || texto.includes("cuál es la fecha") || texto.includes("qué fecha es hoy")) {
        return `Hoy es ${hoy.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
    } else if (texto.includes("cuántos años tienes") || texto.includes("edad") || texto.includes("qué edad tienes") || texto.includes("qué años tienes") || texto.includes("cuántos años cumples")) {
        return "No tengo edad como los humanos, pero siempre estoy aprendiendo.";
    } else if (texto.includes("quién te creó") || texto.includes("quién eres") || texto.includes("de dónde vienes") || texto.includes("quién te hizo") || texto.includes("quién es tu creador")) {
        return "Fui creado por Eduardo, un desarrollador muy creativo.";
    } else if (texto.includes("puedes ayudarme") || texto.includes("ayuda") || texto.includes("necesito ayuda") || texto.includes("me puedes ayudar") || texto.includes("quiero ayuda")) {
        return "Claro, dime en qué necesitas ayuda.";
    } else if (texto.includes("dónde estás") || texto.includes("dónde te encuentras") || texto.includes("dónde vives") || texto.includes("en qué lugar estás") || texto.includes("dónde te ubicas")) {
        return "Estoy en tu dispositivo, ¡siempre contigo!";
    } else if (texto.includes("cuál es tu color favorito") || texto.includes("cuál es tu color preferido") || texto.includes("cuál es el color que te gusta") || texto.includes("qué color te gusta")) {
        return "Me gustan todos los colores por igual, pero me alegra saber cuál es tu favorito.";
    }

    return "No entendí muy bien eso. ¿Puedes repetirlo de otra forma?";
}
