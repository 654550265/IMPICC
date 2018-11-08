import { ClaimDB } from './../../model/Claim-db';
import { InsuredFarmerDB } from './../../model/InsuredFarmer-db';
import { Farmer_db } from './../../model/Farmer_db';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {
    LoadingController,
    ToastController,
    ModalController,
    ActionSheetController,
    AlertController
} from 'ionic-angular';
import { JPushService } from 'ionic2-jpush';
import { Media, MediaObject } from '@ionic-native/media';
import { ENV } from "../../config/environment";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import {
    Farmer_APIDATA,
    Policy_APIDATA,
    Org_APIDATA,
    ManyPolicy_APIDATA,
    InsuredFarmer_APIDATA,
    Claims_APIDATA
} from '../../config/table';
import { Policy_db } from '../../model/Policy_db';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { ManyPolicyDB } from '../../model/ManyPolicy-db';

declare let agoravoice: any;
declare let baidu_location: any;

@Injectable()
export class CommonServiceProvider {
    public regID: string;
    public file: MediaObject;
    public model: any;
    public lat: string;
    public long: string;
    fileTransfer: FileTransferObject = this.transfer.create();

    constructor(public http: Http, public toastCtrl: ToastController, public jpushService: JPushService, public modalCtrl: ModalController, public loadingCtrl: LoadingController, private media: Media, public actionSheetCtrl: ActionSheetController, private camera: Camera, private base64ToGallery: Base64ToGallery, private transfer: FileTransfer, public sql: SqllistServiceProvider, private alertCtrl: AlertController) {

    }

    compare(val1, val2) {
        return val1 && val2 ? val1.id === val2.id : val1 === val2;
    }

    compareId(val1, val2) {
        return val1 && val2 ? val1.Id === val2.Id : val1 === val2;
    }

    compareIT(val1, val2) {
        return val1 && val2 ? val1.TypeId === val2.TypeId : val1 === val2;
    }

    comparePro(val1, val2) {
        return val1 && val2 ? val1.ProjectId === val2.ProjectId : val1 === val2;
    }

    compareTypes(val1, val2) {
        return val1 && val2 ? val1.types === val2.types : val1 === val2;
    }

    newGuid() {
        let guid = "";
        for (let i = 1; i <= 32; i++) {
            let n = Math.floor(Math.random() * 36).toString(36);
            guid += n;
            if ((i == 8) || (i == 16) || (i == 24))
                guid += "-";
        }
        return guid;
    }

