import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { XuCanvasPage } from "../xu-canvas/xu-canvas";

function arrSort(obj1, obj2) {
    return obj1.qubie - obj2.qubie;
};

/**
 * Generated class for the FenhuSignPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-fenhu-sign',
    templateUrl: 'fenhu-sign.html',
})

export class FenhuSignPage {
    @ViewChild(Slides) slides: Slides;
    mycards: Array<any>;
    guid: string;
    sindex: string;
    canSlide: boolean;
    loading: any;
    loadings: any;
    stp: string;
    table: string;
    hasQian: boolean;
    qianImg: string;
    piliang: string;
    fName: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public photoViewer: PhotoViewer, public sqlite: SqllistServiceProvider, public loadingCtrl: LoadingController, private base64ToGallery: Base64ToGallery, public comm: CommonServiceProvider, private file: File) {
        let self = this;
        this.guid = this.navParams.get('FramGuid');
        this.stp = this.navParams.get('type');
        this.piliang = this.navParams.get('piliang');
        this.fName = '';
        this.canSlide = false;
        this.mycards = [];
        this.hasQian = false;
        this.loading = self.loadingCtrl.create({
            content: ''
        });
        this.loading.present();
        this.table = this.navParams.get('piliang') == undefined ? 'inframmessage' : 'inframmessage';
        this.sqlite.selecTableIDs(this.table, 'FramGuid', this.guid).then(res => {
            if (res[0].name.FramType == 3) {
                if (res[0].name.housesignaUrl != '' && res[0].name.housesignaUrl != null) {
                    let arr = res[0].name.housesignaUrl.split(',');
                    let narr = [];
                    for (let i = 0; i < arr.length; i++) {
                        narr.push(arr[i].split(';')[0]);
                    }
                    this.mycards = narr;
                    this.canSlide = true;
                }
                if (res[0].name.isHouseSigna != 'null' && res[0].name.isHouseSigna != null && res[0].name.isHouseSigna != '') {//未签字
                    let sobj = JSON.parse(res[0].name.farmsmessage);
                    let arr = res[0].name.isHouseSigna.split(',');
                    let n = arr[0].split(';')[1] - 0;
                    let narr = [];
                    for (let i = 0; i < arr.length; i++) {
                        narr.push(arr[i].split(';')[0]);
                    }
                    this.mycards = narr;
                    if (this.mycards.length > 1) {
                        this.canSlide = true;
                    }
                    self.fName = sobj[n].FramName;
                    this.loading.dismiss();
                } else {
                    self.zhunBei(res);
                }
            } else {
                if (res[0].name.housesignaUrl != null && res[0].name.housesignaUrl != '') {//已签字
                    this.hasQian = true;
                    this.mycards = res[0].name.housesignaUrl.split(',');
                    if (this.mycards.length > 1) {
                        this.canSlide = true;
                    }
                    this.loading.dismiss();
                } else if (res[0].name.isHouseSigna != 'null' && res[0].name.isHouseSigna != null && res[0].name.isHouseSigna != '') {//未签字
                    this.mycards = res[0].name.isHouseSigna.split(',');
                    if (this.mycards.length > 1) {
                        this.canSlide = true;
                    }
                    this.loading.dismiss();
                } else {
                    self.zhunBei(res);
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }

    zhunBei(res) {
        let self = this;
        if (res[0].name.FramType != 3) {
            if (!this.piliang) {
                this.sqlite.selecTableIDs('Underwriting', 'FramGuid', this.guid).then(datas => {
                    let arr = [];
                    let sn = parseInt(datas.length / 20 + '');
                    for (let i = 0; i <= sn; i++) {
                        arr.push('./assets/icon/toubao.jpg')
                    }
                    self.mycards = arr;
                    self.showCanvas(res, datas, '');
                }).catch(err => {
                    console.log(err)
                })
            } else {
                this.sqlite.selecTableIDs('PiliangUnderwriting', 'FramGuid', this.guid).then(datass => {
                    let arr = [];
                    let sn = parseInt(datass.length / 20 + '');
                    for (let i = 0; i <= sn; i++) {
                        arr.push('./assets/icon/toubao.jpg')
                    }
                    self.mycards = arr;
                    self.showCanvas(res, datass, '');
                }).catch(err => {
                    console.log(err)
                })
            }
        } else {//type=3
            let sobj = JSON.parse(res[0].name.farmsmessage);
            this.sqlite.selecTableIDs('Underwriting', 'FramGuid', sobj[0].qiyeGuid).then(data => {
                for (let i = 0; i < sobj.length; i++) {
                    for (let j = 0; j < data.length; j++) {
                        if (sobj[i].FramPeopleID == data[j].name.FramPeopleId) {
                            data[j].qubie = i;
                        }
                    }
                }
                let arr = [];
                let sn = parseInt(data.length / 20 + '');
                for (let k = 0; k <= sn; k++) {
                    arr.push('./assets/icon/toubao.jpg')
                }
                self.mycards = arr;
                self.showCanvas(res, data, sobj)
            }).catch(err => {
                console.log(err)
            })
        }
    }

    ionViewDidEnter() {
        let self = this;
        if (this.qianImg) {
            this.loadings = this.loadingCtrl.create({
                content: ''
            });
            this.loadings.present();
            this.sqlite.selecTableIDs('inframmessage', 'FramGuid', this.guid).then(res => {
                if (res[0].name.FramType != 3) {
                    this.sqlite.selecTableIDs('Underwriting', 'FramGuid', this.guid).then(datas => {
                        if (datas.length > 0) {
                            self.showQian(res, self.qianImg, datas);
                        } else {
                            self.sqlite.selecTableIDs('PiliangUnderwriting', 'FramGuid', self.guid).then(datass => {
                                self.showQian(res, self.qianImg, datass);
                            }).catch(err => {
                                console.log(err)
                            })
                        }

                    }).catch(err => {
                        console.log(err)
                    })
                } else {//type=3
                    let sobj = JSON.parse(res[0].name.farmsmessage);
                    let datas = [];
                    for (let k = 0; k < sobj.length; k++) {
                        this.sqlite.selectTableBaos(sobj[k].FramPeopleID, sobj[k].qiyeGuid).then(data => {
                            datas = datas.concat(data);
                            if (k == sobj.length - 1) {
                                self.showQians(res, self.qianImg, datas);
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }
                }
            }).catch(err => {
                console.log(err);
            });
        } else {
            // this.loading.dismiss();
        }

    }

    slideChanged() {
        let currentIndex = this.slides.getActiveIndex();
        this.sindex = currentIndex + '';
        if (this.slides.isEnd()) {
            this.slides.lockSwipeToNext(true);
        } else {
            this.slides.lockSwipeToNext(false);
        }
    }

    showthisImg(res) {
        this.photoViewer.show(res);
    }


    showCanvas(data, datas, ele) {
        let self = this;
        let sn = parseInt(datas.length / 20 + '');
        if (sn >= 1) {
            self.canSlide = true;
        }
        let st = 2500;
        if (sn == 0) {
            st = 1;
        }
        for (let j = 0; j <= sn; j++) {
            setTimeout(function () {
                let canvas;
                canvas = document.createElement('canvas');
                let cxt = canvas.getContext('2d');
                let img = new Image();
                img.src = './assets/icon/toubao.jpg';
                img.onload = () => {
                    canvas.height = 1191;
                    canvas.width = 1684;
                    cxt.fillStyle = '#fff';
                    cxt.fillRect(0, 0, 1684, 1191);
                    cxt.drawImage(img, 0, 0, 1684, 1191, 0, 0, 1684, 1191);
                    cxt.save();
                    cxt.font = "14px Arial";
                    cxt.fillStyle = '#000';
                    cxt.fillText(j + 1 + '', 770, 1159);
                    cxt.fillText(sn + 1 + '', 890, 1159);
                    let insurance = data[0].name.insurancetype.split(',');
                    cxt.fillText(insurance[1], 145, 206);
                    let breedAdd = datas[0].name.breedadd.split(',');
                    self.comm.canvasTexts(breedAdd[1], 17, cxt, 178, 232);
                    let imgs = new Image();
                    imgs.src = './assets/icon/yes.png';
                    imgs.onload = () => {
                        let yType = datas[0].name.breedType.split(',');
                        if (yType[1] == '散养') {
                            cxt.drawImage(imgs, 0, 0, 21, 25, 1240, 180, 21, 25);
                        } else {
                            cxt.drawImage(imgs, 0, 0, 21, 25, 1145, 180, 21, 25);
                        }
                        cxt.save();
                        cxt.fillText(datas[0].name.Insuredamount, 560, 232);
                        cxt.fillText(datas[0].name.rate, 815, 232);
                        let mRate = datas[0].name.Insuredamount * datas[0].name.rate * 0.01 + '';
                        cxt.fillText(mRate, 1035, 232);
                        let add = 20;
                        if (j == sn) {
                            add = datas.length % 20;
                        }
                        datas = datas.sort(arrSort);
                        for (let i = 20 * j; i < 20 * j + add; i++) {
                            //保险内容
                            let yLen = 317 + 38.7 * i - (38.7 * 20 * j);
                            cxt.fillText(i + 1 + '', 65, yLen);
                            if (data[0].name.FramType == 3) {
                                let s = datas[i].qubie;
                                self.comm.canvasTexts(ele[s].FramName, 6, cxt, 125, yLen);
                                cxt.fillText(ele[s].FramTel, 425, yLen);
                                self.comm.canvasTexts(ele[s].FramBank + ele[s].branch, 10, cxt, 1265, yLen);
                                cxt.fillText(ele[s].banknum, 1085, yLen);
                            } else {
                                self.comm.canvasTexts(data[0].name.FramName, 6, cxt, 125, yLen);
                                cxt.fillText(data[0].name.FramTel, 425, yLen);
                                self.comm.canvasTexts(data[0].name.FramBank + data[0].name.branch, 10, cxt, 1265, yLen);
                                cxt.fillText(data[0].name.banknum, 1085, yLen);
                            }
                            cxt.fillText(datas[i].name.FramPeopleId != 'null' ? datas[i].name.FramPeopleId : data[0].name.tyshxydm, 208, yLen);

                            //标的识别码
                            if (data[0].name.FramType != 4 && data[0].name.FramType != 5) {
                                self.comm.canvasTexts(datas[i].name.AnimalId, 13, cxt, 528, yLen);
                            } else {
                                self.comm.canvasTexts(datas[i].name.StartAnimalIds + '-' + datas[i].name.EndAnimalIds, datas[i].name.StartAnimalIds.length + 1, cxt, 528, yLen);
                            }

                            if (datas[i].name.AnimalAge != null) {
                                cxt.fillText(datas[i].name.AnimalAge, 675, yLen);
                            }
                            //保险数量
                            cxt.fillText('1', 755, yLen);
                            cxt.fillText(datas[i].name.TotalPremium, 850, yLen);
                            cxt.fillText(datas[i].name.SelfPayPremium, 960, yLen);


                        }

                        let sd = canvas.toDataURL("image/png");
                        self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
                            res => {
                                self.mycards[j] = 'file://' + res;
                                sd = '';
                                if (j == sn) {
                                    setTimeout(function () {
                                        if (sn >= 1) {
                                            if (self.comm.isRepeat(self.mycards)) {
                                                self.comm.toast('生成失败，请重新生成');
                                                let str = self.mycards;
                                                for (let q = 0; q < str.length; q++) {
                                                    let index = str[q].lastIndexOf("\/");
                                                    let str1 = str[q].substring(index + 1, str[q].length);
                                                    let str2 = str[q].substring(0, index + 1);
                                                    self.file.removeFile(str2, str1).then(dels => {
                                                    }).catch(error => {
                                                        console.log('3')
                                                    })
                                                }
                                                self.navCtrl.pop();
                                                self.loading.dismiss();
                                                return false;
                                            }
                                        }
                                        if (ele != '') {
                                            self.fName = ele[0].FramName;

                                        } else {
                                            self.fName = '';
                                        }

                                        self.loading.dismiss();
                                    }, 500)
                                }
                            },
                            err => console.log('Error saving image to gallery ', err)
                        );
                    }
                }
            }, st)
        }
    }

    showQian(data, url, datas) {
        let self = this;
        let sn = parseInt(datas.length / 20 + '');
        let arr = [];
        if (sn >= 1) {
            self.canSlide = true;
        } else {
            self.canSlide = false;
        }
        for (let k = 0; k <= sn; k++) {
            let canvas = document.createElement('canvas');
            let cxt = canvas.getContext('2d');
            let img = new Image();
            img.src = self.mycards[k];
            img.onload = () => {
                canvas.height = 1191;
                canvas.width = 1684;
                cxt.fillStyle = '#fff';
                cxt.fillRect(0, 0, 1684, 1191);
                cxt.drawImage(img, 0, 0, 1684, 1191, 0, 0, 1684, 1191);
                cxt.save();
                let add = 20;
                if (k == sn) {
                    add = datas.length % 20;
                }
                for (let i = 20 * k; i < 20 * k + add; i++) {
                    let imgs = new Image();
                    imgs.src = url;
                    imgs.onload = () => {
                        cxt.fillStyle = '#f00';
                        let yLen = 290 + 38.7 * i - (38.7 * 20 * k);
                        cxt.drawImage(imgs, 0, 0, 900, 900, 1553, yLen, 150, 50);
                        cxt.save();
                        if ((i + 1) % 20 == 0 || i == (datas.length - 1)) {
                            let sd = canvas.toDataURL("image/png");
                            self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
                                res => {
                                    self.loadings.dismiss();
                                    arr[k] = 'file://' + res;
                                    if (sn >= 1) {
                                        if (self.comm.isRepeat(arr)) {
                                            self.comm.toast('签字失败，请重新签字');
                                            self.mycards = data[0].name.isHouseSigna.split(',');
                                            let str = arr;
                                            for (let q = 0; q < str.length; q++) {
                                                let index = str[q].lastIndexOf("\/");
                                                let str1 = str[q].substring(index + 1, str[q].length);
                                                let str2 = str[q].substring(0, index + 1);
                                                self.file.removeFile(str2, str1).then(dels => {
                                                }).catch(error => {
                                                    console.log('3')
                                                })
                                            }
                                            return false;
                                        }
                                    }
                                    self.sqlite.updateQian(self.mycards, self.guid, 'isHouseSigna')
                                    .then(ele => {
                                        self.mycards[k] = 'file://' + res;
                                        self.sqlite.updateQian(self.mycards, self.guid, 'housesignaUrl')
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
            }
        }
    }

    showQians(data, url, datas) {
        let self = this;
        let sn = parseInt(datas.length / 20 + '');
        let num = 0;
        let oldNum = 0;
        if (sn >= 1) {
            self.canSlide = true;
        } else {
            self.canSlide = false;
        }
        this.sqlite.selecTableIDs('inframmessage', 'FramGuid', this.guid).then(res => {
            let sobj = JSON.parse(res[0].name.farmsmessage);
            let mycard = [];
            if (res[0].name.isHouseSigna == null || res[0].name.isHouseSigna == '' || res[0].name.isHouseSigna == 'null') {
                mycard = self.mycards;
            } else {
                let all = res[0].name.isHouseSigna.split(',');
                num = all[0].split(';')[1] - 0;
                oldNum = all[0].split(';')[2] - 0;
                for (let m = 0; m < all.length; m++) {
                    mycard.push(all[m].split(';')[0]);
                }
            }
            mycard = self.mycards;
            this.sqlite.selecTableIDs('Underwriting', 'FramGuid', sobj[0].qiyeGuid).then(datass => {
                let allnum = 0;
                for (let j = 0; j < datass.length; j++) {
                    if (sobj[num].FramPeopleID == datass[j].name.FramPeopleId) {
                        allnum++;
                    }
                }

                let n1 = parseInt((oldNum) / 20 + '');
                let n2 = parseInt((oldNum + allnum) / 20 + '');
                if (n1 == n2) {
                    let canvas = document.createElement('canvas');
                    let cxt = canvas.getContext('2d');
                    let img = new Image();
                    img.src = mycard[n1];
                    img.onload = () => {
                        canvas.height = 1191;
                        canvas.width = 1684;
                        cxt.fillStyle = '#fff';
                        cxt.fillRect(0, 0, 1684, 1191);
                        cxt.drawImage(img, 0, 0, 1684, 1191, 0, 0, 1684, 1191);
                        cxt.save();
                        let imgs = new Image();
                        imgs.src = url;
                        imgs.onload = () => {
                            for (let i = oldNum; i < oldNum + allnum; i++) {
                                let yLen = 290 + 38.7 * i;
                                cxt.drawImage(imgs, 0, 0, 900, 900, 1553, yLen, 150, 50);
                            }

                            cxt.save();
                            setTimeout(function () {
                                let sd = canvas.toDataURL("image/png");
                                self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
                                    res => {
                                        self.loadings.dismiss();
                                        self.mycards[n1] = 'file://' + res;
                                        let str = [];

                                        let sname = 'isHouseSigna';
                                        if (sobj.length == num + 1) {
                                            sname = 'housesignaUrl';
                                            for (let p = 0; p < self.mycards.length; p++) {
                                                str.push(self.mycards[p]);
                                            }
                                            str.join(',');
                                            self.hasQian = true;
                                        } else {
                                            for (let p = 0; p < self.mycards.length; p++) {
                                                str.push(self.mycards[p] + ';' + (num + 1) + ';' + (oldNum + allnum));
                                            }
                                            str.join(',');
                                            self.fName = sobj[num + 1].FramName;
                                        }
                                        self.sqlite.updateQian(str, self.guid, sname)
                                        .then(ele => {
                                        })

                                    },
                                    err => console.log('Error saving image to gallery ', err)
                                );
                            }, 500)
                        }

                    }
                } else {
                    for (let z = n1; z <= n2; z++) {
                        let canvas = document.createElement('canvas');
                        let cxt = canvas.getContext('2d');
                        let img = new Image();
                        img.src = mycard[z];
                        img.onload = () => {
                            canvas.height = 1191;
                            canvas.width = 1684;
                            cxt.fillStyle = '#fff';
                            cxt.fillRect(0, 0, 1684, 1191);
                            cxt.drawImage(img, 0, 0, 1684, 1191, 0, 0, 1684, 1191);
                            cxt.save();
                            //oldNum + allnum,oldNum
                            let imgs = new Image();
                            imgs.src = url;
                            imgs.onload = () => {
                                if (z == n1) {
                                    for (let h = oldNum % 20 - 1; h < 20; h++) {
                                        let yLen = 290 + 38.7 * h;
                                        cxt.drawImage(imgs, 0, 0, 900, 900, 1553, yLen, 150, 50);
                                    }
                                } else if (z == n2) {
                                    for (let h = 0; h < (oldNum + allnum) % 20; h++) {
                                        let yLen = 290 + 38.7 * h;
                                        cxt.drawImage(imgs, 0, 0, 900, 900, 1553, yLen, 150, 50);
                                    }
                                } else {
                                    for (let h = 0; h < 20; h++) {
                                        let yLen = 290 + 38.7 * h;
                                        cxt.drawImage(imgs, 0, 0, 900, 900, 1553, yLen, 150, 50);
                                    }
                                }
                                cxt.save();
                                setTimeout(function () {
                                    let sd = canvas.toDataURL("image/png");
                                    self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
                                        res => {
                                            if (z == n2) {
                                                self.loadings.dismiss();
                                            }

                                            self.mycards[z] = 'file://' + res;
                                            let str = [];
                                            let sname = 'isHouseSigna';
                                            if (sobj.length == num + 1) {
                                                sname = 'housesignaUrl';
                                                for (let p = 0; p < self.mycards.length; p++) {
                                                    str.push(self.mycards[p]);
                                                }
                                                str.join(',');
                                                self.hasQian = true;
                                            } else {
                                                for (let p = 0; p < self.mycards.length; p++) {
                                                    str.push(self.mycards[p] + ';' + (num + 1) + ';' + (oldNum + allnum));
                                                }
                                                str.join(',');
                                                self.fName = sobj[num + 1].FramName;
                                            }
                                            self.sqlite.updateQian(str, self.guid, sname)
                                            .then(ele => {
                                            })

                                        },
                                        err => console.log('Error saving image to gallery ', err)
                                    );
                                }, 1000)

                            }
                        }

                    }
                }

            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err);
        });
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

    gotoFenPage() {
        let self = this;
        this.sqlite.selecTableIDs('inframmessage', 'FramGuid', this.guid).then(res => {
            if (res[0].name.FramType == 3) {
                let sobj = JSON.parse(res[0].name.farmsmessage);
                let num = 0;
                let all = 0;
                if (res[0].name.isHouseSigna != 'null' && res[0].name.isHouseSigna != null && res[0].name.isHouseSigna != '') {
                    num = res[0].name.isHouseSigna.split(',')[0].split(';')[1] - 0;
                    all = res[0].name.isHouseSigna.split(',')[0].split(';')[2] - 0;
                    self.addName(num, all, sobj, res, '');
                } else {
                    self.sqlite.selecTableIDs('Underwriting', 'FramGuid', sobj[0].qiyeGuid).then(tet => {
                        let allnum = 0;
                        let num = 0;
                        let all = 0;
                        for (let j = 0; j < tet.length; j++) {
                            if (sobj[0].FramPeopleID == tet[j].name.FramPeopleId) {
                                allnum++;
                            }
                        }
                        let str = [];
                        for (let s = 0; s < self.mycards.length; s++) {
                            str.push(self.mycards[s] + ';0;' + allnum)
                        }
                        self.addName(num, all, sobj, res, str);
                    })
                }
            } else {
                this.sqlite.updateQian(this.mycards, this.guid, 'isHouseSigna')
                .then(res => {
                    this.sqlite.updateQian(this.mycards, this.guid, 'housesignaUrl')
                    .then(res => {
                        this.comm.toast('已保存在本地');
                        this.navCtrl.pop();
                        this.navCtrl.pop();
                    });
                });
            }
        })
    }

    gotoLocal() {
        this.navCtrl.pop();
        this.navCtrl.pop();
    }

    addName(num, all, sobj, res, ty) {
        let self = this;
        self.sqlite.selecTableIDs('Underwriting', 'FramGuid', sobj[0].qiyeGuid).then(datass => {
            let allnum = 0;
            for (let j = 0; j < datass.length; j++) {
                if (sobj[num].FramPeopleID == datass[j].name.FramPeopleId) {
                    allnum++;
                }
            }
            all = all + allnum;
            let arr = [];
            if (ty == '') {
                arr = res[0].name.isHouseSigna.split(',');
            } else {
                arr = ty;
            }
            let str = [];
            let sname = '';
            num = num + 1;
            if (num == sobj.length) {
                for (let i = 0; i < arr.length; i++) {
                    str.push(arr[i].split(';')[0])
                }
                str.join(',');
                sname = 'housesignaUrl';
                self.hasQian = true;
                this.comm.toast('已保存在本地');
            } else if (num == 1) {
                for (let i = 0; i < arr.length; i++) {
                    str.push(self.mycards[i] + ';' + (num) + ';' + all)
                }
                str.join(',');
                sname = 'isHouseSigna';
                self.fName = sobj[num].FramName;
            } else {
                for (let i = 0; i < arr.length; i++) {
                    str.push(arr[i].split(';')[0] + ';' + num + ';' + all)
                }
                str.join(',');
                sname = 'isHouseSigna';
                self.fName = sobj[num].FramName;
            }
            self.sqlite.updateQian(str, self.guid, sname)
            .then(ele => {
            })
        })
    }
}
