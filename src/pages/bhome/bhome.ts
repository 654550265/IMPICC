import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@Component({
    selector: 'page-bhome',
    templateUrl: 'bhome.html',
})
export class BhomePage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public comm: CommonServiceProvider) {
    }

    gotoPreviousData() {
        this.navCtrl.push('YunDuanDataPage', {
            flag: 0,
            type: 0
        });
    }

    gotopiliang() {
        if (JSON.parse(localStorage.getItem('user')).IsBatch) {
            this.navCtrl.push('PiLiangListPage');
        } else {
            this.comm.toast('您暂无权限使用该功能，请联系管理员')
        }
    }

    gotoFindingsOfAuditPage() {
        this.navCtrl.push('FindingsOfAuditPage');
    }

    gotoDeclareContract() {
        this.navCtrl.push('DeclareContractPage');
    }

    gotoChenNoPassPage() {
        this.navCtrl.push('zyCanvas');
    }
    cameras(){
        this.navCtrl.push("CameraPage");
    }
}
