import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-xu-bao-more',
    templateUrl: 'xu-bao-more.html',
})
export class XuBaoMorePage {
    Chengbaoyuan: string;
    id: string;
    Pin: Array<any>;
    Time: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sql: SqllistServiceProvider, private photoViewer: PhotoViewer) {
        let date = new Date();
        let year = date.getFullYear();
        let mon = date.getMonth() + 1;
        let day = date.getDate();
        this.Time = year + '年' + mon + '月' + day + '日';
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.id = navParams.get('id');
        sql.selecTableIDs('DnowLoadUnderData','FramGuid', this.id)
            .then(res => {

                for(let i = 0;i<res.length;i++){
                    res[i].name.otherUrl = res[i].name.otherUrl.split(',')
                }
                this.Pin = res;
                console.log(res)
            }).catch(e => {
            console.log(e)
        });
    }

    checkPic(src) {
        this.photoViewer.show(src);
    }
}
