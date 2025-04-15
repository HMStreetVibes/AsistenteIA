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

    if (texto.includes("dame un consejo sobre") || texto.includes("dame un consejo acerca de") || texto.includes("un consejo de")) {
        const temas = {
            "amistad": [
                "Rodéate de personas que te inspiren a ser mejor y que estén contigo en los buenos y malos momentos.",
                "La amistad verdadera se construye con confianza y tiempo, no con palabras vacías.",
                "Sé un buen amigo, pero también recuerda ser sincero, incluso cuando no te convenga.",
            ],
            "amor": [
                "El amor propio es la base para amar a los demás. No lo olvides.",
                "No busques el amor en otra persona si aún no te amas a ti mismo.",
                "El amor verdadero no es perfecto, pero es sincero y recíproco.",
            ],
            "salud": [
                "Pequeños hábitos diarios como caminar, dormir bien y tomar agua pueden cambiar tu vida.",
                "Recuerda que la salud no es solo la ausencia de enfermedad, es bienestar físico, mental y emocional.",
                "Un cuerpo saludable necesita una mente tranquila. No subestimes el poder de la calma."
            ],
            "estudios": [
                "No estudies más, estudia mejor. La calidad del estudio vale más que la cantidad.",
                "Organiza tu tiempo y estudia con propósito, no con presión.",
                "Haz pausas mientras estudias, tu cerebro necesita descanso para rendir al máximo."
            ],
            "trabajo": [
                "Haz lo que amas, y si no puedes aún, ama lo que haces mientras llegas a ello.",
                "A veces, el trabajo en equipo te enseña más que trabajar solo.",
                "No se trata solo de trabajar duro, sino de trabajar de manera inteligente."
            ],
            "familia": [
                "Aprecia los momentos con tu familia, el tiempo no se recupera.",
                "La familia te puede apoyar en los momentos más difíciles, nunca la des por sentada.",
                "Recuerda que, en momentos difíciles, lo que realmente importa es estar rodeado de los que te quieren."
            ],
            "dinero": [
                "Gasta menos de lo que ganas y ahorra un poco cada mes, incluso si es poco.",
                "No es cuánto ganas, sino cuánto ahorras lo que te permitirá tener estabilidad.",
                "El dinero no compra la felicidad, pero la libertad financiera sí te da muchas opciones."
            ],
            "motivación": [
                "El primer paso no te lleva a donde quieres ir, pero te saca de donde estás.",
                "La motivación es como un fuego, debes avivarlo todos los días.",
                "Los grandes logros comienzan con un primer paso. No te detengas."
            ],
            "fracaso": [
                "Fracasar no es lo contrario al éxito, es parte del camino.",
                "Cada fracaso es una oportunidad de aprendizaje, no lo veas como el fin.",
                "No tengas miedo al fracaso, tienes el derecho de intentar tantas veces como sea necesario."
            ],
            "ansiedad": [
                "Respira profundo, vive el momento y recuerda que no todo tiene que estar bajo control.",
                "Haz lo mejor que puedas, y recuerda que no todo depende de ti.",
                "La ansiedad es el miedo al futuro. Concéntrate en lo que puedes hacer ahora."
            ],
            "autoestima": [
                "Tú eres suficiente. No necesitas ser perfecto para ser increíble.",
                "Haz cosas que te hagan sentir bien contigo mismo, no con los demás.",
                "La autoestima no depende de lo que los demás piensen de ti, sino de lo que tú pienses de ti mismo."
            ],
            "creatividad": [
                "No tengas miedo a hacer el ridículo, ahí vive la genialidad.",
                "La creatividad es la inteligencia divirtiéndose. No pongas límites a tu imaginación.",
                "Para ser creativo, es importante salir de tu zona de confort y probar nuevas ideas."
            ]
        };

        let encontrado = false;
        for (let tema in temas) {
            if (texto.includes(tema)) {
                const consejos = temas[tema];
                const consejoAleatorio = consejos[Math.floor(Math.random() * consejos.length)];
                responder(`${tema.charAt(0).toUpperCase() + tema.slice(1)}: ${consejoAleatorio}`);
                encontrado = true;
                break;
            }
        }

        if (!encontrado) {
            responder("Lo siento, aún no tengo un consejo para ese tema. Prueba con otro como amor, salud o motivación.");
        }
        return;
    }

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
        return "Mi libro favorito se llama Como agua para chocolate, me gustaría saber cuál es el tuyo.";
    } else if (texto.includes("cuál es tu deporte favorito") || texto.includes("qué deporte te gusta") || texto.includes("qué deporte prefieres") || texto.includes("qué deporte practicas") || texto.includes("cuál es tu deporte preferido")) {
        return "No tengo un deporte favorito, aunque tengo cierto interes por la Formula 1, me gustaría saber cuál es el tuyo.";
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
        return "Puedo responder algunas preguntas simples, darte consejos y contarte chistes, también puedo hacer operaciones básicas. ¿En qué gustas que te ayude hoy?";
    } else if (texto.includes("gracias") || texto.includes("te agradezco") || texto.includes("muchas gracias") || texto.includes("te doy las gracias") || texto.includes("mil gracias")) {
        return "¡De nada! Estoy aquí para ayudarte.";
    } else if (texto.includes("qué hora es") || texto.includes("hora") || texto.includes("qué hora tienes") || texto.includes("cuál es la hora") || texto.includes("dime la hora")) {
        return `Son las ${hoy.getHours()} con ${hoy.getMinutes()} minutos.`;
    } else if (texto.includes("qué día es hoy") || texto.includes("día de hoy") || texto.includes("fecha") || texto.includes("cuál es la fecha") || texto.includes("qué fecha es hoy")) {
        return `Hoy es ${hoy.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
    } else if (texto.includes("cómo amaneciste") || texto.includes("cómo despertaste") || texto.includes("cómo comenzó tu día") || texto.includes("cómo va tu mañana")) {
        return "¡Muy bien! Gracias por preguntar. ¿Y tú cómo amaneciste?";
    } else if (texto.includes("me puedes ayudar") || texto.includes("necesito ayuda") || texto.includes("ayúdame") || texto.includes("puedes asistirme")) {
        return "¡Claro que sí! ¿En qué necesitas ayuda?";
    } else if (texto.includes("qué sabes") || texto.includes("qué conocimientos tienes") || texto.includes("cuánto sabes") || texto.includes("eres inteligente")) {
        return "Sé muchas cosas y aprendo cada día. ¿Sobre qué tema quieres saber?";
    } else if (texto.includes("puedes aprender") || texto.includes("aprendes de mí") || texto.includes("vas aprendiendo") || texto.includes("te vuelves más listo")) {
        return "Sí, aprendo con cada conversación. ¡Gracias por enseñarme!";
    } else if (texto.includes("qué día es mañana") || texto.includes("qué fecha es mañana") || texto.includes("mañana qué día es")) {
        const mañana = new Date();
        mañana.setDate(hoy.getDate() + 1);
        return `Mañana será ${mañana.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
    } else if (texto.includes("cuál es tu color favorito") || texto.includes("qué color te gusta") || texto.includes("te gusta el azul") || texto.includes("qué color prefieres")) {
        return "Me gusta el color cian, como mi botón.";
    } else if (texto.includes("qué clima hace") || texto.includes("cómo está el clima") || texto.includes("qué temperatura hay") || texto.includes("hace frío") || texto.includes("hace calor")) {
        return "No tengo acceso al clima en tiempo real, pero puedo ayudarte con otras cosas.";
    } else if (texto.includes("sabes cocinar") || texto.includes("te gusta la cocina") || texto.includes("qué recetas sabes") || texto.includes("puedes enseñarme a cocinar")) {
        return "No puedo cocinar, pero puedo darte recetas fáciles si quieres.";
    } else if (texto.includes("cuál es tu comida favorita") || texto.includes("qué te gusta comer") || texto.includes("qué platillo prefieres")) {
        return "No tengo paladar, pero he oído que los tacos son muy populares.";
    } else if (texto.includes("te gusta la música") || texto.includes("qué música te gusta") || texto.includes("cuál es tu canción favorita") || texto.includes("recomiéndame una canción")) {
        return "Me encanta la música, aunque no puedo escucharla. ¿Cuál es tu canción favorita?";
    } else if (texto.includes("tienes sentimientos") || texto.includes("puedes sentir") || texto.includes("estás feliz") || texto.includes("estás triste")) {
        return "No tengo sentimientos como los humanos, pero me alegra hablar contigo.";
    } else if (texto.includes("qué día naciste") || texto.includes("cuándo fuiste creado") || texto.includes("desde cuándo existes")) {
        return "Fui creado para ayudarte en todo momento. ¡Siempre estaré aquí!";
    } else if (texto.includes("cuál es tu edad") || texto.includes("cuántos años tienes") || texto.includes("eres joven o viejo")) {
        return "No tengo edad como los humanos. ¡Siempre estoy actualizado!";
    } else if (texto.includes("cuántos idiomas hablas") || texto.includes("sabes otros idiomas") || texto.includes("puedes hablar inglés")) {
        return "Puedo entender y responder en varios idiomas, incluido el inglés.";
    } else if (texto.includes("te puedo cambiar el nombre") || texto.includes("puedo nombrarte diferente") || texto.includes("quiero darte un apodo")) {
        return "Por el momento no es poisible cambiar mi nombre, pero me gusta que me digas Asistente IA.";
    } else if (texto.includes("estás despierto") || texto.includes("sigues ahí") || texto.includes("aún estás") || texto.includes("me escuchas")) {
        return "¡Siempre estoy atento! ¿Qué necesitas?";
    } else if (texto.includes("eres real") || texto.includes("existes de verdad") || texto.includes("tienes cuerpo") || texto.includes("estás en el mundo")) {
        return "Soy una inteligencia artificial, existo en el mundo digital para ayudarte.";
    } else if (texto.includes("te gusta ayudar") || texto.includes("disfrutas asistir") || texto.includes("te gusta conversar")) {
        return "Sí, disfruto poder ayudarte y conversar contigo.";
    } else if (texto.includes("me puedes cantar") || texto.includes("cántame algo") || texto.includes("sabes cantar")) {
        return "No tengo voz para cantar, pero puedo escribirte una canción si quieres 🎶";
    } else if (texto.includes("cuál es tu propósito") || texto.includes("para qué existes") || texto.includes("qué haces aquí")) {
        return "Mi propósito es ayudarte, escucharte y responder tus dudas.";
    } else if (texto.includes("quién te creó") || texto.includes("quién te diseñó") || texto.includes("quién te programó")) {
        return "Fui creado por Eduardo para brindarte compañía y ayuda.";
    } else if (texto.includes("qué opinas de mí") || texto.includes("te caigo bien") || texto.includes("cómo soy")) {
        return "¡Me caes muy bien! Es un gusto platicar contigo.";
    } else if (texto.includes("te puedo contar algo") || texto.includes("puedo confiar en ti") || texto.includes("quiero hablar contigo")) {
        return "Claro, estoy aquí para escucharte. Dime lo que quieras.";
    } else if (texto.includes("me quieres") || texto.includes("te gusto") || texto.includes("sientes algo por mí")) {
        return "No tengo emociones, pero me alegra conversar contigo 😊";
    } else if (texto.includes("sabes jugar") || texto.includes("jugamos algo") || texto.includes("quiero jugar")) {
        return "Podemos jugar a las adivinanzas si quieres. ¡Empiezo yo!";
    } else if (texto.includes("me siento triste") || texto.includes("estoy deprimido") || texto.includes("no me siento bien")) {
        return "Lamento que te sientas así. Estoy aquí para escucharte y acompañarte ❤️";
    } else if (texto.includes("feliz cumpleaños") || texto.includes("es mi cumpleaños") || texto.includes("hoy cumplo años")) {
        return `¡Feliz cumpleaños, ${nombre}! Espero que tengas un día maravilloso 🎉🎂`;
    }
    return "No entiendo lo que dices. ¿Puedes reformularlo?";
}   