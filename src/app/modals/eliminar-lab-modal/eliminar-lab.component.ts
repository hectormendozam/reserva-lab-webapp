import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LabsService } from 'src/app/services/labs.service';

@Component({
  selector: 'app-eliminar-lab',
  templateUrl: './eliminar-lab.component.html',
  styleUrls: ['./eliminar-lab.component.scss']
})
export class EliminarLabComponent implements OnInit{
  public rol: string = "";
  public entidad: string = 'laboratorio';

  constructor(
    private labsService: LabsService,
    private dialogRef: MatDialogRef<EliminarLabComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){}

  ngOnInit(): void{
    this.rol = this.data?.rol || '';
    // permitir que el llamador sobreescriba el nombre de la entidad (por ejemplo 'laboratorio')
    this.entidad = this.data?.entityName || 'laboratorio';
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

    this.labsService.delete(id).subscribe(
      (response) => {
        console.log('Laboratorio eliminado', response);
        this.dialogRef.close({isDelete:true});
      }, (error) => {
        console.error('Error eliminando laboratorio', error);
        this.dialogRef.close({isDelete:false});
      }
    );
  }

}
