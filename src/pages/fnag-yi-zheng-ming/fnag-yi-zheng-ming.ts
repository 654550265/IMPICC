import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";
import { ENV } from "../../config/environment";

@IonicPage()
@Component({
    selector: 'page-fnag-yi-zheng-ming',
    templateUrl: 'fnag-yi-zheng-ming.html',
})
export class FnagYiZhengMingPage {
    ID: string;
    isfangyi: boolean;
    isshouyi: boolean;
    fangyis: string;
    shouyis: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public comm: CommonServiceProvider, private camera: Camera, private transfer: FileTransfer, public loadingCtrl: LoadingController) {
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
            let loader = this.loadingCtrl.create({
                content: "上传中...",
                duration: 50000
            });
            loader.present();
            let options: FileUploadOptions = {
                fileKey: 'file',
                fileName: 'name.jpg',
                headers: {}
            };
            this.fileTransfer.upload(`${this.fangyis}`, `${ENV.WEB_URL}UploadCredentialmg?idnumber=${this.ID}&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&imgType=1&dataType=1`, options)
                .then(res => {
                    if (JSON.parse(res.response).Status) {
                        this.fileTransfer.upload(`${this.shouyis}`, `${ENV.WEB_URL}UploadCredentialmg?idnumber=${this.ID}&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&imgType=2&dataType=1`, options)
                            .then(res => {
                                if (JSON.parse(res.response).Status) {
                                    this.comm.toast('上传成功');
                                    loader.dismiss();
                                } else {
                                    this.comm.toast(JSON.parse(res.response).Message);
                                    loader.dismiss();
                                }
                            }).catch(e => {
                            console.log(e)
                        });
                    } else {
                        this.comm.toast(JSON.parse(res.response).Message);
                        loader.dismiss();
                    }
                }).catch(e => {
                console.log(e)
            });

        }
    }
}
