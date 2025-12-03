import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-usuario-screen',
  templateUrl: './edit-usuario-screen.component.html',
  styleUrls: ['./edit-usuario-screen.component.scss']
})
export class EditUsuarioScreenComponent implements OnInit{

  public tipo:string = "editar-usuario";
  public user:any ={};

  public isUpdate:boolean = false;
  public errors:any = {};
  public isAdmin:boolean = false;
  public isAlumno:boolean = false;
  public isTecnico:boolean = false;
  public editar: boolean = true;
  public tipo_user:string = "";
  public idUser: number = 0;
  public rol: string = "";
  public loading: boolean = false;
  public esPerfilPropio: boolean = false;

  constructor(
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      const authUser = this.authService.getAuthenticatedUser();
      if (authUser) {
        this.esPerfilPropio = Number(authUser.id) === Number(this.idUser);
      }
      if (!this.esPerfilPropio) {
      }
      this.obtenerUserByID();
    } else {
      this.router.navigate(['/usuarios']);
    }
  }

  public obtenerUserByID(){
    this.loading = true;
    
    const request$ = this.esPerfilPropio
      ? this.authService.me()
      : this.usersService.get(this.idUser);
    
    request$.subscribe(
      (response: any) => {
        console.log("Usuario obtenido:", response);
        const userData = response.data || response || response.results;
        
        if(userData) {
          this.user = {
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
            matricula: userData.matricula || '',
            carrera: userData.carrera || '',
            departamento: userData.departamento || '',
            role: userData.role || '',
          };

          if(userData.role === 'ADMIN'){
            this.user.tipo_usuario = 'administrador';
            this.setUserType('administrador');
          } else if(userData.role === 'ESTUDIANTE'){
            this.user.tipo_usuario = 'alumno';
            this.setUserType('alumno');
          } else if(userData.role === 'TECNICO'){
            this.user.tipo_usuario = 'tecnico';
            this.setUserType('tecnico');
          }
        }
        this.loading = false;
      },
      (error) => {
        console.error("Error al obtener usuario:", error);
        alert(error?.error?.detail || "Error al cargar los datos del usuario");
        this.loading = false;
        if (!this.esPerfilPropio) {
          this.router.navigate(['/usuarios']);
        } else {
          this.router.navigate(['/perfil']);
        }
      }
    );
  }

  public actualizar(){
    if(!this.user.tipo_usuario && !this.esPerfilPropio){
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

    if(this.user.tipo_usuario === 'alumno' && !this.user.matricula) {
      alert("La matrícula es obligatoria para estudiantes");
      return;
    }

    let role = this.user.role || '';
    if(this.user.tipo_usuario){
      if(this.user.tipo_usuario === 'administrador'){
        role = 'ADMIN';
      } else if(this.user.tipo_usuario === 'alumno'){
        role = 'ESTUDIANTE';
      } else if(this.user.tipo_usuario === 'tecnico'){
        role = 'TECNICO';
      }
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

    const request$ = this.esPerfilPropio
      ? this.authService.updateMe(updateData)
      : this.usersService.update(this.idUser, updateData);

    request$.subscribe(
      (response) => {
        alert("Usuario actualizado exitosamente");
        if (this.esPerfilPropio) {
          try {
            localStorage.setItem('user', JSON.stringify(response));
          } catch (e) {
            console.warn('No se pudo actualizar localStorage:', e);
          }
          this.router.navigate(['/perfil']);
        } else {
          this.router.navigate(['/usuarios']);
        }
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
