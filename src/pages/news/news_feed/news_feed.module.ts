import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsFeedPage } from './news_feed';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [
		NewsFeedPage
	],
	imports: [
		IonicPageModule.forChild(NewsFeedPage),
		TranslateModule.forChild()
	]
})
export class NewsFeedPageModule {}
