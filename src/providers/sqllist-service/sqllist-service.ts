import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from "@ionic-native/sqlite";
import { ENV } from "../../config/environment";

@Injectable()
export class SqllistServiceProvider {
    constructor(private sqlite: SQLite) {

    }

    database: SQLiteObject;

    creatTable() {
        this.sqlite.create({
            name: 'impiccdata.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
            for (let key in ENV.DATA_TABLE) {
                let col = ENV.DATA_TABLE[key];
                let query = 'CREATE TABLE IF NOT exists ' + key + '(';
                query += 'id integer PRIMARY KEY autoincrement,';
                for (let i = 0; i < col.length; i++) {
                    query += `${col[i].name} ${col[i].type} ${col[i].ISNull},`;
                }
                query += 'uid TEXT NOT NULL,Isloc TEXT NOT NULL)';
                db.executeSql(`${query}`, {})
                .then((res) => {
                }).catch(e => {
                    console.log(e)
                });
            }
            this.database = db;
            ENV.DB.database = db;
        }).catch();
    }

    newinster(table, shuju: object) {
        let insterQuery = `INSERT INTO ${table}(`;
        for (let keys in shuju) {
            insterQuery += `${keys},`;
        }
        insterQuery += 'uid) VALUES(';
        for (let keyss in shuju) {

            insterQuery += `'${shuju[keyss]}',`
        }
        insterQuery += `'${JSON.parse(localStorage.getItem('user')).AccountName}')`;
        return this.database.executeSql(`${insterQuery}`, {})
        .then(res => {
            return res
        }).catch(err => {
            console.log(err)
        });
    }

    newupdataone(table, shuju, id) {
        return this.database.executeSql(`UPDATE ${table} SET farmsmessage='${shuju}' WHERE FramGuid='${id}'`, {})
        .then(res => {
            return res;
        }).catch(err => {
            console.log(err)
        });
    }

    updataear(table, key, value, id) {
        return this.database.executeSql(`UPDATE ${table} SET ${key}='${value}' WHERE FramGuid='${id}'`, {})
        .then(res => {
            return res;
        }).catch(err => {
            console.log(err)
        });
    }

