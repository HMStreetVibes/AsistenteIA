// script.js
// Este script maneja la interacción con el asistente de voz utilizando la API de OpenRouter y la síntesis de voz del navegador.
const apiKey = "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";

// Función para hablar con la API de OpenRouter y obtener una respuesta
async function obtenerRespuestaAI(mensajeUsuario) {
    const url = "https://api.openrouter.ai/v1/chat/completions";  // URL de OpenRouter API
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,  // Token de autenticación
    };

    const body = JSON.stringify({
        model: "gpt-3.5-turbo",  // El modelo de OpenRouter
        messages: [
            {
                role: "user",
                content: mensajeUsuario
            }
        ]
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: body
        });

        const data = await response.json();

        console.log("Respuesta de la API: ", data); 
        if (data && data.choices && data.choices[0]) {
            return data.choices[0].message.content;  
        } else {
            return "Lo siento, no pude procesar tu solicitud.";
        }
    } catch (error) {
        console.error("Error al obtener la respuesta de la IA:", error);
        return "Lo siento, hubo un error al procesar tu solicitud.";
    }
}

// Función para hablar con el asistente usando síntesis de voz
function hablarConAsistente(respuesta) {
    console.log("Respondiendo con voz: ", respuesta);  // Verificar el texto que se va a hablar
    const utterance = new SpeechSynthesisUtterance(respuesta);
    utterance.lang = "es-ES";  // Asegúrate de que la respuesta sea en español
    speechSynthesis.speak(utterance);  // Reproducir la respuesta de la IA
}

// Función para manejar la entrada de voz del usuario
document.getElementById("hablar").addEventListener("click", function() {
    // Iniciar el reconocimiento de voz
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "es-ES";
    recognition.start();

    recognition.onresult = async function(event) {
        const resultado = event.results[0][0].transcript;
        document.getElementById("textoUsuario").innerText = "Has dicho: " + resultado;

        // Mostrar las burbujas mientras se escucha
        document.getElementById("bubbles").style.display = "block";

        // Llamar a la función que obtiene la respuesta de IA usando OpenRouter
        const respuestaAI = await obtenerRespuestaAI(resultado);

        console.log("Respuesta de la IA: ", respuestaAI);  // Verificar que la respuesta es la esperada

        // Mostrar la respuesta en la pantalla
        document.getElementById("textoUsuario").innerText = "Asistente dice: " + respuestaAI;

        // Reproducir la respuesta con síntesis de voz
        hablarConAsistente(respuestaAI);

        // Detener las burbujas de escucha
        document.getElementById("bubbles").style.display = "none";
    };

    recognition.onend = function() {
        document.getElementById("bubbles").style.display = "none";  // Detener las burbujas de escucha
    };

    recognition.onspeechend = function() {
        document.getElementById("bubbles").style.display = "none";  // Detener las burbujas de escucha
    };
});
