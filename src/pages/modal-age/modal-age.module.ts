import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAgePage } from './modal-age';

@NgModule({
  declarations: [
    ModalAgePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAgePage),
  ],
})
export class ModalAgePageModule {}
