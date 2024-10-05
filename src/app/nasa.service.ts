import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NasaService {
  private apiUrl = 'https://data.nasa.gov/resource/b67r-rgxc.json'; // URL de la API

  constructor(private http: HttpClient) { }

  // Método para obtener una cantidad específica de datos
  getData(limit: number): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => data.slice(0, limit)) // Tomar solo los primeros 'limit' elementos
    );
  }
}
