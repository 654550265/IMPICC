import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-yes-pass',
    templateUrl: 'yes-pass.html',
})
export class YesPassPage {
    id: string;
    FramMessage: any;
    FramChenMessage: Array<any>;
    Chengbaoyuan: string;
    Time: string;
    auditStaus: number;
    E: any;
    FramChenMessages: Array<any>;
    isFramChenMessage: boolean;
    isFramChenMessagesss: boolean;
    ImageUrl: string;
    farm: any;
    pins: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public loadingCtrl: LoadingController, private photoViewer: PhotoViewer) {
        let loader = this.loadingCtrl.create({
            content: "加载中..."
        });
        loader.present();
        this.ImageUrl = ENV.IMG_URL;
        this.id = this.navParams.get('id');
        this.auditStaus = this.navParams.get('auditStaus');
        this.E = ENV.IMG_URL;
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;

        this.http.get(`${ENV.WEB_URL}GetAuditRecordDetail?id=${this.id}&auditStatus=${this.auditStaus}`)
        .subscribe(res => {
            if (res.Status) {
                let n = [];
                this.Time = (res.MyObject.CreateTime).split(' ')[0];
                n.push(res.MyObject);
                this.FramMessage = n;
                this.FramChenMessage = res.MyObject.pins;
                this.FramChenMessages = res.MyObject.batchPins;
                this.isFramChenMessage = this.FramChenMessage == null ? false : this.FramChenMessage.length != 0;
                this.isFramChenMessagesss = this.FramChenMessages == null ? false : this.FramChenMessages.length != 0;
                loader.dismiss();
            }
        })
    }

    checks(index, item) {
        switch (index) {
            case 1:
                this.photoViewer.show(this.E + this.FramMessage[item].idfrontUrl.ImgUrl);
                break;
            case 2:
                this.photoViewer.show(this.E + this.FramMessage[item].idbackUrl.ImgUrl);
                break;
            case 3:
                this.photoViewer.show(this.E + this.FramMessage[item].bankUrl.ImgUrl);
                break;
            case 4:
                this.photoViewer.show(this.E + this.FramMessage[item].VaccinationCertificateImg.ImgUrl);
                break;
            case 5:
                this.photoViewer.show(this.E + this.FramMessage[item].InstitutionCodeImg.ImgUrl);
                break;
        }
    }

    checkss(index, item) {
        switch (index) {
            case 1:
                this.photoViewer.show(this.E + this.FramChenMessage[item].positonUrl.ImgUrl);
                break;
            case 2:
                this.photoViewer.show(this.E + this.FramChenMessage[item].frontUrl.ImgUrl);
                break;
            case 3:
                this.photoViewer.show(this.E + this.FramChenMessage[item].leftUrl.ImgUrl);
                break;
            case 4:
                this.photoViewer.show(this.E + this.FramChenMessage[item].rightUrl.ImgUrl);
                break;
        }
    }

    lookss(url) {
        this.photoViewer.show(this.ImageUrl + url);
    }

}
