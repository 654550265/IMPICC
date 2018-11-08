import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { XuChangePage } from './xu-change';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        XuChangePage
    ],
    imports: [
        ComponentsModule,
        IonicPageModule.forChild(XuChangePage),
    ],
})
export class XuChangePageModule {
}
