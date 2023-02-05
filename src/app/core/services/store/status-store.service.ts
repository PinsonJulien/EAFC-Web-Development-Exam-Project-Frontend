import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import Status from "../../models/Status";
import StatusApiService from "../api/status-api.service";
import StoreService from "./store.service";

@Injectable({ providedIn: 'root'})
export default class StatusStoreService extends StoreService
{
  /**************************************************/
  //
  // Properties
  //
  /**************************************************/

  protected _statuses = new BehaviorSubject<Status[] | null>(null);
  public statuses$ = this._statuses.asObservable();

  /**************************************************/
  //
  // Constructor
  //
  /**************************************************/

  constructor(
    protected statusApiService: StatusApiService
  ) {
    super();
  }

  /**************************************************/
  //
  // Getters / setters
  //
  /**************************************************/

  /**
   * Get the current statuses from the behavior subject.
   *
   * @returns Status[] | null
   */
  public get statuses(): Status[] | null
  {
    return this._statuses.getValue();
  }

  /**
  * Set the value of the statuses behavior subject.
  *
  * @param statuses Status[] | null
  * @returns void
  */
  protected set statuses(statuses: Status[] | null)
  {
    this._statuses.next(statuses);
  }

  /**************************************************/
  //
  // Methods
  //
  /**************************************************/

  /**
   * Refresh the list of statuses and update it's behavior subject.
   * Uses the StatusApiService to get all statuses.
   *
   * @returns void
   */
  public refreshStatuses(): void {
    this.statusApiService.get().subscribe({
      next: (statuses: Status[]) => {
        this.statuses = statuses;
        this.error = null;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error;
      }
    })
  }

}
