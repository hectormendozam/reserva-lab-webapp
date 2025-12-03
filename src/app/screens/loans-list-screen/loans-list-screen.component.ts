import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Prestamo, PrestamoStatus } from '../../shared/models';
import { LoansService } from '../../services/loans.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmLoanModalComponent } from 'src/app/modals/confirm-loan-modal/confirm-loan-modal.component';
import { ReturnEquipmentModalComponent } from 'src/app/modals/return-equipment-modal/return-equipment-modal.component';
import { IncidentReportModalComponent } from 'src/app/modals/incident-report-modal/incident-report-modal.component';

@Component({
  selector: 'app-loans-list-screen',
  templateUrl: './loans-list-screen.component.html',
  styleUrls: ['./loans-list-screen.component.scss']
})
export class LoansListScreenComponent implements OnInit {
  prestamos: Prestamo[] = [];
  dataSource = new MatTableDataSource<Prestamo>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cargando = false;
  error?: string;
  columnasTabla: string[] = [];
  filtro: string = '';
  ordenPor: string = 'fecha';
  isEstudiante = false;

  constructor(
    private loansService: LoansService,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const user = this.authService.getAuthenticatedUser();
    this.isEstudiante = !!user && user.role === 'ESTUDIANTE';
    this.columnasTabla = ['id', 'usuario', 'equipo', 'cantidad', 'fechaPrestamo', 'fechaVencimiento', 'status'];
    if (!this.isEstudiante) {
      this.columnasTabla.push('acciones');
    }
    this.cargarPrestamos();
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    }, 100);
  }

  cargarPrestamos(): void {
    this.cargando = true;
    this.error = undefined;
    console.log('Iniciando carga de préstamos...');
    this.loansService.list().subscribe({
      next: (data) => {
        console.log('Préstamos recibidos del backend:', data);
        this.prestamos = data;
        this.actualizarDataSource();
        this.cargando = false;
        if (data.length === 0) {
          console.warn('La lista de préstamos está vacía');
        }
      },
      error: (err) => {
        console.error('Error al cargar préstamos:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        if (err.error) {
          console.error('Error body:', err.error);
        }
        this.error = `No se pudieron cargar los préstamos. ${err.status ? `(Error ${err.status})` : ''}`;
        this.cargando = false;
      },
    });
  }

  actualizarDataSource(): void {
    let datos = [...this.prestamos];
    if (this.filtro.trim()) {
      const busqueda = this.filtro.toLowerCase();
      datos = datos.filter(p =>
        (p.equipo as any)?.nombre?.toLowerCase().includes(busqueda) ||
        p.status?.toLowerCase().includes(busqueda)
      );
    }
    datos.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (this.ordenPor) {
        case 'fecha':
          aVal = new Date(a.fechaPrestamo).getTime();
          bVal = new Date(b.fechaPrestamo).getTime();
          break;
        case 'estado':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = new Date(a.fechaPrestamo).getTime();
          bVal = new Date(b.fechaPrestamo).getTime();
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

  irNuevoPrestamo(): void {
    this.router.navigate(['/prestamos/nuevo']);
  }

  aprobar(prestamo: Prestamo): void {
    const dialogRef = this.dialog.open(ConfirmLoanModalComponent, {
      data: {
        nombreEquipo: (prestamo.equipo as any)?.name || prestamo.equipo,
        cantidad: prestamo.cantidad,
        fechaPrestamo: prestamo.fechaPrestamo,
        fechaDevolucion: prestamo.fechaDevolucion
      },
      width: '450px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loansService.approve(prestamo.id).subscribe({
          next: () => {
            console.log('Préstamo aprobado:', prestamo.id);
            this.cargarPrestamos();
          },
          error: (err) => {
            console.error('Error al aprobar préstamo:', err);
            alert('No se pudo aprobar el préstamo. ' + (err?.error?.detail || err.message || ''));
          }
        });
      }
    });
  }

  rechazar(prestamo: Prestamo): void {
    this.loansService.reject(prestamo.id).subscribe({
      next: () => this.cargarPrestamos(),
      error: (err) => {
        console.error('Error al rechazar préstamo:', err);
        alert('No se pudo rechazar el préstamo. ' + (err?.error?.detail || err.message || ''));
      }
    });
  }

  devolver(prestamo: Prestamo): void {
    const dialogRef = this.dialog.open(ReturnEquipmentModalComponent, {
      width: '450px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        this.loansService.return(prestamo.id, false).subscribe({
          next: () => {
            console.log('Préstamo marcado como devuelto:', prestamo.id);
            this.cargarPrestamos();
          },
          error: (err) => {
            console.error('Error al marcar como devuelto:', err);
            alert('No se pudo marcar como devuelto. ' + (err?.error?.detail || err.message || ''));
          }
        });
      }
    });
  }

  marcarDanado(prestamo: Prestamo): void {
    const dialogRef = this.dialog.open(IncidentReportModalComponent, {
      width: '450px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.loansService.return(prestamo.id, true).subscribe({
          next: () => {
            console.log('Préstamo marcado como dañado:', prestamo.id);
            this.cargarPrestamos();
          },
          error: (err) => {
            console.error('Error al marcar como dañado:', err);
            alert('No se pudo marcar como dañado. ' + (err?.error?.detail || err.message || ''));
          }
        });
      }
    });
  }

  traducirEstado(estado: PrestamoStatus): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'APROBADO':
        return 'Aprobado';
      case 'RECHAZADO':
        return 'Rechazado';
      case 'DEVUELTO':
        return 'Devuelto';
      case 'DANADO':
        return 'Dañado';
      default:
        return estado;
    }
  }
}
