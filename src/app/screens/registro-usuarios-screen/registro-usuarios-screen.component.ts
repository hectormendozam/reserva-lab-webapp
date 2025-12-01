import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { passwordStrengthValidator } from '../../shared/validators';

@Component({
  selector: 'app-registro-usuarios-screen',
  templateUrl: './registro-usuarios-screen.component.html',
  styleUrls: ['./registro-usuarios-screen.component.scss']
})
export class RegistroUsuariosScreenComponent implements OnInit{

  public tipo:string = "registro-usuarios";
  //JSON para los usuarios (admin, maestros, alumnos)
  public user:any ={};

  public isUpdate:boolean = false;
  public errors:any = {};
  //Banderas para el tipo de usuario
  public isAdmin:boolean = false;
  public isAlumno:boolean = false;
  public isTecnico:boolean = false;
  public editar: boolean = false;
  public tipo_user:string = "";
  //Info del usuario
  public idUser: Number = 0;
  public rol: string = "";

  constructor(
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    //Obtener de la URL el rol para saber cual editar
    if(this.activatedRoute.snapshot.params['rol'] != undefined){
      this.rol = this.activatedRoute.snapshot.params['rol'];
      console.log("Rol detect: ", this.rol);
    }
    //El if valida si existe un parámetro en la URL
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista obtiene el usuario por su ID
      this.obtenerUserByID();
    }

  }

  //Función para obtener un usuario por ID (para edición)
  public obtenerUserByID(){
    // TODO: Implementar cuando el backend tenga endpoint de usuarios por ID
    console.log("Función pendiente de implementación");
  }

  public registrar(){
    // Validar que se haya seleccionado un tipo de usuario
    if(!this.user.tipo_usuario){
      alert("Por favor selecciona un tipo de usuario");
      return;
    }

    // Validar campos requeridos
    if(!this.user.first_name || !this.user.last_name) {
      alert("Nombre y apellido son obligatorios");
      return;
    }

    if(!this.user.email) {
      alert("El correo es obligatorio");
      return;
    }

    if(!this.user.password) {
      alert("La contraseña es obligatoria");
      return;
    }

    // Validar contraseña fuerte
    const passwordValidation = this.validatePasswordStrength(this.user.password);
    if(!passwordValidation.valid) {
      alert(passwordValidation.message);
      return;
    }

    // Validar matrícula para alumnos
    if(this.user.tipo_usuario === 'alumno' && !this.user.matricula) {
      alert("La matrícula es obligatoria para estudiantes");
      return;
    }

    // Mapear tipo_usuario a role según el modelo del backend
    let role = '';
    if(this.user.tipo_usuario === 'administrador'){
      role = 'ADMIN';
    } else if(this.user.tipo_usuario === 'alumno'){
      role = 'ESTUDIANTE';
    } else if(this.user.tipo_usuario === 'tecnico'){
      role = 'TECH';
    }

    const registerData = {
      email: this.user.email,
      password: this.user.password,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      role: role,
      matricula: this.user.matricula || undefined,
      carrera: this.user.carrera || undefined,
      departamento: this.user.departamento || undefined,
    };

    this.authService.register(registerData).subscribe(
      (response) => {
        alert("Usuario registrado exitosamente");
        this.router.navigate(['/auth/login']);
      },
      (error) => {
        console.error("Error al registrar usuario:", error);
        alert("Error al registrar el usuario: " + (error.error?.message || "Error desconocido"));
      }
    );
  }

  /**
   * Valida que la contraseña cumpla con los requisitos
   */
  private validatePasswordStrength(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
      return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'La contraseña debe contener al menos una mayúscula.' };
    }
    
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'La contraseña debe contener al menos una minúscula.' };
    }
    
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'La contraseña debe contener al menos un número.' };
    }
    
    return { valid: true, message: '' };
  }

  public goBack(){
    this.location.back();
  }

  public radioChange(event: MatRadioChange) {
    if(event.value == "administrador"){
      this.isAdmin = true;
      this.tipo_user = "administrador"
      this.isAlumno = false;
      this.isTecnico = false;
    }else if (event.value == "alumno"){
      this.isAdmin = false;
      this.isAlumno = true;
      this.tipo_user = "alumno"
      this.isTecnico = false;
    }else if (event.value == "tecnico"){
      this.isAdmin = false;
      this.isAlumno = false;
      this.isTecnico = true;
      this.tipo_user = "tecnico"
    }
  }
}
