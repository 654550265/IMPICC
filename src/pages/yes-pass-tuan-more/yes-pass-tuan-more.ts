import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ENV } from "../../config/environment";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-yes-pass-tuan-more',
    templateUrl: 'yes-pass-tuan-more.html',
})
export class YesPassTuanMorePage {
    farm: Array<any>;
    pins: Array<any>;
    Chengbaoyuan: string;
    E: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private photoViewer: PhotoViewer) {
        this.farm = [];
        this.pins = [];
        this.farm.push(this.navParams.get('farm'));
        this.pins = this.navParams.get('pins');
        this.E = ENV.IMG_URL;
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
    }

    lookImage(src) {
        this.photoViewer.show(`${this.E + src}`);
    }
}
