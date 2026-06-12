const API="/reservas";const form=document.getElementById("formReserva");const tabla=document.getElementById("tablaReservas");const mensaje=document.getElementById("mensaje");const buscar=document.getElementById("buscar");let reservas=[];async function cargarReservas(){const respuesta=await fetch(API);reservas=await respuesta.json();mostrarReservas(reservas);crearCalendario()}function mostrarReservas(lista){tabla.innerHTML="";lista.forEach((r)=>{const fila=document.createElement("tr");fila.innerHTML=`<td><strong>${r.cliente}</strong><br><small>${r.telefono}</small></td><td>${formatearFecha(r.fecha)}</td><td>${r.hora_inicio} - ${r.hora_fin}</td><td>${r.personas}</td><td>${r.mesa}</td><td><span class="estado">${r.estado}</span></td><td><button class="eliminar" onclick="eliminarReserva(${r.id})">Eliminar</button></td>`;tabla.appendChild(fila)})}form.addEventListener("submit",async(e)=>{e.preventDefault();const reserva={cliente:document.getElementById("cliente").value,telefono:document.getElementById("telefono").value,fecha:document.getElementById("fecha").value,hora_inicio:document.getElementById("hora_inicio").value,hora_fin:document.getElementById("hora_fin").value,personas:document.getElementById("personas").value,mesa:document.getElementById("mesa").value,estado:document.getElementById("estado").value,comentarios:document.getElementById("comentarios").value};if(reserva.hora_fin<=reserva.hora_inicio){mostrarMensaje("La hora de fin debe ser mayor que la hora de inicio.","error");return}const respuesta=await fetch(API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(reserva)});const data=await respuesta.json();if(!respuesta.ok){mostrarMensaje(data.mensaje,"error");return}mostrarMensaje(data.mensaje,"exito");document.getElementById("confirmacion").classList.remove("oculto");form.reset();await cargarReservas();location.href="#confirmacion"});async function eliminarReserva(id){if(!confirm("¿Deseas eliminar esta reserva?"))return;await fetch(`${API}/${id}`,{method:"DELETE"});await cargarReservas()}buscar.addEventListener("input",()=>{const texto=buscar.value.toLowerCase();const filtradas=reservas.filter(r=>r.cliente.toLowerCase().includes(texto)||r.mesa.toLowerCase().includes(texto)||String(r.fecha).includes(texto));mostrarReservas(filtradas)});function crearCalendario(){const calendario=document.getElementById("calendarioDias");calendario.innerHTML="";for(let i=1;i<=30;i++){const fecha=`2026-06-${String(i).padStart(2,"0")}`;const tiene=reservas.some(r=>String(r.fecha).slice(0,10)===fecha);const dia=document.createElement("div");dia.textContent=i;dia.className=tiene?"dia con-reserva":"dia";dia.onclick=()=>mostrarReservasDia(fecha,dia);calendario.appendChild(dia)}}function mostrarReservasDia(fecha,elemento){document.querySelectorAll(".dia").forEach(d=>d.classList.remove("activo"));elemento.classList.add("activo");document.getElementById("fechaSeleccionada").textContent=`Reservas para ${fecha}`;const contenedor=document.getElementById("reservasDelDia");const delDia=reservas.filter(r=>String(r.fecha).slice(0,10)===fecha);if(delDia.length===0){contenedor.innerHTML="<p>No hay reservas para este día.</p>";return}contenedor.innerHTML=delDia.map(r=>`<div class="item-dia"><strong>${r.cliente}</strong><br>${r.hora_inicio} - ${r.hora_fin} | ${r.mesa} | ${r.personas}</div>`).join("")}function mostrarMensaje(texto,tipo){mensaje.textContent=texto;mensaje.className=`mensaje ${tipo}`}function formatearFecha(fecha){return String(fecha).slice(0,10)}cargarReservas();
function iniciarSesion() {
  const usuario = document.getElementById("usuario").value;
  const clave = document.getElementById("clave").value;
  const mensajeLogin = document.getElementById("mensajeLogin");

  if (usuario === "admin" && clave === "1234") {
    document.getElementById("login").classList.add("oculto");
    document.getElementById("inicio").classList.remove("oculto");
    document.getElementById("formulario").classList.remove("oculto");
    document.getElementById("lista").classList.remove("oculto");
    document.getElementById("calendario").classList.remove("oculto");
    document.getElementById("btnCerrar").classList.remove("oculto");

    cargarReservas();
  } else {
    mensajeLogin.textContent = "Usuario o contraseña incorrectos.";
  }
}

function cerrarSesion() {
  document.getElementById("login").classList.remove("oculto");
  document.getElementById("inicio").classList.add("oculto");
  document.getElementById("formulario").classList.add("oculto");
  document.getElementById("lista").classList.add("oculto");
  document.getElementById("calendario").classList.add("oculto");
  document.getElementById("btnCerrar").classList.add("oculto");

  document.getElementById("usuario").value = "";
  document.getElementById("clave").value = "";
}
