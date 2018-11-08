import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-more-message',
    templateUrl: 'more-message.html',
})
export class MoreMessagePage {
    id: string;
    list: any;
    Pin: Array<any>;
    Chengbaoyuan: string;
    imgUrl: string;
    Time: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public loadCtrl: LoadingController, private photoViewer: PhotoViewer) {
        let loader = this.loadCtrl.create({
            content: "",
            duration: 3000
        });
        let self = this;
        loader.present();
        this.imgUrl = ENV.IMG_URL;
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.id = navParams.get('id');
        http.get(`${ENV.WEB_URL}GetAuditRecordDetail?auditStatus=1&id=${this.id}`).subscribe(res => {
            loader.dismiss();
            if (res.Status) {
                console.log(res)
                self.list = res.MyObject;
                self.Time = self.list['CreateTime'].split(' ')[0];
                self.Pin = res.MyObject.pins;
                // if (res.MyObject) {
                //     let AnimtalList = JSON.parse(localStorage.getItem("AnimtalList"));
                //
                //     for (let i = 0; i < res.MyObject.pins.length; i++) {
                //         for (let j = 0; j < AnimtalList.length; j++) {
                //             if (res.MyObject[0].pins[i].AnimalType == AnimtalList[j].AnimtalType) {
                //                 res.MyObject[0].pins[i].AnimalType=AnimtalList[j].AnimtalTypeName
                //             }
                //         }
                //     }
                //     this.Pin = res.MyObject[0].pins;
                // }
            }
        });
    }

    checkPic(src) {
        this.photoViewer.show(src);
    }
}
