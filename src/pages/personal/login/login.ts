import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { APIService } from '../../../services/api_service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilService } from '../../../services/util_service';
import { PushService } from '../../../services/push_service';
import { TabsPage } from "../../tabs/tabs";
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

/**
 * Login page component
 */
@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {
	public loginForm: FormGroup;
	public active: boolean;

	constructor(
		private apiService: APIService,
		private nav: NavController,
		private builder: FormBuilder,
		private util: UtilService,
		private translate: TranslateService,
		private push: PushService,
		private storage: Storage
	) {
		this.active = true;
		this.loginForm = this.builder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required]
		});
	}

	doLogin() {
		this.util.showLoader();
		this.apiService.login(this.loginForm.value.email, this.loginForm.value.password).then((data: any) => {
			this.push.init(this.apiService.getSettings().pushwoosh_id);
			this.util.hideLoader();
			this.storage.set('welcomeShown', '1').then(() => {}, () => {});
			this.nav.setRoot(TabsPage);
		}, () => {
			this.util.hideLoader();
			this.util.alert(this.translate.instant('login.error'), '');
		});
	}

	signup() {
		this.nav.setRoot('SignupPage');
	}

}
