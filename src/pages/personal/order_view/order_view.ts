import { Component } from '@angular/core';
import { APIService } from '../../../services/api_service';
import { IonicPage, NavParams } from 'ionic-angular';
import * as moment from 'moment';

/**
 * Orders history list component
 */
@IonicPage()
@Component({
    templateUrl: 'order_view.html'
})
export class OrderViewPage {
    public multiR = false;
    public order: any = null;
    public date_format;

    constructor(
        private apiService: APIService,
        private params: NavParams
    ) {
        this.date_format = this.apiService.getSettings().time_format_app;
        this.order = this.params.get('order');
        if (this.order == null) {
            location.href = '/';
        }
        for (let i = 0; i < this.order.ordered_products.length; i++) {
            this.order.ordered_products[i].product = JSON.parse(this.order.ordered_products[i].product_data);
        }
        this.multiR = this.apiService.getSettings().multiple_restaurants;
    }

    stringAsDate(v) {
        return moment(v).toDate();
    }
}
