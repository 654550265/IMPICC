import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RealNamePage } from './real-name';

@NgModule({
    declarations: [
        RealNamePage,
    ],
    imports: [
        IonicPageModule.forChild(RealNamePage),
    ],
})
export class RealNameModule {}
