import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@IonicPage()
@Component({
    selector: 'page-li-pei-no-pass-change',
    templateUrl: 'li-pei-no-pass-change.html',
})
export class LiPeiNoPassChangePage {
    FramMessage: Array<any>;
    Chengbaoyuan: string;
    src: string;
    showBottom: boolean;
    dieList: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private photoViewer: PhotoViewer, public alertCtrl: AlertController, public sqlite: SqllistServiceProvider, public comm: CommonServiceProvider) {
        let n = [];
        this.src = 'assets/icon/pic-updata_03.png';
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        n.push(navParams.get('message'));
        this.FramMessage = n;
        this.FramMessage[0]['form'] = {};
        let list = [];
        let dieMess = JSON.parse(localStorage.getItem('dieMessage'));
        for (let i = 0; i < dieMess.length; i++) {
            if (typeof dieMess[i].items == "object") {
                for (let j = 0; j < dieMess[i].items.length; j++) {
                    list.push(dieMess[i].items[j]);
                }
            }
        }
        this.dieList = list;

    }

    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    photo11(item) {
        if (this.FramMessage[item].name.idfrontUrl == this.src) {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramMessage[item].name.idfrontUrl = imageData;
                this.FramMessage[item].form.idfrontUrl = imageData;
            }, (err) => {
                // Handle error
            });
        } else {
            this.photoViewer.show(this.FramMessage[item].name.idfrontUrl);
        }
    }

    photo22(item) {
        if (this.FramMessage[item].name.idbackUrl == this.src) {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramMessage[item].name.idbackUrl = imageData;
                this.FramMessage[item].form.idbackUrl = imageData;
            }, (err) => {
                // Handle error
            });
        } else {
            this.photoViewer.show(this.FramMessage[item].name.idbackUrl);
        }
    }

    photo33(item) {
        if (this.FramMessage[item].name.bankUrl == this.src) {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramMessage[item].name.bankUrl = imageData;
                this.FramMessage[item].form.bankUrl = imageData;
            }, (err) => {
                // Handle error
            });
        } else {
            this.photoViewer.show(this.FramMessage[item].name.bankUrl);
        }
    }

    photo44(item) {
        if (this.FramMessage[item].name.localUrl == this.src) {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramMessage[item].name.localUrl = imageData;
                this.FramMessage[item].form.localUrl = imageData;
            }, (err) => {
                // Handle error
            });
        } else {
            this.photoViewer.show(this.FramMessage[item].name.localUrl);
        }
    }

    photo55(item) {
        if (this.FramMessage[item].name.disposealUrl == this.src) {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramMessage[item].name.disposealUrl = imageData;
                this.FramMessage[item].form.disposealUrl = imageData;
            }, (err) => {
                // Handle error
            });
        } else {
            this.photoViewer.show(this.FramMessage[item].name.disposealUrl);
        }
    }

    photo66(item) {
        if (this.FramMessage[item].name.deathUrl == this.src) {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramMessage[item].name.deathUrl = imageData;
                this.FramMessage[item].form.deathUrl = imageData;
            }, (err) => {
                // Handle error
            });
        } else {
            this.photoViewer.show(this.FramMessage[item].name.deathUrl);
        }
    }

    changpics(index, item) {
        switch (index) {
            case 1:
                this.FramMessage[item].name.idfrontUrl = this.src;
                break;
            case 2:
                this.FramMessage[item].name.idbackUrl = this.src;
                break;
            case 3:
                this.FramMessage[item].name.bankUrl = this.src;
                break;
            case 4:
                this.FramMessage[item].name.localUrl = this.src;
                break;
            case 5:
                this.FramMessage[item].name.disposealUrl = this.src;
                break;
            case 6:
                this.FramMessage[item].name.deathUrl = this.src;
                break;
        }
    }

    NoPasssaveBtnSaveLocss() {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '确定修改吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        this.sqlite.updateFarmMessages('FramLiPeiNoPass', this.FramMessage[0].name, this.FramMessage[0].form).then(res => {
                            this.comm.toast('修改成功');
                            this.navCtrl.pop();
                        }).catch(e => {
                            console.log(e)
                        });
                    }
                }
            ]
        });
        confirm.present();
    }

    unameBlur() {
        this.showBottom = false;
    }

    unamefocus() {
        this.showBottom = true;
    }
}
