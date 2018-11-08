import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { XuCanvasPage } from "../xu-canvas/xu-canvas";

@IonicPage()
@Component({
    selector: 'page-suresigna',
    templateUrl: 'suresigna.html',
})
export class SuresignaPage {
    guid: string;
    mycard: string;
    stp: string;
    loading: any;
    qianImg: string;
    table: string;
    hasQian: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SqllistServiceProvider, public loadingCtrl: LoadingController, private base64ToGallery: Base64ToGallery, public photoViewer: PhotoViewer, public comm: CommonServiceProvider, private file: File) {
        let self = this;
        this.guid = this.navParams.get('FramGuid');
        this.stp = this.navParams.get('type');
        this.table = this.navParams.get('piliang');
        this.hasQian = false;
        this.loading = self.loadingCtrl.create({
            content: ''
        });
        this.loading.present();
        let table = 'inframmessage';
        this.sqlite.selecTableIDs(table, 'FramGuid', this.guid).then(res => {
            if (res[0].name.policysignaUrl != null&&res[0].name.policysignaUrl != ''&&res[0].name.policysignaUrl.split(',').length==1) {//已签字
                self.hasQian = true;
                let str = res[0].name.policysignaUrl;
                let index = str.lastIndexOf("\/");
                let str1 = str.substring(index + 1, str.length);
                let str2 = str.substring(0, index + 1);
                self.file.checkFile(str2, str1).then(gfile => {
                    self.mycard = res[0].name.policysignaUrl;
                    this.loading.dismiss();
                }).catch(nof => {
                    if (res[0].name.isAllSigna == 'null') {//未签字的空，去生成
                        let table = this.table == undefined ? 'Underwriting' : 'PiliangUnderwriting';
                        this.sqlite.selecTableIDs(table, 'FramGuid', this.guid).then(datas => {
                            self.showCanvas(res, datas);
                        }).catch(err => {
                            console.log(err)
                        })
                    } else {//未签字的有路径，查看本地是否有这张图片
                        let str = res[0].name.isAllSigna;
                        let index = str.lastIndexOf("\/");
                        let str1 = str.substring(index + 1, str.length);
                        let str2 = str.substring(0, index + 1);
                        self.file.checkFile(str2, str1).then(gfiles => {
                            self.mycard = res[0].name.isAllSigna;
                            this.loading.dismiss();
                        }).catch(nofs => {
                            let table = this.table == undefined ? 'Underwriting' : 'PiliangUnderwriting';
                            this.sqlite.selecTableIDs(table, 'FramGuid', this.guid).then(datas => {
                                self.showCanvas(res, datas);
                            }).catch(err => {
                                console.log(err)
                            })
                        });
                    }
                });
            } else if (res[0].name.isAllSigna != null&&res[0].name.isAllSigna != '') {//没有已签字的，查看未签字
                let str = res[0].name.isAllSigna;
                let index = str.lastIndexOf("\/");
                let str1 = str.substring(index + 1, str.length);
                let str2 = str.substring(0, index);
                self.file.checkFile(str2, str1).then(gfiles => {//本地找到，直接显示
                    self.mycard = res[0].name.isAllSigna;
                    this.loading.dismiss();
                }).catch(nofs => {//本地未找到，去生成
                    let table = this.table == undefined ? 'Underwriting' : 'PiliangUnderwriting';
                    this.sqlite.selecTableIDs(table, 'FramGuid', this.guid).then(datas => {
                        self.showCanvas(res, datas);
                    }).catch(err => {
                        console.log(err)
                    })
                });
            } else {
                let table = this.table == undefined ? 'Underwriting' : 'PiliangUnderwriting';
                this.sqlite.selecTableIDs(table, 'FramGuid', this.guid).then(datas => {
                    self.showCanvas(res, datas);
                }).catch(err => {
                    console.log(err)
                })
            }
        }).catch(err => {
            console.log(err);
        });

    }

    ionViewDidEnter() {
        let self = this;
        if (self.qianImg) {
            this.loading = self.loadingCtrl.create({
                content: ''
            });
            this.loading.present();
            setTimeout(function () {


                    self.sqlite.selecTableIDs('inframmessage', 'FramGuid', self.guid).then(res => {
                        self.showQian(res, self.qianImg);
                    }).catch(err => {
                        console.log(err);
                    });

            },500)
        }
    }

    showPhoto() {
        this.photoViewer.show(this.mycard);
    }

    showCanvas(data, datas) {
        let self = this;
        let canvas = document.createElement('canvas');
        let cxt = canvas.getContext('2d');
        let img = new Image();
        img.src = './assets/icon/baodan1.jpg';
        img.onload = () => {
            // let loading = self.loadingCtrl.create({
            //     content: ''
            // });
            // loading.present();
            canvas.height = 1684;
            canvas.width = 1191;
            cxt.fillStyle = '#fff';
            cxt.fillRect(0, 0, 1191, 1684);
            cxt.drawImage(img, 0, 0, 1191, 1684, 0, 0, 1191, 1684);
            cxt.save();

            let imgs = new Image();
            imgs.src = './assets/icon/yes.png';
            imgs.onload = () => {
                cxt.fillStyle = '#fff';
                let fType = data[0].name.FramType;
                if (fType !=3) {
                    cxt.drawImage(imgs, 0, 0, 21, 25, 248, 558, 21, 25);
                } else {
                    cxt.drawImage(imgs, 0, 0, 21, 25, 408, 558, 21, 25);
                }
                cxt.save();
                cxt.font = "14px Arial";
                cxt.fillStyle = '#000';
                let insurance = data[0].name.insurancetype.split(',');
                cxt.fillText(insurance[1], 280, 353);
                let name = JSON.parse(localStorage.getItem('user')).RealName;
                cxt.fillText(name, 220, 386);
                let addr = '';

                if (data[0].name.FramType != 3) {
                    addr = data[0].name.addr.split(',');
                    cxt.fillText(data[0].name.FramPeopleID!=null?data[0].name.FramPeopleID:data[0].name.tyshxydm, 850, 450);
                    cxt.fillText(data[0].name.FramPeopleID!=null?data[0].name.FramPeopleID:data[0].name.tyshxydm, 920, 546);
                    cxt.fillText(data[0].name.FramName, 235, 482);
                    cxt.fillText('1', 800, 576);
                } else {
                    let huNum = JSON.parse(data[0].name.farmsmessage);
                    addr = datas[0].name.breedadd.split(',');
                    cxt.fillText(data[0].name.tyshxydm, 850, 450);
                    cxt.fillText(data[0].name.tyshxydm, 920, 546);
                    cxt.fillText(huNum.length+'', 800, 576);
                    self.comm.canvasText('团体投保:' + data[0].name.FramName + '+' + huNum[0].FramName + '等' + huNum.length + '户', 32, cxt, 235, 458);
                }
                self.comm.canvasTexts(addr[1], 9, cxt, 650, 416);
                let userinfo = JSON.parse(localStorage.getItem('user'));
                cxt.fillText(userinfo.CityName.substring(0, userinfo.CityName.length - 1), 220, 416);
                cxt.fillText(userinfo.CountyName.substring(0, userinfo.CountyName.length - 1), 360, 416);
                cxt.font = "18px Arial";
                //邮编
                // cxt.fillText('123456', 828, 419);
                // cxt.fillText('123456', 760, 515);

                cxt.fillText(data[0].name.FramTel==null?'':data[0].name.FramTel, 224, 450);


                let relationship = data[0].name.relationship.split(',');
                cxt.fillText(relationship[1], 850, 482);
                cxt.fillText(addr[1], 235, 515);
                cxt.fillText(data[0].name.FramTel==null?'':data[0].name.FramTel, 235, 546);
                let xianz = JSON.parse(data[0].name.insurancepro);
                self.comm.canvasText(xianz.ProjectName, 10, cxt, 136, 664);
                cxt.fillText('头', 322, 688);
                let touNum = datas.length;
                cxt.fillText(touNum, 385, 688);
                cxt.fillText(datas[0].name.Insuredamount, 635, 688);
                //保险金额
                let allP = (datas[0].name.Insuredamount * touNum).toFixed(2) + '';
                cxt.fillText(allP, 777, 688);
                cxt.fillText(datas[0].name.rate, 980, 688);
                let bxf = (datas[0].name.Insuredamount * touNum * datas[0].name.rate * 0.01).toFixed(2) + '';
                cxt.fillText(bxf, 1040, 688);
                let yangAdd = datas[0].name.breedadd.split(',');
                cxt.fillText(yangAdd[1], 385, 938);
                let gpsInfo = datas[0].name.GPS.split('|');
                cxt.fillText(gpsInfo[0], 370, 962);
                cxt.fillText(gpsInfo[1], 705, 962);
                let imgss = new Image();
                imgss.src = './assets/icon/yes.png';
                imgss.onload = () => {
                    let yType = datas[0].name.breedType.split(',');
                    if (yType[1] == '散养') {
                        cxt.drawImage(imgss, 0, 0, 21, 25, 321, 968, 21, 25);
                    } else {
                        cxt.drawImage(imgss, 0, 0, 21, 25, 440, 968, 21, 25);
                    }
                    cxt.save();
                    cxt.fillText(datas[0].name.Insuredamount, 770, 1018);
                    let allCp = self.comm.NoToChinese(datas[0].name.Insuredamount);
                    cxt.fillText(allCp, 405, 1018);
                    cxt.fillText(allP, 770, 1047);
                    let allCps = self.comm.NoToChinese(allP);
                    cxt.fillText(allCps, 405, 1047);
                    //时间
                    let start = data[0].name.starttime.split('-');
                    cxt.fillText(start[0], 420, 1170);
                    cxt.fillText(start[1], 496, 1170);
                    cxt.fillText(start[2].split(' ')[0], 544, 1170);
                    let end = data[0].name.endtime.split('-');
                    cxt.fillText(end[0], 695, 1170);
                    cxt.fillText(end[1], 780, 1170);
                    cxt.fillText(end[2].split(' ')[0], 838, 1170);
                    let aDay = self.comm.DateMinus(data[0].name.starttime, data[0].name.endtime) + '';
                    cxt.fillText(aDay, 320, 1170);
                    let bili = data[0].name.insurancepro.split('&');
                    bili = JSON.parse(bili[0]);
                    //中央
                    cxt.fillText(bili.CentralRate, 485, 1111);
                    cxt.fillText((bili.CentralRate * datas[0].name.Insuredamount * touNum * 0.01* datas[0].name.rate * 0.01).toFixed(2) + '', 478, 1140);
                    //省
                    cxt.fillText(bili.ProvinceRate, 590, 1111);
                    cxt.fillText((bili.ProvinceRate * datas[0].name.Insuredamount * touNum * 0.01* datas[0].name.rate * 0.01).toFixed(2) + '', 580, 1140);
                    //地，市
                    cxt.fillText(bili.CityRate, 710, 1111);
                    cxt.fillText((bili.CityRate * datas[0].name.Insuredamount * touNum * 0.01* datas[0].name.rate * 0.01).toFixed(2) + '', 698, 1140);
                    //县
                    cxt.fillText(bili.CountyRate, 840, 1111);
                    cxt.fillText((bili.CountyRate * datas[0].name.Insuredamount * touNum * 0.01* datas[0].name.rate * 0.01).toFixed(2) + '', 832, 1140);
                    //农户
                    cxt.fillText(bili.FarmRate, 958, 1111);
                    cxt.fillText((bili.FarmRate * datas[0].name.Insuredamount * touNum * 0.01* datas[0].name.rate * 0.01).toFixed(2) + '', 946, 1140);
                    //其他
                    cxt.fillText(bili.OtherRate, 1046, 1111);
                    cxt.fillText((bili.OtherRate * datas[0].name.Insuredamount * touNum * 0.01* datas[0].name.rate * 0.01).toFixed(2), 1033, 1140);
                    //争议处理
                    let imgsss = new Image();
                    imgsss.src = './assets/icon/yes.png';
                    imgsss.onload = () => {
                        cxt.drawImage(imgsss, 0, 0, 21, 25, 316, 1174, 21, 25);
                        cxt.save();
                        let weiyuan = data[0].name.dispute.split(',');
                        weiyuan = weiyuan[1].split('仲裁委员会');
                        cxt.font = "14px Arial";
                        cxt.fillText(weiyuan[0], 395, 1194);
                        let imgssss = new Image();
                        imgssss.src = './assets/icon/yes.png';
                        let manage = data[0].name.management.split(',')[0];
                        imgssss.onload = () => {
                            if (manage == 1) {
                                cxt.drawImage(imgssss, 0, 0, 21, 25, 420, 1228, 21, 25);
                            } else if (manage == 2) {
                                cxt.drawImage(imgssss, 0, 0, 21, 25, 526, 1228, 21, 25);
                            } else {
                                cxt.drawImage(imgssss, 0, 0, 21, 25, 626, 1228, 21, 25);
                            }
                            cxt.save();
                            cxt.font = "20px Arial";
                            if (manage == 3) {
                                cxt.fillText(data[0].name.percent, 765, 1248);
                            }
                            let imgsssss = new Image();
                            imgsssss.src = './assets/icon/yes.png';
                            imgsssss.onload = () => {
                                if (bili.CentralRate > 0) {
                                    cxt.drawImage(imgsssss, 0, 0, 21, 25, 496, 1250, 21, 25);
                                } else {
                                    cxt.drawImage(imgsssss, 0, 0, 21, 25, 580, 1250, 21, 25);
                                }
                                cxt.save();
                                if (data[0].name.Remarks != null) {
                                    self.comm.canvasText(data[0].name.Remarks, 43, cxt, 235, 1305);
                                }
                                let dates = new Date();
                                let year = dates.getFullYear() + '';
                                let month = dates.getMonth() + 1 + '';
                                let strDate = dates.getDate() + '';
                                if (month.length == 1) {
                                    month = "0" + month;
                                }
                                if (strDate.length == 1) {
                                    strDate = "0" + strDate;
                                }
                                cxt.fillText(year, 745, 1540);
                                cxt.fillText(month, 828, 1540);
                                cxt.fillText(strDate, 890, 1540);

                                let sd = canvas.toDataURL("image/png");
                                self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
                                    res => {
                                        self.mycard = 'file://' + res;
                                        self.loading.dismiss();
                                    },
                                    err => console.log('Error saving image to gallery ', err)
                                );
                            }
                        }
                    }
                }

            };

        };


    }

    showQian(data, url) {
        let self = this;
        let canvas = document.createElement('canvas');
        let cxt = canvas.getContext('2d');
        let img = new Image();
        img.src = this.mycard;
        // setTimeout(function () {
        //
        // },500);
        img.onload = () => {
            canvas.height = 1684;
            canvas.width = 1191;
            cxt.fillStyle = '#fff';
            cxt.fillRect(0, 0, 1191, 1684);
            cxt.drawImage(img, 0, 0, 1191, 1684, 0, 0, 1191, 1684);
            cxt.save();

            let imgs = new Image();
            imgs.src = url;
            imgs.onload = () => {
                cxt.fillStyle = '#f00';
                cxt.drawImage(imgs, 0, 0, 800, 1000, 508, 1540, 200, 250);
                cxt.save();
                let sd = canvas.toDataURL("image/png");
                self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
                    res => {
                        self.loading.dismiss();
                        self.sqlite.updateQian(self.mycard, self.guid, 'isAllSigna')
                            .then(ele => {
                                self.mycard = 'file://' + res;
                                self.sqlite.updateQian(self.mycard, self.guid, 'policysignaUrl')
                                    .then(res => {
                                        self.hasQian = true;
                                    })
                            })

                    },
                    err => console.log('Error saving image to gallery ', err)
                );
            }
        }
    }

    backsss = (_params) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.qianImg = _params;
            resolve();
        });
    };

    gotoXuCanvasPage() {
        this.navCtrl.push(XuCanvasPage, {
            FramGuid: this.guid,
            type: this.stp,
            backs: this.backsss
        });
    }

    gotoFenPage(ele) {
        if(ele == 1){
            this.comm.toast('已保存在本地');

        }
        this.sqlite.updateQian(this.mycard, this.guid, 'isAllSigna')
            .then(res => {

            });
        if(this.table){
            this.navCtrl.push('FenhuSignPage', {
                FramGuid: this.guid,
                type: this.stp,
                piliang: this.table
            });
        }else{
            this.navCtrl.push('FenhuSignPage', {
                FramGuid: this.guid,
                type: this.stp
            });
        }

    }
}
