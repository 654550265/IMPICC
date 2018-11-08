import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YunDuanDataPage } from './yun-duan-data';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
    declarations: [
        YunDuanDataPage
    ],
    imports: [
        IonicPageModule.forChild(YunDuanDataPage),
        PipesModule
    ],
})
export class YunDuanDataPageModule {
}
