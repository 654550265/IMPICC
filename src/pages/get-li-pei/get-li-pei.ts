import { ApplicationRef, Component, ViewChild } from '@angular/core';
import {
    AlertController, IonicPage, NavController, NavParams, ModalController,
    LoadingController, ActionSheetController
} from 'ionic-angular';
import { GpsComponent } from "../../components/gps/gps";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Lipei_db } from './../../model/Lipei_db';
import { FormControl, FormGroup } from '@angular/forms';

@IonicPage()
@Component({
    selector: 'page-get-li-pei',
    templateUrl: 'get-li-pei.html',
})
export class GetLiPeiPage {
    @ViewChild(GpsComponent) gps: GpsComponent;
    list: Array<{ name: string, pla: string, acv: boolean }>;
    AnimalId: string;
    DieMessage: object;
    FontCard: string;
    FontBack: string;
    BackCard: string;
    isBackCard: boolean;
    isFontCard: boolean;
    isBackCardF: boolean;
    isScene: boolean;
    isHarmless: boolean;
    isDie: boolean;
    isOther: boolean;
    Scene: Array<any>;
    Harmless: Array<any>;
    Die: string;
    isOtherPic: boolean;
    OtherPic: Array<string>;
    OtherPicLen: number;
    item: Array<any>;
    showBottom: boolean;
    FarmList: Array<any>;
    VaccinationCertificateImg: string;
    isVaccinationCertificateImg: boolean;
    InstitutionCodeImg: string;
    isInstitutionCodeImg: boolean;
    DieTypeList: Array<any>;
    dieType: any;
    fangYi: any;
    FangyiType: string;
    WuHai: any;
    WuHaiHua: string;
    SceneLen: number;
    HarmlessLen: number;
    idCard: string;
    AnimalType: string;
    AnimalTypeName: string;
    Varieties: string;
    AnimalVarietyName: string;
    AnimalAge: string;
    AnimalWeight: string;
    InsuranceAmount: string;
    FinalMoney: string;
    FindAddress: string;
    AnimtalTypes: string;
    GPS: string;
    lhGuid: string;
    Time: string;
    allData: object;
    showCard: boolean;

