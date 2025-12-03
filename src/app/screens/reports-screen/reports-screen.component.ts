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

  columnasOcupacion: string[] = ['nombre', 'periodo', 'tasaOcupacion'];
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
    } else if (this.userRole === 'TECNICO') {
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
    console.log('Cargando datos para técnico...');
    // Cargar préstamos con status APROBADO (activos)
    this.loansService.list({ status: 'APROBADO' }).subscribe({
      next: (data) => {
        console.log('Préstamos APROBADO recibidos:', data);
        // Activos: APROBADO y sin fechaEntrega (no devueltos aún)
        this.prestamosActivos = data.filter(l => l.status === 'APROBADO' && !l.fechaEntrega);
        console.log('Préstamos activos filtrados:', this.prestamosActivos);
        
        const ahora = new Date();
        ahora.setHours(0, 0, 0, 0); // Normalizar a inicio del día
        
        // Próximos a vencer: activos con fechaDevolucion en los próximos 7 días
        this.prestamosProximos = this.prestamosActivos.filter(l => {
          if (!l.fechaDevolucion) return false;
          const venc = new Date(l.fechaDevolucion);
          venc.setHours(0, 0, 0, 0);
          const diff = (venc.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24);
          console.log(`Préstamo ${l.id}: vencimiento=${l.fechaDevolucion}, diff=${diff} días`);
          return diff >= 0 && diff <= 7;
        });
        console.log('Préstamos próximos a vencer:', this.prestamosProximos);
      },
      error: (err) => console.error('Error cargando préstamos activos para técnico:', err)
    });

    // Cargar préstamos devueltos
    this.loansService.list({ status: 'DEVUELTO' }).subscribe({
      next: (data) => {
        console.log('Préstamos DEVUELTO recibidos:', data);
        this.prestamosDevueltos = data;
      },
      error: (err) => console.error('Error cargando préstamos devueltos:', err)
    });
  }

  diasRestantes(fechaDevolucion?: string): number {
    if (!fechaDevolucion) return 0;
    const venc = new Date(fechaDevolucion);
    const diffMs = venc.getTime() - Date.now();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  cargarOcupacion(): void {
    this.cargandoOcupacion = true;
    this.errorOcupacion = undefined;
    this.reportsService.occupancy().subscribe({
      next: (data) => {
        this.ocupacion = data;
        // preparar datos para gráfico - backend usa 'nombre' para lab
        this.occupancyChartLabels = data.map(d => d.nombre || '');
        this.occupancyChartData = data.map(d => Math.round(((d.tasaOcupacion || d.tasa_ocupacion || 0) as number) * 100));
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
        // preparar datos para gráfico - backend agrega por equipo__nombre
        this.usageChartLabels = data.map(d => d.equipo__nombre || d.nombre || '');
        this.usageChartData = data.map(d => (d.totalPrestamos || d.total_prestamos || 0) as number);
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
