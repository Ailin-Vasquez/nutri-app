import { protegerPantalla } from "../logica/guard.js";
import { pintarNav } from "./nav.js";
import { listarPacientes } from "../logica/pacientesRepo.js";
import { listarConsultas } from "../logica/consultasRepo.js";

const sesion = protegerPantalla();
if (sesion) {
  pintarNav("dashboard.html");

  document.getElementById("saludo-usuario").textContent = sesion.username;

  const pacientes = listarPacientes();
  const consultas = listarConsultas();

  document.getElementById("stat-pacientes").textContent = pacientes.length;
  document.getElementById("stat-consultas").textContent = consultas.length;

  const hoyIso = new Date().toISOString().slice(0, 10);
  const consultasHoy = consultas.filter((c) => c.dia === hoyIso).length;
  document.getElementById("stat-hoy").textContent = consultasHoy;
}
