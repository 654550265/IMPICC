import { Component, NgZone, ViewChild } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, Slides } from 'ionic-angular';
import { ENV } from "../../config/environment";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";


@IonicPage()
@Component({
    selector: 'page-previous-data',
    templateUrl: 'previous-data.html',
})
export class PreviousDataPage {
    @ViewChild(Slides) slides: Slides;
    PRODUCTION: boolean;
    id: string;
    people: string;
    tabs: Array<tab>;
    activeTab: tab;
    loader: any;
    fileTransfer: FileTransferObject = this.transfer.create();
    data = this.sql.database;
    flag: number;
    chenBao: string;
    showBol: boolean;
    InsureNo: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public comm: CommonServiceProvider, public loadCtrl: LoadingController, public sql: SqllistServiceProvider, private transfer: FileTransfer, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public ngZone: NgZone) {
        this.PRODUCTION = ENV.PRODUCTION;
        this.id = navParams.get('id');
        this.flag = navParams.get('flag');
        this.chenBao = JSON.parse(localStorage.getItem('user')).RealName;
        this.showBol = true;
        this.initData();
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
                types: "1,2,4,5"
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
        this.loadData();
    }

    async QueryFarmerList(): Promise<any> {
        let com = JSON.parse(localStorage.getItem('user')).CompanyCode;
        var promise = new Promise(resolve => {
            this.http.get(`${ENV.WEB_URL}QueryFarmerList?county=${this.id}&page=${this.activeTab.page}&psize=5&types=${this.activeTab.types}&flag=${this.flag}&companyCode=${com}`)
            .subscribe(res => {
                resolve(res);
            });
        });
        return promise;
    }

    async loadData() {
        this.activeTab.canLoad = false;
        this.loader = this.loadCtrl.create({
            content: "",
            duration: 3000
        });
        this.loader.present();
        let res = await this.QueryFarmerList();
        this.loader.dismiss();
        this.activeTab.canLoad = true;
        this.showBol = true;
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
        } else {
            this.comm.toast(res.Message);
        }
    }

    async loadLocal() {
        this.sql.selectTableAll('inframmessage').then(res => {
            let arr = [];
            for (let i = 0; i < res.length; i++) {
                if (res[i].name.insuranceId != '' && res[i].name.insuranceId != null) {
                    arr.push(res[i].name)
                }
            }
            this.showBol = false;
            this.activeTab.canLoad = false;
            this.activeTab.hasData = arr.length > 0 ? true : false;
            this.activeTab.datas = arr;
        })
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
        if (item.id == 0) {
            this.loadData();
        } else {
            this.loadLocal();
        }

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
        if (this.showBol) {
            this.initActiveData();
            this.loadData();
            e.complete();
        } else {
            e.complete();
        }
    }

    async doInfinite(e) {
        if (this.showBol) {
            this.activeTab.page++;
            this.loadData();
            e.complete();
        } else {
            e.complete();
        }
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
        this.navCtrl.push('YesPassPage', {
            id: item.Id,
            auditStaus: 1,
        });
    }

    checkMessages(item: insurance) {
        if (item['FramType'] == '3') {
            this.navCtrl.push('LookTeamMessPage', {
                FramGuid: item['FramGuid']
            });
        } else {
            this.navCtrl.push('LookPage', {
                FramGuid: item['FramGuid']
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

    del(ele) {
        this.sql.deleteTable('inframmessage', 'FramGuid', ele).then(res => {
            this.sql.deleteTable('Underwriting', 'FramGuid', ele).then(ress => {
                this.sql.deleteTable('PiliangUnderwriting', 'FramGuid', ele).then(resss => {
                    this.loadLocal();
                })
            })
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
