const KEY = "nutrix_session";

export function iniciarSesion(usuario) {
  sessionStorage.setItem(KEY, JSON.stringify({ id: usuario.id, username: usuario.username }));
}

export function cerrarSesion() {
  sessionStorage.removeItem(KEY);
}

export function getSesion() {
  try {
    const crudo = sessionStorage.getItem(KEY);
    return crudo ? JSON.parse(crudo) : null;
  } catch (error) {
    return null;
  }
}

export function haySesionActiva() {
  return getSesion() !== null;
}
