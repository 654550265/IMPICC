import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePage } from './change';

@NgModule({
  declarations: [
    ChangePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ChangePage),
  ],
})
export class ChangePageModule {}
