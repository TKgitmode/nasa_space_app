import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() resultsLimitChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() animationStateChange: EventEmitter<string> = new EventEmitter<string>();

  resultsLimit: number = 5;
  animationState: string = 'play';

  animationOptions: any[] = [
    { label: 'Pausar', value: 'pause', icon: 'pi pi-pause' },
    { label: 'Reanudar', value: 'play', icon: 'pi pi-play' }
  ];

  onResultsLimitChange(event: any): void {
    this.resultsLimitChange.emit(this.resultsLimit);
  }

  onAnimationStateChange(state: string): void {
    this.animationStateChange.emit(state);
  }
}
