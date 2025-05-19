# 📓 Chronicle

**Chronicle** is a private journaling web application designed to help you reflect on your mood over time and store your journal entries in a secure, personal space.

Built with ❤️ by [Tessa](https://github.com/TeyyaM), [Josiah](https://github.com/J-pilon) and [Sam](https://github.com/brackish888), this was our final project at **Lighthouse Labs Web Development Bootcamp**, built to showcase the practical skills and collaborative workflows we developed during the course.

---

## 🚀 Tech Stack

To simulate real-world development, we used a variety of tools introduced in the program—and a few we explored on our own, like TypeScript.

- **Frontend**: React, TypeScript, Axios, HTML, CSS, Sass
- **Backend**: Express, Node.js, PostgreSQL
- **Testing**: Cypress, Jest
- **Tooling**: dotenv, ESLint, Prettier

> We chose **TypeScript** even though it wasn’t taught in the course, to challenge ourselves and follow best practices in type-safe application development.

The project was bootstrapped using a no-fluff [React/Express boilerplate](https://github.com/garrettgsb/no-fluff-react-express) by @garrettgsb.

---

## ✨ Features

- 📝 **Journal Entry Form**  
  Write, save, and edit your personal journal entries.

- 🎭 **Mood & Category Tracking**  
  Tag entries with custom moods and categories to track your emotional state and revisit memories by topic.

- 🎨 **Customization**  
  Personalize your journaling space with customizable colors for background, text, accents, and more.

- 📅 **Entry Filtering**  
  Browse your journal entries by **category** or **date**.

- 📈 **Mood Graphing**  
  Visualize your mood trends over time using a dynamic date picker with interval controls.

- 🎥 **Demos**  
  - !["Video of homepage"](https://raw.githubusercontent.com/J-pilon/Chronicle/21b4b3a94747dbadd7ac047fe378ccafc300b2d0/docs/Peek%202021-06-04%2017-03.gif)
  - !["Video of entries"](https://raw.githubusercontent.com/J-pilon/Chronicle/21b4b3a94747dbadd7ac047fe378ccafc300b2d0/docs/Peek%202021-06-04%2017-10.gif)

---

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
* There isn't a login/logout feature currently. If you were to click on the logout button you will be redirected to the home page. This feature will be added in the future. 

## Dependencies
  - react 17.0.2
  - typescript 4.2.4
  - node 14.16.0
  - npm 6.14.11
