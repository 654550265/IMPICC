import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";
import { LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-pi-liang-bao-local',
    templateUrl: 'pi-liang-bao-local.html',
})
export class PiLiangBaoLocalPage {
    mainlist: Array<any>;
    lists: Array<any>;
    isshow: boolean;
    num: number;
    isChooseAll: boolean;
    uname: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqllite: SqllistServiceProvider, public comm: CommonServiceProvider, public http: AuthServiceProvider, private transfer: FileTransfer, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
        this.all();
        // this.lists = [
        //     // {id: 0, name: '全部', acv: true, auditStaus: 0},
        //     {id: 0, name: '个体批量投保', acv: true, auditStaus: 0, farmtype: 4},
        //     {id: 2, name: '企业批量投保', acv: false, auditStaus: 0, farmtype: 5}
        // ];
        this.isChooseAll = false;
        this.uname = JSON.parse(localStorage.getItem('user')).AccountName;
    }

    gotosuresingapage(index) {
        this.sqllite.selecTableIDs('PiliangUnderwriting','FramGuid',this.mainlist[index].FramGuid).then(res=>{
            if(res.length == 0){
                this.comm.toast('请录入动物信息')
            }else{
                this.navCtrl.push('SuresignaPage', {
                    FramGuid: this.mainlist[index].FramGuid,
                    piliang: 'two'
                });
            }
        })

    }

    ionViewWillEnter() {
        this.all();
    }

    all() {
        let mainlist = [];
        this.sqllite.selectTableAllfofi('inframmessage', 4, 5).then(res => {
            for (let i = 0; i < res.length; i++) {
                mainlist.push(res[i].name);
            }
            if (mainlist.length == 0) {
                this.isshow = true;
            } else {
                this.isshow = false;
            }
            this.mainlist = mainlist;
        })
    }

    chooseone(index) {
        this.mainlist[index].acv = !this.mainlist[index].acv;
        this.checknum();
    }

    chooseall() {
        this.isChooseAll = !this.isChooseAll;
        for (let i = 0; i < this.mainlist.length; i++) {
            this.mainlist[i].acv = this.isChooseAll;
        }
        this.checknum();
    }

    checknum() {
        let num = 0;
        for (let i = 0; i < this.mainlist.length; i++) {
            if (this.mainlist[i].acv) {
                num += 1;
            }
        }
        this.num = num;
    }

    gotoLookPage(index) {
        this.sqllite.selecTableIDs('PiliangUnderwriting', 'FramGuid', this.mainlist[index].FramGuid).then(res => {
            if (res.length == 0) {
                this.comm.toast('你所选的农户下还没有承保数据，请去录入')
            } else {
                this.navCtrl.push('PiLiangLookBaoPage', {
                    FramGuid: this.mainlist[index].FramGuid
                });
            }
        }).catch(err => {
            console.log(err);
        });

    }

    del(index) {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '确定删除这条数据和这条数据下的所有承保信息吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                        console.log(this.mainlist[index].FramGuid);
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        this.sqllite.deleteTable('inframmessage', 'FramGuid', this.mainlist[index].FramGuid)
                        .then(res => {
                            this.sqllite.deleteTable('PiliangUnderwriting', 'FramGuid', this.mainlist[index].FramGuid)
                            .then(res => {
                                // this.all();
                            });
                        }).catch(err => {
                            console.log(err)
                        });
                    }
                }
            ]
        });
        confirm.present();
    }

    upload() {
        let guid_arr = [];
        let farm_arr = [];
        let under_arr = [];
        for (let i = 0; i < this.mainlist.length; i++) {
            if (this.mainlist[i].acv) {
                guid_arr.push(this.mainlist[i].FramGuid);
            }
        }
        if (guid_arr.length == 0) {
            this.comm.toast('请选择您要上传的数据')
        } else {
            for (let j = 0; j < guid_arr.length; j++) {
                this.sqllite.selecTableIDs('inframmessage', 'FramGuid', guid_arr[j]).then(res => {
                    farm_arr.push(res[0].name);
                    if (res[0].name.isAllSigna != 'null') {
                        this.sqllite.selecTableIDs('PiliangUnderwriting', 'FramGuid', guid_arr[j]).then(res => {
                            under_arr.push(res[0].name);
                            if (j == guid_arr.length - 1) {
                                this.up(farm_arr, under_arr);
                            }
                        });
                    } else {
                        this.comm.toast('请确认您所选中的数据，都已签字或者打印');
                    }
                });

            }
        }
    }

    fileTransfer: FileTransferObject = this.transfer.create();

    up(farm: Array<any>, under: Array<any>) {
        console.log(farm, under);
        this.http.post(`${ENV.WEB_URL}BulkUploadData`, {
            farmers: JSON.stringify(farm),
            pins: JSON.stringify(under),
            uname: this.uname
        }).subscribe(res => {
            console.log(res);
            let loader = this.loadingCtrl.create({
                content: "上传中..."
            });
            loader.present();
            if (res.Status) {
                let option: FileUploadOptions = {
                    fileKey: 'file',
                    fileName: 'name.jpg',
                };
                let arr = [
                    {name: 'FramIDFontUrl', type: 1, id: 'FramGuid'},
                    {name: 'jgdmUrl', type: 6, id: 'FramGuid'},
                    {name: 'FramIDBackUrl', type: 2, id: 'FramGuid'},
                    {name: 'fyzgzUrl', type: 5, id: 'FramGuid'},
                    {name: 'policysignaUrl', type: 3, id: 'FramGuid'},
                    {name: 'housesignaUrl', type: 3, id: 'FramGuid'},
                    {name: 'OtherPicUrl', type: 8, id: 'FramGuid'},
                    {name: 'BankCardUrl', type: 4, id: 'FramGuid'},
                ];
                let arr1 = [
                    {name: 'Animals1Url', id: 'SelfGuid', pin: '', imgType: 1, dataType: 1},
                    {name: 'Animals2Url', id: 'SelfGuid', pin: '', imgType: 1, dataType: 1},
                    {name: 'Animals3Url', id: 'SelfGuid', pin: '', imgType: 1, dataType: 1},
                    {name: 'AnimalsotherUrl', id: 'SelfGuid', pin: '', imgType: 2, dataType: 1},
                    {name: 'AnimalList', id: 'SelfGuid', pin: '', imgType: 2, dataType: 1},
                ];
                let arr2 = [
                    {name: 'imgOne', id: 'SelfGuid', pin: 'AnimalID', imgType: 1, dataType: 2},
                    {name: 'imgTwo', id: 'SelfGuid', pin: 'AnimalID', imgType: 1, dataType: 2},
                    {name: 'imgThree', id: 'SelfGuid', pin: 'AnimalID', imgType: 1, dataType: 2},
                    {name: 'OtherPicss', id: 'SelfGuid', pin: 'AnimalID', imgType: 2, dataType: 2},
                ];

                for (let i = 0; i < farm.length; i++) {
                    for (let j = 0; j < arr.length; j++) {
                        let name = arr[j].name;
                        let id = arr[j].id;
                        let type = arr[j].type;
                        if (farm[i][name] != null && name != 'OtherPicUrl') {
                            this.fileTransfer.upload(farm[i][name], `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][id] == null ? farm[i]['tyshxydm'] : farm[i][id]}&imgType=${type}&uname=${this.uname}`, option).then(res => {
                                console.log(res, 1);
                                if (!JSON.parse(res.response).Status) {
                                    this.comm.toast('上传失败');
                                    return
                                } else {
                                    if (i == farm.length - 1 && j == arr.length - 1) {
                                        for (let q = 0; q < under.length; q++) {
                                            for (let w = 0; w < arr1.length; w++) {
                                                let name = arr1[w].name;
                                                let id = arr1[w].id;
                                                let pin = arr1[w].pin;
                                                let imgType = arr1[w].imgType;
                                                let dataType = arr1[w].dataType;
                                                if (name == 'AnimalsotherUrl') {
                                                    let arr4 = under[q][name] == '' ? [] : under[q][name].split(',');
                                                    for (let y = 0; y < arr4.length; y++) {
                                                        this.fileTransfer.upload(arr4[y], `${ENV.WEB_URL}BulkUploadImg?id=${under[q][id]}&pin=''&uname=${this.uname}&imgType=2&dataType=1`, option).then(res => {
                                                            console.log(res, 7);
                                                        }).catch(err => {
                                                            console.log(err, 7);
                                                        })
                                                    }
                                                } else if (name == 'AnimalList') {
                                                    let arr3 = JSON.parse(under[q][name]);
                                                    for (let e = 0; e < arr3.length; e++) {
                                                        for (let r = 0; r < arr2.length; r++) {
                                                            let names = arr2[r].name;
                                                            let pins = arr2[r].pin;
                                                            let imgTypes = arr2[r].imgType;
                                                            let dataTypes = arr2[r].dataType;
                                                            if (names == 'OtherPicss') {
                                                                let arr5 = arr3[e][names] == '' ? [] : arr3[e][names].split(',');
                                                                for (let u = 0; u < arr5.length; u++) {
                                                                    this.fileTransfer.upload(arr5[u], `${ENV.WEB_URL}BulkUploadImg?id=${under[q]['SelfGuid']}&pin=${arr3[e][pins]}&uname=${this.uname}&imgType=2&dataType=2`, option).then(res => {
                                                                        console.log(res, 8)
                                                                    }).catch(err => {
                                                                        console.log(err, 8)
                                                                    })
                                                                }
                                                            } else {
                                                                this.fileTransfer.upload(arr3[e][names], `${ENV.WEB_URL}BulkUploadImg?id=${under[q]['SelfGuid']}&pin=${arr3[e][pins]}&uname=${this.uname}&imgType=${imgTypes}&dataType=${dataTypes}`).then(res => {
                                                                    console.log(res, 3);
                                                                }).catch(err => {
                                                                    console.log(err, 3);
                                                                })
                                                            }
                                                        }
                                                    }
                                                } else {
                                                    this.fileTransfer.upload(under[q][name], `${ENV.WEB_URL}BulkUploadImg?id=${under[q][id]}&pin=${pin}&uname=${this.uname}&imgType=${imgType}&dataType=${dataType}`, option).then(res => {
                                                        console.log(res, 2);
                                                        if (!JSON.parse(res.response).Status) {
                                                            this.comm.toast('上传失败');
                                                            return
                                                        }
                                                    }).catch(err => {
                                                        console.log(err, 2)
                                                    })
                                                }
                                            }
                                        }
                                    }
                                }
                            }).catch(err => {
                                console.log(err, 1);
                            })
                        } else if (name == 'OtherPicUrl') {
                            let list = farm[i][name] ? farm[i][name].split(',') : [];
                            for (let value of list) {
                                this.fileTransfer.upload(value, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][id] == null ? farm[i]['tyshxydm'] : farm[i][id]}&imgType=8&uname=${this.uname}`, option).then(res => {
                                    console.log(res, 12);
                                }).catch(err => {
                                    console.log(err);
                                })
                            }
                        } else if (name == 'policysignaUrl') {
                            this.fileTransfer.upload(farm[i][name] ? farm[i][name] : farm[i]['isAllSigna'], `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][id] == null ? farm[i]['tyshxydm'] : farm[i][id]}&imgType=3&uname=${this.uname}`, option).then(res => {
                                console.log(res, 13);
                            }).catch(err => {
                                console.log(err);
                            })
                        } else if (name == 'housesignaUrl') {
                            this.fileTransfer.upload(farm[i][name] ? farm[i][name] : farm[i]['isHouseSigna'], `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][id] == null ? farm[i]['tyshxydm'] : farm[i][id]}&imgType=3&uname=${this.uname}`, option).then(res => {
                                console.log(res, 14);
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                    }
                    if (i == farm.length - 1) {
                        setTimeout(() => {
                            loader.dismiss();
                            this.comm.toast('上传成功');
                        }, 10000)
                    }
                }
            }
        });
    }

    gotoChangePage(index) {
        this.navCtrl.push('ChangePage', {
            peopleID: this.mainlist[index].FramGuid,
            piliang: 'two'
        })
    }
}
