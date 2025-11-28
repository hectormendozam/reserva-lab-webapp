import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Reservation, ReservationStatus } from '../../shared/models';
import { ReservationsService } from '../../services/reservations.service';

@Component({
  selector: 'app-reservations-list-screen',
  templateUrl: './reservations-list-screen.component.html',
  styleUrls: ['./reservations-list-screen.component.scss']
})
export class ReservationsListScreenComponent implements OnInit {
  reservas: Reservation[] = [];
  cargando = false;
  error?: string;
  columnasTabla: string[] = ['id', 'user', 'lab', 'fecha', 'horaInicio', 'horaFin', 'status', 'acciones'];

  constructor(
    private reservationsService: ReservationsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.cargando = true;
    this.error = undefined;
    console.log('Iniciando carga de reservas...');
    this.reservationsService.list().subscribe({
      next: (data) => {
        console.log('Reservas recibidas del backend:', data);
        this.reservas = data;
        this.cargando = false;
        if (data.length === 0) {
          console.warn('La lista de reservas está vacía');
        }
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        if (err.error) {
          console.error('Error body:', err.error);
        }
        this.error = `No se pudieron cargar las reservas. ${err.status ? `(Error ${err.status})` : ''}`;
        this.cargando = false;
      },
    });
  }

  irANuevaReserva(): void {
    this.router.navigate(['/reservas/nueva']);
  }

  aprobar(reserva: Reservation): void {
    this.reservationsService.approve(reserva.id).subscribe(() => this.cargarReservas());
  }

  rechazar(reserva: Reservation): void {
    this.reservationsService.reject(reserva.id).subscribe(() => this.cargarReservas());
  }

  cancelar(reserva: Reservation): void {
    const motivo = prompt('Motivo de cancelación (opcional):') ?? undefined;
    this.reservationsService.cancel(reserva.id, motivo).subscribe(() => this.cargarReservas());
  }

  traducirEstado(estado: ReservationStatus): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'APROBADO':
        return 'Aprobada';
      case 'RECHAZADO':
        return 'Rechazada';
      case 'CANCELADO':
        return 'Cancelada';
      default:
        return estado;
    }
  }
}
