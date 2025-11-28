import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Loan, LoanStatus } from '../../shared/models';
import { LoansService } from '../../services/loans.service';

@Component({
  selector: 'app-loans-list-screen',
  templateUrl: './loans-list-screen.component.html',
  styleUrls: ['./loans-list-screen.component.scss']
})
export class LoansListScreenComponent implements OnInit {
  prestamos: Loan[] = [];
  cargando = false;
  error?: string;
  columnasTabla: string[] = ['id', 'user', 'equipo', 'cantidad', 'fechaPrestamo', 'fechaDevolucion', 'status', 'acciones'];

  constructor(
    private loansService: LoansService,
    private router: Router,
  ) {}

  ngOnInit(): void {
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

  aprobar(prestamo: Loan): void {
    this.loansService.approve(prestamo.id).subscribe(() => this.cargarPrestamos());
  }

  rechazar(prestamo: Loan): void {
    this.loansService.reject(prestamo.id).subscribe(() => this.cargarPrestamos());
  }

  devolver(prestamo: Loan, danado: boolean = false): void {
    this.loansService.return(prestamo.id, danado).subscribe(() => this.cargarPrestamos());
  }

  traducirEstado(estado: LoanStatus): string {
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
        return 'Dañado';
      default:
        return estado;
    }
  }
}
