import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { FileTransferObject, FileTransfer, FileUploadOptions } from "@ionic-native/file-transfer";
import { ENV } from "../../config/environment";
import { Camera, CameraOptions } from "@ionic-native/camera";

@IonicPage()
@Component({
    selector: 'page-is-pass-change',
    templateUrl: 'is-pass-change.html',
})
export class IsPassChangePage {

    id: string;
    FramMessage: any;
    FramChenMessage: Array<any>;
    Chengbaoyuan: string;
    Time: string;
    auditStaus: number;
    E: any;
    fileTransfer: FileTransferObject = this.transfer.create();
    showBottom: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public loadingCtrl: LoadingController, private camera: Camera, private transfer: FileTransfer, public alertCtrl: AlertController) {
        let loader = this.loadingCtrl.create({
            content: "加载中...",
            duration: 3000
        });
        loader.present();
        this.id = this.navParams.get('id');
        this.auditStaus = this.navParams.get('auditStaus');
        this.E = ENV.IMG_URL;
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.http.get(`${ENV.WEB_URL}GetAuditRecordDetail?id=${this.id}&auditStatus=${this.auditStaus}`)
            .subscribe(res => {
                if (res.Status) {
                    let n = [];
                    this.Time = (res.MyObject.CreateTime).split(' ')[0];
                    n.push(res.MyObject);
                    this.FramMessage = n;
                    this.FramChenMessage = res.MyObject.pins;
                    loader.dismiss();
                }
            })
    }

    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    photo(index, imgType, mess) {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '拍照成功之后直接上传服务器，确定要修改这张照片吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        let options: FileUploadOptions = {
                            fileKey: 'file',
                            fileName: 'name.jpg',
                            headers: {}
                        };
                        let id = this.FramMessage[index][mess].Id;
                        this.camera.getPicture(this.options).then((imageData) => {
                            this.FramMessage[index][mess]['ImgUrl'] = imageData;
                            this.fileTransfer.upload(`${imageData}`, `${ENV.WEB_URL}UpdateCbFarmerImg?id=${id}&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&imgType=${imgType}`, options)
                                .then(res => {
                                }).catch(e => {
                                console.log(e)
                            });
                        }, (err) => {
                        });
                    }
                }
            ]
        });
        confirm.present();
    }

    NoPassPhoto(index, imgType, mess) {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '拍照成功之后直接上传服务器，确定要修改这张照片吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        let options: FileUploadOptions = {
                            fileKey: 'file',
                            fileName: 'name.jpg',
                            headers: {}
                        };
                        let id = this.FramChenMessage[index][mess].Id;
                        let pid = this.FramChenMessage[index].Id;
                        this.camera.getPicture(this.options).then((imageData) => {
                            this.FramChenMessage[index][mess]['ImgUrl'] = imageData;
                            this.fileTransfer.upload(`${imageData}`, `${ENV.WEB_URL}UpdateCbPinImg?pinId=${pid}&id=${id}&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&imgType=${imgType}`, options)
                                .then(res => {
                                }).catch(e => {
                                console.log(e)
                            });
                        }, (err) => {
                            console.log(err);
                        });
                    }
                }
            ]
        });
        confirm.present();
    }

    NoPasssaveBtnSave() {
        this.FramMessage[0].id = this.id;
        this.http.post(`${ENV.WEB_URL}UpdateCbData`, {
            farmer: JSON.stringify(this.FramMessage[0]),
            pin: JSON.stringify(this.FramChenMessage)
        }).subscribe(res => {
        });
    }

    unameBlur() {
        this.showBottom = false;
    }

    unamefocus() {
        this.showBottom = true;
    }

}
