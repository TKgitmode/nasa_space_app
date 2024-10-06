import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { NasaService } from './nasa.service';
import { HeaderComponent } from './header/header.component'

import { ThreeDVisualizationComponent } from './three-d-visualization/three-d-visualization.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeDVisualizationComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SliderModule,
    SelectButtonModule,
    ToggleButtonModule,
    DialogModule,
    ButtonModule,
    BadgeModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [NasaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