    chenBaoObj: object;
    DieMessages: any;
    variteyArr: Array<any>;
    animalsVarArr: Array<any>;
    yearUnit: string;//畜龄单位
    farmer: FormGroup;
    Lipei_local: Lipei_db;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private camera: Camera, public comm: CommonServiceProvider, public modalCtrl: ModalController, public sql: SqllistServiceProvider, public http: AuthServiceProvider, private photoViewer: PhotoViewer, private bluetoothSerial: BluetoothSerial, public applicationRef: ApplicationRef, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController) {
        this.isFontCard = false;
        this.showBottom = true;
        this.isBackCard = false;
        this.isBackCardF = false;
        this.isScene = false;
        this.isHarmless = false;
        this.isDie = false;
        this.isOther = false;
        this.isInstitutionCodeImg = false;
        this.isVaccinationCertificateImg = false;
        this.DieMessage = {};
        this.DieMessages = '';
        this.AnimtalTypes = '3';
        this.yearUnit = '';
        this.allData = {};
        this.sql.selectTableAll('InsuredFarmer').then(res => {
            this.FarmList = res;
        });
        this.DieTypeList = JSON.parse(localStorage.getItem('dieMessage'));
        this.item = this.DieTypeList[0].items;
        this.dieType = "61294583270739968";
        this.fangYi = ['正常', '不正常'];
        this.FangyiType = '正常';
        this.WuHai = ['焚烧', '深埋', '化学池', '其他'];
        this.idCard = this.navParams.get('idCard');
        this.variteyArr = JSON.parse(localStorage.getItem('varitey'));
        this.animalsVarArr = [];
        this.AnimalTypeName = '';
        this.AnimalVarietyName = '';
        let ss = this.navParams.get('FramGuid');
        if (ss) {
            this.allData['FramGuid'] = ss;
        }else{
            ss = '';
        }
        this.Lipei_local = localStorage.getItem('lipei1') ? JSON.parse(localStorage.getItem('lipei1')) : new Lipei_db();
        let aa = this.navParams.get('idCard');
        if(this.Lipei_local.idCard){
            aa = this.Lipei_local.idCard;
        }
        this.farmer = new FormGroup({
            idCard: new FormControl(aa),
            AnimalId: new FormControl(this.Lipei_local.AnimalId),
            AnimalTypeName: new FormControl(this.Lipei_local.AnimalTypeName),
            AnimalVarietyName: new FormControl(this.Lipei_local.AnimalVarietyName),
            AnimalAge: new FormControl(this.Lipei_local.AnimalAge),
            AnimalWeight: new FormControl(this.Lipei_local.AnimalWeight),
            InsuranceAmount: new FormControl(this.Lipei_local.InsuranceAmount),
            FinalMoney: new FormControl(this.Lipei_local.FinalMoney),
            FindAddress: new FormControl(this.Lipei_local.FindAddress),
            FangyiType: new FormControl(this.Lipei_local.FangyiType),
            dieType: new FormControl(this.Lipei_local.dieType),
            DieMessages: new FormControl(this.Lipei_local.DieMessages),
            WuHaiHua: new FormControl(this.Lipei_local.WuHaiHua),
            AnimalType: new FormControl(this.Lipei_local.AnimalType),
            Scene: new FormControl(this.Lipei_local.Scene),
            Harmless: new FormControl(this.Lipei_local.Harmless),
            Die: new FormControl(this.Lipei_local.Die),
            OtherPic: new FormControl(this.Lipei_local.OtherPic),
            Varieties: new FormControl(this.Lipei_local.Varieties),
            FramGuid:new FormControl(ss),
        });
        if (this.Lipei_local.AnimalTypeName != '') {
            let name = this.Lipei_local.AnimalTypeName;
            let arr = this.variteyArr;
            let num = 0;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].AnimtalTypeName == name) {
                    num = i;
                    break;
                }
            }
            this.animalsVarArr = arr[num].Items;
            this.farmer.controls['AnimalType'].setValue(arr[num].AnimtalType);
        }
        if (this.Lipei_local.dieType != '') {
            for (let i = 0; i < this.DieTypeList.length; i++) {
                if (this.DieTypeList[i].id == this.Lipei_local.dieType) {
                    this.item = this.DieTypeList[i].items;
                    break;
                }
            }
        }
        if (this.Lipei_local.AnimalTypeName == '猪') {
            this.yearUnit = '月';
        } else {
            this.yearUnit = '年';
        }
        if (this.Lipei_local.Scene) {
            this.isScene = true;
            this.SceneLen = this.Lipei_local.Scene.length;
        }
        if (this.Lipei_local.Harmless) {
            this.isHarmless = true;
            this.HarmlessLen = this.Lipei_local.Harmless.length;
        }
        if (this.Lipei_local.OtherPic) {
            this.isOtherPic = true;
            this.OtherPicLen = this.Lipei_local.OtherPic.length;
        }
        if (this.Lipei_local.Die) {
            this.isDie = true;
        }
        if(this.Lipei_local.idCard){
            this.DieMessageObjChange()
        }
        this.onChanges();
    }

    onChanges(): void {
        this.farmer.valueChanges.subscribe(val => {
            localStorage.setItem('lipei1', JSON.stringify(val));
        });
    }

    // in() {
    //     for (let i = 0; i < this.DieTypeList.length; i++) {
    //         if (this.DieTypeList[i].id == this.dieType) {
    //             for (let j = 0; j < this.DieTypeList[i].items.length; j++) {
    //                 if (this.DieTypeList[i].items[j].animal_type == this.AnimtalTypes) {
    //                     this.item.push(this.DieTypeList[i].items[j]);
    //                     if (this.item.length == 0) {
    //                         this.comm.toast('该动物的类型暂无疾病示例，请联系管理员添加');
    //                     }
    //                 }
    //             }
    //         }else{
    //             if (this.item.length == 0) {
    //                 this.comm.toast('该动物的类型暂无疾病示例，请联系管理员添加');
    //                 break;
    //             }
    //         }
    //     }
    // }
    //防疫情况
    fangyiChoose() {

    }

    dieTypeChange() {
        this.item = [];
        this.DieMessage = undefined;
        for (let i = 0; i < this.DieTypeList.length; i++) {
            if (this.DieTypeList[i].id == this.farmer.value.dieType) {
                this.item = this.DieTypeList[i].items;
                break;
            }
        }
    }

    siwang() {
        console.log(this.DieMessages)
    }

    DieMessageObjChange() {
        let self = this;

        this.sql.selecTableIDs('InsuredFarmer', 'idCard', this.farmer.value.idCard).then(ress => {
            self.allData['FramGuid'] = ress[0].name.FramGuid;
        });
    }

    TypeChange() {
        let name = this.farmer.value.AnimalTypeName;
        let arr = this.variteyArr;
        let num = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].AnimtalTypeName == name) {
                num = i;
                break;
            }
        }
        this.animalsVarArr = arr[num].Items;
        this.farmer.controls['AnimalType'].setValue(arr[num].AnimtalType);
        this.farmer.controls['AnimalVarietyName'].setValue('');
        if (name == '猪') {
            this.yearUnit = '月';
        } else {
            this.yearUnit = '年';
        }
    }

    VarityChange() {
        let num = 0;
        for (let i = 0; i < this.animalsVarArr.length; i++) {
            if (this.animalsVarArr[i].name == this.AnimalVarietyName) {
                num = i;
                break;
            }
        }
        this.farmer.controls['Varieties'].setValue(this.animalsVarArr[num].Id);
    }

    getSomeInfo() {
        let self = this;
        this.sql.selecTableIDs('Underwriting', 'AnimalId', this.farmer.value.AnimalId).then(res => {
            this.sql.selectTableAll('PiliangUnderwriting').then(ress => {
                let arr = res;
                for (let i = 0; i < ress.length; i++) {
                    if (ress[i].name.StartAnimalIds <= self.AnimalId && ress[i].name.EndAnimalIds >= self.AnimalId) {
                        arr.push(ress[i]);
                        break;
                    }
                }

                if (arr.length == 0) {
                    // self.comm.toast('请输入正确的耳标号');
                    self.farmer.controls['AnimalType'].setValue('');
                    self.farmer.controls['AnimalTypeName'].setValue('');
                    self.farmer.controls['Varieties'].setValue('');
                    self.farmer.controls['AnimalVarietyName'].setValue('');
                    self.farmer.controls['AnimalAge'].setValue('');
                    self.farmer.controls['AnimalWeight'].setValue('');
                    self.farmer.controls['InsuranceAmount'].setValue('');
                    self.farmer.controls['FindAddress'].setValue('');
                    self.chenBaoObj = {};
                } else {
                    self.farmer.controls['AnimalType'].setValue(arr[0].name.AnimalType.split(',')[0]);
                    self.farmer.controls['AnimalTypeName'].setValue(arr[0].name.AnimalType.split(',')[1]);
                    self.farmer.controls['Varieties'].setValue(arr[0].name.Varieties.split(',')[0]);
                    let name = this.farmer.value.AnimalTypeName;
                    let arrs = this.variteyArr;
                    let num = 0;
                    for (let i = 0; i < arrs.length; i++) {
                        if (arrs[i].AnimtalTypeName == name) {
                            num = i;
                            break;
                        }
                    }
                    self.animalsVarArr = arrs[num].Items;
                    setTimeout(function () {
                        self.farmer.value.AnimalVarietyName = arr[0].name.Varieties.split(',')[1].split(' ')[0];
                    }, 500);
                    self.farmer.controls['AnimalAge'].setValue(arr[0].name.AnimalAge);
                    self.farmer.controls['AnimalWeight'].setValue(arr[0].name.AnimalWeight);
                    self.farmer.controls['InsuranceAmount'].setValue(arr[0].name.Insuredamount);
                    self.farmer.controls['FindAddress'].setValue(arr[0].name.breedadd.split(',')[1]);
                    self.chenBaoObj = arr[0].name;
                }
            });
        });
    }

    unameBlur(ele) {
        if (ele) {//获取动物标签号，数据自动同步
            this.getSomeInfo();
        }
        this.showBottom = true;
    }

    unamefocus() {
        this.showBottom = false;
    }

    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    faa(index) {
        switch (index) {
            case 1:
                this.isScene = false;
                this.farmer.controls['Scene'].setValue('');
                break;
            case 2:
                this.isHarmless = false;
                this.farmer.controls['Harmless'].setValue('');
                break;
            case 3:
                this.isDie = false;
                this.farmer.controls['Die'].setValue('');
                break;
            case 4:
                this.isOtherPic = false;
                this.farmer.controls['OtherPic'].setValue('');
                break;
        }
    }

    backsss = (_params, ele) => {
        return new Promise((resolve, reject) => {
            if (_params.length == 0) {
                switch (ele) {
                    case 1:
                        this.isScene = false;
                        break;
                    case 2:
                        this.isHarmless = false;
                        break;
                    case 3:
                        this.isOtherPic = false;
                        break;
                }
            } else {
                switch (ele) {
                    case 1:
                        this.isScene = true;
                        this.farmer.controls['Scene'].setValue(_params);
                        this.SceneLen = _params.length;
                        break;
                    case 2:
                        this.isHarmless = true;
                        this.farmer.controls['Harmless'].setValue(_params);
                        this.HarmlessLen = _params.length;
                        break;
                    case 3:
                        this.isOtherPic = true;
                        this.farmer.controls['OtherPic'].setValue(_params);
                        this.OtherPicLen = _params.length;
                        break;
                }
            }
            resolve();
        });
    };

    Otherss(ele) {
        let pics = [];
        let titles = '';
        switch (ele) {
            case 1:
                pics = !this.farmer.value.Scene || this.farmer.value.Scene == '' ? [] : this.farmer.value.Scene;
                titles = '现场勘查图片';
                break;
            case 2:
                pics = !this.farmer.value.Harmless || this.farmer.value.Harmless == '' ? [] : this.farmer.value.Harmless;
                titles = '无害化处理图片';
                break;
            case 3:
                pics = !this.farmer.value.OtherPic || this.farmer.value.OtherPic == '' ? [] : this.farmer.value.OtherPic;
                titles = '其他图片';
                break;
        }
        let modal = this.modalCtrl.create('GetLiPeiOtherPage', {
            callback: this.backsss,
            OtherPic: pics,
            myType: ele,
            titles: titles
        });
        modal.present();
    }

    Diess() {
        if (this.isDie) {
            this.photoViewer.show(this.farmer.value.Die);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.farmer.controls['Die'].setValue(res + '');
                this.isDie = true;
            })
        }
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

    tijiao() {
        let self = this;
        this.GPS = this.gps.long + '|' + this.gps.lat;
        let lhGuid = this.comm.newGuid();
        if (this.farmer.value.idCard == '') {
            this.comm.toast('请选择身份证号');
        } else if (this.farmer.value.AnimalId == '') {
            this.comm.toast('请输入动物标签号');
        } else if (this.farmer.value.AnimalTypeName == '') {
            this.comm.toast('请选择动物类型');
        } else if (this.farmer.value.AnimalVarietyName == '') {
            this.comm.toast('请选择动物品种');
        }
        // else if(this.AnimalAge == '' && this.chenBaoObj['AnimalAge']!=''){
        //     this.comm.toast('请输入畜龄');
        // }
        else if (this.farmer.value.AnimalWeight == '') {
            this.comm.toast('请输入动物体重');
        } else if (this.farmer.value.FinalMoney == '') {
            this.comm.toast('请输入核定金额');
        } else if (this.farmer.value.DieMessage == {}) {
            this.comm.toast('请选择死亡原因');
        } else if (this.farmer.value.WuHaiHua == '') {
            this.comm.toast('请选择无害化处理方式');
        } else if (this.farmer.value.Scene.length < 3) {
            this.comm.toast('请上传至少三张现场勘查图');
        } else if (this.farmer.value.Harmless.length < 3) {
            this.comm.toast('请上传至少三张无害化处理图');
        } else if (this.farmer.value.Die == '') {
            this.comm.toast('请上传死亡证明');
        } else {

            this.allData['idCard'] = this.farmer.value.idCard;
            this.allData['AnimalId'] = this.farmer.value.AnimalId;
            this.allData['AnimalType'] = this.farmer.value.AnimalType;
            this.allData['AnimalTypeName'] = this.farmer.value.AnimalTypeName;
            this.allData['Varieties'] = this.farmer.value.Varieties;
            this.allData['AnimalVarietyName'] = this.farmer.value.AnimalVarietyName;
            this.allData['AnimalAge'] = this.farmer.value.AnimalAge;
            this.allData['AnimalWeight'] = this.farmer.value.AnimalWeight;
            this.allData['InsuranceAmount'] = this.farmer.value.InsuranceAmount;
            this.allData['FinalMoney'] = this.farmer.value.FinalMoney;
            this.allData['FindAddress'] = this.farmer.value.FindAddress;
            this.allData['FangyiType'] = this.farmer.value.FangyiType;
            this.allData['DieMessage'] = this.farmer.value.DieMessages;
            this.allData['WuHaiHua'] = this.farmer.value.WuHaiHua;
            this.allData['Scene'] = this.farmer.value.Scene.join(',');
            this.allData['Harmless'] = this.farmer.value.Harmless.join(',');
            this.allData['ForDie'] = this.farmer.value.Die;
            this.allData['Other'] = this.farmer.value.OtherPic ? this.farmer.value.OtherPic.join(',') : [].join(',');
            this.allData['GPS'] = this.GPS;
            this.allData['lhGuid'] = lhGuid;
            let date = new Date();
            let year = date.getFullYear();
            let mon = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            this.allData['Time'] = year + '/' + mon + '/' + day + '/' + hour;
            this.allData['Isloc'] = '1';
            this.allData['uid'] = JSON.parse(localStorage.getItem('user')).RealName;
            this.sql.selecTableIDs('DeclareClaimTable', 'AnimalId', self.AnimalId).then(infos => {
                if (infos.length != 0) {
                    self.comm.toast('该标签号已存在本地');
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
                                    console.log(self.allData,'qq')
                                    self.sql.newinster('DeclareClaimTable', self.allData).then(res => {
                                        console.log(res)
                                        self.farmer.controls['AnimalType'].setValue('');
                                        self.farmer.controls['AnimalId'].setValue('');
                                        self.farmer.controls['AnimalTypeName'].setValue('');
                                        self.farmer.controls['Varieties'].setValue('');
                                        self.farmer.controls['AnimalVarietyName'].setValue('');
                                        self.farmer.controls['AnimalAge'].setValue('');
                                        self.farmer.controls['AnimalWeight'].setValue('');
                                        self.farmer.controls['InsuranceAmount'].setValue('');
                                        self.farmer.controls['FindAddress'].setValue('');
                                        self.chenBaoObj = {};
                                        self.farmer.controls['FinalMoney'].setValue('');
                                        self.isScene = false;
                                        self.farmer.controls['Scene'].setValue('');
                                        self.isHarmless = false;
                                        self.farmer.controls['Harmless'].setValue('');
                                        self.isDie = false;
                                        self.farmer.controls['Die'].setValue('');
                                        self.isOtherPic = false;
                                        self.farmer.controls['OtherPic'].setValue('');
                                        self.farmer.controls['FangyiType'].setValue('');
                                        self.farmer.controls['dieType'].setValue('');
                                        self.farmer.controls['DieMessages'].setValue('');
                                        self.farmer.controls['WuHaiHua'].setValue('');
                                        self.comm.toast('保存成功');
                                        localStorage.removeItem('lipei1');
                                    }).catch(mess => {
                                        console.log(mess);
                                    });
                                }
                            }
                        ]
                    });
                    confirm.present();
                }
            });

        }
    }

    gotoCameraPage() {
        this.navCtrl.push('CameraPage');
    }

    saoyisao() {
        if (window['cordova']) {
            window['cordova'].plugins.barcodeScanner
            .scan((res) => {
                if (res.text.length != 15) {
                    this.comm.toast('请扫描正确的条码');
                } else {
                    this.farmer.controls['AnimalId'].setValue(res.text);
                    this.getSomeInfo();
                }
            }, (e) => {
                console.log(e)
            });
        }
    }

    intv: any;

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
                                        let ss = this.comm.rfidDecode(mess, null);
                                        this.farmer.controls['AnimalId'].setValue(ss);
                                        this.getSomeInfo();
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
                                        let ss = this.comm.rfidDecode(mess, null);
                                        this.farmer.controls['AnimalId'].setValue(ss);
                                        this.getSomeInfo();
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
                                                let ss = this.comm.rfidDecode(mess, null);
                                                this.farmer.controls['AnimalId'].setValue(ss);
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
                                                    let ss = this.comm.rfidDecode(mess, null);
                                                    this.farmer.controls['AnimalId'].setValue(ss);
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
            this.bluetoothSerial.enable().then(res => {
            }).catch(e => {
                console.log(e)
            });
        });
    }
}
