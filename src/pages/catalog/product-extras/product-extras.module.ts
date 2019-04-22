import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductExtrasPage } from './product-extras';
import {ProductsPage} from "../products/products";

@NgModule({
  declarations: [
    ProductExtrasPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductExtrasPage),
  ],
  providers: [
    ProductsPage,
  ],
})
export class ProductExtrasPageModule {}
