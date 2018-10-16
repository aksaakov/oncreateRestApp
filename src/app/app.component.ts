import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { Welcome } from '../pages/welcome/welcome';
import { Loading } from '../pages/loading/loading';
import { Storage } from '@ionic/storage';
import { APIService } from '../services/api_service';
import { UtilService } from '../services/util_service';
import { CartService } from '../services/cart_service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild('myNav') nav;
    rootPage: any = Loading;
    loggedIn = false;

    constructor(
        platform: Platform,
        statusBar: StatusBar,
        splashScreen: SplashScreen,
        private storage: Storage,
        private cart: CartService,
        private api: APIService,
        private translate: TranslateService,
        private util: UtilService
    ) {
        this.translate.setDefaultLang('en');
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            storage.ready().then(() => {
                cart.init();
                this.api.getLoginStatus().subscribe(() => {
                    this.loggedIn = true;
                });
                storage.get('welcomeShown').then((v) => {
                    if (v) {
                        const settings = this.api.getSettings();
                        if (settings && settings.signup_required == 1) {
                            this.loggedIn = true;
                        }
                        this.api.init().then(() => {
                            this.loggedIn = this.api.isLoggedIn();
                            this.nav.setRoot(TabsPage);
                            splashScreen.hide();
                        });
                    }
                    else {
                        this.api.init().then(() => {
                            this.loggedIn = this.api.isLoggedIn();
                            this.nav.setRoot(Welcome);
                            splashScreen.hide();
                        }, () => {
                            window['location'].reload();
                        });
                    }
                }, () => {
                    this.api.init().then(() => {
                        this.loggedIn = this.api.isLoggedIn();
                        this.nav.setRoot(Welcome);
                        splashScreen.hide();
                    }, () => {
                        window['location'].reload();
                    });
                })
            });
        });
    }

    openProfile() {
        this.nav.push('ProfilePage');
    }

    openHistory() {}

    logout() {
        this.util.showLoader();
        this.storage.clear().then(() => {
            window['location'].reload();
        });
    }
}
