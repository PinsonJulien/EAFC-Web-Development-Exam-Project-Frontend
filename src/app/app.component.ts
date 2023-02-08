import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './core/services/local-storage/local-storage.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {
    // When the page is about to be reloaded, save the current route in local storage.
    window.addEventListener('beforeunload', (event) => {
      this.localStorageService.setItem('previousRoute', this.router.url);
    });
  }
}
