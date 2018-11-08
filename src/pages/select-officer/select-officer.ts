import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, IonicPage, ModalController, NavController, NavParams, Slides } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { CommonServiceProvider } from "../../providers/common-service/common-service";


@IonicPage()
@Component({
    selector: 'page-select-officer',
    templateUrl: 'select-officer.html',
})
export class SelectOfficerPage {
    @ViewChild(Slides) slides: Slides;
    arr: Array<string>;
    page: number;
    list: Array<any>;
    lipei: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public http: AuthServiceProvider, public actionSheetCtrl: ActionSheetController,public comm:CommonServiceProvider) {

        this.http.get(`${ENV.WEB_URL}GetLpPerson?uname=${JSON.parse(localStorage.getItem('user')).AccountName}`).subscribe(res => {
            if (res.Status) {
                this.arr = res.MyObject;
            }
        });
        this.http.get(`${ENV.WEB_URL}GetCbPerson?uname=${JSON.parse(localStorage.getItem('user')).AccountName}`)
            .subscribe(res => {
                if (res.Status) {
                    this.lipei = res.MyObject;
                }
            });
        this.page = 1;
        this.list = [
            {id: 0, name: '理赔员', acv: true, auditStaus: 2},
            {id: 1, name: '承保员', acv: false, auditStaus: 0}
        ];
    }

    ionViewDidLoad() {
        this.slides.lockSwipes(true);
    }

    slide(index) {
        this.page = 1;
        this.slides.lockSwipes(false);
        this.list.map((item) => {
            item['acv'] = false;
            return item;
        });
        index.acv = true;
        this.slides.slideTo(index.id);
        this.slides.lockSwipes(true);
    }

    gotoVideo(index) {
        const actionSheet = this.actionSheetCtrl.create({
            title: '通话类型',
            buttons: [
                {
                    text: '视频通话',
                    handler: () => {
                        this.comm.model = this.modalCtrl.create('VideoPage', {
                            type: 'video',
                            name: this.arr[index]['Name'],
                            text: this.arr[index]['Text']
                        });
                        this.comm.model.present();
                    }
                },
                {
                    text: '语音通话',
                    handler: () => {
                        this.comm.model = this.modalCtrl.create('VideoPage', {
                            type: 'voice',
                            name: this.arr[index]['Name'],
                            text: this.arr[index]['Text']
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

    gotoVideos(index) {
        const actionSheet = this.actionSheetCtrl.create({
            title: '通话类型',
            buttons: [
                {
                    text: '视频通话',
                    handler: () => {
                        this.comm.model = this.modalCtrl.create('VideoPage', {
                            type: 'video',
                            name: this.lipei[index]['Name'],
                            text: this.lipei[index]['Text']
                        });
                        this.comm.model.present();
                    }
                },
                {
                    text: '语音通话',
                    handler: () => {
                        this.comm.model = this.modalCtrl.create('VideoPage', {
                            type: 'voice',
                            name: this.lipei[index]['Name'],
                            text: this.lipei[index]['Text']
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
