import { Farmer } from './../../model/Farmer';
import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { GpsComponent } from "../../components/gps/gps";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { DatePicker } from "@ionic-native/date-picker";
import { ENV } from "../../config/environment";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
    selector: 'page-choose-farm1',
    templateUrl: 'choose-farm1.html',
})
export class ChooseFarm1Page {
    @ViewChild(GpsComponent) gps: GpsComponent;
    Project: Array<any>;
    defpage: string;
    modals: any;
    farmer: FormGroup;
    farmerModel: Farmer;
    ENV: object;

    constructor(public navCtrl: NavController, public navParams: NavParams, public comm: CommonServiceProvider, private photoViewer: PhotoViewer, public sqllite: SqllistServiceProvider, public alertCtrl: AlertController, public datePicker: DatePicker, public modalCtrl: ModalController, private fb: FormBuilder) {

        this.ENV = ENV;
        this.Project = [];
        this.defpage = this.navParams.get('defpage');
        this.farmerModel = new Farmer();
        this.farmerModel.FramType = this.navParams.get('type');
        let localFarmer = JSON.parse(localStorage.getItem('farm1'));
        if(localFarmer && localFarmer.insurancetype){
            this.Project = localFarmer.insurancetype.List;
        }
        this.farmer = this.fb.group({
            FramName: [localFarmer ? localFarmer.FramName : '', Validators.required],
            tyshxydm: [localFarmer ? localFarmer.tyshxydm : '', Validators.required],
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
            jgdmUrl: [localFarmer ? localFarmer.jgdmUrl : '', Validators.required],
            BankCardUrl: [localFarmer ? localFarmer.BankCardUrl : '', Validators.required],
            OtherPicUrl: [localFarmer ? localFarmer.OtherPicUrl : []],
            fyzgzUrl: [localFarmer ? localFarmer.fyzgzUrl : '', Validators.required],
            Remarks: [localFarmer ? localFarmer.Remarks : ''],
        });
        this.onChanges();
    }

    onChanges(): void {
        this.farmer.valueChanges.subscribe(val => {
            localStorage.setItem('farm1', JSON.stringify(val));
        });
        this.farmer.get('insurancetype').valueChanges.subscribe(val => {
            this.Project = val.List;
        });
    }

    OCR(type) {
        this.comm.OCR(type).then(info => {
            this.farmer.controls['banknum'].setValue(info['BankNum']);
            this.farmer.controls['FramBank'].setValue(info['BankName'].split('(')[0]);
            this.farmer.controls['BankCardUrl'].setValue(info['imgs']);
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

    deletePhoto(type){
        if(type === 'OtherPicUrl'){
            this.farmer.controls[type].setValue([]);
        }else{
            this.farmer.controls[type].setValue('');
        }
    }

    gotoCameraPage(){
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
                    }else{
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
        this.farmerModel.FramType = this.defpage != 'one' ? "5" : this.farmerModel.FramType;
        let dbOBJ = this.farmerModel.form2Model(this.farmer.value);
        this.sqllite.selecTableIDs('inframmessage', 'tyshxydm', this.farmer.value.tyshxydm).then(res => {
            if (res.length == 0) {
                this.sqllite.newinster('inframmessage', dbOBJ).then(res => {
                    localStorage.removeItem('farm1');
                    let confirm = this.alertCtrl.create({
                        title: '提示',
                        message: '信息已成功录入，是否录入标的信息?',
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
                                        })
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
                });
            } else {
                this.comm.toast('该企业已在本地录入，请勿重复录入');
            }
        })

    }
}
