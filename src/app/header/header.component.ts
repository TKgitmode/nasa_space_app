import { Component, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() resultsLimitChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() animationStateChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() showOrbitStateChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() showNameStateChange: EventEmitter<string> = new EventEmitter<string>();

  resultsLimit: number = 5;
  animationState: boolean = true;
  showOrbitState: boolean = true;
  showNameState: boolean = true;

  onResultsLimitChange(event: any): void {
    this.resultsLimitChange.emit(this.resultsLimit);
  }

  onAnimationStateChange(event: any): void {
    const state = event.checked ? 'play' : 'pause';
    this.animationStateChange.emit(state);
  }

  onShowOrbitStateChange(event: any): void {
    const state = event.checked ? 'show' : 'hide';
    this.showOrbitStateChange.emit(state);
  }

  onShowNameStateChange(event: any): void {
    const state = event.checked ? 'show' : 'hide';
    this.showNameStateChange.emit(state);
  }
}
