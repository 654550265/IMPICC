import { Http, Headers, RequestOptions, URLSearchParams } from "@angular/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/toPromise";
import "rxjs/Rx";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import "rxjs/add/observable/throw";
import { CommonServiceProvider } from "../common-service/common-service";

@Injectable()
export class AuthServiceProvider {
    params = new URLSearchParams();

    res : object;

    constructor(public http: Http, public comm: CommonServiceProvider) {
        this.res = {
            Status: false,
            Message: "请求失败，请重新尝试"
        }
    }

    headers = new Headers({'Content-Type': 'application/x-www'});
    options = new RequestOptions({headers: this.headers});

    get(url: string): Observable<any> {
        return this.http.get(url, {
            headers: new Headers({
                "DataType": "json",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            })
        }).map(res => res.json())
        .catch( error => {
            console.error("error catched", error);
            return Observable.of(this.res);
        });
    }

    post(url: string, body: any): Observable<any> {
        for (let key in body) {
            if (body.hasOwnProperty(key)) {
                let element = body[key];
                this.params.set(key, element);
            }
        }
        return this.http.post(url, this.params, {
            headers: new Headers({
                "DataType": "json",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            })
        }).map(res => res.json())
        .catch( error => {
            alert("error catched: "+error);
            return Observable.of(this.res);
        });
    }

}
