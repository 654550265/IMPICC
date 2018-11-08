import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SpecificationPage } from './specification';

@NgModule({
  declarations: [
    SpecificationPage,
  ],
  imports: [
    IonicPageModule.forChild(SpecificationPage),
  ],
})
export class SpecificationPageModule {}
