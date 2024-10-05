import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() resultsLimitChange: EventEmitter<number> = new EventEmitter<number>();
  resultsLimit: number = 5;

  onSliderChange(event: any): void {
    this.resultsLimitChange.emit(this.resultsLimit);
  }
}
