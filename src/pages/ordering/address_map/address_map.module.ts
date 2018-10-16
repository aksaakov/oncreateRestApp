import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressMap } from './address_map';
import { AddressCompletion } from '../address_completion/address_completion';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [
		AddressMap,
		AddressCompletion
	],
	entryComponents: [
		AddressCompletion
	],
	imports: [
		IonicPageModule.forChild(AddressMap),
		TranslateModule.forChild()
	]
})
export class AddressMapModule {}
