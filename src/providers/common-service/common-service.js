"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
var environment_1 = require("../../config/environment");
var CommonServiceProvider = (function () {
    function CommonServiceProvider(http, toastCtrl, jpushService, modalCtrl, loadingCtrl, media, actionSheetCtrl, camera, base64ToGallery) {
        this.http = http;
        this.toastCtrl = toastCtrl;
        this.jpushService = jpushService;
        this.modalCtrl = modalCtrl;
        this.loadingCtrl = loadingCtrl;
        this.media = media;
        this.actionSheetCtrl = actionSheetCtrl;
        this.camera = camera;
        this.base64ToGallery = base64ToGallery;
        this.rfidDecode = function (code, type) {
            code = code.replace(":FDXB=", "");
            type = type ? type : "ISO11784";
            var H_o_B = {
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
                    var codestr = "";
                    var stringArr = [];
                    for (var i = 0; i < code.length;) {
                        var str = H_o_B[code.charAt(i)] + H_o_B[code.charAt(i + 1)];
                        stringArr.push(str);
                        i += 2;
                    }
                    stringArr = stringArr.reverse();
                    codestr = stringArr.join("");
                    var aid_0 = codestr.substr(0, 1);
                    aid_0 = this.D_o_B(aid_0) + "";
                    var aid_1 = codestr.substr(1, 3);
                    aid_1 = this.D_o_B(aid_1) + "";
                    var aid_2 = codestr.substr(4, 5);
                    aid_2 = this.D_o_B(aid_2) + "";
                    var aid_3 = codestr.substr(9, 6);
                    aid_3 = this.D_o_B(aid_3) + "";
                    var aid_4 = codestr.substr(15, 1);
                    aid_4 = this.D_o_B(aid_4) + "";
                    var aid_5 = codestr.substr(16, 10);
                    aid_5 = this.D_o_B(aid_5) + "";
                    var aid_6 = codestr.substr(26, 38);
                    aid_6 = this.D_o_B(aid_6) + "";
                    code = this.prepend(aid_5, "0", 3) + this.prepend(aid_6, "0", 12);
                    break;
                default:
                    code = "";
            }
            return code;
        };
        this.options = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 800,
            targetHeight: 800,
            saveToPhotoAlbum: true
        };
    }
    CommonServiceProvider.prototype.newGuid = function () {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 36).toString(36);
            guid += n;
            if ((i == 8) || (i == 16) || (i == 24))
                guid += "-";
        }
        return guid;
    };
    CommonServiceProvider.prototype.toast = function (Msg) {
        var toast = this.toastCtrl.create({
            message: Msg,
            duration: 3000,
            position: 'top'
        });
        toast.present();
    };
    CommonServiceProvider.prototype.setRegID = function (newID) {
        this.regID = newID;
    };
    CommonServiceProvider.prototype.getRegID = function () {
        return this.regID;
    };
    CommonServiceProvider.prototype.initPush = function () {
        var _this = this;
        this.jpushService.init().then(function (res) {
            _this.jpushService.getRegistrationID()
                .then(function (res) {
                _this.setRegID(res);
                localStorage.setItem('regID', "" + res);
                _this.jpushService.openNotification()
                    .subscribe(function (res) {
                });
                _this.jpushService.receiveNotification()
                    .subscribe(function (res) {
                    var data = JSON.parse(res.extras.imobj);
                    if (data.pushType === 0) {
                        var user = JSON.parse(localStorage.getItem('user'));
                        var pwd = localStorage.getItem('pwd');
                        _this.http.post(environment_1.ENV.WEB_URL + "Login", {
                            uname: user.AccountName,
                            pwd: pwd
                        }).subscribe(function (res) {
                            var data = JSON.parse(res['_body']);
                            if (data.Status) {
                                localStorage.setItem('user', JSON.stringify(data.MyObject));
                            }
                        });
                    }
                });
                _this.jpushService.receiveMessage()
                    .subscribe(function (res) {
                    var data = JSON.parse(res.extras.imobj);
                    if (data.operateType == 'hangup') {
                        _this.stopmp3();
                        localStorage.setItem('calling', 'false');
                        _this.closeModal();
                    }
                    else {
                        if (JSON.parse(localStorage.getItem('calling'))) {
                            _this.http.get(environment_1.ENV.WEB_URL + "PiccImPush?fromUname=" + JSON.parse(localStorage.getItem('user')).AccountName + "&targetUname=" + data.fromUname + "&msgType=calling&operateType=dial&fromName=" + JSON.parse(localStorage.getItem('user')).RealName)
                                .subscribe(function (res) {
                            });
                        }
                        else {
                            if (data.msgType == 'voice' && data.operateType == 'dial') {
                                localStorage.setItem('calling', 'true');
                                _this.name = data.fromName;
                                _this.showCallPage(_this.name, data.msgType, data.fromUname);
                                _this.playmp3('/android_asset/www/assets/waite.mp3');
                            }
                            if (data.msgType == 'video' && data.operateType == 'dial') {
                                localStorage.setItem('calling', 'true');
                                _this.name = data.fromName;
                                _this.showCallPage(_this.name, data.msgType, data.fromUname);
                                _this.playmp3('/android_asset/www/assets/waite.mp3');
                            }
                            if (data.msgType == 'videoPC' && data.operateType == 'Connect') {
                                localStorage.setItem('calling', 'true');
                                _this.name = data.fromName;
                                _this.showCallPage(_this.name, data.msgType, data.fromUname);
                                _this.playmp3('/android_asset/www/assets/waite.mp3');
                            }
                            if (data.operateType == 'Connect' && data.msgType == 'voice') {
                                if (typeof agoravoice !== 'undefined') {
                                    _this.stopmp3();
                                    localStorage.setItem('calling', 'true');
                                    agoravoice.voiceCall(data.targetUname, data.fromUname, function (data) {
                                        if (data === "close") {
                                            localStorage.setItem('calling', 'false');
                                        }
                                    }, function (err) {
                                        console.log(err);
                                    });
                                    _this.closeModal();
                                }
                            }
                            if (data.operateType == 'Connect' && data.msgType == 'video') {
                                if (typeof agoravoice !== 'undefined') {
                                    _this.stopmp3();
                                    localStorage.setItem('calling', 'true');
                                    agoravoice.videoCall(data.targetUname, data.fromUname, function (data) {
                                        if (data === "close") {
                                            localStorage.setItem('calling', 'false');
                                        }
                                    }, function (err) {
                                        console.log(err);
                                    });
                                    _this.closeModal();
                                }
                            }
                        }
                    }
                    if (data.msgType == 'calling') {
                        _this.stopmp3();
                        _this.toast('对方正在通话中，请稍候在拨');
                        _this.closeModal();
                    }
                });
            })
                .catch(function (err) {
                _this.initPush();
            });
        });
    };
    CommonServiceProvider.prototype.showCallPage = function (realname, types, uname) {
        this.callModal = this.modalCtrl.create('WaiteVioPage', {
            realname: realname,
            type: types,
            unames: uname,
        });
        this.callModal.present();
    };
    CommonServiceProvider.prototype.closeModal = function () {
        if (this.callModal) {
            this.callModal.dismiss();
        }
        if (this.model) {
            this.model.dismiss();
        }
    };
    CommonServiceProvider.prototype.answer = function () {
        this.stopmp3();
    };
    CommonServiceProvider.prototype.hangup = function () {
        this.stopmp3();
    };
    CommonServiceProvider.prototype.mp3 = function (src) {
        this.file = this.media.create(src); //'/android_asset/www/assets/picc.mp3'
        this.file.onStatusUpdate.subscribe(function (status) { return console.log(status); });
        this.file.onSuccess.subscribe(function () { return console.log('Action is successful'); });
        this.file.onError.subscribe(function (error) { return console.log('Error!', error); });
        this.file.play();
    };
    CommonServiceProvider.prototype.playmp3 = function (src) {
        var _this = this;
        this.mp3(src);
        this.mp3Interval = setInterval(function () {
            _this.mp3(src);
        }, 8000);
    };
    CommonServiceProvider.prototype.stopmp3 = function () {
        clearInterval(this.mp3Interval);
        this.file.stop();
    };
    CommonServiceProvider.prototype.D_o_B = function (str) {
        var num = 0;
        var len = str.length;
        str = this.reverselh(str);
        for (var i = 0; i < len; i++) {
            var b = str.charAt(i);
            if (b != "0") {
                num += Math.pow(2, i);
            }
        }
        return num;
    };
    ;
    CommonServiceProvider.prototype.reverselh = function (code) {
        var codeArr = code.split("");
        codeArr = codeArr.reverse();
        return codeArr.join("");
    };
    ;
    CommonServiceProvider.prototype.ID64Decode = function (code) {
        code = code.replace(":ID64=", "");
        code = code.replace(/\r\n/g, '');
        return code;
    };
    ;
    CommonServiceProvider.prototype.prepend = function (code, str, num) {
        if (code.length < num) {
            var len = code.length;
            for (var i = 0; i < num - len; i++) {
                code = str + code;
            }
            return code;
        }
        else {
            return code.substr(0, num);
        }
    };
    ;
    CommonServiceProvider.prototype.getCurrentPosition = function () {
        var promise = new Promise(function (resolve) {
            function successCallback(position) {
                resolve(position);
            }
            ;
            function failedCallback(error) {
                resolve(error.describe);
            }
            baidu_location.getCurrentPosition(successCallback, failedCallback);
        });
        return promise;
    };
    CommonServiceProvider.prototype.addZero = function (res) {
        if (res < 10) {
            return '0' + res;
        }
        else {
            return res;
        }
    };
    CommonServiceProvider.prototype.dateFormat = function (date, format) {
        date = new Date(date);
        var o = {
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
        for (var k in o)
            if (new RegExp('(' + k + ')').test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        return format;
    };
    CommonServiceProvider.prototype.chooseImage = function (num) {
        var _this = this;
        var self = this;
        var str = localStorage.getItem("GPS");
        if (str) {
            this.lat = str.split(',')[0];
            this.long = str.split(',')[1];
        }
        else {
            this.getCurrentPosition().then(function (position) {
                _this.lat = position.latitude;
                _this.long = position.longitude;
                localStorage.setItem("GPS", _this.lat + "," + _this.long);
            }).catch(function (error) {
            });
        }
        return new Promise(function (resolve, reject) {
            var actionSheet = self.actionSheetCtrl.create({
                buttons: [
                    {
                        text: '相册上传',
                        role: 'destructive',
                        handler: function () {
                            self.options['sourceType'] = 0;
                            self.camera.getPicture(self.options).then(function (imageData) {
                                var canvas = document.createElement('canvas');
                                var cxt = canvas.getContext('2d');
                                var img = new Image();
                                var time = new Date();
                                var hour = time.getHours();
                                var min = time.getMinutes();
                                var seco = time.getSeconds();
                                var times = time.getFullYear() + '-' + self.addZero((time.getMonth() + 1)) + '-' + self.addZero(time.getDate()) + ' ' + self.addZero(hour) + '-' + self.addZero(min) + '-' + self.addZero(seco);
                                img.src = imageData;
                                img.onload = function () {
                                    var loading = self.loadingCtrl.create({
                                        content: ''
                                    });
                                    loading.present();
                                    canvas.height = img.height;
                                    canvas.width = img.width;
                                    cxt.fillStyle = '#fff';
                                    cxt.fillRect(0, 0, img.width, img.height);
                                    cxt.drawImage(img, 0, 0, img.width, img.height, img.width * 0.1, img.height * 0.1, img.width * 0.8, img.height * 0.8);
                                    cxt.save();
                                    var plx = img.width / 3288;
                                    cxt.font = 100 * plx + "px Arial";
                                    cxt.fillStyle = '#f00';
                                    if (img.width <= img.height) {
                                        cxt.fillText('PICC 姓名：' + JSON.parse(localStorage.getItem('user')).RealName, img.width * 0.05, 30);
                                        cxt.fillText('操作人：' + JSON.parse(localStorage.getItem('user')).AccountName, img.width * 0.7, 30);
                                        cxt.fillText('经度：' + self.long, img.width * 0.05 + 10, img.height * 0.95 - 90 * plx);
                                        cxt.fillText('纬度：' + self.lat, img.width * 0.05 + 1400 * plx, img.height * 0.95 - 90 * plx);
                                        cxt.fillText('坐标来源：GPS定位结果', img.width * 0.05, img.height * 0.95 + 140 * plx);
                                        cxt.fillText('[服务器]拍摄时间：' + times, img.width * 0.05 + 1300 * plx, img.height * 0.95 + 140 * plx);
                                    }
                                    else {
                                        cxt.fillText('PICC 姓名：' + JSON.parse(localStorage.getItem('user')).RealName, img.width * 0.05, 20);
                                        cxt.fillText('操作人：' + JSON.parse(localStorage.getItem('user')).AccountName, img.width * 0.7, 20);
                                        cxt.fillText('经度：' + self.long, img.width * 0.05 + 10, img.height * 0.95 - 90 * plx);
                                        cxt.fillText('纬度：' + self.lat, img.width * 0.05 + 1400 * plx, img.height * 0.95 - 90 * plx);
                                        cxt.fillText('坐标来源：GPS定位结果', img.width * 0.05, img.height * 0.95 + 100 * plx);
                                        cxt.fillText('[服务器]拍摄时间：' + times, img.width * 0.05 + 1300 * plx, img.height * 0.95 + 100 * plx);
                                    }
                                    var sd = canvas.toDataURL("image/png");
                                    self.base64ToGallery.base64ToGallery(sd, { prefix: '_img' }).then(function (res) {
                                        resolve('file://' + res);
                                        loading.dismiss();
                                    }, function (err) { return console.log('Error saving image to gallery ', err); });
                                };
                            }, function (err) {
                                console.log(err);
                            });
                        }
                    }, {
                        text: '拍照上传',
                        handler: function () {
                            self.options['sourceType'] = 1;
                            self.camera.getPicture(self.options).then(function (imageDatas) {
                                var canvas = document.createElement('canvas');
                                var cxt = canvas.getContext('2d');
                                var img = new Image();
                                var time = new Date();
                                var hour = time.getHours();
                                var min = time.getMinutes();
                                var seco = time.getSeconds();
                                var times = time.getFullYear() + '-' + self.addZero((time.getMonth() + 1)) + '-' + self.addZero(time.getDate()) + ' ' + self.addZero(hour) + '-' + self.addZero(min) + '-' + self.addZero(seco);
                                img.src = imageDatas;
                                img.onload = function () {
                                    var loading = self.loadingCtrl.create({
                                        content: ''
                                    });
                                    loading.present();
                                    canvas.height = img.height;
                                    canvas.width = img.width;
                                    cxt.fillStyle = '#fff';
                                    cxt.fillRect(0, 0, img.width, img.height);
                                    cxt.drawImage(img, 0, 0, img.width, img.height, img.width * 0.05, img.height * 0.05, img.width * 0.9, img.height * 0.8);
                                    cxt.save();
                                    var plx = img.width / 3288;
                                    cxt.font = 100 * plx + "px Arial";
                                    cxt.fillStyle = '#f00';
                                    if (img.width <= img.height) {
                                        cxt.fillText('姓名：' + JSON.parse(localStorage.getItem('user')).RealName, img.width * 0.05, 30);
                                        cxt.fillText('查勤人：' + JSON.parse(localStorage.getItem('user')).AccountName, img.width * 0.7, 30);
                                        cxt.fillText('经度：' + self.long, img.width * 0.05 + 10, img.height * 0.95 - 90 * plx);
                                        cxt.fillText('纬度：' + self.lat, img.width * 0.05 + 1400 * plx, img.height * 0.95 - 90 * plx);
                                        cxt.fillText('坐标来源：GPS定位结果', img.width * 0.05, img.height * 0.95 + 140 * plx);
                                        cxt.fillText('[服务器]拍摄时间：' + times, img.width * 0.05 + 1300 * plx, img.height * 0.95 + 140 * plx);
                                    }
                                    else {
                                        cxt.fillText('姓名：' + JSON.parse(localStorage.getItem('user')).RealName, img.width * 0.05, 20);
                                        cxt.fillText('查勤人：' + JSON.parse(localStorage.getItem('user')).AccountName, img.width * 0.7, 20);
                                        cxt.fillText('经度：' + self.long, img.width * 0.05 + 10, img.height * 0.95 - 90 * plx);
                                        cxt.fillText('纬度：' + self.lat, img.width * 0.05 + 1400 * plx, img.height * 0.95 - 90 * plx);
                                        cxt.fillText('坐标来源：GPS定位结果', img.width * 0.05, img.height * 0.95 + 100 * plx);
                                        cxt.fillText('[服务器]拍摄时间：' + times, img.width * 0.05 + 1300 * plx, img.height * 0.95 + 100 * plx);
                                    }
                                    var sd = canvas.toDataURL("image/png");
                                    self.base64ToGallery.base64ToGallery(sd, { prefix: '_img' }).then(function (res) {
                                        resolve('file://' + res);
                                        loading.dismiss();
                                    }, function (err) { return console.log('Error saving image to gallery ', err); });
                                };
                            }, function (err) {
                            });
                        }
                    }, {
                        text: '取消',
                        role: 'cancel',
                        handler: function () {
                        }
                    }
                ]
            });
            actionSheet.present();
        });
    };
    CommonServiceProvider.prototype.getText = function (text) {
        if (typeof text == 'string') {
            if (text.indexOf('&') > -1) {
                var lists = text.split('&');
                return lists[1];
            }
            else {
                var list = text.split(',');
                if (list.length == 1) {
                    return list[0];
                }
                if (list.length == 2) {
                    return list[1];
                }
                if (list.length == 3) {
                    var str = list[list.length - 1];
                    var newlist = str.split(':');
                    return newlist[1];
                }
                return text;
            }
        }
        else {
            return text;
        }
    };
    CommonServiceProvider.prototype.canvasText = function (str, sn, sxt, x, y) {
        if (str.length <= sn) {
            sxt.fillText(str, x, y);
        }
        else {
            var newstr = "";
            for (var i = 0; i < str.length; i += sn) {
                var tmp = str.substring(i, i + sn);
                newstr += tmp + ',';
            }
            var narr = newstr.split(',');
            for (var j = 0; j < narr.length; j++) {
                sxt.fillText(narr[j], x, y + (j + 1) * 20);
            }
        }
    };
    CommonServiceProvider.prototype.canvasTexts = function (str, sn, sxt, x, y) {
        if (str.length <= sn) {
            sxt.fillText(str, x, y);
        }
        else {
            var newstr = "";
            for (var i = 0; i < str.length; i += sn) {
                var tmp = str.substring(i, i + sn);
                newstr += tmp + ',';
            }
            var narr = newstr.split(',');
            for (var j = 0; j < narr.length; j++) {
                sxt.fillText(narr[j], x, y + (j + 1) * 14 - 23);
            }
        }
    };
    CommonServiceProvider.prototype.NoToChinese = function (n) {
        var unit = "京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分", str = "";
        n += "00";
        var p = n.indexOf('.');
        if (p >= 0)
            n = n.substring(0, p) + n.substr(p + 1, 2);
        unit = unit.substr(unit.length - n.length);
        for (var i = 0; i < n.length; i++)
            str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
        return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(兆|万|亿|元)/g, "$1").replace(/(兆|亿)万/g, "$1").replace(/(京|兆)亿/g, "$1").replace(/(京)兆/g, "$1").replace(/(京|兆|亿|仟|佰|拾)(万?)(.)仟/g, "$1$2零$3仟").replace(/^元零?|零分/g, "").replace(/(元|角)$/g, "$1整");
    };
    CommonServiceProvider.prototype.isRepeat = function (arr) {
        var hash = {};
        for (var i in arr) {
            if (hash[arr[i]])
                return true;
            hash[arr[i]] = true;
        }
        return false;
    };
    CommonServiceProvider.prototype.changeTime = function (strattime, len) {
        if (typeof strattime == 'string') {
            var list = strattime.split('-');
            var year = parseInt(list[0]);
            var mon = parseInt(list[1]);
            if (mon + len > 12) {
                year++;
                mon = mon + len - 12;
            }
            else {
                mon += len;
            }
            return year + "-" + (mon < 10 ? '0' + mon : mon) + "-" + list[2];
        }
    };
    CommonServiceProvider.prototype.DateMinus = function (sDate, eDate) {
        var sdate = new Date(sDate.replace(/-/g, "/"));
        var end = new Date(eDate.replace(/-/g, "/"));
        var days = end.getTime() - sdate.getTime();
        var dayss = days / 86400000 + '';
        var day = parseInt(dayss);
        return day;
    };
    CommonServiceProvider.prototype.checkNum = function (str) {
        var reg = /^\d+(\.\d+)?$/;
        if (reg.test(str)) {
            return true;
        }
        else {
            return false;
        }
    };
    return CommonServiceProvider;
}());
CommonServiceProvider = __decorate([
    core_1.Injectable()
], CommonServiceProvider);
exports.CommonServiceProvider = CommonServiceProvider;
