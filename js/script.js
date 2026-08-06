const boton = document.getElementById("btnInfo");

boton.addEventListener("click", function(){

    document.getElementById("bienvenida").scrollIntoView({

        behavior:"smooth"

    });

});

const fechaBoda = new Date("October 02, 2027 19:00:00");

function actualizarContador(){

    const ahora = new Date();

    const diferencia = fechaBoda - ahora;

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);

    const minutos = Math.floor((diferencia / (1000 * 60)) % 60);

    const segundos = Math.floor((diferencia / 1000) % 60);

    document.getElementById("dias").textContent = dias;

    document.getElementById("horas").textContent = String(horas).padStart(2, "0");

    document.getElementById("minutos").textContent = String(minutos).padStart(2, "0");

    document.getElementById("segundos").textContent = String(segundos).padStart(2, "0");

}

setInterval(actualizarContador,1000);

actualizarContador();

for (let i = 1; i <= 10; i++) {

    console.log("Invitado " + i);

}

const contenedor = document.getElementById("contenedorFotos");

for (let i = 1; i <= 6; i++) {

    const foto = document.createElement("div");

    foto.className = "foto";

    foto.textContent = "Foto " + i;

    contenedor.appendChild(foto);

}


// =========================================
// FORMULARIO DE ASISTENCIA
// =========================================

const radioSi = document.querySelector('input[value="si"]');
const radioNo = document.querySelector('input[value="no"]');

const tarjetaInvitados = document.getElementById("tarjetaInvitados");
const tarjetaMensaje = document.getElementById("tarjetaMensaje");

const selectorAsistentes = document.getElementById("totalAsistentes");
const listaAsistentes = document.getElementById("listaAsistentes");


// Estado inicial

tarjetaInvitados.classList.add("visible");
tarjetaMensaje.classList.remove("visible");


// ================================
// CAMBIO SI / NO
// ================================

radioSi.addEventListener("change", cambiarFormulario);
radioNo.addEventListener("change", cambiarFormulario);


function cambiarFormulario(){

    if(radioSi.checked){

        tarjetaMensaje.classList.remove("visible");

        setTimeout(()=>{

            tarjetaInvitados.classList.add("visible");

        },180);

    }

    else{

        tarjetaInvitados.classList.remove("visible");

        setTimeout(()=>{

            tarjetaMensaje.classList.add("visible");

        },180);

    }

}


// ================================
// CAMBIO Nº INVITADOS
// ================================

selectorAsistentes.addEventListener("change", crearInvitados);



function crearInvitados(){

    const tarjetas = listaAsistentes.querySelectorAll(".tarjeta-invitado");


    // Primera creación

    if(tarjetas.length===0){

        crearTarjetas();

        return;

    }


    // Desaparecen una a una

    tarjetas.forEach((tarjeta,i)=>{

        setTimeout(()=>{

            tarjeta.classList.remove("visible");
            tarjeta.classList.add("ocultar");

        },(tarjetas.length-1-i)*80);

    });


    setTimeout(()=>{

        crearTarjetas();

    }, tarjetas.length*80+280);

}

// ================================
// CREA LAS TARJETAS
// ================================

function crearTarjetas(){

    const total = parseInt(selectorAsistentes.value);

    // Altura actual antes de modificar nada
    const alturaInicial = listaAsistentes.offsetHeight;

    // Bloqueamos la altura
    listaAsistentes.style.height = alturaInicial + "px";

    // Si ha vuelto a "Selecciona..."
    if(isNaN(total)){

        requestAnimationFrame(()=>{

            listaAsistentes.style.height = "0px";

        });

        setTimeout(()=>{

            listaAsistentes.innerHTML="";
            listaAsistentes.style.height="auto";

        },450);

        return;

    }

    // Creamos el nuevo HTML
    let html="";

    for(let i=1;i<=total;i++){

        html+=`

        <div class="tarjeta-invitado">

            <h3>Invitado ${i}</h3>

            <div class="campo">
                <label>Nombre y apellidos</label>
                <input type="text" name="nombre${i}" required>
            </div>

            <div class="campo">

                <label>Categoría</label>

                <select name="categoria${i}" required>

                    <option value="">Selecciona...</option>
                    <option>Adulto (+18 años)</option>
                    <option>Adolescente (12-17 años)</option>
                    <option>Niño (hasta 11 años)</option>

                </select>

            </div>

            <div class="campo">

                <label>Alergias o intolerancias</label>

                <input
                    type="text"
                    name="alergias${i}"
                    placeholder="Si no tiene, déjalo vacío">

            </div>

        </div>

        `;

    }

    // Creamos un contenedor temporal invisible
    const temporal = document.createElement("div");
    temporal.style.position = "absolute";
    temporal.style.visibility = "hidden";
    temporal.style.width = listaAsistentes.offsetWidth + "px";
    temporal.innerHTML = html;

    document.body.appendChild(temporal);

    const alturaFinal = temporal.scrollHeight;

    document.body.removeChild(temporal);

    // Ahora sí cambiamos el contenido
    listaAsistentes.innerHTML = html;

    // Animamos la altura
    requestAnimationFrame(()=>{

        listaAsistentes.style.height = alturaFinal + "px";

    });

    // Animación de las tarjetas
    const nuevas = listaAsistentes.querySelectorAll(".tarjeta-invitado");

    nuevas.forEach((tarjeta,i)=>{

        setTimeout(()=>{

            tarjeta.classList.add("visible");

        },i*120);

    });

    // Dejamos altura automática al terminar
    setTimeout(()=>{

        listaAsistentes.style.height="auto";

    },500);

}


