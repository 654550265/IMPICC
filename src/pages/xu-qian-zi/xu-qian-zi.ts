import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { XuCanvasPage } from "../xu-canvas/xu-canvas";

@IonicPage()
@Component({
    selector: 'page-xu-qian-zi',
    templateUrl: 'xu-qian-zi.html',
})
export class XuQianZiPage {

    propleID: string;
    FramMessage: Array<any>;
    FramChenMessage: Array<any>;
    Time: string;
    Chengbaoyuan: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqllite: SqllistServiceProvider) {
        this.propleID = navParams.get('peopleID');
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        sqllite.selecTableIDs('DnowLoadFarmData', 'FramGuid',this.propleID)
            .then(res => {
                this.FramMessage = res;
                this.Time = (res[0].name.CreateTime).split(' ')[0];
            }).catch(e=>{console.log(e)});
        sqllite.selecTableIDs('DnowLoadUnderData','FramGuid', this.propleID)
            .then(res => {
                this.FramChenMessage = res;
            }).catch(e=>{console.log(e)});
    }

    gotoXuCanvasPage() {
        this.navCtrl.push(XuCanvasPage, {
            peopleID: this.propleID
        });
    }
}
