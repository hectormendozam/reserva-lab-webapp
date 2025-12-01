import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../shared/models';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
    this.inicializarFormulario();
  }

  cargarPerfil(): void {
    this.cargando = true;
    // Intentar obtener usuario desde AuthService primero
    const user = this.authService.getAuthenticatedUser();
    if (user) {
      this.usuario = user;
      this.isAdmin = this.usuario?.role === 'ADMIN';
      this.cargando = false;
      this.actualizarFormulario();
      return;
    }

    // Si no está en localStorage o no pudo parsear, intentar consulta al backend
    this.authService.me()?.subscribe({
      next: (u) => {
        this.usuario = u;
        this.isAdmin = this.usuario?.role === 'ADMIN';
        try {
          localStorage.setItem('user', JSON.stringify(u));
        } catch (e) {
          console.warn('No se pudo guardar usuario en localStorage:', e);
        }
        this.cargando = false;
        this.actualizarFormulario();
      },
      error: (err) => {
        console.error('Error al obtener usuario desde API:', err);
        this.cargando = false;
        this.router.navigate(['/auth/login']);
      }
    });
  }

  inicializarFormulario(): void {
    this.formulario = this.fb.group({
      first_name: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      last_name: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(2)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      role: [{ value: '', disabled: true }],
      matricula: [{ value: '', disabled: true }],
      departamento: [''],
    });
  }

  actualizarFormulario(): void {
    if (this.usuario) {
      this.formulario.patchValue({
        first_name: this.usuario.first_name || '',
        last_name: this.usuario.last_name || '',
        email: this.usuario.email || '',
        role: this.usuario.role || '',
        matricula: (this.usuario as any).matricula || '',
        departamento: (this.usuario as any).departamento || '',
      });
      // asegurar que los campos que deben ser lectura estén deshabilitados
      this.formulario.get('first_name')?.disable();
      this.formulario.get('last_name')?.disable();
      this.formulario.get('departamento')?.disable();
    }
  }

  activarEdicion(): void {
    // Redirigir a la pantalla de editar usuario
    if (this.usuario && this.usuario.id) {
      this.router.navigate([`/editar-usuario/${this.usuario.id}`]);
    }
  }

  cancelarEdicion(): void {
    this.editMode = false;
    this.error = undefined;
    this.success = undefined;
    this.actualizarFormulario();
    this.formulario.get('first_name')?.disable();
    this.formulario.get('last_name')?.disable();
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

    const datos = {
      first_name: this.formulario.get('first_name')?.value,
      last_name: this.formulario.get('last_name')?.value,
      departamento: this.formulario.get('departamento')?.value,
    };

    // Validar nombres
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

    // Hacer llamada al backend para actualizar (usando AuthService o un método patch)
    // Por ahora, simulamos actualización local
    if (this.usuario) {
      this.usuario.first_name = datos.first_name;
      this.usuario.last_name = datos.last_name;
      (this.usuario as any).departamento = datos.departamento;
      localStorage.setItem('user', JSON.stringify(this.usuario));
    }

    this.guardando = false;
    this.success = 'Perfil actualizado correctamente.';
    this.editMode = false;
    this.formulario.get('first_name')?.disable();
    this.formulario.get('last_name')?.disable();
    this.formulario.get('departamento')?.disable();
  }

  irAlInicio(): void {
    this.router.navigate(['/reservas']);
  }
}
