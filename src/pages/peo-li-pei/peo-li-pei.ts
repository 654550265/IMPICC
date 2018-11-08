import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { GpsComponent } from "../../components/gps/gps";
import { DatePicker } from "@ionic-native/date-picker";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { InsuredFarmerView } from "../../model/InsuredFarmer-view";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Lipei_view } from './../../model/Lipei_view';
import { FormControl, FormGroup } from '@angular/forms';

/**
 * Generated class for the PeoLiPeiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-peo-li-pei',
    templateUrl: 'peo-li-pei.html',
})
export class PeoLiPeiPage {
    @ViewChild(GpsComponent) gps: GpsComponent;
    InsuredF: InsuredFarmerView;
    modals: any;
    showBottom: boolean;
    farmer: FormGroup;
    Lipei_local: Lipei_view;

    constructor(public navCtrl: NavController, public navParams: NavParams, public datePicker: DatePicker, public comm: CommonServiceProvider, public modalCtrl: ModalController, public sqllite: SqllistServiceProvider, public alertCtrl: AlertController, private photoViewer: PhotoViewer) {
        let self = this;
        this.showBottom = true;
        this.InsuredF = new InsuredFarmerView();
        this.sqllite.selecTableIDs('inframmessage', 'Isloc', '2').then(res => {
            let sarr = [];
            for(let i = 0;i<res.length;i++){
                if(res[i].name.insuranceId!=''){
                    sarr.push(res[i])
                }
            }
            self.InsuredF.BaoDan = sarr;
            self.InsuredF.BaoNameList = [];
            if (res[0].name.FramType == 3) {

            } else {
                self.InsuredF.BaoNameList = [{FramName: res[0].name.FramName}]
            }

        }).catch(err => {
            console.log(err, '2')
        });
        this.Lipei_local = localStorage.getItem('lipei') ? JSON.parse(localStorage.getItem('lipei')) : new Lipei_view();
        this.farmer = new FormGroup({
            insuranceId: new FormControl(this.Lipei_local.insuranceId),
            name: new FormControl(this.Lipei_local.name),
            idCard: new FormControl(this.Lipei_local.idCard),
            address: new FormControl(this.Lipei_local.address),
            bankAccount: new FormControl(this.Lipei_local.bankAccount),
            bankName: new FormControl(this.Lipei_local.bankName),
            accountType:new FormControl(this.Lipei_local.accountType),
            contactNumber:new FormControl(this.Lipei_local.contactNumber),
            BanNum:new FormControl(this.Lipei_local.BanNum),
            remarks:new FormControl(this.Lipei_local.remarks),
            FramIDFont:new FormControl(this.Lipei_local.FramIDFont),
            FramIDBack:new FormControl(this.Lipei_local.FramIDBack),
            VaccinationCertificateImg:new FormControl(this.Lipei_local.VaccinationCertificateImg),
            InstitutionCodeImg:new FormControl(this.Lipei_local.InstitutionCodeImg),
            BankCardImg:new FormControl(this.Lipei_local.BankCardImg),
            vaccinationCertificateImgs:new FormControl(this.Lipei_local.vaccinationCertificateImgs),
            endTime:new FormControl(this.Lipei_local.endTime),
            startTime:new FormControl(this.Lipei_local.startTime),
            reportDate:new FormControl(this.Lipei_local.reportDate),
            outDate:new FormControl(this.Lipei_local.outDate),
            FramType:new FormControl(this.Lipei_local.FramType),
        });
        if(this.Lipei_local.FramIDFont&&this.Lipei_local.FramIDFont!=''){
            this.InsuredF.isFontCard = true;
        }
        if(this.Lipei_local.FramIDBack&&this.Lipei_local.FramIDBack!=''){
            this.InsuredF.isBackCard = true;
        }
        if(this.Lipei_local.VaccinationCertificateImg&&this.Lipei_local.VaccinationCertificateImg!=''){
            this.InsuredF.isVaccinationCertificateImg = true;
        }
        if(this.Lipei_local.InstitutionCodeImg&&this.Lipei_local.InstitutionCodeImg!=''){
            this.InsuredF.isInstitutionCodeImg = true;
        }
        if(this.Lipei_local.BankCardImg&&this.Lipei_local.BankCardImg!=''){
            this.InsuredF.isBackCardF = true;
        }
        if(this.Lipei_local.vaccinationCertificateImgs&&this.Lipei_local.vaccinationCertificateImgs!=''){
            this.InsuredF.isOtherPic = true;
            this.InsuredF.OtherPicLen = this.Lipei_local.vaccinationCertificateImgs.length;
        }
        if(this.Lipei_local.insuranceId){
            this.chooseBaoDan()
        }
        // if(this.Lipei_local.name){
        //     setTimeout(function () {
        //         self.chooseName()
        //     },2000)
        //
        // }
        this.farmer.controls['FramType'].setValue('1');
        this.onChanges();
    }
    onChanges(): void {
        this.farmer.valueChanges.subscribe(val => {
            localStorage.setItem('lipei', JSON.stringify(val));
        });
    }
    chooseBaoDan() {
        let self = this;
        this.farmer.controls['insuranceId'].setValue(this.farmer.value.insuranceId);
        this.sqllite.selecTableIDAll('inframmessage', 'Isloc', '2', 'insuranceId', this.farmer.value.insuranceId).then(res => {
            let arr = res;
            if (arr[0].name.FramType == '3') {//团体，可以选择被保险人
                self.InsuredF.canChooseName = true;
                self.InsuredF.BaoNameList = JSON.parse(arr[0].name.farmsmessage);
                let newArr = self.comm.arrayUnique2(self.InsuredF.BaoNameList, 'FramName');
                if (newArr.length < self.InsuredF.BaoNameList.length) {//名字有重复
                    self.InsuredF.quchongArr = self.InsuredF.BaoNameList;
                    self.InsuredF.BaoNameList = newArr;
                }
                self.farmer.controls['FramType'].setValue('3');
            } else {
                self.InsuredF.canChooseName = false;
                self.farmer.controls['name'].setValue(arr[0].name.FramName);
                self.farmer.controls['idCard'].setValue(arr[0].name.FramPeopleID);
                self.farmer.controls['bankName'].setValue(arr[0].name.FramBank + arr[0].name.branch);
                self.farmer.controls['bankAccount'].setValue(arr[0].name.banknum);
                self.farmer.controls['startTime'].setValue(arr[0].name.starttime.substring(0, 10));
                self.farmer.controls['endTime'].setValue(arr[0].name.endtime.substring(0, 10));
                self.farmer.controls['contactNumber'].setValue(arr[0].name.FramTel);
                self.farmer.controls['address'].setValue(arr[0].name.addr.split(',')[1]);
                self.farmer.controls['FramIDFont'].setValue(arr[0].name.FramIDFontUrl);
                self.farmer.controls['FramIDBack'].setValue(arr[0].name.FramIDBackUrl);
                self.farmer.controls['VaccinationCertificateImg'].setValue(arr[0].name.fyzgzUrl);
                self.farmer.controls['InstitutionCodeImg'].setValue(arr[0].name.jgdmUrl);
                self.farmer.controls['BankCardImg'].setValue(arr[0].name.BankCardUrl);
                self.farmer.controls['FramType'].setValue(arr[0].name.FramType);
                self.InsuredF.isFontCard = true;
                self.InsuredF.isBackCard = true;
                self.InsuredF.isVaccinationCertificateImg = true;
                self.InsuredF.isInstitutionCodeImg = true;
                self.InsuredF.isBackCardF = true;
            }
            self.onChanges();
        });
    }

    chooseName() {
        let arr = this.InsuredF.BaoNameList;
        let name = this.farmer.value.name;
        let datas = this.InsuredF.BaoDan;
        let self = this;
        self.InsuredF.peopleArr = [];
        this.farmer.controls['name'].setValue(this.farmer.value.name);
        if (this.InsuredF.quchongArr.length != 0) {
            let x = 0;
            for (let s = 0; s < self.InsuredF.quchongArr.length; s++) {
                if (self.InsuredF.quchongArr[s].FramName == name) {
                    x++;
                    self.InsuredF.peopleArr.push(self.InsuredF.quchongArr[s]);
                }
            }
            if (x >= 2) {
                this.InsuredF.canPeopleId = true;
                self.farmer.controls['idCard'].setValue('');
                self.farmer.controls['contactNumber'].setValue('');
                self.farmer.controls['bankName'].setValue('');
                self.farmer.controls['startTime'].setValue('');
                self.farmer.controls['endTime'].setValue('');
                self.farmer.controls['FramIDFont'].setValue('');
                self.farmer.controls['FramIDBack'].setValue('');
                self.farmer.controls['VaccinationCertificateImg'].setValue('');
                self.farmer.controls['InstitutionCodeImg'].setValue('');
                self.farmer.controls['BankCardImg'].setValue('');
                self.InsuredF.isFontCard = false;
                self.InsuredF.isBackCard = false;
                self.InsuredF.isVaccinationCertificateImg = false;
                self.InsuredF.isInstitutionCodeImg = false;
                self.InsuredF.isBackCardF = false;
            } else {
                this.InsuredF.canPeopleId = false;
                for (let i = 0; i < arr.length; i++) {
                    if (name == arr[i].FramName) {
                        self.farmer.controls['idCard'].setValue(arr[i].FramPeopleID);
                        self.farmer.controls['contactNumber'].setValue(arr[i].FramTel);
                        self.farmer.controls['bankName'].setValue(arr[i].FramBank + arr[i].branch);
                        self.farmer.controls['startTime'].setValue(datas[0].name.starttime.substring(0, 10));
                        self.farmer.controls['endTime'].setValue(datas[0].name.endtime.substring(0, 10));
                        self.farmer.controls['FramIDFont'].setValue(arr[i].FramIDFontUrl);
                        self.farmer.controls['FramIDBack'].setValue(arr[i].FramIDBackUrl);
                        self.farmer.controls['VaccinationCertificateImg'].setValue(arr[i].fyzgzUrl);
                        self.farmer.controls['InstitutionCodeImg'].setValue(null);
                        self.farmer.controls['BankCardImg'].setValue(arr[i].BankCardUrl);
                        self.InsuredF.isFontCard = true;
                        self.InsuredF.isBackCard = true;
                        self.InsuredF.isVaccinationCertificateImg = true;
                        self.InsuredF.isInstitutionCodeImg = true;
                        self.InsuredF.isBackCardF = true;
                        break;
                    }
                }
            }
        } else {
            for (let i = 0; i < arr.length; i++) {
                if (name == arr[i].FramName) {
                    self.farmer.controls['idCard'].setValue(arr[i].FramPeopleID);
                    self.farmer.controls['contactNumber'].setValue(arr[i].FramTel);
                    self.farmer.controls['bankName'].setValue(arr[i].FramBank + arr[i].branch);
                    self.farmer.controls['startTime'].setValue(datas[0].name.starttime.substring(0, 10));
                    self.farmer.controls['endTime'].setValue(datas[0].name.endtime.substring(0, 10));
                    self.farmer.controls['FramIDFont'].setValue(arr[i].FramIDFontUrl);
                    self.farmer.controls['FramIDBack'].setValue(arr[i].FramIDBackUrl);
                    self.farmer.controls['VaccinationCertificateImg'].setValue(arr[i].fyzgzUrl);
                    self.farmer.controls['InstitutionCodeImg'].setValue(null);
                    self.farmer.controls['BankCardImg'].setValue(arr[i].BankCardUrl);
                    self.InsuredF.isFontCard = true;
                    self.InsuredF.isBackCard = true;
                    self.InsuredF.isVaccinationCertificateImg = true;
                    self.InsuredF.isInstitutionCodeImg = true;
                    self.InsuredF.isBackCardF = true;
                    break;
                }
            }
        }

    }

    chooseIdCard() {
        let self = this;
        let arr = this.InsuredF.quchongArr;
        let datas = this.InsuredF.BaoDan;
        let id = this.farmer.value.idCard;
        this.farmer.controls['idCard'].setValue(this.farmer.value.idCard);
        for (let i = 0; i < arr.length; i++) {
            if (id == arr[i].FramPeopleID) {
                console.log(id,arr[i])
                self.farmer.controls['contactNumber'].setValue(arr[i].FramTel);
                self.farmer.controls['bankName'].setValue(arr[i].FramBank + arr[i].branch);
                self.farmer.controls['startTime'].setValue(datas[0].name.starttime.substring(0, 10));
                self.farmer.controls['endTime'].setValue(datas[0].name.endtime.substring(0, 10));
                self.farmer.controls['FramIDFont'].setValue(arr[i].FramIDFontUrl);
                self.farmer.controls['FramIDBack'].setValue(arr[i].FramIDBackUrl);
                self.farmer.controls['VaccinationCertificateImg'].setValue(arr[i].fyzgzUrl);
                self.farmer.controls['InstitutionCodeImg'].setValue(null);
                self.farmer.controls['BankCardImg'].setValue(arr[i].BankCardUrl);
                self.InsuredF.isFontCard = true;
                self.InsuredF.isBackCard = true;
                self.InsuredF.isVaccinationCertificateImg = true;
                self.InsuredF.isInstitutionCodeImg = true;
                self.InsuredF.isBackCardF = true;
                break;
            }
        }
    }

    chooseZhangHu() {
        //选择账户形式
    }

    choosedate() {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            date => {
                let starttime = this.comm.dateFormat(date, 'yyyy-MM-dd');
                if (this.InsuredF.outDate != '') {
                    let ba = new Date(starttime).getTime();
                    let cx = new Date(this.InsuredF.outDate).getTime();
                    if (ba > cx) {
                        this.comm.toast('报案日期需大于等于出险日期');
                    } else {
                        this.farmer.controls['reportDate'].setValue(starttime);
                    }
                } else {
                    this.farmer.controls['reportDate'].setValue(starttime);
                }
            },
            err => {
                console.log('Error occurred while getting date: ', err)
            }
        );
    }

    chooseCxdate() {
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            date => {
                let starttime = this.comm.dateFormat(date, 'yyyy-MM-dd');
                // a =a.replace(/\//g,'-');
                let time1 = new Date(this.InsuredF.startTime).getTime();//起保时间
                let time2 = new Date(this.InsuredF.endTime).getTime();//终保时间
                let cx = new Date(starttime).getTime();//出险时间
                if (cx < time1 || cx > time2) {
                    this.comm.toast('出险日期需在保险期间');
                } else if (this.InsuredF.reportDate != '请选择报案日期') {
                    let ba = new Date(this.InsuredF.reportDate).getTime();
                    if (ba > cx) {
                        this.comm.toast('报案日期需大于等于出险日期');
                    } else {
                        this.farmer.controls['outDate'].setValue(starttime);
                    }
                } else {
                    this.farmer.controls['outDate'].setValue(starttime);
                }

            },
            err => {
                console.log('Error occurred while getting date: ', err)
            }
        );
    }
    chooseTime(ele){
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            date => {
                let s = this.comm.dateFormat(date, 'yyyy-MM-dd');
                if(ele == 1){
                    this.InsuredF.endTime = s;
                    this.farmer.controls['endTime'].setValue(s);
                }else{
                    this.InsuredF.startTime = s;
                    this.farmer.controls['startTime'].setValue(s);
                }
            },
            err => {
                console.log('Error occurred while getting date: ', err)
            }
        );
    }

    OtherC() {
        if(this.farmer.value.vaccinationCertificateImgs == ''){
            this.farmer.controls['vaccinationCertificateImgs'].setValue([]);
        }
        this.modals = this.modalCtrl.create('ModalPage', {
            callback: this.backsss,
            OtherPic: this.farmer.value.vaccinationCertificateImgs,
            isOtherPic: this.InsuredF.isOtherPic,
            name: '兽医资格证'
        });
        this.modals.present();
    }

    backsss = (_params) => {
        return new Promise((resolve, reject) => {
            if (!_params.length) {
                this.InsuredF.isOtherPic = false;
            } else {
                this.InsuredF.isOtherPic = true;
                this.InsuredF.OtherPicLen = _params.length;
                this.farmer.controls['vaccinationCertificateImgs'].setValue(_params);
            }
            resolve();
        });
    };

    OCR(type,ele) {
        switch (ele){
            case 2:
                this.comm.OCR(type).then(info => {
                    this.farmer.controls['name'].setValue(info['name']);
                    this.farmer.controls['idCard'].setValue(info['id']);
                    this.farmer.controls['FramIDFont'].setValue(info['imgs']);
                    this.InsuredF.isFontCard = true;
                });
                break;
            case 3:
                this.comm.OCR(type).then(info => {
                    this.farmer.controls['bankAccount'].setValue(info['BankNum']);
                    this.farmer.controls['bankName'].setValue(info['BankName'].split('(')[0]);
                    this.farmer.controls['BankCardImg'].setValue(info['imgs']);
                    this.InsuredF.isBackCardF = true;
                });
                break;
        }

    }

    fa(ele) {
        switch (ele) {
            case 1:
                this.InsuredF.isFontCard = false;
                this.farmer.controls['FramIDFont'].setValue('');
                break;
            case 2:
                this.InsuredF.isBackCard = false;
                this.farmer.controls['FramIDBack'].setValue('');
                break;
            case 3:
                this.InsuredF.isBackCardF = false;
                this.farmer.controls['BankCardImg'].setValue('');
                break;
            case 4:
                this.InsuredF.isVaccinationCertificateImg = false;
                this.farmer.controls['VaccinationCertificateImg'].setValue('');
                break;
            case 5:
                this.InsuredF.isInstitutionCodeImg = false;
                this.farmer.controls['InstitutionCodeImg'].setValue('');
                break;
            case 6:
                this.InsuredF.isOtherPic = false;
                this.farmer.controls['vaccinationCertificateImgs'].setValue('');
                break;
        }
    }

    unamefocus() {
        this.showBottom = false;
    }

    unameBlur() {
        this.showBottom = true;
    }

    looks(ele) {
        switch (ele) {
            case 1:
                if (this.farmer.value.isFontCard) {
                    this.photoViewer.show(this.farmer.value.FramIDFont);
                } else {
                    this.comm.chooseImage(1).then(res => {
                        this.InsuredF.isFontCard = true;
                        this.farmer.controls['FramIDFont'].setValue(res + '');
                    })
                }
                break;
            case 2:
                if (this.farmer.value.isBackCard) {
                    this.photoViewer.show(this.farmer.value.FramIDBack);
                } else {
                    this.comm.chooseImage(1).then(res => {
                        this.InsuredF.isBackCard = true;
                        this.farmer.controls['FramIDBack'].setValue(res + '');
                    })
                }
                break;
            case 3:
                if (this.farmer.value.isBackCardF) {
                    this.photoViewer.show(this.farmer.value.BankCardImg);
                } else {
                    this.comm.chooseImage(1).then(res => {
                        this.InsuredF.isBackCardF = true;
                        this.farmer.controls['BankCardImg'].setValue(res + '');
                    })
                }
                break;
            case 4:
                if (this.farmer.value.isVaccinationCertificateImg) {
                    this.photoViewer.show(this.farmer.value.VaccinationCertificateImg);
                } else {
                    this.comm.chooseImage(1).then(res => {
                        this.InsuredF.isVaccinationCertificateImg = true;
                        this.farmer.controls['VaccinationCertificateImg'].setValue(res + '');
                    })
                }
                break;
            case 5:
                if (this.farmer.value.isInstitutionCodeImg) {
                    this.photoViewer.show(this.farmer.value.InstitutionCodeImg);
                } else {
                    this.comm.chooseImage(1).then(res => {
                        this.InsuredF.isInstitutionCodeImg = true;
                        this.farmer.controls['InstitutionCodeImg'].setValue(res + '');
                    })
                }
                break;
        }
    }
    onSubmit(){
        console.log(this.farmer.value);
        // localStorage.removeItem('lipei');
    }
    tijiao() {
        let self = this;
        this.InsuredF.GPS = this.gps.long + '|' + this.gps.lat;
        this.InsuredF.FramGuid = this.comm.newGuid();
        let reg = /1[0-9]{10}/;
        if (this.farmer.value.insuranceId == "") {
            this.comm.toast('请输入保单号');
        } else if (this.farmer.value.name == "") {
            this.comm.toast('请输入被保险人');
        } else if (this.farmer.value.idCard == "") {
            this.comm.toast('请输入身份证号');
        } else if (this.farmer.value.bankName == "") {
            this.comm.toast('请输入开户行');
        } else if (this.farmer.value.bankAccount == "") {
            this.comm.toast('请输入银行账号');
        } else if (this.farmer.value.accountType == "") {
            this.comm.toast('请选择账户形式');
        } else if (this.farmer.value.BanNum == "") {
            this.comm.toast('请输入报案号');
        }else if (this.farmer.value.startTime == "请选择起保时间") {
            this.comm.toast('请选择起保时间');
        }else if (this.farmer.value.endTime == "请选择终保时间") {
            this.comm.toast('请选择终保时间');
        }else if (this.farmer.value.reportDate == "请选择报案时间") {
            this.comm.toast('请选择报案时间');
        } else if (this.farmer.value.outDate == "请选择出险日期") {
            this.comm.toast('请选择出险日期');
        } else if (this.farmer.value.contactNumber == "") {
            this.comm.toast('请输入联系电话');
        } else if (!reg.test(this.farmer.value.contactNumber)) {
            this.comm.toast('请输入正确的手机号码');
        } else if (this.farmer.value.address == "") {
            this.comm.toast('请选择住址');
        } else if (!this.InsuredF.isFontCard) {
            this.comm.toast('上传身份证正面');
        } else if (!this.InsuredF.isBackCard) {
            this.comm.toast('请上传身份证反面');
        } else if (!this.InsuredF.isBackCardF) {
            this.comm.toast('请上传银行卡照片');
        } else if (!this.farmer.value.vaccinationCertificateImgs || this.farmer.value.vaccinationCertificateImgs.length == 0) {
            this.comm.toast('请上传兽医资格证');
        } else {
            this.sqllite.selecTableIDAllss('InsuredFarmer', 'insuranceId', this.farmer.value.insuranceId, 'Isloc', '1','idCard',this.farmer.value.idCard).then(res => {
                self.InsuredF.datas['FramGuid'] = self.InsuredF.FramGuid;
                self.InsuredF.datas['FramType'] = self.farmer.value.FramType;
                self.InsuredF.datas['GPS'] = self.InsuredF.GPS;
                self.InsuredF.datas['insuranceId'] = self.farmer.value.insuranceId;
                self.InsuredF.datas['name'] = self.farmer.value.name;
                self.InsuredF.datas['idCard'] = self.farmer.value.idCard;
                self.InsuredF.datas['bankName'] = self.farmer.value.bankName;
                self.InsuredF.datas['bankAccount'] = self.farmer.value.bankAccount;
                self.InsuredF.datas['accountType'] = self.farmer.value.accountType;
                self.InsuredF.datas['startTime'] = self.farmer.value.startTime;
                self.InsuredF.datas['endTime'] = self.farmer.value.endTime;
                self.InsuredF.datas['BanNum'] = self.farmer.value.BanNum;
                self.InsuredF.datas['reportDate'] = self.farmer.value.reportDate;
                self.InsuredF.datas['outDate'] = self.farmer.value.outDate;
                self.InsuredF.datas['contactNumber'] = self.farmer.value.contactNumber;
                self.InsuredF.datas['address'] = self.farmer.value.address;
                self.InsuredF.datas['FramIDFont'] = self.farmer.value.FramIDFont;
                self.InsuredF.datas['FramIDBack'] = self.farmer.value.FramIDBack;
                self.InsuredF.datas['VaccinationCertificateImg'] = self.farmer.value.VaccinationCertificateImg;
                self.InsuredF.datas['InstitutionCodeImg'] = self.farmer.value.InstitutionCodeImg;
                self.InsuredF.datas['BankCardImg'] = self.farmer.value.BankCardImg;
                self.InsuredF.datas['vaccinationCertificateImgs'] = self.farmer.value.vaccinationCertificateImgs.join(',');
                self.InsuredF.datas['remarks'] = self.farmer.value.remarks;
                self.InsuredF.datas['Isloc'] = '1';
                self.InsuredF.datas['uid'] = JSON.parse(localStorage.getItem('user')).RealName;
                let date = new Date();
                let year = date.getFullYear();
                let mon = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                self.InsuredF.datas['CreateTime'] = year + '/' + mon + '/' + day + '/' + hour;
                if (res.length == 0) {
                    self.sqllite.newinster('InsuredFarmer', self.InsuredF.datas).then(res => {
                        localStorage.removeItem('lipei');
                        let confirm = self.alertCtrl.create({
                            title: '提示',
                            message: '信息已成功录入，是否采集标的数据',
                            buttons: [
                                {
                                    text: '是',
                                    handler: () => {
                                        self.navCtrl.pop();
                                        self.navCtrl.push('GetLiPeiPage', {
                                            idCard: self.InsuredF.datas['idCard'],
                                            FramGuid: self.InsuredF.datas['FramGuid']
                                        })
                                    }
                                },
                                {
                                    text: '否',
                                    handler: () => {
                                        self.navCtrl.pop();
                                    }
                                }
                            ]
                        });
                        confirm.present();
                    })
                } else {
                    self.comm.toast('该被保险人信息已在本地录入，请勿重复录入');
                }
            })
        }
    }
    gotoCameraPage(){
        this.navCtrl.push('CameraPage');
    }
}
