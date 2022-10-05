import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  protected readonly links: { name: string; path: string}[] = [
    {
      name: "Home",
      path: "/home"
    },
    {
      name: "Test",
      path: "/test"
    }
  ];

  protected sideNavVisibility: boolean = true;

  constructor() {}

  protected toggleSideNav () {
    this.sideNavVisibility = !this.sideNavVisibility;
  }
}
