  import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { EditUsuarioScreenComponent } from './screens/edit-usuario-screen/edit-usuario-screen.component';
import { ReservationsListScreenComponent } from './screens/reservations-list-screen/reservations-list-screen.component';
import { ReservationsFormScreenComponent } from './screens/reservations-form-screen/reservations-form-screen.component';
import { LoansListScreenComponent } from './screens/loans-list-screen/loans-list-screen.component';
import { LoansFormScreenComponent } from './screens/loans-form-screen/loans-form-screen.component';
import { LabsListScreenComponent } from './screens/labs-list-screen/labs-list-screen.component';
import { LabsFormScreenComponent } from './screens/labs-form-screen/labs-form-screen.component';
import { EquipmentListScreenComponent } from './screens/equipment-list-screen/equipment-list-screen.component';
import { EquipmentFormScreenComponent } from './screens/equipment-form-screen/equipment-form-screen.component';
import { ReportsScreenComponent } from './screens/reports-screen/reports-screen.component';
import { LandingScreenComponent } from './screens/landing-screen/landing-screen.component';
import { ProfileScreenComponent } from './screens/profile-screen/profile-screen.component';
import { UsersListScreenComponent } from './screens/users-list-screen/users-list-screen.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  // Públicas - Landing como página principal
  { path: '', component: LandingScreenComponent, pathMatch: 'full' },
  { path: 'login-screen', component: LoginScreenComponent, pathMatch: 'full' },
  { path: 'registro-usuarios', component: RegistroUsuariosScreenComponent, pathMatch: 'full' },
  { path: 'registro-usuarios/:rol/:id', component: RegistroUsuariosScreenComponent, pathMatch: 'full' },

  // Alias alineados con la propuesta (/auth/login, /auth/register)
  { path: 'auth/login', component: LoginScreenComponent, pathMatch: 'full' },
  { path: 'auth/register', component: RegistroUsuariosScreenComponent, pathMatch: 'full' },

  // Editar usuario (ADMIN only)
  { path: 'editar-usuario/:id', component: EditUsuarioScreenComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] }, pathMatch: 'full' },

  // Inicio / Home (por rol - estudiante y técnico) -> usar ReportsScreenComponent para rendering role-based
  { path: 'inicio/estudiante', component: ReportsScreenComponent, pathMatch: 'full' },
  { path: 'inicio/tecnico', component: ReportsScreenComponent, pathMatch: 'full' },

  // Reservas
  { path: 'reservas', component: ReservationsListScreenComponent, pathMatch: 'full' },
  { path: 'reservas/nueva', component: ReservationsFormScreenComponent, pathMatch: 'full' },

  // Préstamos
  { path: 'prestamos', component: LoansListScreenComponent, pathMatch: 'full' },
  { path: 'prestamos/nuevo', component: LoansFormScreenComponent, pathMatch: 'full' },

  // Laboratorios - Solo ADMIN
  { path: 'laboratorios', component: LabsListScreenComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] }, pathMatch: 'full' },
  { path: 'laboratorios/nuevo', component: LabsFormScreenComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] }, pathMatch: 'full' },

  // Equipos - Solo ADMIN
  { path: 'equipos', component: EquipmentListScreenComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] }, pathMatch: 'full' },
  { path: 'equipos/nuevo', component: EquipmentFormScreenComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] }, pathMatch: 'full' },

  // Reportes (vista consolidada)
  { path: 'reports', component: ReportsScreenComponent, pathMatch: 'full' },

  // Usuarios (ADMIN only)
  { path: 'usuarios', component: UsersListScreenComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] }, pathMatch: 'full' },

  // Perfil
  { path: 'perfil', component: ProfileScreenComponent, pathMatch: 'full' },

  // TODO: futuras rutas para labs, equipment, reservations, loans, admin/users
  // { path: 'labs', component: LabsListScreenComponent },
  // { path: 'equipment', component: EquipmentListScreenComponent },
  // { path: 'loans', component: LoansListScreenComponent },
  // { path: 'admin/users', component: AdminUsersScreenComponent },
  // { path: 'profile', component: ProfileScreenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
