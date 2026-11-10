import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModoBusqueda, RespuestaBusqueda } from '../models/curso.model';

// Servicio del frontend: llama al backend local (/api se redirige a http://localhost:3000)
@Injectable({ providedIn: 'root' })
export class CursosService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/cursos';

  buscar(nombre: string, modo: ModoBusqueda): Observable<RespuestaBusqueda> {
    const params = new HttpParams().set('nombre', nombre).set('modo', modo);
    return this.http.get<RespuestaBusqueda>(this.apiUrl, { params });
  }
}
