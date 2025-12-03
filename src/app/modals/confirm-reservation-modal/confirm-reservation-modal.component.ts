import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-reservation-modal',
  templateUrl: './confirm-reservation-modal.component.html',
  styleUrls: ['./confirm-reservation-modal.component.scss']
})
export class ConfirmReservationModalComponent implements OnInit {
  public rol: string = "";
  public nombreLaboratorio: string = "";
  public fecha: string = "";
  public horaInicio: string = "";
  public horaFin: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmReservationModalComponent>
  ) {}

  ngOnInit(): void {
    this.rol = this.data?.rol || '';
    this.nombreLaboratorio = this.data?.nombreLaboratorio || 'Laboratorio';
    this.fecha = this.data?.fecha || '';
    this.horaInicio = this.data?.horaInicio || '';
    this.horaFin = this.data?.horaFin || '';
  }

  public cerrar_modal() {
    this.dialogRef.close(false);
  }

  public confirmar() {
    this.dialogRef.close(true);
  }
}
