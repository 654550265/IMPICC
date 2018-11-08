import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailAnimalPage } from './detail-animal';

@NgModule({
  declarations: [
    DetailAnimalPage,
  ],
  imports: [
    IonicPageModule.forChild(DetailAnimalPage),
  ],
})
export class DetailAnimalPageModule {}
