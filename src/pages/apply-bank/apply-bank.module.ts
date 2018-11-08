import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApplyBankPage } from './apply-bank';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        ApplyBankPage,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(ApplyBankPage),
    ],
})
export class ApplyBankPageModule {
}
