import { ApplicationRef, Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { GpsComponent } from "../../components/gps/gps";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";

@IonicPage()
@Component({
    selector: 'page-claim-settlement',
    templateUrl: 'claim-settlement.html',
})
export class ClaimSettlementPage {
    @ViewChild(GpsComponent) gps: GpsComponent;
    keyboar: boolean;
    list: Object;
    item: Array<any>;
    isSence: boolean;
    isHarmless: boolean;
    isDie: boolean;
    isBank: boolean;
    Scene: string;
    Harmless: string;
    Bank: string;
    Die: string;
    ClaimAdjuster: string;
    ClaimAdjusterList: Array<any>;
    AnimalId: string;
    DieTypeList: Array<any>;
    dieType: string;
    AnimtalTypes: string;
    DieMessage: string;
    AnimtalList: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public keyboard: Keyboard, public http: AuthServiceProvider, public comm: CommonServiceProvider, private camera: Camera, public loadingCtrl: LoadingController, private transfer: FileTransfer, public alertCtrl: AlertController, private photoViewer: PhotoViewer, private bluetoothSerial: BluetoothSerial, public applicationRef: ApplicationRef) {
        this.list = {};
        this.isSence = false;
        this.isHarmless = false;
        this.isDie = false;
        this.isBank = false;
        this.keyboard.onKeyboardShow().subscribe(() => {
            this.keyboar = true;
        });
        this.keyboard.onKeyboardHide().subscribe(() => {
            this.keyboar = false;
        });
        this.item = JSON.parse(localStorage.getItem('dieMessage'));
        this.DieTypeList = JSON.parse(localStorage.getItem('dieMessage'));
        this.dieType = "61294583270739968";
        this.AnimtalTypes = "3";
        this.DieMessage = '1';
        this.AnimtalList = JSON.parse(localStorage.getItem('AnimtalList'));
        this.AnimtalTypes = "3";
        this.http.get(`${ENV.WEB_URL}GetLpPerson?uname=${JSON.parse(localStorage.getItem('user')).AccountName}`)
            .subscribe(res => {
                if (res.Status) {
                    if (res.MyObject.length == 0) {
                        this.comm.toast('你还没有所属的理赔员，请联系管理员');
                    }else{
                        this.ClaimAdjusterList = res.MyObject;
                    }
                }
            });
        this.list['FramPeopleId'] = JSON.parse(localStorage.getItem('user')).Idnumber;
        this.in();
    }

    in() {
        for (let i = 0; i < this.DieTypeList.length; i++) {
            if (this.DieTypeList[i].id == this.dieType) {
                for (let j = 0; j < this.DieTypeList[i].items.length; j++) {
                    if (this.DieTypeList[i].items[j].animal_type == this.AnimtalTypes) {
                        this.item.push(this.DieTypeList[i].items[j]);
                        if (this.item.length == 0) {
                            this.comm.toast('该动物的类型暂无疾病示例，请联系管理员添加');
                        }
                    }
                }
            } else {
                if (this.item.length == 0) {
                    this.comm.toast('该动物的类型暂无疾病示例，请联系管理员添加');
                    break;
                }
            }
        }
    }

    dieTypeChange() {
        this.item = [];
        this.DieMessage = undefined;
        if (this.dieType != "61294583270739968") {
            for (let i = 0; i < this.DieTypeList.length; i++) {
                if (this.DieTypeList[i].id == this.dieType) {
                    this.item = this.DieTypeList[i].items;
                    break;
                }
            }
        } else {
            this.in();
        }
    }

    AnimalTypeChange() {
        if (this.dieType == "61294583270739968") {
            this.DieMessage = undefined;
            this.item = [];
            this.in();
        }
    }

    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    Bscene(index) {
        if (index == 6) {
            if (this.isSence) {
                this.photoViewer.show(this.Scene);
            } else {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.isSence = true;
                    this.Scene = imageData;
                }).catch(e => {
                    console.log(e)
                });
            }
        }
        if (index == 7) {
            if (this.isHarmless) {
                this.photoViewer.show(this.Harmless);
            } else {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.isHarmless = true;
                    this.Harmless = imageData;
                }).catch(e => {
                    console.log(e)
                });
            }
        }
        if (index == 8) {
            if (this.isDie) {
                this.photoViewer.show(this.Die);
            } else {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.isDie = true;
                    this.Die = imageData;
                }).catch(e => {
                    console.log(e)
                });
            }
        }
        if (index == 4) {
            if (this.isBank) {
                this.photoViewer.show(this.Bank);
            } else {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.isBank = true;
                    this.Bank = imageData;
                }).catch(e => {
                    console.log(e)
                });
            }
        }
    }

    none(index) {
        switch (index) {
            case 6:
                this.isSence = false;
                break;
            case 7:
                this.isHarmless = false;
                break;
            case 8:
                this.isDie = false;
                break;
            case 4:
                this.isBank = false;
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
                                        this.list['AnimalId'] = this.comm.rfidDecode(mess, null);
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

    goto() {
        this.navCtrl.push('SelectOfficerPage');
    }

    newGuid(): string {
        let guid = "";
        for (let i = 1; i <= 32; i++) {
            let n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }

    fileTransfer: FileTransferObject = this.transfer.create();

    savess() {
        if (this.list['FramPeopleId'] == undefined) {
            this.comm.toast('请输入您的身份证号码');
        } else if (this.list['FramPeopleId'].length != 18) {
            this.comm.toast('身份证长度不正确');
        } else if (this.list['AnimalId'] == undefined) {
            this.comm.toast('请输入动物的标签号');
        } else if (this.list['DieMessage'] == undefined) {
            this.comm.toast('请选择动物的死亡原因');
        } else if (this.list['ClaimAdjuster'] == undefined) {
            this.comm.toast('请选择您的理赔员');
        } else if (!this.isSence) {
            this.comm.toast('现场勘查照片未拍');
        } else if (!this.isHarmless) {
            this.comm.toast('无害处理照片未拍');
        } else if (!this.isDie) {
            this.comm.toast('死亡证明照片未拍');
        } else if (!this.isBank) {
            this.comm.toast('银行卡照片未拍');
        } else {
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: '请检查数据是否准确无误',
                buttons: [
                    {
                        text: '去检查',
                        handler: () => {
                        }
                    },
                    {
                        text: '保存',
                        handler: () => {
                            let loader = this.loadingCtrl.create({
                                content: "上传中...",
                                duration: 10000
                            });
                            loader.present();
                            for (let i = 0; i < this.item.length; i++) {
                                if (this.item[i]['Id'] == this.list['DieMessage']) {
                                    this.list['DieMessage'] = this.list['DieMessage'] + ',' + this.item[i]['Name'];
                                    break;
                                }
                            }
                            this.list['GPS'] = this.gps.long + ',' + this.gps.lat;
                            this.list['lhGuid'] = this.newGuid();
                            this.list['uid'] = JSON.parse(localStorage.getItem('user')).AccountName;
                            let n = [];
                            n.push(this.list);
                            this.http.post(`${ENV.WEB_URL}LpPinData`, {
                                pins: JSON.stringify(n)
                            }).subscribe(res => {
                                if (res.Status) {
                                    let options: FileUploadOptions = {
                                        fileKey: 'file',
                                        fileName: 'name.jpg',
                                        headers: {}
                                    };
                                    this.fileTransfer.upload(`${this.Scene}`, `${ENV.WEB_URL}UploadLpImg?guid=${this.list['lhGuid']}&imgType=6&uname=${this.list['uid']}`, options)
                                        .then(res => {
                                            this.fileTransfer.upload(`${this.Harmless}`, `${ENV.WEB_URL}UploadLpImg?guid=${this.list['lhGuid']}&imgType=7&uname=${this.list['uid']}`, options)
                                                .then(res => {
                                                    this.fileTransfer.upload(`${this.Die}`, `${ENV.WEB_URL}UploadLpImg?guid=${this.list['lhGuid']}&imgType=8&uname=${this.list['uid']}`, options)
                                                        .then(res => {
                                                            this.fileTransfer.upload(`${this.Bank}`, `${ENV.WEB_URL}UploadLpImg?guid=${this.list['lhGuid']}&imgType=4&uname=${this.list['uid']}`, options)
                                                                .then(res => {
                                                                    loader.dismiss();
                                                                    this.comm.toast('上传成功');
                                                                    this.navCtrl.pop();
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
