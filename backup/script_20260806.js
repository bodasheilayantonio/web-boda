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

const radiosAsistencia = document.querySelectorAll('input[name="asistencia"]');

const datosAsistentes = document.getElementById("datosAsistentes");

const comentariosNo = document.getElementById("comentariosNo");

radiosAsistencia.forEach(radio => {

    radio.addEventListener("change", cambiarFormulario);

});

cambiarFormulario();


function cambiarFormulario(){

    const opcion = document.querySelector(
        'input[name="asistencia"]:checked'
    ).value;

    if(opcion==="si"){

        comentariosNo.classList.remove("visible");

        setTimeout(()=>{

            datosAsistentes.classList.add("visible");

        },300);

    }

    else{

        datosAsistentes.classList.remove("visible");

        setTimeout(()=>{

            comentariosNo.classList.add("visible");

        },300);

    }

}

const selectorAsistentes = document.getElementById("totalAsistentes");
const listaAsistentes = document.getElementById("listaAsistentes");

selectorAsistentes.addEventListener("change", crearInvitados);
function crearInvitados(){

    const tarjetas = listaAsistentes.querySelectorAll(".tarjeta-invitado");

    if(tarjetas.length===0){

        crearTarjetas();
        return;

    }

    // Las ocultamos empezando por la última
    tarjetas.forEach((tarjeta,i)=>{

        setTimeout(()=>{

            tarjeta.classList.remove("visible");
            tarjeta.classList.add("ocultar");

        },(tarjetas.length-1-i)*80);

    });

    // Esperamos a que termine la animación
    setTimeout(()=>{

        crearTarjetas();

    },tarjetas.length*80+300);

}

function crearTarjetas(){

    const total = parseInt(selectorAsistentes.value);

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

    listaAsistentes.innerHTML = html;

    const nuevas = listaAsistentes.querySelectorAll(".tarjeta-invitado");

    nuevas.forEach((tarjeta,i)=>{

        setTimeout(()=>{

            tarjeta.classList.add("visible");

        },i*120);

    });

}