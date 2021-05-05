import {Injectable} from '@angular/core';
import {AlertController, Platform} from '@ionic/angular';

declare var window: any;

@Injectable({
    providedIn: 'root'
})
export class RateService {
    public rate: any;
    public rateLink: string;

    constructor(public alertCtrl: AlertController,
                platform: Platform) {
        console.log('RateService init');
        if (platform.is('ios')) {
            this.rateLink = 'https://itunes.apple.com/app/id1176444712';
        } else if (platform.is('android')) {
            this.rateLink = 'https://play.google.com/store/apps/details?id=ru.it4p.phrasalverbs';
        }
        console.log('rateLink ', this.rateLink);
        this.loadRate();
    }

    saveRate(): any {
        localStorage[`rate`] = JSON.stringify(this.rate);
        console.log('SaveRate', this.rate);
    }

    loadRate(): any {
        if (localStorage[`rate`]) {
            this.rate = JSON.parse(localStorage[`rate`]);
        } else {
            this.rate = this.getDefaultRate();
            this.saveRate();
        }
        console.log('LoadRate', this.rate);
    }

    getDefaultRate(): any {
        return {
            runs: 0,
            isRated: false,
            isDisabled: false
        };
    }

    checkRate() {
        console.log('checkRate');
        this.rate.runs++;
        this.saveRate();
        if (this.rate.runs % 10 === 0
          && !this.rate.isRated
          && !this.rate.isDisabled) {
            this.showConfirm();
        }
    }

    async showConfirm() {

        const confirm = await this.alertCtrl.create({
            header: 'Rate this App',
            message: 'You have a great progress! Help others to find this app, please rate. Thanks for your support!',
            buttons: [{
                text: `Ask later`,
                handler: () => {
                    console.log('Ask later clicked');
                }
            }, {
                text: `No, thanks`,
                handler: () => {
                    this.rate.isDisabled = true;
                    this.saveRate();
                    console.log('No, thanks clicked');
                }
            }, {
                text: 'Rate',
                handler: () => {
                    this.rate.isRated = true;
                    this.saveRate();
                    console.log('Rate clicked');
                    window.open(this.rateLink, '_system');
                }
            }
            ]
        });
        confirm.present();
    }
}
