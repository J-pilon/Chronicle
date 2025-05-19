# 📓 Chronicle

**Chronicle** is a private journaling web application designed to help you reflect on your mood over time and store your journal entries in a secure, personal space. Track your emotional journey, organize your thoughts by categories, and visualize your mood trends through an intuitive and customizable interface.

Built with ❤️ by [Tessa](https://github.com/TeyyaM), [Josiah](https://github.com/J-pilon) and [Sam](https://github.com/brackish888), this was our final project at **Lighthouse Labs Web Development Bootcamp**, built to showcase the practical skills and collaborative workflows we developed during the course.

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Getting Started](#getting-started)
- [Development](#development)
- [Known Limitations](#known-limitations)

## 🚀 Tech Stack

### Frontend
- React
- TypeScript
- Axios
- HTML/CSS
- Sass

### Backend
- Express
- Node.js
- PostgreSQL

### Testing & Tools
- Cypress & Jest for testing
- dotenv for environment variables
- ESLint & Prettier for code quality

> **Note**: We chose **TypeScript** even though it wasn't taught in the course, to challenge ourselves and follow best practices in type-safe application development.

The project was bootstrapped using a no-fluff [React/Express boilerplate](https://github.com/garrettgsb/no-fluff-react-express) by @garrettgsb.

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

### Demo Videos
- !["Video of homepage"](https://raw.githubusercontent.com/J-pilon/Chronicle/21b4b3a94747dbadd7ac047fe378ccafc300b2d0/docs/Peek%202021-06-04%2017-03.gif)
- !["Video of entries"](https://raw.githubusercontent.com/J-pilon/Chronicle/21b4b3a94747dbadd7ac047fe378ccafc300b2d0/docs/Peek%202021-06-04%2017-10.gif)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (v12 or higher)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chronicle.git
   cd chronicle
   ```

2. Set up environment variables:
   ```bash
   cp server/.env.example server/.env
   ```
   Edit `server/.env` and add your database credentials.

3. Install dependencies and set up the database:
   ```bash
   npm run install-all
   npm run setup-db
   ```

## Development

You can run the application in two ways:

### Option 1: Run both client and server concurrently
```bash
npm run start
```

### Option 2: Run client and server separately
1. Start the client:
   ```bash
   cd client
   npm run start
   ```

2. In a new terminal, start the server:
   ```bash
   cd server
   npm run server
   ```

## Known Limitations

- 🔒 **Authentication**: The login/logout feature is currently not implemented. Clicking the logout button will redirect to the home page. This feature will be added in a future update.
