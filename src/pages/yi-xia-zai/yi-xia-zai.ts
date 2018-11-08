import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Slides } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { DbProvider } from './../../providers/db/db';

@IonicPage()
@Component({
    selector: 'page-yi-xia-zai',
    templateUrl: 'yi-xia-zai.html',
})
export class YiXiaZaiPage {
    @ViewChild(Slides) slides: Slides;
    people: string;
    Location: string;
    HaveText: boolean;
    list: Array<any>;
    chooseallbtn: boolean;
    num: number;
    uname: string;
    isxubao: boolean;
    lists: Array<any>;
    type: number;
    loader: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loadCtrl: LoadingController, public sqlite: SqllistServiceProvider, public alertCtrl: AlertController, public comm: CommonServiceProvider, public http: AuthServiceProvider, private transfer: FileTransfer, public loadingCtrl: LoadingController, public db: DbProvider) {
        let loader = this.loadCtrl.create({
            content: "",
            duration: 3000
        });
        this.type = this.navParams.get('type');
        console.log(this.type);
        this.isxubao = false;
        loader.present();
        this.init();
        this.uname = JSON.parse(localStorage.getItem('user')).AccountName;
        this.people = JSON.parse(localStorage.getItem('user')).RealName;
        loader.dismiss();
    }

    ionViewDidEnter() {
        this.init();
    }

    init() {
        this.lists = [
            {id: 0, name: '个体承保', acv: true, auditStaus: 0, data: []},
            {id: 1, name: '团体承保', acv: false, auditStaus: 0, data: []}
        ];
        this.chooseallbtn = false;
        this.list = [];
        this.num = 0;
        this.HaveText = false;
        this.Location = this.navParams.get('id');

        this.db.selectDownloadFarmer(this.type).then((res) => {
            if (res.length == 0) {
                this.HaveText = true;
                this.list = res;
            } else {
                this.HaveText = false;
                this.list = res;
                for (const iterator of res) {
                    iterator.acv = false;
                    if (iterator.name.FramType == "3") {
                        this.lists[1].data.push(iterator);
                    } else {
                        this.lists[0].data.push(iterator);
                    }
                }
            }
            this.list = this.lists[0].data;
        });
    }

    select(index) {
        this.list = this.lists[index].data;
        if (this.list.length == 0) {
            this.HaveText = true;
        } else {
            this.HaveText = false;
            for (let s = 0; s < this.list.length; s++) {
                this.list[s].acv = false;
            }
        }
    }

    slidesss(index) {
        this.lists.map((item) => {
            item.acv = false;
            return item;
        });
        this.lists[index].acv = true;
        if (index == 0) {
            this.select(index);
        }
        if (index == 1) {
            this.select(index);
        }
    }

    chooseOne(index) {
        let z = 0;
        if (this.list[index].acv) {
            this.list[index].acv = false;
        } else {
            this.list[index].acv = true;
        }
        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].acv) {
                z++;
            }
        }
        this.num = z;
    }

    chooseall() {
        let s = 0;
        if (this.chooseallbtn) {
            this.chooseallbtn = false;
            for (let i = 0; i < this.list.length; i++) {
                this.list[i].acv = false;
            }
            s = 0;
        } else {
            this.chooseallbtn = true;
            for (let i = 0; i < this.list.length; i++) {
                this.list[i].acv = true;
                s++;
            }
        }
        this.num = s;
    }

    backc = (_params, index) => {
        return new Promise((resolve, reject) => {
            this.list[index].isXubao = _params;
            resolve();
        });
    }

    gotoXuBao(index) {
        // this.navCtrl.push('XuPage', {
        //     message: this.list[index].name.FramGuid,
        //     callback: this.backc,
        //     indexS: index
        // });
        event.stopPropagation();
        this.navCtrl.push('ChangePage', {
            peopleID: this.list[index].name.FramGuid,
            piliang: 'one',
            isxubao: true
        });
    }

    checkMessagess(index) {
        this.navCtrl.push('LookPage', {
            FramGuid: this.list[index].name.FramGuid
        })
    }

    qianzi(index) {
        this.navCtrl.push('XuQianZiPage', {
            peopleID: this.list[index].name.FramGuid
        })
    }

    delete(index) {
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
                        let loader = this.loadCtrl.create({
                            content: "",
                            duration: 3000
                        });
                        loader.present();
                        // this.sqlite.deletTableMessage('inframmessage', this.list[index].name.FramGuid).then(res => {
                        //     this.sqlite.deletTableMessage('Underwriting', this.list[index].name.FramGuid).then(res => {
                        //         this.sqlite.deletTableMessage('PiliangUnderwriting', this.list[index].name.FramGuid).then(res => {
                        //             loader.dismiss();
                        //             this.list.splice(index, 1);
                        //             this.comm.toast('删除成功');
                        //             this.init();
                        //         }).catch(err=>{
                        //             console.log(err);
                        //         });
                        //     }).catch(e => {
                        //         console.log(e)
                        //     });
                        // }).catch(e => {
                        //     console.log(e)
                        // });
                    }
                }
            ]
        });
        confirm.present();
    }

    deleteTable(name: string, arr: Array<any>) {
        for (let index = 0; index < arr.length; index++) {
            this.sqlite.deleteTable(name, 'FramGuid', `${arr[index]}`).then(res => {
            }).catch(eeee => {
                console.log(eeee)
            });
        }
    }

    fileTransfer: FileTransferObject = this.transfer.create();

    uploads() {
        let oneguidlist = [];   //单个的guid列表
        let plguidlist = [];    //批量的guid列表
        let onefarmlist = [];   //单个的农户列表
        let onepinlist = [];    //单个的承保列表
        let pilifarmlist = [];  //批量的农户列表
        let pilipinlist = [];   //批量的承保列表
        for (let value of this.list) {
            if (value.acv) {
                if (value.name.FramType == '4' || value.name.FramType == '5') {
                    plguidlist.push(value.name.FramGuid);
                } else {
                    oneguidlist.push(value.name.FramGuid);
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
                                this.sqlite.selecTableIDs('inframmessage', 'FramGuid', oneguidlist[i]).then(res => {
                                    onefarmlist.push(res[0].name);
                                    this.sqlite.selecTableIDs('Underwriting', 'FramGuid', oneguidlist[i]).then(mess => {
                                        for (let j = 0; j < mess.length; j++) {
                                            onepinlist.push(mess[j].name);
                                        }
                                    })
                                }).catch(err => {
                                    console.log(err)
                                });
                            }
                            for (let i = 0; i < plguidlist.length; i++) {
                                this.sqlite.selecTableIDs('inframmessage', 'FramGuid', plguidlist[i]).then(res => {
                                    pilifarmlist.push(res[0].name);
                                    this.sqlite.selecTableIDs('PiliangUnderwriting', 'FramGuid', plguidlist[i]).then(mess => {
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
                                    this.sqlite.deleteTable('inframmessage', 'FramGuid', value.FramGuid).then(res => {
                                    })
                                }
                                for (let values of onepinlist) {
                                    this.sqlite.deleteTable('Underwriting', 'FramGuid', values.FramGuid).then(res => {
                                    })
                                }
                                for (let value of pilifarmlist) {
                                    this.sqlite.deleteTable('inframmessage', 'FramGuid', value.FramGuid).then(res => {
                                    })
                                }
                                for (let value of pilipinlist) {
                                    this.sqlite.deleteTable('PiliangUnderwriting', 'FramGuid', value.FramGuid).then(res => {
                                    })
                                }
                                this.comm.toast('上传成功');
                                this.loader.dismiss();
                                this.init();
                            } else {
                                this.comm.toast('上传失败');
                                this.loader.dismiss();
                            }
                        })
                    }
                })
            }
        })
    }
}
