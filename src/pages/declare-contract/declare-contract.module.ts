import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeclareContractPage } from './declare-contract';

@NgModule({
  declarations: [
    DeclareContractPage,
  ],
  imports: [
    IonicPageModule.forChild(DeclareContractPage),
  ],
})
export class DeclareContractPageModule {}
