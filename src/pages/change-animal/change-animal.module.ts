import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeAnimalPage } from './change-animal';

@NgModule({
  declarations: [
    ChangeAnimalPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeAnimalPage),
  ],
})
export class ChangeAnimalPageModule {}
