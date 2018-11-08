import { Component } from '@angular/core';
import { IonicApp, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@IonicPage()
@Component({
    selector: 'page-modal',
    templateUrl: 'modal.html',
})
export class ModalPage {
    callback: any;
    num: Array<any>;
    boo: boolean;
    Src: string;
    isOtherPic: boolean;
    modal: any;
    item: any;
    titlename: string;
    activePortal: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private photoViewer: PhotoViewer, public modalCtrl: ModalController, public ionicApp: IonicApp, public comm: CommonServiceProvider) {
        this.titlename = '其他图片';
    }

    ionViewDidLoad() {
        this.activePortal = this.ionicApp._modalPortal.getActive();
    }

    ionViewWillEnter() {
        this.callback = this.navParams.get('callback');
        this.num = this.navParams.get('OtherPic');
        this.isOtherPic = this.navParams.get('isOtherPic');
        this.item = this.navParams.get('index');
        if(this.navParams.get('name')){
            this.titlename = this.navParams.get('name');
        }
        if (this.isOtherPic && !this.isOtherPic) {
            this.num = [];
        }
        setTimeout(() => {
            this.activePortal.onDidDismiss(() => {
                this.callback(this.num, this.item);
            });
        }, 500);
    }

    back() {
        this.callback(this.num, this.item).then(() => {
            this.navCtrl.pop();
        });
    }

    takePhoto() {
        this.comm.chooseImage(1).then(res => {
            this.num.push(res);
        })
    }

    lookBig(index) {
        this.photoViewer.show(this.num[index]);
    }

    hide() {
        this.boo = false;
    }
    faa(ele){
        this.num.splice(ele,1);
    }
}
