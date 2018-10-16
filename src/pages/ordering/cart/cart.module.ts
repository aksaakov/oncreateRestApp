import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartPage } from './cart';
import { TranslateModule } from '@ngx-translate/core';
import { EcurrencyPipeModule } from '../../../pipes/ecurrency.module';

@NgModule({
	declarations: [
		CartPage
	],
	imports: [
		IonicPageModule.forChild(CartPage),
		EcurrencyPipeModule,
		TranslateModule.forChild()
	]
})
export class CartPageModule {}
