import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatePicker } from "@ionic-native/date-picker";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { GpsComponent } from "../../components/gps/gps";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { ENV } from "../../config/environment";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { Farmer } from './../../model/Farmer';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
    selector: 'page-team',
    templateUrl: 'team.html',
})
export class TeamPage {

    @ViewChild(GpsComponent) gps: GpsComponent;
    PRODUCTION: boolean;
    data: object;
    citylist: Array<any>;
    provice: string;
    relationshiplist: Array<any>;
    managementlist: Array<any>;
    showBottom: boolean;
    isFitCard: boolean;
    moreAddr: string;
    xianzhonglist: object;
    Project: Array<any>;
    zylist: Array<any>;
    insurancepro: any;
    management: string;
    dispute: string;
    time: number;
    insurancetype: any;
    relationship: any;

    farmer: FormGroup;
    farmerModel: Farmer;
    ENV: object;

    constructor(public navCtrl: NavController, public navParams: NavParams, public datePicker: DatePicker, public comm: CommonServiceProvider, public sqllite: SqllistServiceProvider, public alertCtrl: AlertController, private photoViewer: PhotoViewer, private fb: FormBuilder) {

        this.ENV = ENV;
        this.Project = [];
        this.farmerModel = new Farmer();
        this.farmerModel.FramType = this.navParams.get('type');
        let localFarmer = JSON.parse(localStorage.getItem('team'));
        if(localFarmer && localFarmer.insurancetype){
            this.Project = localFarmer.insurancetype.List;
        }
        this.farmer = this.fb.group({
            FramName: [localFarmer ? localFarmer.FramName : '', Validators.required],
            tyshxydm: [localFarmer ? localFarmer.tyshxydm : '', Validators.required],
            provice: [localFarmer ? localFarmer.provice : '', Validators.required],
            moreAddr: [localFarmer ? localFarmer.moreAddr : '', Validators.required],
            insurancetype: [localFarmer ? localFarmer.insurancetype : '', Validators.required],
            insurancepro: [localFarmer ? localFarmer.insurancepro : '', Validators.required],
            starttime: [localFarmer ? localFarmer.starttime : '', Validators.required],
            endtime: [localFarmer ? localFarmer.endtime : '', Validators.required],
            relationship: [localFarmer ? localFarmer.relationship : '', Validators.required],
            management: [localFarmer ? localFarmer.management : '', Validators.required],
            percent: [localFarmer ? localFarmer.percent : ''],
            dispute: [localFarmer ? localFarmer.dispute : '', Validators.required],
            jgdmUrl: [localFarmer ? localFarmer.jgdmUrl : '', Validators.required],
            Remarks: [localFarmer ? localFarmer.Remarks : ''],
        });
        this.onChanges();
    }

    onChanges(): void {
        this.farmer.valueChanges.subscribe(val => {
            localStorage.setItem('team', JSON.stringify(val));
        });
        this.farmer.get('insurancetype').valueChanges.subscribe(val => {
            this.Project = val.List;
        });
    }

    gotoCameraPage(){
        this.navCtrl.push('CameraPage');
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
        this.farmer.controls[type].setValue('');
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

    onSubmit() {
        if (this.farmer.value.management['types'] == 3 && this.farmer.value.percent == '') {
            this.comm.toast('请输入所占份额');
            return false;
        }
        this.farmerModel.FramGuid = this.comm.newGuid();
        this.farmerModel.GPS = this.gps.long + '|' + this.gps.lat;
        let dbOBJ = this.farmerModel.form2Model(this.farmer.value);
        this.sqllite.selecTableIDs('inframmessage', 'tyshxydm', this.farmer.value.tyshxydm).then(res => {
            if (res.length == 0) {
                this.sqllite.newinster('inframmessage', dbOBJ).then(res => {
                    localStorage.removeItem('team');
                    let confirm = this.alertCtrl.create({
                        title: '提示',
                        message: '请检查信息是否准确无误。',
                        buttons: [
                            {
                                text: '是',
                                handler: () => {
                                    this.navCtrl.pop();
                                    this.navCtrl.push('ChooseFarm3Page', {
                                        UserPeopleID: this.farmer.value.tyshxydm,
                                        FramGuid: this.farmerModel.FramGuid,
                                        type: this.farmerModel.FramType
                                    });
                                }
                            },
                            {
                                text: '否',
                                handler: () => {
                                }
                            }
                        ]
                    });
                    confirm.present();
                }).catch(mess => {
                    console.log(mess);
                });
            } else {
                this.comm.toast('该组织已经录入在本地，请勿重复录入')
            }
        }).catch(err => {
            console.log(err);
        });
    }
}
