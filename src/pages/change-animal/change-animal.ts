import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";

@IonicPage()
@Component({
    selector: 'page-change-animal',
    templateUrl: 'change-animal.html',
})
export class ChangeAnimalPage {
    Animal: any;
    cityList: Array<any>;
    cityAddr: any;
    AddrMoreMess: string;
    Chengbaoyuan: string;
    paoxian: any;
    beput: boolean;
    beselec: boolean;
    bea: boolean;
    ratelist: any;
    baoemin: any;
    baoemax: any;
    baoelist: Array<any>;
    BreedTypelist: Array<any>;
    baoe: any;
    feilv: any;
    bree: any;
    TotalPremium: any;
    SelfPayPremium: any;
    earlist: any;
    iszuzhi: any;
    Time: string;
    isxubao: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public comm: CommonServiceProvider, public photoViewer: PhotoViewer, public alertCtrl: AlertController, public sqllite: SqllistServiceProvider) {
        let date = new Date();
        let year = date.getFullYear();
        let mon = date.getMonth() + 1;
        let day = date.getDay();
        this.Time = `${year}-${mon}-${day}`;
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.Animal = navParams.get('Animal');
        this.iszuzhi = navParams.get('iszuzhi');
        this.Animal.form = {};
        this.cityList = JSON.parse(localStorage.getItem('GetAreaTree'));
        this.BreedTypelist = JSON.parse(localStorage.getItem('BreedType'));
        this.isxubao = navParams.get('isxubao');
        this.cityAddr = this.Animal.name.breedadd != null ? comm.findOld(this.cityList, 'id', this.Animal.name.breedadd.split(',')[0]) : false;
        this.paoxian = navParams.get('paoxian');
        this.earlist = this.Animal.name.AnimalList ? JSON.parse(this.Animal.name.AnimalList) : [];
        if (this.cityAddr) {
            for (let i = 0; i < this.cityList.length; i++) {
                if (this.cityList[i].id == this.Animal.name.breedadd.split(',')[0]) {
                    let name = this.cityList[i].name;
                    let str = this.Animal.name.breedadd.split(',')[1];
                    this.AddrMoreMess = str.substring(name.length, str.length);
                    break;
                }
            }
        }
        if (this.paoxian.InsuranceAmount.indexOf('-') > -1) {
            this.beput = true;
            this.beselec = false;
            this.bea = false;
            let lists = this.paoxian.InsuranceAmount.split('-');
            this.baoemin = lists[0];
            this.baoemax = lists[1];
            this.baoe = this.Animal.name.Insuredamount;
        } else {
            if (this.paoxian.InsuranceAmount.indexOf('/') > -1) {
                this.beput = false;
                this.beselec = true;
                this.bea = false;
                this.baoemin = null;
                this.baoemax = null;
                this.baoelist = this.paoxian.InsuranceAmount.split('/');
                this.baoe = this.baoelist[0];
            } else {
                this.beput = false;
                this.beselec = false;
                this.bea = true;
                this.baoemin = null;
                this.baoemax = null;
                this.baoe = this.Animal.name.Insuredamount;
            }
        }
        this.ratelist = this.paoxian.InsuranceRate.split('/');
        this.feilv = this.ratelist.length == 0 ? this.ratelist[0] : this.Animal.name.rate;
        if (this.cityAddr) {
            for (let i = 0; i < this.BreedTypelist.length; i++) {
                if (this.BreedTypelist[i].Id == this.Animal.name.breedType.split(',')[0]) {
                    this.bree = this.BreedTypelist[i];
                    break;
                }
            }
        }
        this.TotalPremium = this.Animal.name.TotalPremium;
        this.SelfPayPremium = this.Animal.name.SelfPayPremium;
    }

    baoechange(baoe) {
        this.TotalPremium = baoe * (this.feilv / 100);
        this.SelfPayPremium = this.TotalPremium * (this.paoxian.FarmRate / 100);
        this.Animal.form.Insuredamount = baoe;
        this.Animal.form.TotalPremium = this.TotalPremium;
        this.Animal.form.SelfPayPremium = this.SelfPayPremium;
    }

    feilvchang(feilv) {
        this.TotalPremium = this.baoe * (feilv / 100);
        this.SelfPayPremium = this.TotalPremium * (this.paoxian.FarmRate / 100);
        this.Animal.form.rate = feilv;
        this.Animal.form.TotalPremium = this.TotalPremium;
        this.Animal.form.SelfPayPremium = this.SelfPayPremium;
    }

    closeImg(index) {
        switch (index) {
            case 1:
                this.Animal.name.ImplantationSiteUrl = 'assets/icon/pic-updata_03.png';
                this.Animal.form.ImplantationSiteUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 2:
                this.Animal.name.PositiveUrl = 'assets/icon/pic-updata_03.png';
                this.Animal.form.PositiveUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 3:
                this.Animal.name.LeftUrl = 'assets/icon/pic-updata_03.png';
                this.Animal.form.LeftUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 4:
                this.Animal.name.RightUrl = 'assets/icon/pic-updata_03.png';
                this.Animal.form.RightUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 5:
                this.Animal.name.Animals1Url = 'assets/icon/pic-updata_03.png';
                this.Animal.form.Animals1Url = 'assets/icon/pic-updata_03.png';
                break;
            case 6:
                this.Animal.name.Animals2Url = 'assets/icon/pic-updata_03.png';
                this.Animal.form.Animals2Url = 'assets/icon/pic-updata_03.png';
                break;
            case 7:
                this.Animal.name.Animals3Url = 'assets/icon/pic-updata_03.png';
                this.Animal.form.Animals3Url = 'assets/icon/pic-updata_03.png';
                break;
        }
    }

    chooseImage(str, index) {
        if (this.earlist[index][str] == 'assets/icon/pic-updata_03.png') {
            this.comm.chooseImage(1).then(res => {
                this.earlist[index][str] = res;
            })
        } else {
            this.photoViewer.show(this.earlist[index][str]);
        }
    }

    font(str) {
        if (this.Animal.name[str] == 'assets/icon/pic-updata_03.png' || this.Animal.form[str] == 'assets/icon/pic-updata_03.png') {
            this.comm.chooseImage(1).then(res => {
                this.Animal.form[str] = res;
                this.Animal.name[str] = res;
            })
        } else {
            this.photoViewer.show(this.Animal.name[str]);
        }
    }

    fangshichange(bree) {
        this.Animal.form.breedType = `${bree.Id},${bree.Name}`;
    }

    addrchange(cityAddr) {
        this.Animal.form.breedadd = `${cityAddr.id},${cityAddr.name}${this.AddrMoreMess}`;
    }

    onKey(e) {
        this.Animal.form.breedadd = `${this.cityAddr['id']},${this.cityAddr['name']}${e.target.value}`;
    }

    closeImgs(str, index) {
        this.earlist[index][str] = 'assets/icon/pic-updata_03.png';
    }

    saveBtnSave() {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '确认修改这条数据吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        if (this.earlist.length == 0) {
                            this.sqllite.updateFarm('Underwriting', this.Animal.name, this.Animal.form).then(res => {
                                this.comm.toast('修改成功');
                                if (this.iszuzhi == 'y') {
                                    this.navCtrl.pop();
                                    this.navCtrl.pop();
                                    this.navCtrl.pop();
                                } else {
                                    this.navCtrl.pop();
                                    this.navCtrl.pop();
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                        } else {
                            this.sqllite.updateFarm('PiliangUnderwriting', this.Animal.name, this.Animal.form).then(res => {
                                this.sqllite.updataear('PiliangUnderwriting', 'AnimalList', JSON.stringify(this.earlist), this.Animal.name.FramGuid).then(res => {
                                    this.comm.toast('修改成功');
                                    this.navCtrl.pop();
                                    this.navCtrl.pop();
                                }).catch(err => {
                                    console.log(err);
                                });
                            }).catch(err => {
                                console.log(err);
                            })
                        }

                    }
                }
            ]
        });
        confirm.present();
    }
}
