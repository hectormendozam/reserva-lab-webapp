import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../shared/models';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-screen',
  templateUrl: './profile-screen.component.html',
  styleUrls: ['./profile-screen.component.scss']
})
export class ProfileScreenComponent implements OnInit {
  usuario?: User;
  formulario!: FormGroup;
  cargando = false;
  guardando = false;
  editMode = false;
  error?: string;
  success?: string;
  isAdmin = false;
  isTecnico = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.cargando = true;
    const user = this.authService.getAuthenticatedUser();
    if (user) {
      this.usuario = user;
      this.isAdmin = this.usuario?.role === 'ADMIN';
      this.isTecnico = this.usuario?.role === 'TECNICO';
      this.actualizarFormulario();
      this.cargando = false;
      this.cdr.detectChanges();
      const faltanCampos = (!('departamento' in (this.usuario as any)) && (this.isAdmin || this.isTecnico))
                        || (!('carrera' in (this.usuario as any)) && this.usuario.role === 'ESTUDIANTE')
                        || (!('matricula' in (this.usuario as any)));
      if (!faltanCampos) {
        return;
      }
    }

    this.authService.me()?.subscribe({
      next: (u) => {
        this.usuario = u;
        this.isAdmin = this.usuario?.role === 'ADMIN';
        this.isTecnico = this.usuario?.role === 'TECNICO';
        try {
          localStorage.setItem('user', JSON.stringify(u));
        } catch (e) {
          console.warn('No se pudo guardar usuario en localStorage:', e);
        }
        this.actualizarFormulario();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener usuario desde API:', err);
        this.cargando = false;
        this.cdr.detectChanges();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: [''],
      matricula: [''],
      carrera: [''],
      departamento: [''],
    });
  }

  actualizarFormulario(): void {
    if (this.usuario) {
      const rolTraducido = this.usuario.role === 'TECNICO' ? 'Técnico' : 
                          this.usuario.role === 'ESTUDIANTE' ? 'Estudiante' :
                          this.usuario.role === 'ADMIN' ? 'Administrador' : this.usuario.role;
      
      this.formulario.patchValue({
        first_name: this.usuario.first_name || '',
        last_name: this.usuario.last_name || '',
        email: this.usuario.email || '',
        role: rolTraducido,
        matricula: (this.usuario as any).matricula || '',
        carrera: (this.usuario as any).carrera || '',
        departamento: (this.usuario as any).departamento || '',
      });
      
      this.formulario.get('email')?.disable();
      this.formulario.get('role')?.disable();
      this.formulario.get('matricula')?.disable();
      
      if (!this.editMode) {
        this.formulario.get('first_name')?.disable();
        this.formulario.get('last_name')?.disable();
        this.formulario.get('carrera')?.disable();
        this.formulario.get('departamento')?.disable();
      }
      
      this.cdr.detectChanges();
    }
  }

  activarEdicion(): void {
    if (this.usuario?.id) {
      this.router.navigate([`/editar-usuario/${this.usuario.id}`]);
      return;
    }
    const user = this.authService.getAuthenticatedUser();
    if (user?.id) {
      this.router.navigate([`/editar-usuario/${user.id}`]);
    }
  }

  cancelarEdicion(): void {
    this.editMode = false;
    this.error = undefined;
    this.success = undefined;
    this.actualizarFormulario();
    this.formulario.get('first_name')?.disable();
    this.formulario.get('last_name')?.disable();
    this.formulario.get('carrera')?.disable();
    this.formulario.get('departamento')?.disable();
  }

  guardarCambios(): void {
    if (this.formulario.invalid) {
      this.error = 'Por favor, completa todos los campos requeridos.';
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = undefined;
    this.success = undefined;

    const datos: any = {
      first_name: this.formulario.get('first_name')?.value,
      last_name: this.formulario.get('last_name')?.value,
    };
    if (this.usuario?.role === 'ESTUDIANTE') {
      datos.carrera = this.formulario.get('carrera')?.value;
    }
    if (this.isAdmin || this.isTecnico) {
      datos.departamento = this.formulario.get('departamento')?.value;
    }

    if (!datos.first_name || datos.first_name.trim().length < 2) {
      this.guardando = false;
      this.error = 'El nombre debe tener al menos 2 caracteres.';
      return;
    }

    if (!datos.last_name || datos.last_name.trim().length < 2) {
      this.guardando = false;
      this.error = 'El apellido debe tener al menos 2 caracteres.';
      return;
    }

    if (this.usuario?.id) {
      this.usersService.update(this.usuario.id, datos).subscribe({
        next: (u) => {
          this.usuario = { ...this.usuario!, ...u } as User;
          try {
            localStorage.setItem('user', JSON.stringify(this.usuario));
          } catch {}
          this.success = 'Perfil actualizado correctamente.';
          this.error = undefined;
          this.editMode = false;
          this.formulario.get('first_name')?.disable();
          this.formulario.get('last_name')?.disable();
          this.formulario.get('carrera')?.disable();
          this.formulario.get('departamento')?.disable();
        },
        error: (err) => {
          console.error('Error al actualizar perfil:', err);
          this.error = err.error?.message || 'No se pudo actualizar el perfil.';
          this.success = undefined;
        }
      });
      this.guardando = false;
      return;
    }

    this.guardando = false;
  }

  irAlInicio(): void {
    this.router.navigate(['/reservas']);
  }
}
