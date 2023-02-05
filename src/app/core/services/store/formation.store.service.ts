import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import Formation from "../../models/Formation";
import FormationApiService from "../api/formation-api.service";
import StoreService from "./store.service";

@Injectable({ providedIn: 'root'})
export default class FormationStoreService extends StoreService
{
  protected _formations = new BehaviorSubject<Formation[] | null>(null);
  public formations$ = this._formations.asObservable();

  constructor(
    protected formationApiService: FormationApiService,
  ) {
    super();
  }

  // GETTERS SETTERS

  /**
   * Get the current formations from the behavior subject.
   *
   * @returns Formation[] | null
   */
  public get formations(): Formation[] | null
  {
    return this._formations.getValue();
  }

  /**
   * Set the value of the user behavior subject and add/remove it from the localstore.
   *
   * @param formation Formation[] | null
   * @returns void
   */
  protected set formations(formations: Formation[] | null)
  {
    this._formations.next(formations);
  }

  /**
   * Refresh the list of formations and update it's behavior subject.
   * Uses the FormationApiService to get all formations.
   *
   * @returns void
   */
  public refreshFormations(): void
  {
    const parameters = {
      includeRelations: 'courses',
      sortBy: 'asc(name)',
    };

    this.formationApiService.get(parameters).subscribe({
      next: (formations: Formation[]) => {
        this.formations = formations;
        this.error = null;
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error;
      }
    });
  }
}
