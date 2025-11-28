import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Lab, LabStatus } from '../../shared/models';
import { LabsService } from '../../services/labs.service';
import { EliminarLabComponent } from 'src/app/modals/eliminar-lab/eliminar-lab.component';

@Component({
  selector: 'app-labs-list-screen',
  templateUrl: './labs-list-screen.component.html',
  styleUrls: ['./labs-list-screen.component.scss']
})
export class LabsListScreenComponent implements OnInit {
  laboratorios: Lab[] = [];
  cargando = false;
  error?: string;
  columnasTabla: string[] = ['id', 'name', 'edificio', 'piso', 'capacidad', 'tipo', 'status'];

  constructor(
    private labsService: LabsService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.cargando = true;
    this.error = undefined;
    console.log('Iniciando carga de laboratorios...');
    this.labsService.list().subscribe({
      next: (data) => {
        console.log('Laboratorios recibidos del backend:', data);
        this.laboratorios = data;
        this.cargando = false;
        if (data.length === 0) {
          console.warn('La lista de laboratorios está vacía');
        }
      },
      error: (err) => {
        console.error('Error al cargar laboratorios:', err);
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        if (err.error) {
          console.error('Error body:', err.error);
        }
        this.error = `No se pudieron cargar los laboratorios. ${err.status ? `(Error ${err.status})` : ''}`;
        this.cargando = false;
      },
    });
  }

  irNuevoLaboratorio(): void {
    this.router.navigate(['/laboratorios/nuevo']);
  }

  traducirEstado(status: LabStatus): string {
    switch (status) {
      case 'ACTIVO':
        return 'Activo';
      case 'INACTIVO':
        return 'Inactivo';
      case 'MANTENIMIENTO':
        return 'Mantenimiento';
      default:
        return status;
    }
  }
  public goEditar(idUser: number){
    this.router.navigate(["registro-usuarios/administrador/"+idUser]);
  }

  public delete(idUser: number){
    const dialogRef = this.dialog.open(EliminarLabComponent,{
      data: {id: idUser, rol: 'administrador'}, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Admin eliminado");
        //Recargar página
        window.location.reload();
      }else{
        alert("Administrador no eliminado ");
        console.log("No se eliminó el admin");
      }
    });
  }
}
