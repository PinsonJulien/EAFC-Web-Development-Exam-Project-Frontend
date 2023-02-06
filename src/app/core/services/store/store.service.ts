import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiError } from "../../types/api/api-error";

@Injectable({ providedIn: 'root'})
export default abstract class StoreService
{
  /**************************************************/
  //
  // Properties
  //
  /**************************************************/

  protected _error = new BehaviorSubject<ApiError | null>(null);
  public error$ = this._error.asObservable();

  /**************************************************/
  //
  // Constructor
  //
  /**************************************************/

  constructor(
    //
  ) {
    //
  }

  /**************************************************/
  //
  // Getters / setters
  //
  /**************************************************/

  /**
  * Get the current error from the behavior subject.
  *
  * @returns ApiError | null
  */
  public get error(): ApiError | null
  {
  return this._error.getValue();
  }

  /**
   * Set the value of the error behavior subject.
   *
   * @param error ApiError | null
   * @returns void
   */
  protected set error(error: ApiError | null)
  {
    this._error.next(error);
  }

  /**************************************************/
  //
  // Methods
  //
  /**************************************************/

  //

}
