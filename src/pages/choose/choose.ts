import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-choose',
    templateUrl: 'choose.html',
})
export class ChoosePage {
    list: Array<object>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
        this.list = [
            {id: 1, name: '农户', src: 'assets/icon/nonghu.png', srcAcv: 'assets/icon/nonghu-acv.png', acv: true},
            {
                id: 2,
                name: '承保员/协保员/理赔员/协赔员',
                src: 'assets/icon/baoxianyuan.png',
                srcAcv: 'assets/icon/baoxianyuan-acv.png',
                acv: false
            },
        ];
    }

    who(x) {
        this.list.map((item) => {
            item["acv"] = false;
            return item;
        });
        x.acv = true;
        if (x.id == 2) {
            let alert = this.alertCtrl.create({
                title: '提示',
                subTitle: '非农户角色暂不提供自行注册功能，请联系管理员提供帐号与密码。',
                buttons: [{
                    text: '知道了',
                    handler: data => {
                        this.navCtrl.pop();
                    }
                }]
            });
            alert.present();
        }else{
            this.navCtrl.push('RegisterPage');
        }
    }
}
