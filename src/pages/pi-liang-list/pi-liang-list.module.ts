import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PiLiangListPage } from './pi-liang-list';

@NgModule({
    declarations: [
        PiLiangListPage,
    ],
    imports: [
        IonicPageModule.forChild(PiLiangListPage),
    ],
})
export class PiLiangListPageModule {
}
