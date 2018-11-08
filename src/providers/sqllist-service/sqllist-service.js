"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
var environment_1 = require("../../config/environment");
var SqllistServiceProvider = (function () {
    function SqllistServiceProvider(sqlite) {
        this.sqlite = sqlite;
    }
    SqllistServiceProvider.prototype.creatTable = function () {
        var _this = this;
        this.sqlite.create({
            name: 'impiccdata.db',
            location: 'default'
        }).then(function (db) {
            for (var key in environment_1.ENV.DATA_TABLE) {
                var col = environment_1.ENV.DATA_TABLE[key];
                var query = 'CREATE TABLE IF NOT exists ' + key + '(';
                query += 'id integer PRIMARY KEY autoincrement,';
                for (var i = 0; i < col.length; i++) {
                    query += col[i].name + " " + col[i].type + " " + col[i].ISNull + ",";
                }
                query += 'uid TEXT NOT NULL,Isloc INTEGER NOT NULL)';
                db.executeSql("" + query, {})
                    .then(function (res) {
                }).catch(function (e) {
                    console.log(e);
                });
            }
            _this.database = db;
        }).catch();
    };
    SqllistServiceProvider.prototype.newinster = function (table, shuju) {
        var insterQuery = "INSERT INTO " + table + "(";
        for (var keys in shuju) {
            insterQuery += keys + ",";
        }
        insterQuery += 'uid,Isloc) VALUES(';
        for (var keyss in shuju) {
            insterQuery += "'" + shuju[keyss] + "',";
        }
        insterQuery += "'" + JSON.parse(localStorage.getItem('user')).AccountName + "','1')";
        return this.database.executeSql("" + insterQuery, {})
            .then(function (res) {
            return res;
        }).catch(function (err) {
            console.log(err);
        });
    };
    SqllistServiceProvider.prototype.newupdataone = function (table, shuju, id) {
        return this.database.executeSql("UPDATE " + table + " SET farmsmessage='" + shuju + "' WHERE FramGuid='" + id + "'", {})
            .then(function (res) {
            return res;
        }).catch(function (err) {
            console.log(err);
        });
    };
    SqllistServiceProvider.prototype.newselectfarmtype = function (table, type) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE FramType='" + type + "'", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selectTableAll = function (table) {
        return this.database.executeSql("SELECT * FROM " + table, {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selectTableAllInsureNo = function (table) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE InsureNo!='' AND uid='" + JSON.parse(localStorage.getItem('user')).AccountName + "'", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selectTableFarmType = function (table) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE FramType!='3'", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selectTableAllInsureNotnull = function (table, id, aid) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE FramPeopleID='" + id + "' AND AnimalId!='' AND AnimalId='" + aid + "'", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selecTablePeopleID = function (table, FramPeopleID) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE FramPeopleID='" + FramPeopleID + "'", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selecTablePeopleIDAND = function (table, FramPeopleID) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE FramPeopleID='" + FramPeopleID + "' AND InsureNo!=''", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selecTableIDs = function (table, num, FramPeopleID) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE " + num + "='" + FramPeopleID + "'", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selectTableBaos = function (FramPeopleID, guid) {
        return this.database.executeSql("SELECT * FROM Underwriting WHERE FramPeopleId='" + FramPeopleID + "' AND FramGuid='" + guid + "'", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selectAnimalstartNum = function (id, start) {
        return this.database.executeSql("SELECT * FROM PiliangUnderwriting WHERE FramPeopleId='" + id + "' AND StartAnimalIds<='" + start + "' AND EndAnimalIds>='" + start + "'", {}).then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selecTableIDsOr = function (table, num, type1) {
        var str = "SELECT * FROM " + table + " WHERE ";
        for (var i = 0; i < type1.length; i++) {
            if (i == type1.length - 1) {
                str += num + "='" + type1[i] + "'";
            }
            else {
                str += num + "='" + type1[i] + "' OR ";
            }
        }
        return this.database.executeSql(str, {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selectTableAnimalID = function (table, AnimalId) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE AnimalId='" + AnimalId + "'", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selectTableAnimalIDs = function (table, AnimalId, id) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE AnimalId='" + AnimalId + "' and FramGuid='" + id + "'", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selectFarmType = function (table) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE FramType='3'", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selecTableID = function (table, Id) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE id=" + Id, {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selectTableFramLocation = function (table, id) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE FramLocation='" + id + "'", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selectTableFramLocationType = function (table, id, type) {
        var str = '';
        for (var i = 0; i < type.length; i++) {
            if (i == type.length - 1) {
                str += " InsureType='" + type[i] + "' ";
            }
            else {
                str += " InsureType='" + type[i] + "' OR";
            }
        }
        return this.database.executeSql("SELECT * FROM " + table + " WHERE FramLocation='" + id + "' AND (" + str + ")", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.selecTablePeopleName = function (table, Name, FramPeopleID) {
        return this.database.executeSql("SELECT * FROM " + table + " WHERE " + Name + "='" + FramPeopleID + "'", {})
            .then(function (res) {
            var len = res.rows.length;
            var itemStorage = new Array(len);
            for (var i = 0; i < len; i++) {
                itemStorage[i] = { name: res.rows.item(i) };
            }
            return itemStorage;
        });
    };
    SqllistServiceProvider.prototype.inster = function (table, shuju) {
        var insterQuery = 'INSERT INTO ' + table + '(';
        var len = environment_1.ENV.DATA_TABLE[table];
        for (var i = 0; i < len.length; i++) {
            insterQuery += len[i].name + ",";
        }
        insterQuery += 'uid,Isloc) VALUES(';
        for (var s = 0; s < shuju.length; s++) {
            insterQuery += "'" + shuju[s] + "',";
        }
        insterQuery += "'" + JSON.parse(localStorage.getItem('user')).AccountName + "','1')";
        return this.database.executeSql("" + insterQuery, {})
            .then(function (res) {
            return res;
        }).catch(function (err) {
            console.log(err);
        });
    };
    SqllistServiceProvider.prototype.deleteTable = function (table, mes, id) {
        return this.database.executeSql("DELETE FROM " + table + " WHERE " + mes + "='" + id + "'", {})
            .then(function (res) {
            return res;
        }).catch(function (e) {
            console.log(e);
        });
    };
    SqllistServiceProvider.prototype.upData = function (table, id, PeopleID) {
        return this.database.executeSql("UPDATE " + table + " SET autographPic='" + id + "' WHERE FramGuid='" + PeopleID + "'", {})
            .then(function (res) {
            return res;
        }).catch(function (err) {
            console.log(err);
        });
    };
    SqllistServiceProvider.prototype.upDatasignUrl = function (table, id, PeopleID) {
        return this.database.executeSql("UPDATE " + table + " SET signUrl='" + id + "' WHERE FramGuid='" + PeopleID + "'", {})
            .then(function (res) {
            return res;
        }).catch(function (err) {
            console.log(err);
        });
    };
    SqllistServiceProvider.prototype.updateFarm = function (oldcols, newcols) {
        var sqlstr = "";
        for (var key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                var value = newcols[key];
                sqlstr += key + "='" + value + "',";
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql("UPDATE inframmessage SET " + sqlstr + " WHERE FramGuid='" + oldcols['FramGuid'] + "'", {})
                .then(function (res) {
                return res;
            }).catch(function (err) {
                console.log(err);
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    };
    SqllistServiceProvider.prototype.updateFarmMessage = function (table, oldcols, newcols) {
        var sqlstr = "";
        for (var key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                var value = newcols[key];
                sqlstr += key + "='" + value + "',";
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql("UPDATE " + table + " SET " + sqlstr + " WHERE id='" + oldcols['id'] + "'", {})
                .then(function (res) {
                return res;
            }).catch(function (err) {
                console.log(err);
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    };
    SqllistServiceProvider.prototype.updateFarmMessages = function (table, oldcols, newcols) {
        var sqlstr = "";
        for (var key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                var value = newcols[key];
                sqlstr += key + "='" + value + "',";
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql("UPDATE " + table + " SET " + sqlstr + " WHERE IID='" + oldcols['IID'] + "'", {})
                .then(function (res) {
                return res;
            }).catch(function (err) {
                console.log(err);
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    };
    SqllistServiceProvider.prototype.updateUnder = function (oldcols, newcols) {
        var sqlstr = "";
        for (var key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                var value = newcols[key];
                sqlstr += key + "='" + value + "',";
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql("UPDATE Underwriting SET " + sqlstr + " WHERE SelfGuid='" + oldcols['SelfGuid'] + "'", {})
                .then(function (res) {
                return res;
            }).catch(function (err) {
                console.log(err);
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    };
    SqllistServiceProvider.prototype.updateQian = function (url, guid, name) {
        return this.database.executeSql("UPDATE inframmessage SET '" + name + "'='" + url + "' WHERE FramGuid='" + guid + "'", {})
            .then(function (res) {
            return res;
        }).catch(function (err) {
            console.log(err);
        });
    };
    SqllistServiceProvider.prototype.updataUnderID = function (id) {
        return this.database.executeSql("UPDATE Underwriting SET FramPeopleId='" + id + "'", {})
            .then(function (res) {
            return res;
        }).catch(function (err) {
            console.log(err);
        });
    };
    SqllistServiceProvider.prototype.updataUnderIDs = function (name, id) {
        return this.database.executeSql("UPDATE Underwriting SET " + name + "='" + id + "'", {})
            .then(function (res) {
            return res;
        }).catch(function (err) {
            console.log(err);
        });
    };
    SqllistServiceProvider.prototype.updataUnderGuid = function (name, id, guid) {
        return this.database.executeSql("UPDATE Underwriting SET " + name + "='" + id + "' WHERE FramGuid='" + guid + "'", {})
            .then(function (res) {
            return res;
        }).catch(function (err) {
            console.log(err);
        });
    };
    SqllistServiceProvider.prototype.updataDeclareClaim = function (oldcols, newcols) {
        var sqlstr = "";
        for (var key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                var value = newcols[key];
                sqlstr += key + "='" + value + "',";
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql("UPDATE DeclareClaimTable SET " + sqlstr + " WHERE id='" + oldcols['id'] + "'", {})
                .then(function (res) {
                return res;
            }).catch(function (err) {
                console.log(err);
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    };
    SqllistServiceProvider.prototype.updataTable = function (table, oldcols, newcols) {
        var sqlstr = "";
        for (var key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                var value = newcols[key];
                sqlstr += key + "='" + value + "',";
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql("UPDATE " + table + " SET " + sqlstr + " WHERE FramPeopleID='" + oldcols['FramPeopleID'] + "'", {})
                .then(function (res) {
                return res;
            }).catch(function (err) {
                console.log(err);
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    };
    SqllistServiceProvider.prototype.updataTables = function (table, oldcols, newcols) {
        var sqlstr = "";
        for (var key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                var value = newcols[key];
                sqlstr += key + "='" + value + "',";
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql("UPDATE " + table + " SET " + sqlstr + " WHERE FramPeopleID='" + oldcols['FramPeopleID'] + "' AND AnimalId = '" + oldcols['AnimalId'] + "'", {})
                .then(function (res) {
                return res;
            }).catch(function (err) {
                console.log(err);
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    };
    SqllistServiceProvider.prototype.updataDnowLoadFarmData = function (oldcols, newcols) {
        var sqlstr = "";
        for (var key in newcols) {
            if (newcols.hasOwnProperty(key)) {
                var value = newcols[key];
                sqlstr += key + "='" + value + "',";
            }
        }
        sqlstr = sqlstr.substr(0, sqlstr.length - 1);
        if (sqlstr) {
            return this.database.executeSql("UPDATE DnowLoadUnderData SET " + sqlstr + " WHERE id='" + oldcols['id'] + "'", {})
                .then(function (res) {
                return res;
            }).catch(function (err) {
                console.log(err);
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                resolve({});
            });
        }
    };
    SqllistServiceProvider.prototype.deletTableMessage = function (table, id) {
        return this.database.executeSql("DELETE FROM " + table + " WHERE  FramPeopleID='" + id + "'", {})
            .then(function (res) {
            return res;
        });
    };
    SqllistServiceProvider.prototype.deletTableAnimid = function (table, id) {
        return this.database.executeSql("DELETE FROM " + table + " WHERE  AnimalId='" + id + "'", {})
            .then(function (res) {
            return res;
        });
    };
    SqllistServiceProvider.prototype.selecByColumn = function (table, column, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promise;
            return __generator(this, function (_a) {
                promise = new Promise(function (resolve) {
                    _this.database.executeSql("SELECT * FROM " + table + " WHERE " + column + "='" + value + "'", {})
                        .then(function (res) {
                        var isexist = res.rows.length > 0 ? true : false;
                        resolve(isexist);
                    });
                });
                return [2 /*return*/, promise];
            });
        });
    };
    SqllistServiceProvider.prototype.deleteByColumn = function (table, column, value) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promise;
            return __generator(this, function (_a) {
                promise = new Promise(function (resolve) {
                    _this.database.executeSql("DELETE FROM " + table + " WHERE  " + column + "='" + value + "'", {})
                        .then(function (res) {
                        resolve(res);
                    });
                });
                return [2 /*return*/, promise];
            });
        });
    };
    return SqllistServiceProvider;
}());
SqllistServiceProvider = __decorate([
    core_1.Injectable()
], SqllistServiceProvider);
exports.SqllistServiceProvider = SqllistServiceProvider;
