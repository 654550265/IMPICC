import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-look-team-mess',
    templateUrl: 'look-team-mess.html',
})
export class LookTeamMessPage {
    FramGuid: string;
    Chengbaoyuan: string;
    Time: string;
    FramMessage: Array<any>;
    FramList: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqllite: SqllistServiceProvider, public comm: CommonServiceProvider, private photoViewer: PhotoViewer) {
        this.FramGuid = this.navParams.get('FramGuid');
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.sqllite.selecTableIDs('inframmessage', 'FramGuid', this.FramGuid).then(res => {
            this.Time = res[0].name.createtime;
            for (let i = 0; i < res.length; i++) {
                for (let key in res[i].name) {
                    res[i].name[key] = this.comm.getText(res[i].name[key]);
                }
            }
            this.FramMessage = res;
            this.FramList = JSON.parse(res[0].name.farmsmessage);
        }).catch(err => {
            console.log(err);
        });
    }

    gotoLookPage(index) {
        this.navCtrl.push('LookFramsMessPage', {
            FramList: this.FramList[index]
        })
    }

    look(src) {
        this.photoViewer.show(src);
    }
}
