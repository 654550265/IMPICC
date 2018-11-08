import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PeoLiPeiPage } from './peo-li-pei';

@NgModule({
  declarations: [
    PeoLiPeiPage,
  ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(PeoLiPeiPage),
    ],
})
export class PeoLiPeiPageModule {}
