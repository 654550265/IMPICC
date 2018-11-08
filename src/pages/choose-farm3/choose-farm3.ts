import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { GpsComponent } from "../../components/gps/gps";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { ENV } from "../../config/environment";
import { Farmer } from './../../model/Farmer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
    selector: 'page-choose-farm3',
    templateUrl: 'choose-farm3.html',
})
export class ChooseFarm3Page {
    @ViewChild(GpsComponent) gps: GpsComponent;

    data: object;
    FramGuid: any;
    types: number;
    farmlist: Array<any>;
    teamlist: Array<any>;
    modals: any;

    farmer: FormGroup;
    farmerModel: Farmer;
    ENV: object;
    qiyeGuid: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, private photoViewer: PhotoViewer, public comm: CommonServiceProvider, public alertCtrl: AlertController, public sqlite: SqllistServiceProvider, public modalCtrl: ModalController, private fb: FormBuilder) {
        this.ENV = ENV;
        this.farmlist = [];
        this.teamlist = [];
        if (window['cordova']) {
            this.sqlite.selectFarmType('inframmessage').then(res => {
                if (res.length == 0) {
                    let confirm = this.alertCtrl.create({
                        title: '提示',
                        message: '暂无团体信息，请先录入团体信息。',
                        buttons: [
                            {
                                text: '是',
                                handler: () => {
                                    this.navCtrl.pop();
                                }
                            }
                        ]
                    });
                    confirm.present();
                } else {
                    let list = [];
                    for (let i = 0; i < res.length; i++) {
                        list.push(res[i].name);
                    }
                    this.teamlist = list;
                }
            }).catch(err => {
                console.log(err);
            });
        }
        this.farmerModel = new Farmer();
        this.farmerModel.FramType = this.farmerModel.FramType ? this.farmerModel.FramType : '4';
        let localFarmer = JSON.parse(localStorage.getItem('farm3'));
        this.qiyeGuid = this.navParams.get('FramGuid') ? this.navParams.get('FramGuid') : localFarmer ? localFarmer.qiyeGuid : '';
        this.farmer = this.fb.group({
            qiyeGuid: [this.qiyeGuid, Validators.required],
            FramName: [localFarmer ? localFarmer.FramName : '', Validators.required],
            FramPeopleID: [localFarmer ? localFarmer.FramPeopleID : '', Validators.required],
            FramTel: [localFarmer ? localFarmer.FramTel : '', Validators.required],
            EarTarNum: [localFarmer ? localFarmer.EarTarNum : '', Validators.required],
            banknum: [localFarmer ? localFarmer.banknum : '', Validators.required],
            FramBank: [localFarmer ? localFarmer.FramBank : '', Validators.required],
            branch: [localFarmer ? localFarmer.branch : ''],
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
            localStorage.setItem('farm3', JSON.stringify(val));
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
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '是否继续录入',
            buttons: [
                {
                    text: '继续录入',
                    handler: () => {
                        this.callback(() => {
                            this.farmer.reset({
                                qiyeGuid: this.farmer.value.qiyeGuid,
                                FramName: '',
                                FramPeopleID: '',
                                FramTel: '',
                                EarTarNum: '',
                                banknum: '',
                                FramBank: '',
                                branch: '',
                                FramIDFontUrl: '',
                                FramIDBackUrl: '',
                                BankCardUrl: '',
                                OtherPicUrl: '',
                                fyzgzUrl: '',
                                Remarks: '',
                            });
                        })
                    }
                },
                {
                    text: '标的信息录入',
                    handler: () => {
                        this.callback(() => {
                            this.navCtrl.pop();
                            this.navCtrl.pop();
                            this.navCtrl.push('DeclareContractMorePage', {
                                FramGuid: this.farmer.value.qiyeGuid,
                                peopleid: this.farmer.value.FramPeopleID,
                                type: this.farmerModel.FramType
                            });
                        })
                    }
                }
            ]
        });
        confirm.present();
    }

    callback(fn) {
        this.sqlite.selecTableIDs('inframmessage', 'FramGuid', `${this.farmer.value.qiyeGuid}`).then(message => {
            let str = message[0].name.farmsmessage == null ? '[]' : message[0].name.farmsmessage;
            let lists = JSON.parse(str);
            let boos = true;
            for (let i = 0; i < lists.length; i++) {
                if (lists[i].FramPeopleID == this.farmer.value.FramPeopleID) {
                    boos = false;
                    break;
                }
            }
            if (boos) {
                this.farmerModel.FramGuid = this.comm.newGuid();
                let dbOBJ = this.farmerModel.form2Model(this.farmer.value);
                dbOBJ['qiyeGuid'] = this.qiyeGuid;
                lists.push(dbOBJ);
                this.sqlite.newupdataone('inframmessage', JSON.stringify(lists), this.farmer.value.qiyeGuid).then(res => {
                    localStorage.removeItem('farm3');
                    fn();
                }).catch(err => {
                    console.log(err);
                })
            } else {
                this.comm.toast('该团体下已有这条农户信息，请勿重复录入。')
            }
        }).catch(err => {
            console.log(err);
        });
    }
}
