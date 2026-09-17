import { getConsultas, saveConsultas } from "./storage.js";
import { generarId } from "./id.js";

export function listarConsultas() {
  return getConsultas();
}

export function crearConsulta(datos) {
  const consulta = {
    id: generarId(),
    pacienteId: datos.pacienteId,
    dia: datos.dia,
    hora: datos.hora,
    evolucion: (datos.evolucion || "").trim(),
    planAlimentacion: (datos.planAlimentacion || "").trim(),
    fechaCreacion: new Date().toISOString(),
  };
  const consultas = getConsultas();
  consultas.push(consulta);
  saveConsultas(consultas);
  return consulta;
}

export function actualizarConsulta(id, datos) {
  const consultas = getConsultas();
  const idx = consultas.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  consultas[idx] = {
    ...consultas[idx],
    pacienteId: datos.pacienteId,
    dia: datos.dia,
    hora: datos.hora,
    evolucion: (datos.evolucion || "").trim(),
    planAlimentacion: (datos.planAlimentacion || "").trim(),
  };
  saveConsultas(consultas);
  return consultas[idx];
}

export function eliminarConsulta(id) {
  const consultas = getConsultas().filter((c) => c.id !== id);
  saveConsultas(consultas);
}
