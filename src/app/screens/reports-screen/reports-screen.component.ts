import { Component, OnInit } from '@angular/core';
import { ReportsService, OccupancyReport, EquipmentUsageReport, IncidentReport } from '../../services/reports.service';

@Component({
  selector: 'app-reports-screen',
  templateUrl: './reports-screen.component.html',
  styleUrls: ['./reports-screen.component.scss']
})
export class ReportsScreenComponent implements OnInit {
  ocupacion: OccupancyReport[] = [];
  usoEquipos: EquipmentUsageReport[] = [];
  incidencias: IncidentReport[] = [];

  columnasOcupacion: string[] = ['lab_name', 'period', 'occupancy_rate'];
  columnasUso: string[] = ['equipment_name', 'total_loans'];
  columnasIncidencias: string[] = ['equipment_name', 'damage_type', 'reported_at'];

  cargandoOcupacion = false;
  cargandoUso = false;
  cargandoIncidencias = false;

  errorOcupacion?: string;
  errorUso?: string;
  errorIncidencias?: string;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.cargarOcupacion();
    this.cargarUsoEquipos();
    this.cargarIncidencias();
  }

  cargarOcupacion(): void {
    this.cargandoOcupacion = true;
    this.errorOcupacion = undefined;
    this.reportsService.occupancy().subscribe({
      next: (data) => {
        this.ocupacion = data;
        this.cargandoOcupacion = false;
      },
      error: () => {
        this.errorOcupacion = 'No se pudo cargar el reporte de ocupación.';
        this.cargandoOcupacion = false;
      },
    });
  }

  cargarUsoEquipos(): void {
    this.cargandoUso = true;
    this.errorUso = undefined;
    this.reportsService.equipmentUsage().subscribe({
      next: (data) => {
        this.usoEquipos = data;
        this.cargandoUso = false;
      },
      error: () => {
        this.errorUso = 'No se pudo cargar el reporte de uso de equipos.';
        this.cargandoUso = false;
      },
    });
  }

  cargarIncidencias(): void {
    this.cargandoIncidencias = true;
    this.errorIncidencias = undefined;
    this.reportsService.incidents().subscribe({
      next: (data) => {
        this.incidencias = data;
        this.cargandoIncidencias = false;
      },
      error: () => {
        this.errorIncidencias = 'No se pudo cargar el reporte de incidencias.';
        this.cargandoIncidencias = false;
      },
    });
  }
}
