# School Website Frontend Angular

# WORK IN PROGRESS

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

- Register : Mark invalid the email on 422 error
  - Store every failed attempt in a Set to ensure uniqueness. (trigger validation after insert)
  - Check every input. (with custom validator ? NotInArray ?)

- Accessibility with theme color pickers.
- Ensure all components are standalone : https://angular.io/guide/standalone-components

- Keep the favorite language (or the one selected before login / register) in state, use it to fill the favorite language field default value on registration.


## Todo
- Must use the snackbar for every failed/successful requests.


## Features to improve :
- Create a custom file import component to avoid using the default input style. The style is unavailable in Angular Material.
