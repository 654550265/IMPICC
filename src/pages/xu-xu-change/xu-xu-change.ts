import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@IonicPage()
@Component({
    selector: 'page-xu-xu-change',
    templateUrl: 'xu-xu-change.html',
})
export class XuXuChangePage {

    propleID: string;
    FramMessage: Array<any>;
    FramChenMessage: Array<any>;
    Time: string;
    Chengbaoyuan: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public sqllite: SqllistServiceProvider, private camera: Camera, public comm: CommonServiceProvider, public loadingCtrl: LoadingController) {
        this.propleID = navParams.get('peopleID');
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        sqllite.selecTablePeopleID('DnowLoadFarmData', this.propleID)
            .then(res => {
                this.FramMessage = res;
                this.FramMessage[0]['form'] = {};
                this.Time = (res[0].name.CreateTime).split(' ')[0];
            }).catch(e => {
            console.log(e)
        });
        sqllite.selecTablePeopleID('DnowLoadUnderData', this.propleID)
            .then(res => {
                this.FramChenMessage = res.map((item) => {
                    item.form = {};
                    return item;
                });
            }).catch(e => {
            console.log(e)
        });
    }

    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    font(index) {
        this.camera.getPicture(this.options).then((imageData) => {
            let base64Image = imageData;
            this.FramMessage[index].form.idfrontUrl = base64Image;
        }, (err) => {
        });
    }

    backFont(index) {
        this.camera.getPicture(this.options).then((imageData) => {
            let base64Image = imageData;
            this.FramMessage[index].form.idbackUrl = base64Image;
        }, (err) => {
        });
    }

    Bank(index) {
        this.camera.getPicture(this.options).then((imageData) => {
            let base64Image = imageData;
            this.FramMessage[index].form.bankUrl = base64Image;
        }, (err) => {
        });
    }

    buwei(index) {
        this.camera.getPicture(this.options).then((imageData) => {
            let base64Image = imageData;
            this.FramChenMessage[index].form.positonUrl = base64Image;
        }, (err) => {
        });
    }

    zhengmian(index) {
        this.camera.getPicture(this.options).then((imageData) => {
            let base64Image = imageData;
            this.FramChenMessage[index].form.frontUrl = base64Image;
        }, (err) => {
        });
    }

    zouMian(index) {
        this.camera.getPicture(this.options).then((imageData) => {
            let base64Image = imageData;
            this.FramChenMessage[index].form.leftUrl = base64Image;
        }, (err) => {
        });
    }

    youmian(index) {
        this.camera.getPicture(this.options).then((imageData) => {
            let base64Image = imageData;
            this.FramChenMessage[index].form.rightUrl = base64Image;
        }, (err) => {
        });
    }

    saveBtnSave() {
        this.sqllite.updateFarmMessage('DnowLoadFarmData', this.FramMessage[0].name, this.FramMessage[0].form)
            .then(res => {
            }).catch(e => {
            console.log(e)
        });
        for (let i = 0; i < this.FramChenMessage.length; i++) {
            this.sqllite.updateFarmMessage('DnowLoadUnderData', this.FramChenMessage[i].name, this.FramChenMessage[i].form)
                .then(res => {
                }).catch(e => {
                console.log(e)
            });
        }
    }
}
