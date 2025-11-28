import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Equipment, Loan } from '../../shared/models';
import { EquipmentService } from '../../services/equipment.service';
import { LoansService } from '../../services/loans.service';

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

  // TODO: obtener el usuario autenticado desde un servicio de auth
  private readonly usuarioIdDemo = 1;

  constructor(
    private fb: FormBuilder,
    private equipmentService: EquipmentService,
    private loansService: LoansService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      equipo: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      fechaPrestamo: [null, Validators.required],
      fechaDevolucion: [null, Validators.required],
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

    this.guardando = true;
    this.error = undefined;

    const valores = this.formulario.value;
    const nuevoPrestamo: Partial<Loan> = {
      user: this.usuarioIdDemo,
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
