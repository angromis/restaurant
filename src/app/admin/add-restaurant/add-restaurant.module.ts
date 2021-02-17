import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRestaurantPageRoutingModule } from './add-restaurant-routing.module';

import { AddRestaurantPage } from './add-restaurant.page';
import { FormatSizePipe } from './format-size.pipe';
import { SharedModule } from 'src/app/shared/shared.module';
//import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    AddRestaurantPageRoutingModule,
    SharedModule
  ],
  declarations: [AddRestaurantPage, FormatSizePipe]
})
export class AddRestaurantPageModule {}
