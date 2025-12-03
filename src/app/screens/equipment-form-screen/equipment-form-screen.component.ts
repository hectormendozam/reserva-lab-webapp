import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Equipment, Lab } from '../../shared/models';
import { EquipmentService } from '../../services/equipment.service';
import { LabsService } from '../../services/labs.service';
import { AuthService } from '../../services/auth.service';

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
  editMode: boolean = false;
  equipmentId?: number;

  constructor(
    private fb: FormBuilder,
    private equipmentService: EquipmentService,
    private labsService: LabsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Verificar que es admin
    const user = this.authService.getAuthenticatedUser();
    if (user?.role !== 'ADMIN') {
      this.router.navigate(['/']);
      return;
    }

    this.formulario = this.fb.group({
      nombre: [null, [Validators.required, Validators.minLength(3)]],
      descripcion: [null, Validators.required],
      numeroInventario: [null, [Validators.required, Validators.minLength(3)]],
      cantidadTotal: [1, [Validators.required, Validators.min(1)]],
      cantidadDisponible: [1, [Validators.required, Validators.min(0)]],
      status: ['DISPONIBLE', Validators.required],
      lab: [null],
    });

    this.cargarLaboratorios();

    const navState: any = history.state || {};
    if (navState && navState.equipment) {
      const eq = navState.equipment as Partial<Equipment>;
      this.editMode = !!eq.id;
      this.equipmentId = eq.id;

      this.formulario.patchValue({
        nombre: (eq as any).nombre,
        descripcion: eq.descripcion,
        numeroInventario: eq.numeroInventario,
        cantidadTotal: eq.cantidadTotal,
        cantidadDisponible: eq.cantidadDisponible,
        status: eq.status,
        lab: (eq.lab && typeof eq.lab === 'object') ? (eq.lab as any).id : eq.lab
      });

      if (navState.readonly) {
        this.formulario.disable();
      }
    }
  }

  cargarLaboratorios(): void {
    this.labsService.list({ status: 'ACTIVO' }).subscribe({
      next: (labs) => {
        this.laboratorios = labs;
        console.log('Laboratorios cargados:', this.laboratorios);
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los laboratorios.';
        console.error('Error al cargar laboratorios:', err);
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

    const valores = this.formulario.value as Partial<Equipment>;

    const request = this.editMode && this.equipmentId
      ? this.equipmentService.update(this.equipmentId, valores)
      : this.equipmentService.create(valores);

    request.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/equipos']);
      },
      error: (err) => {
        this.guardando = false;
        this.error = this.editMode 
          ? 'No se pudo actualizar el equipo.'
          : 'No se pudo crear el equipo.';
        console.error('Error al guardar equipo:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/equipos']);
  }
}
