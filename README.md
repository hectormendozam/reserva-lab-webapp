## ReservaLab - Webapp

ReservaLab es una aplicación frontend en Angular diseñada para gestionar laboratorios, reservas y préstamos de equipo en una institución educativa. Está pensada para ser usada por tres roles principales: Administrador (ADMIN), Técnico (TECH) y Estudiante (ESTUDIANTE).

Este README describe la funcionalidad, reglas de negocio, arquitectura, pasos para despliegue y la matriz de permisos por rol.

---

**Estado del repositorio:** Implementaciones principales realizadas (vistas, modales, validaciones y rutas) — revisar notas de cambios en `CAMBIOS_IMPLEMENTADOS.md`.

### Tecnologías

- Angular 16 (TypeScript)
- Angular Material (UI components)
- Bootstrap 5 (grid y helpers)
- RxJS
- ng2-charts (ChartJS wrapper)
- HTTP cliente nativo de Angular

---

## Funcionalidades principales

- **Autenticación y sesión:** Token JWT guardado en `localStorage` (`access_token`, `refresh_token`, `user`).
- **Gestión de usuarios:** Creación, edición (con restricciones: rol y email no editables), eliminación.
- **Gestión de laboratorios:** CRUD (ADMIN).
- **Gestión de equipos:** CRUD (ADMIN).
- **Reservas de laboratorios:** Crear, aprobar/rechazar (ADMIN/TECH), cancelar (usuario/ADMIN).
- **Préstamos de equipo:** Creación, aprobación/rechazo, devoluciones (marcar como dañado).
- **Reportes:** Panel para ADMIN; pantalla "Inicio" role-based para TECH (gestión técnica de préstamos) y ESTUDIANTE (historial personal).
- **Modales estandarizados:** Confirmación de acciones (reservas, préstamos, devoluciones, incidentes, eliminaciones).
- **Formularios reactivos:** Validaciones integradas (contraseñas, fechas, cantidades, rangos horarios).

---

## Reglas de negocio

- **Roles permitidos:** `ADMIN`, `TECH`, `ESTUDIANTE`.
- **Autenticación:** Requiere token JWT en header `Authorization: Bearer <token>` (inyectado por `AuthInterceptor`).
- **Estados de transacciones:** `PENDIENTE`, `APROBADO`, `RECHAZADO`, `CANCELADO`, `DEVUELTO`, `DAÑADO`.
- **Control de acceso:**
  - Solo `ADMIN` puede cambiar roles y eliminar recursos críticos.
  - `TECH` gestiona aprobaciones y seguimiento de préstamos.
  - `ESTUDIANTE` crea reservas/préstamos y ve su historial.
- **Restricciones de UI:**
  - Email y rol deshabilitados en pantalla de edición de usuario.
  - Botón "Inicio" navega dinámicamente según rol.
  - Modales de confirmación obligatorios para operaciones críticas.

---

## Matriz de permisos por rol

| Funcionalidad | ADMIN | TECH | ESTUDIANTE |
|---|:---:|:---:|:---:|
| Ver panel de reportes | ✅ | ❌ | ❌ |
| Ver vista técnica de préstamos | ❌ | ✅ | ❌ |
| Ver historial personal (Inicio) | ✅ | ✅ | ✅ |
| Gestionar usuarios (crear/editar) | ✅ | ❌ | ❌ |
| Cambiar rol de usuario | ✅ | ❌ | ❌ |
| Eliminar usuario | ✅ | ❌ | ❌ |
| Crear reserva | ✅ | ✅ | ✅ |
| Aprobar/rechazar reserva | ✅ | ✅ | ❌ |
| Cancelar propia reserva | ✅ | ✅ | ✅ |
| Crear préstamo | ✅ | ✅ | ✅ (según configuración) |
| Aprobar/rechazar préstamo | ✅ | ✅ | ❌ |
| Marcar devolución (normal) | ✅ | ✅ | ❌ |
| Marcar devolución (dañado) | ✅ | ✅ | ❌ |
| Ver préstamos de todos (reportes) | ✅ | ✅ | ❌ |
| Ver perfil propio | ✅ | ✅ | ✅ |
| Editar perfil propio | ✅ | ✅ | ✅ |

---

## Arquitectura frontend

### Estructura de directorios

```
src/
├── app/
│   ├── screens/          # Vistas principales
│   │   ├── login-screen/
│   │   ├── profile-screen/
│   │   ├── reports-screen/       # Panel reportes (Admin) + Inicio role-based
│   │   ├── reservations-*/
│   │   ├── loans-*/
│   │   ├── users-list-screen/
│   │   ├── labs-*/
│   │   ├── equipment-*/
│   │   └── ...
│   ├── services/         # Servicios HTTP y lógica
│   │   ├── auth.service.ts
│   │   ├── loans.service.ts
│   │   ├── reservations.service.ts
│   │   ├── reports.service.ts
│   │   ├── users.service.ts
│   │   └── ...
│   ├── modals/           # Diálogos reutilizables
│   │   ├── confirm-reservation-modal/
│   │   ├── cancel-reservation-modal/
│   │   ├── confirm-loan-modal/
│   │   ├── return-equipment-modal/
│   │   ├── incident-report-modal/
│   │   ├── eliminar-user-modal/
│   │   └── ...
│   ├── partials/         # Componentes compartidos
│   │   ├── navbar/
│   │   └── footer/
│   ├── guards/           # Guards de rutas
│   │   └── role.guard.ts
│   ├── interceptors/     # Interceptores HTTP
│   │   └── auth.interceptor.ts
│   ├── shared/           # Modelos y validadores
│   │   └── models.ts
│   ├── app.module.ts     # Módulo principal
│   └── app-routing.module.ts
├── environments/         # Configuración por ambiente
├── assets/               # Imágenes, fuentes, estilos globales
└── index.html
```

