import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-up-load-li-pei-message',
    templateUrl: 'up-load-li-pei-message.html',
})
export class UpLoadLiPeiMessagePage {

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }
    gotoLiPeiFangYiZhengPage(){
        this.navCtrl.push('LiPeiFangYiZhengPage');
    }
}
