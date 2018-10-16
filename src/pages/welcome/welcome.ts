import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from "../tabs/tabs";
import { Storage } from '@ionic/storage';
import { PushService } from '../../services/push_service';
import { APIService } from '../../services/api_service';

/**
 * WelcomePage component
 */
@Component({
    templateUrl: 'welcome.html'
})

export class Welcome {
    public signup = false;

    constructor(private nav: NavController,
                private storage: Storage,
                private push: PushService,
                private api: APIService
    ) {
        this.signup = (this.api.getSettings().signup_required == 1);
    }

    goToSignup() {
        this.nav.setRoot('SignupPage');
    }

    goToLogin() {
        this.nav.setRoot('LoginPage');
    }

    startApp() {
        this.push.init(this.api.getSettings().pushwoosh_id);
        this.storage.set('welcomeShown', '1').then(() => {
        }, () => {
        });
        this.nav.setRoot(TabsPage);
        // StatusBar.styleDefault();
        // StatusBar.overlaysWebView(false);
        // StatusBar.backgroundColorByHexString('F8F8F8');
        // StatusBar.show();
    }
}
