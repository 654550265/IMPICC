import { Component,ApplicationRef } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController,ModalController } from 'ionic-angular';
import { SqllistServiceProvider } from "../../providers/sqllist-service/sqllist-service";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/**
 * Generated class for the LipeiChangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lipei-change',
  templateUrl: 'lipei-change.html',
})
export class LipeiChangePage {
    lipeiyuan: string;
    list: Array<any>;
    DieTypeList: Array<any>;
    item: Array<any>;
    dieType: string;
    WuHai: Array<any>;
    showBottom: boolean;
    fangYi: Array<any>;
    hasScene: boolean;
    lenScene: number;
    Scene: Array<any>;
    hasHarmless: boolean;
    lenHarmless: number;
    Harmless: Array<any>;
    hasOther: boolean;
    lenOther: number;
    Other: Array<any>;
    ForDie: Array<any>;
    DieMessage: string;
    idCard: string;
    constructor(public navCtrl: NavController, public navParams: NavParams,public sqlite: SqllistServiceProvider,public comm: CommonServiceProvider,private bluetoothSerial: BluetoothSerial,public loadingCtrl: LoadingController, public alertCtrl: AlertController,public applicationRef: ApplicationRef,public modalCtrl: ModalController) {
        let self = this;
        this.lipeiyuan = JSON.parse(localStorage.getItem('user')).RealName;
        this.list = [];
        this.idCard = navParams.get('idCard');
        this.showBottom = true;
        let lhGuid = navParams.get('lhGuid');
        this.DieTypeList = JSON.parse(localStorage.getItem('dieMessage'));
        this.dieType = this.DieTypeList[0].id;
        this.item = JSON.parse(localStorage.getItem('dieMessage'));
        this.WuHai = ['焚烧','深埋','化学池','其他'];
        this.fangYi = ['正常','不正常'];
        this.sqlite.selecTableIDs('DeclareClaimTable','lhGuid',lhGuid).then(res=>{
            self.list = res;
            self.list[0].form = {};
            self.list[0].form['FangyiType'] = res[0].name.FangyiType;
            self.list[0].form['DieMessage'] = res[0].name.DieMessage;
            self.list[0].form['WuHaiHua'] = res[0].name.WuHaiHua;
            self.hasScene = true;
            self.Scene = res[0].name.Scene.split(',');
            self.lenScene = self.Scene.length;
            self.hasHarmless = true;
            self.Harmless = res[0].name.Harmless.split(',');
            self.lenHarmless = self.Harmless.length;
            if(res[0].name.Other!=''&&res[0].name.Other!=null){
                self.hasOther = true;
                self.Other = res[0].name.Other.split(',');
                self.lenOther = self.Other.length;
            }else{
                self.hasOther = false;
                self.Other = [];
            }

            self.ForDie = res[0].name.ForDie.split(',');
            self.DieMessage = res[0].name.DieMessage.split(',')[0];
            for(let s = 0;s<self.DieTypeList.length;s++){
                for(let k = 0;k<self.DieTypeList[s].items.length;k++){
                    console.log(s,k,self.DieMessage)
                    if(self.DieTypeList[s].items[k].id == self.DieMessage){
                        self.dieType = self.DieTypeList[s].id;
                        self.item = self.DieTypeList[s].items;
                        console.log(self.item)
                        break;
                    }
                }
            }
        })
    }
    dieTypeChange() {
        this.item = [];
        for (let i = 0; i < this.DieTypeList.length; i++) {
            if (this.DieTypeList[i].id == this.dieType) {
                this.item = this.DieTypeList[i].items;
                break;
            }
        }
    }
    saoyisao() {
        if (window['cordova']) {
            window['cordova'].plugins.barcodeScanner
                .scan((res) => {
                    if (res.text.length != 15) {
                        this.comm.toast('请扫描正确的条码');
                    } else {
                        this.list[0].form['AnimalId'] = res.text;
                        this.getSomeInfo();
                    }
                }, (e) => {
                    console.log(e)
                });
        }
    }
    intv: any;
    blueTooth() {
        this.bluetoothSerial.list().then(res => {
            if (res.length == 0) {
                this.searchBlue();
            } else if (res.length == 1) {
                let alert = this.alertCtrl.create();
                alert.setTitle('设备列表');
                alert.addInput({
                    type: 'radio',
                    label: res[0].name,
                    value: res[0].address,
                    checked: true
                });
                alert.addButton('取消');
                alert.addButton({
                    text: '确定',
                    handler: data => {
                        let loader = this.loadingCtrl.create({
                            content: "连接中...",
                            duration: 50000
                        });
                        loader.present();
                        this.bluetoothSerial.connect(data).subscribe(respone => {
                            loader.dismiss();
                            this.comm.toast('连接成功');
                            this.intv = setInterval(() => {
                                this.bluetoothSerial.read().then(mess => {
                                    if (mess) {
                                        this.list[0].form['AnimalId'] = this.comm.rfidDecode(mess, null);
                                        this.getSomeInfo();
                                        this.applicationRef.tick();
                                    }
                                }).catch(e => {
                                    console.log(e)
                                });
                            }, 1000)
                        }, e => {
                            console.log(e)
                        });
                    }
                });
                alert.present();
            } else {
                let alert = this.alertCtrl.create();
                alert.setTitle('设备列表');

                alert.addInput({
                    type: 'radio',
                    label: res[0].name,
                    value: res[0].address,
                    checked: true
                });
                for (let i = 1; i < res.length; i++) {
                    alert.addInput({
                        type: 'radio',
                        label: res[i].name,
                        value: res[i].address
                    });
                }
                alert.addButton('取消');
                alert.addButton({
                    text: '确定',
                    handler: data => {
                        let loader = this.loadingCtrl.create({
                            content: "连接中...",
                            duration: 50000
                        });
                        loader.present();
                        this.bluetoothSerial.connect(data).subscribe(respone => {
                            this.intv = setInterval(() => {
                                this.bluetoothSerial.read().then(mess => {
                                    if (mess) {
                                        this.list[0].form['AnimalId'] = this.comm.rfidDecode(mess, null);
                                        this.getSomeInfo();
                                        this.applicationRef.tick();
                                    }
                                }).catch(e => {
                                    console.log(e)
                                });
                            }, 1000);
                        }, e => {
                            console.log(e)
                        });
                    }
                });
                alert.present();
            }
        }).catch(e => {
            console.log(e)
        });
    }
    searchBlue() {
        this.bluetoothSerial.isEnabled().then(res => {
            let loader = this.loadingCtrl.create({
                content: "扫描中...",
                duration: 50000
            });
            loader.present();
            let boo = [];
            this.bluetoothSerial.discoverUnpaired().then(data => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name != undefined && data[i].name.indexOf('LF') > -1) {
                        boo.push(data[i]);
                    }
                }
                if (boo.length == 0) {
                    loader.dismiss();
                    this.searchBlue();
                } else {
                    let alert = this.alertCtrl.create();
                    alert.setTitle('设备列表');
                    if (boo.length == 1) {
                        alert.addInput({
                            type: 'radio',
                            label: boo[0].name,
                            value: boo[0].address,
                            checked: true
                        });
                        alert.addButton('取消');
                        alert.addButton({
                            text: '确定',
                            handler: data => {
                                this.bluetoothSerial.connect(data).subscribe(respone => {
                                    this.comm.toast('连接成功');
                                    loader.dismiss();
                                    this.intv = setInterval(() => {
                                        this.bluetoothSerial.read().then(mess => {
                                            if (mess) {
                                                this.list[0].form['AnimalId'] = this.comm.rfidDecode(mess, null);
                                                this.applicationRef.tick();
                                            }
                                        }).catch(e => {
                                            console.log(e)
                                        });
                                    }, 1000);
                                }, e => {
                                    console.log(e)
                                });
                            }
                        });
                        alert.present();
                    } else if (boo.length > 1) {
                        alert.addInput({
                            type: 'radio',
                            label: boo[0].name,
                            value: boo[0].address,
                            checked: true
                        });
                        for (let i = 1; i < boo.length; i++) {
                            alert.addInput({
                                type: 'radio',
                                label: boo[i].name,
                                value: boo[i].address
                            });
                        }
                        alert.addButton('取消');
                        alert.addButton({
                            text: '确定',
                            handler: data => {
                                this.bluetoothSerial.connect(data).subscribe(respone => {
                                    this.comm.toast('连接成功');
                                    loader.dismiss();
                                    this.bluetoothSerial.isConnected().then(message => {
                                        this.intv = setInterval(() => {
                                            this.bluetoothSerial.read().then(mess => {
                                                if (mess) {
                                                    this.list[0].form['AnimalId'] = this.comm.rfidDecode(mess, null);
                                                    this.applicationRef.tick();
                                                }
                                            }).catch(e => {
                                                console.log(e)
                                            });
                                        }, 1000);
                                    }).catch(e => {
                                        console.log(e)
                                    });
                                }, e => {
                                    console.log(e)
                                });
                            }
                        });
                        alert.present();
                    }
                }
            }).catch(e => {
                console.log(e)
            });
        }).catch(e => {
            this.bluetoothSerial.enable().then(res => {
            }).catch(e => {
                console.log(e)
            });
        });
    }
    getSomeInfo(){
        let self = this;
        this.sqlite.selecTableIDs('Underwriting','AnimalId',this.list[0].form['AnimalId']).then(res => {
            self.sqlite.selecTableIDAlls('PiliangUnderwriting',self.list[0].form['AnimalId'],'StartAnimalIds',self.list[0].form['AnimalId'],'EndAnimalIds').then(ress => {
                let arr = res.concat(ress);
                if(arr.length == 0){
                    self.comm.toast('请输入正确的耳标号');
                }else{
                    self.list[0].form['AnimalType'] = arr[0].name.AnimalType.split(',')[0];
                    self.list[0].form['AnimalTypeName'] = arr[0].name.AnimalType.split(',')[1];
                    self.list[0].form['Varieties'] = arr[0].name.Varieties.split(',')[0];
                    self.list[0].form['AnimalVarietyName'] = arr[0].name.Varieties.split(',')[1];
                    self.list[0].form['AnimalAge'] = arr[0].name.AnimalAge;
                    self.list[0].form['AnimalWeight'] = arr[0].name.AnimalWeight;
                    self.list[0].form['InsuranceAmount'] = arr[0].name.Insuredamount;
                    self.list[0].form['FindAddress'] = arr[0].name.breedadd.split(',')[1];
                }
            });
        });
    }
    unameBlur(ele) {
        if(ele){//获取动物标签号，数据自动同步
            this.getSomeInfo();
        }
        this.showBottom = true;
    }

    unamefocus() {
        this.showBottom = false;
    }
    backsss = (_params,ele) => {
        let self = this;
        return new Promise((resolve, reject) => {
            switch (ele){
                case 1:
                    if(_params.length == 0){
                        self.hasScene = false;
                    }else{
                        self.hasScene = true;
                        self.lenScene = _params.length;
                    }
                    self.Scene = _params;
                    self.list[0].form.Scene = _params.join(',');
                    break;
                case 2:
                    if(_params.length == 0){
                        self.hasHarmless = false;
                    }else{
                        self.hasHarmless = true;
                        self.lenHarmless = _params.length;
                    }
                    self.Harmless = _params;
                    self.list[0].form.Harmless = _params.join(',');
                    break;
                case 3:
                    if(_params.length == 0){
                        self.hasOther = false;
                    }else{
                        self.hasOther = true;
                        self.lenOther = _params.length;
                    }
                    self.Other = _params;
                    self.list[0].form.Other = _params.join(',');
                    break;
            }
            resolve();
        });
    };
    Otherss(ele){
        let self = this;
        let lists = [];
        let titles = '';
        switch (ele){
            case 1:
                lists = this.Scene;
                titles = '现场勘查图片';
                break;
            case 2:
                lists = this.Harmless;
                titles = '无害化处理图片';
                break;
            case 3:
                lists = this.Other;
                titles = '其他图片';
                break;
        }
        let modal = self.modalCtrl.create('GetLiPeiOtherPage', {
            callback: self.backsss,
            OtherPic: lists,
            myType: ele,
            titles: titles
        });
        modal.present();
    }
    tijiao(){
        let self = this;
        console.log(self.list[0])
       if(!this.hasScene||this.lenScene<3){
           this.comm.toast('请至少上传三张现场勘查图');
       }else if(!this.hasHarmless||this.lenHarmless<3){
            this.comm.toast('请至少上传三张无害化处理图');
       }else{
           this.sqlite.updataDeclareClaim(self.list[0].name, self.list[0].form)
               .then(res => {
                   console.log(self.list[0].name,self.list[0].form)
                   this.comm.toast('修改成功');
                   this.navCtrl.pop();
               }).catch(e => {
               console.log(e)
           });
       }
    }
    Diess(){
        let self = this;
        this.comm.chooseImage(1).then(res => {
            self.list[0].form.ForDie = res + '';
        })
    }
}
