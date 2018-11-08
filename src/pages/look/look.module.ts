import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LookPage } from './look';

@NgModule({
  declarations: [
    LookPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(LookPage),
  ],
})
export class LookPageModule {}
