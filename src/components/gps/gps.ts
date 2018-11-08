import { Component, Output } from '@angular/core';
import { LoadingController, ToastController } from "ionic-angular";

declare let baidu_location: any;

@Component({
    selector: 'gps',
    templateUrl: 'gps.html'
})
export class GpsComponent {
    @Output() lat: number;
    @Output() long: number;

    constructor(public loadingCtrl: LoadingController, private toastCtrl: ToastController) {

    }

    ngOnInit(){
        this.Refresh();
    }

    Refresh() {
        let loading = this.loadingCtrl.create({
            content: '定位中...'
        });
        loading.present();
        this.getCurrentPosition().then(position => {
            loading.dismiss();
            if(position.locType === 67){
                let toast = this.toastCtrl.create({
                    message: "离线定位失败，请检查定位权限是否打开",
                    duration: 3000,
                    position: 'top'
                });
                toast.present();
            }else{
                this.lat = position.latitude;
                this.long = position.longitude;
                localStorage.setItem("GPS", `${this.lat},${this.long}`);
            }
            console.log(position);
        }).catch((error) => {
            loading.dismiss();
        });
    }

    getCurrentPosition(): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            function successCallback(position) {
                resolve(position);
            }

            function failedCallback(error) {
                reject(error.describe);
            }

            baidu_location.getCurrentPosition(successCallback, failedCallback);
        });
        return promise;
    }
}
