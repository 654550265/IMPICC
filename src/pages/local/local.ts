import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";

@IonicPage()
@Component({
    selector: 'page-local',
    templateUrl: 'local.html',
})
export class LocalPage {
    All: Array<any>;
    lipei:Array<any>;
    isMessage: boolean;
    num: number;
    isChooseAll: boolean;
    RealName: string;
    uname: string;
    canChange: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sql: SqllistServiceProvider, public alertCtrl: AlertController, public comm: CommonServiceProvider, public http: AuthServiceProvider, private transfer: FileTransfer, public loadingCtrl: LoadingController) {
        this.init();
        this.uname = JSON.parse(localStorage.getItem('user')).AccountName;
    }

    init() {
        let self = this;
        this.RealName = JSON.parse(localStorage.getItem('user')).RealName;
        this.num = 0;
        this.isMessage = false;
        this.isChooseAll = false;
        let arr = [];
        this.sql.selecTableIDs('InsuredFarmer','Isloc','1')
            .then(res => {
                if (res.length == 0) {
                    self.isMessage = true;
                    self.All = res;
                } else {
                    for (let i = 0; i < res.length; i++) {
                        res[i].active = false;
                        if(res[i].name.canvasImg&&res[i].name.canvasImg.split('&')[1] == 4){
                            arr.push(true)
                        }else{
                            arr.push(false)
                        }
                    }
                    self.canChange = arr;
                    self.All = res;
                    self.isMessage = false;
                }
            }).catch(e => {
            console.log(e);
        });
        this.sql.selecTableIDs('DeclareClaimTable','Isloc','1').then(res=>{
            self.lipei = res;
        })
    }

    ionViewDidEnter() {
        this.init();
    }

    ChooseOneMessage(index) {
        if (this.All[index].active) {
            this.All[index].active = false;
        } else {
            this.All[index].active = true;
        }
        let n = 0;
        for (let i = 0; i < this.All.length; i++) {
            if (this.All[i].active) {
                n += 1;
            }
        }
        this.num = n;
    }

    chooseAll() {
        if (this.isChooseAll) {
            this.num = 0;
            this.isChooseAll = false;
            for (let i = 0; i < this.All.length; i++) {
                this.All[i].active = false;
            }
        } else {
            this.num = this.All.length;
            this.isChooseAll = true;
            for (let i = 0; i < this.All.length; i++) {
                this.All[i].active = true;
            }
        }
    }

    gotoLookPage(index) {
        this.navCtrl.push('LocalCheckPage', {
            id: this.All[index].name.FramGuid
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
                        this.sql.deleteTable('InsuredFarmer', 'FramGuid', `${this.All[index].name.FramGuid}`)
                            .then(res => {
                                this.sql.deleteTable('DeclareClaimTable','FramGuid',`${this.All[index].name.FramGuid}`)
                                    .then(ress=>{
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

    gotoChangePage(index) {
        this.navCtrl.push('LocalChangePage', {
            id: this.All[index].name.FramGuid
        })
    }

    fileTransfer: FileTransferObject = this.transfer.create();

    MessageUpData() {
        let farmers = [];
        let pins = [];
        let self = this;
        let fguid = [];
        for (let p = 0; p < this.All.length; p++) {
            if (this.All[p].active) {
                if(this.All[p].name.canvasImg==null || this.All[p].name.canvasImg.split('&')[1]!=4){
                    this.comm.toast('查勘员请签字');
                    return false;
                }else{
                    farmers.push(this.All[p].name);
                    let guid = this.All[p].name.FramGuid;
                    fguid.push(guid);
                    self.sql.selecTableIDs('DeclareClaimTable','FramGuid',guid).then(res=>{
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
        if (this.num == 0) {
            this.comm.toast('请选中您需要上传的数据');
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
                            let loading = this.loadingCtrl.create({
                                content: '上传中...'
                            });
                            loading.present();
                            this.http.post(`${ENV.WEB_URLs}LpPinData`, {
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
                                                self.fileTransfer.upload(qarr[k], `${ENV.WEB_URLs}UploadLpImg?guid=${guid}&imgType=${imgType}&dataType=1&uname=${self.uname}`, option).then(res => {
                                                    if (!(s == farmers.length - 1 && x == arr.length - 1 && k == qarr.length - 1)) {
                                                    } else {
                                                        for (let u = 0; u < pins.length; u++) {
                                                            let lhGuid = pins[u].lhGuid;
                                                            for (let q = 0; q < arr2.length; q++) {
                                                                let names = arr2[q]['name'];
                                                                let imgtypes = arr2[q].type;
                                                                let sarr = pins[u][names].split(',');
                                                                for (let z = 0; z < sarr.length; z++) {
                                                                    self.fileTransfer.upload(sarr[z], `${ENV.WEB_URLs}UploadLpImg?guid=${lhGuid}&imgType=${imgtypes}&dataType=2&uname=${self.uname}`, option).then(ress => {
                                                                        if (u == pins.length - 1 && q == arr2.length - 1 && z == sarr.length - 1) {
                                                                            for (let p = 0; p < fguid.length; p++) {
                                                                                self.sql.deleteTable('InsuredFarmer', 'FramGuid', fguid[p]).then(res => {
                                                                                    self.sql.deleteTable('DeclareClaimTable', 'FramGuid', fguid[p]).then(ress => {
                                                                                        self.comm.toast('上传成功');
                                                                                        loading.dismiss();
                                                                                        self.navCtrl.pop();
                                                                                    })
                                                                                })

                                                                            }
                                                                        }
                                                                        if (!JSON.parse(ress.response).Status) {
                                                                            self.comm.toast('上传失败');
                                                                            return
                                                                        }
                                                                    }).catch(errs => {
                                                                        if (u == pins.length - 1 && q == arr2.length - 1 && z == sarr.length - 1) {
                                                                            for (let p = 0; p < fguid.length; p++) {
                                                                                self.sql.deleteTable('InsuredFarmer', 'FramGuid', fguid[p]).then(res => {
                                                                                    self.sql.deleteTable('DeclareClaimTable', 'FramGuid', fguid[p]).then(ress => {
                                                                                        self.comm.toast('上传成功');
                                                                                        loading.dismiss();
                                                                                        self.navCtrl.pop();
                                                                                    })
                                                                                })

                                                                            }
                                                                        }
                                                                    })
                                                                    // this.comm.sleep(500);
                                                                }

                                                            }
                                                        }
                                                        // loading.dismiss();
                                                    }
                                                    if (!JSON.parse(res.response).Status) {
                                                        this.comm.toast('上传失败');
                                                        return
                                                    }
                                                }).catch(err => {
                                                    console.log(err, 1);
                                                })
                                                // this.comm.sleep(500);
                                            }
                                        }

                                    }
                                } else {
                                    loading.dismiss();
                                    if (res.Status == false) {
                                        if(res.Data.length != 0){
                                            this.comm.toast(res.Data[0]+'等标签号已申请理赔，请检查后上传！');
                                        }else {
                                            this.comm.toast('上传失败，请检查信息是否完整录入');
                                        }
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
    gotoConfirmedSignaturePage(index){
        let self = this;
        this.sql.selecTableIDs('DeclareClaimTable','FramGuid',`${this.All[index].name.FramGuid}`)
            .then(ress=>{
                if(ress.length == 0){
                    self.comm.toast('请采集标的数据')
                }else{
                    self.navCtrl.push('Suresigna2Page', {
                        FramGuid: self.All[index].name.FramGuid
                    });
                }
            })

    }
}
