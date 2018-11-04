import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoriesPage } from './categories';
import { TranslateModule } from '@ngx-translate/core';
// import { NewsFeedPage } from "../../news/news_feed/news_feed";

@NgModule({declarations: [
		CategoriesPage
	],
	imports: [
		IonicPageModule.forChild(CategoriesPage),
		TranslateModule.forChild()
	]
})
export class CategoriesPageModule {}
