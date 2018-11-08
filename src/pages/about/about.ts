import { ENV } from './../../config/environment';
import { Component, NgZone } from '@angular/core';
import {
    AlertController, IonicPage, LoadingController, NavController, NavParams,
    ToastController
} from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { File } from '@ionic-native/file';
import { FileOpener } from "@ionic-native/file-opener";

@IonicPage()
@Component({
    selector: 'page-about',
    templateUrl: 'about.html',
})
export class AboutPage {
    version: string;
    fileTransfer: FileTransferObject = this.transfer.create();

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private transfer: FileTransfer, private file: File, private fileOpener: FileOpener,public alertCtrl: AlertController,public ngzone:NgZone) {
        this.version = window['VERSION'];
    }

    checkUpdate() {
        let text = "正在检测更新..."
        let loader = this.loadingCtrl.create({
            content: text,
        });
        loader.present();
        this.http.get(`${ENV.WEB_URL}AppVersion`).subscribe(res => {
            if (res.Status) {
                if (window['VERSION'] < res.MyObject) {
                    loader.dismiss();
                    let confirm = this.alertCtrl.create({
                        title: '提示',
                        message: '是否更新',
                        buttons: [
                            {
                                text: '取消',
                                handler: () => {
                                }
                            },
                            {
                                text: '确定',
                                handler: () => {
                                    let texts="已下载 0%";
                                    let loaders = this.loadingCtrl.create({
                                        content: texts
                                    });
                                    loaders.present();
                                    this.http.get(`http://api.fir.im/apps/5a154df9959d6903b5000196/download_token?api_token=5c3ec780d29fcc95ce763463ca256c31`).subscribe(message => {
                                        if (message.download_token) {
                                            let targetPath = this.file.externalApplicationStorageDirectory + 'impicc5a154df9959d6903b5000196.apk';
                                            let url = `http://download.fir.im/apps/5a154df9959d6903b5000196/install?download_token=${message.download_token}`;
                                            let xml = new XMLHttpRequest();
                                            xml.open('GET', url, true);
                                            xml.send(null);
                                            xml.onreadystatechange = () => {
                                                if (xml.readyState == 2) {
                                                    url = xml.responseURL;
                                                    this.fileTransfer.download(url, targetPath).then((entry) => {
                                                        this.fileOpener.open(targetPath, 'application/vnd.android.package-archive')
                                                            .then(() => console.log('File is opened'))
                                                            .catch(e => console.log('Error openening file', e));
                                                    }, (error) => {
                                                        console.log(error);
                                                    });
                                                    this.fileTransfer.onProgress(lis => {
                                                        let math = Math.floor((lis.loaded / lis.total) * 100);
                                                        this.ngzone.run(()=>{
                                                            loaders.setContent(`已下载 ${math}%`);
                                                        });
                                                        if (lis.loaded == lis.total) {
                                                            loaders.dismiss();
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                        ]
                    });
                    confirm.present();
                } else {
                    loader.dismiss();
                    let toast = this.toastCtrl.create({
                        message: '当前版本是最新的！',
                        duration: 1500,
                        position: 'top'
                    });
                    toast.present();
                }
            } else {
                loader.dismiss();
                let toast = this.toastCtrl.create({
                    message: res.Message,
                    duration: 1500,
                    position: 'top'
                });
                toast.present();
            }
        })
    }
}
