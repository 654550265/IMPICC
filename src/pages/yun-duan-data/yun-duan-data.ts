import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { DbProvider } from "../../providers/db/db";

@IonicPage()
@Component({
    selector: 'page-yun-duan-data',
    templateUrl: 'yun-duan-data.html',
})
export class YunDuanDataPage {
    PRODUCTION: boolean;
    id: string;
    people: string;
    tabs: Array<tab>;
    activeTab: tab;
    loader: any;
    fileTransfer: FileTransferObject = this.transfer.create();
    data = this.sql.database;
    flag: number;
    type: any;
    uname: string;
    InsureNo: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public comm: CommonServiceProvider, public loadCtrl: LoadingController, public sql: SqllistServiceProvider, private transfer: FileTransfer, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public ngZone: NgZone, public db: DbProvider) {
        this.PRODUCTION = ENV.PRODUCTION;
        this.id = navParams.get('id');
        this.flag = navParams.get('flag');
        this.initData();
        this.type = this.navParams.get('type');
        this.uname = JSON.parse(localStorage.getItem('user')).AccountName;
    }

    initData() {
        this.people = JSON.parse(localStorage.getItem('user')).RealName;
        this.tabs = [
            {
                id: 0,
                name: '云端数据',
                acv: true,
                hasData: true,
                datas: [],
                chooseall: false,
                page: 1,
                num: 0,
                canLoad: true,
                types: "1,2,3,4,5"
            },
            {
                id: 1,
                name: '本地数据',
                acv: false,
                hasData: true,
                datas: [],
                chooseall: false,
                page: 1,
                num: 0,
                canLoad: true,
                types: "3"
            }
        ];
        this.activeTab = this.tabs[0];
        this.loadData(0);
    }

    async QueryFarmerList(id): Promise<any> {
        let com = JSON.parse(localStorage.getItem('user')).CompanyCode;
        var promise = new Promise(resolve => {
            if (id === 1) {
                this.db.selectDownloadFarmer(this.type).then((res) => {
                    if (res.length != 0) {
                        for (let i = 0; i < res.length; i++) {
                            this.sql.selecTableIDs('Underwriting', 'FramGuid', res[i].name.FramGuid).then(mess => {
                                res[i].name.Total = mess.length;
                                if (i == res.length - 1) {
                                    resolve(res);
                                }
                            })
                        }
                    } else {
                        resolve([]);
                    }
                });
            } else {
                this.http.get(`${ENV.WEB_URL}QueryFarmerList?county=${this.id/*JSON.parse(localStorage.getItem("user")).County*/}&page=${this.activeTab.page}&psize=5&types=${this.activeTab.types}&flag=${this.flag}&companyCode=${com}`)
                .subscribe(res => {
                    resolve(res);
                });
            }
        });
        return promise;
    }

    async loadData(id) {
        this.activeTab.canLoad = false;
        this.loader = this.loadCtrl.create({
            content: "",
            duration: 3000
        });
        this.loader.present();
        let res = await this.QueryFarmerList(id);
        this.loader.dismiss();
        this.activeTab.canLoad = true;
        if (res.Status) {
            this.activeTab.hasData = res.MyObject.length > 0 ? true : false;
            res.MyObject.map(item => {
                item.acv = false;
                this.tabs[this.activeTab.id].datas.push(item);
                return item;
            });
            if (res.MyObject.length < 5) {
                this.activeTab.canLoad = false;
            }
        } else if (res) {
            for (let value of res) {
                value['acv'] = false;
            }
            this.tabs[this.activeTab.id].datas = res;
        } else {
            this.comm.toast(res.Message);
        }
    }

    gotoXuBao(index) {
        event.stopPropagation();
        this.navCtrl.push('ChangePage', {
            peopleID: this.tabs[this.activeTab.id].datas[index]['name'].FramGuid,
            piliang: 'one',
            isxubao: true
        });
    }

    async active(item) {
        this.tabs.map(i => {
            i.acv = false;
            return i;
        });
        item.acv = true;
        this.activeTab = item;
        this.InsureNo = undefined;
        this.initActiveData();
        this.loadData(item.id);
    }

    initActiveData() {
        this.activeTab.hasData = true;
        this.activeTab.chooseall = false;
        this.activeTab.num = 0;
        this.activeTab.page = 1;
        this.activeTab.datas = [];
    }

    chooseOne(index) {
        this.activeTab.datas[index].acv = !this.activeTab.datas[index].acv;
        this.activeTab.datas[index].acv ? this.activeTab.num++ : this.activeTab.num--;
    }

    chooseAll() {
        this.activeTab.chooseall = !this.activeTab.chooseall;
        for (let i = 0; i < this.activeTab.datas.length; i++) {
            if (this.activeTab.chooseall) {
                this.activeTab.datas[i].acv = true;
            } else {
                this.activeTab.datas[i].acv = false;
            }
        }
        this.activeTab.num = this.activeTab.chooseall ? this.activeTab.datas.length : 0;
    }

    doRefresh(e) {
        this.initActiveData();
        this.loadData(this.activeTab.id);
        e.complete();
    }

    async doInfinite(e) {
        this.activeTab.page++;
        this.loadData(this.activeTab.id);
        e.complete();
    }

    async DownLoad() {
        let loadText = `数据正在后台下载，您可进行其他操作`;
        if (this.activeTab.num == 0) {
            this.comm.toast('请选择你要下载的数据');
        } else {
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: `确定下载 ${this.activeTab.num} 条数据吗？ （注：下载会覆盖掉本地数据，请确认本地数据已上传）`,
                buttons: [
                    {
                        text: '取消',
                        handler: () => {
                        }
                    },
                    {
                        text: '确定',
                        handler: async () => {
                            // let loader = this.loadingCtrl.create({
                            //     content: loadText,
                            //     duration: 300000
                            // });
                            // loader.present();
                            this.comm.toast(loadText);
                            let n = [];
                            for (let i = 0; i < this.activeTab.datas.length; i++) {
                                if (this.activeTab.datas[i].acv) {
                                    n.push(this.activeTab.datas[i].Id);
                                }
                            }
                            n.join();
                            let res = await this.CbDataHistoryDetail(n + '');
                            if (res.Status) {
                                if (window['cordova']) {
                                    for (const iterator of res.MyObject) {
                                        let isexist = await this.sql.selecByColumn("inframmessage", "FramPeopleID", iterator.FramPeopleID);
                                        if (isexist['rows'].length > 0) {
                                            await this.sql.deleteByColumn("inframmessage", "FramPeopleID", iterator.FramPeopleID);
                                            await this.sql.deleteByColumn("Underwriting", "FramPeopleId", iterator.FramPeopleID);
                                            await this.sql.deleteByColumn("PiliangUnderwriting", "FramPeopleId", iterator.FramPeopleID);
                                        }
                                    }
                                }
                                res.MyObject = res.MyObject.map((item) => {
                                    item.isPass = 1;
                                    return item;
                                });
                                this.comm.downloadImgs(res.MyObject).then(newarr => {
                                    this.comm.insertCollection(newarr).then((result) => {
                                        console.log(result);
                                        // loader.dismiss();
                                        this.comm.toast('下载成功');
                                        this.navCtrl.pop();
                                    });
                                });
                            }
                        }
                    }
                ]
            });
            confirm.present();
        }
    }

    async CbDataHistoryDetail(ids: string): Promise<any> {
        var promise = new Promise(resolve => {
            this.http.get(`${ENV.WEB_URL}GetAuditRecordDetails?ids=${ids}&auditStatus=1`)
            .subscribe(res => {
                resolve(res);
            });
        });
        return promise;
    }

    checkMessage(item: insurance) {
        if (this.activeTab.id == 0) {
            this.navCtrl.push('YesPassPage', {
                id: item.Id,
                auditStaus: 1,
            });
        } else {
            this.navCtrl.push('LookPage', {
                FramGuid: item['name']['FramGuid']
            });
        }
    }

    showDB() {
        for (const key in ENV.DATA_TABLE) {
            if (ENV.DATA_TABLE.hasOwnProperty(key)) {
                this.sql.selectTableAll(key).then((result) => {
                    console.log(key, result);
                });
            }
        }
    }

    UpLoad() {
        let oneguidlist = [];   //单个的guid列表
        let plguidlist = [];    //批量的guid列表
        let onefarmlist = [];   //单个的农户列表
        let onepinlist = [];    //单个的承保列表
        let pilifarmlist = [];  //批量的农户列表
        let pilipinlist = [];   //批量的承保列表
        for (let value of this.tabs[this.activeTab.id].datas) {
            if (value.acv) {
                if (value['name'].FramType == '4' || value['name'].FramType == '5') {
                    plguidlist.push(value['name'].FramGuid);
                } else {
                    oneguidlist.push(value['name'].FramGuid);
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
                            console.log('Disagree clicked');
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
                    }]
            });
            confirm.present();
        }
    }

    up(onefarmlist: Array<any>, onepinlist: Array<any>, pilifarmlist: Array<any>, pilipinlist: Array<any>) {
        this.http.post(`${ENV.WEB_URL}BatchUploadData`, {
            farmers: JSON.stringify(onefarmlist),
            pins: JSON.stringify(onepinlist),
            uname: this.uname
        }).subscribe(res => {
            if (res.Status) {
                this.http.post(`${ENV.WEB_URL}BulkUploadData`, {
                    farmers: JSON.stringify(pilifarmlist),
                    pins: JSON.stringify(pilipinlist),
                    uname: this.uname
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
                        this.comm.UpDataMessage(images).then(res => {
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
                                this.initData();
                            } else {
                                this.comm.toast('上传失败');
                                this.loader.dismiss();
                            }
                        })
                    }
                })
            } else {
                this.comm.toast(`${res.Data.join()}当前数据尚在保期内不能续保`);
                this.loader.dismiss();
            }
        })
    }
}


class tab {
    id: number;
    name: string;
    acv: boolean;
    hasData: boolean;
    datas: Array<insurance>;
    chooseall: boolean;
    page: number;
    num: number;
    canLoad: boolean;
    types: string;
}

class insurance {
    HandlePerson: string;
    CreateTime: string;
    CreditCode: string;
    Id: string;
    IdNumber: string;
    InsureType: number;
    Name: string;
    Pin: string;
    Remark: string;
    Tel: string;
    Village: string;
    acv: boolean;
    Total: number;
    EndTime: string;
    InsureNo: string;
}
