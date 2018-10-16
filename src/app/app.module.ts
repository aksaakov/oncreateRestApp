import {NgModule, ErrorHandler, Injectable, Injector} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler, Platform} from 'ionic-angular';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {Pro} from '@ionic/pro';

import {MyApp} from './app.component';
import {TabsPage} from '../pages/tabs/tabs';
import {Loading} from '../pages/loading/loading';
import {Welcome} from '../pages/welcome/welcome';

import {IonicStorageModule} from '@ionic/storage';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {APIService} from "../services/api_service";
import {CartService} from "../services/cart_service";
import {PushService} from "../services/push_service";
import {UtilService} from "../services/util_service";
import {OrderHistoryService} from "../services/order_history_service";

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {EcurrencyPipeModule} from '../pipes/ecurrency.module';

Pro.init('5d523476', {
  appVersion: '1.2.1'
});

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  ionicErrorHandler: IonicErrorHandler;

  constructor(
    injector: Injector,
    private platform: Platform
  ) {
    try {
      this.ionicErrorHandler = injector.get(IonicErrorHandler);
    } catch (e) {
    }
  }

  handleError(err: any): void {
    if (this.platform.is('browser')) {
      return;
    }
    Pro.monitoring.handleNewError(err);
    this.ionicErrorHandler && this.ionicErrorHandler.handleError(err);
  }
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    Welcome,
    Loading
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    HttpModule,
    HttpClientModule,
    EcurrencyPipeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    Welcome,
    Loading,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    APIService,
    CartService,
    PushService,
    UtilService,
    OrderHistoryService,
    // Comment these lines to disable ionic monitoring
    // IonicErrorHandler,
    // {provide: ErrorHandler, useClass: MyErrorHandler}
    // Uncomment this line to disable ionic monitoring
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
