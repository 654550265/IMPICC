import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { SQLiteObject } from "@ionic-native/sqlite";
import { ENV } from "../../config/environment";

/*
  Generated class for the DbProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DbProvider {

    db: SQLiteObject;

    constructor() {
        this.db = ENV.DB.database;
    }

     selectLocalFarmer(){
        return this.db.executeSql(`SELECT * FROM inframmessage WHERE (FramType='1' OR FramType='2' OR FramType='3') AND Isloc = '1'`, {})
        .then((res) => {
            let len = res.rows.length;
            let result = new Array(len);
            if(len > 0){
                for (let i = 0; i < len; i++) {
                    result.push(res.rows.item(i));
                }
            }
            return result;
        }).catch(err => {
            return new Array(0);
        });
    }

    selectLocalManyFarmer(){
        return this.db.executeSql(`SELECT * FROM inframmessage WHERE (FramType='4' OR FramType='5') AND Isloc = '1'`, {})
        .then((res) => {
            let len = res.rows.length;
            let result = [new Array(len)];
            if(len > 0){
                for (let i = 0; i < len; i++) {
                    result.push(res.rows.item(i));
                }
            }
            return result;
        }).catch(err => {
            return new Array(0);
        });
    }

    selectDownloadFarmer(type){
        let sqlstr = "";
        if(type === 1){
            sqlstr += " AND insuranceId <> ''";
        }
        return this.db.executeSql(`SELECT * FROM inframmessage WHERE ((Isloc = '2' OR Isloc='3') AND uid='${JSON.parse(localStorage.getItem('user')).AccountName}')${sqlstr}`, {})
        .then((res) => {
            let len = res.rows.length;
            let result = [];
            if(len > 0){
                for (let i = 0; i < len; i++) {
                    result.push({name: res.rows.item(i)});
                }
            }
            return result;
        }).catch(err => {
            return [];
        });
    }
}
