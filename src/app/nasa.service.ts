import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NasaService {

  private apiUrl = 'https://data.nasa.gov/resource/b67r-rgxc.json'; // URL de la API

  constructor(private http: HttpClient) { }

  // Método para obtener los datos
  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
