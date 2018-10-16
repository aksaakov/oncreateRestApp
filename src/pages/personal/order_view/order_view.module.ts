import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderViewPage } from './order_view';
import { TranslateModule } from '@ngx-translate/core';
import { EcurrencyPipeModule } from '../../../pipes/ecurrency.module';

@NgModule({
	declarations: [
		OrderViewPage
	],
	imports: [
		IonicPageModule.forChild(OrderViewPage),
		EcurrencyPipeModule,
		TranslateModule.forChild()
	]
})
export class OrdersHistoryPageModule {}
