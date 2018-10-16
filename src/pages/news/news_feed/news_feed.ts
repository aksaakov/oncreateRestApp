import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import {APIService} from '../../../services/api_service';
import * as moment from 'moment';

/**
 * News feed page component
 */
@IonicPage()
@Component({
    selector: 'news-feed',
    templateUrl: 'news_feed.html'
})

export class NewsFeedPage {
    public items;
    public canLoadMore;
    private page;
    public loggedIn = false;
    public date_format;

    populateList() {
        this.page = 1;
        this.items = [];
        this.apiService.getNews(this.page, this.apiService.getUserData().city_id).then((response) => {
            this.items = response.json();
        });
    }

    constructor(
        private nav: NavController,
        private apiService: APIService
    ) {
        this.populateList();
        this.loggedIn = this.apiService.isLoggedIn();
        this.date_format = this.apiService.getSettings().date_format_app;
    }

    ionViewWillEnter() {
        this.populateList();
    }

    showDetails(item) {
        this.nav.push('NewsDetailPage', { item: item });
    }

    doRefresh(refresher) {
        this.populateList();
        refresher.complete();
    }

    stringAsDate(v) {
        return moment(v).toDate();
    }
}