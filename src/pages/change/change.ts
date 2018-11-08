import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { DatePicker } from "@ionic-native/date-picker";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-change',
    templateUrl: 'change.html',
})
export class ChangePage {
    Time: string;               //日期
    Chengbaoyuan: string;       //承保员
    farmList: Array<any>;       //整体农户的信息
    guanxiList: Array<any>;     //关系列表
    moshiList: Array<any>;      //经营模式数组
    zhenyiList: Array<any>;     //争议处理数组
    cityList: Array<any>;       //地区数组
    cplist: Array<any>;         //产品数组
    otherPicImg: Array<any>;    //其他图片数组
    xzList: Array<any>;         //业务性质数组
    AnimalList: Array<any>;     //动物数组
    cityAddr: string;           //暂存地址
    AddrMoreMess: string;       //详细地址暂存
    ywxzzc: string;             //业务性质暂存
    cpzc: string;               //保险产品暂存
    moshistr: string;           //经营模式暂存
    zhengyistr: string;         //争议暂存
    cityAddress: string;        //详细地址暂存
    piliang: string;            //是否批量
    farmtype: any;
    Animalboo: boolean;
    haoduan: boolean;
    Andguanxi: any;
    isxubao: any;
    title: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqllite: SqllistServiceProvider, public comm: CommonServiceProvider, public loadingCtrl: LoadingController, public datePicker: DatePicker, public photoViewer: PhotoViewer, public alertCtrl: AlertController) {
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.cityList = JSON.parse(localStorage.getItem('GetAreaTree'));
        this.xzList = JSON.parse(localStorage.getItem('xzlist'));
        this.guanxiList = [
            {types: '1', name: '本人'},
            {types: '2', name: '管理'},
            {types: '3', name: '其他'},
        ];
        this.moshiList = [
            {types: '1', name: '自办'},
            {types: '2', name: '代办'},
            {types: '3', name: '联办'},
        ];
        let date = new Date();
        let year = date.getFullYear();
        let mon = date.getMonth() + 1;
        let day = date.getDay();
        this.Time = `${year}-${mon}-${day}`;
        this.zhenyiList = JSON.parse(localStorage.getItem('arbitral'));
        let guid = navParams.get('peopleID');
        this.piliang = navParams.get('piliang');
        this.isxubao = navParams.get('isxubao');
        sqllite.selecTableIDs('inframmessage', 'FramGuid', guid).then(res => {
            res[0]['form'] = {};
            this.farmList = res;
            switch (res[0].name.FramType) {
                case '1':
                    this.title = '个人信息';
                    break;
                case '2':
                    this.title = '单位信息';
                    break;
                case '3':
                    this.title = '团体信息';
                    break;
            }

            this.otherPicImg = res[0].name.OtherPicUrl ? res[0].name.OtherPicUrl.split(',') : [];
            this.Animalboo = res[0].name.FramType != 3;
            this.cityAddr = comm.findOld(this.cityList, 'id', res[0].name.addr.split(',')[0]);
            this.Andguanxi = comm.findOld(this.guanxiList, 'types', res[0].name.relationship.split(',')[0]);
            for (let i = 0; i < this.cityList.length; i++) {
                if (this.cityList[i].id == res[0].name.addr.split(',')[0]) {
                    let name = this.cityList[i].name;
                    let str = res[0].name.addr.split(',')[1];
                    this.AddrMoreMess = str.substring(name.length, str.length);
                    break;
                }
            }
            for (let i = 0; i < this.xzList.length; i++) {
                if (this.xzList[i].TypeId == res[0].name.insurancetype.split(',')[0]) {
                    this.ywxzzc = this.xzList[i];
                    this.cplist = this.xzList[i].List;
                    break;
                }
            }
            this.cpzc = comm.findOld(this.cplist, 'ProjectId', res[0].name.insuranceproname.split(',')[0]);
            this.moshistr = comm.findOld(this.moshiList, 'types', res[0].name.management.split(',')[0]);
            this.zhengyistr = comm.findOld(this.zhenyiList, 'Id', res[0].name.dispute.split(',')[0]);
            if (this.Animalboo) {
                let table = this.farmList[0].name.FramType == '1' || this.farmList[0].name.FramType == '2' ? 'Underwriting' : 'PiliangUnderwriting';
                sqllite.selecTableIDs(table, 'FramGuid', guid).then(res => {
                    for (let i = 0; i < res.length; i++) {
                        res[i]['form'] = {};
                    }
                    this.AnimalList = res;
                    this.haoduan = res[0].name.EndAnimalIds != null
                })
            } else {
                this.AnimalList = JSON.parse(res[0].name.farmsmessage);
            }
        }).catch(err => {
            console.log(err);
        })

    }

    guanxichange() {
        this.farmList[0].form.relationship = `${this.Andguanxi.types},${this.Andguanxi.name}`;
    }

    moshichange() {
        this.farmList[0].form.management = `${this.moshistr['types']},${this.moshistr['name']}`;
    }

    zhengyichange() {
        this.farmList[0].form.dispute = `${this.zhengyistr['Id']},${this.zhengyistr['Name']}`;
    }

    gotoChangeAnimalPage(index) {
        if (this.Animalboo) {
            this.navCtrl.push('ChangeAnimalPage', {
                Animal: this.AnimalList[index],
                paoxian: JSON.parse(this.farmList[0].name.insurancepro),
                isxubao: this.isxubao
            });
        } else {
            this.navCtrl.push('ChangeFarmPage', {
                AllFarmList: this.AnimalList,
                index: index,
                paoxian: JSON.parse(this.farmList[0].name.insurancepro),
                isxubao: this.isxubao
            });
        }
    }

    ywxzchange(ywxzzc) {
        this.farmList[0].form.insurancetype = `${this.ywxzzc['TypeId']},${this.ywxzzc['TypeName']}`;
        this.cplist = ywxzzc.List;
    }

    bxcpchange(cpzc) {
        this.farmList[0].form.insuranceproname = `${cpzc.ProjectId},${cpzc.ProjectName}`;
        this.farmList[0].form.insurancepro = JSON.stringify(cpzc);
    }

    chooseStartTime() {
        if (this.farmList[0].form.insurancepro) {
            this.datePicker.show({
                date: new Date(),
                mode: 'date',
                androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
            }).then(date => {
                let chanpin = JSON.parse(this.farmList[0].form.insurancepro);
                this.farmList[0].form.starttime = this.comm.dateFormat(date, 'yyyy-MM-dd');
                if (chanpin.ValidType == 1) {
                    this.farmList[0].form.endtime = this.comm.changeTime(this.farmList[0].form.starttime, parseInt(chanpin.ValidTime));
                } else {
                    this.farmList[0].form.endtime = '请选择您的终保时间';
                }
            }).catch(err => {
                console.log(err);
            })
        } else {
            this.datePicker.show({
                date: new Date(),
                mode: 'date',
                androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
            }).then(date => {
                let chanpin = JSON.parse(this.farmList[0].name.insurancepro);
                this.farmList[0].form.starttime = this.comm.dateFormat(date, 'yyyy-MM-dd');
                if (chanpin.ValidType == 1) {
                    this.farmList[0].form.endtime = this.comm.changeTime(this.farmList[0].form.starttime, parseInt(chanpin.ValidTime));
                } else {
                    this.farmList[0].form.endtime = '请选择您的终保时间';
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }

    chooseEndTime() {
        if (this.farmList[0].form.insurancepro) {
            let chanpin = JSON.parse(this.farmList[0].form.insurancepro);
            let list = chanpin.ValidTime.split('-');
            if (chanpin.ValidType != 1) {
                this.datePicker.show({
                    date: new Date(),
                    mode: 'date',
                    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
                    minDate: new Date(this.comm.changeTime(this.farmList[0].form.starttime, list[0])),
                    maxDate: new Date(this.comm.changeTime(this.farmList[0].form.starttime, list[1]))
                }).then(date => {
                    this.farmList[0].form.endtime = this.comm.dateFormat(date, 'yyyy-MM-dd');
                }).catch(err => {
                    console.log(err);
                })
            }
        } else {
            let chanpin = JSON.parse(this.farmList[0].name.insurancepro);
            let list = chanpin.ValidTime.split('-');
            if (chanpin.ValidType != 1) {
                this.datePicker.show({
                    date: new Date(),
                    mode: 'date',
                    androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
                    minDate: new Date(this.comm.changeTime(this.farmList[0].name.starttime, list[0])),
                    maxDate: new Date(this.comm.changeTime(this.farmList[0].name.starttime, list[1]))
                }).then(date => {
                    this.farmList[0].form.endtime = this.comm.dateFormat(date, 'yyyy-MM-dd');
                }).catch(err => {
                    console.log(err);
                })
            }
        }
    }

    closeImg(index) {
        switch (index) {
            case 1:
                this.farmList[0].name.FramIDFontUrl = 'assets/icon/pic-updata_03.png';
                this.farmList[0].form.FramIDFontUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 2:
                this.farmList[0].name.FramIDBackUrl = 'assets/icon/pic-updata_03.png';
                this.farmList[0].form.FramIDBackUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 3:
                this.farmList[0].name.jgdmUrl = 'assets/icon/pic-updata_03.png';
                this.farmList[0].form.jgdmUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 4:
                this.farmList[0].name.BankCardUrl = 'assets/icon/pic-updata_03.png';
                this.farmList[0].form.BankCardUrl = 'assets/icon/pic-updata_03.png';
                break;
            case 5:
                this.farmList[0].name.fyzgzUrl = 'assets/icon/pic-updata_03.png';
                this.farmList[0].form.fyzgzUrl = 'assets/icon/pic-updata_03.png';
                break;
        }
    }

    font(str) {
        if (this.farmList[0].name[str] == 'assets/icon/pic-updata_03.png' || this.farmList[0].form[str] == 'assets/icon/pic-updata_03.png') {
            this.comm.chooseImage(1).then(res => {
                this.farmList[0].form[str] = res;
                this.farmList[0].name[str] = res;
            })
        } else {
            this.photoViewer.show(this.farmList[0].name[str]);
        }
    }

    fontss(index) {
        if (this.otherPicImg[index] == 'assets/icon/pic-updata_03.png') {
            this.comm.chooseImage(1).then(res => {
                this.otherPicImg[index] = res;
            });
        } else {
            this.photoViewer.show(this.otherPicImg[index]);
        }
    }

    closeImgs(index) {
        this.otherPicImg[index] = 'assets/icon/pic-updata_03.png';
    }

    citychange() {
        this.farmList[0].form.addr = `${this.cityAddr['id']},${this.cityAddr['name']}${this.cityAddress}`
    }

    onKey(e) {
        this.farmList[0].form.addr = `${this.cityAddr['id']},${this.cityAddr['name']}${e.target.value}`;
    }

    saveBtnSave() {
        let list = [];
        for (let value of this.otherPicImg) {
            if (value != 'assets/icon/pic-updata_03.png') {
                list.push(value);
            }
        }
        this.farmList[0].form.OtherPicUrl = list.join();
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
                        this.sqllite.updateFarm('inframmessage', this.farmList[0].name, this.farmList[0].form).then(res => {
                            this.comm.toast('修改成功');
                            this.navCtrl.pop();
                        }).catch(err => {
                            console.log(err);
                        })
                    }
                }
            ]
        });
        confirm.present();
    }

    delAnimal(index) {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '确认删除这条动物信息吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        this.sqllite.deleteTable('Underwriting', 'SelfGuid', this.AnimalList[index].name.SelfGuid).then(res => {
                            this.AnimalList = this.remove(this.AnimalList, index);
                            this.comm.toast('删除成功');
                        })
                    }
                }
            ]
        });
        confirm.present();
    }

    delFarm(index) {
        console.log(this.AnimalList);
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '确认删除这条分户信息吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        this.sqllite.deleteTableUnderwriting(this.AnimalList[index].qiyeGuid, this.AnimalList[index].FramPeopleID).then(mess => {
                            this.AnimalList = this.remove(this.AnimalList, index);
                            this.sqllite.newupdataone('inframmessage', JSON.stringify(this.AnimalList), this.farmList[0].name.FramGuid).then(res => {
                                this.comm.toast('删除成功');
                            }).catch(err => {
                                console.log(err);
                            });
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                }
            ]
        });
        confirm.present();
    }

    remove(arr, item) {
        let result = [];
        for (let i = 0; i < arr.length; i++) {
            if (i != item) {
                result.push(arr[i]);
            }
        }
        return result;
    }
}
