import { DbProvider } from './../../providers/db/db';
import { Component/*, ViewChild*/, ApplicationRef } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams/*, Slides*/ } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import {
    FileTransfer,
    FileTransferObject, FileUploadOptions/*, FileUploadOptions, FileTransferObject*/
} from '@ionic-native/file-transfer';

@IonicPage()
@Component({
    selector: 'page-local-underwriting-data',
    templateUrl: 'local-underwriting-data.html',
})
export class LocalUnderwritingDataPage {
    isChooseAll: boolean;
    num: number;
    mainlist: any;
    lists: Array<any>;
    isshow: boolean;
    RealName: string;
    uname: string;
    stp: string;
    canChange: Array<any>;
    index: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqllite: SqllistServiceProvider, public alertCtrl: AlertController, public comm: CommonServiceProvider, public http: AuthServiceProvider, public loadingCtrl: LoadingController, private transfer: FileTransfer, public applicationRef: ApplicationRef, public db: DbProvider) {
        this.RealName = JSON.parse(localStorage.getItem('user')).RealName;
        this.uname = JSON.parse(localStorage.getItem('user')).AccountName;
        this.isChooseAll = false;
        this.stp = this.navParams.get('type');
        this.lists = [
            {id: 1, name: '个体承保', acv: true, auditStaus: 0, FramType: 1, data: []},
            {id: 3, name: '团体承保', acv: false, auditStaus: 1, FramType: 3, data: []}
        ];
        this.init();
        this.sqllite.selectTableAll('inframmessage').then(res => {
            console.log(res);
        })
        this.sqllite.selectTableAll('Underwriting').then(res => {
            console.log(res);
        })
    }

    ionViewDidEnter() {

        this.db.selectLocalFarmer().then(res => {
            this.lists = this.lists.map(item => {
                item.data = [];
                return item;
            });
            res.map(item => {
                if (item.FramType != '3') {
                    this.lists[0].data.push(item);
                }
            });
            this.mainlist = this.lists[0].data;
        });

        let arr = [];
        let self = this;
        this.sqllite.selecTableIDs('inframmessage', 'Isloc', '1').then(res => {
            for (let i = 0; i < res.length; i++) {
                if (res[i].name.isHouseSigna && res[i].name.isHouseSigna != 'null') {
                    arr.push(true)
                } else {
                    arr.push(false)
                }
            }
            self.canChange = arr;
        });
        this.init();
        for (let s = 0; s < this.lists.length; s++) {
            if (this.lists[s].acv) {
                this.slide(s);
                break;
            }
        }
    }

    init() {
        this.all();
        this.num = 0;
    }

    all() {
        this.sqllite.selecttableonetwoth('inframmessage', [1, 2]).then(res => {
            let list = [];
            if (res.length == 0) {
                this.isshow = true;
                this.mainlist = [];
            } else {
                this.isshow = false;
                for (let j = 0; j < res.length; j++) {
                    res[j].name['acv'] = false;
                    list.push(res[j].name);
                }
                this.mainlist = list;
            }
        }).catch(err => {
            console.log(err);
        });
    }

    slide(index) {
        this.index = index;
        for (let i = 0; i < this.lists.length; i++) {
            this.lists[i].acv = false;
        }
        this.lists[index].acv = true;
        let inx = this.lists[index].id;
        this.mainlist = this.lists[index].data;
        if (inx == 1) {
            this.all();
        } else {
            this.sqllite.newselectfarmtype('inframmessage', 3).then(res => {
                let list = [];
                if (res.length == 0) {
                    this.isshow = true;
                    this.mainlist = [];
                } else {
                    this.isshow = false;
                    for (let j = 0; j < res.length; j++) {
                        res[j].name['acv'] = false;
                        list.push(res[j].name);
                    }
                    this.mainlist = list;
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }

    chooseone(index) {
        this.mainlist[index].acv = !this.mainlist[index].acv;
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

    chooseall() {
        this.isChooseAll = !this.isChooseAll;
        for (let i = 0; i < this.mainlist.length; i++) {
            this.mainlist[i].acv = this.isChooseAll;
        }
        this.checknum();
    }

    del(index) {
        event.stopPropagation();
        let that = this;
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
                            this.sqllite.deleteTable('Underwriting', 'FramGuid', this.mainlist[index].FramGuid)
                            .then(res => {
                                that.init();
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

    gotoLookPage(index) {
        if (this.mainlist[index].FramType == '3') {
            this.navCtrl.push('LookTeamMessPage', {
                FramGuid: this.mainlist[index].FramGuid
            });
        } else {
            this.navCtrl.push('LookPage', {
                FramGuid: this.mainlist[index].FramGuid
            });
        }
    }

    gotosuresingapage(index) {
        event.stopPropagation();
        this.sqllite.selecTableIDs("inframmessage", 'FramGuid', this.mainlist[index].FramGuid).then(ress => {
            console.log(ress);
            this.sqllite.selecTableIDs('Underwriting', 'FramGuid', this.mainlist[index].FramGuid).then(res => {
                console.log(res);
                if (res.length == 0) {
                    this.comm.toast('你所选的农户下还没有承保数据，请去录入')
                } else if (parseInt(ress[0].name.EarTarNum) != res.length) {
                    this.comm.toast('你所选的农户下的承包数据没有录入完成，暂不能导出投保单');
                } else {
                    this.navCtrl.push('SuresignaPage', {
                        FramGuid: this.mainlist[index].FramGuid,
                        type: this.stp
                    })
                }

            }).catch(err => {
                console.log(err);
            });
        })

    }

    upload() {
        let farmlist = [];
        for (let i = 0; i < this.mainlist.length; i++) {
            if (this.mainlist[i].acv) {
                farmlist.push(this.mainlist[i].FramGuid);
            }
        }
        let choose_arr = [];
        let pin_arr = [];
        let boo = true;
        if (farmlist.length == 0) {
            this.comm.toast('请选择你要上传的数据');
        } else {
            for (let i = 0; i < farmlist.length; i++) {
                this.sqllite.selecTableIDs('inframmessage', 'FramGuid', farmlist[i]).then(res => {
                    if (res[0].name.isAllSigna == 'null' || res[0].name.housesignaUrl == 'null') {
                        this.comm.toast('请确认所有选中的数据，都以签字或者打印');
                        return;
                    } else if (res[0].name.FramType == '1' || res[0].name.FramType == '2') {
                        choose_arr.push(res[0].name);
                        this.sqllite.selecTableIDs('Underwriting', 'FramGuid', farmlist[i]).then(mess => {
                            if (parseInt(res[0].name.EarTarNum) != mess.length) {
                                this.comm.toast('您所选的数据中，输入的标的数量和录入的标的数量不一致');
                                boo = false;
                                return;
                            } else {
                                for (let values of mess) {
                                    pin_arr.push(values.name);
                                }
                            }
                        }).catch(err => {
                            console.log(err);
                        });
                    } else if (res[0].name.FramType == '3') {
                        let farm_list = JSON.parse(res[0].name.farmsmessage);
                        choose_arr.push(res[0].name);
                        for (let value of farm_list) {
                            this.sqllite.selecTableFarmGidAndPeopleId('Underwriting', value.qiyeGuid, value.FramPeopleID).then(message => {
                                if (parseInt(value.EarTarNum) != parseInt(value.EarTarNum)) {
                                    this.comm.toast('您所选的数据中，输入的标的数量和录入的标的数量不一致');
                                    boo = false;
                                    return;
                                } else {
                                    for (let values of message) {
                                        pin_arr.push(values.name);
                                    }
                                }
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                    }
                    setTimeout(() => {
                        if (i == farmlist.length - 1 && boo) {
                            console.log(choose_arr, pin_arr);
                            this.up(choose_arr, pin_arr);
                        }
                    }, 1500)
                })
            }
        }
    }

    fileTransfer: FileTransferObject = this.transfer.create();

    up(farm: Array<any>, Under: Array<any>) {
        let that = this;
        let loader = this.loadingCtrl.create({
            content: "上传中..."
        });
        loader.present();
        for (let value of farm) {
            if (value.endtime.indexOf('24:') > -1) {
                value.endtime = value.endtime.split(' ')[0] + ' 23:59:59';
            }
        }
        that.http.post(`${ENV.WEB_URL}BatchUploadData`, {
            farmers: JSON.stringify(farm),
            pins: JSON.stringify(Under),
            uname: that.uname
        }).subscribe(res => {
            if (res.Status) {
                let option: FileUploadOptions = {
                    fileKey: 'file',
                    fileName: 'name.jpg',
                };
                for (let value of farm) {
                    let second = value.endtime.split(' ');
                    value.endtime = second[0] + ' 23:59:59';
                }
                let arr = [
                    {name: 'FramIDFontUrl', type: 1, id: 'FramGuid'},
                    {name: 'FramIDBackUrl', type: 2, id: 'FramGuid'},
                    {name: 'BankCardUrl', type: 4, id: 'FramGuid'},
                    {name: 'fyzgzUrl', type: 5, id: 'FramGuid'},
                    {name: 'jgdmUrl', type: 6, id: 'FramGuid'},
                    {name: 'policysignaUrl', type: 3, id: 'FramGuid'},
                    {name: 'housesignaUrl', type: 3, id: 'FramGuid'},
                    {name: 'OtherPicUrl', type: 8, id: 'FramGuid'},
                ];
                let arr2 = [
                    {name: 'ImplantationSiteUrl', type: 1, id: 'SelfGuid'},
                    {name: 'PositiveUrl', type: 2, id: 'SelfGuid'},
                    {name: 'LeftUrl', type: 3, id: 'SelfGuid'},
                    {name: 'RightUrl', type: 4, id: 'SelfGuid'},
                    {name: 'OtherPicUrl', type: 5, id: 'SelfGuid'},
                ];
                let promises = [];
                for (let i = 0; i < farm.length; i++) {
                    if (farm[i]['FramType'] == '3') {
                        let guid = farm[i].FramGuid;
                        let list = JSON.parse(farm[i]['farmsmessage']);
                        let promise = new Promise((resolve, reject) => {
                            // this.comm.sleep(500);
                            this.fileTransfer.upload(farm[i].jgdmUrl, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][arr[4].id]}&imgType=6&uname=${this.uname}`).then(res => {
                                res['str'] = `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][arr[4].id]}&imgType=6&uname=${this.uname}`;
                                resolve(res);
                            }).catch(err => {
                                reject(err);
                            });
                        });
                        promises.push(promise);
                        for (let z = 0; z < list.length; z++) {
                            for (let u = 0; u < arr.length; u++) {
                                let name = arr[u].name;
                                let id = arr[u].id;
                                let type = arr[u].type;
                                if (name == 'OtherPicUrl') {
                                    let arr_6 = list[z][name] == '' ? [] : list[z][name].split(',');
                                    for (let value of arr_6) {
                                        let promise = new Promise((resolve, reject) => {
                                            // this.comm.sleep(500);
                                            this.fileTransfer.upload(value, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${list[z][id]}&imgType=8&uname=${this.uname}&FramType=3`, option).then(res => {
                                                res['str'] = `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${list[z][id]}&imgType=8&uname=${this.uname}&FramType=3`;
                                                resolve(res);
                                            }).catch(err => {
                                                reject(err);
                                            });
                                        });
                                        promises.push(promise);
                                    }
                                } else if (name == 'policysignaUrl') {
                                    if (list[z][name] == '' || list[z][name] == null || list[z][name] == 'null') {
                                        name = 'isAllSigna';
                                    }
                                    let promise = new Promise((resolve, reject) => {
                                        // this.comm.sleep(500);
                                        this.fileTransfer.upload(farm[i][name], `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${list[z][id]}&imgType=3&uname=${this.uname}&FramType=3`, option).then(res => {
                                            res['str'] = `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${list[z][id]}&imgType=3&uname=${this.uname}&FramType=3`
                                            resolve(res);
                                        }).catch(err => {
                                            reject(err);
                                        });
                                    });
                                    promises.push(promise);
                                } else if (name == 'housesignaUrl') {
                                    let promise = new Promise((resolve, reject) => {
                                        // this.comm.sleep(500);
                                        this.fileTransfer.upload(farm[i][name], `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${list[z][id]}&imgType=3&uname=${this.uname}&FramType=3`, option).then(res => {
                                            res['str'] = `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${list[z][id]}&imgType=3&uname=${this.uname}&FramType=3`
                                            resolve(res);
                                        }).catch(err => {
                                            reject(err);
                                        });
                                    });
                                    promises.push(promise);
                                } else if (list[z][name] != null && list[z][name] != undefined) {
                                    let promise = new Promise((resolve, reject) => {
                                        // this.comm.sleep(500);
                                        this.fileTransfer.upload(list[z][name], `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${list[z][id]}&imgType=${type}&uname=${this.uname}&FramType=3`, option).then(res => {
                                            res['str'] = `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${list[z][id]}&imgType=${type}&uname=${this.uname}&FramType=3`;
                                            resolve(res);
                                        }).catch(err => {
                                            reject(err);
                                        });
                                    });
                                    promises.push(promise);
                                }
                            }
                        }
                        for (let q = 0; q < Under.length; q++) {
                            if (Under[q]['FramGuid'] == guid /*&& Under[q]['FramPeopleId'] == list[z]['FramPeopleID']*/) {
                                for (let w = 0; w < arr2.length; w++) {
                                    let names = arr2[w].name;
                                    // let ids = arr2[w].id;
                                    let types = arr2[w].type;
                                    if (names == 'OtherPicUrl') {
                                        let arr_4 = Under[q][names] == '' ? [] : Under[q][names].split(',');
                                        if (arr_4.length == 0) {

                                        } else {
                                            for (let r = 0; r < arr_4.length; r++) {
                                                let promise = new Promise((resolve, reject) => {
                                                    // this.comm.sleep(500);
                                                    this.fileTransfer.upload(arr_4[r], `${ENV.WEB_URL}UploadCbPinImg?pin=${Under[q]['SelfGuid']}&imgType=5&uname=${this.uname}`, option).then(res => {
                                                        res['str'] = `${ENV.WEB_URL}UploadCbPinImg?pin=${Under[q]['SelfGuid']}&imgType=5&uname=${this.uname}`;
                                                        resolve(res);
                                                    }).catch(err => {
                                                        reject(err);
                                                    });
                                                });
                                                promises.push(promise);
                                            }

                                        }
                                    } else {
                                        let promise = new Promise((resolve, reject) => {
                                            // this.comm.sleep(500);
                                            this.fileTransfer.upload(Under[q][names], `${ENV.WEB_URL}UploadCbPinImg?pin=${Under[q]['SelfGuid']}&imgType=${types}&uname=${this.uname}`, option).then(res => {
                                                res['str'] = `${ENV.WEB_URL}UploadCbPinImg?pin=${Under[q]['SelfGuid']}&imgType=5&uname=${this.uname}`;
                                                resolve(res);
                                            }).catch(err => {
                                                reject(err);
                                            });
                                        });
                                        promises.push(promise);
                                    }

                                }
                            }
                        }
                    } else {
                        let guid = farm[i].FramGuid;
                        for (let j = 0; j < arr.length; j++) {
                            let name = arr[j].name;
                            let id = arr[j].id;
                            let type = arr[j].type;
                            if (farm[i][name] != null && name != 'OtherPicUrl') {
                                let promise = new Promise((resolve, reject) => {
                                    // this.comm.sleep(500);
                                    this.fileTransfer.upload(farm[i][name], `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][id] == null ? farm[i]['tyshxydm'] : farm[i][id]}&imgType=${type}&uname=${this.uname}`, option).then(res => {
                                        res['str'] = `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][id] == null ? farm[i]['tyshxydm'] : farm[i][id]}&imgType=${type}&uname=${this.uname}`;
                                        resolve(res);
                                    }).catch(err => {
                                        reject(err);
                                    });
                                });
                                promises.push(promise);
                            } else if (name == 'policysignaUrl') {
                                let promise = new Promise((resolve, reject) => {
                                    // this.comm.sleep(500);
                                    this.fileTransfer.upload(farm[i][name] ? farm[i][name] : farm[i]['isAllSigna'], `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][id] == null ? farm[i]['tyshxydm'] : farm[i][id]}&imgType=${type}&uname=${this.uname}`, option).then(res => {
                                        res['str'] = `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][id] == null ? farm[i]['tyshxydm'] : farm[i][id]}&imgType=${type}&uname=${this.uname}`
                                        resolve(res);
                                    }).catch(err => {
                                        reject(err);
                                    });
                                });
                                promises.push(promise);
                            } else if (name == 'housesignaUrl') {
                                let promise = new Promise((resolve, reject) => {
                                    // this.comm.sleep(500);
                                    this.fileTransfer.upload(farm[i][name] ? farm[i][name] : farm[i]['isHouseSigna'], `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][id] == null ? farm[i]['tyshxydm'] : farm[i][id]}&imgType=${type}&uname=${this.uname}`, option).then(res => {
                                        res['str'] = `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][id] == null ? farm[i]['tyshxydm'] : farm[i][id]}&imgType=${type}&uname=${this.uname}`
                                        resolve(res);
                                    }).catch(err => {
                                        reject(err);
                                    });
                                });
                                promises.push(promise);
                            } else if (name == 'OtherPicUrl') {
                                let arr_5 = farm[i][name] == '' ? [] : farm[i][name].split(',');
                                for (let value of arr_5) {
                                    let promise = new Promise((resolve, reject) => {
                                        // this.comm.sleep(500);
                                        this.fileTransfer.upload(value, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][id]}&imgType=8&uname=${this.uname}`, option).then(res => {
                                            res['str'] = `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${farm[i][id]}&imgType=8&uname=${this.uname}`
                                            resolve(res);
                                        }).catch(err => {
                                            reject(err);
                                        });
                                    });
                                    promises.push(promise);
                                }
                            }
                        }
                        for (let z = 0; z < Under.length; z++) {
                            if (Under[z].FramGuid == guid) {
                                for (let p = 0; p < arr2.length; p++) {
                                    let name_1 = arr2[p].name;
                                    let id_1 = arr2[p].id;
                                    let type_1 = arr2[p].type;
                                    if (name_1 == 'OtherPicUrl') {
                                        let arr_3 = Under[z][name_1] == '' ? [] : Under[z][name_1].split(',');
                                        if (arr_3.length == 0) {

                                        } else {
                                            for (let u = 0; u < arr_3.length; u++) {
                                                let promise = new Promise((resolve, reject) => {
                                                    // this.comm.sleep(500);
                                                    this.fileTransfer.upload(arr_3[u], `${ENV.WEB_URL}UploadCbPinImg?pin=${Under[z][id_1]}&imgType=5&uname=${this.uname}`, option).then(res => {
                                                        res['str'] = `${ENV.WEB_URL}UploadCbPinImg?pin=${Under[z][id_1]}&imgType=5&uname=${this.uname}`
                                                        resolve(res);
                                                    }).catch(err => {
                                                        reject(err);
                                                    });
                                                });
                                                promises.push(promise);
                                            }
                                        }
                                    } else {
                                        let promise = new Promise((resolve, reject) => {
                                            // this.comm.sleep(500);
                                            this.fileTransfer.upload(Under[z][name_1], `${ENV.WEB_URL}UploadCbPinImg?pin=${Under[z][id_1]}&imgType=${type_1}&uname=${this.uname}`, option).then(res => {
                                                res['str'] = `${ENV.WEB_URL}UploadCbPinImg?pin=${Under[z][id_1]}&imgType=${type_1}&uname=${this.uname}`
                                                resolve(res);
                                            }).catch(err => {
                                                reject(err);
                                            });
                                        });
                                        promises.push(promise);
                                    }
                                }
                            }
                        }
                    }
                }
                Promise.all(promises).then(function (values) {
                    console.log(values);
                    let flag = 1;
                    for (const iterator of values) {
                        if (iterator.responseCode === 200) {
                            let info = JSON.parse(iterator.response);
                            if (!info.Status) {
                                flag = 0;
                                break;
                            }
                        } else {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag === 0) {
                        for (let t = 0; t < farm.length; t++) {
                            that.sqllite.deleteTable('inframmessage', 'FramGuid', farm[t]['FramGuid']).then(res => {
                                if (t == farm.length - 1) {
                                    for (let y = 0; y < Under.length; y++) {
                                        that.sqllite.deleteTable('Underwriting', 'SelfGuid', Under[y]['SelfGuid']).then(res => {
                                        })
                                    }
                                }
                            })
                        }
                        loader.dismiss();
                        that.comm.toast('上传成功');
                        that.slide(that.index ? that.index : 0);
                    } else {
                        for (let t = 0; t < farm.length; t++) {
                            that.sqllite.deleteTable('inframmessage', 'FramGuid', farm[t]['FramGuid']).then(res => {
                                if (t == farm.length - 1) {
                                    for (let y = 0; y < Under.length; y++) {
                                        that.sqllite.deleteTable('Underwriting', 'SelfGuid', Under[y]['SelfGuid']).then(res => {
                                        })
                                    }
                                }
                            })
                        }
                        loader.dismiss();
                        that.comm.toast('上传成功');
                        that.slide(that.index ? that.index : 0);
                    }
                });
            } else {
                loader.dismiss();
                let list_str = res.Data ? res.Data.join() : [];
                that.comm.toast(`${list_str}已经录入过了，请勿重复录入`);
            }
        });
    }

    edit(item) {
        this.navCtrl.push('ChangePage', {
            peopleID: item.FramGuid,
            piliang: 'one'
        });
    }
}
