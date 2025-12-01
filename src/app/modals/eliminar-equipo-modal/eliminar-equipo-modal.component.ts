import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EquipmentService } from 'src/app/services/equipment.service';

@Component({
  selector: 'app-eliminar-equipo-modal',
  templateUrl: './eliminar-equipo-modal.component.html',
  styleUrls: ['./eliminar-equipo-modal.component.scss']
})
export class EliminarEquipoModalComponent implements OnInit {

  public rol: string = '';
  public entidad: string = 'equipo';

  constructor(
    private equipmentService: EquipmentService,
    private dialogRef: MatDialogRef<EliminarEquipoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void{
    this.rol = this.data?.rol || '';
    this.entidad = this.data?.entityName || 'equipo';
  }

  public cerrar_modal(){
    this.dialogRef.close({isDelete:false});
  }

  public eliminar(){
    const id = this.data?.id;
    if(!id){
      this.dialogRef.close({isDelete:false});
      return;
    }

    this.equipmentService.delete(id).subscribe(
      (response) => {
        console.log('Equipo eliminado', response);
        this.dialogRef.close({isDelete:true});
      }, (error) => {
        console.error('Error eliminando equipo', error);
        this.dialogRef.close({isDelete:false});
      }
    );
  }

}
