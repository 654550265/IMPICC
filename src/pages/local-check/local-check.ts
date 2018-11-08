import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-local-check',
    templateUrl: 'local-check.html',
})
export class LocalCheckPage {
    id: number;
    list: Array<any>;
    lists: Array<any>;
    lipeiyuan: string;
    imgArr: Array<any>;
    Time: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SqllistServiceProvider,private photoViewer: PhotoViewer) {
        this.id = navParams.get('id');
        this.lipeiyuan = JSON.parse(localStorage.getItem('user')).RealName;
        let self = this;
        console.log(this.id,'1')
        this.sqlite.selecTableIDs('InsuredFarmer','FramGuid', this.id)
            .then(res => {
                console.log(res,'2')
                self.list = [];
                self.list.push(res[0].name);
                self.imgArr = res[0].name.vaccinationCertificateImgs.split(',');
                let st = res[0].name.CreateTime.split('/');
                self.Time = st[0]+'/'+st[1]+'/'+st[2];
                console.log(this.list);
            }).catch(e => {
            console.log(e)
        })
        this.sqlite.selectTableAll('InsuredFarmer').then(data=>{
            console.log(data,'3')
        })
        this.sqlite.selecTableIDs('DeclareClaimTable','FramGuid', this.id)
            .then(res => {
                self.lists =res;
            }).catch(e => {
            console.log(e)
        })
    }
    looks(item){
        this.photoViewer.show(item);
    }
    loos(index,item){
        switch (index){
            case 1:
                this.photoViewer.show(this.list[item].Scene);
                break;
            case 2:
                this.photoViewer.show(this.list[item].Harmless);
                break;
            case 3:
                this.photoViewer.show(this.list[item].ForDie);
                break;
        }
    }
    goToAnimal(index){
        console.log(this.list)
        this.navCtrl.push('DetailAnimalPage', {
            lhGuid: this.lists[index].name.lhGuid,
            idCard: this.list[0].idCard
        });
    }
}
