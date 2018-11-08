import { ApplicationRef, Component, ViewChild } from '@angular/core';
import {
    AlertController, IonicPage, LoadingController, ModalController, NavController,
    NavParams
} from 'ionic-angular';
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { File } from '@ionic-native/file';
import { GpsComponent } from "../../components/gps/gps";
import { ModalPage } from "../modal/modal";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-declare-contract-more',
    templateUrl: 'declare-contract-more.html',
})
export class DeclareContractMorePage {
    @ViewChild(GpsComponent) gps: GpsComponent;
    @ViewChild(ModalPage) modal: ModalPage;
    data: object;
    farmlist: Array<any>;
    intv: any;
    AnimtalList: Array<any>;
    SelfPremium: Array<any>;
    BreedType: Array<any>;
    citylist: Array<any>;
    moreAddr: string;
    isImplantationSite: boolean;
    isPositive: boolean;
    isLeft: boolean;
    isRight: boolean;
    isOtherPic: boolean;
    modals: any;
    OtherPicLen: number;
    showBottom: boolean;
    AnimalType: any;
    Varieties: any;
    provice: string;
    FramPeopleId: any;
    breedType: any;
    FramGuid: any;
    AnimalTypes: any;
    VarietyNames: any;
    beput: boolean;
    beselec: boolean;
    bea: boolean;
    ratelist: Array<any>;
    objects: any;
    isAnimalAge: any;
    isAnimalWeight: any;
    OtherPicUrl: any;
    isExemption: boolean;
    isa: boolean;
    isput: boolean;
    mainpeimin: any;
    mainpeimax: any;
    baoemin: any;
    baoemax: any;
    peopleid: any;
    page: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public comm: CommonServiceProvider, public http: AuthServiceProvider, public transfer: FileTransfer, public file: File, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private sqlite: SqllistServiceProvider, private bluetoothSerial: BluetoothSerial, public applicationRef: ApplicationRef, private photoViewer: PhotoViewer) {
        this.data = {};
        this.page = 'declare-contract-more';
        this.init();
        this.FramGuid = this.navParams.get('FramGuid');
        this.peopleid = this.navParams.get('peopleid') ? this.navParams.get('peopleid') : null;
        if (this.FramGuid) {
            if (this.peopleid) {
                this.sqlite.selecTableIDs('inframmessage', 'FramGuid', this.FramGuid).then(res => {
                    let list = JSON.parse(res[0].name.farmsmessage);
                    this.farmlist = list;
                    for (let value of list) {
                        if (value.FramPeopleID == this.peopleid) {
                            this.data['FramPeopleId'] = value;
                            this.FarmPeopleIdChange(this.data['FramPeopleId']);
                            break;
                        }
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else {
                this.sqlite.selecTableIDs('inframmessage', 'FramGuid', this.FramGuid).then(res => {
                    this.farmlist = this.listsss(res);
                    this.data['FramPeopleId'] = this.listsss(res)[0];
                    this.FarmPeopleIdChange(this.data['FramPeopleId']);
                }).catch(err => {
                    console.log(err);
                })
            }
        } else {
            this.sqlite.selecttableisloc('inframmessage', 1).then(res => {
                let obj = {FramPeopleId: '请选择'};
                this.farmlist = this.listsss(res);
                this.farmlist.push(obj);
                let data = JSON.parse(localStorage.getItem(this.page));
                this.data = data ? data : {};
                this.data['FramPeopleId'] = obj;
            }).catch(err => {
                console.log(err);
            })
        }

        this.BreedType = JSON.parse(localStorage.getItem('BreedType'));
        this.citylist = JSON.parse(localStorage.getItem('GetAreaTree'));
        document.addEventListener('resume', () => {
            let data = JSON.parse(localStorage.getItem(this.page));
            this.data = data;
        }, false);
        document.addEventListener('pause', () => {
            localStorage.setItem(this.page, JSON.stringify(this.data));
        }, false);
        let datas = localStorage.getItem(this.page);
        if (datas && datas != "null") {
            let obj = JSON.parse(datas);
            this.isLeft = obj.LeftUrl ? true : false;
            this.isImplantationSite = obj.ImplantationSiteUrl ? true : false;
            this.isPositive = obj.PositiveUrl ? true : false;
            this.isRight = obj.RightUrl ? true : false;
            this.isRight = obj.RightUrl ? true : false;
            this.isOtherPic = obj.OtherPicUrl ? true : false;
        }
    }


    ionViewWillLeave() {
        localStorage.setItem(this.page, JSON.stringify(this.data));
    }

    breedTypeFn(v1, v2) {
        return v1 && v2 ? v1.Id === v2.Id : v1 === v2;
    }

    proviceFn(v1, v2) {
        return v1 && v2 ? v1.id === v2.id : v1 === v2;
    }

    FramPeopleIdFn(v1, v2) {
        return v1 && v2 ? v1.FramPeopleID === v2.FramPeopleID : v1 === v2;
    }


    gotoCameraPage() {
        this.navCtrl.push('CameraPage');
    }

    init() {
        let data = JSON.parse(localStorage.getItem(this.page)) ? JSON.parse(localStorage.getItem(this.page)) : {};
        this.data = data;
        this.isOtherPic = false;
        this.isImplantationSite = false;
        this.isPositive = false;
        this.isLeft = false;
        this.isRight = false;
    }

    listsss(res) {
        let list = [];
        for (let i = 0; i < res.length; i++) {
            if (res[i].name.FramType != '3') {
                list.push(res[i].name);
            } else {
                let k = JSON.parse(res[i].name.farmsmessage ? res[i].name.farmsmessage : '[]');
                for (let j = 0; j < k.length; j++) {
                    list.push(k[j]);
                }
            }
        }
        return list;
    }

    FarmPeopleIdChange(obj) {
        console.log(this.data);
        this.sqlite.selecTableIDs('inframmessage', 'FramGuid', obj.qiyeGuid == undefined ? obj.FramGuid : obj.qiyeGuid).then(res => {
            this.objects = JSON.parse(res[0].name.insurancepro);
            this.data['AnimalTypes'] = this.objects.AnimalTypeName;
            this.data['VarietyNames'] = this.objects.VarietyeName;
            /***********免赔率的限制***********/
            if (this.objects.ExcessType == 0) {
                this.isExemption = false;
            } else {
                this.isExemption = true;
                if (this.objects.ExcessType == 1) {
                    this.isa = true;
                    this.isput = false;
                    this.data['Exemption'] = this.objects.Excess;
                } else if (this.objects.ExcessType == 2) {
                    this.isa = false;
                    this.isput = true;
                    let list = this.objects.Excess.split('-');
                    this.mainpeimin = list[0];
                    this.mainpeimax = list[1];
                    this.data['Exemption'] = null;
                } else {
                    this.isa = false;
                    this.isput = true;
                    this.data['Exemption'] = null;
                }
            }
            /***********保额的限制***********/
            if (this.objects.InsuranceAmount.indexOf('/') > -1) {
                this.beput = false;
                this.beselec = true;
                this.bea = false;
                this.baoemin = null;
                this.baoemax = null;
                this.SelfPremium = this.objects.InsuranceAmount.split('/');
                this.data['Insuredamount'] = this.SelfPremium[0];
            } else {
                if (this.objects.InsuranceAmountType == 1) {
                    this.beput = false;
                    this.beselec = false;
                    this.bea = true;
                    this.baoemin = null;
                    this.baoemax = null;
                    this.data['Insuredamount'] = this.objects.InsuranceAmount;
                }
                if (this.objects.InsuranceAmountType == 2) {
                    this.beput = true;
                    this.beselec = false;
                    this.bea = false;
                    let lists = this.objects.InsuranceAmount.split('-');
                    this.baoemin = lists[0];
                    this.baoemax = lists[1];
                    this.data['Insuredamount'] = 0;
                }
                if (this.objects.InsuranceAmountType == 3) {
                    this.beput = true;
                    this.beselec = false;
                    this.bea = false;
                    this.baoemin = null;
                    this.baoemax = null;
                    this.data['Insuredamount'] = 0;
                }
            }
            /***********费率的限制***********/
            this.ratelist = this.objects.InsuranceRate.split('/');
            this.data['rate'] = this.ratelist[0];
            this.data['TotalPremium'] = (this.data['Insuredamount'] * (this.data['rate'] / 100)).toFixed(2);
            this.data['SelfPayPremium'] = (this.data['TotalPremium'] * (this.objects.FarmRate / 100)).toFixed(2);
            switch (this.objects.WithWeight) {
                case 0:
                    this.isAnimalAge = true;
                    this.isAnimalWeight = false;
                    break;
                case 1:
                    this.isAnimalAge = false;
                    this.isAnimalWeight = true;
                    break;
                case 2:
                    this.isAnimalAge = true;
                    this.isAnimalWeight = true;
                    break;
            }
        }).catch(err => {
            console.log(err);
        });
    }


    bechange(Insu) {
        this.data['TotalPremium'] = (Insu * (this.data['rate'] / 100)).toFixed(2);
        this.data['SelfPayPremium'] = (this.data['TotalPremium'] * (this.objects.FarmRate / 100)).toFixed(2);
    }

    flchange(rate) {
        this.data['TotalPremium'] = (this.data['Insuredamount'] * (rate / 100)).toFixed(2);
        this.data['SelfPayPremium'] = (this.data['TotalPremium'] * (this.objects.FarmRate / 100)).toFixed(2);
    }

    ImplantationSiteC() {
        if (this.isImplantationSite) {
            this.photoViewer.show(this.data['ImplantationSiteUrl']);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.data['ImplantationSiteUrl'] = res + '';
                this.isImplantationSite = true;
            })
        }
    }

    PositiveC() {
        if (this.isPositive) {
            this.photoViewer.show(this.data['PositiveUrl']);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.data['PositiveUrl'] = res + '';
                this.isPositive = true;
            })
        }
    }

    LeftC() {
        if (this.isLeft) {
            this.photoViewer.show(this.data['LeftUrl']);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.data['LeftUrl'] = res + '';
                this.isLeft = true;
            })
        }
    }

    RightC() {
        if (this.isRight) {
            this.photoViewer.show(this.data['RightUrl']);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.data['RightUrl'] = res + '';
                this.isRight = true;
            })
        }
    }

    backsss = (_params) => {
        return new Promise((resolve, reject) => {
            if (!_params || _params.length == 0) {
                this.isOtherPic = false;
            } else {
                this.isOtherPic = true;
                this.data['OtherPicUrl'] = _params;
                this.OtherPicLen = _params.length;
            }
            resolve();
        });
    };

    OtherC() {
        this.modals = this.modalCtrl.create('ModalPage', {
            callback: this.backsss,
            OtherPic: this.OtherPicUrl == undefined ? [] : this.OtherPicUrl,
            isOtherPic: this.isOtherPic
        });
        this.modals.present();
    }

    fa(index) {
        switch (index) {
            case 1:
                this.isImplantationSite = false;
                break;
            case 2:
                this.isPositive = false;
                break;
            case 3:
                this.isLeft = false;
                break;
            case 4:
                this.isRight = false;
                break;
            case 5:
                this.isOtherPic = false;
                break;
        }
    }

    fileTransfer: FileTransferObject = this.transfer.create();

    findGuid(guid) {
        this.sqlite.selectTableAnimalID('Underwriting', `${this.data['AnimalId']}`).then(res => {
            if (res.length >= 1) {
                this.comm.toast('请勿重复录入相同的耳标号');
            } else {
                if (this.data['FramPeopleId'] == undefined) {
                    this.comm.toast('请输入身份证或机构代码');
                } else if (this.data['AnimalId'] == undefined) {
                    this.comm.toast('请输入动物的标签号');
                } else if (this.data['AnimalTypes'] == undefined) {
                    this.comm.toast('请选择动物的类型');
                } else if (this.data['VarietyNames'] == undefined) {
                    this.comm.toast('请选择动物的品种');
                } else if (this.data['AnimalAge'] == undefined && this.isAnimalAge) {
                    this.comm.toast('请输入动物的畜龄');
                } else if (this.data['AnimalWeight'] == undefined && this.isAnimalWeight) {
                    this.comm.toast('请输入动物的体重');
                } else if (this.data['SelfPayPremium'] == undefined) {
                    this.comm.toast('请输入自缴的保费');
                } else if (this.data['breedType'] == undefined) {
                    this.comm.toast('请选择养殖方式');
                } else if (this.data['provice'] == undefined) {
                    this.comm.toast('请选择养殖地点的区');
                } else if (this.data['moreAddr'] == undefined) {
                    this.comm.toast('请输入养殖地点详细地址');
                } else if (!this.isImplantationSite) {
                    this.comm.toast('请上传植入部位的图片');
                } else if (!this.isPositive) {
                    this.comm.toast('请上传正面的图片');
                } else if (!this.isLeft) {
                    this.comm.toast('请上传左面的图片');
                } else if (!this.isRight) {
                    this.comm.toast('请上传右面的图片');
                } else if (this.mainpeimax == undefined ? false : !(this.mainpeimin < this.data['Exemption'] < this.mainpeimax)) {
                    this.comm.toast(`您输入的免赔率应大于等于${this.mainpeimin}小于等于${this.mainpeimax}`);
                } else {
                    let confirm = this.alertCtrl.create({
                        title: '提示',
                        message: '提交前请仔细核对，确保上传数据准确无误。',
                        buttons: [
                            {
                                text: '返回检查',
                                handler: () => {
                                }
                            },
                            {
                                text: '保存',
                                handler: () => {
                                    let date = new Date();
                                    let year = date.getFullYear();
                                    let mou = date.getMonth() + 1;
                                    let day = date.getDate();
                                    this.data['GPS'] = this.gps.long + '|' + this.gps.lat;
                                    this.data['createtime'] = `${year + '-' + mou + '-' + day}`;
                                    this.data['SelfGuid'] = this.comm.newGuid();
                                    this.data['FramGuid'] = guid;
                                    this.data['breedadd'] = this.data['provice'] ? `${this.data['provice']['id']},${this.data['provice']['name']}${this.data['moreAddr']}` : null;
                                    this.data['AnimalType'] = this.objects.AnimalType + ',' + this.objects.AnimalTypeName;
                                    this.data['Varieties'] = this.objects.Variety + ',' + this.objects.VarietyeName;
                                    this.data['FramPeopleId'] = this.data['FramPeopleId'].FramPeopleID;
                                    this.data['breedType'] = this.data['breedType'] ? this.data['breedType'].Id + ',' + this.data['breedType'].Name : null;
                                    this.data['Isloc'] = 1;
                                    this.data['OtherPicUrl'] = this.OtherPicUrl == undefined ? '' : this.OtherPicUrl.join();
                                    delete this.data['provice'];
                                    delete this.data['moreAddr'];
                                    delete this.data['AnimalTypes'];
                                    delete this.data['VarietyNames'];
                                    console.log(this.data);
                                    this.sqlite.newinster('Underwriting', this.data).then(res => {
                                        this.data['parity'] = null;
                                        this.data['AnimalAge'] = null;
                                        this.data['AnimalWeight'] = null;
                                        this.data['AnimalId'] = null;
                                        this.isImplantationSite = false;
                                        this.isPositive = false;
                                        this.isLeft = false;
                                        this.isRight = false;
                                        this.isOtherPic = false;
                                        localStorage.removeItem(this.page);
                                        this.data = {};
                                        this.comm.toast('保存成功');
                                    }).catch(mess => {
                                        console.log(mess);
                                    });
                                }
                            }
                        ]
                    });
                    confirm.present();
                }
            }
        }).catch(e => {
            console.log(e)
        });
    }

    saveBtn() {
        if (this.objects) {
            let guid: string = this.data['FramPeopleId'].qiyeGuid == null ? this.data['FramPeopleId'].FramGuid : this.data['FramPeopleId'].qiyeGuid;
            this.findGuid(guid);
        } else {
            this.comm.toast('请选择您要承包的农户');
        }
    }

    saoyisao() {
        if (window['cordova']) {
            window['cordova'].plugins.barcodeScanner
            .scan((res) => {
                if (res.text.length != 15) {
                    this.comm.toast('请扫描正确的条码');
                } else {
                    this.data['AnimalId'] = res.text;
                }
            }, (e) => {
                console.log(e)
            });
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
                                        this.data['AnimalId'] = this.comm.rfidDecode(mess, null);
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
                                        this.data['AnimalId'] = this.comm.rfidDecode(mess, null);
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
                                                this.data['AnimalId'] = this.comm.rfidDecode(mess, null);
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
                                                    this.data['AnimalId'] = this.comm.rfidDecode(mess, null);
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
        }).catch(e => {
            console.log(e);
            this.bluetoothSerial.enable().then(res => {
            }).catch(e => {
                console.log(e)
            });
        });
    }

    baoeblur() {
        this.showBottom = false;
        let intInsur = parseInt(this.data['Insuredamount']);
        if (this.data['Insuredamount'] == 0) {
            this.comm.toast('请输入保额');
        } else {
            if (this.comm.checkNum(this.data['Insuredamount'])) {
                if (this.baoemin) {
                    if (!(parseInt(this.baoemin) <= intInsur && intInsur <= parseInt(this.baoemax))) {
                        this.comm.toast(`您输入的保额应大于等于${this.baoemin}小于等于${this.baoemax}`);
                        this.data['Insuredamount'] = 0;
                    } else {
                        this.data['TotalPremium'] = (intInsur * (this.data['rate'] / 100)).toFixed(2);
                        this.data['SelfPayPremium'] = (intInsur * (this.objects.FarmRate / 100)).toFixed(2);
                    }
                } else {
                    this.data['TotalPremium'] = (intInsur * (this.data['rate'] / 100)).toFixed(2);
                    this.data['SelfPayPremium'] = (intInsur * (this.objects.FarmRate / 100)).toFixed(2);
                }
            } else {
                this.comm.toast('请输入正确的数字');
                this.data['Insuredamount'] = 0;
            }
        }
    }

    taiciBlur() {
        this.showBottom = false;
        if (!this.comm.checkNum(this.data['parity'])) {
            this.comm.toast('请输入正确的数字');
            this.data['parity'] = 0;
        }
    }

    ageBlur() {
        this.showBottom = false;
        if (this.comm.checkNum(this.data['AnimalAge'])) {
            let list = this.objects.AgeRange == null ? [] : this.objects.AgeRange.split('-');
            if (list.length != 1) {
                if (!(parseInt(list[0]) <= parseInt(this.data['AnimalAge']) && parseInt(this.data['AnimalAge']) <= parseInt(list[1]))) {
                    this.comm.toast(`你输入的畜龄应大于等于${list[0]}小于等于${list[1]}`);
                }
            }
        } else {
            this.comm.toast('请输入正确的畜龄');
        }
    }

    weightBlur() {
        this.showBottom = false;
        if (this.comm.checkNum(this.data['AnimalWeight'])) {
            let list = this.objects.WeightRange == null ? [] : this.objects.WeightRange.split('-');
            if (list.length != 0) {
                if (!(parseFloat(list[0]) <= parseFloat(this.data['AnimalWeight']) && parseFloat(this.data['AnimalWeight']) <= parseFloat(list[1]))) {
                    this.comm.toast(`你输入的体重应大于等于${list[0]}小于等于${list[1]}`);
                }
            }
        } else {
            this.comm.toast('请输入正确的体重');
        }
    }

    unamefocus() {
        this.showBottom = true;
    }

    unameBlur() {
        this.showBottom = false;
    }
}
