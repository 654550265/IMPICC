import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocalChangePage } from './local-change';

@NgModule({
  declarations: [
    LocalChangePage,
  ],
  imports: [
    IonicPageModule.forChild(LocalChangePage),
  ],
})
export class LocalChangePageModule {}
