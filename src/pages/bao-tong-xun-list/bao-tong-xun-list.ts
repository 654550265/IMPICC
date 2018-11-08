import { Component } from '@angular/core';
import {
    ActionSheetController, IonicPage, LoadingController, ModalController, NavController,
    NavParams
} from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@IonicPage()
@Component({
    selector: 'page-bao-tong-xun-list',
    templateUrl: 'bao-tong-xun-list.html',
})
export class BaoTongXunListPage {
    list: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public loadingCtrl: LoadingController,public modalCtrl:ModalController,public actionSheetCtrl: ActionSheetController,public comm:CommonServiceProvider) {
        let loader = this.loadingCtrl.create({
            content: "",
            duration: 3000
        });
        loader.present();
        http.get(`${ENV.WEB_URL}GetPersonByHandleperson?uname=${JSON.parse(localStorage.getItem('user')).AccountName}`).subscribe(res => {
            if (res.Status) {
                this.list = res.MyObject;
                loader.dismiss();
            }
        })
    }
    gotomod(index){
        const actionSheet = this.actionSheetCtrl.create({
            title: '通话类型',
            buttons: [
                {
                    text: '视频通话',
                    handler: () => {
                        this.comm.model = this.modalCtrl.create('VideoPage', {
                            type: 'video',
                            name: this.list[index]['Name'],
                            text: this.list[index]['Text']
                        });
                        this.comm.model.present();
                    }
                },
                {
                    text: '语音通话',
                    handler: () => {
                        this.comm.model = this.modalCtrl.create('VideoPage', {
                            type: 'voice',
                            name: this.list[index]['Name'],
                            text: this.list[index]['Text']
                        });
                        this.comm.model.present();
                    }
                },
                {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                    }
                }
            ]
        });
        actionSheet.present();
    }
}
