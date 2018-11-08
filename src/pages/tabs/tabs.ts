import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BpeiPage } from "../bpei/bpei";
import { BhomePage } from "../bhome/bhome";
import { BmyPage } from "../bmy/bmy";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  bhomeRoot = BhomePage;
  bpeiRoot = BpeiPage;
  bmyRoot = BmyPage;


  constructor(public navCtrl: NavController) {}

}
