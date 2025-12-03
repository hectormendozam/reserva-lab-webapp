import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Reservacion, ReservacionStatus } from '../../shared/models';
import { ReservationsService } from '../../services/reservations.service';
import { CancelarReservaModalComponent } from 'src/app/modals/cancelar-reserva-modal/cancelar-reserva-modal.component';
import { ConfirmReservationModalComponent } from 'src/app/modals/confirm-reservation-modal/confirm-reservation-modal.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservations-list-screen',
  templateUrl: './reservations-list-screen.component.html',
  styleUrls: ['./reservations-list-screen.component.scss']
})
export class ReservationsListScreenComponent implements OnInit {
  reservas: Reservacion[] = [];
  dataSource = new MatTableDataSource<Reservacion>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cargando = false;
  error?: string;
  columnasTabla: string[] = [];
  filtro: string = '';
  ordenPor: string = 'fecha';
  isEstudiante = false;

  constructor(
    private reservationsService: ReservationsService,
    private router: Router,
    public dialog: MatDialog
    , private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getAuthenticatedUser();
    this.isEstudiante = !!user && user.role === 'ESTUDIANTE';
    this.columnasTabla = ['id', 'usuario', 'laboratorio', 'fecha', 'horaInicio', 'horaFin', 'status'];
    if (!this.isEstudiante) {
      this.columnasTabla.push('acciones');
    }
    this.cargarReservas();
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 100);
  }

  cargarReservas(): void {
    this.cargando = true;
    this.error = undefined;
    console.log('Iniciando carga de reservas...');
    this.reservationsService.list().subscribe({
      next: (data) => {
        console.log('Reservas recibidas del backend:', data);
        this.reservas = data;
        this.actualizarDataSource();
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

  actualizarDataSource(): void {
    let datos = [...this.reservas];
    if (this.filtro.trim()) {
      const busqueda = this.filtro.toLowerCase();
      datos = datos.filter(r =>
        (r.lab as any)?.name?.toLowerCase().includes(busqueda) ||
        r.status?.toLowerCase().includes(busqueda)
      );
    }
    datos.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (this.ordenPor) {
        case 'fecha':
          aVal = new Date(a.fecha).getTime();
          bVal = new Date(b.fecha).getTime();
          break;
        case 'estado':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = new Date(a.fecha).getTime();
          bVal = new Date(b.fecha).getTime();
      }
      return typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal;
    });
    this.dataSource.data = datos;
  }

  aplicarFiltro(event: any): void {
    this.filtro = event.target.value;
    this.actualizarDataSource();
  }

  cambiarOrden(campo: string): void {
    this.ordenPor = campo;
    this.actualizarDataSource();
  }

  irANuevaReserva(): void {
    this.router.navigate(['/reservas/nueva']);
  }

  aprobar(reserva: Reservacion): void {
    const dialogRef = this.dialog.open(ConfirmReservationModalComponent, {
      data: {
        nombreLaboratorio: (reserva.lab as any)?.nombre || reserva.lab,
        fecha: reserva.fecha,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin
      },
      width: '450px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.reservationsService.approve(reserva.id).subscribe({
          next: () => this.cargarReservas(),
          error: (err) => {
            console.error('Error al aprobar reserva:', err);
            alert('No se pudo aprobar la reserva. ' + (err?.error?.detail || err.message || ''));
          }
        });
      }
    });
  }

  rechazar(reserva: Reservacion): void {
    this.reservationsService.reject(reserva.id).subscribe({
      next: () => this.cargarReservas(),
      error: (err) => {
        console.error('Error al rechazar reserva:', err);
        alert('No se pudo rechazar la reserva. ' + (err?.error?.detail || err.message || ''));
      }
    });
  }

  cancelar(reserva: Reservacion): void {
    const dialogRef = this.dialog.open(CancelarReservaModalComponent, {
      data: { id: reserva.id },
      width: '450px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && (result.isCanceled === true || result === true)) {
        this.cargarReservas();
      }
    });
  }

  traducirEstado(estado: ReservacionStatus): string {
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