    toast(Msg: string) {
        let toast = this.toastCtrl.create({
            message: Msg,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }

    setRegID(newID) {
        this.regID = newID;
    }

    getRegID() {
        return this.regID;
    }

    name: string;

    initPush() {
        this.jpushService.init().then(res => {
            this.jpushService.getRegistrationID()
            .then(res => {
                this.setRegID(res);
                localStorage.setItem('regID', `${res}`);
                this.jpushService.openNotification()
                .subscribe(res => {
                });

                this.jpushService.receiveNotification()
                .subscribe(res => {
                    let data = JSON.parse(res.extras.imobj);
                    if (data.pushType === 0) {
                        let user = JSON.parse(localStorage.getItem('user'));
                        let pwd = localStorage.getItem('pwd');
                        this.http.post(`${ENV.WEB_URL}Login`, {
                            uname: user.AccountName,
                            pwd: pwd
                        }).subscribe(res => {
                            let data = JSON.parse(res['_body']);
                            if (data.Status) {
                                localStorage.setItem('user', JSON.stringify(data.MyObject));
                            }
                        });
                    }
                });

                this.jpushService.receiveMessage()
                .subscribe(res => {
                    let data = JSON.parse(res.extras.imobj);
                    if (data.operateType == 'hangup') {
                        this.stopmp3();
                        localStorage.setItem('calling', 'false');
                        this.closeModal();
                    } else {
                        if (JSON.parse(localStorage.getItem('calling'))) {
                            this.http.get(`${ENV.WEB_URL}PiccImPush?fromUname=${JSON.parse(localStorage.getItem('user')).AccountName}&targetUname=${data.fromUname}&msgType=calling&operateType=dial&fromName=${JSON.parse(localStorage.getItem('user')).RealName}`)
                            .subscribe(res => {
                            })
                        } else {
                            if (data.msgType == 'voice' && data.operateType == 'dial') {
                                localStorage.setItem('calling', 'true');
                                this.name = data.fromName;
                                this.showCallPage(this.name, data.msgType, data.fromUname);
                                this.playmp3('/android_asset/www/assets/waite.mp3');
                            }
                            if (data.msgType == 'video' && data.operateType == 'dial') {
                                localStorage.setItem('calling', 'true');
                                this.name = data.fromName;
                                this.showCallPage(this.name, data.msgType, data.fromUname);
                                this.playmp3('/android_asset/www/assets/waite.mp3');
                            }
                            if (data.msgType == 'videoPC' && data.operateType == 'Connect') {
                                localStorage.setItem('calling', 'true');
                                this.name = data.fromName;
                                this.showCallPage(this.name, data.msgType, data.fromUname);
                                this.playmp3('/android_asset/www/assets/waite.mp3');
                            }
                            if (data.operateType == 'Connect' && data.msgType == 'voice') {
                                if (typeof agoravoice !== 'undefined') {
                                    this.stopmp3();
                                    localStorage.setItem('calling', 'true');
                                    agoravoice.voiceCall(
                                        data.targetUname,
                                        data.fromUname,
                                        (data) => {
                                            if (data === "close") {
                                                localStorage.setItem('calling', 'false');
                                            }
                                        },

                                        (err) => {
                                            console.log(err);
                                        });
                                    this.closeModal();
                                }
                            }

                            if (data.operateType == 'Connect' && data.msgType == 'video') {
                                if (typeof agoravoice !== 'undefined') {
                                    this.stopmp3();
                                    localStorage.setItem('calling', 'true');
                                    agoravoice.videoCall(
                                        data.targetUname,
                                        data.fromUname,
                                        (data) => {
                                            if (data === "close") {
                                                localStorage.setItem('calling', 'false');
                                            }
                                        },

                                        (err) => {
                                            console.log(err);
                                        });
                                    this.closeModal();
                                }
                            }
                        }
                    }

                    if (data.msgType == 'calling') {
                        this.stopmp3();
                        this.toast('对方正在通话中，请稍候在拨');
                        this.closeModal();
                    }
                });
            })
            .catch(err => {
                this.initPush();
            })
        });
    }

    callModal: any;

    showCallPage(realname, types, uname) {
        this.callModal = this.modalCtrl.create('WaiteVioPage', {
            realname: realname,
            type: types,
            unames: uname,
        });
        this.callModal.present();
    }

    closeModal() {
        if (this.callModal) {
            this.callModal.dismiss();
        }
        if (this.model) {
            this.model.dismiss();
        }
    }

    answer() {
        this.stopmp3();
    }

    hangup() {
        this.stopmp3();
    }

    mp3Interval: any;

    mp3(src) {
        this.file = this.media.create(src);//'/android_asset/www/assets/picc.mp3'
        this.file.onStatusUpdate.subscribe(status => console.log(status));
        this.file.onSuccess.subscribe(() => console.log('Action is successful'));
        this.file.onError.subscribe(error => console.log('Error!', error));
        this.file.play();
    }

    playmp3(src) {
        this.mp3(src);
        this.mp3Interval = setInterval(() => {
            this.mp3(src);
        }, 8000);
    }

    stopmp3() {
        clearInterval(this.mp3Interval);
        this.file.stop();
    }

    D_o_B(str) {
        let num = 0;
        let len = str.length;
        str = this.reverselh(str);
        for (let i = 0; i < len; i++) {
            let b = str.charAt(i);
            if (b != "0") {
                num += Math.pow(2, i)
            }
        }
        return num;
    };

    reverselh(code) {
        let codeArr = code.split("");
        codeArr = codeArr.reverse();
        return codeArr.join("")
    };

    rfidDecode = function (code, type) {
        code = code.replace(":FDXB=", "");
        type = type ? type : "ISO11784";
        let H_o_B = {
            "0": "0000",
            "1": "0001",
            "2": "0010",
            "3": "0011",
            "4": "0100",
            "5": "0101",
            "6": "0110",
            "7": "0111",
            "8": "1000",
            "9": "1001",
            "a": "1010",
            "b": "1011",
            "c": "1100",
            "d": "1101",
            "e": "1110",
            "f": "1111"
        };
        switch (type) {
            case "ISO11784":
                code = code.toLowerCase();
                code = code.substr(0, 16);
                let codestr = "";
                let stringArr = [];
                for (let i = 0; i < code.length;) {
                    let str = H_o_B[code.charAt(i)] + H_o_B[code.charAt(i + 1)];
                    stringArr.push(str);
                    i += 2
                }

                stringArr = stringArr.reverse();
                codestr = stringArr.join("");
                let aid_0 = codestr.substr(0, 1);
                aid_0 = this.D_o_B(aid_0) + "";
                let aid_1 = codestr.substr(1, 3);
                aid_1 = this.D_o_B(aid_1) + "";
                let aid_2 = codestr.substr(4, 5);
                aid_2 = this.D_o_B(aid_2) + "";
                let aid_3 = codestr.substr(9, 6);
                aid_3 = this.D_o_B(aid_3) + "";
                let aid_4 = codestr.substr(15, 1);
                aid_4 = this.D_o_B(aid_4) + "";
                let aid_5 = codestr.substr(16, 10);
                aid_5 = this.D_o_B(aid_5) + "";
                let aid_6 = codestr.substr(26, 38);
                aid_6 = this.D_o_B(aid_6) + "";
                code = this.prepend(aid_5, "0", 3) + this.prepend(aid_6, "0", 12);
                break;
            default:
                code = ""
        }
        return code
    };

    ID64Decode(code) {
        code = code.replace(":ID64=", "");
        code = code.replace(/\r\n/g, '');
        return code;
    };

    prepend(code, str, num) {
        if (code.length < num) {
            let len = code.length;
            for (let i = 0; i < num - len; i++) {
                code = str + code
            }
            return code
        } else {
            return code.substr(0, num)
        }
    };

    options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 800,
        targetHeight: 800,
        saveToPhotoAlbum: true
    };

    getCurrentPosition(): Promise<any> {
        let promise = new Promise(resolve => {
            function successCallback(position) {
                resolve(position);
            };

            function failedCallback(error) {
                resolve(error.describe);
            }

            baidu_location.getCurrentPosition(successCallback, failedCallback);
        });
        return promise;
    }

    addZero(res) {
        if (res < 10) {
            return '0' + res;
        } else {
            return res;
        }
    }

    dateFormat(date, format) {

        date = new Date(date);

        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'H+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            'S': date.getMilliseconds()
        };

        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));

        for (let k in o)
            if (new RegExp('(' + k + ')').test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));

        return format;
    }

    changeStartTime(start_time) {
        if (typeof start_time === 'string') {
            let time_lists = start_time.split('-');
            return `${time_lists[0]}-${time_lists[1]}-${(parseInt(time_lists[2]) + 1) < 10 ? '0' + (parseInt(time_lists[2]) + 1) : (parseInt(time_lists[2]) + 1)} 00:00:00`;
        }
    }

    changeEndTime(end_time) {
        if (typeof end_time === 'string') {
            let time_lists = end_time.split('-');
            return `${time_lists[0]}-${time_lists[1]}-${time_lists[2]} 24:00:00`;
        }
    }

    chooseImage(num) {
        let self = this;
        let str = localStorage.getItem("GPS");
        if (str) {
            this.lat = str.split(',')[0];
            this.long = str.split(',')[1];
        } else {
            this.getCurrentPosition().then(position => {
                this.lat = position.latitude;
                this.long = position.longitude;
                localStorage.setItem("GPS", `${this.lat},${this.long}`);
            }).catch((error) => {
            });
        }
        return new Promise(function (resolve, reject) {
            self.options['sourceType'] = 0;
            self.camera.getPicture(self.options).then((imageData) => {
                let canvas = document.createElement('canvas');
                let cxt = canvas.getContext('2d');
                let img = new Image();
                let time = new Date();
                let hour = time.getHours();
                let min = time.getMinutes();
                let seco = time.getSeconds();
                let times = time.getFullYear() + '-' + self.addZero((time.getMonth() + 1)) + '-' + self.addZero(time.getDate()) + ' ' + self.addZero(hour) + '-' + self.addZero(min) + '-' + self.addZero(seco);
                img.src = imageData;
                img.onload = () => {
                    let loading = self.loadingCtrl.create({
                        content: ''
                    });
                    loading.present();
                    canvas.height = img.height;
                    canvas.width = img.width;
                    cxt.fillStyle = '#fff';
                    cxt.fillRect(0, 0, img.width, img.height);
                    cxt.drawImage(img, 0, 0, img.width, img.height, img.width * 0.1, 50, img.width * 0.8, img.height * 0.8);
                    cxt.save();
                    let plx = img.width / 3288;
                    cxt.font = 100 * plx + "px Arial";
                    cxt.fillStyle = '#f00';
                    if (img.width <= img.height) {
                        cxt.fillText('姓名：' + JSON.parse(localStorage.getItem('user')).RealName, img.width * 0.05 + 200, 30);
                        cxt.fillText('操作人：' + JSON.parse(localStorage.getItem('user')).AccountName, img.width * 0.7, 30);
                        cxt.fillText('经度：' + self.long, img.width * 0.05 + 10, img.height * 0.95 - 90 * plx);
                        cxt.fillText('纬度：' + self.lat, img.width * 0.05 + 1400 * plx, img.height * 0.95 - 90 * plx);
                        cxt.fillText('坐标来源：GPS定位结果', img.width * 0.05, img.height * 0.95 + 140 * plx);
                        cxt.fillText('[服务器]拍摄时间：' + times, img.width * 0.05 + 1300 * plx, img.height * 0.95 + 140 * plx);
                    } else {
                        cxt.fillText('姓名：' + JSON.parse(localStorage.getItem('user')).RealName, img.width * 0.05 + 200, 20);
                        cxt.fillText('操作人：' + JSON.parse(localStorage.getItem('user')).AccountName, img.width * 0.7, 20);
                        cxt.fillText('经度：' + self.long, img.width * 0.05 + 10, img.height * 0.95 - 90 * plx);
                        cxt.fillText('纬度：' + self.lat, img.width * 0.05 + 1400 * plx, img.height * 0.95 - 90 * plx);
                        cxt.fillText('坐标来源：GPS定位结果', img.width * 0.05, img.height * 0.95 + 100 * plx);
                        cxt.fillText('[服务器]拍摄时间：' + times, img.width * 0.05 + 1300 * plx, img.height * 0.95 + 100 * plx);
                    }
                    let imgs = new Image();
                    imgs.src = './assets/icon/picca.png';
                    imgs.onload = () => {
                        cxt.drawImage(imgs, 0, 0, 100, 33, 20, 10, 100, 33);
                        cxt.save();
                        let sd = canvas.toDataURL("image/png");

                        self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
                            res => {
                                resolve('file://' + res);
                                loading.dismiss();
                            },
                            err => console.log('Error saving image to gallery ', err)
                        );
                    }


                };
            }, (err) => {
                console.log(err);
            });
            // let actionSheet = self.actionSheetCtrl.create({
            //     buttons: [
            //         {
            //             text: '相册上传',
            //             role: 'destructive',
            //             handler: () => {
            //
            //             }
            //         }, {
            //             text: '拍照上传',
            //             handler: () => {
            //                 self.options['sourceType'] = 1;
            //                 self.camera.getPicture(self.options).then((imageDatas: string) => {
            //                     let canvas = document.createElement('canvas');
            //                     let cxt = canvas.getContext('2d');
            //                     let img = new Image();
            //                     let time = new Date();
            //                     let hour = time.getHours();
            //                     let min = time.getMinutes();
            //                     let seco = time.getSeconds();
            //                     let times = time.getFullYear() + '-' + self.addZero((time.getMonth() + 1)) + '-' + self.addZero(time.getDate()) + ' ' + self.addZero(hour) + '-' + self.addZero(min) + '-' + self.addZero(seco);
            //                     img.src = imageDatas;
            //                     img.onload = () => {
            //                         let loading = self.loadingCtrl.create({
            //                             content: ''
            //                         });
            //                         loading.present();
            //                         canvas.height = img.height;
            //                         canvas.width = img.width;
            //                         cxt.fillStyle = '#fff';
            //                         cxt.fillRect(0, 0, img.width, img.height);
            //                         cxt.drawImage(img, 0, 0, img.width, img.height, img.width * 0.05, 50, img.width * 0.9, img.height * 0.8);
            //                         cxt.save();
            //                         let plx = img.width / 3288;
            //                         cxt.font = 100 * plx + "px Arial";
            //                         cxt.fillStyle = '#f00';
            //                         if (img.width <= img.height) {
            //                             cxt.fillText('姓名：' + JSON.parse(localStorage.getItem('user')).RealName, img.width * 0.05 + 200, 30);
            //                             cxt.fillText('查勤人：' + JSON.parse(localStorage.getItem('user')).AccountName, img.width * 0.7, 30);
            //                             cxt.fillText('经度：' + self.long, img.width * 0.05 + 10, img.height * 0.95 - 90 * plx);
            //                             cxt.fillText('纬度：' + self.lat, img.width * 0.05 + 1400 * plx, img.height * 0.95 - 90 * plx);
            //                             cxt.fillText('坐标来源：GPS定位结果', img.width * 0.05, img.height * 0.95 + 140 * plx);
            //                             cxt.fillText('[服务器]拍摄时间：' + times, img.width * 0.05 + 1300 * plx, img.height * 0.95 + 140 * plx);
            //                         } else {
            //                             cxt.fillText('姓名：' + JSON.parse(localStorage.getItem('user')).RealName, img.width * 0.05, 20);
            //                             cxt.fillText('查勤人：' + JSON.parse(localStorage.getItem('user')).AccountName, img.width * 0.7, 20);
            //                             cxt.fillText('经度：' + self.long, img.width * 0.05 + 10, img.height * 0.95 - 90 * plx);
            //                             cxt.fillText('纬度：' + self.lat, img.width * 0.05 + 1400 * plx, img.height * 0.95 - 90 * plx);
            //                             cxt.fillText('坐标来源：GPS定位结果', img.width * 0.05, img.height * 0.95 + 100 * plx);
            //                             cxt.fillText('[服务器]拍摄时间：' + times, img.width * 0.05 + 1300 * plx, img.height * 0.95 + 100 * plx);
            //                         }
            //                         let imgs = new Image();
            //                         imgs.src = './assets/icon/picca.png';
            //                         imgs.onload = () => {
            //                             cxt.drawImage(imgs, 0, 0, 100, 33, 20, 10, 100, 33);
            //                             cxt.save();
            //                             let sd = canvas.toDataURL("image/png");
            //                             self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
            //                                 res => {
            //                                     resolve('file://' + res);
            //                                     loading.dismiss();
            //                                 },
            //                                 err => console.log('Error saving image to gallery ', err)
            //                             );
            //                         }
            //
            //                     };
            //                 }, (err) => {
            //                 });
            //             }
            //         }, {
            //             text: '取消',
            //             role: 'cancel',
            //             handler: () => {
            //             }
            //         }
            //     ]
            // });
            // actionSheet.present();
        });
    }

    getCanvas(imgUrl) {
        let self = this;
        let str = localStorage.getItem("GPS");
        if (str) {
            this.lat = str.split(',')[0];
            this.long = str.split(',')[1];
        } else {
            this.getCurrentPosition().then(position => {
                this.lat = position.latitude;
                this.long = position.longitude;
                localStorage.setItem("GPS", `${this.lat},${this.long}`);
            }).catch((error) => {
            });
        }
        return new Promise(function (resolve, reject) {
            let canvas = document.createElement('canvas');
            let cxt = canvas.getContext('2d');
            let img = new Image();
            let time = new Date();
            let hour = time.getHours();
            let min = time.getMinutes();
            let seco = time.getSeconds();
            let times = time.getFullYear() + '-' + self.addZero((time.getMonth() + 1)) + '-' + self.addZero(time.getDate()) + ' ' + self.addZero(hour) + '-' + self.addZero(min) + '-' + self.addZero(seco);
            img.src = imgUrl;
            img.onload = () => {
                let loading = self.loadingCtrl.create({
                    content: ''
                });
                loading.present();
                canvas.height = img.height;
                canvas.width = img.width;
                cxt.fillStyle = '#fff';
                cxt.fillRect(0, 0, img.width, img.height);
                cxt.drawImage(img, 0, 0, img.width, img.height, img.width * 0.1, 50, img.width * 0.8, img.height * 0.8);
                cxt.save();
                let plx = img.width / 3288;
                cxt.font = 100 * plx + "px Arial";
                cxt.fillStyle = '#f00';
                if (img.width <= img.height) {
                    cxt.fillText('姓名：' + JSON.parse(localStorage.getItem('user')).RealName, img.width * 0.05 + 200, 30);
                    cxt.fillText('操作人：' + JSON.parse(localStorage.getItem('user')).AccountName, img.width * 0.7, 30);
                    cxt.fillText('经度：' + self.long, img.width * 0.05 + 10, img.height * 0.95 - 90 * plx);
                    cxt.fillText('纬度：' + self.lat, img.width * 0.05 + 1400 * plx, img.height * 0.95 - 90 * plx);
                    cxt.fillText('坐标来源：GPS定位结果', img.width * 0.05, img.height * 0.95 + 140 * plx);
                    cxt.fillText('[服务器]拍摄时间：' + times, img.width * 0.05 + 1300 * plx, img.height * 0.95 + 140 * plx);
                } else {
                    cxt.fillText('姓名：' + JSON.parse(localStorage.getItem('user')).RealName, img.width * 0.05 + 200, 20);
                    cxt.fillText('操作人：' + JSON.parse(localStorage.getItem('user')).AccountName, img.width * 0.7, 20);
                    cxt.fillText('经度：' + self.long, img.width * 0.05 + 10, img.height * 0.95 - 90 * plx);
                    cxt.fillText('纬度：' + self.lat, img.width * 0.05 + 1400 * plx, img.height * 0.95 - 90 * plx);
                    cxt.fillText('坐标来源：GPS定位结果', img.width * 0.05, img.height * 0.95 + 100 * plx);
                    cxt.fillText('[服务器]拍摄时间：' + times, img.width * 0.05 + 1300 * plx, img.height * 0.95 + 100 * plx);
                }
                let imgs = new Image();
                imgs.src = './assets/icon/picca.png';
                imgs.onload = () => {
                    cxt.drawImage(imgs, 0, 0, 100, 33, 20, 10, 100, 33);
                    cxt.save();
                    let sd = canvas.toDataURL("image/png");

                    self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
                        res => {
                            resolve('file://' + res);
                            loading.dismiss();
                        },
                        err => console.log('Error saving image to gallery ', err)
                    );
                }


            };
        });
    }

    getText(text: string) {
        if (typeof text === 'string') {
            if (text.indexOf('&') > -1) {
                let lists = text.split('&');
                return lists[1];
            } else {
                let list = text.split(',');
                if (list.length == 1) {
                    return list[0];
                }
                if (list.length == 2) {
                    return list[1];
                }
                if (list.length == 3) {
                    let str = list[list.length - 1];
                    let newlist = str.split(':');
                    return newlist[1];
                }
                return text;
            }
        } else {
            return text;
        }
    }

    canvasText(str: string, sn: number, sxt: any, x: number, y: number) {
        if (str.length <= sn) {
            sxt.fillText(str, x, y + 24);
        } else {
            let newstr = "";
            for (let i = 0; i < str.length; i += sn) {
                let tmp = str.substring(i, i + sn);
                newstr += tmp + ',';
            }
            let narr = newstr.split(',');
            for (let j = 0; j < narr.length; j++) {
                sxt.fillText(narr[j], x, y + (j + 1) * 20)
            }
        }
    }

    canvasTexts(str: string, sn: number, sxt: any, x: number, y: number) {
        if (str.length <= sn) {
            sxt.fillText(str, x, y);
        } else {
            let newstr = "";
            for (let i = 0; i < str.length; i += sn) {
                let tmp = str.substring(i, i + sn);
                newstr += tmp + ',';
            }
            let narr = newstr.split(',');
            for (let j = 0; j < narr.length; j++) {
                sxt.fillText(narr[j], x, y + (j + 1) * 14 - 23)
            }
        }
    }

    //前面有空格
    canvasTextK(str: string, sn1: number, sn2: number, sxt: any, x: number, y: number, ko: number) {
        if (str.length <= sn1) {
            sxt.fillText(str, x + ko, y + 18);
        } else {
            let newstr = "";
            let n = str.length - sn1;
            let m = parseInt(n / sn2 + '') + 2;
            for (let i = 0; i < m; i++) {
                let tmp = '';
                if (i == 0) {
                    tmp = str.substring(0, sn1);
                } else {
                    tmp = str.substring(sn1 + sn2 * (i - 1), sn1 + sn2 * i);
                }
                newstr += tmp + ',';
            }
            let narr = newstr.split(',');
            for (let j = 0; j < narr.length; j++) {
                if (j == 0) {
                    sxt.fillText(narr[j], x + ko, y + (j + 1) * 18)
                } else {
                    sxt.fillText(narr[j], x, y + (j + 1) * 18)
                }
            }
        }
    }

    //数组对象去重
    arrayUnique2(arr, name) {
        let hash = {};
        return arr.reduce(function (item, next) {
            hash[next[name]] ? '' : hash[next[name]] = true && item.push(next);
            return item;
        }, []);
    }

    NoToChinese(n: any) {
        let unit = "京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
        n += "00";
        let p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p + 1, 2);
        unit = unit.substr(unit.length - n.length);
        for (let i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(兆|万|亿|元)/g, "$1").replace(/(兆|亿)万/g, "$1").replace(/(京|兆)亿/g, "$1").replace(/(京)兆/g, "$1").replace(/(京|兆|亿|仟|佰|拾)(万?)(.)仟/g, "$1$2零$3仟").replace(/^元零?|零分/g, "").replace(/(元|角)$/g, "$1整");
    }

    isRepeat(arr) {
        let hash = {};
        for (let i in arr) {
            if (hash[arr[i]])
                return true;
            hash[arr[i]] = true;
        }
        return false;
    }

    changeTime(strattime, lens) {
        if (typeof strattime == 'string') {
            if (strattime.indexOf(':') > -1) {
                let l = strattime.split(' ');
                let list = l[0].split('-');
                let year = parseInt(list[0]);
                let mon = parseInt(list[1]);
                let len = parseInt(lens);
                if (mon + len > 12) {
                    year++;
                    mon = mon + len - 12;
                } else {
                    mon += len;
                }
                return `${year}-${mon < 10 ? '0' + mon : mon}-${(parseInt(list[2]) - 1) < 10 ? '0' + (parseInt(list[2]) - 1) : (parseInt(list[2]) - 1)} ${l[1]}`;
            } else {
                let list = strattime.split('-');
                let year = parseInt(list[0]);
                let mon = parseInt(list[1]);
                let len = parseInt(lens);
                if (mon + len > 12) {
                    year++;
                    mon = mon + len - 12;
                } else {
                    mon += len;
                }
                return `${year}-${mon < 10 ? '0' + mon : mon}-${list[2]} 24:00:00`;
            }
        }
    }

    DateMinus(sDate, eDate) {
        let sdate = new Date(sDate.replace(/-/g, "/"));
        let end = new Date(eDate.replace(/-/g, "/"));
        let days = end.getTime() - sdate.getTime();
        let dayss = days / 86400000 + '';
        let day = parseInt(dayss);
        return day;
    }

    checkNum(str) {
        let reg = /^\d+(\.\d+)?$/;
        if (reg.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    findOld(data: Array<any>, key: string, value: string) {
        for (let i = 0; i < data.length; i++) {
            if (data[i][key] == value) {
                return data[i];
            }
        }
    }

    /**
     *
     * @description 同步下载所有图片
     * @param {any} arr
     * @returns
     * @memberof CommonServiceProvider
     */
    downloadImgs(arr) {
        let that = this;
        let promises = [];
        let allImgs = [];
        let newImgs = [];

        //获取承保下载接口的所有图片
        for (const item of arr) {
            //把接口数据里的null值数组转换为空数组
            item.Id = item.isPass === 1 ? this.newGuid() : item.Id;
            item.pins = item.pins === null ? [] : item.pins;
            item.batchPins = item.batchPins === null ? [] : item.batchPins;
            item.Farmers = item.Farmers === null ? [] : item.Farmers;
            item.signUrl = item.signUrl === null ? [] : item.signUrl;
            item.OtherImgs = item.OtherImgs === null ? [] : item.OtherImgs;
            item.FarmerImgs = item.FarmerImgs === null ? [] : item.FarmerImgs;
            newImgs[item.Id] = {
                idfrontUrl: item.idfrontUrl,
                idbackUrl: item.idbackUrl,
                bankUrl: item.bankUrl,
                InstitutionCodeImg: item.InstitutionCodeImg,
                VaccinationCertificateImg: item.VaccinationCertificateImg,
                pins: new Array(item.pins.length),
                batchPins: [],
                Farmers: [],
                signUrl: [],
                FarmerImgs: [],
                OtherImgs: []
            };
            allImgs.push({id: item.Id, type: 'farmer', attr: 'idfrontUrl', ImgObj: item.idfrontUrl, nativeUrl: ''});
            allImgs.push({id: item.Id, type: 'farmer', attr: 'idbackUrl', ImgObj: item.idbackUrl, nativeUrl: ''});
            allImgs.push({id: item.Id, type: 'farmer', attr: 'bankUrl', ImgObj: item.bankUrl, nativeUrl: ''});
            allImgs.push({
                id: item.Id,
                type: 'farmer',
                attr: 'InstitutionCodeImg',
                ImgObj: item.InstitutionCodeImg,
                nativeUrl: ''
            });
            allImgs.push({
                id: item.Id,
                type: 'farmer',
                attr: 'VaccinationCertificateImg',
                ImgObj: item.VaccinationCertificateImg,
                nativeUrl: ''
            });
            for (const signUrl of item.signUrl) {
                newImgs[item.Id].signUrl.push(signUrl);
                allImgs.push({
                    id: item.Id,
                    type: 'sign',
                    parent: item.Id,
                    attr: 'signUrl',
                    ImgObj: signUrl,
                    nativeUrl: ''
                });
            }
            for (const OtherImg of item.OtherImgs) {
                newImgs[item.Id].signUrl.push(OtherImg);
                allImgs.push({
                    id: item.Id,
                    type: 'OtherImgs',
                    parent: item.Id,
                    attr: 'OtherImgs',
                    ImgObj: OtherImg,
                    nativeUrl: ''
                });
            }
            for (const pin of item.pins) {
                pin.Id = item.isPass === 1 ? this.newGuid() : pin.Id;
                pin.ParentId = item.isPass === 1 ? item.Id : pin.ParentId;
                let pinobj = {
                    positonUrl: pin.positonUrl === null ? "" : pin.positonUrl,
                    frontUrl: pin.frontUrl === null ? "" : pin.frontUrl,
                    leftUrl: pin.leftUrl === null ? "" : pin.leftUrl,
                    rightUrl: pin.rightUrl === null ? "" : pin.rightUrl,
                    otherUrl: [],
                }
                allImgs.push({
                    id: pin.Id,
                    type: 'pins',
                    parent: item.Id,
                    attr: 'positonUrl',
                    ImgObj: pin.positonUrl,
                    nativeUrl: ''
                });
                allImgs.push({
                    id: pin.Id,
                    type: 'pins',
                    parent: item.Id,
                    attr: 'frontUrl',
                    ImgObj: pin.frontUrl,
                    nativeUrl: ''
                });
                allImgs.push({
                    id: pin.Id,
                    type: 'pins',
                    parent: item.Id,
                    attr: 'leftUrl',
                    ImgObj: pin.leftUrl,
                    nativeUrl: ''
                });
                allImgs.push({
                    id: pin.Id,
                    type: 'pins',
                    parent: item.Id,
                    attr: 'rightUrl',
                    ImgObj: pin.rightUrl,
                    nativeUrl: ''
                });
                for (const other of pin.otherUrl) {
                    pinobj.otherUrl.push(other);
                    allImgs.push({
                        id: item.Id,
                        type: 'other',
                        parent: pin.Id,
                        attr: 'otherUrl',
                        ImgObj: other,
                        nativeUrl: ''
                    });
                }
                newImgs[item.Id].pins[pin.Id] = pinobj;
            }
            for (const batchpin of item.batchPins) {
                batchpin.Id = item.isPass === 1 ? this.newGuid() : batchpin.Id;
                batchpin.ParentId = item.isPass === 1 ? item.Id : batchpin.ParentId;
                let bpinobj = {
                    Animals1Url: "",
                    Animals2Url: "",
                    Animals3Url: "",
                    AnimalsotherUrl: [],
                    PinImgs: [],
                }
                let index = 0;
                for (const Img of batchpin.Imgs) {
                    let attr = "";
                    if (Img.ImgType === 1) {
                        attr = `Animals${++index}Url`;
                        bpinobj[attr] = Img;
                    } else if (Img.ImgType === 2) {
                        attr = "AnimalsotherUrl";
                        bpinobj[attr].push(Img);
                    }
                    allImgs.push({
                        id: item.Id,
                        type: 'batchImg',
                        parent: batchpin.Id,
                        attr: attr,
                        ImgObj: Img,
                        nativeUrl: ''
                    });
                }
                let _pinimgs = [];
                for (const PinImg of batchpin.PinImgs) {
                    _pinimgs[PinImg.Pin] = [];
                }
                for (const PinImg of batchpin.PinImgs) {
                    _pinimgs[PinImg.Pin].push(PinImg);
                }
                for (const key in _pinimgs) {
                    let iterator = _pinimgs[key];
                    let attrs = ['imgOne', 'imgTwo', 'imgThree'];
                    let _pinimg = {
                        OtherPicss: [],
                        imgOne: "",
                        imgThree: "",
                        imgTwo: "",
                    }
                    let pindex = 0;
                    for (const subiterator of iterator) {
                        let attr = "";
                        if (subiterator.ImgType === 1) {
                            attr = attrs[pindex++];
                            _pinimg[attr] = subiterator;
                        } else if (subiterator.ImgType === 2) {
                            attr = "OtherPicss";
                            _pinimg[attr].push(subiterator);
                        }
                        allImgs.push({
                            id: item.Id,
                            type: 'batchPinsImg',
                            parent: batchpin.Id,
                            AnimalID: key,
                            attr: attr,
                            ImgObj: subiterator,
                            nativeUrl: ''
                        });
                    }
                    _pinimgs[key] = _pinimg;
                }
                bpinobj.PinImgs = _pinimgs;
                newImgs[item.Id].batchPins[batchpin.Id] = bpinobj;
            }
            for (const FarmerImg of item.FarmerImgs) {
                FarmerImg.Id = item.isPass === 1 ? this.newGuid() : FarmerImg.Id;
                FarmerImg.PolicyId = item.isPass === 1 ? item.Id : FarmerImg.PolicyId;
                let farmerobj = {
                    VaccinationCertificateImg: FarmerImg.VaccinationCertificateImg === null ? "" : FarmerImg.VaccinationCertificateImg,
                    bankUrl: FarmerImg.bankUrl === null ? "" : FarmerImg.bankUrl,
                    idbackUrl: FarmerImg.idbackUrl === null ? "" : FarmerImg.idbackUrl,
                    idfrontUrl: FarmerImg.idfrontUrl === null ? "" : FarmerImg.idfrontUrl,
                }
                newImgs[item.Id].FarmerImgs[FarmerImg.ParentId] = farmerobj;
                allImgs.push({
                    id: item.Id,
                    type: 'org',
                    parent: FarmerImg.ParentId,
                    attr: 'VaccinationCertificateImg',
                    ImgObj: FarmerImg.VaccinationCertificateImg,
                    nativeUrl: ''
                });
                allImgs.push({
                    id: item.Id,
                    type: 'org',
                    parent: FarmerImg.ParentId,
                    attr: 'bankUrl',
                    ImgObj: FarmerImg.bankUrl,
                    nativeUrl: ''
                });
                allImgs.push({
                    id: item.Id,
                    type: 'org',
                    parent: FarmerImg.ParentId,
                    attr: 'idbackUrl',
                    ImgObj: FarmerImg.idbackUrl,
                    nativeUrl: ''
                });
                allImgs.push({
                    id: item.Id,
                    type: 'org',
                    parent: FarmerImg.ParentId,
                    attr: 'idfrontUrl',
                    ImgObj: FarmerImg.idfrontUrl,
                    nativeUrl: ''
                });
            }
        }

        // 将存在的图片生成一个下载的promise，放到数组里
        for (const img of allImgs) {
            if (img.ImgObj) {
                let promise = new Promise(resolve => {
                    let ImgUrl = img.ImgObj.ImgUrl;
                    let name = ImgUrl.split('/')[ImgUrl.split('/').length - 1];
                    if (window['cordova']) {
                        this.fileTransfer.download(`${ENV.IMG_URL + ImgUrl}`, `${ENV.LOCAL_IMG_URL + name}`).then((entry) => {
                            img.nativeUrl = entry.nativeURL;
                            console.log(entry);
                            resolve(img);
                        }, (error) => {
                            resolve("");
                        });
                    } else {
                        img.nativeUrl = name;
                        resolve(img);
                    }
                });
                promises.push(promise);
            }
        }

        // 使用promise.all同步下载所有图片
        let promise = new Promise(resolve => {
            // 将数组类型的变量的值清空
            for (let item of arr) {
                newImgs[item.Id].signUrl = [];
                let pins = newImgs[item.Id].pins;
                for (const key in pins) {
                    newImgs[item.Id].pins[key].otherUrl = [];
                }
                let batchPins = newImgs[item.Id].batchPins;
                for (let key in batchPins) {
                    let batchPins = newImgs[item.Id].batchPins[key];
                    newImgs[item.Id].batchPins[key].AnimalsotherUrl = [];
                    for (const skey in batchPins.PinImgs) {
                        newImgs[item.Id].batchPins[key].PinImgs[skey].OtherPicss = [];
                    }
                }
            }
            Promise.all(promises).then(function (values) {
                for (const iterator of values) {
                    if (iterator.type === "farmer") {
                        newImgs[iterator.id][iterator.attr] = iterator.nativeUrl;
                    } else if (iterator.type === "pins") {
                        newImgs[iterator.parent][iterator.type][iterator.id][iterator.attr] = iterator.nativeUrl;
                    } else if (iterator.type === "other") {
                        newImgs[iterator.id]["pins"][iterator.parent][iterator.attr].push(iterator.nativeUrl);
                    } else if (iterator.type === "batchImg") {
                        if (iterator.attr === "AnimalsotherUrl") {
                            newImgs[iterator.id]["batchPins"][iterator.parent][iterator.attr].push(iterator.nativeUrl);
                        } else {
                            newImgs[iterator.id]["batchPins"][iterator.parent][iterator.attr] = iterator.nativeUrl;
                        }
                    } else if (iterator.type === "batchPinsImg") {
                        if (iterator.attr === "OtherPicss") {
                            newImgs[iterator.id]["batchPins"][iterator.parent]['PinImgs'][iterator.AnimalID][iterator.attr].push(iterator.nativeUrl);
                        } else {
                            newImgs[iterator.id]["batchPins"][iterator.parent]['PinImgs'][iterator.AnimalID][iterator.attr] = iterator.nativeUrl;
                        }
                    } else if (iterator.type === "sign") {
                        newImgs[iterator.id][iterator.attr].push(iterator.nativeUrl);
                    } else if (iterator.type === "OtherImgs") {
                        newImgs[iterator.id][iterator.attr].push(iterator.nativeUrl);
                    } else if (iterator.type === "org") {
                        newImgs[iterator.id]["FarmerImgs"][iterator.parent][iterator.attr] = iterator.nativeUrl;
                    }
                }
                let newarr = that.ApoliyAPI2SQL(arr, newImgs);
                resolve(newarr);
            });
        });
        return promise;
    }

    /**
     *
     * @description 将下载后的本地图片路径写入原数组，并将接口字段替换成数据库字段
     * @param {any} arr
     * @param {any} newImgs
     * @returns
     * @memberof CommonServiceProvider
     */
    ApoliyAPI2SQL(arr, newImgs) {
        let GetAreaTree = JSON.parse(localStorage.getItem('GetAreaTree'));
        let xzlist = JSON.parse(localStorage.getItem('xzlist'));
        let newarr = {
            farmers: [],
            policies: [],
            manyPolicies: [],
        };
        for (const obj of arr) {
            // 牧户表字段替换
            let farmer = new Farmer_db();
            obj.idfrontUrl = newImgs[obj.Id].idfrontUrl;
            obj.idbackUrl = newImgs[obj.Id].idbackUrl;
            obj.bankUrl = newImgs[obj.Id].bankUrl;
            obj.InstitutionCodeImg = newImgs[obj.Id].InstitutionCodeImg;
            obj.VaccinationCertificateImg = newImgs[obj.Id].VaccinationCertificateImg;
            obj.signUrl = newImgs[obj.Id].signUrl.join();
            obj.OtherImgs = newImgs[obj.Id].OtherImgs.join();
            obj['insurancepro'] = "";
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let element = obj[key];
                    if (key === "FramLocation") {
                        for (const iterator of GetAreaTree) {
                            if (obj['FarmLocationId'] === iterator.id) {
                                element = `${iterator.id},${element}`;
                                break;
                            }
                        }
                    } else if (key === "insurancepro") {
                        let TypeId = obj['InsuraceType'].split(',')[0];
                        let InsuraceProject = obj['InsuraceProject'].split(',')[0];
                        xzlist.map(item => {
                            if (item.TypeId === TypeId) {
                                item.List.map(subitem => {
                                    if (subitem.ProjectId === InsuraceProject) {
                                        element = JSON.stringify(subitem);
                                    }
                                })
                            }
                        });
                    }
                    if (Farmer_APIDATA[key] !== undefined) {
                        farmer[Farmer_APIDATA[key]] = element;
                    }
                }
            }
            // 特殊处理
            if (obj.FarmType === 2 || obj.FarmType === 5) {//企业
                farmer.tyshxydm = farmer.FramPeopleID;
            } else if (obj.FarmType === 3) { // 团体
                for (let iterator of obj.Farmers) {
                    for (const key in newImgs[obj.Id].FarmerImgs[iterator.Id]) {
                        const element = newImgs[obj.Id].FarmerImgs[iterator.Id][key];
                        iterator[key] = element;
                    }
                }
                let subFarmers = [];
                for (let iterator of obj.Farmers) {
                    let sfarmer = {};
                    for (const key in iterator) {
                        if (iterator.hasOwnProperty(key)) {
                            let element = iterator[key];
                            if (Org_APIDATA[key] !== undefined) {
                                sfarmer[Org_APIDATA[key]] = element;
                            }
                        }
                    }
                    subFarmers.push(sfarmer);
                }
                obj.Farmers = JSON.stringify(subFarmers);
                farmer['farmsmessage'] = obj.Farmers;
            } else if (obj.FarmType === 4 || obj.FarmType === 5) {
                for (const batchPin of obj.batchPins) {
                    batchPin['Animals1Url'] = newImgs[obj.Id].batchPins[batchPin.Id].Animals1Url;
                    batchPin['Animals2Url'] = newImgs[obj.Id].batchPins[batchPin.Id].Animals2Url;
                    batchPin['Animals3Url'] = newImgs[obj.Id].batchPins[batchPin.Id].Animals3Url;
                    batchPin['AnimalsotherUrl'] = newImgs[obj.Id].batchPins[batchPin.Id].AnimalsotherUrl.join();
                    batchPin['AnimalList'] = [];
                    let _Pinimgs = newImgs[obj.Id].batchPins[batchPin.Id].PinImgs;
                    for (const key in _Pinimgs) {
                        batchPin['AnimalList'].push({
                            "AnimalID": key,
                            "imgOne": _Pinimgs[key].imgOne,
                            "imgTwo": _Pinimgs[key].imgTwo,
                            "imgThree": _Pinimgs[key].imgThree,
                            "OtherPicss": _Pinimgs[key].OtherPicss.join()
                        });
                    }
                    batchPin['AnimalList'] = JSON.stringify(batchPin['AnimalList']);
                    let manyPolicy = new ManyPolicyDB();
                    for (const key in batchPin) {
                        if (batchPin.hasOwnProperty(key)) {
                            let element = batchPin[key];
                            if (key === "AnimalVarietyName") {
                                element = `${batchPin['Varieties']},${batchPin['AnimalVarietyName']}`;
                            } else if (key === "AnimalType") {
                                element = `${batchPin['AnimalType']},${batchPin['AnimalTypeName']}`;
                            } else if (key === "BreedAddress") {
                                for (const iterator of GetAreaTree) {
                                    if (element.indexOf(iterator.name) > -1) {
                                        element = element.replace(iterator.name, '');
                                        element = `${iterator.id},${iterator.name}${element}`;
                                        break;
                                    }
                                }
                            }
                            if (ManyPolicy_APIDATA[key] !== undefined) {
                                manyPolicy[ManyPolicy_APIDATA[key]] = element;
                            }
                        }
                    }
                    newarr.manyPolicies.push(manyPolicy);
                }
            }
            newarr.farmers.push(farmer);
            // 承保表字段替换
            if (obj.FarmType === 1 || obj.FarmType === 2 || obj.FarmType === 3) {
                for (const pin of obj.pins) {
                    pin.ParentId = obj.Id;
                    pin.positonUrl = newImgs[obj.Id].pins[pin.Id].positonUrl;
                    pin.frontUrl = newImgs[obj.Id].pins[pin.Id].frontUrl;
                    pin.leftUrl = newImgs[obj.Id].pins[pin.Id].leftUrl;
                    pin.rightUrl = newImgs[obj.Id].pins[pin.Id].rightUrl;
                    pin.otherUrl = newImgs[obj.Id].pins[pin.Id].otherUrl.join();
                    let policy = new Policy_db();
                    for (const key in pin) {
                        if (pin.hasOwnProperty(key)) {
                            let element = pin[key];
                            if (key === "AnimalVarietyName") {
                                element = `${pin['Varieties']},${pin['AnimalVarietyName']}`;
                            } else if (key === "AnimalType") {
                                element = `${pin['AnimalType']},${pin['AnimalTypeName']}`;
                            } else if (key === "BreedAddress") {
                                for (const iterator of GetAreaTree) {
                                    if (element.indexOf(iterator.name) > -1) {
                                        element = element.replace(iterator.name, '');
                                        element = `${iterator.id},${iterator.name}${element}`;
                                        break;
                                    }
                                }
                            }
                            if (Policy_APIDATA[key] !== undefined) {
                                policy[Policy_APIDATA[key]] = element;
                            }
                        }
                    }
                    newarr.policies.push(policy);
                }
            }
        }
        return newarr;
    }

    /**
     *
     * @description 批量同步插入数据库
     * @param {any} arr
     * @returns
     * @memberof CommonServiceProvider
     */
    insertCollection(arr) {
        let promises = [];

        let farmer_statements = [];
        let farmerTableData = ENV.DATA_TABLE['inframmessage'];
        for (let iterator of arr.farmers) {
            let farmer_item = [];
            for (let i = 0; i < farmerTableData.length; i++) {
                farmer_item.push(iterator[farmerTableData[i].name]);
            }
            farmer_statements.push(farmer_item);
        }
        if (farmer_statements.length > 0) {
            let farmerQuery = "INSERT INTO inframmessage (";
            let farmertemp = "";
            for (let i = 0; i < farmerTableData.length; i++) {
                farmerQuery += farmerTableData[i].name + ",";
                farmertemp += "?,";
            }
            farmerQuery += `uid,Isloc) VALUES (${farmertemp}'${JSON.parse(localStorage.getItem('user')).AccountName}','2')`;
            let farmer_promise = new Promise((resolve, reject) => {
                this.sql.insertCollection(farmerQuery, farmer_statements).then((result) => {
                    resolve(result);
                }).catch((error) => {
                    reject(error);
                });
            });
            promises.push(farmer_promise);
        }

        let policy_statements = [];
        let policyTableData = ENV.DATA_TABLE['Underwriting'];
        for (let iterator of arr.policies) {
            let policy_item = [];
            for (let i = 0; i < policyTableData.length; i++) {
                policy_item.push(iterator[policyTableData[i].name]);
            }
            policy_statements.push(policy_item);
        }
        if (policy_statements.length > 0) {
            let policyQuery = "INSERT INTO Underwriting (";
            let policytemp = "";
            for (let i = 0; i < policyTableData.length; i++) {
                policyQuery += policyTableData[i].name + ",";
                policytemp += "?,";
            }
            policyQuery += `uid,Isloc) VALUES (${policytemp}'${JSON.parse(localStorage.getItem('user')).AccountName}','2')`;
            let policy_promise = new Promise((resolve, reject) => {
                this.sql.insertCollection(policyQuery, policy_statements).then((result) => {
                    resolve(result);
                }).catch((error) => {
                    reject(error);
                });
            });
            promises.push(policy_promise);
        }

        let manyPolicy_statements = [];
        let manyPolicyTableData = ENV.DATA_TABLE['PiliangUnderwriting'];
        for (let iterator of arr.manyPolicies) {
            let manyPolicy_item = [];
            for (let i = 0; i < manyPolicyTableData.length; i++) {
                manyPolicy_item.push(iterator[manyPolicyTableData[i].name]);
            }
            manyPolicy_statements.push(manyPolicy_item);
        }
        if (manyPolicy_statements.length > 0) {
            let manyPolicyQuery = "INSERT INTO PiliangUnderwriting (";
            let manyPolicytemp = "";
            for (let i = 0; i < manyPolicyTableData.length; i++) {
                manyPolicyQuery += manyPolicyTableData[i].name + ",";
                manyPolicytemp += "?,";
            }
            manyPolicyQuery += `uid,Isloc) VALUES (${manyPolicytemp}'${JSON.parse(localStorage.getItem('user')).AccountName}','2')`;
            let manyPolicy_promise = new Promise((resolve, reject) => {
                this.sql.insertCollection(manyPolicyQuery, manyPolicy_statements).then((result) => {
                    resolve(result);
                }).catch((error) => {
                    reject(error);
                });
            });
            promises.push(manyPolicy_promise);
        }

        let promise = new Promise(resolve => {
            Promise.all(promises).then(function (values) {
                resolve(values);
            });
        });
        return promise;
    }

    DownloadClaimsImgs(arr) {
        let that = this;
        let promises = [];
        let allImgs = [];
        let newImgs = [];

        //获取承保下载接口的所有图片
        for (const item of arr) {
            //把接口数据里的null值数组转换为空数组
            item.pins = item.pins === null ? [] : item.pins;
            newImgs[item.farmer.id] = {
                FramIDFont: "",
                FramIDBack: "",
                canvasImg: "",
                BankCardImg: "",
                VaccinationCertificateImg: "",
                InstitutionCodeImg: "",
                vaccinationCertificateImgs: [],
                pins: [],
            };
            for (const iterator of item.farmer.farmImgs) {
                let attr = '';
                if (iterator.imgType === 1) {
                    attr = 'FramIDFont';
                } else if (iterator.imgType === 2) {
                    attr = 'FramIDBack';
                } else if (iterator.imgType === 3) {
                    attr = 'canvasImg';
                } else if (iterator.imgType === 4) {
                    attr = 'BankCardImg';
                } else if (iterator.imgType === 5) {
                    attr = 'VaccinationCertificateImg';
                } else if (iterator.imgType === 6) {
                    attr = 'InstitutionCodeImg';
                } else if (iterator.imgType === 7) {
                    attr = 'vaccinationCertificateImgs';
                }
                if (iterator.imgType === 7) {
                    newImgs[item.farmer.id][attr].push(iterator);
                } else {
                    newImgs[item.farmer.id][attr] = iterator;
                }
                allImgs.push({
                    id: item.farmer.id,
                    type: 'farmImgs',
                    parent: item.farmer.id,
                    attr: attr,
                    ImgObj: iterator,
                    nativeUrl: ''
                });
            }
            for (const pin of item.pins) {
                let pinobj = {
                    ForDie: '',
                    Other: [],
                    Scene: [],
                    Harmless: [],
                }
                for (const iterator of pin.pinImgs) {
                    let attr = '';
                    if (iterator.imgType === 5) {
                        attr = 'Other';
                    } else if (iterator.imgType === 6) {
                        attr = 'Scene';
                    } else if (iterator.imgType === 7) {
                        attr = 'Harmless';
                    } else if (iterator.imgType === 8) {
                        attr = 'ForDie';
                    }
                    if (iterator.imgType === 8) {
                        pinobj[attr] = iterator;
                    } else {
                        pinobj[attr].push(iterator);
                    }
                    allImgs.push({
                        id: pin.id,
                        type: 'pinImgs',
                        parent: item.farmer.id,
                        attr: attr,
                        ImgObj: iterator,
                        nativeUrl: ''
                    });
                }
                newImgs[item.farmer.id].pins[pin.id] = pinobj;
            }
        }

        // 将存在的图片生成一个下载的promise，放到数组里
        for (const img of allImgs) {
            if (img.ImgObj) {
                let promise = new Promise(resolve => {
                    let ImgUrl = img.ImgObj.url;
                    let name = ImgUrl.split('/')[ImgUrl.split('/').length - 1];
                    if (window['cordova']) {
                        this.fileTransfer.download(`${ENV.IMG_URL + ImgUrl}`, `${ENV.LOCAL_IMG_URL + name}`).then((entry) => {
                            img.nativeUrl = entry.nativeURL;
                            resolve(img);
                        }, (error) => {
                            resolve("");
                        });
                    } else {
                        img.nativeUrl = name;
                        resolve(img);
                    }
                });
                promises.push(promise);
            }
        }

        // 使用promise.all同步下载所有图片
        let promise = new Promise(resolve => {
            // 将数组类型的变量的值清空
            for (let item of arr) {
                newImgs[item.farmer.id].vaccinationCertificateImgs = [];
                let pins = newImgs[item.farmer.id].pins;
                for (const key in pins) {
                    newImgs[item.farmer.id].pins[key].Other = [];
                    newImgs[item.farmer.id].pins[key].Scene = [];
                    newImgs[item.farmer.id].pins[key].Harmless = [];
                }
            }
            Promise.all(promises).then(function (values) {
                for (const iterator of values) {
                    if (iterator.type === "farmImgs") {
                        if (iterator.attr === "vaccinationCertificateImgs") {
                            newImgs[iterator.id][iterator.attr].push(iterator.nativeUrl);
                        } else {
                            newImgs[iterator.id][iterator.attr] = iterator.nativeUrl;
                        }
                    } else if (iterator.type === "pinImgs") {
                        if (iterator.attr !== "ForDie") {
                            newImgs[iterator.parent]["pins"][iterator.id][iterator.attr].push(iterator.nativeUrl);
                        } else {
                            newImgs[iterator.parent]["pins"][iterator.id][iterator.attr] = iterator.nativeUrl;
                        }
                    }
                }
                let newarr = that.ClaimsAPI2SQL(arr, newImgs);
                resolve(newarr);
            });
        });
        return promise;
    }

    ClaimsAPI2SQL(arr, newImgs) {
        let GetAreaTree = JSON.parse(localStorage.getItem('GetAreaTree'));
        let newarr = {
            farmers: [],
            claims: [],
        };
        for (const obj of arr) {
            // 牧户表字段替换
            let farmer = new InsuredFarmerDB();
            obj.farmer.FramIDFont = newImgs[obj.farmer.id].FramIDFont;
            obj.farmer.FramIDBack = newImgs[obj.farmer.id].FramIDBack;
            obj.farmer.canvasImg = newImgs[obj.farmer.id].canvasImg;
            obj.farmer.BankCardImg = newImgs[obj.farmer.id].BankCardImg;
            obj.farmer.VaccinationCertificateImg = newImgs[obj.farmer.id].VaccinationCertificateImg;
            obj.farmer.InstitutionCodeImg = newImgs[obj.farmer.id].InstitutionCodeImg;
            obj.farmer.vaccinationCertificateImgs = newImgs[obj.farmer.id].vaccinationCertificateImgs.join();
            for (const key in obj.farmer) {
                if (obj.farmer.hasOwnProperty(key)) {
                    let element = obj.farmer[key];
                    if (key === "address") {
                        for (const iterator of GetAreaTree) {
                            if (element === iterator.id) {
                                element = element.replace(iterator.name, '');
                                element = `${iterator.id},${iterator.name}${element}`;
                                break;
                            }
                        }
                    }
                    if (InsuredFarmer_APIDATA[key] !== undefined) {
                        farmer[InsuredFarmer_APIDATA[key]] = element;
                    }
                }
            }
            newarr.farmers.push(farmer);
            // 承保表字段替换
            for (const pin of obj.pins) {
                pin.FramGuid = obj.farmer.id;
                pin.ForDie = newImgs[obj.farmer.id].pins[pin.id].ForDie;
                pin.Other = newImgs[obj.farmer.id].pins[pin.id].Other.join();
                pin.Scene = newImgs[obj.farmer.id].pins[pin.id].Scene.join();
                pin.Harmless = newImgs[obj.farmer.id].pins[pin.id].Harmless.join();
                let claim = new ClaimDB();
                for (const key in pin) {
                    if (pin.hasOwnProperty(key)) {
                        let element = pin[key];
                        if (Claims_APIDATA[key] !== undefined) {
                            claim[Claims_APIDATA[key]] = element;
                        }
                    }
                }
                newarr.claims.push(claim);
            }
        }
        return newarr;
    }

    insertClaims(arr) {
        let promises = [];

        let farmer_statements = [];
        let farmerTableData = ENV.DATA_TABLE['InsuredFarmer'];
        for (let iterator of arr.farmers) {
            let farmer_item = [];
            for (let i = 0; i < farmerTableData.length; i++) {
                farmer_item.push(iterator[farmerTableData[i].name]);
            }
            farmer_statements.push(farmer_item);
        }
        if (farmer_statements.length > 0) {
            let farmerQuery = "INSERT INTO InsuredFarmer (";
            let farmertemp = "";
            for (let i = 0; i < farmerTableData.length; i++) {
                farmerQuery += farmerTableData[i].name + ",";
                farmertemp += "?,";
            }
            farmerQuery += `uid,Isloc) VALUES (${farmertemp}'${JSON.parse(localStorage.getItem('user')).AccountName}','2')`;
            let farmer_promise = new Promise((resolve, reject) => {
                this.sql.insertCollection(farmerQuery, farmer_statements).then((result) => {
                    resolve(result);
                }).catch((error) => {
                    reject(error);
                });
            });
            promises.push(farmer_promise);
        }

        let claim_statements = [];
        let claimTableData = ENV.DATA_TABLE['DeclareClaimTable'];
        for (let iterator of arr.claims) {
            let claim_item = [];
            for (let i = 0; i < claimTableData.length; i++) {
                claim_item.push(iterator[claimTableData[i].name]);
            }
            claim_statements.push(claim_item);
        }
        if (claim_statements.length > 0) {
            let claimQuery = "INSERT INTO DeclareClaimTable (";
            let claimtemp = "";
            for (let i = 0; i < claimTableData.length; i++) {
                claimQuery += claimTableData[i].name + ",";
                claimtemp += "?,";
            }
            claimQuery += `uid,Isloc) VALUES (${claimtemp}'${JSON.parse(localStorage.getItem('user')).AccountName}','2')`;
            let claim_promise = new Promise((resolve, reject) => {
                this.sql.insertCollection(claimQuery, claim_statements).then((result) => {
                    resolve(result);
                }).catch((error) => {
                    reject(error);
                });
            });
            promises.push(claim_promise);
        }

        let promise = new Promise(resolve => {
            Promise.all(promises).then(function (values) {
                resolve(values);
            });
        });
        return promise;
    }


    uploadImages(imgsArr) {
        let uname = JSON.parse(localStorage.getItem('user')).AccountName;
        console.log(imgsArr);
        let promlist = [];
        for (let value of imgsArr[0]) {
            let promise = new Promise((resolve) => {
                this.fileTransfer.upload(value.name, `${ENV.WEB_URL}UpdateCbFarmerImg?id=${value.id}&imgType=${value.imgType}&uname=${uname}`).then(res => {
                    // let objects = {};
                    // objects['Status'] = JSON.parse(res.response).Status;
                    // objects['url'] = `${ENV.WEB_URL}UpdateCbFarmerImg?id=${value.id}&imgType=${value.imgType}&uname=${uname}`;
                    // resolve(objects);
                    res['str'] = `${ENV.WEB_URL}UpdateCbFarmerImg?id=${value.id}&imgType=${value.imgType}&uname=${uname}`;
                    resolve(res);
                }).catch(err => {
                    console.log(err)
                });
            });
            promlist.push(promise);
        }
        for (let value of imgsArr[1]) {
            let promise = new Promise((resolve) => {
                this.fileTransfer.upload(value.name, `${ENV.WEB_URL}UpdateCbPinImg?id=${value.id}&imgType=${value.imgType}&uname=${uname}`).then(res => {
                    // let objects = {};
                    // objects['Status'] = JSON.parse(res.response).Status;
                    // objects['url'] = `${ENV.WEB_URL}UpdateCbPinImg?id=${value.id}&imgType=${value.imgType}&uname=${uname}`;
                    // resolve(objects);
                    res['str'] = `${ENV.WEB_URL}UpdateCbPinImg?id=${value.id}&imgType=${value.imgType}&uname=${uname}`;
                    resolve(res);
                }).catch(err => {
                    console.log(err)
                });
            });
            promlist.push(promise);
        }
        for (let value of imgsArr[2]) {
            let promise = new Promise((resolve) => {
                this.fileTransfer.upload(value.name, `${ENV.WEB_URL}UpdateCbFarmerImg?id=${value.id}&imgType=${value.imgType}&uname=${uname}`).then(res => {
                    // let objects = {};
                    // objects['Status'] = JSON.parse(res.response).Status;
                    // objects['url'] = `${ENV.WEB_URL}UpdateCbFarmerImg?id=${value.id}&imgType=${value.imgType}&uname=${uname}`;
                    // resolve(objects);
                    res['str'] = `${ENV.WEB_URL}UpdateCbFarmerImg?id=${value.id}&imgType=${value.imgType}&uname=${uname}`;
                    resolve(res);
                }).catch(err => {
                    console.log(err)
                });
            });
            promlist.push(promise);
        }
        for (let value of imgsArr[3]) {
            let promise = new Promise((resolve) => {
                this.fileTransfer.upload(value.name, `${ENV.WEB_URL}BulkUpdateImg?id=${value.id}&pin=${value.pin}&imgType=${value.imgType}&dataType=${value.dataType}&uname=${uname}`).then(res => {
                    // let objects = {};
                    // objects['Status'] = JSON.parse(res.response).Status;
                    // objects['url'] = `${ENV.WEB_URL}BulkUpdateImg?id=${value.id}&pin=${value.pin}&imgType=${value.imgType}&dataType=${value.dataType}&uname=${uname}`;
                    // resolve(objects);
                    res['str'] = `${ENV.WEB_URL}BulkUpdateImg?id=${value.id}&pin=${value.pin}&imgType=${value.imgType}&dataType=${value.dataType}&uname=${uname}`;
                    resolve(res);
                }).catch(err => {
                    console.log(err)
                });
            });
            promlist.push(promise);
        }
        let pro = new Promise((resolve) => {
            Promise.all(promlist).then(res => {
                // for (let value of res) {
                //     if (!value.Status) {
                //         resolve(false);
                //     }
                // }
                // resolve(true);
                resolve(res);
            })
        });
        return pro;
    }

    needModifyPwd() {
        if (ENV.USER) {
            //调用登录方法获取时间
            this.http.post(`${ENV.OTHER_API}Login`, {
                uname: ENV.USER.AccountName,
                pwd: JSON.parse(localStorage.getItem('pwd'))
            }).subscribe(res => {
                res = res.json();
                if (res['Status']) {
                    this.modifyPwd(res['MyObject'].LastModifyPwdTime);
                }
            });
        }
    }

    modifyPwd(time: any) {
        let now = (new Date()).getTime();
        time = new Date(time).getTime();
        let dayCount = (Math.abs(now - time)) / 1000 / 60 / 60 / 24;
        if (dayCount >= 30) {
            let alert = this.alertCtrl.create({
                title: '消息',
                message: '密码已过期，请重置',
                enableBackdropDismiss: false,
                inputs: [
                    {
                        name: 'oldpassword',
                        placeholder: '请输入旧密码',
                        type: 'password'
                    },
                    {
                        name: 'password',
                        placeholder: '请输入新密码',
                        type: 'password'
                    },
                    {
                        name: 'passwordAgain',
                        placeholder: '请输入确认密码',
                        type: 'password'
                    }
                ],
                buttons: [
                    {
                        text: '提交',
                        handler: data => {
                            if (!data.oldpassword) {
                                this.toast("请输入旧密码");
                                return false;
                            } else if (data.oldpassword.length < 6) {
                                this.toast("密码长度小于6位");
                                return false;
                            }
                            if (!data.password) {
                                this.toast("请输入新密码");
                                return false;
                            } else if (data.password.length < 6) {
                                this.toast("密码长度小于6位");
                                return false;
                            }
                            if (!data.passwordAgain) {
                                this.toast("请输入确认密码");
                                return false;
                            } else if (data.passwordAgain.length < 6) {
                                this.toast("密码长度小于6位");
                                return false;
                            }
                            if (data.passwordAgain != data.password) {
                                this.toast("确认密码错误");
                                return false;
                            }
                            let loading = this.loadingCtrl.create({
                                content: '提交中...'
                            });
                            loading.present();
                            this.http.post(`${ENV.OTHER_API}UpdatePwd`, {
                                uname: JSON.parse(localStorage.getItem('user')).AccountName,
                                oldpwd: data.oldpassword,
                                newpwd: data.password
                            }).subscribe(res => {
                                loading.dismiss();
                                res = res.json();
                                if (res['Status']) {
                                    localStorage.setItem('pwd', data.password);
                                    alert.dismiss();
                                    this.toast("密码修改成功");
                                    return true;
                                } else {
                                    this.toast(res['Message']);
                                    return false;
                                }
                            });
                            return false;
                        }
                    }
                ]
            });
            alert.present();
        }
    }

    choosePhoto() {
        let self = this;
        return new Promise(function (resolve, reject) {
            let actionSheet = self.actionSheetCtrl.create({
                buttons: [
                    {
                        text: '相册上传',
                        role: 'destructive',
                        handler: () => {
                            self.options['sourceType'] = 0;
                            self.camera.getPicture(self.options).then((imageData) => {
                                resolve(imageData);
                            }, (err) => {
                                reject(err);
                            });
                        }
                    }, {
                        text: '拍照上传',
                        handler: () => {
                            self.options['sourceType'] = 1;
                            self.camera.getPicture(self.options).then((imageData: string) => {
                                resolve(imageData);
                            }, (err) => {
                                reject(err);
                            });
                        }
                    }, {
                        text: '取消',
                        role: 'cancel',
                        handler: () => {
                        }
                    }
                ]
            });
            actionSheet.present();
        });
    }

    OCR(type) {
        let self = this;
        let error = "识别失败，请重试";
        let promise = new Promise((resolve, reject) => {
            this.choosePhoto().then(imgUrl => {
                let loading = self.loadingCtrl.create({
                    content: '正在识别，请稍等...'
                });
                loading.present();
                let fun = type === 'FramPeopleID' ? 'IdCardOcr' : 'BankCardOcr';
                this.fileTransfer.upload(imgUrl.toString(), `${ENV.WEB_URL}${fun}`).then(res => {
                    loading.dismiss();
                    if (res.responseCode === 200) {
                        let info = JSON.parse(res.response);

                        if (info.Status) {
                            self.getCanvas(imgUrl).then(response => {
                                info.Data['imgs'] = response;
                                resolve(info.Data);
                            })
                        } else {
                            reject(info.Message);
                        }
                    } else {
                        reject(error);
                    }
                }).catch(err => {
                    loading.dismiss();
                    reject(error);
                });
            });
        });
        return promise;
    }

    UpDataMessage(images) {
        console.log(images);
        let uname = JSON.parse(localStorage.getItem('user')).AccountName;
        let promlist = [];
        for (let value of images[0]) {
            let promise = new Promise(resolve => {
                this.fileTransfer.upload(value.name, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${value.id}&imgType=${value.imgType}&uname=${uname}`).then(res => {
                    res['str'] = `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${value.id}&imgType=${value.imgType}&uname=${uname}`;
                    // resolve(JSON.parse(res.response).Status);
                    resolve(res);
                }).catch(err => {
                    console.log(err);
                });
            });
            promlist.push(promise);
        }
        for (let value of images[1]) {
            let promise = new Promise(resolve => {
                this.fileTransfer.upload(value.name, `${ENV.WEB_URL}UploadCbPinImg?pin=${value.id}&imgType=${value.imgType}&uname=${uname}`).then(res => {
                    res['str'] = `${ENV.WEB_URL}UploadCbPinImg?pin=${value.id}&imgType=${value.imgType}&uname=${uname}`;
                    // resolve(JSON.parse(res.response).Status);
                    resolve(res);
                }).catch(err => {
                    console.log(err);
                });
            });
            promlist.push(promise);
        }
        for (let value of images[2]) {
            let promise = new Promise(resolve => {
                this.fileTransfer.upload(value.name, `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${value.id}&imgType=${value.imgType}&uname=${uname}`).then(res => {
                    res['str'] = `${ENV.WEB_URL}UploadCbFarmerImg?idnumber=${value.id}&imgType=${value.imgType}&uname=${uname}`;
                    // resolve(JSON.parse(res.response).Status);
                    resolve(res);
                }).catch(err => {
                    console.log(err);
                });
            });
            promlist.push(promise);
        }
        for (let value of images[3]) {
            let promise = new Promise(resolve => {
                this.fileTransfer.upload(value.name, `${ENV.WEB_URL}BulkUploadImg?id=${value.id}&pin=${value.pin}&uname=${uname}&imgType=${value.imgType}&dataType=${value.dataType}`).then(res => {
                    res['str'] = `${ENV.WEB_URL}BulkUploadImg?id=${value.id}&pin=${value.pin}&uname=${uname}&imgType=${value.imgType}&dataType=${value.dataType}`;
                    // resolve(JSON.parse(res.response).Status);
                    resolve(res);
                }).catch(err => {
                    console.log(err);
                });
            });
            promlist.push(promise);
        }
        let pro = new Promise((resolve) => {
            Promise.all(promlist).then(res => {
                // for (let value of res) {
                //     if (!value.Status) {
                //         resolve(false);
                //     }
                // }
                // resolve(true);
                resolve(res);
            })
        });
        return pro;
    }

    getIndex(ele, name, arr) {
        let s = -1;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i][name] == ele[name]) {
                s = i;
                break;
            }
        }
        return s;
    }

    sleep(n) {
        var start = new Date().getTime();
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
    }
}
