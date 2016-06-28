# junior-level

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
  *Authentic- key: 1e053aff7cf7550dbc3d62c7529f4124 baseUrl: https://authenticjobs.com/api/

###### Goals
  * select jobs to save using database's
  * navbar--All jobs/Your jobs/user submit job/login
  * linkedin oAuth
  * css styles
  * User Profile
