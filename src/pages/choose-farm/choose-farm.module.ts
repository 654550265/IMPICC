import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseFarmPage } from './choose-farm';

@NgModule({
  declarations: [
    ChooseFarmPage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseFarmPage),
  ],
})
export class ChooseFarmPageModule {}
