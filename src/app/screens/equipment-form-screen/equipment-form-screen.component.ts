import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Equipment, Lab } from '../../shared/models';
import { EquipmentService } from '../../services/equipment.service';
import { LabsService } from '../../services/labs.service';

@Component({
  selector: 'app-equipment-form-screen',
  templateUrl: './equipment-form-screen.component.html',
  styleUrls: ['./equipment-form-screen.component.scss']
})
export class EquipmentFormScreenComponent implements OnInit {
  formulario!: FormGroup;
  laboratorios: Lab[] = [];
  guardando = false;
  error?: string;

  constructor(
    private fb: FormBuilder,
    private equipmentService: EquipmentService,
    private labsService: LabsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      inventory_number: [null, Validators.required],
      total_quantity: [1, [Validators.required, Validators.min(1)]],
      available_quantity: [1, [Validators.required, Validators.min(0)]],
      status: ['AVAILABLE', Validators.required],
      lab: [null],
    });

    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.labsService.list({ status: 'ACTIVE' }).subscribe({
      next: (labs) => (this.laboratorios = labs),
      error: () => (this.error = 'No se pudieron cargar los laboratorios.'),
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = undefined;

    const valores = this.formulario.value as Partial<Equipment>;

    this.equipmentService.create(valores).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/equipos']);
      },
      error: () => {
        this.guardando = false;
        this.error = 'No se pudo crear el equipo.';
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/equipos']);
  }
}
