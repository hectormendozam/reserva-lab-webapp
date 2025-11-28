import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Equipment, EquipmentStatus } from '../../shared/models';
import { EquipmentService } from '../../services/equipment.service';

@Component({
  selector: 'app-equipment-list-screen',
  templateUrl: './equipment-list-screen.component.html',
  styleUrls: ['./equipment-list-screen.component.scss']
})
export class EquipmentListScreenComponent implements OnInit {
  equipos: Equipment[] = [];
  cargando = false;
  error?: string;
  columnasTabla: string[] = ['id', 'name', 'descripcion', 'numeroInventario', 'cantidadTotal', 'cantidadDisponible', 'status'];

  constructor(
    private equipmentService: EquipmentService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarEquipos();
  }

  cargarEquipos(): void {
    this.cargando = true;
    this.error = undefined;
    console.log('Iniciando carga de equipos...');
    this.equipmentService.list().subscribe({
      next: (data) => {
        console.log('Equipos recibidos del backend:', data);
        this.equipos = data;
        this.cargando = false;
        if (data.length === 0) {
          console.warn('La lista de equipos está vacía');
        }
      },
      error: (err) => {
        console.error('Error al cargar equipos:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        if (err.error) {
          console.error('Error body:', err.error);
        }
        this.error = `No se pudieron cargar los equipos. ${err.status ? `(Error ${err.status})` : ''}`;
        this.cargando = false;
      },
    });
  }

  irNuevoEquipo(): void {
    this.router.navigate(['/equipos/nuevo']);
  }

  traducirEstado(estado: EquipmentStatus): string {
    switch (estado) {
      case 'DISPONIBLE':
        return 'Disponible';
      case 'MANTENIMIENTO':
        return 'Mantenimiento';
      default:
        return estado;
    }
  }
}
