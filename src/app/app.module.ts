import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';

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
    FormsModule

  ],
  providers: [NasaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
