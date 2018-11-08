import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UploadDataPage } from './upload-data';

@NgModule({
  declarations: [
    UploadDataPage,
  ],
  imports: [
    IonicPageModule.forChild(UploadDataPage),
  ],
})
export class UploadDataPageModule {}
