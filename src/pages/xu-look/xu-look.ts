import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";

@IonicPage()
@Component({
    selector: 'page-xu-look',
    templateUrl: 'xu-look.html',
})
export class XuLookPage {
    propleID: string;
    Chengbaoyuan: string;
    FramMessage: Array<any>;
    FramChenMessage: Array<any>;
    Time: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqllite: SqllistServiceProvider) {
        this.propleID = navParams.get('peopleID');
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        sqllite.selecTablePeopleID('DnowLoadFarmData', this.propleID)
            .then(res => {
                this.FramMessage = res;
                this.Time = (res[0].name.CreateTime).split(' ')[0];
            }).catch(e => {
            console.log(e)
        });
        sqllite.selecTablePeopleID('DnowLoadUnderData', this.propleID)
            .then(res => {
                this.FramChenMessage = res;
            }).catch(e => {
            console.log(e)
        });
    }
}
