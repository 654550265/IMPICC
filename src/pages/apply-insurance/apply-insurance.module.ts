import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplyInsurancePage } from './apply-insurance';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ApplyInsurancePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ApplyInsurancePage),
  ],
})
export class ApplyInsurancePageModule {}
