import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseFarm0Page } from './choose-farm0';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        ChooseFarm0Page,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(ChooseFarm0Page),
    ],
})
export class ChooseFarm0PageModule {
}
