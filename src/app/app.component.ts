import { Component, OnInit } from '@angular/core';
import { NasaService } from './nasa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  data: any[] = [];

  constructor(private nasaService: NasaService) { }

  ngOnInit(): void {
    this.loadData(5); // Carga inicial con 5 resultados
  }

  loadData(limit: number): void {
    this.nasaService.getData(limit).subscribe(
      (response) => {
        this.data = response;
        console.log(this.data);
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

  onResultsLimitChange(newLimit: number): void {
    this.loadData(newLimit);
  }
}
