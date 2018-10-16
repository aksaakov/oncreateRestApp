import { Component } from '@angular/core';
import { NavParams, IonicPage, NavController } from 'ionic-angular';
import {APIService} from '../../../services/api_service';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

/**
 * News view page component
 */
@IonicPage()
@Component({
    selector: 'news-detail',
    templateUrl: 'news_detail.html'
})
export class NewsDetailPage {
    public item;
    public date_format;

    constructor(
        private navParams: NavParams,
        private sanitizer: DomSanitizer,
        private nav: NavController,
        private api: APIService
    ) {
        this.item = this.navParams.get('item');
        this.date_format = this.api.getSettings().date_format_app;
        if (this.item == null) {
            this.nav.pop();
        }
    }

    stringAsDate(v) {
        return moment(v).toDate();
    }

    getNewsContent() {
        return this.sanitizer.bypassSecurityTrustHtml(this.item.full_text);
    }
}