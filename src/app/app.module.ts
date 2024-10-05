import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Importa HttpClientModule

import { AppComponent } from './app.component';
import { NasaService } from './nasa.service';
//import { EarthComponent } from './earth/earth.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule // Añade HttpClientModule a la lista de imports
  ],
  providers: [NasaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
