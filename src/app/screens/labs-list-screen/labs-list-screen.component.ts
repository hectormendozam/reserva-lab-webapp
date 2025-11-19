import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Lab, LabStatus } from '../../shared/models';
import { LabsService } from '../../services/labs.service';

@Component({
  selector: 'app-labs-list-screen',
  templateUrl: './labs-list-screen.component.html',
  styleUrls: ['./labs-list-screen.component.scss']
})
export class LabsListScreenComponent implements OnInit {
  laboratorios: Lab[] = [];
  cargando = false;
  error?: string;
  columnasTabla: string[] = ['id', 'name', 'edificio', 'piso', 'capacidad', 'tipo', 'status'];

  constructor(
    private labsService: LabsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.cargando = true;
    this.error = undefined;
    this.labsService.list().subscribe({
      next: (data) => {
        this.laboratorios = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los laboratorios.';
        this.cargando = false;
      },
    });
  }

  irNuevoLaboratorio(): void {
    this.router.navigate(['/laboratorios/nuevo']);
  }

  traducirEstado(estado: LabStatus): string {
    switch (estado) {
      case 'ACTIVO':
        return 'Activo';
      case 'INACTIVO':
        return 'Inactivo';
      case 'MANTENIMIENTO':
        return 'Mantenimiento';
      default:
        return estado;
    }
  }
}
