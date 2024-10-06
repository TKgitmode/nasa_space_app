import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() resultsLimitChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() animationSpeedChange: EventEmitter<number> = new EventEmitter<number>();
  resultsLimit: number = 5;
  animationSpeed: number = 1;

  onResultsLimitChange(event: any): void {
    this.resultsLimitChange.emit(this.resultsLimit);
  }

  onAnimationSpeedChange(event: any): void {
    this.animationSpeedChange.emit(this.animationSpeed);
  }
}
