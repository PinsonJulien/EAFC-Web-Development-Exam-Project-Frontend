import { ChangeDetectionStrategy, Component } from "@angular/core";
import User from "src/app/core/models/User";
import AuthStoreService from "src/app/core/services/store/auth.store.service";
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";


@Component({
  standalone: true,
  selector: 'app-layout',
  templateUrl: 'app-layout.component.html',
  styleUrls: ['app-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    RouterModule
  ]
})
export class AppLayoutComponent
{
  constructor(
    private authStoreService: AuthStoreService,
  ) {
    //
  }

  public user!: User;




}
