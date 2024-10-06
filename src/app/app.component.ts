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
  animationState: string = 'play';
  orbitState: string = 'show';
  nameState: string = 'show';

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

  onAnimationStateChange(newState: string): void {
    this.animationState = newState;
  }
  onShowOrbitStateChange(newState: string): void {
    this.orbitState = newState;
  }
  onShowNameStateChange(newState: string): void {
    this.nameState = newState;
  }
}
