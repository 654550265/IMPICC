import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ENV } from "../../config/environment";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { Http } from "@angular/http";

@IonicPage()
@Component({
    selector: 'page-ntel',
    templateUrl: 'ntel.html',
})
export class NtelPage {
    text: string;
    tel: string;
    code: string;
    dis: boolean;
    FCode: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public comm: CommonServiceProvider, public http: Http) {
        this.text = '获取验证码';
    }

    getCode() {
        let reg = /1[0-9]{10}/;
        if (this.tel == undefined) {
            this.comm.toast('请输入您的手机号码')
        } else if (!reg.test(this.tel)) {
            this.comm.toast('请输入正确的手机号码')
        } else {
            this.http.get(`${ENV.WEB_URL}SendNoteValidate?tel=${this.tel}`)
                .subscribe(data => {
                    let res = JSON.parse(data['_body']);
                    if (res.Status) {
                        let time = 60;
                        this.FCode = res.Data;
                        let t;
                        t = setInterval(() => {
                            if (time > 0) {
                                this.dis = true;
                                time--;
                                this.text = `${time}秒`;
                            } else {
                                clearInterval(t);
                                this.dis = false;
                                this.FCode = undefined;
                                time = 60;
                                this.text = `重新获取`;
                            }
                        }, 1000);
                    } else {
                        this.comm.toast(res.Message);
                    }
                });
        }
    }

    userRegister() {
        if (this.code == undefined) {
            this.comm.toast('请输入您的验证码');
        } else if (this.FCode != this.code) {
            this.comm.toast('请输入正确的验证码');
        } else {
            this.http.get(`${ENV.WEB_URL}UpdateFarmerTel?oldtel=${JSON.parse(localStorage.getItem('user')).Tel}&newtel=${this.tel}`)
                .subscribe(data => {
                    let res = JSON.parse(data['_body']);
                    if (res.Status) {
                        let oldTel = JSON.parse(localStorage.getItem('user'));
                        oldTel.Tel = this.tel;
                        localStorage.setItem('user', JSON.stringify(oldTel));
                        this.comm.toast('修改成功');
                        this.navCtrl.pop();
                    }
                });
        }
    }
}
