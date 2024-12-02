import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestPassPageRoutingModule } from './rest-pass-routing.module';

import { RestPassPage } from './rest-pass.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestPassPageRoutingModule,
    FormsModule,
  ],
  declarations: [RestPassPage]
})
export class RestPassPageModule {}
