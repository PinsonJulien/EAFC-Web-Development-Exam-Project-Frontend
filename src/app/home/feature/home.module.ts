import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HomePageRoutingModule } from "./home-routing.module";
import { HomePage } from "./home.page";

@NgModule({
  imports : [
    CommonModule,
    FormsModule,
    HomePageRoutingModule,
  ],
  declarations : [HomePage]
})
export class HomePageModule {}
