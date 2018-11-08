import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { GpsComponent } from "../../components/gps/gps";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@IonicPage()
@Component({
    selector: 'page-apply-bank',
    templateUrl: 'apply-bank.html',
})
export class ApplyBankPage {
    @ViewChild(GpsComponent) gps: GpsComponent;
    ID: string;
    isfangyi: boolean;
    fangyis: string;
    Bank: string;
    showBottom: boolean;
    animalArr: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public http: AuthServiceProvider, private transfer: FileTransfer, public comm: CommonServiceProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
        this.isfangyi = false;
        this.animalArr = JSON.parse(localStorage.getItem('AnimtalList'));
    }

    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    upBank() {
        this.camera.getPicture(this.options).then((imageData) => {
            this.fangyis = imageData;
            this.isfangyi = true;
        }, (err) => {
        });
    }

    fileTransfer: FileTransferObject = this.transfer.create();

    gotoApp() {
        if (this.ID == undefined) {
            this.comm.toast('请输入您的动物品种');
        } else if (this.Bank == undefined) {
            this.comm.toast('请输入您的动物数量');
        } else {
            let alert = this.alertCtrl.create({
                title: '提示',
                subTitle: '申请成功，请耐心等待。您的承保员的联系方式为189****1111',
                buttons: ['知道了']
            });
            alert.present();
        }
    }

    unamefocus() {
        this.showBottom = true;
    }

    unameBlur() {
        this.showBottom = false;
    }
}
