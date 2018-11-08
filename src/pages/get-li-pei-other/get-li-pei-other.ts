import { Component } from '@angular/core';
import { IonicApp, IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@IonicPage()
@Component({
    selector: 'page-get-li-pei-other',
    templateUrl: 'get-li-pei-other.html',
})
export class GetLiPeiOtherPage {
    callback: any;
    num: Array<any>;
    boo: boolean;
    Src: string;
    myType: any;
    xiu: string;
    mys: number;
    titles: string;
    activePortal: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private photoViewer: PhotoViewer, public ionicApp: IonicApp,public comm:CommonServiceProvider) {
        this.callback = navParams.get('callback');
        this.num = navParams.get('OtherPic');
        this.boo = false;
        this.myType = navParams.get('myType');
        this.titles = '其他图片';
        if(navParams.get('titles')){
            this.titles = navParams.get('titles');
        }
    }

    ionViewDidLoad() {
        this.activePortal = this.ionicApp._modalPortal.getActive();
    }
    ionViewWillEnter(){
        setTimeout(() => {
            this.activePortal.onDidDismiss(() => {
                this.callback(this.num,this.myType);
            });
        }, 500);
    }

    back() {
        this.callback(this.num,this.myType).then(() => {
            this.navCtrl.pop();
        });
    }

    takePhoto() {
        this.comm.chooseImage(1).then(res=>{
            this.num.push(res);
        })
        // this.navCtrl.push('')
    }

    lookBig(index) {
        this.photoViewer.show(this.num[index]);
    }

    hide() {
        this.boo = false;
    }
    faa(ele){
        this.num.splice(ele,1);

    }
}
