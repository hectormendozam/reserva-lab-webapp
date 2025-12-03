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
  public user:any ={};

  public isUpdate:boolean = false;
  public errors:any = {};
  public isAdmin:boolean = false;
  public isAlumno:boolean = false;
  public isTecnico:boolean = false;
  public editar: boolean = false;
  public tipo_user:string = "";
  public idUser: Number = 0;
  public role: string = "";

  constructor(
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ){}  ngOnInit(): void {
    if(this.activatedRoute.snapshot.params['role'] != undefined){
      this.role = this.activatedRoute.snapshot.params['role'];
      console.log("Rol detect: ", this.role);
    }
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      this.obtenerUserByID();
    }

  }

  public obtenerUserByID(){
    console.log("Función pendiente de implementación");
  }

  public registrar(){
    // Validar que se haya seleccionado un tipo de usuario
    if(!this.user.tipo_usuario){
      alert("Por favor selecciona un tipo de usuario");
      return;
    }

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

    const passwordValidation = this.validatePasswordStrength(this.user.password);
    if(!passwordValidation.valid) {
      alert(passwordValidation.message);
      return;
    }

    if(!this.user.matricula) {
      alert("La matrícula/número de trabajador es obligatorio");
      return;
    }

    let role = '';
    if(this.user.tipo_usuario === 'administrador'){
      role = 'ADMIN';
    } else if(this.user.tipo_usuario === 'alumno'){
      role = 'ESTUDIANTE';
    } else if(this.user.tipo_usuario === 'tecnico'){
      role = 'TECNICO';
    }

    const registerData: any = {
      email: this.user.email,
      password: this.user.password,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      role: role,
      matricula: this.user.matricula,
    };

    if(this.user.tipo_usuario === 'alumno') {
      registerData.carrera = this.user.carrera || '';
      registerData.departamento = '';
    } else {
      registerData.departamento = this.user.departamento || '';
      registerData.carrera = '';
    }

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
