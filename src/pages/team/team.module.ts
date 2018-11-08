import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TeamPage } from './team';
import { ComponentsModule } from "../../components/components.module";

@NgModule({
    declarations: [
        TeamPage,
    ],
    imports: [
        IonicPageModule.forChild(TeamPage),
        ComponentsModule
    ],
})
export class TeamPageModule {
}
