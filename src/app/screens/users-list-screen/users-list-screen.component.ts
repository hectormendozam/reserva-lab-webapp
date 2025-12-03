import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
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
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }, 100);
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = undefined;
    this.usersService.list().subscribe({
      next: (data) => {
        let list: any[] = [];
        if (Array.isArray(data)) {
          list = data as any[];
        } else if (data && Array.isArray((data as any).results)) {
          list = (data as any).results;
        } else if (data && Array.isArray((data as any).data)) {
          list = (data as any).data;
        } else if (data && typeof data === 'object') {
          const maybeArray = Object.values(data).find(v => Array.isArray(v));
          if (Array.isArray(maybeArray)) list = maybeArray as any[];
        }

        this.users = (list || []).filter(u => u);
        this.dataSource = new MatTableDataSource<User>(this.users);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
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
    this.router.navigate([`/editar-usuario/${user.id}`]);
  }

  abrirEliminar(user: User): void {
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
