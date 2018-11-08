import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { PhotoViewer } from "@ionic-native/photo-viewer";


@IonicPage()
@Component({
    selector: 'page-is-pass-more',
    templateUrl: 'is-pass-more.html',
})
export class IsPassMorePage {

    id: string;
    FramMessage: any;
    FramChenMessage: Array<any>;
    Chengbaoyuan: string;
    Time: string;
    auditStaus: number;
    E: any;
    DieMessage: Array<any>;
    img1:string;
    img2:string;
    img3:string;
    img4:string;
    img5:string;
    img6:Array<any>;
    allImg: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public loadingCtrl: LoadingController,private photoViewer: PhotoViewer) {
        let self = this;
        let loader = this.loadingCtrl.create({
            content: "加载中...",
            duration: 3000
        });
        loader.present();
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
        this.Time = year+'-'+month+'-'+strDate;
        this.id = this.navParams.get('id');
        this.auditStaus = this.navParams.get('auditStaus');
        this.E = ENV.IMG_URL;
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.http.get(`${ENV.WEB_URLs}GetLpRecordDetails?ids=${this.id}&auditStatus=${this.auditStaus}`)
            .subscribe(res => {
                if (res.Status) {
                    let farmImgs = res.MyObject[0].farmer.farmImgs;
                    let arr = [];
                    self.img1 = '';self.img2 = '';self.img3 = '';self.img4='';self.img5='';self.img6=[];
                    for(let i = 0;i<farmImgs.length;i++){
                        switch (farmImgs[i].imgType){
                            case 1:
                                self.img1 = farmImgs[i].url;
                                break;
                            case 2:
                                self.img2 = farmImgs[i].url;
                                break;
                            case 4:
                                self.img3 = farmImgs[i].url;
                                break;
                            case 5:
                                self.img4 = farmImgs[i].url;
                                break;
                            case 6:
                                self.img5 = farmImgs[i].url;
                                break;
                            case 7:
                                arr.push(farmImgs[i].url);
                                break;
                        }
                    }
                    self.img6 = arr;
                    this.FramMessage = res.MyObject;
                    this.FramChenMessage = res.MyObject[0].pins;
                    let obj = {Scene:[],harm:[],Die:'',other:[]};
                    let sarr = [];
                    let tarr = [];
                    for(let s = 0;s<res.MyObject[0].pins.length;s++){
                        tarr.push(res.MyObject[0].pins[s].DieMessage.split(',')[1])
                        for(let k = 0;k<res.MyObject[0].pins[s].pinImgs.length;k++){
                            switch (res.MyObject[0].pins[s].pinImgs[k].imgType){
                                case 6:
                                    obj.Scene.push(res.MyObject[0].pins[s].pinImgs[k].url);
                                    break;
                                case 7:
                                    obj.harm.push(res.MyObject[0].pins[s].pinImgs[k].url);
                                    break;
                                case 8:
                                    obj.Die = res.MyObject[0].pins[s].pinImgs[k].url;
                                    break;
                                case 5:
                                    obj.other.push(res.MyObject[0].pins[s].pinImgs[k].url);
                                    break;
                            }
                        }
                        sarr.push(obj);
                    }
                    this.DieMessage = tarr;
                    this.allImg = sarr;
                    loader.dismiss();
                }
            })
    }
    looks(ele){
        this.photoViewer.show(ele);
    }
}
