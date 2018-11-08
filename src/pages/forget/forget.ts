import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { Http } from "@angular/http";
import { ENV } from "../../config/environment";

@IonicPage()
@Component({
    selector: 'page-forget',
    templateUrl: 'forget.html',
})
export class ForgetPage {
    tel: string;
    ID: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public commonService: CommonServiceProvider, public http: Http, public loadingCtrl: LoadingController) {
    }

    next() {
        if (this.tel == undefined || this.tel == '') {
            this.commonService.toast('请输入您的手机号码');
        } else if (this.ID == undefined || this.ID == '') {
            this.commonService.toast('请输入您的身份证号');
        } else {
            let loader = this.loadingCtrl.create({
                content: "请稍候...",
                duration: 3000
            });
            loader.present();
            this.http.get(`${ENV.OTHER_API}FindPwd?uname=${this.tel}&idnumber=${this.ID}`)
                .subscribe(data => {
                    let res = JSON.parse(data['_body']);
                    if (res.Status) {
                        loader.dismiss();
                        this.navCtrl.push('ForgetSuccessPage', {
                            tel: this.tel
                        });
                    } else {
                        loader.dismiss();
                        this.commonService.toast(res.Message);
                    }
                });
        }

    }
}
