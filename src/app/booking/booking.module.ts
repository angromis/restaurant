import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingPageRoutingModule } from './booking-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { BookingPage } from './booking.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    BookingPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [BookingPage]
})
export class BookingPageModule {}
