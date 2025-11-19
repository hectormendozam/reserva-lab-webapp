import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Lab, Reservation } from '../../shared/models';
import { LabsService } from '../../services/labs.service';
import { ReservationsService } from '../../services/reservations.service';

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

  // TODO: obtener el usuario autenticado desde un servicio de auth
  private readonly usuarioIdDemo = 1;

  constructor(
    private fb: FormBuilder,
    private labsService: LabsService,
    private reservationsService: ReservationsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      lab: [null, Validators.required],
      fecha: [null, Validators.required],
      horaInicio: [null, Validators.required],
      horaFin: [null, Validators.required],
      motivo: [null, [Validators.required, Validators.minLength(5)]],
    });

    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.labsService.list({ status: 'ACTIVE' }).subscribe({
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
      },
      error: () => {
        // En caso de error, también usar datos de ejemplo
        this.laboratorios = [
          { id: 1, name: 'Laboratorio de Cómputo 1', edificio: 'Edificio A', piso: '1', capacidad: 30, tipo: 'COMPUTO', status: 'ACTIVO' },
          { id: 2, name: 'Laboratorio de Electrónica', edificio: 'Edificio B', piso: '2', capacidad: 25, tipo: 'ELECTRONICA', status: 'ACTIVO' },
          { id: 3, name: 'Laboratorio de Cómputo 2', edificio: 'Edificio C', piso: '1', capacidad: 35, tipo: 'COMPUTO', status: 'ACTIVO' }
        ];
        this.error = 'No se pudieron cargar los laboratorios del servidor. Mostrando datos de ejemplo.';
        console.warn('Error al cargar laboratorios, usando datos de ejemplo');
      },
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = undefined;

    const valores = this.formulario.value;
    const nuevaReserva: Partial<Reservation> = {
      user: this.usuarioIdDemo,
      lab: valores.lab,
      fecha: valores.fecha,
      horaInicio: valores.horaInicio,
      horaFin: valores.horaFin,
      motivo: valores.motivo,
    };

    this.reservationsService.create(nuevaReserva).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/reservas']);
      },
      error: () => {
        this.guardando = false;
        this.error = 'No se pudo crear la reserva.';
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/reservas']);
  }
}
