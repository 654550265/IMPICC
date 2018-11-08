"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
/**
 * Generated class for the Suresigna2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var Suresigna2Page = (function () {
    function Suresigna2Page(navCtrl, navParams, sqlite, loadingCtrl, base64ToGallery, photoViewer, comm, file) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.sqlite = sqlite;
        this.loadingCtrl = loadingCtrl;
        this.base64ToGallery = base64ToGallery;
        this.photoViewer = photoViewer;
        this.comm = comm;
        this.file = file;
        this.guid = this.navParams.get('FramGuid');
        this.stp = this.navParams.get('type');
        this.showCanvas();
    }
    Suresigna2Page.prototype.showCanvas = function () {
        var self = this;
        var canvas = document.createElement('canvas');
        var cxt = canvas.getContext('2d');
        var img = new Image();
        img.src = './assets/icon/baodan2.jpg';
        img.onload = function () {
            // let loading = self.loadingCtrl.create({
            //     content: ''
            // });
            // loading.present();
            canvas.height = 1684;
            canvas.width = 1191;
            cxt.fillStyle = '#fff';
            cxt.fillRect(0, 0, 1191, 1684);
            cxt.drawImage(img, 0, 0, 1191, 1684, 0, 0, 1191, 1684);
            cxt.save();
            var sd = canvas.toDataURL("image/png");
            self.base64ToGallery.base64ToGallery(sd, { prefix: '_img' }).then(function (res) {
                self.mycard = 'file://' + res;
            }, function (err) { return console.log('Error saving image to gallery ', err); });
        };
    };
    return Suresigna2Page;
}());
Suresigna2Page = __decorate([
    ionic_angular_1.IonicPage(),
    core_1.Component({
        selector: 'page-suresigna2',
        templateUrl: 'suresigna2.html',
    })
], Suresigna2Page);
exports.Suresigna2Page = Suresigna2Page;
