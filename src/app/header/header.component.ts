import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() resultsLimitChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() animationStateChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() showStateChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() showState2Change: EventEmitter<string> = new EventEmitter<string>();


  resultsLimit: number = 5;
  animationState: boolean = true;
  showState: boolean = true;
  show2State: boolean = true;

  onResultsLimitChange(event: any): void {
    this.resultsLimitChange.emit(this.resultsLimit);
  }

  onAnimationStateChange(event: any): void {
    const state = event.checked ? 'play' : 'pause';
    this.animationStateChange.emit(state);
  }

  onShowStateChange(event: any): void {
    const state = event.checked ? 'show' : 'hide';
    this.animationStateChange.emit(state);
  }

  onShowState2Change(event: any): void {
    const state = event.checked ? 'show' : 'hide';
    this.animationStateChange.emit(state);
  }
}
