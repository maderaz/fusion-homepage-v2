## Testing and verifying code quality

- when running tests do:
  - check if all code compiles vit no errors
  - Check if build passes with no errors
  - all unit tests pass
  - no errors and warnings in console in runtime
  - end to end test for testing website snapshot
  - end to end tests for testing visual regression
  - Check if there is no unused exports, no dead code
  - end to end tests for if there is no CSP breaks in runtime
- All these tests should run on CI
- Before each push run only lightweight tests
