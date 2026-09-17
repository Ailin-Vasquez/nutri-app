import { getUsuarios, saveUsuarios } from "./storage.js";
import { generarId } from "./id.js";

export function sembrarUsuarioDemo() {
  const usuarios = getUsuarios();
  if (usuarios.length === 0) {
    saveUsuarios([{ id: generarId(), username: "demo", password: "demo123" }]);
  }
}

export function validarCredenciales(username, password) {
  const usuarios = getUsuarios();
  const usuario = usuarios.find((u) => u.username === username);
  if (!usuario || usuario.password !== password) {
    return { ok: false, error: "Usuario o contraseña incorrectos." };
  }
  return { ok: true, usuario: usuario };
}

export function crearUsuario(username, password, password2) {
  username = (username || "").trim();

  if (!username || !password || !password2) {
    return { ok: false, error: "Completa todos los campos." };
  }
  if (password.length < 4) {
    return { ok: false, error: "La contraseña debe tener al menos 4 caracteres." };
  }
  if (password !== password2) {
    return { ok: false, error: "Las contraseñas no coinciden." };
  }

  const usuarios = getUsuarios();
  if (usuarios.some((u) => u.username === username)) {
    return { ok: false, error: "Ese usuario ya existe." };
  }

  const nuevo = { id: generarId(), username: username, password: password };
  usuarios.push(nuevo);
  saveUsuarios(usuarios);
  return { ok: true, usuario: nuevo };
}
