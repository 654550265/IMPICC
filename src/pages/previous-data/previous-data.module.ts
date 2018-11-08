import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreviousDataPage } from './previous-data';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
    declarations: [
        PreviousDataPage
    ],
    imports: [
        IonicPageModule.forChild(PreviousDataPage),
        PipesModule
    ],
})
export class PreviousDataPageModule {
}
