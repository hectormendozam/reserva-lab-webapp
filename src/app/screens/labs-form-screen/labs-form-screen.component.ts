import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Lab } from '../../shared/models';
import { LabsService } from '../../services/labs.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-labs-form-screen',
  templateUrl: './labs-form-screen.component.html',
  styleUrls: ['./labs-form-screen.component.scss']
})
export class LabsFormScreenComponent implements OnInit {
  formulario!: FormGroup;
  guardando = false;
  error?: string;
  editMode: boolean = false;
  labId?: number;

  constructor(
    private fb: FormBuilder,
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
      edificio: [null, Validators.required],
      piso: [null, Validators.required],
      capacidad: [0, [Validators.required, Validators.min(1)]],
      tipo: [null, Validators.required],
      status: ['ACTIVO', Validators.required],
    });

    const navState: any = history.state || {};
    if (navState && navState.lab) {
      const lab = navState.lab as Partial<Lab>;
      this.editMode = !!lab.id;
      this.labId = lab.id;

      this.formulario.patchValue({
        nombre: lab.nombre,
        edificio: lab.edificio,
        piso: lab.piso,
        capacidad: lab.capacidad,
        tipo: lab.tipo,
        status: lab.status
      });

      if (navState.readonly) {
        this.formulario.disable();
      }
    }
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = undefined;

    const valores = this.formulario.value as Partial<Lab>;

    const request = this.editMode && this.labId
      ? this.labsService.update(this.labId, valores)
      : this.labsService.create(valores);

    request.subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/laboratorios']);
      },
      error: (err) => {
        this.guardando = false;
        this.error = this.editMode 
          ? 'No se pudo actualizar el laboratorio.'
          : 'No se pudo crear el laboratorio.';
        console.error('Error al guardar laboratorio:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/laboratorios']);
  }
}
