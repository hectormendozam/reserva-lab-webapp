import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-loan-modal',
  templateUrl: './confirm-loan-modal.component.html',
  styleUrls: ['./confirm-loan-modal.component.scss']
})
export class ConfirmLoanModalComponent implements OnInit {
  public nombreEquipo: string = "";
  public cantidad: number = 0;
  public fechaPrestamo: string = "";
  public fechaDevolucion: string = "";

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.nombreEquipo = this.data?.nombreEquipo || 'Equipo';
    this.cantidad = this.data?.cantidad || 0;
    this.fechaPrestamo = this.data?.fechaPrestamo || '';
    this.fechaDevolucion = this.data?.fechaDevolucion || '';
  }

  public cerrar_modal() {
    // Retorna falso si no confirma
  }

  public confirmarPrestamo() {
    // Retorna true si confirma
  }
}
