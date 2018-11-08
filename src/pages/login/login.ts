import { Component, ViewChild } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { Storage } from "@ionic/storage";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { HomePage } from "../home/home";
import { TabsPage } from "../tabs/tabs";

declare let baidu_location: any;

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    name: string;
    pwd: string;
    showBottom: boolean;
    lat: number;
    long: number;

    constructor(public navCtrl: NavController, public navParams: NavParams, private http: AuthServiceProvider, public commonService: CommonServiceProvider, public storage: Storage, public loadingCtrl: LoadingController) {
        this.getCurrentPosition().then(res => {
            this.lat = res.latitude;
            this.long = res.longitude;
        }).catch(err => {
            console.log(err);
        });
    }

    ionViewDidLoad() {
    }

    getCurrentPosition(): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            function successCallback(position) {
                resolve(position);
            }

            function failedCallback(error) {
                reject(error.describe);
            }

            baidu_location.getCurrentPosition(successCallback, failedCallback);
        });
        return promise;
    }

    login() {
        if (this.name == undefined) {
            this.commonService.toast("请输入手机号");
        } else if (this.pwd == undefined) {
            this.commonService.toast("请输入密码");
        } else if (this.pwd.length < 6) {
            this.commonService.toast("密码长度小于6位");
        } else if (this.pwd.length > 32) {
            this.commonService.toast("密码长度大于32位");
        } else {
            let loading = this.loadingCtrl.create({
                content: ''
            });
            loading.present();

            this.http.post(`${ENV.OTHER_API}Login`, {
                uname: this.name,
                pwd: this.pwd,
                gps: this.lat + ',' + this.long
            }).subscribe(res => {
                if (res.Status) {
                    let li = [{Id: 1, Name: '散养'}, {Id: 2, Name: '规模化养殖'}];
                    localStorage.setItem('BreedType', JSON.stringify(li));
                    localStorage.setItem('pwd', this.pwd);
                    this.http.get(`${ENV.OTHER_API}GetBaseData?county=${res.MyObject.County}&companyCode=${res.MyObject.CompanyCode}`).subscribe(res => {
                        if (res.Status) {
                            localStorage.setItem('GetAreaTree', JSON.stringify(res.Data.area));
                            localStorage.setItem('arbitral', JSON.stringify(res.Data.arbitral));
                            localStorage.setItem('dieMessage', JSON.stringify(res.Data.death));
                            localStorage.setItem('xzlist', JSON.stringify(res.Data.project));
                            localStorage.setItem('varitey', JSON.stringify(res.Data.varitey));
                            ENV.GETAREATREE = res.Data.area;
                            ENV.ARBITRAL = res.Data.arbitral;
                            ENV.DIEMESSAGE = res.Data.death;
                            ENV.XZLIST = res.Data.project;
                            ENV.VARITEY = res.Data.varitey;
                        }
                    }, mess => {
                        console.log(mess);
                    });
                    res.MyObject.RealName = this.changName(res.MyObject.RealName);
                    localStorage.setItem('user', JSON.stringify(res.MyObject));
                    localStorage.setItem('jurisdiction', JSON.stringify(res.Data));
                    if (res.MyObject.UserType == 5 || res.MyObject.UserType == 6) {
                        setTimeout(() => {
                            loading.dismiss();
                            this.commonService.toast('登录成功');
                            this.navCtrl.setRoot(HomePage);
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            loading.dismiss();
                            this.commonService.toast('登录成功');
                            this.navCtrl.setRoot(TabsPage);
                        }, 1000);
                    }
                    if (window['cordova']) {
                        this.commonService.initPush();
                        let s = setInterval(() => {
                            if (localStorage.getItem('regID')) {
                                clearInterval(s);
                                this.http.get(`${ENV.OTHER_API}UploadPushData?uname=${this.name}&deviceId=${this.commonService.getRegID()}&platform=${window['device']['platform']}&systemId=${window['device']['version']}&version=${window['VERSION']}`).subscribe(ress => {
                                });
                            }
                        }, 1000);
                    }
                    this.commonService.modifyPwd(res.MyObject.LastModifyPwdTime);
                } else {
                    loading.dismiss();
                    this.commonService.toast(res.Message);
                }
            });
        }
    }

    changName(name) {
        let names = "";
        if (name.length >= 7) {
            for (let i = 0; i < 6; i++) {
                names += name[i]
            }
            names += "...";
            return names;
        } else {
            return name
        }

    }

    gotoRegister() {
        this.navCtrl.push('ChoosePage');
    }

    unamefocus() {
        this.showBottom = true;
    }

    gotoForget() {
        this.navCtrl.push('ForgetPage');
    }

    unameBlur() {
        this.showBottom = false;
    }
}
