import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";

/**n
 * Generated class for the DetailAnimalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-animal',
  templateUrl: 'detail-animal.html',
})
export class DetailAnimalPage {
    lhGuid: string;
    lipeiyuan:string;
    lists: object;
    Scene: Array<any>;
    Harmless: Array<any>;
    ForDie: string;
    Other: Array<any>;
    DieMessage: string;
    idCard: string;
    constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SqllistServiceProvider,private photoViewer: PhotoViewer) {
        let self = this;
        this.lhGuid = this.navParams.get('lhGuid');
        this.idCard = this.navParams.get('idCard');
        this.lipeiyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.sqlite.selecTableIDs('DeclareClaimTable','lhGuid',this.lhGuid).then(res=>{
            self.lists = res[0].name;
            self.Scene = res[0].name.Scene.split(',');
            self.Harmless = res[0].name.Harmless.split(',');
            self.ForDie = res[0].name.ForDie;
            self.Other = res[0].name.Other.split(',');
            self.DieMessage = res[0].name.DieMessage.split(',')[1]
        })
    }
    looks(ele){
        this.photoViewer.show(ele);
    }

}
