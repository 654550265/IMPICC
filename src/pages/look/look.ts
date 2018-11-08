import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@IonicPage()
@Component({
    selector: 'page-look',
    templateUrl: 'look.html',
})
export class LookPage {
    FramGuid: string;
    FramMessage: Array<any>;
    FramChenMessage: Array<any>;
    other: Array<any>;
    Chenother: Array<any>;
    Chengbaoyuan: string;
    Time: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqllite: SqllistServiceProvider, private photoViewer: PhotoViewer, public comm: CommonServiceProvider) {
        this.FramGuid = this.navParams.get('FramGuid');
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.sqllite.selecTableIDs('inframmessage', 'FramGuid', this.FramGuid).then(res => {
            this.Time = res[0].name.createtime;
            for (let i = 0; i < res.length; i++) {
                for (let key in res[i].name) {
                    if (key != 'OtherPicUrl') {
                        res[i].name[key] = this.comm.getText(res[i].name[key]);
                    }
                }
            }
            this.FramMessage = res;
            this.other = res[0].name.OtherPicUrl ? res[0].name.OtherPicUrl.split(',') : [];
        }).catch(err => {
            console.log(err);
        });
        this.sqllite.selecTableIDs('Underwriting', 'FramGuid', this.FramGuid).then(res => {
            for (let i = 0; i < res.length; i++) {
                for (let key in res[i].name) {
                    if (key != 'OtherPicUrl') {
                        res[i].name[key] = this.comm.getText(res[i].name[key]);
                    }
                }
            }
            this.FramChenMessage = res;
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }

    look(src) {
        this.photoViewer.show(src);
    }

    looks(src) {
        this.photoViewer.show(src);
    }
}
