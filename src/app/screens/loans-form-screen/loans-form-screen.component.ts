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
      equipment: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      loan_date: [null, Validators.required],
      due_date: [null, Validators.required],
    });

    this.cargarEquipos();
  }

  cargarEquipos(): void {
    this.equipmentService.list({ status: 'AVAILABLE' }).subscribe({
      next: (equipos) => {
        this.equipos = equipos;
        // Si no hay equipos, usar datos de ejemplo
        if (this.equipos.length === 0) {
          this.equipos = [
            { id: 1, name: 'Proyector Epson', description: 'Proyector multimedia', inventory_number: 'PROJ-001', total_quantity: 10, available_quantity: 8, status: 'AVAILABLE' },
            { id: 2, name: 'Laptop HP', description: 'Laptop para préstamo', inventory_number: 'LAP-001', total_quantity: 15, available_quantity: 12, status: 'AVAILABLE' },
            { id: 3, name: 'Osciloscopio', description: 'Osciloscopio digital', inventory_number: 'OSC-001', total_quantity: 5, available_quantity: 4, status: 'AVAILABLE' }
          ];
          console.warn('No hay equipos en el backend, usando datos de ejemplo');
        }
      },
      error: () => {
        // En caso de error, también usar datos de ejemplo
        this.equipos = [
          { id: 1, name: 'Proyector Epson', description: 'Proyector multimedia', inventory_number: 'PROJ-001', total_quantity: 10, available_quantity: 8, status: 'AVAILABLE' },
          { id: 2, name: 'Laptop HP', description: 'Laptop para préstamo', inventory_number: 'LAP-001', total_quantity: 15, available_quantity: 12, status: 'AVAILABLE' },
          { id: 3, name: 'Osciloscopio', description: 'Osciloscopio digital', inventory_number: 'OSC-001', total_quantity: 5, available_quantity: 4, status: 'AVAILABLE' }
        ];
        this.error = 'No se pudieron cargar los equipos del servidor. Mostrando datos de ejemplo.';
        console.warn('Error al cargar equipos, usando datos de ejemplo');
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
      equipment: valores.equipment,
      quantity: valores.quantity,
      loan_date: valores.loan_date,
      due_date: valores.due_date,
    };

    this.loansService.create(nuevoPrestamo).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/prestamos']);
      },
      error: () => {
        this.guardando = false;
        this.error = 'No se pudo crear el préstamo.';
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/prestamos']);
  }
}
