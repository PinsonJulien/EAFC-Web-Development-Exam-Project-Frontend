# School Website Frontend Angular

## Development server
Run `ng serve` and access the application at `http://localhost:4200/`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Bugs to fix
Currently none.

## Features to implement
- Login: Set the field groups before the form
- Register : Mark invalid the email on 422 error
  - Store every failed attempt in a Set to ensure uniqueness. (trigger validation after insert)
  - Check every input. (with custom validator ?)
- Clear button on fields
- Successful login should redirect.
- Register should trigger login and redirect. (It's possible that the server defaults to login after registration, so that may not be an issue.)
- Remind me functionality : https://stackoverflow.com/questions/49508979/how-to-implement-a-remember-me-function
- Accessibility with theme color pickers.
- Ensure all components are standalone : https://angular.io/guide/standalone-components
- Route guards: https://jacobneterer.medium.com/angular-authentication-securing-routes-with-route-guards-2be6c51b6a23
  - Once logged in, register and login should not be available.
  - Main content requires to be logged in.
- Keep the favorite language (or the one selected before login / register) in state, use it to fill the favorite language field default value on registration.
