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
    const botonConfirmar = document.querySelector('#formularioAsistencia button[type="submit"]');

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


// =========================================
// CAMBIO DE PANTALLAS DEL MODAL
// =========================================

// =========================================
// MODAL MODIFICAR ASISTENCIA - ELEMENTOS
// =========================================
const btnModificar = document.getElementById("btnModificar");
const modalModificar = document.getElementById("modalModificar");
const cerrarModalModificar = document.getElementById("cerrarModalModificar");
const pantallaBuscarMod = document.getElementById("pantallaBuscar");
const pantallaResultadoMod = document.getElementById("pantallaResultado");
const pantallaEditarMod = document.getElementById("pantallaEditar");
const btnBuscarConfirmacion = document.getElementById("btnBuscarConfirmacion");
const emailModificar = document.getElementById("emailModificar");
const mensajeBusqueda = document.getElementById("mensajeBusqueda");

const bloqueNombreGenerico = document.getElementById("bloqueNombreGenerico");
const nombreGenerico = document.getElementById("nombreGenerico");

const EMAIL_GENERICO = "boda.sheilayantonio@gmail.com";

const contenidoEdicion = document.getElementById("contenidoEdicion");
const btnEditarConfirmacion = document.getElementById("btnEditarConfirmacion");

let resultadosEdicionActual = [];


// =========================================
// MOSTRAR CAMPO PARA EL CORREO GENÉRICO
// =========================================

emailModificar.addEventListener("input", function () {

    const email = this.value.trim().toLowerCase();

    if (email === EMAIL_GENERICO) {

        bloqueNombreGenerico.style.display = "";

    } else {

        bloqueNombreGenerico.style.display = "none";
        nombreGenerico.value = "";

    }

});


// =========================================
// CAMBIO DE PANTALLAS DEL MODAL
// =========================================

function mostrarPantallaModal(pantalla){

    pantallaBuscarMod.classList.remove("visible");
    pantallaResultadoMod.classList.remove("visible");
    pantallaEditarMod.classList.remove("visible");

    pantalla.classList.add("visible");

}


// =========================================
// ABRIR / CERRAR MODAL
// =========================================

btnModificar.addEventListener("click", function(){

    mostrarPantallaModal(pantallaBuscarMod);
    mensajeBusqueda.textContent = "";

    modalModificar.classList.add("visible");
    document.body.style.overflow = "hidden";

});

cerrarModalModificar.addEventListener("click", cerrarModalAsistencia);

modalModificar.addEventListener("click", function(e){

    if(e.target === modalModificar){
        cerrarModalAsistencia();
    }

});

function cerrarModalAsistencia(){

    modalModificar.classList.remove("visible");
    document.body.style.overflow = "";

}


// =========================================
// BUSCAR CONFIRMACIÓN
// =========================================

btnBuscarConfirmacion.addEventListener("click", async function(){

    mensajeBusqueda.textContent = "";

    const email = emailModificar.value.trim();

    if(
    email.toLowerCase() === EMAIL_GENERICO
    ){

    const nombre =
        nombreGenerico.value.trim();

    if(nombre === ""){

        mensajeBusqueda.textContent =
            "Introduce el nombre y apellidos de la persona que ya no podrá asistir.";

        return;

    }

    cancelarAsistenciaGenerica(
        nombre
    );

    return;

}

    if(email === ""){

        mensajeBusqueda.textContent = "Introduce un correo electrónico.";
        return;

    }

    btnBuscarConfirmacion.disabled = true;
    btnBuscarConfirmacion.textContent = "Buscando...";

    try{

        const respuesta = await fetch(
            "/.netlify/functions/buscar-asistencia",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            }
        );

        const datos = await respuesta.json();

        if(datos.encontrado){

            resultadosEdicionActual = datos.resultados;

            mostrarConfirmacion(datos.resultados);
            mostrarPantallaModal(pantallaResultadoMod);

        }else{

            resultadosEdicionActual = [];
            mensajeBusqueda.textContent =
                "❌ No existe ninguna confirmación con ese correo.";

        }

    }catch(error){

        console.error(error);

        mensajeBusqueda.textContent =
            "Ha ocurrido un error durante la búsqueda.";

    }finally{

        btnBuscarConfirmacion.disabled = false;
        btnBuscarConfirmacion.textContent = "Buscar mi confirmación";

    }

});


