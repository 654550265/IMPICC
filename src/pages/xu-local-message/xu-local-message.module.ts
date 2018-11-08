import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { XuLocalMessagePage } from './xu-local-message';

@NgModule({
  declarations: [
    XuLocalMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(XuLocalMessagePage),
  ],
})
export class XuLocalMessagePageModule {}
