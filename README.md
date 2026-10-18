# NexNote - Personal Notes Application

NexNote is a personal notes application designed to help users create, organize, search, edit, and manage their notes through a clean, modern interface.

## Features

- Create, edit, and delete notes
- Search notes instantly
- Pin important notes
- Idea Spark for writing inspiration
- Idea Universe section
- Export notes to CSV
- Responsive, dark-themed user interface
- SQLite database for persistent storage
- REST API powered by Node.js and Express

## Tech Stack

### Frontend
- React
- Vite
- CSS

### Backend
- Node.js
- Express.js
- SQLite
- better-sqlite3

## Project Structure

```text
notes-application/
├── client/          # React + Vite frontend
├── server/          # Express backend and SQLite database
└── README.md        # Project documentation
```

## Getting Started

### Prerequisites

Install Node.js and npm before running the application.

### 1. Start the Backend

Open a terminal in VS Code and run:

```powershell
cd server
npm.cmd install
```

Start the backend using the available development script. If your `server/package.json` includes a `dev` script, run:

```powershell
npm.cmd run dev
```

The API is configured to run at:

`http://localhost:3000`

### 2. Start the Frontend

Open a second terminal and run:

```powershell
cd client
npm.cmd install
npm.cmd run dev
```

Open the local URL displayed by Vite in your browser. It is commonly:

`http://localhost:5173`

If that port is already in use, Vite may select another port.

## Database

NexNote uses SQLite through `better-sqlite3` to store notes locally. Keep your existing database file safe and make backups before making database-related changes.

## Development Status

NexNote is under development. Features and setup instructions may evolve as development continues.

## License

No license has been specified yet.
