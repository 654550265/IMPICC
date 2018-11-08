import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetLiPeiPage } from './get-li-pei';

@NgModule({
  declarations: [
    GetLiPeiPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(GetLiPeiPage),
  ],
})
export class GetLiPeiPageModule {}
