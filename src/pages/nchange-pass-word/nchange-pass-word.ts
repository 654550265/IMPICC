import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ENV } from "../../config/environment";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@IonicPage()
@Component({
    selector: 'page-nchange-pass-word',
    templateUrl: 'nchange-pass-word.html',
})
export class NchangePassWordPage {
    OldPwd: string;
    NewPwd: string;
    SurePwd: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public comm: CommonServiceProvider) {
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
            this.http.get(`${ENV.WEB_URL}UpdatePwd?uname=${JSON.parse(localStorage.getItem('user')).AccountName}&oldpwd=${this.OldPwd}&newpwd=${this.NewPwd}`).subscribe(res => {
                if (res.Status) {
                    this.comm.toast('修改成功');
                    this.navCtrl.pop();
                }
            })
        }
    }
}
