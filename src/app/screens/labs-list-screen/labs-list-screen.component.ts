import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Lab, LabStatus } from '../../shared/models';
import { LabsService } from '../../services/labs.service';
import { AuthService } from '../../services/auth.service';
import { EliminarLabComponent } from 'src/app/modals/eliminar-lab-modal/eliminar-lab.component';

@Component({
  selector: 'app-labs-list-screen',
  templateUrl: './labs-list-screen.component.html',
  styleUrls: ['./labs-list-screen.component.scss']
})
export class LabsListScreenComponent implements OnInit {
  laboratorios: Lab[] = [];
  cargando = false;
  error?: string;
  columnasTabla: string[] = ['id', 'nombre', 'edificio', 'piso', 'capacidad', 'tipo', 'status', 'acciones'];
  isAdmin = false;

  constructor(
    private labsService: LabsService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Verificar que es admin
    const user = this.authService.getAuthenticatedUser();
    if (user?.role !== 'ADMIN') {
      this.router.navigate(['/']);
      return;
    }
    this.isAdmin = true;
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
  
  public abrirEditar(lab: Lab){
    // Determinar rol del usuario desde localStorage
    let userStr = localStorage.getItem('user');
    let role = '';
    try{
      if(userStr) role = JSON.parse(userStr).role || '';
    }catch(e){ role = '' }

    const isAdmin = ['ADMIN','administrador','TECH','TECHNICIAN','TECHNIC'].includes(role) || role.toLowerCase?.() === 'administrador';

    // Navegar al formulario pasando el laboratorio y si es de sólo lectura para usuarios no admin
    this.router.navigate(['/laboratorios/nuevo'], { state: { lab: lab, readonly: !isAdmin } });
  }

  public abrirEliminar(lab: Lab){
    // Obtener rol del usuario
    let userStr = localStorage.getItem('user');
    let role = '';
    try{ if(userStr) role = JSON.parse(userStr).role || ''; }catch(e){ role = ''; }

    const dialogRef = this.dialog.open(EliminarLabComponent,{
      data: { id: lab.id, rol: role },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result.isDelete){
        // recargar lista
        this.cargarLaboratorios();
      }else{
        // nothing
      }
    });
  }
}
