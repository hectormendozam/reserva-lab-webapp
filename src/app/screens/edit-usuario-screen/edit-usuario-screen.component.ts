import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-edit-usuario-screen',
  templateUrl: './edit-usuario-screen.component.html',
  styleUrls: ['./edit-usuario-screen.component.scss']
})
export class EditUsuarioScreenComponent implements OnInit{

  public tipo:string = "editar-usuario";
  //JSON para los usuarios (admin, maestros, alumnos)
  public user:any ={};

  public isUpdate:boolean = false;
  public errors:any = {};
  //Banderas para el tipo de usuario
  public isAdmin:boolean = false;
  public isAlumno:boolean = false;
  public isTecnico:boolean = false;
  public editar: boolean = true;
  public tipo_user:string = "";
  //Info del usuario
  public idUser: number = 0;
  public rol: string = "";
  public loading: boolean = false;
  public esPerfilPropio: boolean = false;

  constructor(
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ){}

  ngOnInit(): void {
    //Obtener el ID de la URL para editar
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      //Al iniciar la vista obtiene el usuario por su ID
      this.obtenerUserByID();
    } else {
      //Si no hay ID, redirigir a usuarios
      this.router.navigate(['/usuarios']);
    }
  }

  //Función para obtener un usuario por ID (para edición)
  public obtenerUserByID(){
    this.loading = true;
    this.usersService.get(this.idUser).subscribe(
      (response: any) => {
        console.log("Usuario obtenido:", response);
        // Manejar múltiples formatos de respuesta
        const userData = response.data || response || response.results;
        
        if(userData) {
          this.user = {
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
            matricula: userData.matricula || '',
            carrera: userData.carrera || '',
            departamento: userData.departamento || '',
            role: userData.role || '', // Guardar el rol para referencia
          };

          // Mapear role del backend a tipo_usuario
          if(userData.role === 'ADMIN'){
            this.user.tipo_usuario = 'administrador';
            this.setUserType('administrador');
          } else if(userData.role === 'ESTUDIANTE'){
            this.user.tipo_usuario = 'alumno';
            this.setUserType('alumno');
          } else if(userData.role === 'TECH'){
            this.user.tipo_usuario = 'tecnico';
            this.setUserType('tecnico');
          }
        }
        this.loading = false;
      },
      (error) => {
        console.error("Error al obtener usuario:", error);
        alert("Error al cargar los datos del usuario");
        this.loading = false;
        this.router.navigate(['/usuarios']);
      }
    );
  }

  public actualizar(){
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

    const updateData = {
      email: this.user.email,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      role: role,
      matricula: this.user.matricula || undefined,
      carrera: this.user.carrera || undefined,
      departamento: this.user.departamento || undefined,
    };

    this.usersService.update(this.idUser, updateData).subscribe(
      (response) => {
        alert("Usuario actualizado exitosamente");
        this.router.navigate(['/usuarios']);
      },
      (error) => {
        console.error("Error al actualizar usuario:", error);
        alert("Error al actualizar el usuario: " + (error.error?.message || "Error desconocido"));
      }
    );
  }

  public goBack(){
    this.location.back();
  }

  public radioChange(event: MatRadioChange) {
    this.setUserType(event.value);
  }

  private setUserType(type: string) {
    if(type === "administrador"){
      this.isAdmin = true;
      this.tipo_user = "administrador"
      this.isAlumno = false;
      this.isTecnico = false;
    } else if (type === "alumno"){
      this.isAdmin = false;
      this.isAlumno = true;
      this.tipo_user = "alumno"
      this.isTecnico = false;
    } else if (type === "tecnico"){
      this.isAdmin = false;
      this.isAlumno = false;
      this.isTecnico = true;
      this.tipo_user = "tecnico"
    }
  }
}
