import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
declare var $:any;

@Component({
  selector: 'app-login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss']
})
export class LoginScreenComponent implements OnInit{
  public type: String = "password";
  public username:String = "";
  public password: String = "";
  public errors:any = {};
  public load:boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ){}

  ngOnInit(): void {

  }

  public login(){
    this.load = true;
    this.errors = {};

    if(!this.username || this.username.trim() === ''){
      this.errors.username = 'El correo electrónico es requerido';
    }
    if(!this.password || this.password.trim() === ''){
      this.errors.password = 'La contraseña es requerida';
    }

    if(Object.keys(this.errors).length > 0){
      this.load = false;
      return;
    }

    this.authService.login({
      email: this.username.toString(),
      password: this.password.toString()
    }).subscribe(
      (response) => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        this.load = false;
        
        const userRole = response.user.role;
        if(userRole === 'ADMIN' || userRole === 'TECNICO'){
          this.router.navigate(["/reservas"]);
        } else if(userRole === 'ESTUDIANTE'){
          this.router.navigate(["/reservas"]);
        } else {
          this.router.navigate(["/reservas"]);
        }
      },
      (error) => {
        this.load = false;
        console.error("Error al iniciar sesión:", error);
        alert("No se pudo iniciar sesión. Verifica tus credenciales.");
      }
    );
  }

  public registrar(){
    this.router.navigate(["registro-usuarios"]);
  }

  public showPassword(){
    if(this.type == "password"){
      $("#show-password").addClass("show-password");
      $("#show-password").attr("data-password", true);
      this.type = "text";
    }else if(this.type == "text"){
      $("#show-password").removeClass("show-password");
      $("#show-password").attr("data-password", false);
      this.type = "password";
    }
  }
}
