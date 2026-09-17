import { getSesion } from "./session.js";

export function protegerPantalla() {
  const sesion = getSesion();

  if (!sesion) {
    window.location.replace("index.html");
    return null;
  }

  document.documentElement.classList.remove("auth-checking");
  return sesion;
}
