import { getPacientes, savePacientes } from "./storage.js";
import { generarId } from "./id.js";

function normalizar(datos) {
  return {
    nombre: String(datos.nombre || "").trim(),
    edad: Number(datos.edad),
    alturaCm: Number(datos.alturaCm),
    pesoKg: Number(datos.pesoKg),
  };
}

export function listarPacientes() {
  return getPacientes();
}

export function obtenerPacientePorId(id) {
  return getPacientes().find((p) => p.id === id) || null;
}

export function crearPaciente(datos) {
  const limpio = normalizar(datos);
  const paciente = {
    id: generarId(),
    ...limpio,
    fechaRegistro: new Date().toISOString(),
  };
  const pacientes = getPacientes();
  pacientes.push(paciente);
  savePacientes(pacientes);
  return paciente;
}

export function actualizarPaciente(id, datos) {
  const limpio = normalizar(datos);
  const pacientes = getPacientes();
  const idx = pacientes.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  pacientes[idx] = { ...pacientes[idx], ...limpio };
  savePacientes(pacientes);
  return pacientes[idx];
}

export function eliminarPaciente(id) {
  const pacientes = getPacientes().filter((p) => p.id !== id);
  savePacientes(pacientes);
}
