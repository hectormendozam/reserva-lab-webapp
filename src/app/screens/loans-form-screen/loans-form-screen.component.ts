import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Equipment, Prestamo } from '../../shared/models';
import { EquipmentService } from '../../services/equipment.service';
import { LoansService } from '../../services/loans.service';
import { AuthService } from '../../services/auth.service';
import { cantidadDisponibleValidator, fechasCoherentesValidator } from '../../shared/validators';

@Component({
  selector: 'app-loans-form-screen',
  templateUrl: './loans-form-screen.component.html',
  styleUrls: ['./loans-form-screen.component.scss']
})
export class LoansFormScreenComponent implements OnInit {
  formulario!: FormGroup;
  equipos: Equipment[] = [];
  guardando = false;
  error?: string;
  usuarioId: number = 0;

  constructor(
    private fb: FormBuilder,
    private equipmentService: EquipmentService,
    private loansService: LoansService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Obtener usuario autenticado
    this.usuarioId = this.authService.getAuthenticatedUserId();
    if (this.usuarioId === 0) {
      this.error = 'Debes iniciar sesión para crear un préstamo.';
      console.warn('Usuario no autenticado');
      // Opcionalmente: this.router.navigate(['/auth/login']);
    }

    this.formulario = this.fb.group(
      {
        equipo: [null, Validators.required],
        cantidad: [1, [Validators.required, Validators.min(1)]],
        fechaPrestamo: [null, Validators.required],
        fechaDevolucion: [null, Validators.required],
      },
      { validators: fechasCoherentesValidator() }
    );

    // Escuchar cambios en el equipo seleccionado para actualizar validadores de cantidad
    this.formulario.get('equipo')?.valueChanges.subscribe(equipoId => {
      const equipo = this.equipos.find(e => e.id === equipoId);
      if (equipo) {
        const cantidadControl = this.formulario.get('cantidad');
        cantidadControl?.setValidators([
          Validators.required,
          Validators.min(1),
          cantidadDisponibleValidator(equipo.cantidadDisponible)
        ]);
        cantidadControl?.updateValueAndValidity();
      }
    });

    this.cargarEquipos();
  }

  cargarEquipos(): void {
    this.equipmentService.list({ status: 'DISPONIBLE' }).subscribe({
      next: (equipos) => {
        this.equipos = equipos;
        // Si no hay equipos, usar datos de ejemplo
        if (this.equipos.length === 0) {
          this.equipos = [
            { id: 1, name: 'Proyector Epson', descripcion: 'Proyector multimedia', numeroInventario: 'PROJ-001', cantidadTotal: 10, cantidadDisponible: 8, status: 'DISPONIBLE' },
            { id: 2, name: 'Laptop HP', descripcion: 'Laptop para préstamo', numeroInventario: 'LAP-001', cantidadTotal: 15, cantidadDisponible: 12, status: 'DISPONIBLE' },
            { id: 3, name: 'Osciloscopio', descripcion: 'Osciloscopio digital', numeroInventario: 'OSC-001', cantidadTotal: 5, cantidadDisponible: 4, status: 'DISPONIBLE' }
          ];
          console.warn('No hay equipos en el backend, usando datos de ejemplo');
        }
        console.log('Equipos cargados:', this.equipos);
      },
      error: (err) => {
        // En caso de error, también usar datos de ejemplo
        this.equipos = [
          { id: 1, name: 'Proyector Epson', descripcion: 'Proyector multimedia', numeroInventario: 'PROJ-001', cantidadTotal: 10, cantidadDisponible: 8, status: 'DISPONIBLE' },
          { id: 2, name: 'Laptop HP', descripcion: 'Laptop para préstamo', numeroInventario: 'LAP-001', cantidadTotal: 15, cantidadDisponible: 12, status: 'DISPONIBLE' },
          { id: 3, name: 'Osciloscopio', descripcion: 'Osciloscopio digital', numeroInventario: 'OSC-001', cantidadTotal: 5, cantidadDisponible: 4, status: 'DISPONIBLE' }
        ];
        this.error = 'No se pudieron cargar los equipos del servidor. Mostrando datos de ejemplo.';
        console.error('Error al cargar equipos:', err);
      },
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    // Validar que fechaDevolucion >= fechaPrestamo
    if (this.formulario.hasError('fechasIncoherentes')) {
      this.error = 'La fecha de devolución debe ser igual o posterior a la fecha de préstamo.';
      return;
    }

    // Validar cantidad disponible
    const equipoId = this.formulario.get('equipo')?.value;
    const cantidad = this.formulario.get('cantidad')?.value;
    const equipo = this.equipos.find(e => e.id === equipoId);
    
    if (equipo && cantidad > equipo.cantidadDisponible) {
      this.error = `Solo hay ${equipo.cantidadDisponible} unidades disponibles.`;
      return;
    }

    this.guardando = true;
    this.error = undefined;

    const valores = this.formulario.value;
    const nuevoPrestamo: Partial<Prestamo> = {
      user: this.usuarioId,
      equipo: valores.equipo,
      cantidad: valores.cantidad,
      fechaPrestamo: valores.fechaPrestamo,
      fechaDevolucion: valores.fechaDevolucion,
    };

    console.log('Enviando préstamo:', nuevoPrestamo);
    this.loansService.create(nuevoPrestamo).subscribe({
      next: () => {
        this.guardando = false;
        console.log('Préstamo creado exitosamente');
        this.router.navigate(['/prestamos']);
      },
      error: (err) => {
        this.guardando = false;
        this.error = 'No se pudo crear el préstamo.';
        console.error('Error al crear préstamo:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/prestamos']);
  }
}
