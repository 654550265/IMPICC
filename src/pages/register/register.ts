import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { ENV } from "../../config/environment";
import { Http } from "@angular/http";
import { LoginPage } from "../login/login";

@IonicPage()
@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
})
export class RegisterPage {
    tel:string;
    text:string;
    dis:boolean;
    code:string;
    userPwd:string;
    constructor(public navCtrl: NavController, public navParams: NavParams,public commonService: CommonServiceProvider,public http:Http,public loadingCtrl:LoadingController) {
        this.text='获取短信验证码';
    }
    ionViewDidLoad() {}
    getCode(tel:string){
        let loader = this.loadingCtrl.create({
            content: "",
        });
        loader.present();
        let reg=/1[0-9]{10}/;
        if(this.tel==undefined){
            this.commonService.toast('请输入您的手机号码');
        }else if(!reg.test(this.tel)){
            this.commonService.toast('请输入正确的手机号码');
        }else{
            this.http.get(`${ENV.OTHER_API}SendNoteValidate?tel=${this.tel}`)
                .subscribe(data=>{
                    let res=JSON.parse(data['_body']);
                    if(res.Status){
                        loader.dismiss();
                        let time=60;
                        let t;
                        t=setInterval(()=>{
                            if(time>0){
                                this.dis=true;
                                time--;
                                this.text=`${time}秒`;
                            }else{
                                clearInterval(t);
                                this.dis=false;
                                time=60;
                                this.text=`重新获取`;
                            }
                        },1000);

                    }else{
                        this.commonService.toast(res.Message);
                    }
                });
        }
    }
    userRegister(){
        if(this.code==undefined){
            this.commonService.toast('请输入您的验证码');
        }else if(this.userPwd==undefined){
            this.commonService.toast('请输入您密码');
        }else if(this.code==undefined){
            this.commonService.toast('请输入您的验证码');
        }else if(this.userPwd.length<6){
            this.commonService.toast('密码必须大于六位');
        }else if(this.userPwd.length>32){
            this.commonService.toast('密码必须小于32位');
        }else{
            this.http.get(`${ENV.OTHER_API}Register?uname=${this.tel}&pwd=${this.userPwd}&noteCode=${this.code}`)
                .subscribe(data=>{
                    let res=JSON.parse(data['_body']);
                    if(res.Status){
                        let loading = this.loadingCtrl.create({
                            content: ''
                        });
                        loading.present();
                        setTimeout(()=>{
                            loading.dismiss();
                            this.commonService.toast('注册成功');
                            this.navCtrl.setRoot(LoginPage);
                        },1000);
                    }else{
                        this.commonService.toast(res.Message);
                    }
                });
        }
    }
}