// =========================================
// MOSTRAR CONFIRMACIÓN ENCONTRADA
// =========================================

function mostrarConfirmacion(resultados){

    const bloque = document.getElementById("datosConfirmacion");
    const contenido = document.getElementById("contenidoConfirmacion");
    const primeraFila = resultados[0];

    let html = "";

    if(String(primeraFila.asiste).toLowerCase() === "no"){

        html += `
            <div class="invitado-encontrado">
                <strong>Estado actual</strong>
                No asistirás
            </div>
        `;

    }else{

        html += `
            <div class="invitado-encontrado">
                <strong>Asistencia</strong>
                Sí asistirás
            </div>
        `;

        resultados.forEach((invitado, indice) => {

            html += `
                <div class="invitado-encontrado">
                    <strong>Invitado ${indice + 1}: ${escaparHTML(invitado.nombre || "")}</strong>
                    <div>${escaparHTML(invitado.categoria || "")}</div>
                    ${
                        invitado.alergias
                        ? `<div>Alergias: ${escaparHTML(invitado.alergias)}</div>`
                        : ""
                    }
                </div>
            `;

        });

    }

    if(primeraFila.comentarios){

        html += `
            <div class="invitado-encontrado">
                <strong>Mensaje</strong>
                ${escaparHTML(primeraFila.comentarios)}
            </div>
        `;

    }

    contenido.innerHTML = html;
    bloque.classList.add("visible");

}


// =========================================
// EDITAR CONFIRMACIÓN
// =========================================

btnEditarConfirmacion.addEventListener("click", function(){

    if(resultadosEdicionActual.length === 0){
        return;
    }

    crearFormularioEdicion(resultadosEdicionActual);
    mostrarPantallaModal(pantallaEditarMod);

});

function crearFormularioEdicion(resultados){

    const primeraFila = resultados[0];

    const asiste =
        String(primeraFila.asiste)
            .trim()
            .toLowerCase();

    const viene =
        asiste === "sí" || asiste === "si";

    let html = `

        <div class="campo">

            <label>¿Asistirás?</label>

            <div class="radio-group">

                <label>

                    <input
                        type="radio"
                        name="asistenciaEdicion"
                        value="si"
                        ${viene ? "checked" : ""}>

                    Sí, allí estaremos.

                </label>

                <label>

                    <input
                        type="radio"
                        name="asistenciaEdicion"
                        value="no"
                        ${!viene ? "checked" : ""}>

                    No podremos asistir.

                </label>

            </div>

        </div>


        <div
            id="bloqueInvitadosEdicion"
            style="${viene ? "" : "display:none;"}">

            <div class="campo">

                <label>
                    ¿Cuántas personas asistirán?
                </label>

                <select id="totalEdicion">

                    <option value="1" ${resultados.length === 1 ? "selected" : ""}>
                        1 persona
                    </option>

                    <option value="2" ${resultados.length === 2 ? "selected" : ""}>
                        2 personas
                    </option>

                    <option value="3" ${resultados.length === 3 ? "selected" : ""}>
                        3 personas
                    </option>

                    <option value="4" ${resultados.length === 4 ? "selected" : ""}>
                        4 personas
                    </option>

                    <option value="5" ${resultados.length === 5 ? "selected" : ""}>
                        5 personas
                    </option>

                    <option value="6" ${resultados.length === 6 ? "selected" : ""}>
                        6 personas
                    </option>

                </select>

            </div>

            <div id="invitadosEdicion"></div>

        </div>


        <div class="campo">

            <label>
                ¿Quieres dejarnos un mensaje?
            </label>

            <textarea
                id="comentariosEdicion"
                placeholder="Escribe aquí lo que quieras contarnos...">${primeraFila.comentarios || ""}</textarea>

        </div>
    `;

    contenidoEdicion.innerHTML = html;

    if(viene){

        crearInvitadosEdicion(
            resultados.length,
            resultados
        );

    }

    // Sí / No
    const radiosEdicion =
        contenidoEdicion.querySelectorAll(
            'input[name="asistenciaEdicion"]'
        );

    radiosEdicion.forEach(radio => {

        radio.addEventListener("change", function(){

            const bloque =
                document.getElementById(
                    "bloqueInvitadosEdicion"
                );

            if(this.value === "si"){

                bloque.style.display = "";

                const total =
                    parseInt(
                        document.getElementById(
                            "totalEdicion"
                        ).value
                    );

                crearInvitadosEdicion(
                    total,
                    resultados
                );

            }else{

                bloque.style.display = "none";

            }

        });

    });


    // Cambio del número de asistentes
    const selector =
        document.getElementById("totalEdicion");

    selector.addEventListener("change", function(){

        crearInvitadosEdicion(
            parseInt(this.value),
            resultados
        );

    });

}

