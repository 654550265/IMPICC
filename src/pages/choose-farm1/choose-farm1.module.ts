import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseFarm1Page } from './choose-farm1';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
  declarations: [
    ChooseFarm1Page,
  ],
  imports: [
      ComponentsModule,
    IonicPageModule.forChild(ChooseFarm1Page),
  ],
})
export class ChooseFarm1PageModule {}
