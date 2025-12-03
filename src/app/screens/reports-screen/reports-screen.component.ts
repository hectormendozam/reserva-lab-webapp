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

  userRole: string = '';
  usuarioId: number = 0;

  misPrestamos: Prestamo[] = [];
  misReservas: Reservacion[] = [];

  prestamosActivos: Prestamo[] = [];
  prestamosProximos: Prestamo[] = [];
  prestamosDevueltos: Prestamo[] = [];

  occupancyChartLabels: string[] = [];
  occupancyChartData: number[] = [];

  usageChartLabels: string[] = [];
  usageChartData: number[] = [];

  columnasOcupacion: string[] = ['nombreLab', 'fecha', 'horasReservadas', 'estadoReserva'];
  columnasUso: string[] = ['nombreEquipo', 'totalPrestamos'];
  columnasIncidencias: string[] = ['nombreEquipo', 'usuario', 'fechaReporte'];

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
      this.cargarOcupacion();
      this.cargarUsoEquipos();
      this.cargarIncidencias();
      return;
    }

    this.userRole = user.role || '';
    this.usuarioId = user.id || 0;

    if (this.userRole === 'ADMIN') {
      this.cargarOcupacion();
      this.cargarUsoEquipos();
      this.cargarIncidencias();
    } else if (this.userRole === 'ESTUDIANTE') {
      this.cargarDatosEstudiante();
    } else if (this.userRole === 'TECNICO') {
      this.cargarDatosTecnico();
    } else {
      this.cargarOcupacion();
      this.cargarUsoEquipos();
      this.cargarIncidencias();
    }
  }

  cargarDatosEstudiante(): void {
    this.loansService.list({ user: this.usuarioId }).subscribe({
      next: (data) => this.misPrestamos = data,
      error: (err) => console.error('Error cargando préstamos del estudiante:', err)
    });

    this.reservationsService.list({ user: this.usuarioId }).subscribe({
      next: (data) => this.misReservas = data,
      error: (err) => console.error('Error cargando reservas del estudiante:', err)
    });
  }

  cargarDatosTecnico(): void {
    console.log('Cargando datos para técnico...');
    this.loansService.list({ status: 'APROBADO' }).subscribe({
      next: (data) => {
        console.log('Préstamos APROBADO recibidos:', data);
        this.prestamosActivos = data.filter(l => l.status === 'APROBADO' && !l.fechaEntrega);
        console.log('Préstamos activos filtrados:', this.prestamosActivos);
        
        const ahora = new Date();
        ahora.setHours(0, 0, 0, 0);
        
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
      console.log('Datos de ocupación recibidos:', data);
      
      this.ocupacion = data as any;
      
      const labMap = new Map<string, number>();
      
      (data as any[]).forEach(item => {
        const labNombre = item.nombreLab || item.nombre || 'Sin nombre';
        const horas = Number(item.horasReservadas || 0);
        
        labMap.set(labNombre, (labMap.get(labNombre) || 0) + horas);
      });
      
      this.occupancyChartLabels = Array.from(labMap.keys());
      this.occupancyChartData = Array.from(labMap.values());
      
      console.log('Labels del gráfico:', this.occupancyChartLabels);
      console.log('Datos del gráfico:', this.occupancyChartData);
      
      this.cargandoOcupacion = false;
    },
    error: (err) => {
      console.error('Error cargando ocupación:', err);
      this.errorOcupacion = 'No se pudo cargar el reporte de ocupación.';
      this.cargandoOcupacion = false;
      this.ocupacion = [];
      this.occupancyChartLabels = [];
      this.occupancyChartData = [];
    },
  });
}

  cargarUsoEquipos(): void {
    this.cargandoUso = true;
    this.errorUso = undefined;
    this.reportsService.equipmentUsage().subscribe({
      next: (data) => {
        this.usoEquipos = data as any;
        this.usageChartLabels = (data as any[]).map(d => d.equipo_name || d.equipo__nombre || d.nombre || '');
        this.usageChartData = (data as any[]).map(d => Number(d.prestamos_totales || d.totalPrestamos || d.total_prestamos || 0));
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
      this.incidencias = data.map(item => ({
        nombreEquipo: item.nombre,
        usuario: item.loan_id,
        fechaEntrega: item.reported_at
      })) as any;
      
      this.cargandoIncidencias = false;
    },
    error: (err) => {
      console.error('Error cargando incidencias:', err);
      this.errorIncidencias = 'No se pudo cargar el reporte de incidencias.';
      this.cargandoIncidencias = false;
    },
  });
}
}