function crearInvitadosEdicion(
    total,
    resultados = []
){

    const contenedor =
        document.getElementById(
            "invitadosEdicion"
        );

    let html = "";

    for(let i = 0; i < total; i++){

        const invitado =
            resultados[i] || {};

        html += `

            <div class="tarjeta-invitado visible">

                <h3>
                    Invitado ${i + 1}
                </h3>

                <div class="campo">

                    <label>
                        Nombre y apellidos
                    </label>

                    <input
                        type="text"
                        class="editar-nombre"
                        value="${escaparHTML(invitado.nombre || "")}"
                        required>

                </div>


                <div class="campo">

                    <label>
                        Categoría
                    </label>

                    <select class="editar-categoria">

                        <option value="">
                            Selecciona...
                        </option>

                        <option
                            ${invitado.categoria === "Adulto (+18 años)" ? "selected" : ""}>

                            Adulto (+18 años)

                        </option>

                        <option
                            ${invitado.categoria === "Adolescente (12-17 años)" ? "selected" : ""}>

                            Adolescente (12-17 años)

                        </option>

                        <option
                            ${invitado.categoria === "Niño (hasta 11 años)" ? "selected" : ""}>

                            Niño (hasta 11 años)

                        </option>

                    </select>

                </div>


                <div class="campo">

                    <label>
                        Alergias o intolerancias
                    </label>

                    <input
                        type="text"
                        class="editar-alergias"
                        value="${escaparHTML(invitado.alergias || "")}"
                        placeholder="Si no tiene, déjalo vacío">

                </div>

            </div>
        `;

    }

    contenedor.innerHTML = html;

}

