import { Component, ViewChild } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { SignaturePad } from "angular2-signaturepad/signature-pad";
import { Base64ToGallery } from "@ionic-native/base64-to-gallery";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";

@Component({
    selector: 'page-canvas',
    templateUrl: 'canvas.html',
})
export class CanvasPage {
    @ViewChild(SignaturePad) signaturePad: SignaturePad;
    isEmpty = true;
    imageData: string;
    width: number;
    height: number;
    peopeleID: string;
    callback: any;
    signaturePadOptions: Object = {
        'minWidth': 3,
        'canvasWidth': 500,
        'canvasHeight': 300
    };

    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private base64ToGallery: Base64ToGallery, public sqlite: SqllistServiceProvider, public comm: CommonServiceProvider) {
        this.peopeleID = navParams.get('peopleID');
        this.callback = navParams.get('callback');
    }

    ionViewDidLoad() {
        this.width = window.document.documentElement.getBoundingClientRect().width;
        this.height = window.document.documentElement.getBoundingClientRect().height - 104;
        this.signaturePad.set('canvasWidth', this.width);
        this.signaturePad.set('canvasHeight', this.height);
        this.signaturePad.clear();
    }

    drawComplete() {
        this.isEmpty = true;
    }

    drawStart() {
    }

    saveImg() {
        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '保存前请确认签名是否正确',
            buttons: [
                {
                    text: '去检查',
                    handler: () => {
                    }
                },
                {
                    text: '保存',
                    handler: () => {
                        this.imageData = this.signaturePad.toDataURL();
                        this.base64ToGallery.base64ToGallery(this.imageData, {prefix: '_img'}).then(
                            (res) => {
                                let imgSrc = 'file://' + res;
                                this.sqlite.upData('inframmessage', imgSrc, this.peopeleID)
                                    .then(res => {
                                        this.comm.toast('保存成功');
                                        this.callback(imgSrc).then(()=>{
                                            this.navCtrl.pop();
                                            this.navCtrl.pop();
                                        })
                                    })
                            },
                            (err) => {
                                console.log('Error saving image to gallery ', err);
                            }
                        );
                    }
                }
            ]
        });
        confirm.present();
    }

    emptys() {
        this.signaturePad.clear();
    }
}
