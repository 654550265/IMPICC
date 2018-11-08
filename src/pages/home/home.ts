import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController, public alertCtrl: AlertController) {

    }

    isRealName() {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '您还没有实名认证，该功能无法使用！',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '去认证',
                    handler: () => {
                        this.navCtrl.push('RealNamePage');
                    }
                }
            ]
        });
        confirm.present();
    }

    RealNameing() {
        let alert = this.alertCtrl.create({
            title: '提示',
            subTitle: '您的信息正在审核中，请耐心等待',
            buttons: ['知道了']
        });
        alert.present();
    }

    gotoUploadData() {
        if (!JSON.parse(localStorage.getItem('user')).IdentityVerify) {
            if (JSON.parse(localStorage.getItem('realnameing')) != null && JSON.parse(localStorage.getItem('realnameing'))) {
                this.RealNameing();
            }else{
                this.isRealName();
            }
        } else {
            this.navCtrl.push('UploadDataPage');
        }
    }

    gotoApplyInsurance() {
        if (!JSON.parse(localStorage.getItem('user')).IdentityVerify) {
            if (JSON.parse(localStorage.getItem('realnameing')) != null && JSON.parse(localStorage.getItem('realnameing'))) {
                this.RealNameing();
            }else{
                this.isRealName();
            }
        } else {
            this.navCtrl.push('ApplyBankPage');
        }
    }

    gotoClaimSettlement() {
        if (!JSON.parse(localStorage.getItem('user')).IdentityVerify) {
            if (JSON.parse(localStorage.getItem('realnameing')) != null && JSON.parse(localStorage.getItem('realnameing'))) {
                this.RealNameing();
            }else{
                this.isRealName();
            }
        } else {
            this.navCtrl.push('ClaimSettlementPage');
        }
    }

    gotoSelectOfficer() {
        if (!JSON.parse(localStorage.getItem('user')).IdentityVerify) {
            if (JSON.parse(localStorage.getItem('realnameing')) != null && JSON.parse(localStorage.getItem('realnameing'))) {
                this.RealNameing();
            }else{
                this.isRealName();
            }
        } else {
            this.navCtrl.push('SelectOfficerPage');
        }
    }
}
