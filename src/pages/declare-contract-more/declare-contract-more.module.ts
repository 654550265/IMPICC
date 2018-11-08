import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeclareContractMorePage } from './declare-contract-more';

@NgModule({
  declarations: [
    DeclareContractMorePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(DeclareContractMorePage),
  ],
})
export class DeclareContractMorePageModule {}
