import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";

/**
 * Generated class for the ModalAgePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-age',
  templateUrl: 'modal-age.html',
})
export class ModalAgePage {

    callback:any;
    num:Array<string>;
    boo: boolean;
    Src: string;
    constructor(public navCtrl: NavController, public navParams: NavParams,private camera: Camera) {
        //this.num=[];
        this.callback=navParams.get('callback');
        this.num=navParams.get('OtherPic');
    }

    back(){
        this.callback(this.num).then(()=>{
            this.navCtrl.pop();
        });
    }
    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };
    takePhoto(){
        this.camera.getPicture(this.options).then((imageData) => {
            let base64Image = imageData;
            this.num.push(base64Image);
        }, (err) => {});
    }
    lookBig(index) {
        this.boo = true;
        this.Src = this.num[index];
        let bigImg = window.document.getElementsByClassName('bigImgImg')[0];
        setTimeout(()=>{
            bigImg['style'].marginTop = -(bigImg.clientHeight/2) + 'px';
        },500);
    }

    hide() {
        this.boo = false;
    }

}
