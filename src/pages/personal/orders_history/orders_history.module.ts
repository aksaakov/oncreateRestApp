import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrdersHistoryPage } from './orders_history';
import { TranslateModule } from '@ngx-translate/core';
import { EcurrencyPipeModule } from '../../../pipes/ecurrency.module';

@NgModule({
	declarations: [
		OrdersHistoryPage
	],
	imports: [
		IonicPageModule.forChild(OrdersHistoryPage),
		EcurrencyPipeModule,
		TranslateModule.forChild()
	]
})
export class OrdersHistoryPageModule {}
