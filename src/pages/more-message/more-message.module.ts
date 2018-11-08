import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MoreMessagePage } from './more-message';

@NgModule({
  declarations: [
    MoreMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(MoreMessagePage),
  ],
})
export class MoreMessagePageModule {}
