import { Component } from '@angular/core';
import {
    ActionSheetController,
    AlertController,
    LoadingController,
    NavController,
    NavParams,
    IonicPage
} from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransferObject, FileTransfer, FileUploadOptions } from "@ionic-native/file-transfer";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { ENV } from "../../config/environment";

@IonicPage()
@Component({
    selector: 'page-fang-yi-zheng',
    templateUrl: 'fang-yi-zheng.html',
})
export class FangYiZhengPage {
    isfangyi: boolean;
    isshouyi: boolean;
    fangyis: string;
    shouyis: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController, private camera: Camera, private transfer: FileTransfer, public comm: CommonServiceProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
        this.isfangyi = false;
        this.isshouyi = false;
    }

    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    fangyi() {
        this.camera.getPicture(this.options)
            .then((data) => {
                this.fangyis = data;
                this.isfangyi = true;
            }, (err) => {
                console.log(err)
            });
    }

    shouyi() {
        this.camera.getPicture(this.options)
            .then((data) => {
                this.shouyis = data;
                this.isshouyi = true;
            }, (err) => {
                console.log(err)
            });
    }

    fileTransfer: FileTransferObject = this.transfer.create();

    presentActionSheet() {
        if (!this.isshouyi) {
            this.comm.toast('兽医资格证未拍照');
        } else if (!this.isfangyi) {
            this.comm.toast('防疫资格证未拍照')
        } else {
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: '确定上传吗？',
                buttons: [
                    {
                        text: '取消',
                        handler: () => {
                        }
                    },
                    {
                        text: '确认',
                        handler: () => {
                            let loader = this.loadingCtrl.create({
                                content: "上传中...",
                                duration: 3000
                            });
                            loader.present();
                            let options: FileUploadOptions = {
                                fileKey: 'file',
                                fileName: 'name.jpg',
                                headers: {}
                            };
                            this.fileTransfer.upload(`${this.fangyis}`, `${ENV.WEB_URL}UploadCredentialmg?idnumber=${JSON.parse(localStorage.getItem('user')).Idnumber}&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&imgType=1&dataType=1`, options)
                                .then(res => {
                                    if (JSON.parse(res.response).Status) {
                                        this.fileTransfer.upload(`${this.shouyis}`, `${ENV.WEB_URL}UploadCredentialmg?idnumber=${JSON.parse(localStorage.getItem('user')).Idnumber}&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&imgType=2&dataType=1`, options)
                                            .then(res => {
                                                if (JSON.parse(res.response).Status) {
                                                    loader.dismiss();
                                                    this.comm.toast('上传成功');
                                                    this.navCtrl.pop();
                                                }
                                            }).catch(e => {
                                            console.log(e)
                                        });
                                    }
                                }).catch(e => {
                                console.log(e)
                            });
                        }
                    }
                ]
            });
            confirm.present();
        }
    }
}
