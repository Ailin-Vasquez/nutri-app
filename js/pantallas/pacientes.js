import { protegerPantalla } from "../logica/guard.js";
import { pintarNav } from "./nav.js";
import {
  listarPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from "../logica/pacientesRepo.js";
import { calcularIMC, clasificarIMC } from "../logica/imc.js";

const sesion = protegerPantalla();
if (sesion) {
  pintarNav("pacientes.html");
  iniciar();
}

let editandoId = null;

function iniciar() {
  document.getElementById("form-paciente").addEventListener("submit", alGuardar);
  document.getElementById("btn-cancelar-edicion").addEventListener("click", salirDeEdicion);
  renderLista();
}

function alGuardar(evento) {
  evento.preventDefault();
  const alertBox = document.getElementById("paciente-alert");
  alertBox.innerHTML = "";

  const datos = {
    nombre: document.getElementById("p-nombre").value,
    edad: document.getElementById("p-edad").value,
    alturaCm: document.getElementById("p-altura").value,
    pesoKg: document.getElementById("p-peso").value,
  };

  if (!datos.nombre.trim() || !datos.edad || !datos.alturaCm || !datos.pesoKg) {
    mostrarError(alertBox, "Completa nombre, edad, altura y peso.");
    return;
  }
  if (Number(datos.edad) <= 0 || Number(datos.alturaCm) <= 0 || Number(datos.pesoKg) <= 0) {
    mostrarError(alertBox, "Edad, altura y peso deben ser mayores que cero.");
    return;
  }

  if (editandoId) {
    actualizarPaciente(editandoId, datos);
  } else {
    crearPaciente(datos);
  }

  salirDeEdicion();
  renderLista();
}

function mostrarError(alertBox, mensaje) {
  alertBox.innerHTML = '<div class="alert alert-error">' + mensaje + "</div>";
}

function entrarAEditar(paciente) {
  editandoId = paciente.id;
  document.getElementById("p-nombre").value = paciente.nombre;
  document.getElementById("p-edad").value = paciente.edad;
  document.getElementById("p-altura").value = paciente.alturaCm;
  document.getElementById("p-peso").value = paciente.pesoKg;

  document.getElementById("form-paciente-titulo").textContent = "Editar paciente";
  document.getElementById("btn-guardar-paciente").textContent = "Guardar cambios";
  document.getElementById("btn-cancelar-edicion").hidden = false;
  document.getElementById("p-nombre").focus();
}

function salirDeEdicion() {
  editandoId = null;
  document.getElementById("form-paciente").reset();
  document.getElementById("paciente-alert").innerHTML = "";
  document.getElementById("form-paciente-titulo").textContent = "Nuevo paciente";
  document.getElementById("btn-guardar-paciente").textContent = "Registrar paciente";
  document.getElementById("btn-cancelar-edicion").hidden = true;
}

function alEliminar(paciente) {
  if (editandoId === paciente.id) salirDeEdicion();
  eliminarPaciente(paciente.id);
  renderLista();
}

function renderLista() {
  const contenedor = document.getElementById("patients-grid");
  const pacientes = listarPacientes();

  if (pacientes.length === 0) {
    contenedor.innerHTML = '<p class="empty-state">Aún no hay pacientes registrados.</p>';
    return;
  }

  contenedor.innerHTML = "";
  pacientes
    .slice()
    .sort((a, b) => a.nombre.localeCompare(b.nombre))
    .forEach((paciente) => {
      const imc = calcularIMC(paciente.pesoKg, paciente.alturaCm);
      const banda = clasificarIMC(imc);

      const tarjeta = document.createElement("div");
      tarjeta.className = "patient-card";
      tarjeta.innerHTML = `
        <div class="pname">${escapar(paciente.nombre)}</div>
        <div class="pmeta">${paciente.edad} años · ${paciente.alturaCm} cm · ${paciente.pesoKg} kg</div>
        <div class="pimc">
          <span class="val mono">${imc.toFixed(1)}</span>
          <span class="badge ${banda.key}">${banda.label}</span>
        </div>
        <p class="pinforme">${banda.texto}</p>
        <div class="pactions">
          <button class="btn btn-ghost btn-sm" data-accion="editar">Editar</button>
          <button class="btn btn-danger-ghost btn-sm" data-accion="eliminar">Eliminar</button>
        </div>
      `;

      tarjeta.querySelector('[data-accion="editar"]').addEventListener("click", () => entrarAEditar(paciente));
      tarjeta.querySelector('[data-accion="eliminar"]').addEventListener("click", () => alEliminar(paciente));

      contenedor.appendChild(tarjeta);
    });
}

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}
