import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-change-farm',
    templateUrl: 'change-farm.html',
})
export class ChangeFarmPage {
    AllList: Array<any>;
    index: number;
    FarmList: Array<any>;
    AnimalList: Array<any>;
    Chengbaoyuan: string;
    Time: string;
    isxubao: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SqllistServiceProvider, public comm: CommonServiceProvider, public photoViewer: PhotoViewer, public alertCtrl: AlertController) {
        let date = new Date();
        let year = date.getFullYear();
        let mon = date.getMonth() + 1;
        let day = date.getDay();
        this.Time = `${year}-${mon}-${day}`;
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).AccountName;
        this.isxubao = navParams.get('isxubao');
        this.AllList = navParams.get('AllFarmList');
        this.index = navParams.get('index');
        this.FarmList = this.AllList[this.index];

        sqlite.selectTableBaos(this.FarmList['FramPeopleID'], this.FarmList['qiyeGuid']).then(res => {
            this.AnimalList = res;
        }).catch(err => {
            console.log(err)
        });
    }

    gotoChangeAnimalPage(index) {
        this.sqlite.selecTableIDs('inframmessage', 'FramGuid', this.FarmList['qiyeGuid']).then(res => {
            this.navCtrl.push('ChangeAnimalPage', {
                Animal: this.AnimalList[index],
                paoxian: JSON.parse(res[0].name.insurancepro),
                iszuzhi: 'y'
            })
        }).catch(err => {
            console.log(err);
        })
    }

    closeImg(index) {
        switch (index) {
            case 1:
                this.FarmList['FramIDFontUrl'] = 'assets/icon/pic-updata_03.png';
                break;
            case 2:
                this.FarmList['FramIDBackUrl'] = 'assets/icon/pic-updata_03.png';
                break;
            case 3:
                this.FarmList['BankCardUrl'] = 'assets/icon/pic-updata_03.png';
                break;
            case 4:
                this.FarmList['fyzgzUrl'] = 'assets/icon/pic-updata_03.png';
                break;
        }
    }

    font(str) {
        if (this.FarmList[str] == 'assets/icon/pic-updata_03.png') {
            this.comm.chooseImage(1).then(res => {
                this.FarmList[str] = res;
            })
        } else {
            this.photoViewer.show(this.FarmList[str]);
        }
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
                        for (let i = 0; i < this.AllList.length; i++) {
                            if (this.AllList[i].FramGuid == this.FarmList['FramGuid']) {
                                this.AllList[i] = this.FarmList;
                                break;
                            }
                        }
                        this.sqlite.newupdataone('inframmessage', JSON.stringify(this.AllList), this.FarmList['qiyeGuid']).then(res => {
                            this.comm.toast('修改成功');
                            this.navCtrl.pop();
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

    deleteMess(index) {
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
                        this.sqlite.deleteTable('Underwriting', 'SelfGuid', this.AnimalList[index].name.SelfGuid).then(res => {
                            this.AnimalList = this.remove(this.AnimalList, index);
                            this.comm.toast('删除成功');
                        })
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
