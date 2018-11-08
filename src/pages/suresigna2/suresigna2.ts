import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams,LoadingController} from 'ionic-angular';
import {SqllistServiceProvider} from "../../providers/sqllist-service/sqllist-service";
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { CommonServiceProvider } from "../../providers/common-service/common-service";
import { XuCanvasPage } from "../xu-canvas/xu-canvas";
/**
 * Generated class for the Suresigna2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-suresigna2',
  templateUrl: 'suresigna2.html',
})
export class Suresigna2Page {
    guid: string;
    mycard: string;
    stp: string;
    loading:any;
    qianNum: Number;
    qianImg: string;
    qianName: string;
    purArr: Array<any>;
    hasQian: boolean;
    buzhou: string;
    cunImg: string;
    allLen: string;
    constructor(public navCtrl: NavController, public navParams: NavParams, public sqlite: SqllistServiceProvider,public loadingCtrl: LoadingController,private base64ToGallery: Base64ToGallery,public photoViewer: PhotoViewer, public comm: CommonServiceProvider) {
        let self = this;
        this.guid = this.navParams.get('FramGuid');
        this.stp = this.navParams.get('type');
        this.qianName = '兽医签字';
        this.hasQian = false;
        this.loading = self.loadingCtrl.create({
            content: ''
        });
        this.loading.present();
        this.sqlite.selecTableIDs('InsuredFarmer','FramGuid',this.guid).then(res => {
            self.sqlite.selecTableIDs('DeclareClaimTable','FramGuid',this.guid).then(ress => {
                self.purArr = ress;
                if(res[0].name.canvasImg){
                    let s = res[0].name.canvasImg.split('&')[1];
                    switch (s){
                        case '1':
                            self.qianName = '兽医签字';
                            self.qianNum = 1;
                            break;
                        case '2':
                            self.qianName = '被保险人签名';
                            self.qianNum = 2;
                            break;
                        case '3':
                            self.qianName = '查勘员签名';
                            self.qianNum = 3;
                            break;
                        case '4':
                            if(ress.length>2){
                                self.buzhou = '查看详情';
                            }else{
                                self.buzhou = '完成';
                            }
                            self.hasQian = true;
                            self.qianNum = 4;
                            break;
                    }
                    self.mycard = res[0].name.canvasImg.split('&')[0];
                    this.loading.dismiss();
                }else{
                    self.sqlite.selecTableIDs('Underwriting','FramPeopleId',res[0].name.idCard).then(fa=>{
                        self.sqlite.selecTableIDs('PiliangUnderwriting','FramPeopleId',res[0].name.idCard).then(fas=>{
                            let len = 0;
                            if(fas.length!=0){
                                for(let a = 0;a<fas.length;a++){
                                    len = len+(fas[a].name.EndAnimalIds-fas[a].name.StartAnimalIds+1)
                                }
                            }
                            len = len+fa.length;
                            self.allLen = len+'';
                            self.showCanvas(res,ress);
                        })
                    })

                }
            });

        });

    }
    showCanvas(data,datas){
        let self = this;
        let canvas = document.createElement('canvas');
        let cxt = canvas.getContext('2d');
        let img = new Image();
        img.src = './assets/icon/baodan2.jpg';
        img.onload = () => {
            canvas.height = 1684;
            canvas.width = 1191;
            cxt.fillStyle = '#fff';
            cxt.fillRect(0, 0, 1191, 1684);
            cxt.drawImage(img, 0, 0, 1191, 1684, 0, 0, 1191, 1684);
            cxt.save();
            cxt.font = "18px Arial";
            cxt.fillStyle = '#000';
            //保单号
            cxt.fillText(data[0].name.insuranceId, 288, 215);
            //报案号
            cxt.fillText(data[0].name.BanNum, 780, 215);
            //报案时间
            let baTime = '';
            if(data[0].name.reportDate.indexOf('/')>0){
                baTime = data[0].name.reportDate.split('/');
            }else{
                baTime = data[0].name.reportDate.split('-');
            }
            cxt.fillText(baTime[0], 303, 303);//年
            cxt.fillText(baTime[1].length==1?'0'+baTime[1]:baTime[1], 398, 303);//月
            cxt.fillText(baTime[2].length==1?'0'+baTime[2]:baTime[2], 470, 303);//日
            //出险日期
            let cxTime = '';
            if(data[0].name.outDate.indexOf('/')>0){
                cxTime = data[0].name.outDate.split('/');
            }else{
                cxTime = data[0].name.outDate.split('-');
            }
            cxt.fillText(cxTime[0], 303, 345);//年
            cxt.fillText(cxTime[1].length==1?'0'+cxTime[1]:cxTime[1], 398, 345);//月
            cxt.fillText(cxTime[2].length==1?'0'+cxTime[2]:cxTime[2], 470, 345);//日
            //查勘时间
            let ckTime = datas[0].name.Time.split('/')
            cxt.fillText(ckTime[0], 303, 455);//年
            cxt.fillText(ckTime[1], 398, 455);//月
            cxt.fillText(ckTime[2], 470, 455);//日
            cxt.fillText(ckTime[3], 545, 455);//时
            //被保险人
            cxt.fillText(data[0].name.name, 780, 303);
            //出险地点
            if(datas[0].name.FindAddress == 'undefined'){
                datas[0].name.FindAddress = '';
            }
            cxt.fillText(datas[0].name.FindAddress, 746, 345);//县
            // cxt.fillText('哈哈', 852, 345);//乡
            // cxt.fillText('嘻嘻', 1002, 345);//村
            //保险期间
            let sTime = '';
            if(data[0].name.startTime.indexOf('/')>0){
                sTime = data[0].name.startTime.split('/');
            }else{
                sTime = data[0].name.startTime.split('-');
            }
            let eTime = '';
            if(data[0].name.endTime.indexOf('/')>0){
                eTime = data[0].name.endTime.split('/');
            }else{
                eTime = data[0].name.endTime.split('-');
            }
            cxt.fillText(sTime[0], 775, 400);//年
            cxt.fillText(sTime[1].length==1?'0'+sTime[1]:sTime[1], 840, 400);//月
            cxt.fillText(sTime[2].length==1?'0'+sTime[2]:sTime[2], 880, 400);//日
            cxt.fillText(eTime[0], 938, 400);//年
            cxt.fillText(eTime[1].length==1?'0'+eTime[1]:eTime[1], 999, 400);//月
            cxt.fillText(eTime[2].length==1?'0'+eTime[2]:eTime[2], 1038, 400);//日
            //实际存栏数量
            cxt.fillText(self.allLen, 315, 510);
            //投保数量
            cxt.fillText(self.allLen, 610, 510);
            //核定死亡数量
            cxt.fillText(datas.length+'', 910, 510);
            //识别码
            cxt.fillText(datas[0].name.AnimalId, 265, 594);
            if(datas[0].name.AnimalTypeName != '猪'){
                datas[0].name.AnimalAge = datas[0].name.AnimalAge*12+'';
            }
            cxt.fillText(datas[0].name.AnimalAge, 570, 594);//畜龄
            cxt.fillText(datas[0].name.AnimalWeight, 658, 594);//体重
            cxt.fillText(datas[0].name.InsuranceAmount, 758, 594);//单位保额
            cxt.fillText(datas[0].name.FinalMoney, 890, 594);//核定金额
            if(datas[1]){
                if(datas[1].name.AnimalTypeName != '猪'){
                    datas[1].name.AnimalAge = datas[1].name.AnimalAge*12+'';
                }
                cxt.fillText(datas[1].name.AnimalId, 265, 635);
                cxt.fillText(datas[1].name.AnimalAge, 570, 635);//畜龄
                cxt.fillText(datas[1].name.AnimalWeight, 658, 635);//体重
                cxt.fillText(datas[1].name.InsuranceAmount, 758, 635);//单位保额
                cxt.fillText(datas[1].name.FinalMoney, 890, 635);//核定金额
            }
            //体征情况
            let tizheng = data[0].name.remarks;
            self.comm.canvasTextK(tizheng,35,52,cxt,170,684,274);
            //赔款合计
            let allM = 0;
            for(let i = 0;i<datas.length;i++){
                allM += datas[i].name.FinalMoney-0
            }
            let ball = self.comm.NoToChinese(allM);
            let allmA = (allM+'').split('.');
            let shuzi = allmA[0].split('');
            // showBigNum
            let wan,qian,bai,shi,yuan,jiao,fen;
            if(allmA[0].length<1){
                wan = '零';qian = '零';bai = '零';shi = '零';yuan = '零';
            }else if(allmA[0].length<2){
                wan = '零';qian = '零';bai = '零';shi = '零';yuan = self.showBigNum(shuzi[0]);
            }else if(allmA[0].length<3){
                wan = '零';qian = '零';bai = '零';shi = self.showBigNum(shuzi[0]);yuan = self.showBigNum(shuzi[1]);
            }else if(allmA[0].length<4){
                wan = '零';qian = '零';bai = self.showBigNum(shuzi[0]);shi = self.showBigNum(shuzi[1]);yuan = self.showBigNum(shuzi[2]);
            }else if(allmA[0].length<5){
                wan = '零';qian = self.showBigNum(shuzi[0]);bai = self.showBigNum(shuzi[1]);shi = self.showBigNum(shuzi[2]);yuan = self.showBigNum(shuzi[3]);
            }else{
                let t1 = ball.split('万');
                let t2 = allmA[0].substring(allmA[0].length-4,allmA[0].length);
                let t3 = t2.split('');
                wan = t1[0];qian = self.showBigNum(t3[0]);bai = self.showBigNum(t3[1]);shi = self.showBigNum(t3[2]);yuan = self.showBigNum(t3[3]);
            }
            if(allmA[1]){
                if(allmA[1].length == 1){
                    let s1 = ball.split('元');
                    jiao = s1[1].split('角')[0];
                    fen = '零';
                }else if(allmA[1].length == 2){
                    let s1 = allmA[1].split('');
                    jiao = self.showBigNum(s1[0]);
                    fen = self.showBigNum(s1[1]);
                }
            }else{
                jiao = '零';
                fen = '零';
            }
            cxt.fillText(wan, 345, 808);
            cxt.fillText(qian, 432, 808);
            cxt.fillText(bai, 509, 808);
            cxt.fillText(shi, 570, 808);
            cxt.fillText(yuan, 640, 808);
            cxt.fillText(jiao, 710, 808);
            cxt.fillText(fen, 790, 808);
            cxt.fillText(allM+'', 890, 808);
            //户名
            cxt.fillText(data[0].name.name, 195, 906);
            //开户行
            cxt.fillText(data[0].name.bankName, 210, 942);
            //银行账号
            cxt.fillText(data[0].name.bankAccount, 230, 975);
            //身份证号
            cxt.fillText(data[0].name.idCard, 230, 1040);
            //联系电话
            cxt.fillText(data[0].name.contactNumber, 230, 1073);
            //住址
            let address = data[0].name.address;
            self.comm.canvasTextK(address, 26, 28,cxt,142,1098,46);
            //防疫情况
            let fangyi = datas[0].name.FangyiType;
            self.comm.canvasTextK(fangyi, 19, 24,cxt,642,872,94);
            //死亡原因
            let die = datas[0].name.DieMessage.split(',')[1];
            self.comm.canvasTextK(die, 19, 24,cxt,642,938,94);
            //处理情况
            // let chuli = '啊实打实接地气戊二醛翁一起玩饿哦IQ无哦诶富瀚微顾费用我抛弃我啊实打实接地气戊二醛翁一起玩饿哦IQ无哦诶富瀚微顾费用我抛弃我';
            // self.comm.canvasTextK(chuli, 13, 24,cxt,642,1010,218);
            //责任意见
            let zeren = '属于保险责任，同意受理';
            self.comm.canvasTextK(zeren, 15, 24,cxt,642,1324,172);
            let imgs = new Image();
            imgs.src = './assets/icon/yes.png';
            imgs.onload = () =>{
                //报案人
                // if('被保险人'){
                //     cxt.drawImage(imgs, 0, 0, 21,25, 291, 234, 21, 25);
                // }else{
                //     cxt.drawImage(imgs, 0, 0, 21,25, 411, 234, 21, 25);
                // }
                cxt.drawImage(imgs, 0, 0, 21,25, 411, 234, 21, 25);
                cxt.save();
                let imgss = new Image();
                imgss.src = './assets/icon/yes.png';
                imgss.onload = () =>{
                    //出险标的
                    if(datas[0].name.AnimalVarietyName == '能繁母猪'){
                        cxt.drawImage(imgss, 0, 0, 21,25, 291, 359, 21, 25);
                    }else if(datas[0].name.AnimalVarietyName == '育肥猪'){
                        cxt.drawImage(imgss, 0, 0, 21,25, 418, 359, 21, 25);
                    }else if(datas[0].name.AnimalVarietyName == '奶牛'){
                        cxt.drawImage(imgss, 0, 0, 21,25, 531, 359, 21, 25);
                    }else{
                        cxt.drawImage(imgss, 0, 0, 21,25, 291, 392, 21, 25);
                        cxt.fillText(datas[0].name.AnimalVarietyName, 382, 415);
                    }
                    let imgsss = new Image();
                    imgsss.src = './assets/icon/yes.png';
                    imgsss.onload = () =>{
                        //查勘地点
                        // if('1'){
                        //     cxt.drawImage(imgsss, 0, 0, 21,25, 749, 430, 21, 25);
                        // }else{
                        //     cxt.drawImage(imgsss, 0, 0, 21,25, 870, 430, 21, 25);
                        //     cxt.fillText('鸡鸭鱼肉', 938, 455);
                        // }
                        cxt.drawImage(imgsss, 0, 0, 21,25, 749, 430, 21, 25);
                        cxt.save();
                        let imgssss = new Image();
                        imgssss.src = './assets/icon/yes.png';
                        imgssss.onload = () =>{
                            //账户形式
                            cxt.drawImage(imgssss, 0, 0, 21,25, 313, 985, 21, 25);
                            cxt.save();
                            let imgsssss = new Image();
                            imgsssss.src = './assets/icon/yes.png';
                            imgsssss.onload = () =>{
                                //处理方式
                                if(datas[0].name.WuHaiHua == '焚烧'){
                                    cxt.drawImage(imgsssss, 0, 0, 21,25, 663, 1070, 21, 25);
                                }else if(datas[0].name.WuHaiHua == '深埋'){
                                    cxt.drawImage(imgsssss, 0, 0, 21,25, 734, 1070, 21, 25);
                                }else if(datas[0].name.WuHaiHua == '化学池'){
                                    cxt.drawImage(imgsssss, 0, 0, 21,25, 803, 1070, 21, 25);
                                }else{
                                    cxt.drawImage(imgsssss, 0, 0, 21,25, 894, 1070, 21, 25);
                                    // cxt.fillText('鸡鸭鱼肉', 960, 1094);
                                }
                                cxt.save();
                                let sd = canvas.toDataURL("image/png");
                                self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
                                    res => {
                                        self.loading.dismiss();
                                        self.cunImg = 'file://' + res+'&1';
                                        self.mycard = 'file://' + res;
                                        self.sqlite.updateQians(self.cunImg, self.guid, 'canvasImg')
                                            .then(res => {
                                            });
                                    },
                                    err => console.log('Error saving image to gallery ', err)
                                );
                            }
                        }
                    }
                }
            }
        }
    }
    ionViewDidEnter(){
        let card = this.mycard;
        let self = this;
        //兽医签字
        if(self.qianImg&&self.qianImg!=''){
            this.loading = self.loadingCtrl.create({
                content: ''
            });
            this.loading.present();
            setTimeout(function () {
                self.showQian(card,self.qianImg,self.qianNum)
            },200)
        }

    }
    showBigNum(ele){
        let s = '';
        switch (ele){
            case '0':
                s = '零';
                break;
            case '1':
                s = '壹';
                break;
            case '2':
                s = '贰';
                break;
            case '3':
                s = '叁';
                break;
            case '4':
                s = '肆';
                break;
            case '5':
                s = '伍';
                break;
            case '6':
                s = '陆';
                break;
            case '7':
                s = '柒';
                break;
            case '8':
                s = '捌';
                break;
            case '9':
                s = '镹';
                break;
        }
        return s;
    }
    showQian(data,url,sn){
        let self = this;
        let dates = new Date();
        let year = dates.getFullYear()+'';
        let month = dates.getMonth() + 1+'';
        let strDate = dates.getDate()+'';
        if (month.length == 1) {
            month = "0" + month;
        }
        if (strDate.length == 1) {
            strDate = "0" + strDate;
        }
        let canvas = document.createElement('canvas');
        let cxt = canvas.getContext('2d');
        let img = new Image();
        img.src = data;
        img.onload = () => {
            canvas.height = 1684;
            canvas.width = 1191;
            cxt.font = "18px Arial";
            cxt.fillStyle = '#000';
            cxt.fillRect(0, 0, 1191, 1684);
            cxt.drawImage(img, 0, 0, 1191, 1684, 0, 0, 1191, 1684);
            cxt.save();
            let imgs = new Image();
            imgs.src = url;
            imgs.onload = () => {
                if(self.qianNum == 1){
                    cxt.drawImage(imgs, 0, 0, 800,1000, 708, 1155, 200, 250);
                    cxt.fillText(year, 862, 1292);
                    cxt.fillText(month, 952, 1292);
                    cxt.fillText(strDate, 1010, 1292);
                }else if(self.qianNum == 2){
                    cxt.drawImage(imgs, 0, 0, 800,1000, 228, 1410, 200, 250);
                    cxt.fillText(year, 370, 1532);
                    cxt.fillText(month, 464, 1532);
                    cxt.fillText(strDate, 513, 1532);
                }else{
                    cxt.drawImage(imgs, 0, 0, 800,1000, 708, 1440, 200, 250);
                    cxt.fillText(year, 862, 1532);
                    cxt.fillText(month, 952, 1532);
                    cxt.fillText(strDate, 1010, 1532);
                }
                // cxt.drawImage(imgs, 0, 0, 800,1000, 508, 1540, 200, 250);
                cxt.save();
                setTimeout(function () {
                    let sd = canvas.toDataURL("image/png");
                    self.base64ToGallery.base64ToGallery(sd, {prefix: '_img'}).then(
                        res => {
                            self.loading.dismiss();
                            self.mycard = 'file://' + res;
                            let str = '';
                            if(self.qianNum == 1){
                                str = self.mycard+'&2';
                            }else if(self.qianNum == 2){
                                str = self.mycard+'&3';
                            }else if(self.qianNum == 3){
                                str = self.mycard+'&4';
                            }
                            self.sqlite.updateQians(str, self.guid, 'canvasImg')
                                .then(res => {

                                });
                            self.qianNum = sn+1;
                        },
                        err => console.log('Error saving image to gallery ', err)
                    );
                },500)
            }
        }
    }
    backsss = (_params,qianNum) => {
        let self = this;
        return new Promise((resolve, reject) => {
            self.qianNum = qianNum;
            self.qianImg = _params;
            if(qianNum == 1){
                this.qianName = '被保险人签名'
            }else if(qianNum == 2){
                this.qianName = '查勘员签名'
            }else{
                if(self.purArr.length>2){
                    self.hasQian = true;
                    self.buzhou = '下一步';
                }else{
                    self.hasQian = true;
                    self.buzhou = '完成';
                }
            }
            resolve();
        });
    };
    gotoXuCanvasPage() {
        this.navCtrl.push(XuCanvasPage, {
            FramGuid: this.guid,
            type: this.stp,
            backs:this.backsss,
            qianNum: this.qianNum
        });
    }
    showPhoto() {
        this.photoViewer.show(this.mycard);
    }
    gotoFenPage(ele) {
        let self = this;
        if(ele == 2){
            if(this.purArr.length>2){
                this.navCtrl.push('Suresigna3Page', {
                    FramGuid: this.guid,
                    type: this.stp
                });
            }else{
                this.navCtrl.pop();
            }

        }else{
            if(!self.qianNum||self.qianNum==1||self.qianNum==undefined){
                self.cunImg = self.mycard+'&2';
                self.sqlite.updateQians(self.cunImg, self.guid, 'canvasImg')
                    .then(res => {
                        self.qianName = '被保险人签名';
                        self.qianNum = 2;
                        self.cunImg = self.mycard+'&3';
                    });
            }else if(self.qianNum == 2){
                self.sqlite.updateQians(self.cunImg, self.guid, 'canvasImg')
                    .then(res => {
                        self.qianName = '查勘员签名'
                        self.qianNum = 3;
                        self.cunImg = self.cunImg+'&4';
                    });
            }else{

                self.comm.toast('查勘员必须签字')
            }

        }

    }
}
