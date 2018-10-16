import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsPage } from './products';
import { ProductInfo } from "./product_info";
import { TranslateModule } from '@ngx-translate/core';
import { EcurrencyPipeModule } from '../../../pipes/ecurrency.module';

@NgModule({
	declarations: [
		ProductsPage,
    ProductInfo
	],
	imports: [
		IonicPageModule.forChild(ProductsPage),
		EcurrencyPipeModule,
		TranslateModule.forChild()
	]
})
export class ProductsPageModule {}
