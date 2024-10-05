import { Component, OnInit } from '@angular/core';
import { NasaService } from './nasa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  data: any[] = []; // Array para almacenar los datos

  constructor(private nasaService: NasaService) { }

  ngOnInit(): void {
    this.loadData(5); // Carga inicial con 5 resultados
  }

  loadData(limit: number): void {
    this.nasaService.getData(limit).subscribe(
      (response) => {
        this.data = response; // Almacena los datos en el array
        console.log(this.data); // Muestra los datos en la consola
      },
      (error) => {
        console.error('Error al obtener datos:', error); // Manejo de errores
      }
    );
  }

  onResultsLimitChange(newLimit: number): void {
    this.loadData(newLimit); // Cargar datos con el nuevo límite
  }
}