// ================================
// ENVÍO DEL FORMULARIO
// ================================

document
.getElementById("formularioAsistencia")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const email=document.getElementById("email").value;

    const asiste=document.querySelector('input[name="asistencia"]:checked').value;

    const comentarios=asiste==="si"
        ? document.getElementById("comentariosSi").value
        : document.getElementById("comentarios").value;

    let invitados=[];

    if(asiste==="si"){

        const total=parseInt(selectorAsistentes.value);

        for(let i=1;i<=total;i++){

            invitados.push({

                nombre:document.querySelector(`[name="nombre${i}"]`).value,

                categoria:document.querySelector(`[name="categoria${i}"]`).value,

                alergias:document.querySelector(`[name="alergias${i}"]`).value

            });

        }

    }

    const datos={

        email,
        asiste,
        total: invitados.length,
        comentarios,
        invitados

    };

    const mensaje = document.getElementById("mensajeExito");
    const iconoMensaje = mensaje.querySelector(".check");
    const tituloMensaje = mensaje.querySelector("h2");
    const textosMensaje = mensaje.querySelectorAll("p");
    const botonConfirmar = document.querySelector(".btn-confirmar");

try {

    // Mostrar respuesta inmediata
    iconoMensaje.textContent = "⏳";
    tituloMensaje.textContent = "Enviando confirmación…";
    textosMensaje[0].textContent =
        "Estamos guardando vuestra respuesta.";
    textosMensaje[1].textContent =
        "Solo tardará unos segundos.";

    mensaje.classList.add("visible");

    botonConfirmar.disabled = true;
    botonConfirmar.textContent = "Enviando…";

    const respuesta = await fetch(
        "/.netlify/functions/asistencia",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(datos)
        }
    );

    const texto = await respuesta.text();

    if (!respuesta.ok || texto.trim() !== "OK") {
        throw new Error(texto || "Error al guardar la confirmación");
    }

    // Confirmación correcta
if (datos.asiste === "si") {

    iconoMensaje.textContent = "💛";

    tituloMensaje.textContent = "¡Muchas gracias!";

    textosMensaje[0].textContent =
        "Hemos recibido correctamente vuestra confirmación.";

    textosMensaje[1].textContent =
        "¡Estamos deseando celebrar este día con vosotros!";

} else {

    iconoMensaje.textContent = "🫶";

    tituloMensaje.textContent = "¡Muchas gracias!";

    textosMensaje[0].textContent =
        "Hemos recibido vuestra respuesta.";

    textosMensaje[1].textContent =
        "Lamentamos mucho que no podáis acompañarnos, pero os agradecemos de corazón que nos lo hayáis comunicado.";

}

    setTimeout(() => {

        mensaje.classList.remove("visible");

    }, 4000);

} catch (error) {

    console.error(error);

    iconoMensaje.textContent = "⚠";
    tituloMensaje.textContent = "No se ha podido enviar";

    textosMensaje[0].textContent =
        "Ha ocurrido un problema al guardar vuestra confirmación.";

    textosMensaje[1].textContent =
        "Por favor, inténtalo de nuevo dentro de unos segundos.";

    setTimeout(() => {

        mensaje.classList.remove("visible");

    }, 4000);

} finally {

    botonConfirmar.disabled = false;
    botonConfirmar.textContent = "Confirmar asistencia";

}

});

// =========================================
// MENÚ HAMBURGUESA
// =========================================

const menuToggle = document.getElementById("menuToggle");
const menuNavegacion = document.getElementById("menuNavegacion");

menuToggle.addEventListener("click", function(){

    const abierto =
        menuNavegacion.classList.toggle("menu-abierto");

    menuToggle.classList.toggle("activo", abierto);

    menuToggle.setAttribute(
        "aria-expanded",
        abierto
    );
    
    document.body.style.overflow = abierto ? "hidden" : "";

});


// Cerrar al pulsar un enlace

menuNavegacion
    .querySelectorAll("a")
    .forEach(enlace => {

        enlace.addEventListener("click", cerrarMenu);

    });


// Cerrar al pulsar fuera

document.addEventListener("click", function(event){

    const pulsadoDentro =
        event.target.closest(".navbar");

    if(!pulsadoDentro){

        cerrarMenu();

    }

});


function cerrarMenu(){

    menuNavegacion.classList.remove("menu-abierto");

    menuToggle.classList.remove("activo");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );
    document.body.style.overflow = "";
}