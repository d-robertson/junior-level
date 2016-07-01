# juniorDev

Express authentication template using Passport + flash messages + custom middleware

## Getting Started

#### Scaffold w/tests (see `master` branch)

* Run `npm install` to install dependencies
  * Use `npm run lint:js` to lint your JS
  * Use `npm run lint:css` to lint your CSS
  * Use `npm test` to run tests
* Setup the databases
  * Change the database names in `config/config.json` to reflect your project
  * Run `createdb project_name_development` to create the development database
  * Run `createdb project_name_test` to create the test database

#### Finished version (see `brian-finished` branch)

* Run `npm install` to install dependencies
  * Use `npm run lint:js` to lint your JS
  * Use `npm run lint:css` to lint your CSS
  * Use `npm test` to run tests
* Setup the databases
  * Run `createdb express_auth_development` to create the development database
  * Run `createdb express_auth_test` to create the test database
  * Run `sequelize db:migrate` to run migrations

##### My Api's 
  * Dice- 'http://service.dice.com/api/rest/jobsearch/v1/simple.json?text=entry+junior'

###### Goals
  * linkedin oAuth
  * add more api's and web scrapes
  * clean up code
  * more responsive styling

####### Bugs
  * when larger than 760px screen size my home link which is the brand stops working
  * my ajax calls dont display flash messages on error
  * when a user is not logged in and trys to save a job the ajax doesn't catch
    a error

