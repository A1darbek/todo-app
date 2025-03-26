# Todo Application

This repository contains a full-stack Todo application built with a React frontend and a Node.js backend. It uses MongoDB for data storage.

## Project Structure

- **Frontend**: Located in `todo-app/Frontend-todo`
- **Backend**: Located in `todo-app/Backend-todo`

---

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v16 or higher recommended)
- npm or yarn package manager
- [Docker](https://www.docker.com/) and Docker Compose (for MongoDB setup)

---

## Installation

### Frontend

Navigate to the frontend directory and install dependencies:

```bash
cd todo-app/Frontend-todo
npm install
```

### Backend

Navigate to the backend directory and install dependencies:

```bash
cd todo-app/Backend-todo
npm install
```

### MongoDB with Docker Compose and Environment Variables

Create an `.env` file in your project's root directory with the following content:

```env
MONGO_INITDB_ROOT_USERNAME=ayderbek
MONGO_INITDB_ROOT_PASSWORD=password
MONGO_INITDB_DATABASE=todoDB
```

Update your `docker-compose.yml` file to use these environment variables:

```yaml
version: '3.9'

services:
  mongodb:
    image: mongo:latest
    container_name: mongo-container
    restart: always
    env_file:
      - .env
    volumes:
      - mongodb-data:/data/db
    ports:
      - "27017:27017"

volumes:
  mongodb-data:
```

Run the following command to start MongoDB:

```bash
docker-compose up -d
```

---

## Running the Application

### Start the Backend

Navigate to the backend directory and start the server:

```bash
cd todo-app/Backend-todo
npm start
```

The backend will typically run on `http://localhost:5000`.

### Start the Frontend

In a separate terminal, navigate to the frontend directory and start the React app:

```bash
cd todo-app/Frontend-todo
npm start
```

The frontend application will run on `http://localhost:5173` and will automatically open in your default web browser.

---

## Running Unit Tests

Both frontend and backend have unit tests implemented.

### Frontend Tests

Navigate to the frontend directory and run:

```bash
cd todo-app/Frontend-todo
npm test
```

### Backend Tests

Navigate to the backend directory and run:

```bash
cd todo-app/Backend-todo
npm test
```

---

## Usage

- Open your browser and visit `http://localhost:5173`.
- Interact with the todo application to create, update, delete, and manage tasks.

---

## Notes

- Ensure MongoDB Docker container is running before starting the backend.
- Ensure both frontend and backend servers are running simultaneously for full functionality.
- Any changes in the backend code may require restarting the backend server.

---

## Contributing

Contributions are welcome! Feel free to fork this repository, submit pull requests, and open issues for improvements or bug fixes.

