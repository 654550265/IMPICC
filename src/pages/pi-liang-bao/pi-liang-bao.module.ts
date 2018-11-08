import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PiLiangBaoPage } from './pi-liang-bao';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        PiLiangBaoPage,
    ],
    imports: [
        IonicPageModule.forChild(PiLiangBaoPage),
        ComponentsModule
    ],
})
export class PiLiangBaoPageModule {
}
