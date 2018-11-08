import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { ENV } from "../../config/environment";

@IonicPage()
@Component({
    selector: 'page-bao-change-pass-word',
    templateUrl: 'bao-change-pass-word.html',
})
export class BaoChangePassWordPage {
    OldPwd: string;
    NewPwd: string;
    SurePwd: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public comm: CommonServiceProvider, public loadingCtrl: LoadingController) {
    }

    SurePwdChange() {
        if (this.OldPwd == undefined) {
            this.comm.toast('请输入您的旧密码');
        } else if (this.NewPwd == undefined) {
            this.comm.toast('请输入您的新密码');
        } else if (this.NewPwd.length < 6) {
            this.comm.toast('密码长度必须大于6位');
        } else if (this.NewPwd.length > 32) {
            this.comm.toast('密码长度必须小于32位');
        } else if (this.NewPwd != this.SurePwd) {
            this.comm.toast('两次密码输入不一致，请重新输入');
        } else {
            let loader = this.loadingCtrl.create({
                content: "",
                duration: 3000
            });
            loader.present();
            this.http.get(`${ENV.WEB_URL}UpdatePwd?uname=${JSON.parse(localStorage.getItem('user')).AccountName}&oldpwd=${this.OldPwd}&newpwd=${this.NewPwd}`).subscribe(res => {
                if (res.Status) {
                    loader.dismiss();
                    this.comm.toast('修改成功');
                    this.navCtrl.pop();
                }
            })
        }
    }
}

