import { Component, OnInit } from '@angular/core';
import { NasaService } from './nasa.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  data: any[] = [];
  resultsLimit: number = 5;
  animationSpeed: number = 1;

  constructor(private nasaService: NasaService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.nasaService.getData(this.resultsLimit).subscribe(
      (response) => {
        this.data = response;
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

  onResultsLimitChange(newLimit: number): void {
    this.resultsLimit = newLimit;
    this.loadData();
  }

  onAnimationSpeedChange(newSpeed: number): void {
    this.animationSpeed = newSpeed;
  }
}
