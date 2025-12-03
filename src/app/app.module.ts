import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

//Este import es para los servicios HTTP
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { RegistroUsuariosScreenComponent } from './screens/registro-usuarios-screen/registro-usuarios-screen.component';
import { EditUsuarioScreenComponent } from './screens/edit-usuario-screen/edit-usuario-screen.component';
//Elementos de angular material
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {NavbarComponent} from './partials/navbar/navbar.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
//Para usar el mask
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
//Cambia el idioma a español
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { EliminarUserModalComponent } from './modals/eliminar-user-modal/eliminar-user-modal.component';
import { NgChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
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
import { EliminarLabComponent } from './modals/eliminar-lab-modal/eliminar-lab.component';
import { ProfileScreenComponent } from './screens/profile-screen/profile-screen.component';
import { UsersListScreenComponent } from './screens/users-list-screen/users-list-screen.component';
import { FooterComponent } from './partials/footer/footer.component';
import { EliminarEquipoModalComponent } from './modals/eliminar-equipo-modal/eliminar-equipo-modal.component';
import { CancelarReservaModalComponent } from './modals/cancelar-reserva-modal/cancelar-reserva-modal.component';
import { ConfirmReservationModalComponent } from './modals/confirm-reservation-modal/confirm-reservation-modal.component';
import { ConfirmLoanModalComponent } from './modals/confirm-loan-modal/confirm-loan-modal.component';
import { ReturnEquipmentModalComponent } from './modals/return-equipment-modal/return-equipment-modal.component';
import { IncidentReportModalComponent } from './modals/incident-report-modal/incident-report-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginScreenComponent,
    RegistroUsuariosScreenComponent,
    EditUsuarioScreenComponent,
    NavbarComponent,
    EliminarUserModalComponent,
    ReservationsListScreenComponent,
    ReservationsFormScreenComponent,
    LoansListScreenComponent,
    LoansFormScreenComponent,
    LabsListScreenComponent,
    LabsFormScreenComponent,
    EquipmentListScreenComponent,
    EquipmentFormScreenComponent,
    ReportsScreenComponent,
    LandingScreenComponent,
    EliminarLabComponent,
    ProfileScreenComponent,
    UsersListScreenComponent,
    FooterComponent,
    EliminarEquipoModalComponent,
    CancelarReservaModalComponent,
    ConfirmReservationModalComponent,
    ConfirmLoanModalComponent,
    ReturnEquipmentModalComponent,
    IncidentReportModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    FormsModule,
    MatRadioModule,
    MatInputModule,
    HttpClientModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskDirective,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NgChartsModule,
    ReactiveFormsModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    provideNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
