import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-return-equipment-modal',
  templateUrl: './return-equipment-modal.component.html',
  styleUrls: ['./return-equipment-modal.component.scss']
})
export class ReturnEquipmentModalComponent implements OnInit {
  public nombreEquipo: string = "";
  public cantidad: number = 0;
  public danado: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ReturnEquipmentModalComponent>
  ) {}

  ngOnInit(): void {
    this.nombreEquipo = this.data?.nombreEquipo || 'Equipo';
    this.cantidad = this.data?.cantidad || 0;
    this.danado = this.data?.danado || false;
  }

  public cerrar_modal() {
    this.dialogRef.close({ confirmed: false });
  }

  public devolverEquipo() {
    this.dialogRef.close({ confirmed: true, danado: false });
  }

  public marcarDanado() {
    this.danado = !this.danado;
  }
}
