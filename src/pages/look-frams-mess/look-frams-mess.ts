import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@IonicPage()
@Component({
    selector: 'page-look-frams-mess',
    templateUrl: 'look-frams-mess.html',
})
export class LookFramsMessPage {
    obj: any;
    Chengbaoyuan: string;
    chengbaolist: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public photoViewer: PhotoViewer, public sqlite: SqllistServiceProvider, public comm: CommonServiceProvider) {
        this.obj = this.navParams.get('FramList');
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.sqlite.selecTableIDs('Underwriting', 'FramGuid', this.obj.qiyeGuid).then(res => {
            let list = [];
            for (let i = 0; i < res.length; i++) {
                if (res[i].name.FramPeopleId == this.obj.FramPeopleID) {
                    for (let key in res[i].name) {
                        if (key !== 'OtherPicUrl') {
                            res[i].name[key] = this.comm.getText(res[i].name[key]);
                        }
                    }
                    list.push(res[i])
                }
            }
            this.chengbaolist = list;
        }).catch(err => {
            console.log(err);
        });
    }

    look(src) {
        this.photoViewer.show(src);
    }
}
