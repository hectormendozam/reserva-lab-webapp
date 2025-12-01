import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Lab, Reservacion } from '../../shared/models';
import { LabsService } from '../../services/labs.service';
import { ReservationsService } from '../../services/reservations.service';
import { AuthService } from '../../services/auth.service';
import { futureDateValidator, horasCoherentesValidator } from '../../shared/validators';

@Component({
  selector: 'app-reservations-form-screen',
  templateUrl: './reservations-form-screen.component.html',
  styleUrls: ['./reservations-form-screen.component.scss']
})
export class ReservationsFormScreenComponent implements OnInit {
  formulario!: FormGroup;
  laboratorios: Lab[] = [];
  guardando = false;
  error?: string;
  usuarioId: number = 0;

  constructor(
    private fb: FormBuilder,
    private labsService: LabsService,
    private reservationsService: ReservationsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Obtener usuario autenticado
    this.usuarioId = this.authService.getAuthenticatedUserId();
    if (this.usuarioId === 0) {
      this.error = 'Debes iniciar sesión para crear una reserva.';
      console.warn('Usuario no autenticado');
      // Opcionalmente: this.router.navigate(['/auth/login']);
    }

    this.formulario = this.fb.group(
      {
        lab: [null, Validators.required],
        fecha: [null, [Validators.required, futureDateValidator()]],
        horaInicio: [null, Validators.required],
        horaFin: [null, Validators.required],
        motivo: [null, [Validators.required, Validators.minLength(5)]],
      },
      { validators: horasCoherentesValidator() }
    );

    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.labsService.list({ status: 'ACTIVO' }).subscribe({
      next: (labs) => {
        this.laboratorios = labs;
        // Si no hay laboratorios, usar datos de ejemplo
        if (this.laboratorios.length === 0) {
          this.laboratorios = [
            { id: 1, name: 'Laboratorio de Cómputo 1', edificio: 'Edificio A', piso: '1', capacidad: 30, tipo: 'COMPUTO', status: 'ACTIVO' },
            { id: 2, name: 'Laboratorio de Electrónica', edificio: 'Edificio B', piso: '2', capacidad: 25, tipo: 'ELECTRONICA', status: 'ACTIVO' },
            { id: 3, name: 'Laboratorio de Cómputo 2', edificio: 'Edificio C', piso: '1', capacidad: 35, tipo: 'COMPUTO', status: 'ACTIVO' }
          ];
          console.warn('No hay laboratorios en el backend, usando datos de ejemplo');
        }
        console.log('Laboratorios cargados:', this.laboratorios);
      },
      error: (err) => {
        // En caso de error, también usar datos de ejemplo
        this.laboratorios = [
          { id: 1, name: 'Laboratorio de Cómputo 1', edificio: 'Edificio A', piso: '1', capacidad: 30, tipo: 'COMPUTO', status: 'ACTIVO' },
          { id: 2, name: 'Laboratorio de Electrónica', edificio: 'Edificio B', piso: '2', capacidad: 25, tipo: 'ELECTRONICA', status: 'ACTIVO' },
          { id: 3, name: 'Laboratorio de Cómputo 2', edificio: 'Edificio C', piso: '1', capacidad: 35, tipo: 'COMPUTO', status: 'ACTIVO' }
        ];
        this.error = 'No se pudieron cargar los laboratorios del servidor. Mostrando datos de ejemplo.';
        console.error('Error al cargar laboratorios:', err);
      },
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    // Validar que horaInicio < horaFin
    if (this.formulario.hasError('horasIncoherentes')) {
      this.error = 'La hora de inicio debe ser menor a la hora de fin.';
      return;
    }

    this.guardando = true;
    this.error = undefined;

    const valores = this.formulario.value;
    const nuevaReserva: Partial<Reservacion> = {
      user: this.usuarioId,
      lab: valores.lab,
      fecha: valores.fecha,
      horaInicio: valores.horaInicio,
      horaFin: valores.horaFin,
      motivo: valores.motivo,
    };

    console.log('Enviando reserva:', nuevaReserva);
    this.reservationsService.create(nuevaReserva).subscribe({
      next: () => {
        this.guardando = false;
        console.log('Reserva creada exitosamente');
        this.router.navigate(['/reservas']);
      },
      error: (err) => {
        this.guardando = false;
        this.error = 'No se pudo crear la reserva.';
        console.error('Error al crear reserva:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/reservas']);
  }
}
