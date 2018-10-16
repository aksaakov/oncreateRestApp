import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditCardInput } from './credit_card_input';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [
		CreditCardInput
	],
	imports: [
		IonicPageModule.forChild(CreditCardInput),
		TranslateModule.forChild()
	]
})
export class CreditCardInputModule {}