### Flujo de autenticación

1. Usuario ingresa credenciales en `login-screen`.
2. `AuthService.login()` envía POST a `/api/auth/login/` con email y contraseña.
3. Backend devuelve `{ access, refresh, user }`.
4. Frontend almacena tokens y usuario en `localStorage`.
5. `AuthInterceptor` inyecta header `Authorization: Bearer <token>` en cada petición.
6. Si respuesta es 401, limpia sesión y redirige a login.

### Flujo de una operación (ejemplo: Aprobar préstamo)

1. Admin/Tech ve listado de préstamos pendientes en `loans-list-screen`.
2. Hace clic en botón "Aprobar" (icono check).
3. Componente llama `LoansService.approve(id)`.
4. Servicio envía POST a `/api/loans/{id}/approve/`.
5. Suscriptor recibe respuesta y llama `cargarPrestamos()` para refrescar.
6. Tabla se actualiza (estado cambia a `APROBADO`).

---

## Despliegue

### Requisitos previos

- Node.js v18+, npm
- Angular CLI (opcional): `npm i -g @angular/cli`
- Backend corriendo (URL en `environments/environment.ts`: `http://127.0.0.1:8000`)

### Instalación local (desarrollo)

```powershell
# PowerShell en Windows
cd "D:\Otoño 2025\Desarrollo de sitios web\reserva-lab-webapp"
npm install
```

### Correr en desarrollo

```powershell
npm start
# o manualmente:
ng serve --open
```

Accede a `http://localhost:4200` → Deberías ver la landing o la pantalla de login.

### Build de producción

```powershell
ng build --configuration production
```

Genera artifacts en `dist/` listos para desplegar en servidor (nginx, Apache, etc.).

---

## Configuración del backend

El frontend espera estos endpoints en `environment.url_api` (por defecto: `http://127.0.0.1:8000`):

- `POST /api/auth/login/` — Login
- `POST /api/auth/register/` — Registro
- `GET /api/auth/me/` — Datos del usuario en sesión
- `GET /api/loans/` — Listar préstamos
- `POST /api/loans/` — Crear préstamo
- `POST /api/loans/{id}/approve/` — Aprobar
- `POST /api/loans/{id}/return/` — Marcar como devuelto (con parámetro `damaged`)
- `GET /api/reservations/` — Listar reservas
- `POST /api/reservations/{id}/approve/` — Aprobar reserva
- `POST /api/reservations/{id}/cancel/` — Cancelar
- `GET /api/reports/occupancy/` — Ocupación de labs
- `GET /api/reports/equipment-usage/` — Uso de equipos
- `GET /api/reports/incidents/` — Incidentes
- Y otros endpoints CRUD para usuarios, laboratorios, equipos.

Si el backend usa otra URL, edita `environments/environment.ts` y `environments/environment.prod.ts`.

---

## Cambios recientes (sesión actual)

- Reparado modal `cancel-reservation-modal`: implementados métodos `cerrar_modal()` y `cancelarReserva()` con `MatDialogRef.close()`.
- Rutas `/inicio/estudiante` y `/inicio/tecnico` ahora apuntan a `ReportsScreenComponent` (en lugar de `HomeScreenComponent` duplicado).
- `ReportsScreenComponent` mejorado para ser role-aware: carga datos role-específicos y renderiza vistas diferentes según `AuthService.getAuthenticatedUser().role`.
- Añadidos gráficos básicos (ng2-charts) para reportes de ocupación y uso de equipos.
- `profile-screen` corregida: campos deshabilitados por defecto, no se modifica el estado visual al cargar datos de sesión.

---

## Testing manual recomendado

- [ ] Login con diferentes roles (ADMIN, TECH, ESTUDIANTE) y verificar acceso a rutas.
- [ ] Crear una reserva y verificar flujo de aprobación.
- [ ] Crear un préstamo y aprobar → Marcar como devuelto.
- [ ] Verificar que el botón "Inicio" navega al lugar correcto según rol.
- [ ] Editar usuario como ADMIN y confirmar que rol/email no se pueden cambiar.
- [ ] Abrir profile-screen y verificar que no parpadea/cambia de aspecto.
- [ ] Probar con datos reales desde backend (no mock).

---

## Troubleshooting

**Error 401 al aprobar préstamo:**
- Verificar que `access_token` está en `localStorage` y es válido.
- Revisar consola → Network → POST `/api/loans/{id}/approve/` → Response del backend.

**Modales no se cierran:**
- Asegurar que `MatDialogRef` está inyectado en componente del modal.
- Llamar `this.dialogRef.close(resultado)` en métodos.

**Profile no muestra datos:**
- Verificar `AuthService.getAuthenticatedUser()` devuelve `User` no `null`.
- Si es `null`, revisar almacenamiento de `localStorage.user` después de login.

---

## Licencia

Privada / Institucional (BUAP).

---

Para más detalles: revisar `CAMBIOS_IMPLEMENTADOS.md` o código en `src/app/`.
