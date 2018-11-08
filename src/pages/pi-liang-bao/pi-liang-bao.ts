import { ApplicationRef, Component, ViewChild } from '@angular/core';
import {
    AlertController, IonicPage, LoadingController, ModalController, NavController,
    NavParams
} from 'ionic-angular';
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { GpsComponent } from "../../components/gps/gps";
import { File } from "@ionic-native/file";
import { FileTransfer/*, FileTransferObject*/ } from "@ionic-native/file-transfer";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ModalPage } from "../modal/modal";

@IonicPage()
@Component({
    selector: 'page-pi-liang-bao',
    templateUrl: 'pi-liang-bao.html',
})
export class PiLiangBaoPage {
    @ViewChild(GpsComponent) gps: GpsComponent;
    @ViewChild(ModalPage) modal: ModalPage;
    data: object;
    farmlist: Array<any>;
    FramPeopleId: any;
    UrlList: Array<any>;
    objects: any;
    AnimalTypes: any;
    VarietyNames: any;
    beput: boolean;
    beselec: boolean;
    bea: boolean;
    SelfPremium: any;
    ratelist: Array<any>;
    isAnimalAge: boolean;
    isAnimalWeight: boolean;
    showBottom: boolean;
    BreedType: Array<any>;
    citylist: Array<any>;
    OtherPic: Array<any>;
    modals: any;
    isOtherPic: boolean;
    OtherPicUrl: any;
    OtherPicLen: any;
    isimgOne: boolean;
    isimgTwo: boolean;
    isimgThree: boolean;
    modalsss: any;
    provice: any;
    moreAddr: string;
    breedTypesss: any;
    mainpeimin: any;
    mainpeimax: any;
    baoemin: any;
    baoemax: any;
    isExemption: boolean;
    isa: boolean;
    isput: boolean;
    page: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public comm: CommonServiceProvider, public http: AuthServiceProvider, public transfer: FileTransfer, public file: File, public loadingCtrl: LoadingController, public modalCtrl: ModalController, private sqlite: SqllistServiceProvider, public applicationRef: ApplicationRef, private photoViewer: PhotoViewer) {
        this.data = {};
        this.page = "pi-liang-bao";
        this.UrlList = [{}];
        this.sqlite.selectTableAllfofi('inframmessage', 4, 5).then(res => {
            this.farmlist = this.listsss(res);
        }).catch(err => {
            console.log(err);
        });
        this.isAnimalAge = false;
        this.isAnimalWeight = false;
        this.BreedType = JSON.parse(localStorage.getItem('BreedType'));
        this.citylist = JSON.parse(localStorage.getItem('GetAreaTree'));

        document.addEventListener('resume', () => {
            let data = JSON.parse(localStorage.getItem(this.page));
            this.UrlList = data['UrlList'];
            this.data = data;
        }, false);

        document.addEventListener('pause', () => {
            this.data['UrlList'] = this.UrlList;
            localStorage.setItem(this.page, JSON.stringify(this.data));
        }, false);
        this.data = localStorage.getItem(this.page) ? JSON.parse(localStorage.getItem(this.page)) : {};
        let datas = localStorage.getItem(this.page);
        if (datas) {
            this.FarmPeopleIdChange(JSON.parse(datas).FramPeopleId);
            if (JSON.parse(datas)['UrlList']) {
                this.UrlList = JSON.parse(datas)['UrlList'];
            }
        }
        this.isimgOne = this.data['Animals1Url'] ? true : false;
        this.isimgTwo = this.data['Animals2Url'] ? true : false;
        this.isimgThree = this.data['Animals3Url'] ? true : false;
        this.isOtherPic = this.data['AnimalsotherUrl'] ? true : false;
    }

    gotoCameraPage() {
        this.navCtrl.push('CameraPage');
    }

    peopeleId(v1, v2) {
        return v1 && v2 ? v1.FramPeopleID === v2.FramPeopleID : v1 === v2;
    }

    breedTypes(v1, v2) {
        return v1 && v2 ? v1.Id === v2.Id : v1 === v2;
    }

    provices(v1, v2) {
        return v1 && v2 ? v1.id === v2.id : v1 === v2;
    }

    listsss(res) {
        let list = [];
        for (let i = 0; i < res.length; i++) {
            if (res[i].name.FramType != '3') {
                list.push(res[i].name);
            } else {
                let k = JSON.parse(res[i].name.farmsmessage);
                for (let j = 0; j < k.length; j++) {
                    list.push(k[j]);
                }
            }
        }
        return list;
    }

    imgOne(item) {
        if (this.isimgOne) {
            this.photoViewer.show(this.data['Animals1Url']);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.data['Animals1Url'] = res + '';
                this.isimgOne = true;
            })
        }
    }

    imgTwo(item) {
        if (this.isimgTwo) {
            this.photoViewer.show(this.data['Animals2Url']);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.data['Animals2Url'] = res + '';
                this.isimgTwo = true;
            })
        }
    }

    imgThree(item) {
        if (this.isimgThree) {
            this.photoViewer.show(this.data['Animals3Url']);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.data['Animals3Url'] = res + '';
                this.isimgThree = true;
            })
        }
    }

    backsssss = (_params, item) => {
        return new Promise((resolve, reject) => {
            this.UrlList[item]['OtherPicss'] = _params;
            resolve();
        });
    };

    gotoother(index) {
        this.modalsss = this.modalCtrl.create('ModalPage', {
            callback: this.backsssss,
            OtherPic: this.UrlList[index]['OtherPicss'] == undefined ? [] : this.UrlList[index]['OtherPicss'],
            index: index,
            isOtherPic: this.UrlList[index]['OtherPicss'] != undefined
        });
        this.modalsss.present();
    }

    fa(index) {
        switch (index) {
            case 1:
                this.isimgOne = false;
                break;
            case 2:
                this.isimgTwo = false;
                break;
            case 3:
                this.isimgThree = false;
                break;
            case 4:
                this.isOtherPic = false;
                break;
        }
    }

    FarmPeopleIdChange(obj) {
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
                    // this.data['Exemption'] = null;
                } else {
                    this.isa = false;
                    this.isput = true;
                    // this.data['Exemption'] = null;
                }
            }
            /***********保额的限制***********/
            if (this.objects.InsuranceAmount.indexOf('-') > -1) {
                this.beput = true;
                this.beselec = false;
                this.bea = false;
                let lists = this.objects.InsuranceAmount.split('-');
                this.baoemin = lists[0];
                this.baoemax = lists[1];
                // this.data['Insuredamount'] = 0;
            } else {
                if (this.objects.InsuranceAmount.indexOf('/') > -1) {
                    this.beput = false;
                    this.beselec = true;
                    this.bea = false;
                    this.baoemin = null;
                    this.baoemax = null;
                    this.SelfPremium = this.objects.InsuranceAmount.split('/');
                    this.data['Insuredamount'] = this.SelfPremium[0];
                } else {
                    this.beput = false;
                    this.beselec = false;
                    this.bea = true;
                    this.baoemin = null;
                    this.baoemax = null;
                    this.data['Insuredamount'] = this.objects.InsuranceAmount;
                }
            }
            /***********费率的限制***********/
            this.ratelist = this.objects.InsuranceRate.split('/');
            this.data['rate'] = this.ratelist[0];
            this.data['TotalPremium'] = this.data['Insuredamount'] * (this.data['rate'] / 100);
            this.data['SelfPayPremium'] = this.data['TotalPremium'] * (this.objects.FarmRate / 100);
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

    backsss = (_params) => {
        return new Promise((resolve, reject) => {
            if (_params.length == 0) {
                this.isOtherPic = false;
            } else {
                this.isOtherPic = true;
                this.data['AnimalsotherUrl'] = _params;
                this.OtherPicLen = _params.length;
            }
            resolve();
        });
    };

    OtherC() {
        this.modals = this.modalCtrl.create('ModalPage', {
            callback: this.backsss,
            OtherPic: this.data['AnimalsotherUrl'] == undefined ? [] : this.data['AnimalsotherUrl'],
            isOtherPic: this.isOtherPic
        });
        this.modals.present();
    }

    listimgone(index) {
        if (this.UrlList[index]['imgOne']) {
            this.photoViewer.show(this.UrlList[index]['imgOne']);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.UrlList[index]['imgOne'] = res + '';
            })
        }
    }

    listimgtwo(index) {
        if (this.UrlList[index]['imgTwo']) {
            this.photoViewer.show(this.UrlList[index]['imgTwo']);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.UrlList[index]['imgTwo'] = res + '';
            })
        }
    }

    listimgthree(index) {
        if (this.UrlList[index]['imgThree']) {
            this.photoViewer.show(this.UrlList[index]['imgThree']);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.UrlList[index]['imgThree'] = res + '';
            })
        }
    }

    flchange(rate) {
        this.data['TotalPremium'] = (this.data['Insuredamount'] * (rate / 100)).toFixed(2);
        this.data['SelfPayPremium'] = (this.data['TotalPremium'] * (this.objects.FarmRate / 100)).toFixed(2);
    }

    addlll() {
        let li = {};
        this.UrlList.push(li);
    }

    fas(item, index) {
        switch (item) {
            case 1:
                this.UrlList[index].imgOne = null;
                break;
            case 2:
                this.UrlList[index].imgTwo = null;
                break;
            case 3:
                this.UrlList[index].imgThree = null;
                break;
            case 4:
                this.UrlList[index].OtherPicss = null;
                break;
        }
    }

    saveBtn() {
        let boo = this.UrlList[0];
        if (this.data['FramPeopleId'] == undefined) {
            this.comm.toast('请选择身份证/机构代码');
        } else if (this.data['StartAnimalIds'] == undefined) {
            this.comm.toast('请输入动物的起始号段');
        } else if (this.data['EndAnimalIds'] == undefined) {
            this.comm.toast('请输入动物的结束号段');
        } else if (this.data['AnimalTypes'] == undefined) {
            this.comm.toast('请选择动物的类型');
        } else if (this.data['VarietyNames'] == undefined) {
            this.comm.toast('请选择动物的品种');
        } else if (this.data['parity'] == undefined && this.objects.Variety == '11356728243392512') {
            this.comm.toast('请输入动物的胎次');
        } else if (this.data['AnimalAge'] == undefined && this.isAnimalAge) {
            this.comm.toast('请输入畜龄');
        } else if (this.data['AnimalWeight'] == undefined && this.isAnimalWeight) {
            this.comm.toast('请输入动物的体重');
        } else if (this.data['Insuredamount'] == undefined) {
            this.comm.toast('请输入您的保额')
        } else if (this.data['rate'] == undefined) {
            this.comm.toast('请输入您的费率')
        } else if (this.data['SelfPayPremium'] == undefined) {
            this.comm.toast('请输入您的农户自交保费')
        } else if (this.data['TotalPremium'] == undefined) {
            this.comm.toast('请输入您的总保费')
        } else if (this.data['breedTypesss'] == undefined) {
            this.comm.toast('请选择您的养殖方式')
        } else if (this.data['provice'] == undefined) {
            this.comm.toast('请选择您的养殖地点')
        } else if (this.data['moreAddr'] == undefined) {
            this.comm.toast('请输入详细地址')
        } else if (!this.isimgOne) {
            this.comm.toast('请拍摄照片一')
        } else if (!this.isimgTwo) {
            this.comm.toast('请拍摄照片二')
        } else if (!this.isimgThree) {
            this.comm.toast('请拍摄照片三')
        } else if (boo['imgOne'] == undefined || boo['imgTwo'] == undefined || boo['imgThree'] == undefined || boo['AnimalID'] == undefined) {
            this.comm.toast('请录入至少一组动物的相关信息')
        } else {
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: '提交前请仔细核对，确保上传数据准确无误。',
                buttons: [
                    {
                        text: '返回检查',
                        handler: () => {
                            this.sqlite.selectTableAll('PiliangUnderwriting').then(res => {
                                console.log(res);
                            })
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
                            this.data['FramPeopleId'] = this.data['FramPeopleId'].FramPeopleID;
                            this.data['FramGuid'] = this.data['FramPeopleId'].FramGuid;
                            for (let i = 0; i < this.UrlList.length; i++) {
                                if (this.UrlList[i]['OtherPicss'] == undefined) {
                                    this.UrlList[i]['OtherPicss'] = '';
                                } else {
                                    this.UrlList[i]['OtherPicss'] = this.UrlList[i]['OtherPicss'].join();
                                }
                            }
                            this.data['AnimalList'] = JSON.stringify(this.UrlList);
                            this.data['AnimalsotherUrl'] = this.data['AnimalsotherUrl'] == undefined ? '' : this.data['AnimalsotherUrl'].join();
                            this.data['breedadd'] = `${this.data['provice'].id},${this.data['provice'].name}${this.data['moreAddr']}`;
                            this.data['breedType'] = `${this.data['breedTypesss'].Id},${this.data['breedTypesss'].Name}`;
                            this.data['AnimalType'] = `${this.objects.AnimalType},${this.objects.AnimalTypeName}`;
                            this.data['Varieties'] = `${this.objects.Variety},${this.objects.VarietyeName}`;
                            this.data['Isloc'] = 1;
                            delete this.data['AnimalTypes'];
                            delete this.data['VarietyNames'];
                            delete this.data['breedTypesss'];
                            delete this.data['moreAddr'];
                            delete this.data['provice'];
                            delete this.data['UrlList'];
                            this.sqlite.newinster('PiliangUnderwriting', this.data).then(res => {
                                this.comm.toast('保存成功');
                                localStorage.removeItem(this.page);
                                this.navCtrl.pop();
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

    ionViewWillLeave() {
        localStorage.setItem(this.page, JSON.stringify(this.data));
    }

    startBlur() {
        this.showBottom = false;
        this.sqlite.selectAnimalstartNum(this.FramPeopleId.FramPeopleID, this.data['StartAnimalIds']).then(res => {
            console.log(res);
            if (res.length != 0) {
                this.comm.toast('您输入的号段已经录入过了，请勿重复录入');
                this.data['StartAnimalIds'] = null;
            }
        }).catch(err => {
            console.log(err);
        })
    }

    unamefocus() {
        this.showBottom = true;
    }

    unameBlur() {
        this.showBottom = false;
    }

    baoeBlur() {
        this.showBottom = true;
        this.data['TotalPremium'] = (this.data['Insuredamount'] * (this.data['rate'] / 100)).toFixed(2);
        this.data['SelfPayPremium'] = (this.data['TotalPremium'] * (this.objects['FarmRate'] / 100)).toFixed(2);

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
            if (list.length != 0) {
                if (!(list[0] <= this.data['AnimalAge'] && this.data['AnimalAge'] <= list[1])) {
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
                if (!(list[0] < this.data['AnimalAge'] < list[1])) {
                    this.comm.toast(`你输入的畜龄应大于等于${list[0]}小于等于${list[1]}`);
                }
            }
        } else {
            this.comm.toast('请输入正确的体重');
        }
    }

    animalblur(index) {
        if (this.data['StartAnimalIds'] == null && this.data['EndAnimalIds'] == null) {
            this.comm.toast('请输入动物的起始号段或者结束号段');
        } else if (this.data['StartAnimalIds'] > this.UrlList[index]['AnimalID'] || this.data['EndAnimalIds'] < this.UrlList[index]['AnimalID']) {
            this.comm.toast('输入的动物标签号，应在起始号段和结束号段之间');
            this.UrlList[index]['AnimalID'] = null;
        }
    }
}
