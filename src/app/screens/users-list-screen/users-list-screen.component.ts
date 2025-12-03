import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from '../../services/users.service';
import { User } from '../../shared/models';
import { AuthService } from '../../services/auth.service';
import { EliminarUserModalComponent } from '../../modals/eliminar-user-modal/eliminar-user-modal.component';

@Component({
  selector: 'app-users-list-screen',
  templateUrl: './users-list-screen.component.html',
  styleUrls: ['./users-list-screen.component.scss']
})
export class UsersListScreenComponent implements OnInit {
  users: User[] = [];
  cargando = false;
  error?: string;
  columnasTabla: string[] = ['id', 'nombre', 'email', 'rol', 'acciones'];

  constructor(
    private usersService: UsersService,
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
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = undefined;
    this.usersService.list().subscribe({
      next: (data) => {
        // Aceptar varias formas de respuesta del backend: array directo, { results: [] }, { data: [] }
        let list: any[] = [];
        if (Array.isArray(data)) {
          list = data as any[];
        } else if (data && Array.isArray((data as any).results)) {
          list = (data as any).results;
        } else if (data && Array.isArray((data as any).data)) {
          list = (data as any).data;
        } else if (data && typeof data === 'object') {
          // intentar convertir valores a array si tiene forma { users: [...] }
          const maybeArray = Object.values(data).find(v => Array.isArray(v));
          if (Array.isArray(maybeArray)) list = maybeArray as any[];
        }

        // Mostrar todos los usuarios sin filtro
        this.users = (list || []).filter(u => u);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.error = 'No se pudieron cargar los usuarios.';
        this.cargando = false;
      }
    });
  }

  irNuevoUsuario(): void {
    this.router.navigate(['/registro-usuarios']);
  }

  abrirEditar(user: User): void {
    if (!user || !user.role) return;
    // Redirigir al nuevo componente de edición dedicado
    this.router.navigate([`/editar-usuario/${user.id}`]);
  }

  abrirEliminar(user: User): void {
    // Mapear rol del backend (ADMIN/TECNICO/ESTUDIANTE) a nombres esperados por el modal
    let rolModal = '';
    switch (user.role) {
      case 'ADMIN': rolModal = 'administrador'; break;
      case 'TECNICO': rolModal = 'tecnico'; break;
      case 'ESTUDIANTE': rolModal = 'alumno'; break;
      default: rolModal = user.role || '';
    }

    const dialogRef = this.dialog.open(EliminarUserModalComponent, {
      data: { id: user.id, nombre: `${user.first_name} ${user.last_name}`, rol: rolModal },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.isDelete) {
        this.cargarUsuarios();
      }
    });
  }

  traducirRol(rol: string): string {
    switch (rol) {
      case 'ADMIN':
        return 'Administrador';
      case 'TECNICO':
        return 'Técnico';
      case 'ESTUDIANTE':
        return 'Estudiante';
      default:
        return rol;
    }
  }
}
