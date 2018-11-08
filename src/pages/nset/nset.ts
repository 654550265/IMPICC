import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-nset',
    templateUrl: 'nset.html',
})
export class NsetPage {
    names: string;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.names = JSON.parse(localStorage.getItem('user')).RealName;
    }

    gotoNtelPage() {
        this.navCtrl.push('NtelPage');
    }

    gotoNchangePassWordPage() {
        this.navCtrl.push('NchangePassWordPage');
    }

    gotoRealNamePage() {
        this.navCtrl.push('RealNamePage');
    }
}
