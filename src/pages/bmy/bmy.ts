import { Component } from '@angular/core';
import { App, AlertController, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from "../login/login";

@Component({
    selector: 'page-bmy',
    templateUrl: 'bmy.html',
})
export class BmyPage {
    baoxianyuan:string;
    constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController, public app: App) {
        this.baoxianyuan=JSON.parse(localStorage.getItem('user')).RealName;
    }

    logoutMy() {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '确定退出登陆吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        localStorage.clear();
                        this.app.getRootNav().setRoot(LoginPage);
                    }
                }
            ]
        });
        confirm.present();
    }
    gotoBaoSetPage(){
        this.navCtrl.push('BaoSetPage');
    }
    gotoBaoTongXunListPage(){
        this.navCtrl.push('BaoTongXunListPage');
    }
    gotoSpecification(){
        this.navCtrl.push('SpecificationPage');
    }
    AboutPage(){
        this.navCtrl.push('AboutPage');
    }
}
