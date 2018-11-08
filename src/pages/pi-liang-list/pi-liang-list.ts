import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-pi-liang-list',
    templateUrl: 'pi-liang-list.html',
})
export class PiLiangListPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    gotoDeclareContractMore() {
        this.navCtrl.push('PiLiangBaoPage');
    }

    inFarm() {
        this.navCtrl.push('ChooseFarmPage', {
            type: 0,
            defpage: 'piliang'
        })
    }

    gotoLocalUnderwritingDataPage() {
        this.navCtrl.push('PiLiangBaoLocalPage');
    }
}
