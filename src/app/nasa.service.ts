import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NasaObject } from './interfaces/NasaObject.interface';

@Injectable({
  providedIn: 'root'
})
export class NasaService {
  private apiUrl = 'https://data.nasa.gov/resource/b67r-rgxc.json';

  constructor(private http: HttpClient) { }

  getData(limit: number): Observable<NasaObject[]> {
    return this.http.get<NasaObject[]>(this.apiUrl).pipe(
      map(data => this.filterValidOrbitalObjects(data, limit))
    );
  }

  private filterValidOrbitalObjects(data: NasaObject[], limit: number): NasaObject[] {
    return data
      .filter(obj => this.isValidOrbitalObject(obj))
      .slice(0, limit);
  }

  private isValidOrbitalObject(obj: NasaObject): boolean {
    return (
      obj.e !== undefined &&
      obj.q_au_1 !== undefined &&
      obj.i_deg !== undefined &&
      obj.node_deg !== undefined &&
      obj.p_yr !== undefined &&
      !isNaN(parseFloat(obj.e)) &&
      !isNaN(parseFloat(obj.q_au_1)) &&
      !isNaN(parseFloat(obj.i_deg)) &&
      !isNaN(parseFloat(obj.node_deg)) &&
      !isNaN(parseFloat(obj.p_yr))
    );
  }
}