function escaparHTML(texto){

    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

// =========================================
// GUARDAR MODIFICACIÓN
// =========================================

const btnGuardarModificacion =
    document.getElementById(
        "btnGuardarModificacion"
    );


btnGuardarModificacion.addEventListener(
    "click",
    async function(){

        if(resultadosEdicionActual.length === 0){
            return;
        }


        const email =
            resultadosEdicionActual[0].email;


        const radioSeleccionado =
            document.querySelector(
                'input[name="asistenciaEdicion"]:checked'
            );


        if(!radioSeleccionado){

            alert("Selecciona si asistirás o no.");

            return;

        }


        const asiste =
            radioSeleccionado.value;


        let invitados = [];


        // =====================================
        // SI ASISTIRÁ
        // =====================================

        if(asiste === "si"){

            const nombres =
                contenidoEdicion.querySelectorAll(
                    ".editar-nombre"
                );

            const categorias =
                contenidoEdicion.querySelectorAll(
                    ".editar-categoria"
                );

            const alergias =
                contenidoEdicion.querySelectorAll(
                    ".editar-alergias"
                );


            for(let i = 0; i < nombres.length; i++){

                const nombre =
                    nombres[i].value.trim();

                const categoria =
                    categorias[i].value;


                if(nombre === ""){

                    alert(
                        "Completa el nombre de todos los invitados."
                    );

                    return;

                }


                if(categoria === ""){

                    alert(
                        "Selecciona la categoría de todos los invitados."
                    );

                    return;

                }


                invitados.push({

                    nombre: nombre,

                    categoria: categoria,

                    alergias:
                        alergias[i].value.trim()

                });

            }

        }


        const comentarios =
            document
                .getElementById(
                    "comentariosEdicion"
                )
                .value;

        

        const datos = {

            
            email: email,

            asiste: asiste,

            total: invitados.length,

            comentarios: comentarios,

            invitados: invitados

        };


        btnGuardarModificacion.disabled = true;

        btnGuardarModificacion.textContent =
            "Guardando cambios...";


        try{

            const respuesta = await fetch(

                "/.netlify/functions/modificar-asistencia",

                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(datos)
                }

            );


            const resultado =
                await respuesta.json();


            if(!resultado.ok){

                if(
                    resultado.motivo ===
                    "email_compartido"
                ){

                    alert(
                        "Esta confirmación utiliza el correo genérico. Para modificarla necesitaremos identificar al invitado de otra forma."
                    );

                }else{

                    alert(
                        "No hemos podido encontrar la confirmación."
                    );

                }

                return;

            }


            contenidoEdicion.innerHTML = `

                <div
                    style="
                        text-align:center;
                        padding:30px 10px;
                    ">

                    <div
                        style="
                            font-size:46px;
                            margin-bottom:15px;
                        ">
                        💛
                    </div>

                    <h3>
                        Cambios guardados
                    </h3>

                    <p>
                        Hemos actualizado vuestra asistencia correctamente.
                    </p>

                </div>

            `;


            btnGuardarModificacion.style.display =
                "none";


            resultadosEdicionActual = [];


            setTimeout(() => {

                cerrarModalAsistencia();

                btnGuardarModificacion.style.display =
                    "";

                btnGuardarModificacion.textContent =
                    "Guardar cambios";

                mostrarPantallaModal(
                    pantallaBuscarMod
                );

                emailModificar.value = "";

                mensajeBusqueda.textContent = "";

            }, 3000);


        }catch(error){

            console.error(error);

            alert(
                "Ha ocurrido un error al guardar los cambios."
            );

        }finally{

            btnGuardarModificacion.disabled =
                false;

        }

    }
);

async function cancelarAsistenciaGenerica(nombre){

    mensajeBusqueda.textContent = "";

    btnBuscarConfirmacion.disabled = true;
    btnBuscarConfirmacion.textContent =
        "Buscando...";

    try{

        const respuesta = await fetch(
            "/.netlify/functions/cancelar-generico",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    nombre: nombre
                })
            }
        );

        const texto =
            await respuesta.text();

        if(!respuesta.ok){

            throw new Error(
                texto ||
                "Error del servidor"
            );

        }

        const resultado =
            JSON.parse(texto);


        if(resultado.ok){

            mensajeBusqueda.textContent =
                "✔ Hemos actualizado correctamente la asistencia de " +
                resultado.nombre +
                ".";

            nombreGenerico.value = "";

        }

        else if(
            resultado.motivo ===
            "no_encontrado"
        ){

            mensajeBusqueda.textContent =
                "❌ No hemos encontrado ninguna persona con ese nombre.";

        }

        else if(
            resultado.motivo ===
            "nombre_duplicado"
        ){

            mensajeBusqueda.textContent =
                "⚠ Hay más de una persona registrada con ese nombre. Contactad con Sheila y Antonio para modificar la asistencia.";

        }

        else{

            mensajeBusqueda.textContent =
                "No hemos podido modificar la asistencia.";

        }

    }catch(error){

        console.error(error);

        mensajeBusqueda.textContent =
            "Ha ocurrido un error al modificar la asistencia.";

    }finally{

        btnBuscarConfirmacion.disabled =
            false;

        btnBuscarConfirmacion.textContent =
            "Cancelar asistencia";

    }

}