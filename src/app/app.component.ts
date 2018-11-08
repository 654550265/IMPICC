import { CommonServiceProvider } from './../providers/common-service/common-service';
import { Component, ViewChild } from '@angular/core';
import {
    App, Nav, Platform, ToastController, Keyboard, AlertController, MenuController,
    ViewController, IonicApp
} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage";
import { HomePage } from '../pages/home/home';
import { TabsPage } from "../pages/tabs/tabs";
import { LoginPage } from "../pages/login/login";
import { ENV } from "../config/environment";
import { SqllistServiceProvider } from "../providers/sqllist-service/sqllist-service";
import { AuthServiceProvider } from "../providers/auth-service/auth-service";
import { AndroidPermissions } from "@ionic-native/android-permissions";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any;
    realName: string;
    pages: Array<{ title: string, src: string, component: any, acv: boolean }>;

    constructor(public ionicApp: IonicApp, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage, public toastCtrl: ToastController, public commonService: CommonServiceProvider, public sql: SqllistServiceProvider, public keyboard: Keyboard, public app: App, public alertCtrl: AlertController, public menu: MenuController, public http: AuthServiceProvider, private androidPermissions: AndroidPermissions) {
        window['VERSION'] = '2.6.2';
        // window['IPS'] = 'https://picc.realidfarm.com/api/';
        this.realName = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).RealName : '';
        if (ENV.USER == null) {
            this.rootPage = LoginPage;
        } else {
            if (ENV.USER.UserType == 5 || ENV.USER.UserType == 6) {
                this.rootPage = HomePage;
            } else {
                this.rootPage = TabsPage;
            }
        }
        localStorage.setItem('calling', 'false');
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            let timePeriodToExit = 3000;
            let lastTimeBackPress;
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.keyboard.close();
            this.platform.registerBackButtonAction(() => {
                if (this.keyboard.isOpen()) {
                    return;
                }
                let nav = this.app.getActiveNav();
                let activeView: ViewController = nav.getActive();
                let activePortal = this.ionicApp._modalPortal.getActive();
                if (activePortal) {
                    activePortal.dismiss().catch(() => {
                    });
                    return;
                }
                if (activeView != null) {
                    if (nav.canGoBack()) {
                        nav.pop();
                    } else {
                        if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
                            this.platform.exitApp(); //Exit from app
                        } else {
                            let toast = this.toastCtrl.create({
                                message: '再按一次退出应用',
                                duration: 2000,
                                position: 'top',
                            });
                            toast.present();
                            lastTimeBackPress = new Date().getTime();
                        }
                    }
                }
            });
            if (window['cordova']) {
                let location = this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION;
                let WRITE_EXTERNAL_STORAGE = this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE;
                this.androidPermissions.checkPermission(location).then(res => {
                    if (!res.hasPermission) {
                        this.androidPermissions.requestPermission(location).then(mess => {})
                    }
                });
                this.androidPermissions.checkPermission(WRITE_EXTERNAL_STORAGE).then(res => {
                    if (!res.hasPermission) {
                        this.androidPermissions.requestPermission(WRITE_EXTERNAL_STORAGE).then(mess => {})
                    }
                });
                this.sql.creatTable();
                this.commonService.initPush();
            }
            this.commonService.needModifyPwd();
            window.addEventListener('native.keyboardshow', (event) => {
                document.body.classList.add('keyboard-open');
            });
            window.addEventListener('native.keyboardhide', () => {
                document.body.classList.remove('keyboard-open');
            });
        });
    }

    openNsetPage() {
        this.nav.push('NsetPage');
    }

    openFramSpecPage() {
        this.nav.push('FramSpecPage');
    }

    about() {
        this.nav.push('AboutPage');
    }

    logout() {

        let confirm = this.alertCtrl.create({
            title: '提示',
            message: '确定退出登录吗？',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                    }
                },
                {
                    text: '确定',
                    handler: () => {
                        localStorage.clear();
                        this.nav.setRoot(LoginPage);
                    }
                }
            ]
        });
        confirm.present();
    }
}
