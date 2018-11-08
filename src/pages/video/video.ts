import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@IonicPage()
@Component({
    selector: 'page-video',
    templateUrl: 'video.html',
})
export class VideoPage {
    type: number;
    name: string;
    text: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider,public comm:CommonServiceProvider) {
        this.type = navParams.get('type');
        this.name = navParams.get('name');
        this.text = navParams.get('text');
        this.http.get(`${ENV.WEB_URL}PiccImPush?fromUname=${JSON.parse(localStorage.getItem('user')).AccountName}&targetUname=${this.name}&msgType=${this.type}&operateType=dial&fromName=${JSON.parse(localStorage.getItem('user')).RealName}`)
            .subscribe(res => {
                if(res.Status){
                    this.comm.playmp3('/android_asset/www/assets/call.mp3');
                }
            })
    }

    guaduan() {
        this.http.get(`${ENV.WEB_URL}PiccImPush?fromUname=${JSON.parse(localStorage.getItem('user')).AccountName}&targetUname=${this.name}&msgType=${this.type}&operateType=hangup&fromName=${JSON.parse(localStorage.getItem('user')).RealName}`)
            .subscribe(res => {
                if (res.Status) {
                    localStorage.setItem('calling', 'false');
                    this.comm.stopmp3();
                    this.navCtrl.pop();
                }
            });
    }
}
