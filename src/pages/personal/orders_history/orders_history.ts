import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { APIService } from '../../../services/api_service';
import { OrderHistoryService } from '../../../services/order_history_service';
import * as moment from 'moment';

/**
 * Orders history list component
 */
@IonicPage()
@Component({
    templateUrl: 'orders_history.html'
})
export class OrdersHistoryPage {
    public orders:any = [];
    public loggedIn = false;
    public multiR = false;
    public date_format;

    constructor(
        private apiService: APIService,
        private nav: NavController,
        private historyService: OrderHistoryService
    ) {
        this.date_format = this.apiService.getSettings().time_format_app;
        this.loggedIn = this.apiService.isLoggedIn();
        this.multiR = this.apiService.getSettings().multiple_restaurants;
    }

    ionViewWillEnter() {
        this.historyService.getItems().then(items => {
            this.orders = items;
            console.log(items);
        }, () => {});
    }

    showOrder(order) {
        this.nav.push('OrderViewPage', { order: order });
    }

    stringAsDate(v) {
        return moment(v).toDate();
    }
}
