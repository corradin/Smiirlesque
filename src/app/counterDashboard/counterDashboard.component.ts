import { Component, Input, OnInit } from '@angular/core';
import { Counter } from '../counter';
import { CounterService } from '../counterService/counter.service';
import { map } from 'rxjs/operators';
import { CounterConfiguration } from '../counterConfiguration';

@Component({
    selector: 'app-counter-dashboard',
    templateUrl: './counterDashboard.component.html',
    styleUrls: ['./counterDashboard.component.scss']
})
export class CounterDashboardComponent implements OnInit {
    meetupCounter: Counter = {
        name: "",
        active: true
    };
    countdownCounter: Counter = {
        name: "",
        active: false
    };
    activeCounter: Counter = {
        name: "",
        active: true
    };
    meetupCounterDisabled: boolean;
    countdownCounterDisabled: boolean;
    counterData: any;

    constructor(private counterService: CounterService) { }

    onClickActive($event) {
        console.log(this.meetupCounter.active);
        if ($event.srcElement.attributes.placeholder.nodeValue === 'meetupCounterActive') {
            if (this.meetupCounter.active) {
                this.countdownCounter.active = false;
                this.countdownCounterDisabled = true;
                this.activeCounter.name = this.meetupCounter.name;
            }
            else {
                this.meetupCounterDisabled = false;
                this.countdownCounterDisabled = false;
            }
        }
        if ($event.srcElement.attributes.placeholder.nodeValue === 'countdownCounterActive') {
            if (this.countdownCounter.active) {
                this.meetupCounter.active = false;
                this.meetupCounterDisabled = true;
                this.activeCounter.name = this.countdownCounter.name;
            }
            else {
                this.meetupCounterDisabled = false;
                this.countdownCounterDisabled = false;
            }
        }
        console.log(this.countdownCounterDisabled);
    }

    onClickSubmit($event) {
        alert(`Saved using Albert's awesome service!`);
        let postData = {};
        if(this.countdownCounter.active) {
            this.counterData.datediff.options.countdownTo = new Date(this.counterData.datediff.options.countdownTo).getTime();
            postData = this.counterData.datediff;            
        } else if(this.meetupCounter.active) {
            postData = this.counterData.meetup;
        }

        this.counterService.updateConfiguration(postData).subscribe((data: any) => {
            console.log(data);
        });
    }

    ngOnInit() {
        this.counterService.getConfiguration().pipe(map(response => response.json())).subscribe((data: any) => {
            //Since the Infraboys don't yet support replacement, this hack is needed
            let dataFiltered = data.config.filter(function(item) { return (item.functionName === 'meetup'); }).slice(0,1);
            dataFiltered.push(data.config.filter(function(item) { return (item.functionName === 'datediff'); }).slice(0,1)[0]);
            this.counterData = dataFiltered;
            
            for(let i = 0; i<dataFiltered.length; i++) {
                if(dataFiltered[i].functionName==='datediff') {
                    this.counterData.datediff = dataFiltered[i];
                    this.countdownCounter.active = this.counterData.datediff.options.active;
                }
                else if(dataFiltered[i].functionName==='meetup') {
                    this.counterData.meetup = dataFiltered[i];
                    this.meetupCounter.active = this.counterData.meetup.options.active;
                }
            }
            console.log(data);
        });
        this.meetupCounterDisabled = this.countdownCounter.active;
        this.countdownCounterDisabled = !this.meetupCounter.active;
    }

}