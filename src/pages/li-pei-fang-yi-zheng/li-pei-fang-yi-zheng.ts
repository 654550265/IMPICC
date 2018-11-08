import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { ENV } from "../../config/environment";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";

@IonicPage()
@Component({
    selector: 'page-li-pei-fang-yi-zheng',
    templateUrl: 'li-pei-fang-yi-zheng.html',
})
export class LiPeiFangYiZhengPage {
    ID: string;
    isfangyi: boolean;
    isshouyi: boolean;
    fangyis: string;
    shouyis: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public comm: CommonServiceProvider, private camera: Camera, private transfer: FileTransfer, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
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
        if (this.ID == undefined) {
            this.comm.toast('请输入您的身份证号码')
        } else if (this.ID.length != 18) {
            this.comm.toast('身份证长度不正确');
        } else if (!this.isfangyi) {
            this.comm.toast('请上传防疫相关的照片');
        } else if (!this.isshouyi) {
            this.comm.toast('请上传兽医相关的照片');
        } else {
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: '确认上传吗？',
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
                            this.fileTransfer.upload(`${this.fangyis}`, `${ENV.WEB_URL}UploadCredentialmg?idnumber=${this.ID}&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&imgType=1&dataType=2`, options)
                                .then(res => {
                                    if (JSON.parse(res.response).Status) {
                                        this.fileTransfer.upload(`${this.shouyis}`, `${ENV.WEB_URL}UploadCredentialmg?idnumber=${this.ID}&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&imgType=2&dataType=2`, options)
                                            .then(res => {
                                                if (JSON.parse(res.response).Status) {
                                                    this.comm.toast('上传成功');
                                                    loader.dismiss();
                                                }
                                            }).catch(e => {
                                            console.log(e)
                                        });
                                    }else {
                                        loader.dismiss();
                                        this.comm.toast(JSON.parse(res.response).Message);
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
