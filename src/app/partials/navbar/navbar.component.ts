import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  @Input() tipo: string = "";
  
  public userName: string = "";
  public userRole: string = "";
  public isAdminOrTech: boolean = false;
  public isAdmin: boolean = false;
  public isEstudiante: boolean = false;
  public isTecnico: boolean = false;
  public inicioRuta: string = "/reports"; // Ruta por defecto para admin
  public sidebarOpen: boolean = false;

  constructor(private router: Router){}

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user: any = JSON.parse(userStr);
        if (user && !user.role && user.rol) {
          user.role = user.rol;
        }
        this.userName = `${user.first_name} ${user.last_name}`;
        this.userRole = user.role;
        this.isAdminOrTech = (user.role === 'ADMIN' || user.role === 'TECNICO');
        this.isAdmin = (user.role === 'ADMIN');
        this.isEstudiante = (user.role === 'ESTUDIANTE');
        this.isTecnico = (user.role === 'TECNICO');
        
        if (this.isAdmin) {
          this.inicioRuta = "/reports";
        } else if (this.isTecnico) {
          this.inicioRuta = "/inicio/tecnico";
        } else if (this.isEstudiante) {
          this.inicioRuta = "/inicio/estudiante";
        }
      } catch (e) {
        console.error('Error al parsear usuario:', e);
      }
    }
  }

  public logout(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    this.router.navigate(['/auth/login']);
  }

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
