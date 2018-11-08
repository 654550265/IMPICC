import { Component,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,Slides,LoadingController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { PhotoViewer } from "@ionic-native/photo-viewer";
import {SqllistServiceProvider} from "../../providers/sqllist-service/sqllist-service";
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { XuCanvasPage } from "../xu-canvas/xu-canvas";

/**
 * Generated class for the Suresigna3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-suresigna3',
  templateUrl: 'suresigna3.html',
})
export class Suresigna3Page {
    @ViewChild(Slides) slides: Slides;
    mycards: Array<any>;
    guid: string;
    sindex: string;
    canSlide: boolean;
    loading: any;
    loadings:any;
    stp: string;
    hasQian: boolean;
    qianImg: string;
    constructor(public navCtrl: NavController, public navParams: NavParams,public photoViewer: PhotoViewer,public sqlite: SqllistServiceProvider,public loadingCtrl: LoadingController,private base64ToGallery: Base64ToGallery,public comm: CommonServiceProvider,private file: File) {
        let self = this;
        this.guid = this.navParams.get('FramGuid');
        this.stp = this.navParams.get('type');
        this.canSlide = false;
        this.mycards = [];
        this.hasQian = false;
        this.loading = self.loadingCtrl.create({
            content: ''
        });
        this.loading.present();
        this.sqlite.selecTableIDs('InsuredFarmer','FramGuid',this.guid).then(res => {
            self.sqlite.selecTableIDs('DeclareClaimTable','FramGuid',this.guid).then(ress => {
                if(res[0].name.detailImg){
                    let s = res[0].name.detailImg.split('&')[1];
                    if(s == '1'){
                        self.hasQian = false;
                    }else{
                        self.hasQian = true;
                    }
                    let arr = res[0].name.detailImg.split(',');
                    for(let i = 0;i<arr.length;i++){
                        self.mycards.push(arr[i].split('&')[0]);
                    }
                    if(arr.length>1){
                        self.canSlide = true;
                    }else{
                        self.canSlide = false;
                    }
                    self.loading.dismiss();
                }else{
                    self.showCanvas(ress,res);
                }
            });
        });
    }

    showCanvas(data,datas){
        let self = this;
        let sn = parseInt(data.length / 20 + '');
        if (sn >= 1) {
            self.canSlide = true;
        } else {
            self.canSlide = false;
        }
        for(let k = 0;k<=sn;k++){
            let canvas = document.createElement('canvas');
            let cxt = canvas.getContext('2d');
            let img = new Image();
            img.src = './assets/icon/baodan3.jpg';
            img.onload = () => {
                canvas.height = 1191;
                canvas.width = 1684;
                cxt.fillStyle = '#fff';
                cxt.fillRect(0, 0, 1684, 1191);
                cxt.drawImage(img, 0, 0, 1684, 1191, 0, 0, 1684, 1191);
                cxt.save();
                cxt.font = "14px Arial";
                cxt.fillStyle = '#000';
                //县
                if(data[0].name.FindAddress == 'undefined'){
                    data[0].name.FindAddress = '';
                }
                cxt.fillText(data[0].name.FindAddress, 120, 220);
                //乡
                // cxt.fillText('我是乡', 235, 220);
                // //村
                // cxt.fillText('我是村', 305, 220);
                //标的名称
                // cxt.fillText('我是标的名称', 950, 220);
                let add = 20;
                if (k == sn) {
                    add = data.length % 20;
                }
                for(let i = 20 * k; i < 20 * k + add; i++){
                    //序号
                    let sh = 295+36.1*i-(36.1 * 20 * k);
                    cxt.fillText(i+1+'', 142, sh);
                    //被保险人姓名
                    cxt.fillText(datas[0].name.name, 220, sh);
                    //养殖地点
                    self.comm.canvasTexts(data[i].name.FindAddress,10,cxt,360,sh);
                    //识别码
                    cxt.fillText(data[i].name.AnimalId, 520, sh);
                    //出险时间
                    cxt.fillText(datas[0].name.outDate, 720, sh);
                    //死亡原因
                    cxt.fillText(data[i].name.DieMessage.split(',')[1], 850, sh);
                    //畜龄
                    let unit = '年';
                    if(data[i].name.AnimalTypeName == '猪'){
                        unit = '月'
                    }
                    cxt.fillText(data[i].name.AnimalAge+unit, 1000, sh);
                    //体重
                    let tizhong = data[i].name.AnimalWeight+'Kg';
                    cxt.fillText(tizhong, 1090, sh);
                    //单位保额
                    cxt.fillText(data[i].name.InsuranceAmount, 1190, sh);
                    //核定金额
                    cxt.fillText(data[i].name.FinalMoney, 1335, sh);
                }
                //保单号
                cxt.fillText(datas[0].name.insuranceId, 235, 1012);
                //查勘员
                let rname = JSON.parse(localStorage.getItem('user')).RealName;
                cxt.fillText(rname, 860, 1012);
                //查勘时间
                let ckTime = data[0].name.Time.split('/')
                cxt.fillText(ckTime[0], 1350, 1012);//年
                cxt.fillText(ckTime[1], 1430, 1012);//月
                cxt.fillText(ckTime[2], 1485, 1012);//日
                //第几页，共几页
                cxt.fillText(k+1+'', 796, 1085);
                cxt.fillText(sn+1+'', 875, 1085);
                let sd = canvas.toDataURL("image/png");
                self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
                    res => {
                        self.loading.dismiss();
                        self.mycards[k] = 'file://' + res;
                        sd = '';
                        if (k == sn) {
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
                                                console.log('2')
                                            }).catch(error => {
                                                console.log('3')
                                            })
                                        }
                                        self.navCtrl.pop();
                                        self.loading.dismiss();
                                        return false;
                                    }
                                }
                                let str = self.mycards.join(',')+'&1';
                                self.sqlite.updateQians(str, self.guid, 'detailImg')
                                    .then(res => {
                                        console.log(res)
                                    });
                                self.loading.dismiss();
                            }, 500)
                        }
                    },
                    err => console.log('Error saving image to gallery ', err)
                );
            }
        }

    }
    qianCanvas(data,url,datas){
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
            let ss = data[0].name.detailImg.split(',');
            img.src = ss[k].split('&')[0];
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
                let imgs = new Image();
                imgs.src = url;
                imgs.onload = () => {
                    for (let i = 20 * k; i < 20 * k + add; i++) {
                        let yLen = 276 + 38.7 * i - (38.7 * 20 * k);
                        cxt.drawImage(imgs, 0, 0, 900, 900, 1453, yLen, 150, 50);
                    }
                    cxt.save();
                    setTimeout(function () {
                        let sd = canvas.toDataURL("image/png");
                        self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
                            res => {
                                self.loading.dismiss();
                                arr[k] = 'file://' + res;
                                if (sn >= 1) {
                                    if (self.comm.isRepeat(arr)) {
                                        self.comm.toast('签字失败，请重新签字');
                                        self.mycards = data[0].name.canvasImg.split(',');
                                        let str = arr;
                                        for (let q = 0; q < str.length; q++) {
                                            let index = str[q].lastIndexOf("\/");
                                            let str1 = str[q].substring(index + 1, str[q].length);
                                            let str2 = str[q].substring(0, index + 1);
                                            self.file.removeFile(str2, str1).then(dels => {
                                                console.log('2')
                                            }).catch(error => {
                                                console.log('3')
                                            })
                                        }
                                        return false;
                                    }
                                }
                                self.mycards[k] = 'file://' + res;
                                if(k == sn){
                                    let str = self.mycards.join(',')+'&2';
                                    self.sqlite.updateQians(str, self.guid, 'detailImg')
                                        .then(res => {
                                            self.hasQian = true;
                                        })
                                }

                            },
                            err => console.log('Error saving image to gallery ', err)
                        );
                    }, 500)
                }
            }
        }
    }
    gotoXuCanvasPage(){
        this.navCtrl.push(XuCanvasPage, {
            FramGuid: this.guid,
            type: this.stp,
            backs:this.backsss
        });
    }
    backsss = (_params) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.qianImg = _params;
            resolve();
        });
    };
    gotoFenPage(ele){
        if(ele==2){
            this.navCtrl.pop();
            this.navCtrl.pop();
        }else{
            this.hasQian = true;
        }
    }
    ionViewDidEnter(){
        let self = this;
        if(this.qianImg){
            this.loading = self.loadingCtrl.create({
                content: ''
            });
            this.loading.present();
            this.sqlite.selecTableIDs('InsuredFarmer','FramGuid',this.guid).then(res => {
                self.sqlite.selecTableIDs('DeclareClaimTable','FramGuid',this.guid).then(ress => {
                    self.qianCanvas(res,self.qianImg,ress);
                });
            });
        }
    }
    showthisImg(res) {
        this.photoViewer.show(res);
    }
}
