const KEYS = {
  USUARIOS: "nutrix_usuarios",
  PACIENTES: "nutrix_pacientes",
  CONSULTAS: "nutrix_consultas",
};

function leer(key, valorPorDefecto) {
  try {
    const crudo = localStorage.getItem(key);
    return crudo ? JSON.parse(crudo) : valorPorDefecto;
  } catch (error) {
    console.error("No se pudo leer " + key + " de localStorage:", error);
    return valorPorDefecto;
  }
}

function escribir(key, valor) {
  localStorage.setItem(key, JSON.stringify(valor));
}

export function getUsuarios() {
  return leer(KEYS.USUARIOS, []);
}

export function saveUsuarios(lista) {
  escribir(KEYS.USUARIOS, lista);
}

export function getPacientes() {
  return leer(KEYS.PACIENTES, []);
}

export function savePacientes(lista) {
  escribir(KEYS.PACIENTES, lista);
}

export function getConsultas() {
  return leer(KEYS.CONSULTAS, []);
}

export function saveConsultas(lista) {
  escribir(KEYS.CONSULTAS, lista);
}
