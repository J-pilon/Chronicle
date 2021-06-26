# Chronicle

A private journaling web app designed to help you keep track of your mood over time and store your journal entries for you to look back on.

Created by [Tessa](https://github.com/TeyyaM), [Josiah](https://github.com/J-pilon) and [Sam](https://github.com/brackish888).

This was designed and implemented as a way to showcase the skills that were learned in the [Lighthouse Labs Web Development](https://github.com/lighthouse-labs) bootcamp and is considered our final project of the course. 

Within this project we used many tools introduced to us such as:
  - React
  - *Typescript*
  - Express
  - Jest
  - HTML
  - Css and SaSS
  - Cypress
  - Axios
  - Node
  - PostgreSQL

*In a way to simulate realworld experiences we decided to use Typescript as our main programming language, one that we had not covered in the course*

We started the project with a _no fluff_ React/Express boilerplate supplied by @garrettgsb and can be found [here.](https://github.com/garrettgsb/react-express-boilerplate)

## Features
  - Home page Journaling form
    - Write, post, save and edit journal entries
    - Give each entry a Category (or none) to help you keep track of certain memories
    - Give your post a mood to track your progress over time
  - Customize your journaling experience!
    - change your background, secondary, accent, text and form colours
  - Reference your past entries by Category or by Date
    - Graph your mood overtime with a dynamic date picker that lets you pick the intervals that you want to graph.

!["Video of homepage"](https://raw.githubusercontent.com/J-pilon/Chronicle/21b4b3a94747dbadd7ac047fe378ccafc300b2d0/docs/Peek%202021-06-04%2017-03.gif)
!["Video of entries"](https://raw.githubusercontent.com/J-pilon/Chronicle/21b4b3a94747dbadd7ac047fe378ccafc300b2d0/docs/Peek%202021-06-04%2017-10.gif)

## Getting started! 

Fork this repository, then clone your fork onto your machine.

You will need **TWO** terminal windows/tabs to run this (or some other plan for running two Node processes).

In one terminal, `cd` into *express-back-end*. Run `npm install` to install the dependencies.

After the dependencies are installed and while your in the same folder, create a *.env* file using these secret variables but set to your information:
* DB_HOST=localhost
* DB_USER=database_username
* DB_PASS=database_password
* DB_NAME=database_name
* DB_PORT=5432

Then you have the option to run `npm run db:reset` to seed the database with fake data or to have a blank database:
1. comment/uncomment the necessary code in the file *express-back-end/bin/resetdb.ts*  
2. run `tsc` in your terminal in the *express-back-end* directory
3. run `npm run db:reset` in the same terminal

Finally, run `npm run server` to start the backend server.
(this will run on localhost:3000)

In another terminal, `cd` into *react-front-end* folder. Run `npm install` to install the dependencies. Then run `npm start` and go to *localhost:3000* in your browser.

## Missing Features
* There isn't a login/logout feature currently. If you were to click on the logout button the app will crash. This feature will be added in the future. 

## Dependencies
  - react 17.0.2
  - typescript 4.2.4
  - node 14.16.0
  - npm 6.14.11
