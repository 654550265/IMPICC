import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LiPeiNoPassListPage } from './li-pei-no-pass-list';

@NgModule({
  declarations: [
    LiPeiNoPassListPage,
  ],
  imports: [
    IonicPageModule.forChild(LiPeiNoPassListPage),
  ],
})
export class LiPeiNoPassListPageModule {}
