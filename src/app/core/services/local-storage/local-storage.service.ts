import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService
{
  /**************************************************/
  //
  // Properties
  //
  /**************************************************/

  //

  /**************************************************/
  //
  // Constructor
  //
  /**************************************************/

  constructor() {
    //
  }

  /**************************************************/
  //
  // Getters / setters
  //
  /**************************************************/

  //

  /**************************************************/
  //
  // Methods
  //
  /**************************************************/

  /**
   * Set the value for a given key in the LocalStorage
   *
   * @param key string
   * @param value any
   * @returns void
   */
  setItem(key: string, value: any): void
  {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Get the value for a given key in the LocalStorage
   *
   * @param key string
   * @returns any
   */
  getItem(key: string) : any
  {
    const value = localStorage.getItem(key);

    return (value)
      ? JSON.parse(value)
      : null;
  }

  /**
   * Remove the value for a a given key in the LocalStorage
   *
   * @param key string
   * @returns void
   */
  removeItem(key: string): void
  {
    localStorage.removeItem(key);
  }
}
