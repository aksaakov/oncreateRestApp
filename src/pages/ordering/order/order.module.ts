import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderPage } from './order';
import { TranslateModule } from '@ngx-translate/core';
import { Stripe } from '@ionic-native/stripe';
import { PayPal } from '@ionic-native/paypal';
import { EcurrencyPipeModule } from '../../../pipes/ecurrency.module';

@NgModule({
	declarations: [
		OrderPage
	],
	imports: [
		IonicPageModule.forChild(OrderPage),
		EcurrencyPipeModule,
		TranslateModule.forChild()
	],
	providers: [
		Stripe,
		PayPal
	]
})
export class OrderPageModule {}
