import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-bpei',
    templateUrl: 'bpei.html',
})
export class BpeiPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    gotoUpLoadLiPeiMessage() {
        this.navCtrl.push('UpLoadLiPeiMessagePage');
    }

    gotoBaoLiPei() {
        this.navCtrl.push('BaoLiPeiPage');
    }

    gotoIsPassPage() {
        this.navCtrl.push('IsPassPage');
    }

    gotoIsPassPagess() {
        this.navCtrl.push('LiPeiNoPassPage');
    }
}
