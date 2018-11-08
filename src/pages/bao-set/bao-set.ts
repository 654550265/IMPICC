import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-bao-set',
    templateUrl: 'bao-set.html',
})
export class BaoSetPage {
    isTel: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        let tel = JSON.parse(localStorage.getItem('user')).Tel;
        if (tel == undefined) {
            this.isTel = false;
        } else {
            this.isTel = true;
        }
    }
    gotoBaoTelPage(){
        this.navCtrl.push('BaoTelPage');
    }
    gotoBaoChangePassWordPage(){
        this.navCtrl.push('BaoChangePassWordPage')
    }
}
