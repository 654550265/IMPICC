import { ApplicationRef, Component } from '@angular/core';
import {
    AlertController, IonicPage, LoadingController, ModalController, NavController,
    NavParams
} from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { ENV } from "../../config/environment";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-apply-insurance',
    templateUrl: 'apply-insurance.html',
})
export class ApplyInsurancePage {
    keyboar: boolean;
    ChengBaoObj: Object;
    AnimalList: Array<any>;
    YangList: Array<any>;
    NiuList: Array<any>;
    id: string;
    isPositive: boolean;
    isFont: boolean;
    isLeft: boolean;
    isRight: boolean;
    Positive: string;
    Font: string;
    Left: string;
    Right: string;
    isOtherPic: boolean;
    OtherPic: string;
    OtherPicLen: number;
    AnimalId: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public keyboard: Keyboard, public http: AuthServiceProvider, public comm: CommonServiceProvider, private camera: Camera, public modalCtrl: ModalController, private transfer: FileTransfer, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private bluetoothSerial: BluetoothSerial, public applicationRef: ApplicationRef, private photoViewer: PhotoViewer) {
        this.ChengBaoObj = {};
        this.id = navParams.get('id');
        this.init();
        http.get(`${ENV.WEB_URL}GetAnimalVariety`).subscribe(data => {
            if (data.Status) {
                this.YangList = data.MyObject;
                this.NiuList = data.AMyObject;
                this.AnimalList = this.YangList;
            }
        });
        this.keyboard.onKeyboardShow().subscribe(() => {
            this.keyboar = true;
        });
        this.keyboard.onKeyboardHide().subscribe(() => {
            this.keyboar = false;
        });
    }

    init() {
        this.isOtherPic = false;
        this.isPositive = false;
        this.isFont = false;
        this.isLeft = false;
        this.isRight = false;
    }

    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    photoA(index) {
        if (index == 1) {
            if (this.isPositive) {
                this.photoViewer.show(this.Positive);
            } else {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.isPositive = true;
                    this.Positive = imageData;
                }).catch(e => {
                    console.log(e)
                })
            }
        }
        if (index == 2) {
            if (this.isFont) {
                this.photoViewer.show(this.Font);
            } else {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.isFont = true;
                    this.Font = imageData;
                }).catch(e => {
                    console.log(e)
                })
            }
        }
        if (index == 3) {
            if (this.isLeft) {
                this.photoViewer.show(this.Left);
            } else {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.isLeft = true;
                    this.Left = imageData;
                }).catch(e => {
                    console.log(e)
                })
            }
        }
        if (index == 4) {
            if (this.isRight) {
                this.photoViewer.show(this.Right);
            } else {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.isRight = true;
                    this.Right = imageData;
                }).catch(e => {
                    console.log(e)
                })
            }
        }
    }

    backsss = (_params) => {
        return new Promise((resolve, reject) => {
            if (_params.length == 0) {
                this.isOtherPic = false;
            } else {
                this.isOtherPic = true;
                this.OtherPic = _params;
                this.OtherPicLen = _params.length;
            }
            resolve();
        });
    };

    goto() {
        this.navCtrl.push('SelectOfficerPage');
    }

    none(index) {
        switch (index) {
            case 1:
                this.isPositive = false;
                break;
            case 2:
                this.isFont = false;
                break;
            case 3:
                this.isLeft = false;
                break;
            case 4:
                this.isRight = false;
                break;
        }
    }

    OtherC() {
        let modal = this.modalCtrl.create('ModalAgePage', {
            callback: this.backsss,
            OtherPic: this.OtherPic == undefined ? [] : this.OtherPic
        });
        modal.present();
    }

    AnimalChange() {
        switch (this.ChengBaoObj['AnimalType']) {
            case "1":
                this.AnimalList = this.YangList;
                break;
            case "3":
                this.AnimalList = this.NiuList;
                break;
            default:
                this.AnimalList = this.YangList;
                break;
        }
    }

    blueTooth() {
        this.bluetoothSerial.list().then(res => {
            if (res.length == 0) {
                this.searchBlue();
            } else if (res.length == 1) {
                let alert = this.alertCtrl.create();
                alert.setTitle('设备列表');
                alert.addInput({
                    type: 'radio',
                    label: res[0].name,
                    value: res[0].address,
                    checked: true
                });
                alert.addButton('取消');
                alert.addButton({
                    text: '确定',
                    handler: data => {
                        let loader = this.loadingCtrl.create({
                            content: "连接中...",
                            duration: 50000
                        });
                        loader.present();
                        this.bluetoothSerial.connect(data).subscribe(respone => {
                            loader.dismiss();
                            this.comm.toast('连接成功');
                            this.intv = setInterval(() => {
                                this.bluetoothSerial.read().then(mess => {
                                    if (mess) {
                                        this.AnimalId = this.comm.rfidDecode(mess, null);
                                        this.applicationRef.tick();
                                    }
                                }).catch(e => {
                                    console.log(e)
                                });
                            }, 1000)
                        }, e => {
                            console.log(e)
                        });
                    }
                });
                alert.present();
            } else {
                let alert = this.alertCtrl.create();
                alert.setTitle('设备列表');

                alert.addInput({
                    type: 'radio',
                    label: res[0].name,
                    value: res[0].address,
                    checked: true
                });
                for (let i = 1; i < res.length; i++) {
                    alert.addInput({
                        type: 'radio',
                        label: res[i].name,
                        value: res[i].address
                    });
                }
                alert.addButton('取消');
                alert.addButton({
                    text: '确定',
                    handler: data => {
                        let loader = this.loadingCtrl.create({
                            content: "连接中...",
                            duration: 50000
                        });
                        loader.present();
                        this.bluetoothSerial.connect(data).subscribe(respone => {
                            this.intv = setInterval(() => {
                                this.bluetoothSerial.read().then(mess => {
                                    if (mess) {
                                        this.AnimalId = this.comm.rfidDecode(mess, null);
                                        this.applicationRef.tick();
                                    }
                                }).catch(e => {
                                    console.log(e)
                                });
                            }, 1000);
                        }, e => {
                            console.log(e)
                        });
                    }
                });
                alert.present();
            }
        }).catch(e => {
            console.log(e)
        });
    }

    intv: any;

    searchBlue() {
        let loader = this.loadingCtrl.create({
            content: "扫描中...",
            duration: 50000
        });
        loader.present();
        let boo = [];
        this.bluetoothSerial.discoverUnpaired().then(data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].name != undefined && data[i].name.indexOf('LF') > -1) {
                    boo.push(data[i]);
                }
            }
            if (boo.length == 0) {
                loader.dismiss();
                this.searchBlue();
            } else {
                let alert = this.alertCtrl.create();
                alert.setTitle('设备列表');
                if (boo.length == 1) {
                    alert.addInput({
                        type: 'radio',
                        label: boo[0].name,
                        value: boo[0].address,
                        checked: true
                    });
                    alert.addButton('取消');
                    alert.addButton({
                        text: '确定',
                        handler: data => {
                            this.bluetoothSerial.connect(data).subscribe(respone => {
                                this.comm.toast('连接成功');
                                loader.dismiss();
                                this.intv = setInterval(() => {
                                    this.bluetoothSerial.read().then(mess => {
                                        if (mess) {
                                            this.AnimalId = this.comm.rfidDecode(mess, null);
                                            this.applicationRef.tick();
                                        }
                                    }).catch(e => {
                                        console.log(e)
                                    });
                                }, 1000);
                            }, e => {
                                console.log(e)
                            });
                        }
                    });
                    alert.present();
                } else if (boo.length > 1) {
                    alert.addInput({
                        type: 'radio',
                        label: boo[0].name,
                        value: boo[0].address,
                        checked: true
                    });
                    for (let i = 1; i < boo.length; i++) {
                        alert.addInput({
                            type: 'radio',
                            label: boo[i].name,
                            value: boo[i].address
                        });
                    }
                    alert.addButton('取消');
                    alert.addButton({
                        text: '确定',
                        handler: data => {
                            this.bluetoothSerial.connect(data).subscribe(respone => {
                                this.comm.toast('连接成功');
                                loader.dismiss();
                                this.bluetoothSerial.isConnected().then(message => {
                                    this.intv = setInterval(() => {
                                        this.bluetoothSerial.read().then(mess => {
                                            if (mess) {
                                                this.AnimalId = this.comm.rfidDecode(mess, null);
                                                this.applicationRef.tick();
                                            }
                                        }).catch(e => {
                                            console.log(e)
                                        });
                                    }, 1000);
                                }).catch(e => {
                                    console.log(e)
                                });
                            }, e => {
                                console.log(e)
                            });
                        }
                    });
                    alert.present();
                }
            }
        }).catch(e => {
            console.log(e)
        });
    }

    saoyisao() {
        if (window['cordova']) {
            window['cordova'].plugins.barcodeScanner
                .scan((res) => {
                    if (res.text.length != 15) {
                        this.comm.toast('请扫描正确的条码');
                    } else {
                        this.AnimalId = res.text;
                    }
                }, (e) => {
                    console.log(e)
                });
        }
    }

    fileTransfer: FileTransferObject = this.transfer.create();

    tijiaoti() {
        if (this.ChengBaoObj['FramPeopleId'] == undefined) {
            this.comm.toast('请输入您的身份证号');
        } else if (this.ChengBaoObj['FramPeopleId'].length != 18) {
            this.comm.toast('您输入的身份证长度不正确');
        } else if (this.ChengBaoObj['AnimalId']) {
            this.comm.toast('请输入您的动物标签号');
        } else if (this.ChengBaoObj['AnimalType'] == undefined) {
            this.comm.toast('请选择动物的类型');
        } else if (this.ChengBaoObj['Varieties'] == undefined) {
            this.comm.toast('请选择动物种类');
        } else if (this.ChengBaoObj['AnimalAge'] == undefined) {
            this.comm.toast('请输入动物的畜龄');
        } else if (!this.isPositive) {
            this.comm.toast('请拍植入部位的照片');
        } else if (!this.isFont) {
            this.comm.toast('请拍动物正面的照片');
        } else if (!this.isLeft) {
            this.comm.toast('请拍动物左面的照片');
        } else if (!this.isRight) {
            this.comm.toast('请拍动物右面的照片');
        } else {
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: '请确认上传的信息准确无误!',
                buttons: [
                    {
                        text: '检查',
                        handler: () => {
                        }
                    },
                    {
                        text: '保存',
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
                            this.ChengBaoObj['uid'] = JSON.parse(localStorage.getItem('user')).AccountName;
                            this.ChengBaoObj['id'] = this.id;
                            this.http.post(`${ENV.WEB_URL}UpdateCbPinDataByFarmer`, {
                                pin: JSON.stringify(this.ChengBaoObj)
                            }).subscribe(res => {
                                if (res.Status) {
                                    this.fileTransfer.upload(`${this.Positive}`, `${ENV.WEB_URL}UploadCbPinImg?imgType=1&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&pin=${this.ChengBaoObj['AnimalId']}`, options)
                                        .then(res => {
                                            this.fileTransfer.upload(`${this.Font}`, `${ENV.WEB_URL}UploadCbPinImg?imgType=2&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&pin=${this.ChengBaoObj['AnimalId']}`, options)
                                                .then(res => {
                                                    this.fileTransfer.upload(`${this.Left}`, `${ENV.WEB_URL}UploadCbPinImg?imgType=3&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&pin=${this.ChengBaoObj['AnimalId']}`, options)
                                                        .then(res => {
                                                            this.fileTransfer.upload(`${this.Right}`, `${ENV.WEB_URL}UploadCbPinImg?imgType=4&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&pin=${this.ChengBaoObj['AnimalId']}`, options)
                                                                .then(res => {
                                                                    for (let i = 0; i < this.OtherPic.length; i++) {
                                                                        this.fileTransfer.upload(`${this.OtherPic[i]}`, `${ENV.WEB_URL}UploadCbPinImg?imgType=5&uname=${JSON.parse(localStorage.getItem('user')).AccountName}&pin=${this.ChengBaoObj['AnimalId']}`, options)
                                                                            .then(res => {
                                                                                this.init();
                                                                                this.ChengBaoObj['AnimalId'] = undefined;
                                                                                this.ChengBaoObj['AnimalAge'] = undefined;
                                                                                loader.dismiss();
                                                                                this.comm.toast('上传成功');
                                                                            }).catch(e => {
                                                                            console.log(e);
                                                                        })
                                                                    }
                                                                }).catch(e => {
                                                                console.log(e)
                                                            });
                                                        }).catch(e => {
                                                        console.log(e)
                                                    });
                                                }).catch(e => {
                                                console.log(e)
                                            });
                                        }).catch(e => {
                                        console.log(e)
                                    });
                                    this.comm.toast('申报成功');
                                } else {
                                    this.comm.toast(res.Message);
                                }
                            });
                        }
                    }
                ]
            });
            confirm.present();
        }
    }
}
