import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-bao-li-pei',
    templateUrl: 'bao-li-pei.html',
})
export class BaoLiPeiPage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    PreviousDataPage() {
        this.navCtrl.push('PreviousDataPage', {
            flag: 1,
            type: 1
        });
    }
    gotoPeoPage() {
        this.navCtrl.push('PeoLiPeiPage');
    }

    gotoGetLiPei() {
        this.navCtrl.push('GetLiPeiPage');
    }

    gotoLocal() {
        this.navCtrl.push('LocalPage');
    }
}
