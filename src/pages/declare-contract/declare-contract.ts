import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-declare-contract',
    templateUrl: 'declare-contract.html',
})
export class DeclareContractPage {
    constructor(public navCtrl: NavController, public navParams: NavParams) {

    }

    inFarm() {
        this.navCtrl.push('ChooseFarmPage', {
            type: 0,
            defpage: 'one'
        });
    }

    inFarms() {
        this.navCtrl.push('ChooseFarmPage', {
            type: 1,
            defpage: 'one'
        });
    }

    gotoDeclareContractMore() {
        this.navCtrl.push('DeclareContractMorePage');
    }

    gotoLocalUnderwritingDataPage() {
        this.navCtrl.push('LocalUnderwritingDataPage',{
            type: 1
        });
    }
}
