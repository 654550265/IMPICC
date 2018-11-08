import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, Slides } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { FileTransferObject, FileTransfer } from "@ionic-native/file-transfer";
import { ENV } from "../../config/environment";
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
    selector: 'page-li-pei-no-pass',
    templateUrl: 'li-pei-no-pass.html',
})
export class LiPeiNoPassPage {
    @ViewChild(Slides) slides: Slides;
    list: Array<{ id: number, name: string, acv: boolean, auditStaus: number }>;
    NoPassList: Array<any>;
    ChenName: string;
    num: number;
    isChooseAll: boolean;
    page: number;
    e: any;
    isNoPassList: boolean;
    LocalisNoPassList: boolean;
    NoPassListLocal: Array<any>;
    nums: number;
    isChooseAllLoc: boolean;
    DieName: string;
    uN: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public loadingCtrl: LoadingController, public comm: CommonServiceProvider, public sql: SqllistServiceProvider, private transfer: FileTransfer, private file: File, public alertCtrl: AlertController) {
        let loader = this.loadingCtrl.create({
            content: "下载中...",
            duration: 3000
        });
        loader.present();
        this.ChenName = JSON.parse(localStorage.getItem('user')).RealName;
        this.uN = JSON.parse(localStorage.getItem('user')).AccountName;
        this.isChooseAll = false;
        this.list = [
            {id: 0, name: '云端数据', acv: true, auditStaus: 0},
            {id: 1, name: '本地数据', acv: false, auditStaus: 1}
        ];
        this.num = 0;
        this.localInit();
        http.get(`${ENV.WEB_URL}LpAuditRecordList?uname=${JSON.parse(localStorage.getItem('user')).AccountName}&auditStaus=2&page=1&psize=5`)
            .subscribe(res => {
                if (res.Status) {
                    if (res.MyObject.length == 0) {
                        this.isNoPassList = true;
                        this.NoPassList = res.MyObject;
                        loader.dismiss();
                    } else {
                        this.isNoPassList = false;
                        for (let i = 0; i < res.MyObject.length; i++) {
                            res.MyObject[i].active = false;
                        }
                    }
                    this.NoPassList = res.MyObject;
                    loader.dismiss();
                }
            });
    }

    /*本地数据初始化*/
    localInit() {
        this.isChooseAllLoc = false;
        this.nums = 0;
        this.sql.selectTableAll('FramLiPeiNoPass').then(res => {
            if (res.length == 0) {
                this.LocalisNoPassList = true;
                this.NoPassListLocal = res;
            } else {
                this.LocalisNoPassList = false;
                for (let i = 0; i < res.length; i++) {
                    res[i]['active'] = false;
                }
                this.NoPassListLocal = res;
            }
        }).catch(e => {
            console.log(e)
        });
    }

    ionViewDidEnter() {
        this.localInit();
    }

    LocalMessageUpDatas() {
        let n = [];
        let dieMess = JSON.parse(localStorage.getItem('dieMessage'));
        for (let i = 0; i < this.NoPassListLocal.length; i++) {
            if (this.NoPassListLocal[i].active) {
                for (let j = 0; j < dieMess.length; j++) {
                    for (let k = 0; k < (dieMess[j].items == null ? [] : dieMess[j].items).length; k++) {
                        if (this.NoPassListLocal[i].name.DieMessage == dieMess[j].items[k].id) {
                            this.NoPassListLocal[i].name.DieMessage = this.NoPassListLocal[i].name.DieMessage + "," + dieMess[j].items[k].name;
                        }
                    }
                }
                n.push(this.NoPassListLocal[i].name);
            }
        }

        if (this.nums == 0) {
            this.comm.toast('请选择你要的上传的数据')
        } else {
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: '确定要上传这几条数据吗？',
                buttons: [
                    {
                        text: '取消',
                        handler: () => {

                        }
                    },
                    {
                        text: '确定',
                        handler: () => {
                            let loader = this.loadingCtrl.create({
                                content: "上传中...",
                                duration: 3000
                            });
                            loader.present();
                            this.http.post(`${ENV.WEB_URL}UpdateLpPinData`, {
                                pins: JSON.stringify(n)
                            }).subscribe(res => {
                                if (res.Status) {
                                    for (let i = 0; i < n.length; i++) {
                                        this.fileTransfer.upload(`${n[i].bankUrl}`, `${ENV.WEB_URL}UpdateLpImg?id=${n[i].IID}&imgType=4&uname=${this.uN}`).then(res => {
                                            this.fileTransfer.upload(`${n[i].deathUrl}`, `${ENV.WEB_URL}UpdateLpImg?id=${n[i].IID}&imgType=8&uname=${this.uN}`).then(res => {
                                                this.fileTransfer.upload(`${n[i].disposealUrl}`, `${ENV.WEB_URL}UpdateLpImg?id=${n[i].IID}&imgType=7&uname=${this.uN}`).then(res => {
                                                    this.fileTransfer.upload(`${n[i].idbackUrl}`, `${ENV.WEB_URL}UpdateLpImg?id=${n[i].IID}&imgType=2&uname=${this.uN}`).then(res => {
                                                        this.fileTransfer.upload(`${n[i].idfrontUrl}`, `${ENV.WEB_URL}UpdateLpImg?id=${n[i].IID}&imgType=1&uname=${this.uN}`).then(res => {
                                                            this.fileTransfer.upload(`${n[i].localUrl}`, `${ENV.WEB_URL}UpdateLpImg?id=${n[i].IID}&imgType=6&uname=${this.uN}`).then(res => {
                                                                if (n[i].otherImgs == '') {
                                                                    this.sql.deleteTable('FramLiPeiNoPass', 'IID', n[i].IID).then(res => {
                                                                        if (i == n.length - 1) {
                                                                            loader.dismiss();
                                                                            this.comm.toast('上传成功');
                                                                            this.localInit();
                                                                        }
                                                                    }).catch(e => {
                                                                        console.log(e)
                                                                    });

                                                                } else {
                                                                    let lens = n[i].otherImgs.split(',');
                                                                    for (let j = 0; j < lens.length; j++) {
                                                                        this.fileTransfer.upload(`${lens[j]}`, `${ENV.WEB_URL}UpdateLpImg?id=${n[i].IID}&imgType=5&uname=${this.uN}`).then(res => {
                                                                            if (j == lens.length - 1) {
                                                                                this.sql.deleteTable('FramLiPeiNoPass', 'IID', n[i].IID).then(res => {
                                                                                    if (i == n.length - 1) {
                                                                                        loader.dismiss();
                                                                                        this.comm.toast('上传成功');
                                                                                        this.localInit();
                                                                                    }
                                                                                }).catch(e => {
                                                                                    console.log(e)
                                                                                });
                                                                            }
                                                                        }).catch(e => {
                                                                            console.log(e)
                                                                        });
                                                                    }
                                                                }
                                                            }).catch(e => {
                                                                console.log(e)
                                                            });
                                                        }).catch(e => {
                                                            console.log(e)
                                                        });
                                                    }).catch(e => {
                                                        console.log(e)
                                                    });
                                                }).catch(e => {
                                                    console.log(e)
                                                });
                                            }).catch(e => {
                                                console.log(e)
                                            });
                                        }).catch(e => {
                                            console.log(e)
                                        });
                                    }
                                } else {
                                    this.comm.toast(res.Message);
                                }
                            })
                        }
                    }]
            });
            confirm.present();
        }
    }

    /*本地单选*/
    chooseOneLocs(index) {
        if (this.NoPassListLocal[index].active) {
            this.NoPassListLocal[index].active = false;
        } else {
            this.NoPassListLocal[index].active = true;
        }
        let n = 0;
        for (let i = 0; i < this.NoPassListLocal.length; i++) {
            if (this.NoPassListLocal[i].active) {
                n += 1;
            }
        }
        this.nums = n;
    }

    chooseAllLocs() {
        if (this.isChooseAllLoc) {
            this.nums = 0;
            this.isChooseAllLoc = false;
            for (let i = 0; i < this.NoPassListLocal.length; i++) {
                this.NoPassListLocal[i].active = false;
            }
        } else {
            this.nums = this.NoPassListLocal.length;
            this.isChooseAllLoc = true;
            for (let i = 0; i < this.NoPassListLocal.length; i++) {
                this.NoPassListLocal[i].active = true;
            }
        }
    }

    slide(index) {
        this.slides.lockSwipes(false);
        this.list.map((item) => {
            item['acv'] = false;
            return item;
        });
        index.acv = true;
        this.slides.slideTo(index.id);
        this.slides.lockSwipes(true);
    }

    /*云端单选*/
    chooseOne(index) {
        if (this.NoPassList[index].active) {
            this.NoPassList[index].active = false;
        } else {
            this.NoPassList[index].active = true;
        }
        let n = 0;
        for (let i = 0; i < this.NoPassList.length; i++) {
            if (this.NoPassList[i].active) {
                n += 1;
            }
        }
        this.num = n;
    }

    /*云端全选*/
    chooseAll() {
        if (this.isChooseAll) {
            this.num = 0;
            this.isChooseAll = false;
            for (let i = 0; i < this.NoPassList.length; i++) {
                this.NoPassList[i].active = false;
            }
        } else {
            this.num = this.NoPassList.length;
            this.isChooseAll = true;
            for (let i = 0; i < this.NoPassList.length; i++) {
                this.NoPassList[i].active = true;
            }
        }
    }

    doRefresh(e) {
        this.page = 1;
        if (this.e) {
            this.e.enable(true);
        }
        this.http.get(`${ENV.WEB_URL}LpAuditRecordList?uname=${JSON.parse(localStorage.getItem('user')).AccountName}&auditStaus=2&page=1&psize=5`)
            .subscribe(res => {
                if (res.Status) {
                    this.NoPassList = res.MyObject;
                    if (this.NoPassList.length == 0) {
                        this.isNoPassList = true;
                        e.complete();
                    } else {
                        for (let i = 0; i < this.NoPassList.length; i++) {
                            this.NoPassList[i]['active'] = false;
                        }
                        e.complete();
                    }
                }
            });
    }

    doInfinite(e) {
        this.e = e;
        this.page++;
        this.http.get(`${ENV.WEB_URL}LpAuditRecordList?uname=${JSON.parse(localStorage.getItem('user')).AccountName}&auditStaus=2&page=${this.page}&psize=5`)
            .subscribe(res => {
                if (res.Status) {
                    for (let i = 0; i < res.MyObject.length; i++) {
                        res.MyObject[i]['active'] = false;
                        this.NoPassList.push(res.MyObject[i]);
                    }
                    if (res.MyObject.length < 5) {
                        this.e.enable(false);
                    }
                    this.e.complete();
                }
            });
    }

    gotoY(index) {
        this.navCtrl.push('LiPeiNoPassListPage', {
            id: this.NoPassList[index].Id
        })
    }

    gotoYLocal(index) {
        this.navCtrl.push('LiPeiNoPassChangePage', {
            message: this.NoPassListLocal[index]
        })
    }

    deleteFs(item) {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '确定要删除这条数据吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        this.sql.deleteTable('FramLiPeiNoPass', 'IID', this.NoPassListLocal[item].name.IID).then(res => {
                            this.localInit();
                            this.comm.toast('删除成功');
                        }).catch(e => {
                            console.log(e)
                        });
                    }
                }]
        });
        confirm.present();

    }

    data = this.sql.database;
    fileTransfer: FileTransferObject = this.transfer.create();

    NoPassMessageUpDataService() {
        let n = [];
        for (let i = 0; i < this.NoPassList.length; i++) {
            if (this.NoPassList[i].active) {
                n.push(this.NoPassList[i].Id);
            }
        }
        if (this.num == 0) {
            this.comm.toast('请选择您要下载的数据')
        } else {
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: '确定要下载这几条数据吗？',
                buttons: [
                    {
                        text: '取消',
                        handler: () => {

                        }
                    },
                    {
                        text: '确定',
                        handler: () => {
                            let loader = this.loadingCtrl.create({
                                content: "下载中...",
                                duration: 3000
                            });
                            loader.present();
                            this.http.get(`${ENV.WEB_URL}GetLpRecordDetails?ids=${n.join()}`).subscribe(res => {
                                if (res.Status) {
                                    let list = res.MyObject;
                                    let z = JSON.parse(localStorage.getItem('dieMessage'));
                                    for (let i = 0; i < list.length; i++) {
                                        for (let j = 0; j < z.length; j++) {
                                            if (list[i].DieMessage == z[j].Id) {
                                                list[i].DieMessage = list[i].DieMessage + ',' + z[j].Name;
                                            }
                                        }
                                        this.loadpic(`${list[i].bankUrl}`).then(bankUrl => {
                                            this.loadpic(`${list[i].deathUrl}`).then(deathUrl => {
                                                this.loadpic(`${list[i].disposealUrl}`).then(disposealUrl => {
                                                    this.loadpic(`${list[i].idbackUrl}`).then(idbackUrl => {
                                                        this.loadpic(`${list[i].idfrontUrl}`).then(idfrontUrl => {
                                                            this.loadpic(`${list[i].localUrl}`).then(localUrl => {
                                                                if (list[i].otherImgs.length == 0) {
                                                                    this.data.executeSql(`INSERT INTO FramLiPeiNoPass (IID,Reason,DieMessage,FramPeopleID,bankName,bankUrl,deathUrl,disposealUrl,idbackUrl,idfrontUrl,localUrl,otherImgs,pin,uid,Isloc) VALUES('${list[i].id}','${list[i].Reason}','${list[i].DieMessage}','${list[i].FramPeopleID}','${list[i].bankName}','${bankUrl}','${deathUrl}','${disposealUrl}','${idbackUrl}','${idfrontUrl}','${localUrl}','','${list[i].pin}','${JSON.parse(localStorage.getItem('user')).AccountName}',1)`, {}).then(res => {
                                                                        if (i == list.length - 1) {
                                                                            loader.dismiss();
                                                                            this.comm.toast('下载成功');
                                                                            this.localInit();
                                                                        }
                                                                    }).catch(e => {
                                                                        console.log(e)
                                                                    });
                                                                } else {
                                                                    let lens = [];
                                                                    for (let j = 0; j < list[i].otherImgs.length; j++) {
                                                                        this.loadpic(list[i].otherImgs[j]).then(res => {
                                                                            lens.push(res);
                                                                            if (j == list[i].otherImgs.length - 1) {
                                                                                this.data.executeSql(`INSERT INTO FramLiPeiNoPass (IID,Reason,DieMessage,FramPeopleID,bankName,bankUrl,deathUrl,disposealUrl,idbackUrl,idfrontUrl,localUrl,otherImgs,pin,uid,Isloc) VALUES('${list[i].id}','${list[i].Reason}','${list[i].DieMessage}','${list[i].FramPeopleID}','${list[i].bankName}','${bankUrl}','${deathUrl}','${disposealUrl}','${idbackUrl}','${idfrontUrl}','${localUrl}','${lens.join()}','${list[i].pin}','${JSON.parse(localStorage.getItem('user')).AccountName}',1)`, {}).then(res => {
                                                                                    if (i == list.length - 1) {
                                                                                        loader.dismiss();
                                                                                        this.comm.toast('下载成功');
                                                                                        this.localInit();
                                                                                    }
                                                                                }).catch(e => {
                                                                                    console.log(e)
                                                                                });
                                                                            }
                                                                        }).catch(e => {
                                                                            console.log(e)
                                                                        })
                                                                    }
                                                                }
                                                            }).catch(e => {
                                                                console.log(e)
                                                            });
                                                        }).catch(e => {
                                                            console.log(e)
                                                        });
                                                    }).catch(e => {
                                                        console.log(e)
                                                    });
                                                }).catch(e => {
                                                    console.log(e)
                                                });
                                            }).catch(e => {
                                                console.log(e)
                                            });
                                        }).catch(e => {
                                            console.log(e)
                                        });
                                    }
                                }
                            });
                        }
                    }
                ]
            });
            confirm.present();
        }
    }

    loadpic(src) {
        if (src) {
            let name = src.split('/')[src.split('/').length - 1];
            return this.fileTransfer.download(`${ENV.IMG_URL + src}`, `${this.file.dataDirectory + name}`).then((entry) => {
                return entry.nativeURL;
            }, (error) => {
                // handle error
            });
        } else {
            this.comm.toast('请确认所有选中的数据，照片都已上传');
        }
    }
}
