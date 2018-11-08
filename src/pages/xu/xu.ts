import { ApplicationRef, Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";

@IonicPage()
@Component({
    selector: 'page-xu',
    templateUrl: 'xu.html',
})
export class XuPage {
    propleID: string;
    FramMessage: Array<any>;
    FramChenMessage: Array<any>;
    Time: string;
    Chengbaoyuan: string;
    callback: any;
    indexS: number;
    anminid: string;
    zongshu: number;
    saoshu: number;
    changePut: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqllite: SqllistServiceProvider, private camera: Camera, public comm: CommonServiceProvider, public loadingCtrl: LoadingController, private photoViewer: PhotoViewer, public alertCtrl: AlertController, public applicationRef: ApplicationRef, private bluetoothSerial: BluetoothSerial) {
        this.propleID = navParams.get('message');
        this.callback = navParams.get('callback');
        this.indexS = navParams.get('indexS');
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.FramChenMessage = [];
        sqllite.selecTableIDs('DnowLoadFarmData', 'FramGuid', this.propleID)
            .then(res => {
                this.FramMessage = res;
                this.FramMessage[0]['form'] = {};
                this.Time = res[0].name.CreateTime.split(' ')[0];
            }).catch();
        this.shuliang();
    }

    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    chaFram(index, item) {
        switch (index) {
            case 1:
                this.FramMessage[item].name.idfrontUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 2:
                this.FramMessage[item].name.idbackUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 3:
                this.FramMessage[item].name.bankUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 4:
                this.FramMessage[item].name.VaccinationCertificateImg = 'assets/icon/pic-updata_03.png';
                break;
            case 5:
                this.FramMessage[item].name.InstitutionCodeImg = 'assets/icon/pic-updata_03.png';
                break;
        }
    }

    puthChange() {
        this.selectTable(this.changePut, this.propleID);
    }

    font(index) {
        if (this.FramMessage[index].name.idfrontUrl != 'assets/icon/pic-updata_03.png') {
            this.photoViewer.show(this.FramMessage[index].name.idfrontUrl);
        } else {
            this.comm.chooseImage(1).then((imageData) => {
                this.FramMessage[index].name.idfrontUrl = imageData;
                this.FramMessage[index].form.idfrontUrl = imageData;
            }, (err) => {
            });
        }

    }

    backFont(index) {
        if (this.FramMessage[index].name.idbackUrl != 'assets/icon/pic-updata_03.png') {
            this.photoViewer.show(this.FramMessage[index].name.idbackUrl);
        } else {
            this.comm.chooseImage(1).then((imageData) => {
                this.FramMessage[index].name.idbackUrl = imageData;
                this.FramMessage[index].form.idbackUrl = imageData;
            }, (err) => {
            });
        }
    }

    Bank(index) {
        if (this.FramMessage[index].name.bankUrl != 'assets/icon/pic-updata_03.png') {
            this.photoViewer.show(this.FramMessage[index].name.bankUrl);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.FramMessage[index].name.bankUrl = res;
                this.FramMessage[index].form.bankUrl = res;
            })
        }
    }

    //机构代码
    InstitCode(index) {
        if (this.FramMessage[index].name.InstitutionCodeImg != 'assets/icon/pic-updata_03.png') {
            this.photoViewer.show(this.FramMessage[index].name.InstitutionCodeImg);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.FramMessage[index].name.InstitutionCodeImg = res;
                this.FramMessage[index].form.InstitutionCodeImg = res;
            })
        }
    }

    //防疫
    VaccinCate(index) {
        if (this.FramMessage[index].name.VaccinationCertificateImg != 'assets/icon/pic-updata_03.png') {
            this.photoViewer.show(this.FramMessage[index].name.VaccinationCertificateImg);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.FramMessage[index].name.VaccinationCertificateImg = res;
                this.FramMessage[index].form.VaccinationCertificateImg = res;
            })
        }
    }

    chaIM(index, item) {
        switch (index) {
            case 1:
                this.FramChenMessage[item].name.positonUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 2:
                this.FramChenMessage[item].name.frontUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 3:
                this.FramChenMessage[item].name.leftUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 4:
                this.FramChenMessage[item].name.rightUrl = 'assets/icon/pic-updata_03.png';
                break;
        }
        this.applicationRef.tick();
    }


    buwei(index) {
        if (this.FramChenMessage[index].name.positonUrl != 'assets/icon/pic-updata_03.png') {
            this.photoViewer.show(this.FramChenMessage[index].name.positonUrl);
        } else {
            this.comm.chooseImage(1).then((imageData) => {
                this.FramChenMessage[index].name.positonUrl = imageData;
                this.FramChenMessage[index].form.positonUrl = imageData;
            }, (err) => {
            });
        }
    }

    zhengmian(index) {
        if (this.FramChenMessage[index].name.frontUrl != 'assets/icon/pic-updata_03.png') {
            this.photoViewer.show(this.FramChenMessage[index].name.frontUrl);
        } else {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramChenMessage[index].name.frontUrl = imageData;
                this.FramChenMessage[index].form.frontUrl = imageData;
            }, (err) => {
            });
        }
    }

    zouMian(index) {
        if (this.FramChenMessage[index].name.leftUrl != 'assets/icon/pic-updata_03.png') {
            this.photoViewer.show(this.FramChenMessage[index].name.leftUrl);
        } else {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramChenMessage[index].name.leftUrl = imageData;
                this.FramChenMessage[index].form.leftUrl = imageData;
            }, (err) => {
            });
        }
    }

    youmian(index) {
        if (this.FramChenMessage[index].name.rightUrl != 'assets/icon/pic-updata_03.png') {
            this.photoViewer.show(this.FramChenMessage[index].name.rightUrl);
        } else {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramChenMessage[index].name.rightUrl = imageData;
                this.FramChenMessage[index].form.rightUrl = imageData;
            }, (err) => {
            });
        }
    }

    sure() {
        if (this.FramChenMessage.length == 0) {
            this.comm.toast('请扫描标签');
        } else {
            for (let i = 0; i < this.FramChenMessage.length; i++) {
                this.FramChenMessage[i].form.Isloc = 0;
                this.sqllite.updateFarmMessage('DnowLoadUnderData', this.FramChenMessage[i].name, this.FramChenMessage[i].form).then(res => {
                    if (i == this.FramChenMessage.length - 1) {
                        this.comm.toast('修改成功');
                        this.shuliang();
                        this.FramChenMessage = [];
                    }
                }).catch(e => {
                    console.log(e)
                });
            }
        }
    }

    shuliang() {
        let n = 0;
        this.sqllite.selecTablePeopleID('DnowLoadUnderData', this.propleID).then(res => {
            this.zongshu = res.length;
            for (let i = 0; i < res.length; i++) {
                if (res[i].name.Isloc == 0) {
                    n++;
                }
            }
            this.saoshu = n;
        }).catch(e => {
            console.log(e)
        });

    }

    deleteMessage() {
        if (this.FramChenMessage.length == 0) {
            this.comm.toast('请扫描标签');
        } else {
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: '你确定要删除这条数据吗？',
                buttons: [
                    {
                        text: '取消',
                        handler: () => {
                        }
                    },
                    {
                        text: '确定',
                        handler: () => {
                            for (let i = 0; i < this.FramChenMessage.length; i++) {
                                this.sqllite.deletTableAnimid('DnowLoadUnderData', this.FramChenMessage[i].name.AnimalId).then(res => {
                                    this.comm.toast('删除成功');
                                    this.FramChenMessage = [];
                                }).catch(e => {
                                    console.log(e)
                                });
                            }
                        }
                    }
                ]
            });
            confirm.present();
        }
    }

    intv: any;

    lanya() {
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
                                        let messs = this.comm.rfidDecode(mess, null);
                                        this.applicationRef.tick();
                                        this.selectTable(messs, this.propleID);
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
                                        let messs = this.comm.rfidDecode(mess, null);
                                        this.applicationRef.tick();
                                        this.selectTable(messs, this.propleID);
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

    searchBlue() {
        this.bluetoothSerial.isEnabled().then(res => {
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
                                                let messs = this.comm.rfidDecode(mess, null);
                                                this.applicationRef.tick();
                                                this.selectTable(messs, this.propleID);
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
                                                    let messs = this.comm.rfidDecode(mess, null);
                                                    this.applicationRef.tick();
                                                    this.selectTable(messs, this.propleID);
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
        }).catch(e => {
            console.log(e);
            this.bluetoothSerial.enable().then(res => {
            }).catch(e => {
                console.log(e)
            });
        });
    }

    selectTable(id, guid) {
        this.sqllite.selectTableAnimalIDs('DnowLoadUnderData', `${id}`, `${guid}`).then(res => {
            if (res.length == 0) {
                this.comm.toast('没有找到您扫描的耳标号');
            } else {
                for (let i = 0; i < res.length; i++) {
                    res[i].form = {};
                }
                this.FramChenMessage = res;
                this.applicationRef.tick();
            }
        }).catch(e => {
            console.log(e)
        });
    }

    saveBtnSave() {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '本地的续保数据保存成功后将不能修改，你确定要修改这条数据吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        this.FramMessage[0].form.isXubao = '1';
                        this.sqllite.updataTable('DnowLoadFarmData', this.FramMessage[0].name, this.FramMessage[0].form).then(res => {
                            this.sqllite.updataTables('DnowLoadUnderData', this.FramChenMessage[0].name, this.FramChenMessage[0].form).then(mess => {
                                this.comm.toast('修改成功');
                                this.navCtrl.pop();
                            }).catch(e => {
                                console.log(e)
                            });
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
