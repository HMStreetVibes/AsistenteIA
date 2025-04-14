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

    for (let entrada of memoria.aprendizaje) {
        if (texto.includes(entrada.pregunta)) {
            responder(elegirRespuesta(entrada.respuestas));
            return;
        }
    }

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
            "¿Por qué el libro de matemáticas se deprimió? Porque tenía demasiados problemas.",
            "¿Por qué los esqueletos no pelean entre ellos? Porque no tienen agallas.",
            "¿Qué le dice un jardinero a otro? ¡Disfrutemos mientras podamos!",
            "¿Qué hace una vaca cuando sale el sol? Sombra.",
            "¿Por qué no se puede discutir con un número impar? Porque no es par-ticipativo.",
            "¿Cómo se llama el campeón de buceo japonés? Tokofondo.",
            "¿Y el subcampeón? Kasitoko.",
            "¿Por qué no juega al escondite el café? Porque siempre se encuentra en el fondo.",
            "¿Qué le dijo un techo a otro? Techo de menos.",
            "¿Por qué el tomate se sonrojó? Porque vio al otro desnudo.",
            "¿Qué hace una computadora cuando tiene hambre? Se come un byte.",
            "¿Cómo se despiden los químicos? Ácido un placer.",
            "¿Por qué los peces no van a la escuela? Porque ya están en el agua.",
            "¿Qué le dice una cebolla a otra? ¡Nos vemos en las lágrimas!",
            "¿Cómo se dice pañuelo en japonés? Saka-moko.",
            "¿Qué hace un pez? ¡Nada!",
            "¿Qué le dijo una impresora a otra? ¿Esa hoja es tuya o es impresión mía?",
            "¿Cuál es el café más peligroso del mundo? El ex-preso.",
            "¿Qué le dice un gusano a otro gusano? Voy a dar una vuelta a la manzana.",
            "¿Qué le dice un semáforo a otro? No me mires, me estoy cambiando.",
            "¿Qué le dijo una escoba a otra? ¡Vamos a barrer!",
            "¿Por qué los pájaros no usan WhatsApp? Porque ya tienen pío-pío.",
            "¿Por qué lloraba el libro de historia? Porque estaba lleno de tragedias.",
            "¿Qué hace un león en una biblioteca? Busca libros para rugir de risa.",
            "¿Cómo se dice pelo sucio en chino? Chin cham pu.",
            "¿Qué pasa si tiras un pato al agua? Nada.",
            "¿Cuál es el colmo de un electricista? No encontrar su corriente de inspiración.",
            "¿Cómo se dice despido en árabe? Tasalí.",
            "¿Qué hace un perro con un taladro? Taladrando.",
            "¿Qué le dice una pared a otra pared? Nos vemos en la esquina.",
            "¿Por qué las focas miran siempre hacia arriba? ¡Porque ahí están los focos!",
            "¿Cómo se llama el campeón de buceo ruso? Sinkalovsky.",
            "¿Qué hace un pato con una pata? ¡Cojea!",
            "¿Por qué el reloj fue a la escuela? Porque quería aprender a dar la hora.",
            "¿Qué le dijo la luna al sol? ¡Tanto tiempo sin vernos!",
            "¿Por qué el mar nunca se seca? Porque no trabaja.",
            "¿Qué hace un globo en una fiesta? ¡Globera!",
            "¿Por qué los fantasmas no mienten? Porque se les ve a través.",
            "¿Cómo se dice migraña en japonés? Tan-kemato.",
            "¿Qué hace un plátano en una fiesta? ¡Baila la banana!",
            "¿Por qué el perro se sentó en la fotocopiadora? Para sacar copias perrunas.",
            "¿Cómo se llama el primo vegano de Bruce Lee? Broco Lee.",
            "¿Qué hace una roca en el cine? ¡Ve la película!",
            "¿Qué le dijo el cero al ocho? Bonito cinturón.",
            "¿Cómo se despide un vaquero? ¡Adiós vaquero!",
            "¿Qué le dice el viento a una hoja? ¡Vamos a volar!"
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
            "Las mariposas saborean con sus patas.",
            "Los tiburones han existido desde antes que los árboles.",
            "Las jirafas no tienen cuerdas vocales.",
            "Un solo rayo contiene suficiente energía para tostar 100,000 rebanadas de pan.",
            "Los caracoles pueden dormir hasta tres años.",
            "El ADN humano es un 60% igual al de los plátanos.",
            "Los pingüinos tienen rodillas ocultas bajo sus plumas.",
            "Las estrellas de mar no tienen cerebro.",
            "El primer correo electrónico se envió en 1971.",
            "Los koalas tienen huellas dactilares casi idénticas a las humanas.",
            "Los gatos no pueden saborear lo dulce.",
            "Una nube puede pesar más de un millón de kilogramos.",
            "La miel nunca se echa a perder.",
            "En Júpiter y Saturno podría llover diamantes.",
            "Los humanos comparten aproximadamente un 50% del ADN con las vacas.",
            "Los camarones pueden ver más colores que los humanos.",
            "Los ojos de los avestruces son más grandes que su cerebro.",
            "El sol representa el 99.86% de la masa del sistema solar.",
            "Los dientes humanos son tan duros como los de un tiburón.",
            "Los plátanos son ligeramente radiactivos.",
            "Hay más estrellas en el universo que granos de arena en la Tierra.",
            "Las cebras son negras con rayas blancas, no al revés.",
            "El colibrí puede batir sus alas hasta 80 veces por segundo.",
            "La nariz humana puede detectar más de un billón de olores.",
            "Los bebés nacen sin rótulas en las rodillas.",
            "La Tierra no es una esfera perfecta; está ligeramente achatada en los polos.",
            "El animal más rápido en la Tierra es el halcón peregrino, no el guepardo.",
            "Los delfines se llaman entre sí por nombres específicos.",
            "Las hormigas no duermen.",
            "Las vacas tienen mejores amigas y se estresan si se separan.",
            "El chocolate era usado como moneda en la civilización azteca.",
            "Las personas zurdas tienden a aprender a escribir mejor bajo el agua.",
            "Las papas pueden absorber y reflejar señales WiFi.",
            "El alfabeto hawaiano solo tiene 13 letras.",
            "Los cuervos pueden recordar rostros y guardar rencor.",
            "Los humanos brillamos en la oscuridad, pero nuestros ojos no lo pueden ver.",
            "El 20% del oxígeno del planeta lo produce el Amazonas.",
            "Los peces payaso nacen macho y pueden cambiar de sexo.",
            "Una cucaracha puede vivir semanas sin cabeza.",
            "El Monte Everest crece unos 4 mm cada año.",
            "Los gatos pueden hacer más de 100 sonidos vocales.",
            "El papel se puede doblar como máximo 7 veces (con fuerza humana normal).",
            "Los astronautas no pueden eructar en el espacio.",
            "Las ovejas tienen excelente memoria facial.",
            "El agua caliente se congela más rápido que el agua fría, se llama efecto Mpemba."
        ];
        const dato = datos[Math.floor(Math.random() * datos.length)];
        responder(dato);
        return;
    }

    preguntarAprendizaje(texto);

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

function preguntarAprendizaje(pregunta) {
    const respuestaUsuario = prompt(`No sé cómo responder a: "${pregunta}". ¿Qué debería decir la próxima vez?`);
    if (respuestaUsuario) {
        // Verificar si ya hay una entrada similar
        let entrada = memoria.aprendizaje.find(e => pregunta.includes(e.pregunta));
        if (entrada) {
            entrada.respuestas.push(respuestaUsuario);
        } else {
            memoria.aprendizaje.push({
                pregunta: pregunta,
                respuestas: [respuestaUsuario]
            });
        }
        guardarMemoria();
        responder("Gracias por enseñarme. Lo recordaré.");
    } else {
        responder("Está bien, intentaré aprender en otro momento.");
    }
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
