import { Farmer } from './../../model/Farmer';
import { Component, ViewChild } from '@angular/core';
import {
    ActionSheetController, AlertController, IonicPage, LoadingController, ModalController, NavController,
    NavParams
} from 'ionic-angular';
import { ENV } from "../../config/environment";
import { GpsComponent } from "../../components/gps/gps";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { Camera } from "@ionic-native/camera";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { DatePicker } from "@ionic-native/date-picker";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
    selector: 'page-choose-farm0',
    templateUrl: 'choose-farm0.html',
})
export class ChooseFarm0Page {

    @ViewChild(GpsComponent) gps: GpsComponent;
    Project: Array<any>;
    defpage: string;
    modals: any;
    farmer: FormGroup;
    farmerModel: Farmer;
    ENV: object;

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public camera: Camera, public comm: CommonServiceProvider, public http: AuthServiceProvider, public loadingCtrl: LoadingController, public sqllite: SqllistServiceProvider, public photoViewer: PhotoViewer, public actionSheetCtrl: ActionSheetController, public datePicker: DatePicker, public modalCtrl: ModalController, private fb: FormBuilder) {
        this.ENV = ENV;
        this.Project = [];
        this.defpage = this.navParams.get('defpage');
        this.farmerModel = new Farmer();
        this.farmerModel.FramType = this.navParams.get('type');
        let localFarmer = JSON.parse(localStorage.getItem('farm0'));
        if (localFarmer && localFarmer.insurancetype) {
            this.Project = localFarmer.insurancetype.List;
        }
        this.farmer = this.fb.group({
            FramName: [localFarmer ? localFarmer.FramName : '', Validators.required],
            FramPeopleID: [localFarmer ? localFarmer.FramPeopleID : '', Validators.required],
            provice: [localFarmer ? localFarmer.provice : '', Validators.required],
            moreAddr: [localFarmer ? localFarmer.moreAddr : '', Validators.required],
            banknum: [localFarmer ? localFarmer.banknum : '', Validators.required],
            FramBank: [localFarmer ? localFarmer.FramBank : '', Validators.required],
            branch: [localFarmer ? localFarmer.branch : ''],
            FramTel: [localFarmer ? localFarmer.FramTel : '', Validators.required],
            insurancetype: [localFarmer ? localFarmer.insurancetype : '', Validators.required],
            insurancepro: [localFarmer ? localFarmer.insurancepro : '', Validators.required],
            EarTarNum: [localFarmer ? localFarmer.EarTarNum : '', Validators.required],
            starttime: [localFarmer ? localFarmer.starttime : '', Validators.required],
            endtime: [localFarmer ? localFarmer.endtime : '', Validators.required],
            relationship: [localFarmer ? localFarmer.relationship : '', Validators.required],
            management: [localFarmer ? localFarmer.management : '', Validators.required],
            percent: [localFarmer ? localFarmer.percent : ''],
            dispute: [localFarmer ? localFarmer.dispute : '', Validators.required],
            FramIDFontUrl: [localFarmer ? localFarmer.FramIDFontUrl : '', Validators.required],
            FramIDBackUrl: [localFarmer ? localFarmer.FramIDBackUrl : '', Validators.required],
            BankCardUrl: [localFarmer ? localFarmer.BankCardUrl : '', Validators.required],
            OtherPicUrl: [localFarmer ? localFarmer.OtherPicUrl : []],
            fyzgzUrl: [localFarmer ? localFarmer.fyzgzUrl : '', Validators.required],
            Remarks: [localFarmer ? localFarmer.Remarks : ''],
        });
        this.onChanges();
    }

    onChanges(): void {
        this.farmer.valueChanges.subscribe(val => {
            localStorage.setItem('farm0', JSON.stringify(val));
        });
        this.farmer.get('insurancetype').valueChanges.subscribe(val => {
            this.Project = val.List;
        });
    }

    OCR(type) {
        this.comm.OCR(type).then(info => {
            if (type === 'FramPeopleID') {
                this.farmer.controls['FramPeopleID'].setValue(info['id']);
                this.farmer.controls['FramName'].setValue(info['name']);
                this.farmer.controls['FramIDFontUrl'].setValue(info['imgs']);
            } else {
                this.farmer.controls['banknum'].setValue(info['BankNum']);
                this.farmer.controls['FramBank'].setValue(info['BankName'].split('(')[0]);
                this.farmer.controls['BankCardUrl'].setValue(info['imgs']);
            }
        });
    }

    choosePhoto(type) {
        if (this.farmer.value[type]) {
            this.photoViewer.show(this.farmer.value[type]);
        } else {
            this.comm.chooseImage(1).then(res => {
                this.farmer.controls[type].setValue(res + '');
            });
        }
    }

    deletePhoto(type) {
        if (type === 'OtherPicUrl') {
            this.farmer.controls[type].setValue([]);
        } else {
            this.farmer.controls[type].setValue('');
        }
    }

    gotoCameraPage() {
        this.navCtrl.push('CameraPage');
    }

    choosedate() {
        if (this.farmer.value.insurancepro) {
            this.datePicker.show({
                date: new Date(),
                mode: 'date',
                androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
            }).then(
                date => {
                    let starttime = this.comm.dateFormat(date, 'yyyy-MM-dd');
                    this.farmer.controls['starttime'].setValue(this.comm.changeStartTime(starttime));
                    if (this.farmer.value.insurancepro.ValidType == 1) {
                        this.farmer.controls['endtime'].setValue(this.comm.changeTime(starttime, this.farmer.value.insurancepro.ValidTime));
                    } else {
                        this.farmer.controls['endtime'].setValue('');
                    }
                },
                err => {
                    console.log('Error occurred while getting date: ', err)
                }
            );
        } else {
            this.comm.toast('请选择保险产品或者业务性质');
        }
    }

    chooseenddate() {
        if (this.farmer.value.starttime) {
            if (this.farmer.value.insurancepro.ValidType == 1) {
                return false;
            } else {
                let list = this.farmer.value.insurancepro.ValidTime.split('-');
                this.datePicker.show({
                    date: new Date(),
                    mode: 'date',
                    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
                    minDate: new Date(this.comm.changeTime(this.farmer.value.starttime, list[0])).getTime(),
                    maxDate: new Date(this.comm.changeTime(this.farmer.value.starttime, list[1])).getTime()
                }).then(date => {
                    let end_time = this.comm.dateFormat(date, 'yyyy-MM-dd');
                    this.farmer.controls['endtime'].setValue(this.comm.changeEndTime(end_time));
                })
            }
        } else {
            this.comm.toast('请选择您的起保时间');
        }
    }

    back = (_params) => {
        return new Promise((resolve) => {
            if (_params && _params.length > 0) {
                this.farmer.controls['OtherPicUrl'].setValue(_params);
            }
            resolve();
        });
    };

    OtherC() {
        this.modals = this.modalCtrl.create('ModalPage', {
            callback: this.back,
            OtherPic: this.farmer.value.OtherPicUrl
        });
        this.modals.present();
    }

    onSubmit() {
        if (this.farmer.value.management['types'] == 3 && this.farmer.value.percent == '') {
            this.comm.toast('请输入所占份额');
            return false;
        }
        this.farmerModel.FramGuid = this.comm.newGuid();
        this.farmerModel.GPS = this.gps.long + '|' + this.gps.lat;
        this.farmerModel.FramType = this.defpage != 'one' ? "4" : this.farmerModel.FramType;
        let dbOBJ = this.farmerModel.form2Model(this.farmer.value);
        if (dbOBJ['endtime'].indexOf('24:') > -1) {
            dbOBJ['endtime'] = dbOBJ['endtime'].split(' ')[0] + " 23:59:59";
        }
        this.sqllite.selecTablePeopleID('inframmessage', this.farmer.value.FramPeopleID).then(res => {
            if (res.length == 0) {

                this.sqllite.newinster('inframmessage', dbOBJ).then(res => {
                    localStorage.removeItem('farm0');
                    let confirm = this.alertCtrl.create({
                        title: '提示',
                        message: '信息录入成功！是否录入标的信息?',
                        buttons: [
                            {
                                text: '是',
                                handler: () => {
                                    this.navCtrl.pop();
                                    this.navCtrl.pop();
                                    if (this.defpage === 'one') {
                                        this.navCtrl.push('DeclareContractMorePage', {
                                            UserPeopleID: this.farmer.value.FramPeopleID,
                                            FramGuid: this.farmerModel.FramGuid,
                                            type: this.farmerModel.FramType
                                        });
                                    } else {
                                        this.navCtrl.push('PiLiangBaoPage', {
                                            UserPeopleID: this.farmer.value.FramPeopleID,
                                            FramGuid: this.farmerModel.FramGuid,
                                            type: this.farmerModel.FramType
                                        });
                                    }
                                }
                            },
                            {
                                text: '否',
                                handler: () => {
                                    this.navCtrl.pop();
                                }
                            }
                        ]
                    });
                    confirm.present();
                }).catch(mess => {
                    console.log(mess);
                })
            } else {
                let alert = this.alertCtrl.create({
                    title: '提示',
                    subTitle: '该农户的信息已经录入过了，请不要重复录入',
                    buttons: ['知道了']
                });
                alert.present();
            }
        });
    }
}
