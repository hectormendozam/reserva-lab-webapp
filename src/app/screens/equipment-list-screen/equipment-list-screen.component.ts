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
  columnasTabla: string[] = ['id', 'name', 'description', 'inventory_number', 'total_quantity', 'available_quantity', 'status'];

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
    this.equipmentService.list().subscribe({
      next: (data) => {
        this.equipos = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los equipos.';
        this.cargando = false;
      },
    });
  }

  irNuevoEquipo(): void {
    this.router.navigate(['/equipos/nuevo']);
  }

  traducirEstado(estado: EquipmentStatus): string {
    switch (estado) {
      case 'AVAILABLE':
        return 'Disponible';
      case 'MAINTENANCE':
        return 'Mantenimiento';
      default:
        return estado;
    }
  }
}