    newselectfarmtype(table, type) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE FramType='${type}' AND Isloc="1"`, {})
        .then(res => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        })
    }

    selectTableAll(table) {
        return this.database.executeSql(`SELECT * FROM ${table}`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selecttableisloc(table, num) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE Isloc='${num}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectTableAllfofi(table, num1, num2) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE (FramType='${num1}' OR FramType='${num2}') AND Isloc='1'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selecttablefour(table, num1) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE FramType='${num1}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selecttableonetwoth(table, num1) {
        let str = `SELECT * FROM ${table} WHERE (`;
        for (let i = 0; i < num1.length; i++) {
            if (i == num1.length - 1) {
                str += `FramType='${num1[i]}'`;
            } else {
                str += `FramType='${num1[i]}' OR `;
            }
        }
        return this.database.executeSql(str + ') AND Isloc="1"', {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectAllNoPass(table, num1) {
        let str = `SELECT * FROM ${table} WHERE (`;
        for (let i = 0; i < num1.length; i++) {
            if (i == num1.length - 1) {
                str += `FramType='${num1[i]}'`;
            } else {
                str += `FramType='${num1[i]}' OR `;
            }
        }
        return this.database.executeSql(str + ') AND isPass="2"', {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectTableAllInsureNo(table) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE InsureNo!='' AND uid='${JSON.parse(localStorage.getItem('user')).AccountName}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectTableFarmType(table) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE FramType!='3'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectTableAllInsureNotnull(table, id, aid) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE FramPeopleID='${id}' AND AnimalId!='' AND AnimalId='${aid}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selecTableFarmGidAndPeopleId(table, value1, value2) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE FramGuid='${value1}' AND FramPeopleID='${value2}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selecTablePeopleID(table, FramPeopleID) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE FramPeopleID='${FramPeopleID}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selecTablePeopleIDAND(table, FramPeopleID) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE FramPeopleID='${FramPeopleID}' AND InsureNo!=''`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selecTableIDs(table, num, FramPeopleID) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE ${num}='${FramPeopleID}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selecTableIDAll(table, num, FramPeopleID, s1, s2) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE ${num}='${FramPeopleID}' AND ${s1}='${s2}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }
    selecTableIDAllss(table, num, FramPeopleID, s1, s2,a1,a2) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE ${num}='${FramPeopleID}' AND ${s1}='${s2}' AND ${a1}='${a2}'`, {})
            .then((res) => {
                let len = res.rows.length;
                let itemStorage = new Array(len);
                for (let i = 0; i < len; i++) {
                    itemStorage[i] = {name: res.rows.item(i)};
                }
                return itemStorage;
            });
    }

    selecTableIDAlls(table, s1, s2, s3, s4) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE '${s1}'>=StartAnimalIds AND '${s3}'<=EndAnimalIds`, {})
        .then((res) => {
            console.log(res, s1, s2, s3, s4, '111')
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectTableBaos(FramPeopleID, guid) {
        return this.database.executeSql(`SELECT * FROM Underwriting WHERE FramPeopleId='${FramPeopleID}' AND FramGuid='${guid}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectAnimalstartNum(id, start) {
        return this.database.executeSql(`SELECT * FROM PiliangUnderwriting WHERE FramPeopleId='${id}' AND StartAnimalIds<='${start}' AND EndAnimalIds>='${start}'`, {}).then(res => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        })
    }

    selecTableIDsOr(table, num, type1) {
        let str = `SELECT * FROM ${table} WHERE `;
        for (let i = 0; i < type1.length; i++) {
            if (i == type1.length - 1) {
                str += `${num}='${type1[i]}'`
            } else {
                str += `${num}='${type1[i]}' OR `
            }
        }
        return this.database.executeSql(str, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectTableAnimalID(table, AnimalId) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE AnimalId='${AnimalId}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectTableAnimalIDs(table, AnimalId, id) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE AnimalId='${AnimalId}' and FramGuid='${id}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectFarmType(table,) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE FramType='3'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selecTableID(table, Id) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE id=${Id}`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectTableFramLocation(table, id) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE FramLocation='${id}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectTableFramAll(table) {
        return this.database.executeSql(`SELECT * FROM ${table}`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selectTableFramLocationType(table, id, type) {
        let str = '';
        for (let i = 0; i < type.length; i++) {
            if (i == type.length - 1) {
                str += ` FramType='${type[i]}' `;
            } else {
                str += ` FramType='${type[i]}' OR`;
            }
        }
        return this.database.executeSql(`SELECT * FROM ${table} WHERE (${str})`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    selecTablePeopleName(table, Name, FramPeopleID) {
        return this.database.executeSql(`SELECT * FROM ${table} WHERE ${Name}='${FramPeopleID}'`, {})
        .then((res) => {
            let len = res.rows.length;
            let itemStorage = new Array(len);
            for (let i = 0; i < len; i++) {
                itemStorage[i] = {name: res.rows.item(i)};
            }
            return itemStorage;
        });
    }

    inster(table, shuju: Array<string>) {
        let insterQuery = 'INSERT INTO ' + table + '(';
        let len = ENV.DATA_TABLE[table];
        for (let i = 0; i < len.length; i++) {
            insterQuery += len[i].name + ",";
        }
        insterQuery += 'uid,Isloc) VALUES(';
        for (let s = 0; s < shuju.length; s++) {
            insterQuery += `'${shuju[s]}',`;
        }
        insterQuery += `'${JSON.parse(localStorage.getItem('user')).AccountName}','1')`;
        return this.database.executeSql(`${insterQuery}`, {})
        .then(res => {
            return res
        }).catch(err => {
            console.log(err)
        });
    }

    deleteTable(table, mes, id) {
        return this.database.executeSql(`DELETE FROM ${table} WHERE ${mes}='${id}'`, {})
        .then(res => {
            return res;
        }).catch(e => {
            console.log(e)
        });
    }

    deleteTableUnderwriting(guid, peopleid) {
        return this.database.executeSql(`DELETE FROM Underwriting WHERE FramGuid='${guid}' AND FramPeopleId='${peopleid}'`, {})
        .then(res => {
            return res;
        }).catch(e => {
            console.log(e)
        });
    }

    upData(table, id, PeopleID) {
        return this.database.executeSql(`UPDATE ${table} SET autographPic='${id}' WHERE FramGuid='${PeopleID}'`, {})
        .then(res => {
            return res;
        }).catch(err => {
            console.log(err)
        })
    }

    upDatasignUrl(table, id, PeopleID) {
        return this.database.executeSql(`UPDATE ${table} SET signUrl='${id}' WHERE FramGuid='${PeopleID}'`, {})
        .then(res => {
            return res;
        }).catch(err => {
            console.log(err)
        })
    }

    updateFarm(table, oldcols, newcols) {
        let sqlstr = "";
        for (let key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                let value = newcols[key];
                sqlstr += `${key}='${value}',`;
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql(`UPDATE ${table} SET ${sqlstr} WHERE FramGuid='${oldcols['FramGuid']}'`, {})
            .then(res => {
                return res;
            }).catch(err => {
                console.log(err)
            });
        } else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    }

    updateFarmMessage(table, oldcols, newcols) {
        let sqlstr = "";
        for (let key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                let value = newcols[key];
                sqlstr += `${key}='${value}',`;
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql(`UPDATE ${table} SET ${sqlstr} WHERE id='${oldcols['id']}'`, {})
            .then(res => {
                return res;
            }).catch(err => {
                console.log(err)
            });
        } else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    }

    updateFarmMessages(table, oldcols, newcols) {
        let sqlstr = "";
        for (let key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                let value = newcols[key];
                sqlstr += `${key}='${value}',`;
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql(`UPDATE ${table} SET ${sqlstr} WHERE IID='${oldcols['IID']}'`, {})
            .then(res => {
                return res;
            }).catch(err => {
                console.log(err)
            });
        } else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    }

    updateUnder(oldcols, newcols) {
        let sqlstr = "";
        for (let key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                let value = newcols[key];
                sqlstr += `${key}='${value}',`;
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql(`UPDATE Underwriting SET ${sqlstr} WHERE SelfGuid='${oldcols['SelfGuid']}'`, {})
            .then(res => {
                return res;
            }).catch(err => {
                console.log(err)
            });
        } else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    }

    updateQian(url, guid, name) {
        return this.database.executeSql(`UPDATE inframmessage SET '${name}'='${url}' WHERE FramGuid='${guid}'`, {})
        .then(res => {
            return res;
        }).catch(err => {
            console.log(err)
        })
    }

    updateQians(url, guid, name) {
        return this.database.executeSql(`UPDATE InsuredFarmer SET '${name}'='${url}' WHERE FramGuid='${guid}'`, {})
        .then(res => {
            return res;
        }).catch(err => {
            console.log(err)
        })
    }

    updataUnderID(id) {
        return this.database.executeSql(`UPDATE Underwriting SET FramPeopleId='${id}'`, {})
        .then(res => {
            return res;
        }).catch(err => {
            console.log(err)
        })
    }

    updataUnderIDs(name, id) {
        return this.database.executeSql(`UPDATE Underwriting SET ${name}='${id}'`, {})
        .then(res => {
            return res;
        }).catch(err => {
            console.log(err)
        })
    }

    updataInsuredFarmer(oldcols, newcols) {
        let sqlstr = "";
        for (let key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                let value = newcols[key];
                sqlstr += `${key}='${value}',`;
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql(`UPDATE InsuredFarmer SET ${sqlstr} WHERE FramGuid='${oldcols['FramGuid']}'`, {})
            .then(res => {
                return res;
            }).catch(err => {
                console.log(err)
            });
        } else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    }


    updataDeclareClaim(oldcols, newcols) {
        let sqlstr = "";
        for (let key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                let value = newcols[key];
                sqlstr += `${key}='${value}',`;
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql(`UPDATE DeclareClaimTable SET ${sqlstr} WHERE lhGuid='${oldcols['lhGuid']}'`, {})
            .then(res => {
                return res;
            }).catch(err => {
                console.log(err)
            });
        } else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    }

    updataTable(table, oldcols, newcols) {
        let sqlstr = "";
        for (let key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                let value = newcols[key];
                sqlstr += `${key}='${value}',`;
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql(`UPDATE ${table} SET ${sqlstr} WHERE FramPeopleID='${oldcols['FramPeopleID']}'`, {})
            .then(res => {
                return res;
            }).catch(err => {
                console.log(err)
            });
        } else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    }

    updataTables(table, oldcols, newcols) {
        let sqlstr = "";
        for (let key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                let value = newcols[key];
                sqlstr += `${key}='${value}',`;
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql(`UPDATE ${table} SET ${sqlstr} WHERE FramPeopleID='${oldcols['FramPeopleID']}' AND AnimalId = '${oldcols['AnimalId']}'`, {})
            .then(res => {
                return res;
            }).catch(err => {
                console.log(err)
            });
        } else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    }

    updataDnowLoadFarmData(oldcols, newcols) {
        let sqlstr = "";
        for (let key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                let value = newcols[key];
                sqlstr += `${key}='${value}',`;
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql(`UPDATE DnowLoadUnderData SET ${sqlstr} WHERE id='${oldcols['id']}'`, {})
            .then(res => {
                return res;
            }).catch(err => {
                console.log(err)
            });
        } else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    }

    deletTableMessage(table, id) {
        return this.database.executeSql(`DELETE FROM ${table} WHERE  FramGuid='${id}'`, {})
        .then(res => {
            return res;
        })
    }

    deletTableAnimid(table, id) {
        return this.database.executeSql(`DELETE FROM ${table} WHERE  AnimalId='${id}'`, {})
        .then(res => {
            return res;
        })
    }

    async selecByColumn(table: string, column: string, value: any) {
        var promise = new Promise(resolve => {
            this.database.executeSql(`SELECT * FROM ${table} WHERE ${column}='${value}'`, {})
            .then((res) => {
                resolve(res);
            }).catch(error => {
                console.log(error)
            });
        });
        return promise;
    }

    async deleteByColumn(table: string, column: string, value: any): Promise<any> {
        var promise = new Promise(resolve => {
            this.database.executeSql(`DELETE FROM ${table} WHERE  ${column}='${value}'`, {})
            .then(res => {
                resolve(res);
            }).catch(error => {
                console.log(error)
            });
        });
        return promise;
    }

    insertCollection(query, bindings) {
        var coll = bindings.slice(0);
        var promise = new Promise((resolve, reject) => {
            this.database.transaction(function (tx) {
                (function insertOne() {
                    var record = coll.splice(0, 1)[0];
                    try {
                        tx.executeSql(query, record, function (tx, result) {
                            if (coll.length === 0) {
                                resolve(result);
                            } else {
                                insertOne();
                            }
                        }, function (transaction, error) {
                            reject(error);
                            return;
                        });
                    } catch (exception) {
                        reject(exception);
                    }
                })();
            });
        });
        return promise;
    }
}
