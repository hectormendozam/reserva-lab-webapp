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
    this.loansService.list().subscribe({
      next: (data) => {
        this.prestamos = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los préstamos.';
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
