import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Lab } from '../../shared/models';
import { LabsService } from '../../services/labs.service';

@Component({
  selector: 'app-labs-form-screen',
  templateUrl: './labs-form-screen.component.html',
  styleUrls: ['./labs-form-screen.component.scss']
})
export class LabsFormScreenComponent implements OnInit {
  formulario!: FormGroup;
  guardando = false;
  error?: string;

  constructor(
    private fb: FormBuilder,
    private labsService: LabsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      name: [null, Validators.required],
      building: [null, Validators.required],
      floor: [null, Validators.required],
      capacity: [0, [Validators.required, Validators.min(1)]],
      type: [null, Validators.required],
      status: ['ACTIVE', Validators.required],
    });
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = undefined;

    const valores = this.formulario.value as Partial<Lab>;

    this.labsService.create(valores).subscribe({
      next: () => {
        this.guardando = false;
        this.router.navigate(['/laboratorios']);
      },
      error: () => {
        this.guardando = false;
        this.error = 'No se pudo crear el laboratorio.';
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/laboratorios']);
  }
}
