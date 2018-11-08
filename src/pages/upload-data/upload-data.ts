import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-upload-data',
    templateUrl: 'upload-data.html',
})
export class UploadDataPage {

    names: Array<String>;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.names = ["test1", "test2", "test3"];
    }
    gotoFangYiUpload(){
        this.navCtrl.push('FangYiZhengPage');
    }
}
