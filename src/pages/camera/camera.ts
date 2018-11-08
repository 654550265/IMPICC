import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {
    CameraPreview,
    CameraPreviewPictureOptions,
    CameraPreviewOptions
} from '@ionic-native/camera-preview';
import { Base64ToGallery } from "@ionic-native/base64-to-gallery";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { PhotoLibrary } from "@ionic-native/photo-library";

@IonicPage()
@Component({
    selector: 'page-camera',
    templateUrl: 'camera.html',
})
export class CameraPage {
    img_list: Array<any>;
    last_src: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, private cameraPreview: CameraPreview, private base64ToGallery: Base64ToGallery, private photoViewer: PhotoViewer, private photoLibrary: PhotoLibrary) {
        this.img_list = [];
        this.last_src = 'assets/icon/black.png';
    }

    ionViewDidLoad() {
        let tabs = document.getElementsByClassName('tabbar').item(0);
        tabs['style'].display = 'none';
        const cameraPreviewOpts: CameraPreviewOptions = {
            x: 0,
            y: 0,
            width: window.screen.width,
            height: window.screen.height,
            camera: 'rear',
            tapPhoto: true,
            previewDrag: true,
            toBack: true,
            alpha: 1
        };

        this.cameraPreview.startCamera(cameraPreviewOpts).then((res) => {

            },
            (err) => {
                console.log(err)
            });
    }

    takePhotos() {
        const pictureOpts: CameraPreviewPictureOptions = {
            width: 800,
            height: 800,
            quality: 85
        };
        this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
            let img = 'data:image/png;base64,' + imageData;
            this.base64ToGallery.base64ToGallery(img, {prefix: '_img'}).then(
                res => {
                    let src = 'file://' + res;
                    this.last_src = src;
                    this.photoLibrary.saveImage(src, "impicc").then(res => {
                        console.log(res);
                    }).catch(err => {
                        console.log(err)
                    })
                },
                err => {

                    console.log('Error saving image to gallery ', err)
                }
            );
        }, (err) => {
            console.log(err);
        });
    }

    changess() {
        this.cameraPreview.switchCamera();
    }

    closePage() {
        this.navCtrl.pop();
    }

    ionViewWillLeave() {
        let tabs = document.getElementsByClassName('tabbar').item(0);
        tabs['style'].display = 'flex';
        this.cameraPreview.stopCamera();
    }

    preview() {
        if (this.last_src != "assets/icon/black.png") {
            this.photoViewer.show(this.last_src)
        }
    }
}
