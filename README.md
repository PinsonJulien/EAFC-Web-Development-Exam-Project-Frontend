# School Website Frontend Angular

# WORK IN PROGRESS

## System requirements
- NodeJS v16.13.1

## Development server
Run `ng serve` and access the application at `http://127.0.0.1:4200/`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Bugs to fix
Currently none.

## Features to implement
- if any request times out the token; delete from the cookies, and redirect to /login. (disconnect method in auth service) (https://angular.io/guide/router) (https://angular.io/guide/http#intercepting-requests-and-responses)

- Accessibility with theme color pickers.

- Keep the favorite language (or the one selected before login / register) in state, use it to fill the favorite language field default value on registration.

## Todo
- Must use the snackbar for every failed/successful requests.

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
