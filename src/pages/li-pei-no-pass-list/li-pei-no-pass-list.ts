import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-li-pei-no-pass-list',
    templateUrl: 'li-pei-no-pass-list.html',
})
export class LiPeiNoPassListPage {
    id: string;
    FramMessage: Array<any>;
    Chengbaoyuan: string;
    E: string;
    Time: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, private photoViewer: PhotoViewer) {
        this.id = navParams.get('id');
        this.E = ENV.IMG_URL;
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.http.get(`${ENV.WEB_URL}GetLpRecordDetails?ids=${this.id}`)
            .subscribe(res => {
                this.FramMessage = res.MyObject;
                this.Time=this.FramMessage[0].createTime.split(' ')[0];
            });
    }

    look(index, item) {
        switch (index) {
            case 1:
                this.photoViewer.show(this.E + this.FramMessage[item].idfrontUrl);
                break;
            case 2:
                this.photoViewer.show(this.E + this.FramMessage[item].idbackUrl);
                break;
            case 3:
                this.photoViewer.show(this.E + this.FramMessage[item].bankUrl);
                break;
            case 4:
                this.photoViewer.show(this.E + this.FramMessage[item].localUrl);
                break;
            case 5:
                this.photoViewer.show(this.E + this.FramMessage[item].disposealUrl);
                break;
            case 6:
                this.photoViewer.show(this.E + this.FramMessage[item].deathUrl);
                break;
        }
    }
}
