import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CanvasPage } from "../canvas/canvas";

@IonicPage()
@Component({
    selector: 'page-confirmed-signature',
    templateUrl: 'confirmed-signature.html',
})
export class ConfirmedSignaturePage {
    propleID: string;
    FramMessage: Array<any>;
    FramChenMessage: Array<any>;
    Time: string;
    Chengbaoyuan: string;
    other: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqllite: SqllistServiceProvider,public alertCtrl: AlertController) {
        this.propleID = navParams.get('peopleID');
        this.other = false;
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        sqllite.selecTableIDs('inframmessage','FramGuid', this.propleID)
            .then(res => {
                this.FramMessage = res;
                this.Time = res[0].name.time;
            }).catch();
        sqllite.selecTableIDs('Underwriting','FramGuid', this.propleID)
            .then(res => {
                this.FramChenMessage = res;
            }).catch()
    }

    backsss = (_params) => {
        return new Promise((resolve, reject) => {
            if (_params) {
                this.other = true;
            }
            resolve();
        });
    };

    gotoCanvasPage() {
        if(this.other){
            let alert = this.alertCtrl.create({
                title: '提示',
                subTitle: '不能重复签名',
                buttons: ['好的']
            });
            alert.present();
        }else{
            this.navCtrl.push(CanvasPage, {
                peopleID: this.propleID,
                callback: this.backsss
            });
        }
    }
}
