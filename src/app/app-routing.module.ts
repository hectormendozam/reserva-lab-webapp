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
import { RoleGuard } from './shared/guards/role.guard';

const routes: Routes = [
  { path: '', component: LandingScreenComponent, pathMatch: 'full' },
  { path: 'login-screen', component: LoginScreenComponent, pathMatch: 'full' },
  { path: 'registro-usuarios', component: RegistroUsuariosScreenComponent, pathMatch: 'full' },
  { path: 'registro-usuarios/:rol/:id', component: RegistroUsuariosScreenComponent, pathMatch: 'full' },

  { path: 'auth/login', component: LoginScreenComponent, pathMatch: 'full' },
  { path: 'auth/register', component: RegistroUsuariosScreenComponent, pathMatch: 'full' },

  { path: 'perfil', component: ProfileScreenComponent, pathMatch: 'full' },
  { path: 'editar-perfil', component: ProfileScreenComponent, pathMatch: 'full' },

  { path: 'reservas', component: ReservationsListScreenComponent, pathMatch: 'full' },
  { path: 'reservas/nueva', component: ReservationsFormScreenComponent, pathMatch: 'full' },

  { path: 'prestamos', component: LoansListScreenComponent, pathMatch: 'full' },
  { path: 'prestamos/nuevo', component: LoansFormScreenComponent, pathMatch: 'full' },

  { path: 'reports', component: ReportsScreenComponent, pathMatch: 'full' },
  { path: 'inicio/tecnico', component: ReportsScreenComponent, pathMatch: 'full' },
  { path: 'inicio/estudiante', component: ReportsScreenComponent, pathMatch: 'full' },

  { path: 'laboratorios', component: LabsListScreenComponent, pathMatch: 'full' },
  { path: 'laboratorios/nuevo', component: LabsFormScreenComponent, pathMatch: 'full' },
  { path: 'equipos', component: EquipmentListScreenComponent, pathMatch: 'full' },
  { path: 'equipos/nuevo', component: EquipmentFormScreenComponent, pathMatch: 'full' },
  { path: 'usuarios', component: UsersListScreenComponent, pathMatch: 'full' },

  { path: 'editar-usuario/:id', component: EditUsuarioScreenComponent, pathMatch: 'full' },

  { path: 'editar-perfil/:id', component: EditUsuarioScreenComponent, pathMatch: 'full' },

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
