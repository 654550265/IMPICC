import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { ENV } from "../../config/environment";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
    selector: 'page-findings-of-audit',
    templateUrl: 'findings-of-audit.html',
})
export class FindingsOfAuditPage {
    @ViewChild(Slides) slides: Slides;
    list: Array<{ id: number, name: string, acv: boolean, auditStaus: number }>;
    Examine: Array<any>;
    ChenName: string;
    page: number;
    isExamine: boolean;
    isChooseAll: boolean;
    num: number;
    Status: number;
    pages: number;
    isshow: boolean;
    loader: any;
    canChange: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public loadingCtrl: LoadingController, public comm: CommonServiceProvider, public alertCtrl: AlertController, public ngZone: NgZone, public sql: SqllistServiceProvider, private transfer: FileTransfer, public file: File) {
        this.num = 0;
        this.list = [
            {id: 1, name: '审核通过', acv: true, auditStaus: 0},
            {id: 2, name: '审核未通过', acv: false, auditStaus: 1},
            {id: 3, name: '本地审核未通过', acv: false, auditStaus: 1},
        ];
        this.page = 1;
        this.ChenName = JSON.parse(localStorage.getItem('user')).RealName;
        this.isChooseAll = false;
        this.Status = 1;
        this.pages = 1;
        this.pass(0);
    }

    ionViewDidEnter() {
        for(let i = 0;i<this.list.length;i++){
            if(this.list[i].acv&&this.list[i].id==3){
                this.getLocalData();
            }
        }

    }

    pass(index) {
        this.http.get(`${ENV.WEB_URL}CbAuditRecordList?uname=${JSON.parse(localStorage.getItem('user')).AccountName}&auditStaus=${this.Status}&page=${this.pages}&psize=5`)
        .subscribe(res => {
            if (res.Status) {
                if (index == 0 || index == 1) {
                    if (res.MyObject.length == 0) {
                        this.isshow = true;
                        this.Examine = [];
                    } else {
                        this.isshow = false;
                        for (let i = 0; i < res.MyObject.length; i++) {
                            res.MyObject[i].acv = false;
                        }
                        this.Examine = res.MyObject;
                        if (this.Examine.length == 0) {
                            this.isExamine = true;
                        }
                    }
                }
                if (index == 2) {
                    for (let i = 0; i < res.MyObject.length; i++) {
                        this.Examine.push(res.MyObject[i]);
                    }
                }
            }
        });
    }

    doRefresh(event) {
        this.pages = 1;
        if (this.Status == 3) {

        } else {
            this.pass(1);
            setTimeout(() => {
                event.complete();
            }, 1000);
        }
    }

    doInfinite(event) {
        if (this.Status == 3) {

        } else {
            this.pages += 1;
            this.pass(2);
            setTimeout(() => {
                event.complete();
            }, 1000);
        }
    }

    slide(index) {
        this.Examine = [];
        this.pages = 1;
        for (let i = 0; i < this.list.length; i++) {
            this.list[i].acv = false;
        }
        this.list[index].acv = true;
        this.Status = this.list[index].id;
        if (this.Status == 3) {
            this.getLocalData();
        } else {
            this.pass(0);
        }
    }

    chooseone(index) {
        this.Examine[index].acv = !this.Examine[index].acv;
        this.checknum()
    }

    chooseall() {
        this.isChooseAll = !this.isChooseAll;
        for (let i = 0; i < this.Examine.length; i++) {
            this.Examine[i].acv = this.isChooseAll;
        }
        this.checknum()
    }

    checknum() {
        let num = 0;
        for (let i = 0; i < this.Examine.length; i++) {
            if (this.Examine[i].acv) {
                num += 1;
            }
        }
        this.num = num;
    }

    checklook(ids) {
        if (ids.isPass) {
            if (ids.FramType == '4' || ids.FramType == '5') {
                this.navCtrl.push('PiLiangLookBaoPage', {
                    FramGuid: ids.FramGuid
                })
            } else {
                this.navCtrl.push('LookPage', {
                    FramGuid: ids.FramGuid
                })
            }
        } else {
            if (ids.FarmType != 3) {
                this.navCtrl.push('YesPassPage', {
                    id: ids.Id,
                    auditStaus: this.Status
                });
            } else {
                this.navCtrl.push('YesPassTuanPage', {
                    id: ids.Id,
                    auditStaus: this.Status
                })
            }
        }
    }

    getLocalData() {
        let arr = [];
        this.Examine = [];
        this.sql.selectAllNoPass('inframmessage', [1, 2, 3, 4, 5]).then(res => {
            for (let i = 0; i < res.length; i++) {
                if (res.length != 0) {
                    if (res[i].name.housesignaUrl&&res[i].name.housesignaUrl != ''&&res[i].name.housesignaUrl != null) {
                        arr.push(true)
                    } else {
                        arr.push(false)
                    }
                    res[i].name['acv'] = false;
                    res[i].name['insurancetype'] = res[i].name['insurancetype'].split(',')[1];
                    res[i].name['insuranceproname'] = res[i].name['insuranceproname'].split(',')[1];
                    res[i].name['createtime'] = res[i].name['createtime'].split(' ')[0];
                    this.Examine.push(res[i]['name']);
                    this.isshow = false;
                } else {
                    this.isshow = true;
                }
            }
            this.canChange = arr;
        })
    }

    dwonload() {
        let loadText = `下载中...`;
        if (this.num == 0) {
            this.comm.toast('请选择你要下载的数据');
        } else {
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: `确定下载 ${this.num} 条数据吗？ （注：下载会覆盖掉本地数据，请确认本地数据已上传）`,
                buttons: [
                    {
                        text: '取消',
                        handler: () => {
                        }
                    },
                    {
                        text: '确定',
                        handler: async () => {
                            let loader = this.loadingCtrl.create({
                                content: loadText,
                                duration: 300000
                            });
                            loader.present();
                            let list = [];
                            for (let i = 0; i < this.Examine.length; i++) {
                                if (this.Examine[i].acv) {
                                    list.push(this.Examine[i].Id)
                                }
                            }
                            this.http.get(`${ENV.WEB_URL}GetAuditRecordDetails?ids=${list.join()}&auditStatus=2`).subscribe(async res => {
                                if (res.Status) {
                                    if (window['cordova']) {
                                        for (const iterator of res.MyObject) {
                                            let isexist = await this.sql.selecByColumn("inframmessage", "FramPeopleID", iterator.FramPeopleID);
                                            if (isexist['rows'].length > 0) {
                                                await this.sql.deleteByColumn("inframmessage", "FramPeopleID", iterator.FramPeopleID);
                                                await this.sql.deleteByColumn("Underwriting", "FramPeopleId", iterator.FramPeopleID);
                                            }
                                        }
                                    }
                                    res.MyObject = res.MyObject.map((item) => {
                                        item.isPass = 2;
                                        return item;
                                    });
                                    this.comm.downloadImgs(res.MyObject).then(newarr => {
                                        this.comm.insertCollection(newarr).then((result) => {
                                            loader.dismiss();
                                            this.comm.toast('下载成功');
                                        });
                                    });
                                }
                            })
                        }
                    }
                ]
            });
            confirm.present();
        }
    }

    upload() {
        let oneguidlist = [];   //单个的guid列表
        let plguidlist = [];    //批量的guid列表
        let onefarmlist = [];   //单个的农户列表
        let onepinlist = [];    //单个的承保列表
        let pilifarmlist = [];  //批量的农户列表
        let pilipinlist = [];   //批量的承保列表
        for (let i = 0; i < this.Examine.length; i++) {
            if (this.Examine[i].acv) {
                if (this.Examine[i].FramType == '4' || this.Examine[i].FramType == '5') {
                    plguidlist.push(this.Examine[i].FramGuid);
                } else {
                    oneguidlist.push(this.Examine[i].FramGuid);
                }
            }
        }
        if (oneguidlist.length == 0 && plguidlist.length == 0) {
            this.comm.toast('请选择您要上传的数据');
        } else {
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: `确定上传这几条数据吗？`,
                buttons: [
                    {
                        text: '取消',
                        handler: () => {
                        }
                    },
                    {
                        text: '确定',
                        handler: () => {
                            this.loader = this.loadingCtrl.create({
                                content: "上传中..."
                            });
                            this.loader.present();
                            for (let i = 0; i < oneguidlist.length; i++) {
                                this.sql.selecTableIDs('inframmessage', 'FramGuid', oneguidlist[i]).then(res => {
                                    onefarmlist.push(res[0].name);
                                    this.sql.selecTableIDs('Underwriting', 'FramGuid', oneguidlist[i]).then(mess => {
                                        for (let j = 0; j < mess.length; j++) {
                                            onepinlist.push(mess[j].name);
                                        }
                                    })
                                }).catch(err => {
                                    console.log(err)
                                });
                            }
                            for (let i = 0; i < plguidlist.length; i++) {
                                this.sql.selecTableIDs('inframmessage', 'FramGuid', plguidlist[i]).then(res => {
                                    pilifarmlist.push(res[0].name);
                                    this.sql.selecTableIDs('PiliangUnderwriting', 'FramGuid', plguidlist[i]).then(mess => {
                                        for (let j = 0; j < mess.length; j++) {
                                            pilipinlist.push(mess[j].name);
                                        }
                                    })
                                }).catch(err => {
                                    console.log(err)
                                });
                            }
                            setTimeout(() => {
                                this.up(onefarmlist, onepinlist, pilifarmlist, pilipinlist);
                            }, 1000);
                        }
                    }
                ]
            });
            confirm.present();
        }
    }


    fileTransfer: FileTransferObject = this.transfer.create();

    up(onefarmlist: Array<any>, onepinlist: Array<any>, pilifarmlist: Array<any>, pilipinlist: Array<any>) {
        this.http.post(`${ENV.WEB_URL}UpdateCbData`, {
            farmers: JSON.stringify(onefarmlist),
            pins: JSON.stringify(onepinlist),
            uname: JSON.parse(localStorage.getItem('user')).AccountName
        }).subscribe(res => {
            if (res.Status) {
                this.http.post(`${ENV.WEB_URL}BatchUpdateCbData`, {
                    farmers: JSON.stringify(pilifarmlist),
                    pins: JSON.stringify(pilipinlist),
                    uname: JSON.parse(localStorage.getItem('user')).AccountName
                }).subscribe(mess => {
                    if (mess.Status) {
                        let images = [[], [], [], []];
                        onefarmlist.map((item) => {
                            if (item.farmsmessage == null || item.farmsmessage == '') {
                                for (let key in item) {
                                    let obj = {};
                                    if (item[key] != null && item[key] != '') {
                                        if (key === 'FramIDBackUrl') {
                                            obj['name'] = item[key];
                                            obj['imgType'] = 2;
                                            obj['id'] = item.FramGuid;
                                            images[0].push(obj);
                                        } else if (key === 'FramIDFontUrl') {
                                            obj['name'] = item[key];
                                            obj['imgType'] = 1;
                                            obj['id'] = item.FramGuid;
                                            images[0].push(obj);
                                        } else if (key === 'fyzgzUrl') {
                                            obj['name'] = item[key];
                                            obj['imgType'] = 5;
                                            obj['id'] = item.FramGuid;
                                            images[0].push(obj);
                                        } else if (key === 'BankCardUrl') {
                                            obj['name'] = item[key];
                                            obj['imgType'] = 4;
                                            obj['id'] = item.FramGuid;
                                            images[0].push(obj);
                                        } else if (key === 'jgdmUrl') {
                                            obj['name'] = item[key];
                                            obj['imgType'] = 6;
                                            obj['id'] = item.FramGuid;
                                            images[0].push(obj);
                                        } else if (key === 'OtherPicUrl') {
                                            let list = item[key] ? item[key].split(',') : [];
                                            for (let values of list) {
                                                let ob = {};
                                                ob['name'] = values;
                                                ob['imgType'] = 8;
                                                ob['id'] = item.FramGuid;
                                                images[0].push(ob);
                                            }
                                        }
                                    }
                                }
                            } else {
                                let farmmessagelist = JSON.parse(item.farmsmessage);
                                for (let value of farmmessagelist) {
                                    for (let key in value) {
                                        let obj = {};
                                        if (value[key] != null && value[key] != '') {
                                            if (key === 'BankCardUrl') {
                                                obj['name'] = value[key];
                                                obj['imgType'] = 4;
                                                obj['id'] = value['FramGuid'];
                                                images[0].push(obj);
                                            } else if (key === 'FramIDBackUrl') {
                                                obj['name'] = value[key];
                                                obj['imgType'] = 2;
                                                obj['id'] = value['FramGuid'];
                                                images[0].push(obj);
                                            } else if (key === 'FramIDFontUrl') {
                                                obj['name'] = value[key];
                                                obj['imgType'] = 1;
                                                obj['id'] = value['FramGuid'];
                                                images[0].push(obj);
                                            } else if (key === 'fyzgzUrl') {
                                                obj['name'] = value[key];
                                                obj['imgType'] = 5;
                                                obj['id'] = value['FramGuid'];
                                                images[0].push(obj);
                                            } else if (key === 'jgdmUrl') {
                                                obj['name'] = value[key];
                                                obj['imgType'] = 6;
                                                obj['id'] = value['FramGuid'];
                                                images[0].push(obj);
                                            } else if (key === 'OtherPicUrl') {
                                                let list = value[key] ? value[key].split(',') : [];
                                                for (let value of list) {
                                                    let ob = {};
                                                    ob['name'] = value;
                                                    ob['imgType'] = 8;
                                                    ob['id'] = value['FramGuid'];
                                                    images[0].push(ob);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        onepinlist.map((item) => {
                            for (let key in item) {
                                let obj = {};
                                if (item[key] != null && item[key] != '') {
                                    if (key === 'ImplantationSiteUrl') {
                                        obj['name'] = item[key];
                                        obj['imgType'] = 1;
                                        obj['id'] = item.SelfGuid;
                                        images[1].push(obj);
                                    } else if (key === 'PositiveUrl') {
                                        obj['name'] = item[key];
                                        obj['imgType'] = 2;
                                        obj['id'] = item.SelfGuid;
                                        images[1].push(obj);
                                    } else if (key === 'LeftUrl') {
                                        obj['name'] = item[key];
                                        obj['imgType'] = 3;
                                        obj['id'] = item.SelfGuid;
                                        images[1].push(obj);
                                    } else if (key === 'RightUrl') {
                                        obj['name'] = item[key];
                                        obj['imgType'] = 4;
                                        obj['id'] = item.SelfGuid;
                                        images[1].push(obj);
                                    } else if (key === 'OtherPicUrl') {
                                        let other = item[key] == null ? [] : item[key].split(',');
                                        other.map((subitem) => {
                                            let objs = {};
                                            objs['name'] = subitem;
                                            objs['imgType'] = 5;
                                            objs['id'] = item.SelfGuid;
                                            images[1].push(objs);
                                        });

                                    }
                                }
                            }
                        });
                        pilifarmlist.map((item) => {
                            for (let key in item) {
                                let obj = {};
                                if (item[key] != null && item[key] != '') {
                                    if (key === 'FramIDBackUrl') {
                                        obj['name'] = item[key];
                                        obj['imgType'] = 2;
                                        obj['id'] = item.FramGuid;
                                        images[2].push(obj);
                                    } else if (key === 'FramIDFontUrl') {
                                        obj['name'] = item[key];
                                        obj['imgType'] = 1;
                                        obj['id'] = item.FramGuid;
                                        images[2].push(obj);
                                    } else if (key === 'fyzgzUrl') {
                                        obj['name'] = item[key];
                                        obj['imgType'] = 5;
                                        obj['id'] = item.FramGuid;
                                        images[2].push(obj);
                                    } else if (key === 'BankCardUrl') {
                                        obj['name'] = item[key];
                                        obj['imgType'] = 4;
                                        obj['id'] = item.FramGuid;
                                        images[2].push(obj);
                                    } else if (key === 'jgdmUrl') {
                                        obj['name'] = item[key];
                                        obj['imgType'] = 6;
                                        obj['id'] = item.FramGuid;
                                        images[2].push(obj);
                                    } else if (key === 'OtherPicUrl') {
                                        let list = item[key] ? item[key].split(',') : [];
                                        for (let values of list) {
                                            let ob = {};
                                            ob['name'] = values;
                                            ob['imgType'] = 8;
                                            ob['id'] = item.FramGuid;
                                            images[2].push(ob);
                                        }
                                    }
                                }
                            }
                        });
                        pilipinlist.map(item => {
                            for (let key in item) {
                                let obj = {};
                                if (item[key] != null && item[key] != '') {
                                    if (key === 'Animals1Url') {
                                        obj['name'] = item[key];
                                        obj['imgType'] = 1;
                                        obj['dataType'] = 1;
                                        obj['id'] = item['SelfGuid'];
                                        obj['pin'] = '';
                                        images[3].push(obj);
                                    } else if (key === 'Animals2Url') {
                                        obj['name'] = item[key];
                                        obj['imgType'] = 1;
                                        obj['dataType'] = 1;
                                        obj['id'] = item['SelfGuid'];
                                        obj['pin'] = '';
                                        images[3].push(obj);
                                    } else if (key === 'Animals3Url') {
                                        obj['name'] = item[key];
                                        obj['imgType'] = 1;
                                        obj['dataType'] = 1;
                                        obj['id'] = item['SelfGuid'];
                                        obj['pin'] = '';
                                        images[3].push(obj);
                                    } else if (key === 'AnimalsotherUrl') {
                                        let list = item[key].split(',');
                                        for (let value of list) {
                                            let objs = {};
                                            objs['name'] = value;
                                            objs['imgType'] = 2;
                                            objs['dataType'] = 1;
                                            objs['id'] = item['SelfGuid'];
                                            objs['pin'] = '';
                                            images[3].push(objs);
                                        }
                                    } else if (key === 'AnimalList') {
                                        let lists = JSON.parse(item[key]);
                                        for (let value of lists) {
                                            for (let subkey in value) {
                                                let subobj = {};
                                                if (subkey === 'imgOne') {
                                                    subobj['name'] = value[subkey];
                                                    subobj['imgType'] = 1;
                                                    subobj['dataType'] = 2;
                                                    subobj['id'] = item['SelfGuid'];
                                                    subobj['pin'] = value['AnimalID'];
                                                    images[3].push(subobj);
                                                } else if (subkey === 'imgTwo') {
                                                    subobj['name'] = value[subkey];
                                                    subobj['imgType'] = 1;
                                                    subobj['dataType'] = 2;
                                                    subobj['id'] = item['SelfGuid'];
                                                    subobj['pin'] = value['AnimalID'];
                                                    images[3].push(subobj);
                                                } else if (subkey === 'imgThree') {
                                                    subobj['name'] = value[subkey];
                                                    subobj['imgType'] = 1;
                                                    subobj['dataType'] = 2;
                                                    subobj['id'] = item['SelfGuid'];
                                                    subobj['pin'] = value['AnimalID'];
                                                    images[3].push(subobj);
                                                } else if (subkey === 'OtherPicss') {
                                                    let subsublist = value[subkey] == null ? [] : value[subkey].split(',');
                                                    for (let values of subsublist) {
                                                        let objsss = {};
                                                        objsss['name'] = values;
                                                        objsss['imgType'] = 2;
                                                        objsss['dataType'] = 2;
                                                        objsss['id'] = item['SelfGuid'];
                                                        objsss['pin'] = value['AnimalID'];
                                                        images[3].push(objsss);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });
                        this.comm.uploadImages(images).then(res => {
                            if (res) {
                                for (let value of onefarmlist) {
                                    this.sql.deleteTable('inframmessage', 'FramGuid', value.FramGuid).then(res => {
                                    })
                                }
                                for (let values of onepinlist) {
                                    this.sql.deleteTable('Underwriting', 'FramGuid', values.FramGuid).then(res => {
                                    })
                                }
                                for (let value of pilifarmlist) {
                                    this.sql.deleteTable('inframmessage', 'FramGuid', value.FramGuid).then(res => {
                                    })
                                }
                                for (let value of pilipinlist) {
                                    this.sql.deleteTable('PiliangUnderwriting', 'FramGuid', value.FramGuid).then(res => {
                                    })
                                }
                                this.comm.toast('上传成功');
                                this.loader.dismiss();
                                this.getLocalData();
                            } else {
                                this.comm.toast('上传失败');
                                this.loader.dismiss();
                            }
                        });
                    }
                });
            } else {
                this.comm.toast('上传失败');
                this.loader.dismiss();
            }
        });
    }

    del(item) {
        let self = this;
        event.stopPropagation();
        this.sql.deleteTable('inframmessage', 'FramGuid', item.FramGuid).then(res => {
            self.sql.deleteTable('Underwriting', 'FramGuid', item.FramGuid).then(ress => {
                self.sql.deleteTable('PiliangUnderwriting', 'FramGuid', item.FramGuid).then(ress => {
                    self.getLocalData();
                })
            })
        })
    }

    edit(item) {
        event.stopPropagation();
        this.navCtrl.push('ChangePage', {
            peopleID: item.FramGuid,
            piliang: 'one'
        });
    }

    gotoConfirmedSignaturePage(item) {
        let arr = [];
        this.sql.selecTableIDs('Underwriting', 'FramGuid', item.FramGuid).then(res => {
            this.sql.selecTableIDs('PiliangUnderwriting', 'FramGuid', item.FramGuid).then(ress => {
                arr = res.concat(ress);
                if (arr.length == 0) {
                    this.comm.toast('你所选的农户下还没有承保数据，请去录入')
                } else {
                    if (ress.length > 0) {
                        this.navCtrl.push('SuresignaPage', {
                            FramGuid: item.FramGuid,
                            type: 1,
                            piliang: 1
                        })
                    } else {
                        this.navCtrl.push('SuresignaPage', {
                            FramGuid: item.FramGuid,
                            type: 1
                        })
                    }

                }

            }).catch(err => {
                console.log(err);
            });


        }).catch(err => {
            console.log(err);
        });
    }
}
