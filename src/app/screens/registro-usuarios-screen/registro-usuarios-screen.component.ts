import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
  public isMaestro:boolean = false;
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

    // Mapear tipo_usuario a role según el modelo del backend
    let role = '';
    if(this.user.tipo_usuario === 'administrador'){
      role = 'ADMIN';
    } else if(this.user.tipo_usuario === 'alumno'){
      role = 'STUDENT';
    } else if(this.user.tipo_usuario === 'tecnico'){
      role = 'TECH';
    }

    const registerData = {
      email: this.user.email,
      password: this.user.password,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      role: role,
      student_id: this.user.student_id || undefined,
      career: this.user.career || undefined,
      department: this.user.department || undefined,
      phone: this.user.phone || undefined
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

  public goBack(){
    this.location.back();
  }

  public radioChange(event: MatRadioChange) {
    if(event.value == "administrador"){
      this.isAdmin = true;
      this.tipo_user = "administrador"
      this.isAlumno = false;
      this.isMaestro = false;
    }else if (event.value == "alumno"){
      this.isAdmin = false;
      this.isAlumno = true;
      this.tipo_user = "alumno"
      this.isMaestro = false;
    }else if (event.value == "maestro"){
      this.isAdmin = false;
      this.isAlumno = false;
      this.isMaestro = true;
      this.tipo_user = "maestro"
    }
  }
}
