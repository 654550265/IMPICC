import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject } from "@ionic-native/file-transfer";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-no-pass',
    templateUrl: 'no-pass.html',
})
export class NoPassPage {
    FramPeopleid: string;
    FramMessage: any;
    FramChenMessage: Array<any>;
    Chengbaoyuan: string;
    Time: string;
    auditStaus: number;
    E: any;
    fileTransfer: FileTransferObject = this.transfer.create();
    showBottom: boolean;
    isChange: boolean;
    src: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private camera: Camera, private transfer: FileTransfer, public alertCtrl: AlertController, public sqlite: SqllistServiceProvider, public comm: CommonServiceProvider, private photoViewer: PhotoViewer) {
        let loader = this.loadingCtrl.create({
            content: "加载中...",
            duration: 3000
        });
        loader.present();
        this.src = 'assets/icon/pic-updata_03.png';
        this.FramPeopleid = this.navParams.get('FramPeopleid');
        this.Chengbaoyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.sqlite.selecTablePeopleID('FramNoPass', this.FramPeopleid).then(res => {
            this.Time = res[0].name.CreateTime;
            for (let i = 0; i < res.length; i++) {
                res[i]['form'] = {};
            }
            this.FramMessage = res;
            console.log(this.FramMessage);
            loader.dismiss();
        }).catch(e => {
            console.log(e)
        });
        this.sqlite.selecTablePeopleID('FramMessageNoPass', this.FramPeopleid).then(res => {
            for (let i = 0; i < res.length; i++) {
                res[i]['form'] = {};
            }
            this.FramChenMessage = res;
            if (this.FramChenMessage.length == 0) {
                this.isChange = false;
            } else {
                this.isChange = true;
            }
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

    changpic(index, item) {
        if (this.isChange) {
            this.comm.toast('该条数据的农户信息已审核通过，不能修改');
        } else {
            switch (index) {
                case 1:
                    this.FramMessage[item].name.idfrontUrl = this.src;
                    break;
                case 2:
                    this.FramMessage[item].name.idbackUrl = this.src;
                    break;
                case 3:
                    this.FramMessage[item].name.bankUrl = this.src;
                    break;
                case 4:
                    this.FramMessage[item].name.VaccinationCertificateImg = this.src;
                    break;
                case 5:
                    this.FramMessage[item].name.InstitutionCodeImg = this.src;
                    break;
            }
        }
    }

    photo1(item) {
        if (this.isChange) {
            this.comm.toast('该条数据的农户信息已审核通过，不能修改');
        } else {
            if (this.FramMessage[item].name.idfrontUrl == this.src) {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.FramMessage[item].name.idfrontUrl = imageData;
                    this.FramMessage[item].form.idfrontUrl = imageData;
                }, (err) => {
                    // Handle error
                });
            } else {
                this.photoViewer.show(this.FramMessage[item].name.idfrontUrl);
            }
        }
    }

    photo2(item) {
        if (this.isChange) {
            this.comm.toast('该条数据的农户信息已审核通过，不能修改');
        } else {
            if (this.FramMessage[item].name.idbackUrl == this.src) {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.FramMessage[item].name.idbackUrl = imageData;
                    this.FramMessage[item].form.idbackUrl = imageData;
                }, (err) => {
                    // Handle error
                });
            } else {
                this.photoViewer.show(this.FramMessage[item].name.idbackUrl);
            }
        }
    }

    photo3(item) {
        if (this.isChange) {
            this.comm.toast('该条数据的农户信息已审核通过，不能修改');
        } else {
            if (this.FramMessage[item].name.bankUrl == this.src) {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.FramMessage[item].name.bankUrl = imageData;
                    this.FramMessage[item].form.bankUrl = imageData;
                }, (err) => {
                    // Handle error
                });
            } else {
                this.photoViewer.show(this.FramMessage[item].name.bankUrl);
            }
        }
    }
    photo4(item) {
        if (this.isChange) {
            this.comm.toast('该条数据的农户信息已审核通过，不能修改');
        } else {
            if (this.FramMessage[item].name.VaccinationCertificateImg == this.src) {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.FramMessage[item].name.VaccinationCertificateImg = imageData;
                    this.FramMessage[item].form.VaccinationCertificateImg = imageData;
                }, (err) => {
                    // Handle error
                });
            } else {
                this.photoViewer.show(this.FramMessage[item].name.VaccinationCertificateImg);
            }
        }
    }
    photo5(item) {
        if (this.isChange) {
            this.comm.toast('该条数据的农户信息已审核通过，不能修改');
        } else {
            if (this.FramMessage[item].name.InstitutionCodeImg == this.src) {
                this.camera.getPicture(this.options).then((imageData) => {
                    this.FramMessage[item].name.InstitutionCodeImg = imageData;
                    this.FramMessage[item].form.InstitutionCodeImg = imageData;
                }, (err) => {
                    // Handle error
                });
            } else {
                this.photoViewer.show(this.FramMessage[item].name.InstitutionCodeImg);
            }
        }
    }

    changpicLoc(index, item) {
        switch (index) {
            case 1:
                this.FramChenMessage[item].name.positonUrl = this.src;
                break;
            case 2:
                this.FramChenMessage[item].name.frontUrl = this.src;
                break;
            case 3:
                this.FramChenMessage[item].name.leftUrl = this.src;
                break;
            case 4:
                this.FramChenMessage[item].name.rightUrl = this.src;
                break;
        }
    }

    NoPassPhoto1(item) {
        if (this.FramChenMessage[item].name.positonUrl == this.src) {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramChenMessage[item].name.positonUrl = imageData;
                this.FramChenMessage[item].form.positonUrl = imageData;
            }, (err) => {
                // Handle error
            });
        } else {
            this.photoViewer.show(this.FramChenMessage[item].name.positonUrl);
        }
    }

    NoPassPhoto2(item) {
        if (this.FramChenMessage[item].name.frontUrl == this.src) {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramChenMessage[item].name.frontUrl = imageData;
                this.FramChenMessage[item].form.frontUrl = imageData;
            }, (err) => {
                // Handle error
            });
        } else {
            this.photoViewer.show(this.FramChenMessage[item].name.frontUrl);
        }
    }

    NoPassPhoto3(item) {
        if (this.FramChenMessage[item].name.leftUrl == this.src) {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramChenMessage[item].name.leftUrl = imageData;
                this.FramChenMessage[item].form.leftUrl = imageData;
            }, (err) => {
                // Handle error
            });
        } else {
            this.photoViewer.show(this.FramChenMessage[item].name.leftUrl);
        }
    }

    NoPassPhoto4(item) {
        if (this.FramChenMessage[item].name.rightUrl == this.src) {
            this.camera.getPicture(this.options).then((imageData) => {
                this.FramChenMessage[item].name.rightUrl = imageData;
                this.FramChenMessage[item].form.rightUrl = imageData;
            }, (err) => {
                // Handle error
            });
        } else {
            this.photoViewer.show(this.FramChenMessage[item].name.rightUrl);
        }
    }

    NoPasssaveBtnSaveLoc() {
        let boo;
        for (let i = 0; i < this.FramMessage.length; i++) {
            for (let key in this.FramMessage[i].name) {
                if (this.FramMessage[i].name[key] == this.src) {
                    boo = true;
                    break;
                } else {
                    boo = false;
                }
            }
        }
        let boos;
        for (let i = 0; i < this.FramChenMessage.length; i++) {
            for (let key in this.FramChenMessage[i].name) {
                if (this.FramChenMessage[i].name[key] == this.src) {
                    boos = true;
                    break;
                } else {
                    boos = false;
                }
            }
        }
        if (boo || boos) {
            this.comm.toast('请确认该条数据的所有图片都已拍摄');
        } else {
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: '确定修改这条数据吗？',
                buttons: [
                    {
                        text: '取消',
                        handler: () => {
                        }
                    },
                    {
                        text: '确定',
                        handler: () => {
                            for (let i = 0; i < this.FramMessage.length; i++) {
                                this.sqlite.updateFarmMessage('FramNoPass', this.FramMessage[i].name, this.FramMessage[i].form).then(res => {
                                    if (this.FramChenMessage.length != 0) {
                                        for (let j = 0; j < this.FramChenMessage.length; j++) {
                                            this.sqlite.updateFarmMessage('FramMessageNoPass', this.FramChenMessage[j].name, this.FramChenMessage[j].form).then(mess => {
                                                if (i == this.FramMessage.length - 1 && j == this.FramChenMessage.length - 1) {
                                                    this.comm.toast('修改成功');
                                                    this.navCtrl.pop();
                                                }
                                            })
                                        }
                                    } else {
                                        if (i == this.FramMessage.length - 1) {
                                            this.comm.toast('修改成功');
                                            this.navCtrl.pop();
                                        }
                                    }
                                }).catch(e => {
                                    console.log(e)
                                });
                            }
                        }
                    }
                ]
            });
            confirm.present();
        }
    }

    unameBlur() {
        this.showBottom = false;
    }

    unamefocus() {
        this.showBottom = true;
    }
}
