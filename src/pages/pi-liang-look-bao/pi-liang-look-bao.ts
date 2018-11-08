import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-pi-liang-look-bao',
    templateUrl: 'pi-liang-look-bao.html',
})
export class PiLiangLookBaoPage {
    FramGuid: string;
    FramMessage: Array<any>;
    FramChenMessage: Array<any>;
    Chengbaoyuan: string;
    Time: string;
    otherpiclist: Array<any>;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqllite: SqllistServiceProvider, public comm: CommonServiceProvider, public photoViewer: PhotoViewer) {
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
        })
        this.sqllite.selecTableIDs('PiliangUnderwriting', 'FramGuid', this.FramGuid).then(res => {
            for (let i = 0; i < res.length; i++) {
                for (let key in res[i].name) {
                    if (key != 'AnimalsotherUrl') {
                        res[i].name[key] = this.comm.getText(res[i].name[key]);
                    } else {
                        res[i].name[key] = res[i].name[key].split(',');
                    }
                    if (key == 'AnimalList') {
                        res[i].name[key] = JSON.parse(res[i].name[key]);
                        for (let p = 0; p < res[i].name[key].length; p++) {
                            for (let keys in res[i].name[key][i]) {
                                if (keys == 'OtherPicss') {
                                    res[i].name[key][p][keys] = res[i].name[key][p][keys].split(',');
                                }
                            }
                        }
                    }
                }
            }
            this.FramChenMessage = res;
        })
    }

    look(index, item) {
        switch (index) {
            case 1:
                this.photoViewer.show(this.FramMessage[item].name.FramIDFontUrl);
                break;
            case 2:
                this.photoViewer.show(this.FramMessage[item].name.FramIDBackUrl);
                break;
            case 3:
                this.photoViewer.show(this.FramMessage[item].name.BankCardUrl);
                break;
            case 4:
                this.photoViewer.show(this.FramMessage[item].name.jgdmUrl);
                break;
            case 5:
                this.photoViewer.show(this.FramMessage[item].name.fyzgzUrl);
                break;
        }
    }

    looks(index, item) {
        switch (index) {
            case 1:
                this.photoViewer.show(this.FramChenMessage[item].name.Animals1Url);
                break;
            case 2:
                this.photoViewer.show(this.FramChenMessage[item].name.Animals2Url);
                break;
            case 3:
                this.photoViewer.show(this.FramChenMessage[item].name.Animals3Url);
                break;
            case 4:
                this.photoViewer.show(item);
                break;
        }
    }

    lookss(src) {
        this.photoViewer.show(src);
    }
}
