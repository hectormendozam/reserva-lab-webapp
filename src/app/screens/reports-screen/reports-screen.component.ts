import { Component, OnInit } from '@angular/core';
import { ReportsService, OccupancyReport, EquipmentUsageReport, IncidentReport } from '../../services/reports.service';
import { AuthService } from '../../services/auth.service';
import { LoansService } from '../../services/loans.service';
import { ReservationsService } from '../../services/reservations.service';
import { Prestamo } from '../../shared/models';
import { Reservacion } from '../../shared/models';

@Component({
  selector: 'app-reports-screen',
  templateUrl: './reports-screen.component.html',
  styleUrls: ['./reports-screen.component.scss']
})
export class ReportsScreenComponent implements OnInit {
  ocupacion: OccupancyReport[] = [];
  usoEquipos: EquipmentUsageReport[] = [];
  incidencias: IncidentReport[] = [];

  // Role-based data
  userRole: string = '';
  usuarioId: number = 0;

  // Estudiante
  misPrestamos: Prestamo[] = [];
  misReservas: Reservacion[] = [];

  // Técnico
  prestamosActivos: Prestamo[] = [];
  prestamosProximos: Prestamo[] = [];
  prestamosDevueltos: Prestamo[] = [];

  // Charts data
  occupancyChartLabels: string[] = [];
  occupancyChartData: number[] = [];

  usageChartLabels: string[] = [];
  usageChartData: number[] = [];

  columnasOcupacion: string[] = ['nombreLaboratorio', 'periodo', 'tasaOcupacion'];
  columnasUso: string[] = ['nombreEquipo', 'totalPrestamos'];
  columnasIncidencias: string[] = ['nombreEquipo', 'tipoDano', 'fechaReporte'];

  cargandoOcupacion = false;
  cargandoUso = false;
  cargandoIncidencias = false;

  errorOcupacion?: string;
  errorUso?: string;
  errorIncidencias?: string;

  constructor(
    private reportsService: ReportsService,
    private authService: AuthService,
    private loansService: LoansService,
    private reservationsService: ReservationsService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getAuthenticatedUser();
    if (!user) {
      // Si no hay usuario, cargar reportes generales
      this.cargarOcupacion();
      this.cargarUsoEquipos();
      this.cargarIncidencias();
      return;
    }

    this.userRole = user.role || '';
    this.usuarioId = user.id || 0;

    if (this.userRole === 'ADMIN') {
      // admin mantiene panel de reportes
      this.cargarOcupacion();
      this.cargarUsoEquipos();
      this.cargarIncidencias();
    } else if (this.userRole === 'ESTUDIANTE') {
      this.cargarDatosEstudiante();
    } else if (this.userRole === 'TECH') {
      this.cargarDatosTecnico();
    } else {
      // fallback
      this.cargarOcupacion();
      this.cargarUsoEquipos();
      this.cargarIncidencias();
    }
  }

  cargarDatosEstudiante(): void {
    // Cargar préstamos del estudiante
    this.loansService.list({ user: this.usuarioId }).subscribe({
      next: (data) => this.misPrestamos = data,
      error: (err) => console.error('Error cargando préstamos del estudiante:', err)
    });

    // Cargar reservas del estudiante
    this.reservationsService.list({ user: this.usuarioId }).subscribe({
      next: (data) => this.misReservas = data,
      error: (err) => console.error('Error cargando reservas del estudiante:', err)
    });
  }

  cargarDatosTecnico(): void {
    // Cargar préstamos con status APROBADO (activos)
    this.loansService.list({ status: 'APROBADO' }).subscribe({
      next: (data) => {
        this.prestamosActivos = data.filter(l => l.status === 'APROBADO' && !l.fechaDevolucion);
        const ahora = new Date();
        this.prestamosProximos = this.prestamosActivos.filter(l => {
          const venc = new Date(l.fechaVencimiento);
          const diff = (venc.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24);
          return diff >=0 && diff <= 7; // próximos 7 días
        });
      },
      error: (err) => console.error('Error cargando préstamos activos para técnico:', err)
    });

    // Cargar préstamos devueltos
    this.loansService.list({ status: 'DEVUELTO' }).subscribe({
      next: (data) => this.prestamosDevueltos = data,
      error: (err) => console.error('Error cargando préstamos devueltos:', err)
    });
  }

  diasRestantes(fechaVencimiento?: string): number {
    if (!fechaVencimiento) return 0;
    const venc = new Date(fechaVencimiento);
    const diffMs = venc.getTime() - Date.now();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  cargarOcupacion(): void {
    this.cargandoOcupacion = true;
    this.errorOcupacion = undefined;
    this.reportsService.occupancy().subscribe({
      next: (data) => {
        this.ocupacion = data;
        // preparar datos para gráfico
        this.occupancyChartLabels = data.map(d => d.nombreLaboratorio);
        this.occupancyChartData = data.map(d => Math.round((d.tasaOcupacion || 0) * 100));
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
        // preparar datos para gráfico
        this.usageChartLabels = data.map(d => d.nombreEquipo);
        this.usageChartData = data.map(d => d.totalPrestamos || 0);
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
