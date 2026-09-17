# NutriAGVR

Sistema de seguimiento nutricional: login, gestión de pacientes con
informe de IMC, y consultas con historial. Sitio estático (HTML + CSS +
JavaScript con módulos nativos), sin frameworks ni paso de build.

## Estructura del proyecto

```
nutrix-app/
├── index.html          Iniciar sesión
├── registro.html        Crear usuario
├── dashboard.html        Pantalla principal (usuario + resumen)
├── pacientes.html        Alta/edición de pacientes + informe de IMC
├── consultas.html        Registro y edición de consultas (historial)
├── css/
│   └── styles.css        Estilos compartidos por todas las pantallas
└── js/
    ├── logica/            Lógica de negocio — sin DOM, reutilizable
    │   ├── storage.js       Único punto de acceso a localStorage
    │   ├── session.js       Sesión activa en sessionStorage
    │   ├── guard.js         Protege pantallas contra acceso directo por URL
    │   ├── auth.js          Validar login / crear usuario
    │   ├── imc.js           Cálculo y clasificación del IMC
    │   ├── id.js             Generador de IDs
    │   ├── pacientesRepo.js  CRUD de pacientes
    │   └── consultasRepo.js  CRUD de consultas (solo referencia pacienteId)
    └── pantallas/          Un controlador por pantalla — solo DOM,
        ├── nav.js            importan `logica/` y nunca al revés
        ├── login.js
        ├── registro.js
        ├── dashboard.js
        ├── pacientes.js
        └── consultas.js
```

Los módulos se comunican con `import` / `export` nativos de JavaScript
(`<script type="module">` en cada HTML) — no hay scripts sueltos
colgados directamente del `<head>`.

## Cómo se guardan los datos

| Dato | Almacén | Por qué |
|---|---|---|
| Sesión activa (usuario logueado) | `sessionStorage` | Se borra sola al cerrar la pestaña |
| Usuarios (login) | `localStorage` | Debe sobrevivir entre sesiones |
| Pacientes | `localStorage` | Quedan guardados para siempre |
| Consultas | `localStorage` | Quedan guardadas para siempre, solo referencian `pacienteId` (nunca duplican peso/altura/nombre) |

`dashboard.html`, `pacientes.html` y `consultas.html` llaman a
`protegerPantalla()` (`js/logica/guard.js`) antes de pintar nada: si no
hay sesión, redirigen de inmediato a `index.html` — escribir la URL
directamente en la barra no da acceso.

## Probarlo en tu computadora

Los módulos de JavaScript (`type="module"`) no funcionan abriendo el
HTML directo con doble clic (bloqueo de CORS del navegador con
`file://`). Necesitas un servidor local muy simple:

```bash
cd nutrix-app
npx serve .
# o bien:
python3 -m http.server 8080
```

Y abre `http://localhost:8080` (o el puerto que indique la terminal).
Cuenta de prueba: usuario `demo`, contraseña `demo123`.

## Subirlo a GitHub

```bash
cd nutrix-app
git init
git add .
git commit -m "NutriAGVR: login, pacientes con IMC y consultas"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/nutrix.git
git push -u origin main
```

## Desplegarlo (Vercel o Netlify)

Es un sitio estático puro: no hay comando de build ni carpeta de
salida especial.

**Vercel**
1. En el dashboard de Vercel: *Add New → Project* e importa el
   repositorio de GitHub.
2. Framework Preset: `Other`. Build Command: (vacío). Output
   Directory: `.` (la raíz).
3. Deploy.

**Netlify**
1. *Add new site → Import an existing project* y elige el repositorio.
2. Build command: (vacío). Publish directory: `.` (la raíz).
3. Deploy site.

Antes de entregar, abre el enlace público y navega las 5 pantallas
para confirmar que no quede ninguna pantalla en blanco ni enlace roto
(cuidado con mayúsculas/minúsculas en los nombres de archivo: en
Linux/Vercel `Index.html` y `index.html` son rutas distintas).
