import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Prestamo, PrestamoStatus } from '../../shared/models';
import { LoansService } from '../../services/loans.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-loans-list-screen',
  templateUrl: './loans-list-screen.component.html',
  styleUrls: ['./loans-list-screen.component.scss']
})
export class LoansListScreenComponent implements OnInit {
  prestamos: Prestamo[] = [];
  cargando = false;
  error?: string;
  columnasTabla: string[] = [];
  isEstudiante = false;

  constructor(
    private loansService: LoansService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getAuthenticatedUser();
    this.isEstudiante = !!user && user.role === 'ESTUDIANTE';
    this.columnasTabla = ['id', 'usuario', 'equipo', 'cantidad', 'fechaPrestamo', 'fechaVencimiento', 'status'];
    if (!this.isEstudiante) {
      this.columnasTabla.push('acciones');
    }
    this.cargarPrestamos();
  }

  cargarPrestamos(): void {
    this.cargando = true;
    this.error = undefined;
    console.log('Iniciando carga de préstamos...');
    this.loansService.list().subscribe({
      next: (data) => {
        console.log('Préstamos recibidos del backend:', data);
        this.prestamos = data;
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

  irNuevoPrestamo(): void {
    this.router.navigate(['/prestamos/nuevo']);
  }

  aprobar(prestamo: Prestamo): void {
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

  rechazar(prestamo: Prestamo): void {
    this.loansService.reject(prestamo.id).subscribe({
      next: () => this.cargarPrestamos(),
      error: (err) => {
        console.error('Error al rechazar préstamo:', err);
        alert('No se pudo rechazar el préstamo. ' + (err?.error?.detail || err.message || ''));
      }
    });
  }

  devolver(prestamo: Prestamo, danado: boolean = false): void {
    this.loansService.return(prestamo.id, danado).subscribe({
      next: () => this.cargarPrestamos(),
      error: (err) => {
        console.error('Error al devolver préstamo:', err);
        alert('No se pudo marcar como devuelto/dañado. ' + (err?.error?.detail || err.message || ''));
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
      case 'DAÑADO':
        return 'Dañados';
      default:
        return estado;
    }
  }
}
