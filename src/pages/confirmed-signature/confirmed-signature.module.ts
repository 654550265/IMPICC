import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmedSignaturePage } from './confirmed-signature';

@NgModule({
  declarations: [
    ConfirmedSignaturePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ConfirmedSignaturePage),
  ],
})
export class ConfirmedSignaturePageModule {}
