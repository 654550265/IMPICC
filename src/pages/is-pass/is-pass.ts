import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Slides, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";

@IonicPage()
@Component({
    selector: 'page-is-pass',
    templateUrl: 'is-pass.html',
})
export class IsPassPage {
    @ViewChild(Slides) slides: Slides;
    list: Array<{ id: number, name: string, acv: boolean, auditStaus: number }>;
    page: number;
    ChenName: string;
    NoPassList: Array<any>;
    WaiteExamine: Array<any>;
    Examine: Array<any>;
    infiniteScroll: any;
    ishaveMessages: boolean;
    ishaveMessagess: boolean;
    ishaveMessagesss: boolean;
    ishaveMessagessss: boolean;
    noPassArr: Array<any>;
    Stat: number;
    num: number;
    num1: number;
    isChooseAll: boolean;
    isChooseAlls: boolean;
    localData: Array<any>;
    uname: string;
    canChange: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public comm: CommonServiceProvider, public sql: SqllistServiceProvider, private transfer: FileTransfer) {
        let loader = this.loadingCtrl.create({
            content: "",
            duration: 3000
        });
        loader.present();
        this.uname = JSON.parse(localStorage.getItem('user')).AccountName;
        this.list = [
            {id: 0, name: '审核通过', acv: true, auditStaus: 1},
            {id: 1, name: '审核未通过', acv: false, auditStaus: 2},
            {id: 2, name: '本地审核未通过', acv: false, auditStaus: 3},
        ];
        this.Stat = 0;
        this.page = 1;
        this.num = 0;
        this.num1 = 0;
        this.ChenName = JSON.parse(localStorage.getItem('user')).RealName;
        this.isChooseAlls = false;

        //审核通过
        http.get(`${ENV.WEB_URLs}LpAuditRecordList?uname=${JSON.parse(localStorage.getItem('user')).AccountName}&auditStaus=1&page=1&psize=5`)
            .subscribe(res => {
                if (res.Status) {
                    if (res.MyObject.length == 0) {
                        this.ishaveMessagess = true;
                        this.Examine = res.MyObject;
                    } else {
                        this.ishaveMessagess = false;
                        this.Examine = res.MyObject;
                    }

                }
            });
        //审核未通过
        http.get(`${ENV.WEB_URLs}LpAuditRecordList?uname=${JSON.parse(localStorage.getItem('user')).AccountName}&auditStaus=2&page=1&psize=5`)
            .subscribe(res => {
                if (res.Status) {
                    if (res.MyObject.length == 0) {
                        this.ishaveMessagesss = true;
                        this.noPassArr = res.MyObject;
                    } else {
                        this.ishaveMessagesss = false;

                        for(let i = 0;i<res.MyObject.length;i++){
                            res.MyObject[i].acv = false;
                        }
                        this.noPassArr = res.MyObject;
                    }

                    loader.dismiss();
                }
            });
            this.init();
    }
    ionViewDidEnter() {
        this.init();
        this.slides.lockSwipes(true);
    }


    init() {
        this.sql.selecTableIDs('InsuredFarmer','Isloc','2')
        .then(res => {
            let arr = [];
            if (res.length == 0) {
                this.ishaveMessagessss = true;
                this.localData = res;
            } else {
                for (let i = 0; i < res.length; i++) {
                    res[i].active = false;
                    res[i].acv = false;
                    if(res[i].name.canvasImg&&res[i].name.canvasImg.split('&')[1]==4){
                        arr.push(true)
                    }else{
                        arr.push(false)
                    }
                }
                this.canChange = arr;
                this.localData = res;
                this.ishaveMessagessss = false;
            }
        }).catch(e => {
        console.log(e);
    });
    }

    slide(index) {
        this.page = 1;
        this.slides.lockSwipes(false);
        this.list.map((item) => {
            item['acv'] = false;
            return item;
        });
        this.Stat = index.id;
        console.log(index,this.Stat)
        index.acv = true;
        this.slides.slideTo(index.id);
        this.slides.lockSwipes(true);
        if(index.id == 2){//localData
            this.sql.selecTableIDs('InsuredFarmer','Isloc','2')
                .then(res => {
                    let arr = [];
                    if (res.length == 0) {
                        this.ishaveMessagess = true;
                        this.localData = res;
                    } else {
                        for (let i = 0; i < res.length; i++) {
                            res[i].active = false;
                            res[i].acv = false;
                            arr.push(false)
                        }
                        this.localData = res;
                        this.ishaveMessagess = false;
                        this.canChange = arr;
                    }
                }).catch(e => {
                console.log(e);
            });
        }
    }

    doRefresh(refresher) {
        this.page = 1;
        let auditStaus;
        this.list.map((item) => {
            if (item['acv']) {
                auditStaus = item['auditStaus'];
                this.http.get(`${ENV.WEB_URLs}LpAuditRecordList?uname=${JSON.parse(localStorage.getItem('user')).AccountName}&auditStaus=${auditStaus}&page=1&psize=5`)
                    .subscribe(res => {
                        if (res.Status) {
                            switch (auditStaus) {
                                // case 2:
                                //     this.NoPassList = res.MyObject;
                                //     break;
                                case 3:
                                    this.WaiteExamine = res.MyObject;
                                    break;
                                case 1:
                                    this.Examine = res.MyObject;
                                    break;
                                case 2:
                                    this.noPassArr = res.MyObject;
                                    break;
                            }
                            refresher.complete();
                            if (this.infiniteScroll) {
                                this.infiniteScroll.enable(true);
                            }
                        }
                    });
            }
        });
    }

    doInfinite(infiniteScroll) {
        this.infiniteScroll = infiniteScroll;
        setTimeout(() => {
            let auditStaus;
            this.page++;
            this.list.map((item) => {
                if (item['acv']) {
                    auditStaus = item['auditStaus'];
                    this.http.get(`${ENV.WEB_URLs}LpAuditRecordList?uname=${JSON.parse(localStorage.getItem('user')).AccountName}&auditStaus=${auditStaus}&page=${this.page}&psize=5`)
                        .subscribe(res => {
                            if (res.Status) {
                                if (auditStaus == 2) {
                                    for (let i = 0; i < res.MyObject.length; i++) {
                                        this.noPassArr.push(res.MyObject[i]);
                                    }
                                }
                                if (auditStaus == 3) {
                                    for (let i = 0; i < res.MyObject.length; i++) {
                                        this.WaiteExamine.push(res.MyObject[i]);
                                    }
                                }
                                if (auditStaus == 1) {
                                    for (let i = 0; i < res.MyObject.length; i++) {
                                        this.Examine.push(res.MyObject[i]);
                                    }
                                }
                                infiniteScroll.complete();
                                if (res.MyObject.length < 5) {
                                    infiniteScroll.enable(false);
                                }
                            }
                        });
                }
            });
        }, 1000);
    }

    gotoYesPass(index) {
        console.log(this.Examine[index])
        this.navCtrl.push('IsPassMorePage', {
            id: this.Examine[index].Id,
            auditStaus: 1
        });
    }

    gotoNoPass(index) {
        console.log(this.noPassArr[index])
        this.navCtrl.push('IsPassMorePage', {
            id: this.noPassArr[index].Id,
            auditStaus: 2
        });
    }
    gotoYes(index) {
        console.log(this.localData[index])
        this.navCtrl.push('LocalCheckPage', {
            id: this.localData[index].name.FramGuid,
            auditStaus: 0
        });
    }

    gotoY(index) {
        this.navCtrl.push('IsPassChangePage', {
            id: this.noPassArr[index].Id,
            auditStaus: 2
        });
    }

    choosePart(ele){
        this.noPassArr[ele].acv = !this.noPassArr[ele].acv;
        this.checknum(0)
    }
    chooseParts(ele){
        this.localData[ele].acv = !this.localData[ele].acv;
        this.checknum(1)
    }

    checknum(ele) {

        if(ele == 0){
            let num = 0;
            for (let i = 0; i < this.noPassArr.length; i++) {
                if (this.noPassArr[i].acv) {
                    num += 1;
                }
            }
            this.num = num;
        }else{
            let num = 0;
            for (let i = 0; i < this.localData.length; i++) {
                if (this.localData[i].acv) {
                    num += 1;
                }
            }
            this.num1 = num;
        }

    }

    chooseall(ele) {
        if(ele == 1){
            this.isChooseAll = !this.isChooseAll;
            for (let i = 0; i < this.noPassArr.length; i++) {
                this.noPassArr[i].acv = this.isChooseAll;
            }
            this.checknum(0)
        }else{
            this.isChooseAlls = !this.isChooseAlls;
            for (let i = 0; i < this.localData.length; i++) {
                this.localData[i].acv = this.isChooseAlls;
            }
            this.checknum(1)
        }

    }

    async CbDataHistoryDetail(ids: string): Promise<any> {
        let promise = new Promise(resolve => {
            this.http.get(`${ENV.WEB_URLs}GetLpRecordDetails?ids=${ids}&auditStatus=2`)
            .subscribe(res => {
                resolve(res);
            });
        });
        return promise;
    }

    gotoConfirmedSignaturePage(index){
        this.navCtrl.push('Suresigna2Page', {
            FramGuid: this.localData[index].name.FramGuid
        });
    }

    gotoChangePage(index) {
        this.navCtrl.push('LocalChangePage', {
            id: this.localData[index].name.FramGuid
        })
    }

    del(index) {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '你是否删除这条数据',
            buttons: [
                {
                    text: '否',
                    handler: () => {
                    }
                },
                {
                    text: '是',
                    handler: () => {
                        this.sql.deleteTable('InsuredFarmer', 'FramGuid', `${this.localData[index].name.FramGuid}`)
                            .then(res => {
                                this.sql.deleteTable('DeclareClaimTable', 'FramGuid', `${this.localData[index].name.FramGuid}`).then(ress=>{
                                    this.comm.toast('删除成功');
                                    this.init();
                                })

                            }).catch(e => {
                            console.log(e)
                        });
                    }
                }
            ]
        });
        confirm.present();
    }

    async DownLoad() {
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
                            let n = [];
                            for (let i = 0; i < this.noPassArr.length; i++) {
                                if (this.noPassArr[i].acv) {
                                    n.push(this.noPassArr[i].Id)
                                }
                            }
                            n.join();
                            let res = await this.CbDataHistoryDetail(n+'');
                            if (res.Status) {
                                if(window['cordova']){
                                    for (const iterator of res.MyObject) {
                                        let isexist = await this.sql.selecByColumn("InsuredFarmer", "idCard", iterator.farmer.idCard);
                                        if(isexist['rows'].length > 0){
                                            await this.sql.deleteByColumn("InsuredFarmer", "idCard", iterator.farmer.idCard);
                                            await this.sql.deleteByColumn("DeclareClaimTable", "idCard", iterator.farmer.idCard);
                                        }
                                    }
                                }
                                res.MyObject = res.MyObject.map((item) => {
                                    item.isPass = 2;
                                    return item;
                                });
                                this.comm.DownloadClaimsImgs(res.MyObject).then(newarr => {
                                    this.comm.insertClaims(newarr).then((result) => {
                                        loader.dismiss();
                                        this.comm.toast('下载成功');
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
    fileTransfer: FileTransferObject = this.transfer.create();
    Downpop(){
        let self = this;
        let arr = this.localData;
        let farmers = [];
        let pins = [];
        let fguid = [];
        for (let p = 0; p < arr.length; p++) {
            if (arr[p].acv) {
                if(arr[p].name.canvasImg=='' || arr[p].name.canvasImg.split('&')[1]!=4){
                    this.comm.toast('查勘员请签字');
                    return false;
                }else{
                    farmers.push(arr[p].name);
                    let guid = arr[p].name.FramGuid;
                    fguid.push(guid);
                    self.sql.selecTableIDAll('DeclareClaimTable','FramGuid',guid,'Isloc','2').then(res=>{
                        for(let s = 0;s<res.length;s++){
                            pins.push(res[s].name);
                        }
                    })
                }

            }
        }
        let option: FileUploadOptions = {
            fileKey: 'file',
            fileName: 'name.jpg',
        };
        if(this.num1 == 0){
            this.comm.toast('请选中您需要上传的数据');
        }else{
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
                            let loading = this.loadingCtrl.create({
                                content: '上传中...'
                            });
                            loading.present();
                            this.http.post(`${ENV.WEB_URLs}UpdateLpPinData`, {
                                farmers: JSON.stringify(farmers),pins:JSON.stringify(pins),uname: self.uname
                            }).subscribe(res => {
                                if (res.Status) {
                                    let arr = [
                                        {name: 'canvasImg', type: 3, id: 'FramGuid'},
                                        {name: 'detailImg', type: 3, id: 'FramGuid'},
                                        {name: 'FramIDFont', type: 1, id: 'FramGuid'},//正
                                        {name: 'FramIDBack', type: 2, id: 'FramGuid'},//反
                                        {name: 'BankCardImg', type: 4, id: 'FramGuid'},//银行
                                        {name: 'VaccinationCertificateImg', type: 5, id: 'FramGuid'},//防疫
                                        {name: 'InstitutionCodeImg', type: 6, id: 'FramGuid'},//机构
                                        {name: 'vaccinationCertificateImgs', type: 7, id: 'FramGuid'}//兽医
                                    ];
                                    let arr2 = [
                                        {name: 'Scene', type: 6, id: 'lhGuid'},//现场勘查
                                        {name: 'Harmless', type: 7, id: 'lhGuid'},//无害化处理
                                        {name: 'ForDie', type: 8, id: 'lhGuid'},//死亡证明
                                        {name: 'Other', type: 5, id: 'lhGuid'}//其他
                                    ];
                                    for(let s = 0;s<farmers.length;s++){
                                        let guid = farmers[s].FramGuid;
                                        for(let x = 0;x<arr.length;x++){
                                            let name = arr[x]['name'];
                                            let imgType = arr[x]['type'];
                                            if(name == 'canvasImg'){
                                                farmers[s][name] = farmers[s][name].split('&')[0]
                                            }else if(name == 'detailImg'){
                                                if(farmers[s][name]==null){
                                                    farmers[s][name] = '';
                                                }else{
                                                    farmers[s][name] = farmers[s][name].split('&')[0]
                                                }
                                            }
                                            let qarr = farmers[s][name].split(',');
                                            for(let k = 0;k<qarr.length;k++){
                                                self.fileTransfer.upload(qarr[k], `${ENV.WEB_URLs}UpdateLpImg?guid=${guid}&imgType=${imgType}&dataType=1&uname=${self.uname}`, option).then(res => {
                                                    if(s == farmers.length-1 && x == arr.length-1&&k == qarr.length-1){
                                                        for(let u = 0;u<pins.length;u++){
                                                            let lhGuid = pins[u].lhGuid;
                                                            for(let q = 0;q<arr2.length;q++){
                                                                let names = arr2[q]['name'];
                                                                let imgtypes = arr2[q].type;
                                                                let sarr = pins[u][names].split(',');
                                                                for(let z = 0;z<sarr.length;z++){
                                                                    if(sarr[z] == ''){
                                                                        if(u == pins.length-1&&q == arr2.length-1&&z == sarr.length-1){
                                                                            for(let p = 0;p<fguid.length;p++){
                                                                                self.sql.deleteTable('InsuredFarmer','FramGuid',fguid[p]).then(res=>{
                                                                                    self.sql.deleteTable('DeclareClaimTable','FramGuid',fguid[p]).then(ress=>{
                                                                                        if(p == fguid.length-1){
                                                                                            self.init();
                                                                                            loading.dismiss();
                                                                                            self.comm.toast('上传成功');
                                                                                        }

                                                                                    })
                                                                                })
                                                                            }

                                                                        }
                                                                    }else{
                                                                        self.fileTransfer.upload(sarr[z], `${ENV.WEB_URLs}UpdateLpImg?guid=${lhGuid}&imgType=${imgtypes}&dataType=2&uname=${self.uname}`, option).then(ress => {
                                                                            if(u == pins.length-1&&q == arr2.length-1&&z == sarr.length-1){
                                                                                for(let p = 0;p<fguid.length;p++){
                                                                                    self.sql.deleteTable('InsuredFarmer','FramGuid',fguid[p]).then(res=>{
                                                                                        self.sql.deleteTable('DeclareClaimTable','FramGuid',fguid[p]).then(ress=>{
                                                                                            if(p == fguid.length-1){
                                                                                                self.init();
                                                                                                loading.dismiss();
                                                                                                self.comm.toast('上传成功');
                                                                                            }

                                                                                        })
                                                                                    })
                                                                                }

                                                                            }
                                                                            if (!JSON.parse(ress.response).Status) {
                                                                                self.comm.toast('上传失败');
                                                                                return
                                                                            }else{


                                                                            }
                                                                        })
                                                                    }

                                                                }
                                                            }
                                                        }
                                                        setTimeout(function () {
                                                            loading.dismiss();
                                                        },1000)

                                                    }
                                                    if (!JSON.parse(res.response).Status) {
                                                        this.comm.toast('上传失败');
                                                        return
                                                    }
                                                }).catch(err => {
                                                    console.log(err, 1);
                                                })
                                            }

                                        }

                                    }
                                } else {
                                    loading.dismiss();
                                    if (res.Status == false) {
                                        this.comm.toast('上传失败，请检查信息是否完整录入');
                                    }


                                    if (res.data) {
                                        this.comm.toast(`${res.data.join()}这几条数据，尚未承保过，请去承保`);
                                    }

                                    if (res.MyObject) {
                                        this.comm.toast(`${res.MyObject.join()}这几条数据，尚未承保过，请去承保`);
                                    }
                                }
                            });
                        }
                    }]
            });
            confirm.present();
        }


    }
}
