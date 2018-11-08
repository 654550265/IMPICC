import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { DatePicker } from "@ionic-native/date-picker";

@IonicPage()
@Component({
    selector: 'page-local-change',
    templateUrl: 'local-change.html',
})
export class LocalChangePage {
    id: number;
    lipeiyuan: string;
    list: Array<any>;
    dieList: Array<any>;
    dieMessage: string;

    chengBaoAee: Array<any>;
    bankTypeArr: Array<any>;
    SHouImg: Array<any>;
    picLen: number;
    hasPic: boolean;
    lipeiList: Array<any>;
    myDate: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SqllistServiceProvider, public http: AuthServiceProvider, private camera: Camera, public comm: CommonServiceProvider, public datePicker: DatePicker,public modalCtrl: ModalController) {
        this.id = navParams.get('id');
        this.lipeiyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.chengBaoAee = [{id:'1',name:'张三'},{id:'1',name:'李四'}];
        this.bankTypeArr = ['信用卡','借记卡','活期存折','其他'];
        this.hasPic = true;
        this.sqlite.selecTableIDs('InsuredFarmer','FramGuid',this.id)
            .then(res => {
                this.list = res;
                this.list[0].form = {};
                this.list[0].form['accountType'] = this.list[0].name['accountType'];
                this.SHouImg = this.list[0].name['vaccinationCertificateImgs'].split(',');
                this.picLen = this.SHouImg.length;
            }).catch(e => {
            console.log(e);
        });
        this.sqlite.selecTableIDs('DeclareClaimTable','FramGuid',this.id)
            .then(res => {
                this.lipeiList = res;
            }).catch(e => {
            console.log(e);
        });
        let dates = new Date();
        let year = dates.getFullYear() + '';
        let month = dates.getMonth() + 1 + '';
        let strDate = dates.getDate() + '';
        if (month.length == 1) {
            month = "0" + month;
        }
        if (strDate.length == 1) {
            strDate = "0" + strDate;
        }
        this.myDate = year+'-'+month+'-'+strDate;
    }

    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    CardFontPhoto() {
        this.camera.getPicture(this.options).then((imageData) => {
            this.list[0].form.FramIDFont = imageData;
        }, (err) => {
        });
    }

    CardBackPhoto() {
        this.camera.getPicture(this.options).then((imageData) => {
            this.list[0].form.FramIDBack = imageData;
        }, (err) => {
        });
    }

    BankCardPhoto() {
        this.camera.getPicture(this.options).then((imageData) => {
            this.list[0].form.BankCard = imageData;
        }, (err) => {
        });
    }

    VaccinationPhoto(){
        this.camera.getPicture(this.options).then((imageData) => {
            this.list[0].form.VaccinationCertificateImg = imageData;
        }, (err) => {
        });
    }

    InstituPhoto(){
        this.camera.getPicture(this.options).then((imageData) => {
            this.list[0].form.InstitutionCodeImg = imageData;
        }, (err) => {
        });
    }

    scene() {
        this.camera.getPicture(this.options).then((imageData) => {
            this.list[0].form.Scene = imageData;
        }, (err) => {
        });
    }

    HarmlessPhoto() {
        this.camera.getPicture(this.options).then((imageData) => {
            this.list[0].form.Harmless = imageData;
        })
    }

    die() {
        this.camera.getPicture(this.options).then((imageData) => {
            this.list[0].form.ForDie = imageData;
        })
    }

    choosedate(index){
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            date => {
                let endtime = this.list[index].form.outDate?this.list[index].form.outDate:this.list[index].name.outDate;
                let starttime = this.comm.dateFormat(date, 'yyyy-MM-dd');
                let ba = new Date(starttime).getTime();
                let cx = new Date(endtime).getTime();
                if(ba>cx){
                    this.comm.toast('报案日期需大于等于出险日期');
                }else{
                    this.list[index].form.reportDate = starttime;
                }
            },
            err => {
                console.log('Error occurred while getting date: ', err)
            }
        );
    }
    chooseCxdate(index){
        this.datePicker.show({
            date: new Date(),
            mode: 'date',
            androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
        }).then(
            date => {
                let endtime = this.list[index].form.reportDate?this.list[index].form.reportDate:this.list[index].name.reportDate;
                let starttime = this.comm.dateFormat(date, 'yyyy-MM-dd');
                // a =a.replace(/\//g,'-');
                let time1 = new Date('2018-05-10').getTime();//起保时间
                let time2 = new Date('2019-05-10').getTime();//终保时间
                let cx = new Date(starttime).getTime();//出险时间
                if(cx<time1||cx>time2){
                    this.comm.toast('出险日期需在保险期间');
                }else{
                    let ba = new Date(endtime).getTime();
                    if(ba>cx){
                        this.comm.toast('报案日期需大于等于出险日期');
                    }else{
                        this.list[index].form.outDate = starttime;
                    }
                }
            },
            err => {
                console.log('Error occurred while getting date: ', err)
            }
        );
    }

    tijiao() {
        let self = this;
        if(!this.hasPic){
            this.comm.toast('请上传兽医资格证');
        }else{
            this.sqlite.updataInsuredFarmer(self.list[0].name, self.list[0].form)
                .then(res => {
                    console.log(self.list[0].name,self.list[0].form)
                    this.comm.toast('修改成功');
                    this.navCtrl.pop();
                }).catch(e => {
                console.log(e)
            });
        }
    }
    looks(ele){
        let self = this;
        this.comm.chooseImage(1).then(res => {
            switch (ele){
                case 1:
                    self.list[0].form.FramIDFont = res + '';
                    break;
                case 2:
                    self.list[0].form.FramIDBack = res + '';
                    break;
                case 3:
                    self.list[0].form.BankCardImg = res + '';
                    break;
                case 4:
                    self.list[0].form.VaccinationCertificateImg = res + '';
                    break;
                case 5:
                    self.list[0].form.InstitutionCodeImg = res + '';
                    break;
            }
        })
    }
    look(){
        let self = this;
        let lists = self.list[0].name['vaccinationCertificateImgs'].split(',');
        if(self.list[0].form['vaccinationCertificateImgs']){
            lists = self.list[0].form['vaccinationCertificateImgs'].split(',');
        }
        console.log(lists)
        let modal = self.modalCtrl.create('GetLiPeiOtherPage', {
            callback: self.backsss,
            OtherPic: lists,
            xiu: '1'
        });
        modal.present();
    }
    backsss = (_params,ele) => {
        let self = this;
        return new Promise((resolve, reject) => {
            console.log(_params)
            self.SHouImg = _params;
            self.picLen = _params.length;
            self.hasPic = true;
            self.list[0].form['vaccinationCertificateImgs'] = self.SHouImg.join(',');
            if(_params.length == 0){
                self.SHouImg = ['./assets/icon/pic-updata_03.png'];
                self.list[0].form['vaccinationCertificateImgs'] = '';
                self.hasPic = false;
            }
            resolve();
        });
    };
    goToAnimal(index){
        this.navCtrl.push('LipeiChangePage', {
            lhGuid: this.lipeiList[index].name.lhGuid,
            idCard: this.list[0].name.idCard
        });
    }
}
