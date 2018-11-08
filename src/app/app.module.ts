import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from "@ionic/storage";
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { LoginPage } from "../pages/login/login";
import { HttpModule } from "@angular/http";
import { Toast } from "@ionic-native/toast";
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { CommonServiceProvider } from '../providers/common-service/common-service';
import { BhomePage } from "../pages/bhome/bhome";
import { BpeiPage } from "../pages/bpei/bpei";
import { BmyPage } from "../pages/bmy/bmy";
import { TabsPage } from "../pages/tabs/tabs";
import { SignaturePadModule } from "angular2-signaturepad";
import { IonJPushModule } from 'ionic2-jpush';
import { Media } from '@ionic-native/media';
import { Camera } from "@ionic-native/camera";
import { FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
import { SqllistServiceProvider } from '../providers/sqllist-service/sqllist-service';
import { SQLite } from "@ionic-native/sqlite";
import { Base64ToGallery } from "@ionic-native/base64-to-gallery";
import { CanvasPage } from "../pages/canvas/canvas";
import { XuCanvasPage } from "../pages/xu-canvas/xu-canvas";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";
import { ZBar } from "@ionic-native/zbar";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { Crop } from "@ionic-native/crop";
import { FileOpener } from "@ionic-native/file-opener";
import { AndroidPermissions } from "@ionic-native/android-permissions";
import { DatePicker } from "@ionic-native/date-picker";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DbProvider } from "../providers/db/db";
import { CameraPreview } from "@ionic-native/camera-preview";
import { PhotoLibrary } from "@ionic-native/photo-library";
// import { AppFilerPipPipe } from "../pipes/app-filer-pip/app-filer-pip";

@NgModule({
    declarations: [MyApp, HomePage, TabsPage, ListPage, LoginPage, BhomePage, BpeiPage, BmyPage, CanvasPage, XuCanvasPage//, AppFilerPipPipe
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot(MyApp, {
            backButtonText: '',
            tabsHideOnSubPages: true
        }),
        SignaturePadModule,
        HttpModule,
        IonJPushModule,
        IonicStorageModule.forRoot(),
    ],
    bootstrap: [IonicApp],
    entryComponents: [MyApp, HomePage, TabsPage, ListPage, LoginPage, BhomePage, BpeiPage, BmyPage, CanvasPage, XuCanvasPage
    ],
    providers: [
        BluetoothSerial,
        StatusBar,
        SplashScreen,
        Toast,
        Keyboard,
        Geolocation,
        Camera,
        FileTransfer,
        ZBar,
        File,
        PhotoViewer,
        Base64ToGallery,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        AuthServiceProvider,
        CommonServiceProvider,
        SqllistServiceProvider,
        Media,
        SQLite,
        Crop,
        FileOpener,
        AndroidPermissions,
        DatePicker,
        DbProvider,
        CameraPreview,
        PhotoLibrary,
    ]
})
export class AppModule {
}
