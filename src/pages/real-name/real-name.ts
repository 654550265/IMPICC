import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { ENV } from "../../config/environment";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
    selector: 'page-real-name',
    templateUrl: 'real-name.html',
})
export class RealNamePage {
    ImageObj1: boolean;
    ImageObj2: boolean;
    ImgSrc1: string;
    ImgSrc2: string;
    province: string;
    city: string;
    area: string;
    village: string;
    provinceList: Array<any>;
    cityList: Array<any>;
    areaList: Array<any>;
    villageList: Array<any>;
    realeName: string;
    peopleID: string;
    PositivePath: string;
    uname: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: AuthServiceProvider, public comm: CommonServiceProvider, private camera: Camera, public loadingCtrl: LoadingController, public transfer: FileTransfer, public file: File) {
        this.ImageObj1 = false;
        this.ImageObj2 = false;
        this.uname = JSON.parse(localStorage.getItem('user')).AccountName;
        this.http.get(`${ENV.WEB_URL}GetAreaTree?pid=`)
            .subscribe(data => {
                if (data.Status) {
                    this.provinceList = data.MyObject;
                    this.provinceList.push({id: '1', name: '请选择'});
                    this.province = "1";
                }
            });
    }

    provinceChange() {
        this.http.get(`${ENV.WEB_URL}GetAreaTree?pid=${this.province}`)
            .subscribe(data => {
                if (data.Status) {
                    this.cityList = data.MyObject;
                    this.cityList.push({id: '1', name: '请选择'});
                    this.city = "1";
                }
            })
    }

    cityChange() {
        this.http.get(`${ENV.WEB_URL}GetAreaTree?pid=${this.city}`)
            .subscribe(data => {
                if (data.Status) {
                    this.areaList = data.MyObject;
                    this.areaList.push({id: '1', name: '请选择'});
                    this.area = "1";
                }
            })
    }

    areaChange() {
        this.http.get(`${ENV.WEB_URL}GetAreaTree?pid=${this.area}`)
            .subscribe(data => {
                if (data.Status) {
                    if (data.MyObject.length == 0) {
                        this.villageList = [{id: "1", name: "请选择"}];
                    } else {
                        this.villageList = data.MyObject;
                        this.villageList.push({id: '1', name: '请选择'});
                        this.village = "1";
                    }
                }
            })
    }

    //保存验证
    fileTransfer: FileTransferObject = this.transfer.create();

    saveAndCheck() {
        if (this.province == undefined || this.province == "1") {
            this.comm.toast('请选择你所在的省');
        } else if (this.city == undefined || this.city == "1") {
            this.comm.toast('请选择你所在的市');
        } else if (this.area == undefined || this.area == "1") {
            this.comm.toast('请选择你所在的县');
        } else if (this.realeName == undefined) {
            this.comm.toast('请输入您的真实姓名');
        } else if (this.peopleID.length != 18) {
            this.comm.toast('身份证长度不正确');
        } else if (this.peopleID == undefined) {
            this.comm.toast('请输入您的身份证号码');
        } else if (!this.ImageObj1) {
            this.comm.toast('请上传证件的正面照');
        } else if (!this.ImageObj2) {
            this.comm.toast('请上传证件的背面照');
        } else {
            this.http.post(`${ENV.WEB_URL}IdentityVerify`, {
                uname: this.uname,
                province: this.province,
                city: this.city,
                county: this.area,
                village: this.village,
                realname: this.realeName,
                idnumber: this.peopleID
            })
                .subscribe(data => {
                    if (data.Status) {
                        let loading = this.loadingCtrl.create({
                            content: '上传中'
                        });
                        loading.present();
                        let messageId = data.MyObject;
                        let options: FileUploadOptions = {
                            fileKey: 'file',
                            fileName: 'name.jpg',
                            headers: {}
                        };
                        setTimeout(() => {
                            this.fileTransfer.upload(`${this.ImgSrc1}`, `${ENV.WEB_URL}UploadIdentityVerifyImg?uname=${this.uname}&id=${messageId}&imgType=1`, options)
                                .then((data) => {
                                    this.fileTransfer.upload(`${this.ImgSrc2}`, `${ENV.WEB_URL}UploadIdentityVerifyImg?uname=${this.uname}&id=${messageId}&imgType=2`, options)
                                        .then((data) => {
                                            let res = JSON.parse(data.response);
                                            if (res.Status) {
                                                loading.dismiss();
                                                this.comm.toast('上传成功');
                                                localStorage.setItem('realnameing','true');
                                                this.navCtrl.pop();
                                            } else {
                                                this.comm.toast(res.Message);
                                            }
                                        }, (err) => {
                                        });
                                }, (err) => {
                                });
                        }, 1000);
                    } else {
                        this.comm.toast(data.Message);
                    }
                });
        }
    }

    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    photo() {
        this.camera.getPicture(this.options).then((imageData) => {
            let base64Image = imageData;
            this.ImgSrc1 = base64Image;
            this.ImageObj1 = true;
        }, (err) => {
        });
    }

    photoFan() {
        this.camera.getPicture(this.options).then((imageData) => {
            let base64Image = imageData;
            this.ImgSrc2 = base64Image;
            this.ImageObj2 = true;
        })
    }
}
