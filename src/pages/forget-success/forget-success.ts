import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-forget-success',
    templateUrl: 'forget-success.html',
})
export class ForgetSuccessPage {
    UserTel:object;
    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.UserTel = navParams.data;
    }
}
