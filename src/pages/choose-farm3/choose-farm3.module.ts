import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseFarm3Page } from './choose-farm3';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        ChooseFarm3Page,
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(ChooseFarm3Page),
    ],
})
export class ChooseFarm3PageModule {
}
