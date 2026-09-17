import { protegerPantalla } from "../logica/guard.js";
import { pintarNav } from "./nav.js";
import { listarPacientes, obtenerPacientePorId } from "../logica/pacientesRepo.js";
import {
  listarConsultas,
  crearConsulta,
  actualizarConsulta,
  eliminarConsulta,
} from "../logica/consultasRepo.js";

const sesion = protegerPantalla();
if (sesion) {
  pintarNav("consultas.html");
  iniciar();
}

let editandoId = null;

function iniciar() {
  poblarSelectPacientes();
  document.getElementById("form-consulta").addEventListener("submit", alGuardar);
  document.getElementById("btn-cancelar-edicion").addEventListener("click", salirDeEdicion);
  renderTabla();
}

function poblarSelectPacientes() {
  const select = document.getElementById("c-paciente");
  const pacientes = listarPacientes();

  if (pacientes.length === 0) {
    select.innerHTML = '<option value="">No hay pacientes registrados</option>';
    select.disabled = true;
    document.getElementById("btn-guardar-consulta").disabled = true;
    document.getElementById("sin-pacientes-aviso").hidden = false;
    return;
  }

  select.disabled = false;
  document.getElementById("btn-guardar-consulta").disabled = false;
  document.getElementById("sin-pacientes-aviso").hidden = true;

  select.innerHTML =
    '<option value="">Selecciona un paciente…</option>' +
    pacientes
      .slice()
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
      .map((p) => `<option value="${p.id}">${escapar(p.nombre)}</option>`)
      .join("");
}

function alGuardar(evento) {
  evento.preventDefault();
  const alertBox = document.getElementById("consulta-alert");
  alertBox.innerHTML = "";

  const datos = {
    pacienteId: document.getElementById("c-paciente").value,
    dia: document.getElementById("c-dia").value,
    hora: document.getElementById("c-hora").value,
    evolucion: document.getElementById("c-evolucion").value,
    planAlimentacion: document.getElementById("c-plan").value,
  };

  if (!datos.pacienteId || !datos.dia || !datos.hora) {
    alertBox.innerHTML = '<div class="alert alert-error">Selecciona paciente, día y hora.</div>';
    return;
  }
  if (!datos.evolucion.trim() || !datos.planAlimentacion.trim()) {
    alertBox.innerHTML = '<div class="alert alert-error">Captura la evolución del paciente y el plan de alimentación.</div>';
    return;
  }

  if (editandoId) {
    actualizarConsulta(editandoId, datos);
  } else {
    crearConsulta(datos);
  }

  salirDeEdicion();
  renderTabla();
}

function entrarAEditar(consulta) {
  editandoId = consulta.id;
  document.getElementById("c-paciente").value = consulta.pacienteId;
  document.getElementById("c-dia").value = consulta.dia;
  document.getElementById("c-hora").value = consulta.hora;
  document.getElementById("c-evolucion").value = consulta.evolucion || "";
  document.getElementById("c-plan").value = consulta.planAlimentacion || "";

  document.getElementById("form-consulta-titulo").textContent = "Editar consulta";
  document.getElementById("btn-guardar-consulta").textContent = "Guardar cambios";
  document.getElementById("btn-cancelar-edicion").hidden = false;

  resaltarFila(consulta.id);
  document.getElementById("c-paciente").focus();
}

function salirDeEdicion() {
  editandoId = null;
  document.getElementById("form-consulta").reset();
  document.getElementById("consulta-alert").innerHTML = "";
  document.getElementById("form-consulta-titulo").textContent = "Nueva consulta";
  document.getElementById("btn-guardar-consulta").textContent = "Registrar consulta";
  document.getElementById("btn-cancelar-edicion").hidden = true;
}

function alEliminar(consulta) {
  if (editandoId === consulta.id) salirDeEdicion();
  eliminarConsulta(consulta.id);
  renderTabla();
}

function resaltarFila(id) {
  document.querySelectorAll("#historial-body tr").forEach((fila) => {
    fila.classList.toggle("editing-row", fila.dataset.id === id);
  });
}

function renderTabla() {
  const tbody = document.getElementById("historial-body");
  const consultas = listarConsultas();

  if (consultas.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Aún no hay consultas registradas.</td></tr>';
    return;
  }

  const ordenadas = consultas.slice().sort((a, b) => (b.dia + "T" + b.hora).localeCompare(a.dia + "T" + a.hora));

  tbody.innerHTML = "";
  ordenadas.forEach((consulta) => {
    const paciente = obtenerPacientePorId(consulta.pacienteId);
    const nombrePaciente = paciente ? paciente.nombre : "(paciente eliminado)";

    const tr = document.createElement("tr");
    tr.dataset.id = consulta.id;
    if (consulta.id === editandoId) tr.classList.add("editing-row");

    tr.innerHTML = `
      <td>${escapar(nombrePaciente)}</td>
      <td class="mono">${formatearDia(consulta.dia)}</td>
      <td class="mono">${consulta.hora}</td>
      <td>${escapar(consulta.evolucion || "—")}</td>
      <td>${escapar(consulta.planAlimentacion || "—")}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" data-accion="editar" title="Editar" aria-label="Editar consulta de ${escapar(nombrePaciente)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="icon-btn danger" data-accion="eliminar" title="Eliminar" aria-label="Eliminar consulta de ${escapar(nombrePaciente)}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </td>
    `;

    tr.querySelector('[data-accion="editar"]').addEventListener("click", () => entrarAEditar(consulta));
    tr.querySelector('[data-accion="eliminar"]').addEventListener("click", () => alEliminar(consulta));

    tbody.appendChild(tr);
  });
}

function formatearDia(iso) {
  const partes = (iso || "").split("-");
  if (partes.length !== 3) return iso || "";
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto == null ? "" : texto;
  return div.innerHTML;
}
