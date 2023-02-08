import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import User from "src/app/core/models/User";

@Component({
  standalone: true,
  selector: 'user-card[user]',
  templateUrl: 'user-card.component.html',
  styleUrls: ['user-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: [
    'user'
  ],
  imports : [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule
  ],
  providers : [
    //
  ],
})
export class UserCardComponent
{
  /************************************************************/
  //
  // Properties
  //
  /************************************************************/

  @Input()
  public user!: User;

  /************************************************************/
  //
  // Constructor
  //
  /************************************************************/

  constructor(
    //
  ) {
    //
  }

  /************************************************************/
  //
  // Methods
  //
  /************************************************************/

  //

}
