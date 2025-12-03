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
  public sidebarOpen: boolean = false; // Para control del sidebar en móvil

  constructor(private router: Router){}

  ngOnInit() {
    // Obtener información del usuario desde localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user: any = JSON.parse(userStr);
        // Normalizar compatibilidad: si viene 'rol' desde backend, mapear a 'role'
        if (user && !user.role && user.rol) {
          user.role = user.rol;
        }
        this.userName = `${user.first_name} ${user.last_name}`;
        this.userRole = user.role;
        this.isAdminOrTech = (user.role === 'ADMIN' || user.role === 'TECNICO');
        this.isAdmin = (user.role === 'ADMIN');
        this.isEstudiante = (user.role === 'ESTUDIANTE');
        this.isTecnico = (user.role === 'TECNICO');
        
        // Configurar ruta de inicio según rol
        if (this.isAdmin) {
          this.inicioRuta = "/reports"; // Panel de reportes para admin
        } else if (this.isTecnico) {
          this.inicioRuta = "/inicio/tecnico"; // Panel de préstamos activos para técnico
        } else if (this.isEstudiante) {
          this.inicioRuta = "/inicio/estudiante"; // Historial de préstamos y reservas para estudiante
        }
      } catch (e) {
        console.error('Error al parsear usuario:', e);
      }
    }
  }

  public logout(){
    // Limpiar localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Navegar al login
    this.router.navigate(['/auth/login']);
  }

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
