# (ARCHIVED) School Website Frontend Angular

## Archive note
This repository will be archived as of **08/02/2022 (D/M/Y), 9PM (UTC+1 Brussels)** for school access.
You can find the forked repository (here)[  WRITE URL ]

## Context
This repository is part of the web development course of my bachelor degree in Business Computing, 2nd year.
You can consult the *scope statement* (in French) in the `scope.pdf` file at root.

I chose to use **Angular 15** for my frontend.
This frontend should match the same URL set in the backend, as it relies on CSRF protection by cookies.

## Minimal requirements
- [NodeJS v16.13.1](https://nodejs.org/en/download/)
- NPM v8.3.0 (included with NodeJS)
- Backend from this [repository](https://github.com/PinsonJulien/school-website-backend-laravel)
- [Angular CLI v15.1.4](https://angular.io/guide/setup-local#install-the-angular-cli)

## Initial setup 
- If it's not done, install the Angular CLI : `npm install -g @angular/cli`
- run `npm install`
- In `src/environments/enronment.ts`, make sure the `baseUrl` matches the backend URL, including the port.

## Development server
Run `ng serve` and access the application at `http://127.0.0.1:4200/`.

## Contribution tools

### Useful commands
- Build : `ng build`
- Unit test (Karma): `ng test`
- E2E test : `ng e2e`



# WIP CURRENTLY WRITING





### Project evolutions

### Ideas
- Accessibility with theme color pickers.
- Keep the favorite language (or the one selected before login / register) in state, use it to fill the favorite language field default value on registration.

### Possible improvements / todo

- AppComponent
  - Should handle the session expiration by listening to every store errors, will redirecto to /login
  - 



### Backend features that aren't implemented 

## Todo
- Register form will be in a linear stepper https://material.angular.io/components/stepper/overview
- Register : Mark invalid the email on 422 error
  - Store every failed attempt in a Set to ensure uniqueness. (trigger validation after insert)
  - Check every input. (with custom validator ? NotInArray ?)

- Fix style issue in auth.layout

- refresh user on page change

- Enrollment may be shown as  drawers instead for the responsibity. Tables are terrible at it.
- button to show in modal(?) the message on enrollment if it's not NULL. (Message for the school)
- table header sort ? will it work ?

- App component should listen to the experired session and use the snackbar to signal to the user + redirect it to /login
  - The auth will have a sessionExpired field ? Should it store the session cookie time in localstorage ?

- Show loading on async pipes maybe using this solutin : https://medium.com/angular-in-depth/angular-show-loading-indicator-when-obs-async-is-not-yet-resolved-9d8e5497dd8

## Features to improve :
- Create a custom file import component to avoid using the default input style. The style is unavailable in Angular Material.
- AuthStore should only store the user id in local storage and perform a getById on instantiation. This will ensure the right user is logged in and no personal data is locally stored. If the UserApiService got an authorization error, the store will trigger the logout().

- login/register If role is secretary, go to /admin instead of /courses

## Planned refactors :
### Login / register
- should have a function called "setupFormErrors()"

    Normal error methods will be removed.

    which will consist of these for each fields and errors :
    control.setErrors({'required': 'Field is required'});

    Errors will be handled like so : 
    `<div *ngIf="form.get('fieldName').invalid && form.get('fieldName').touched">
      <div *ngIf="form.get('fieldName').errors['required']">
        {{ form.get('fieldName').errors['required'] }}
      </div>
      <div *ngIf="form.get('fieldName').errors['custom']">
        {{ form.get('fieldName').errors['custom'] }}
      </div>
    </div>
    `

- Register should use a CountryStore instead of the service. Only one fetch will be necessary.


## Urgent todo :
- Banned page (fast) + fix the routes in backend to allow disconnect.
- Fix user storage to be on ID.
