import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ENV } from "../../config/environment";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@IonicPage()
@Component({
    selector: 'page-yes-pass-tuan',
    templateUrl: 'yes-pass-tuan.html',
})
export class YesPassTuanPage {
    Chengbaoyuan: string;
    FramMessage: Array<any>;
    Farmers: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public loadingCtrl: LoadingController, public comm: CommonServiceProvider) {
        // let loader = this.loadingCtrl.create({
        //     content: "",
        // });
        // loader.present();
        this.FramMessage = [];
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        let id = navParams.get('id');
        let auditStaus = navParams.get('auditStaus');
        this.http.get(`${ENV.WEB_URL}GetAuditRecordDetail?id=${id}&auditStatus=${auditStaus}`)
        .subscribe(res => {
            if (res.Status) {
                res.MyObject.CreateTime = res.MyObject.CreateTime.split(' ')[0];
                for (let key in  res.MyObject) {
                    res.MyObject[key] = this.comm.getText(res.MyObject[key]);
                }
                this.FramMessage.push(res.MyObject);
                this.Farmers = this.FramMessage[0]['Farmers'];
            }
        })
    }

    gotoLookPage(message) {
        let pins = [];
        let farmImage = [];
        for (let value of this.FramMessage[0].pins) {
            if (value.ParentId == message.Id) {
                pins.push(value);
            }
        }
        for (let values of this.FramMessage[0].FarmerImgs) {
            if (values.ParentId == message.Id) {
                farmImage = values;
                break;
            }
        }
        message['VaccinationCertificateImg'] = farmImage['VaccinationCertificateImg'];
        message['bankUrl'] = farmImage['bankUrl'];
        message['idbackUrl'] = farmImage['idbackUrl'];
        message['idfrontUrl'] = farmImage['idfrontUrl'];
        message['signUrl'] = farmImage['signUrl'];
        this.navCtrl.push('YesPassTuanMorePage', {
            farm: message,
            pins: pins
        });
    }
}
