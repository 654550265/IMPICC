import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClaimSettlementPage } from './claim-settlement';

@NgModule({
  declarations: [
    ClaimSettlementPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ClaimSettlementPage),
  ],
})
export class ClaimSettlementPageModule {}
