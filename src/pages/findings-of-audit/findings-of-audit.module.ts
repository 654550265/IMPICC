import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FindingsOfAuditPage } from './findings-of-audit';

@NgModule({
  declarations: [
    FindingsOfAuditPage,
  ],
  imports: [
    IonicPageModule.forChild(FindingsOfAuditPage),
  ],
})
export class FindingsOfAuditPageModule {}
