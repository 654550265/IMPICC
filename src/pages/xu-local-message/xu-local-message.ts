import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { ENV } from "../../config/environment";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { FileTransfer, FileUploadOptions, FileTransferObject } from "@ionic-native/file-transfer";

@IonicPage()
@Component({
    selector: 'page-xu-local-message',
    templateUrl: 'xu-local-message.html',
})
export class XuLocalMessagePage {
    list: Array<any>;
    id: any;
    All: Array<any>;
    isChooseAll: boolean;
    num: number;
    isMessage: boolean;
    RealName: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqllite: SqllistServiceProvider, public alertCtrl: AlertController, public comm: CommonServiceProvider, public loadingCtrl: LoadingController, public http: AuthServiceProvider, private transfer: FileTransfer) {
        this.init();
    }

    ionViewDidEnter() {
        this.init();
    }

    init() {
        this.id = this.navParams.get('message').FramPeopleID;
        this.isChooseAll = false;
        this.num = 0;
        this.RealName = JSON.parse(localStorage.getItem('user')).RealName;
        this.sqllite.selecTablePeopleID('DnowLoadFarmData', this.id).then(res => {
            if (res.length == 0) {
                this.isMessage = true;
                this.All = res;
            } else {
                for (let i = 0; i < res.length; i++) {
                    res[i].active = false;
                }
                this.All = res;
                this.isMessage = false;
            }
        })
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

    delsss(index) {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '你确定要删除这条数据吗?',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        this.sqllite.deletTableMessage('DnowLoadFarmData', this.All[index].name.FramPeopleID).then(res => {
                            this.sqllite.deletTableMessage('DnowLoadUnderData', this.All[index].name.FramPeopleID).then(res => {
                                this.comm.toast('删除成功');
                                this.init();
                            }).catch(e => {
                                console.log(e)
                            });
                        }).catch(e => {
                            console.log(e)
                        });
                    }
                }
            ]
        });
        confirm.present();
    }

    gotoXuLookPage(index) {
        this.navCtrl.push('XuLookPage', {
            peopleID: this.All[index].name.FramPeopleID
        });
    }

    gotoXuQianZiPage(index) {
        this.navCtrl.push('XuQianZiPage', {
            peopleID: this.All[index].name.FramPeopleID
        })
    }

    gotoXuXuChangePage(index) {
        this.navCtrl.push('XuXuChangePage', {
            peopleID: this.All[index].name.FramPeopleID
        })
    }

    fileTransfer: FileTransferObject = this.transfer.create();

    MessageUpData() {
        let boo = false;
        for (let i = 0; i < this.All.length; i++) {
            if (this.All[i].name.signUrl == '') {
                boo = true;
                break;
            } else {
                boo = false;
            }
        }
        if (this.num == 0) {
            this.comm.toast('请选择你要上传的数据');
        } else if (boo) {
            this.comm.toast('请确认所有数据都已签名');
        } else {
            let loader = this.loadingCtrl.create({
                content: "上传中...",
                duration: 10000
            });
            loader.present();
            let n: Array<any> = [];

            for (let i = 0; i < this.All.length; i++) {
                if (this.All[i].active) {
                    n.push(this.All[i].name);
                }
            }
            let z = [];
            this.sqllite.selecTablePeopleID('DnowLoadUnderData', n[0].FramPeopleID)
                .then(res => {
                    for (let i = 0; i < res.length; i++) {
                        z.push(res[i].name);
                    }
                }).catch(e => {
                console.log(e)
            });

            setTimeout(() => {
                this.http.post(`${ENV.WEB_URL}BatchUploadData`, {
                    farmers: JSON.stringify(n),
                    pins: JSON.stringify(z),
                    flag: 1
                }).subscribe(res => {
                    if (res.Status) {
                        let options: FileUploadOptions = {
                            fileKey: 'file',
                            fileName: 'name.jpg',
                            headers: {}
                        };
                        this.fileTransfer.upload(`${n[0]['idfrontUrl']}`, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${n[0]['FramPeopleID']}&imgType=1&uname=${JSON.parse(localStorage.getItem('user')).AccountName}`, options)
                            .then(res => {
                                this.fileTransfer.upload(`${n[0]['idbackUrl']}`, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${n[0]['FramPeopleID']}&imgType=2&uname=${JSON.parse(localStorage.getItem('user')).AccountName}`, options)
                                    .then(res => {
                                        this.fileTransfer.upload(`${n[0]['bankUrl']}`, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${n[0]['FramPeopleID']}&imgType=4&uname=${JSON.parse(localStorage.getItem('user')).AccountName}`, options)
                                            .then(res => {
                                                this.fileTransfer.upload(`${n[0]['autographPic']}`, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${n[0]['FramPeopleID']}&imgType=3&uname=${JSON.parse(localStorage.getItem('user')).AccountName}`, options)
                                                    .then(res => {

                                                    }).catch(err => {
                                                    console.log(err);
                                                });
                                            }).catch(err => {
                                            console.log(err);
                                        });
                                    }).catch(err => {
                                    console.log(err);
                                });
                            }).catch(err => {
                            console.log(err);
                        });



                        for (let x = 0; x < z.length; x++) {
                            this.fileTransfer.upload(`${z[x]['positonUrl']}`, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${n[0]['FramPeopleID']}&imgType=1&uname=${JSON.parse(localStorage.getItem('user')).AccountName}`, options)
                                .then(res => {
                                }).catch(err => {
                                console.log(err);
                            });
                            this.fileTransfer.upload(`${z[x]['frontUrl']}`, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${n[0]['FramPeopleID']}&imgType=2&uname=${JSON.parse(localStorage.getItem('user')).AccountName}`, options)
                                .then(res => {
                                }).catch(err => {
                                console.log(err);
                            });
                            this.fileTransfer.upload(`${z[x]['leftUrl']}`, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${n[0]['FramPeopleID']}&imgType=3&uname=${JSON.parse(localStorage.getItem('user')).AccountName}`, options)
                                .then(res => {
                                }).catch(err => {
                                console.log(err);
                            });
                            this.fileTransfer.upload(`${z[x]['rightUrl']}`, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${n[0]['FramPeopleID']}&imgType=4&uname=${JSON.parse(localStorage.getItem('user')).AccountName}`, options)
                                .then(res => {
                                }).catch(err => {
                                console.log(err);
                            });
                            this.fileTransfer.upload(`${z[x]['otherUrl']}`, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${n[0]['FramPeopleID']}&imgType=5&uname=${JSON.parse(localStorage.getItem('user')).AccountName}`, options)
                                .then(res => {
                                }).catch(err => {
                                console.log(err);
                            });
                            let lens = [];
                            if (z[x].otherUrl == '') {
                                lens = [];
                            } else {
                                lens = (z[x].otherUrl).split(',');
                            }
                            for (let i = 0; i < lens.length; i++) {
                                this.fileTransfer.upload(`${lens[i]}`, `${ENV.WEB_URL}UploadCbPinImg?pin=${z[x]['AnimalId']}&imgType=5&uname=${JSON.parse(localStorage.getItem('user')).AccountName}`, options)
                                    .then(res => {
                                    }).catch(err => {
                                    console.log(err);
                                });
                            }
                        }
                    }
                });
            }, 2000);
        }
    }
}
