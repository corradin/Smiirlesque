import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { CounterConfiguration } from '../counterConfiguration';

@Injectable({
    providedIn: 'root'
})
export class CounterService {

    constructor(private http: Http) { }

    getConfiguration() {
        const url = '[GETURLHERE]';
        return this.http.get(url);
    }

    updateConfiguration(counter: any) {
        const url = '[POSTURLHERE]'
        return this.http.post(url, counter);
    }
}