import { Component } from '@angular/core';
import { NasaService } from './nasa.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  data: any[] = [];

  constructor(private nasaService: NasaService) { }

  ngOnInit(): void {
    this.nasaService.getData().subscribe(
      (response) => {
        this.data = response;
        console.log(this.data);
      },
      (error) => {
        console.error('Error al obtener datos de la API', error);
      }
    );
  }
}
