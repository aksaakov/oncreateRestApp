import { NgModule } from '@angular/core';
import { ECurrencyPipe } from './ecurrency';

@NgModule({
	declarations: [
		ECurrencyPipe
	],
	exports: [
		ECurrencyPipe
	]
})
export class EcurrencyPipeModule {}
