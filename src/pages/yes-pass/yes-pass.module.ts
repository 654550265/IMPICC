import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YesPassPage } from './yes-pass';

@NgModule({
  declarations: [
    YesPassPage,
  ],
  imports: [
    IonicPageModule.forChild(YesPassPage),
  ],
})
export class YesPassPageModule {}
