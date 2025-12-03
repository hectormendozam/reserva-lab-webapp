import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-incident-report-modal',
  templateUrl: './incident-report-modal.component.html',
  styleUrls: ['./incident-report-modal.component.scss']
})
export class IncidentReportModalComponent implements OnInit {
  public nombreEquipo: string = "";
  public tipoDano: string = "";
  public descripcion: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<IncidentReportModalComponent>
  ) {}

  ngOnInit(): void {
    this.nombreEquipo = this.data?.nombreEquipo || 'Equipo';
    this.tipoDano = this.data?.tipoDano || 'Desconocido';
    this.descripcion = this.data?.descripcion || '';
  }

  public cerrar_modal() {
    this.dialogRef.close(false);
  }

  public reportarIncidente() {
    this.dialogRef.close(true);
  }
}
