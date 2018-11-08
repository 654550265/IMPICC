import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { GpsComponent } from "../../components/gps/gps";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { PhotoViewer } from "@ionic-native/photo-viewer";

@IonicPage()
@Component({
    selector: 'page-xu-change',
    templateUrl: 'xu-change.html',
})
export class XuChangePage {
    @ViewChild(GpsComponent) gps: GpsComponent;
    jurisdictionList: Array<any>;
    Message: any;
    jurisdiction: string;
    older: string;
    isidfrontUrl: boolean;
    isidbackUrl: boolean;
    isbankUrl: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, public alertCtrl: AlertController, public sql: SqllistServiceProvider, private sqlite: SQLite, public comm: CommonServiceProvider, private photoViewer: PhotoViewer) {
        this.isidfrontUrl = true;
        this.isidbackUrl = true;
        this.isbankUrl = true;
        let me = JSON.parse(localStorage.getItem('jurisdiction'));
        this.jurisdictionList = [{}];
        this.jurisdictionList = me == null ? [] : me;
        this.jurisdictionList.push({id: "1", Name: "请选择"});
        this.Message = navParams.get('message');
        this.older = this.Message.FramPeopleID;
        this.jurisdiction = this.Message.FramLocation;
    }

    options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    FrontCard() {
        if (this.isidfrontUrl) {
            this.photoViewer.show(this.Message.idfrontUrl);
        } else {
            this.camera.getPicture(this.options).then((imageData) => {
                this.Message.idfrontUrl = imageData;
                this.isidfrontUrl = true;
            }, (err) => {
            });
        }
    }

    FrontBack() {
        if (this.isidbackUrl) {
            this.photoViewer.show(this.Message.idfrontUrl);
        } else {
            this.camera.getPicture(this.options).then((imageData) => {
                this.Message.idbackUrl = imageData;
                this.isidbackUrl = true;
            }, (err) => {
            });
        }
    }

    BankCard() {
        if (this.isbankUrl) {
            this.photoViewer.show(this.Message.idfrontUrl);
        } else {
            this.camera.getPicture(this.options).then((imageData) => {
                this.Message.bankUrl = imageData;
                this.isbankUrl = true;
            }, (err) => {
            });
        }
    }

    cha(index) {
        switch (index) {
            case 1:
                this.Message.idfrontUrl = 'assets/icon/pic-updata_03.png';
                this.isidfrontUrl = false;
                break;
            case 2:
                this.Message.idbackUrl = 'assets/icon/pic-updata_03.png';
                this.isidbackUrl = false;
                break;
            case 3:
                this.Message.bankUrl = 'assets/icon/pic-updata_03.png';
                this.isbankUrl = false;
                break;
        }
    }

    saves() {
        let reg = /1[0-9]{10}/;
        if (this.Message.FramName == '') {
            this.comm.toast('请输入农户姓名')
        } else if (this.Message.FramTel == '') {
            this.comm.toast('请输入农户的联系方式');
        } else if (!reg.test(this.Message.FramTel)) {
            this.comm.toast('请输入合法的联系方式');
        } else if (this.Message.FramPeopleID == '') {
            this.comm.toast('请输入农户的身份证号');
        } else if (this.Message.FramPeopleID.length != 18) {
            this.comm.toast('身份证长度不正确');
        } else if (this.Message.FramBank == '') {
            this.comm.toast('请输入所属的银行');
        } else if (!this.isidfrontUrl) {
            this.comm.toast('身份证正面未上传');
        } else if (!this.isidbackUrl) {
            this.comm.toast('身份证背面未上传');
        } else if (!this.isbankUrl) {
            this.comm.toast('银行卡未上传');
        } else {
            let query = 'UPDATE DnowLoadFarmData SET ';
            for (let key in this.Message) {
                if (key == 'id') {
                    query += `${key}=${this.Message[key]},`;
                }
                if (key != 'acv' && key != 'id') {
                    query += `${key}='${this.Message[key]}',`;
                }
            }
            let q = query.substring(0, (query.length - 1));
            q += ` WHERE id=${this.Message.id}`;
            let confirm = this.alertCtrl.create({
                title: '提示',
                message: '确定修改这些信息',
                buttons: [
                    {
                        text: '取消',
                        handler: () => {
                        }
                    },
                    {
                        text: '确定',
                        handler: () => {
                            this.sqlite.create({
                                name: 'impiccdata.db',
                                location: 'default'
                            }).then((db: SQLiteObject) => {
                                db.executeSql(`${q}`, {}).then(res => {
                                    db.executeSql(`UPDATE DnowLoadUnderData SET FramPeopleID='${this.Message.FramPeopleID}' WHERE FramPeopleID='${this.older}'`, {}).then(res => {
                                        this.sql.selectTableAll('DnowLoadUnderData').then(res => {
                                            this.comm.toast('修改成功');
                                            this.navCtrl.pop();
                                        })
                                    }).catch(e => {
                                        console.log(e)
                                    });
                                }).catch(e => {
                                    console.log(e)
                                });

                            }).catch(e => {
                                console.log(e)
                            });
                        }
                    }
                ]
            });
            confirm.present();
        }
    }
}
