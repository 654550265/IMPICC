import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-choose-farm',
    templateUrl: 'choose-farm.html',
})
export class ChooseFarmPage {
    type: any;
    defpage: string;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.type = this.navParams.get('type');
        this.defpage = this.navParams.get('defpage');
    }

    nextoperation(index) {
        if (index == 1) {//个体投保
            this.navCtrl.push('ChooseFarm0Page', {
                type: index,
                defpage: this.defpage
            });
            return
        }
        if (index == 2) {//企业投保
            this.navCtrl.push('ChooseFarm1Page', {
                type: index,
                defpage: this.defpage
            });
            return
        }
        if (index == 3) {//团队信息录入
            this.navCtrl.push('TeamPage', {
                type: index
            });
            return
        }
        if (index == 4) {//个人信息录入
            this.navCtrl.push('ChooseFarm3Page', {
                type: index
            });
            return
        }
    }
}
