import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestaurantsPage } from './restaurants';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [
		RestaurantsPage
	],
	imports: [
		IonicPageModule.forChild(RestaurantsPage),
		TranslateModule.forChild()
	]
})
export class RestaurantsPageModule {}
