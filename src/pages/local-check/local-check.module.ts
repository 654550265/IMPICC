import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocalCheckPage } from './local-check';

@NgModule({
  declarations: [
    LocalCheckPage,
  ],
  imports: [
    IonicPageModule.forChild(LocalCheckPage),
  ],
})
export class LocalCheckPageModule {}
