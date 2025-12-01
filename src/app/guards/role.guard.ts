import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const user = this.authService.getAuthenticatedUser();
    
    // Si no hay usuario, redirigir a login
    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // Si la ruta requiere roles específicos, verificar
    const requiredRoles: UserRole[] = route.data['roles'] || [];
    
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      console.warn(`Usuario con rol ${user.role} intentó acceder a ruta que requiere: ${requiredRoles.join(', ')}`);
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
