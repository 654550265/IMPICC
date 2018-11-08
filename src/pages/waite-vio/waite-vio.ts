import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

declare let agoravoice: any;

@IonicPage()
@Component({
    selector: 'page-waite-vio',
    templateUrl: 'waite-vio.html',
})
export class WaiteVioPage {
    realname: string;
    type: string;
    uname: string;
    name: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public comm: CommonServiceProvider) {
        this.realname = navParams.get('realname');
        this.type = navParams.get('type');
        this.uname = navParams.get('unames');
    }

    guanduan() {
        if(this.type === 'videoPC'){
                this.comm.stopmp3();
                localStorage.setItem('calling', 'false');
                this.navCtrl.pop();
        }else{
            this.http.get(`${ENV.WEB_URL}PiccImPush?fromUname=${JSON.parse(localStorage.getItem('user')).AccountName}&targetUname=${this.uname}&msgType=${this.type}&operateType=hangup&fromName=${JSON.parse(localStorage.getItem('user')).RealName}`)
            .subscribe(res => {
                if (res.Status) {
                    this.comm.stopmp3();
                    localStorage.setItem('calling', 'false');
                    this.navCtrl.pop();
                }
            });
        }
    }

    jieqi() {
        if(this.type=='videoPC'){
            this.comm.stopmp3();
            if (typeof agoravoice !== 'undefined') {
                agoravoice.videoCall(
                    this.uname,
                    JSON.parse(localStorage.getItem('user')).AccountName,
                    (data) => {
                        if (data === "close") {
                            localStorage.setItem('calling', 'false');
                        }
                    },

                    (err) => {
                        console.log(err);
                    });
                this.navCtrl.pop();
            }
        }else{
            this.http.get(`${ENV.WEB_URL}PiccImPush?fromUname=${JSON.parse(localStorage.getItem('user')).AccountName}&targetUname=${this.uname}&msgType=${this.type}&operateType=Connect&fromName=${JSON.parse(localStorage.getItem('user')).RealName}`)
                .subscribe(res => {
                    if (res.Status) {
                        this.comm.stopmp3();
                        localStorage.setItem('calling', 'true');
                        if (this.type == 'voice') {
                            if (typeof agoravoice !== 'undefined') {
                                agoravoice.voiceCall(
                                    this.uname,
                                    JSON.parse(localStorage.getItem('user')).AccountName,
                                    (data) => {
                                        if (data === "close") {
                                            localStorage.setItem('calling', 'false');
                                        }
                                    },

                                    (err) => {
                                        console.log(err);
                                    });
                                this.navCtrl.pop();
                            }
                        } else {
                            if (typeof agoravoice !== 'undefined') {
                                agoravoice.videoCall(
                                    this.uname,
                                    JSON.parse(localStorage.getItem('user')).AccountName,
                                    (data) => {
                                        if (data === "close") {
                                            localStorage.setItem('calling', 'false');
                                        }
                                    },

                                    (err) => {
                                        console.log(err);
                                    });
                                this.navCtrl.pop();
                            }
                        }
                    }
                })
        }
    }
}
