import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../models';

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
    
    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const requiredRoles: UserRole[] = route.data['roles'] || [];

    const routeId = route.paramMap.get('id');
    const isEditingOwnProfile = routeId && Number(routeId) === (user as any).id;
    const routePath = route.routeConfig?.path || '';
    const isEditUsuarioRoute = routePath.includes('editar-usuario');
    if (isEditingOwnProfile && isEditUsuarioRoute) {
      return true;
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
      console.warn(`Usuario con rol ${user.role} intentó acceder a ruta que requiere: ${requiredRoles.join(', ')}`);
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
