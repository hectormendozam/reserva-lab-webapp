import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FacadeService } from './facade.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TecnicosService {

  constructor(
      private http: HttpClient,
      private validatorService: ValidatorService,
      private errorService: ErrorsService,
      private facadeService: FacadeService
    ) { }
  
    public esquemaTecnico(){
      return {
        'rol':'',
        'id_trabajador': '',
        'first_name': '',
        'last_name': '',
        'email': '',
        'password': '',
        'confirmar_password': '',
      }
  }

  public validarMaestro(data: any, editar: boolean){
      console.log("Validando maestro... ", data);
      let error: any = [];
  
      if(!this.validatorService.required(data["id_trabajador"])){
        error["id_trabajador"] = this.errorService.required;
      }
  
      if(!this.validatorService.required(data["first_name"])){
        error["first_name"] = this.errorService.required;
      }
  
      if(!this.validatorService.required(data["last_name"])){
        error["last_name"] = this.errorService.required;
      }
  
      if(!this.validatorService.required(data["email"])){
        error["email"] = this.errorService.required;
      }else if(!this.validatorService.max(data["email"], 40)){
        error["email"] = this.errorService.max(40);
      }else if (!this.validatorService.email(data['email'])) {
        error['email'] = this.errorService.email;
      }
  
      if(!editar){
        if(!this.validatorService.required(data["password"])){
          error["password"] = this.errorService.required;
        }
  
        if(!this.validatorService.required(data["confirmar_password"])){
          error["confirmar_password"] = this.errorService.required;
        }
      }
      return error;
    }
  
    public registrarTecnico (data: any): Observable <any>{
      return this.http.post<any>(`${environment.url_api}/tecnicos/`,data, httpOptions);
    }
  
    public obtenerListaTecnicos (): Observable <any>{
      var token = this.facadeService.getSessionToken();
      var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
      return this.http.get<any>(`${environment.url_api}/lista-tecnicos/`, {headers:headers});
    }
  
    public getTecnicoByID(idUser: Number){
      return this.http.get<any>(`${environment.url_api}/tecnicos/?id=${idUser}`,httpOptions);
    }
  
    public editarTecnico (data: any): Observable <any>{
      var token = this.facadeService.getSessionToken();
      var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
      return this.http.put<any>(`${environment.url_api}/tecnicos-edit/`, data, {headers:headers});
    }
  
    public eliminarTecnico(idUser: number): Observable <any>{
      var token = this.facadeService.getSessionToken();
      var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
      return this.http.delete<any>(`${environment.url_api}/tecnicos-edit/?id=${idUser}`,{headers:headers});
    }
  }
