import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/**
 * Service with auxiliary utilities
 * such as loading backdrop and quick alert calls
 */
@Injectable()
export class UtilService {
    private loader = null;

    constructor(
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private translate: TranslateService
    ) {
    }

    alert(text, title) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                this.translate.instant('buttons.ok')
            ]
        });
        alert.present();
    }

    showLoader() {
        if (this.loader != null) {
            return;
        }
        this.loader = this.loadingCtrl.create({});
        this.loader.present();
    }

    hideLoader() {
        if (this.loader != null) {
            this.loader.dismiss();
            this.loader = null;
        }
    }
}
