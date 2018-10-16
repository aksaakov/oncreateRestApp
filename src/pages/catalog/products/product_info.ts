import { Component, Input } from '@angular/core';

/**
 * Products info component, used in products list
 */
@Component({
  templateUrl: 'product_info.html',
  selector: 'product-info'
})
export class ProductInfo {
  @Input() product: any;
  @Input() descr: boolean;
}
