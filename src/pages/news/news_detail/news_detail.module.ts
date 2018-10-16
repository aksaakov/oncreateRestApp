import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsDetailPage } from './news_detail';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	declarations: [
		NewsDetailPage
	],
	imports: [
		IonicPageModule.forChild(NewsDetailPage),
		TranslateModule.forChild()
	]
})
export class NewsDetailPageModule {}
