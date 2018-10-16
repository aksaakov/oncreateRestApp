import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoyaltyPage } from './loyalty';
import { TranslateModule } from '@ngx-translate/core';
import { EcurrencyPipeModule } from '../../../pipes/ecurrency.module';
import {RoundProgressModule} from 'angular-svg-round-progressbar';

@NgModule({
  declarations: [
    LoyaltyPage
  ],
  imports: [
    IonicPageModule.forChild(LoyaltyPage),
    EcurrencyPipeModule,
    TranslateModule.forChild(),
    RoundProgressModule
  ]
})
export class LoyaltyPageModule {}
