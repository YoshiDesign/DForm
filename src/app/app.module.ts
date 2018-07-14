import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RenderableItemComponent } from './renderable/renderable-item/renderable-item.component';

@NgModule({
  declarations: [
    AppComponent,
    RenderableItemComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
