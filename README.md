# Express API with MongoDB (TypeScript + Docker)

This project is a RESTful API built with **Express**, **MongoDB**, and **TypeScript**.
It includes a **Docker Compose** configuration for running MongoDB locally and provides a ready-to-use Postman collection in YAML format for API testing.

---

## Requirements

Before starting, make sure you have installed:

* [Node.js](https://nodejs.org/) (v18 or higher)
* [Docker & Docker Compose](https://www.docker.com/)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/danbasco/express-api-mongodb.git
   cd express-api-mongodb
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   * Copy the example environment file:

     ```bash
     cp .env.example .env
     ```
   * Edit `.env` to include your JWT secret:

     ```env
     MONGODB_URI=mongodb://root:example@localhost:27017
     MONGODB_DB_NAME=example
     JWT_SECRET=your_generated_secret
     ```
   * You can generate a secure key with:

     ```bash
     npm run generate-secret-key
     ```

---

## Run MongoDB with Docker Compose

Start the local database containers:

```bash
npm run start:database
```

This command will:

* Start a **MongoDB** container at `localhost:27017`
* Start **Mongo Express** (web UI) at [http://localhost:8081](http://localhost:8081)

  * Username: `mongoexpressuser`
  * Password: `mongoexpresspass`

To stop the containers:

```bash
docker compose down
```

---

## Run the API Locally

Start the API in development mode:

```bash
npm run dev
```

Or run the compiled version:

```bash
npm run build
npm start
```

By default, the server runs on:

```
http://localhost:3000
```

---

## API Testing

You can test all API routes using Postman or Hoppscotch.

1. Open the file:

   ```
   requests/requests.yaml
   ```
2. Import it into Postman to view all available endpoints.

---

## Deployment

This project includes a **Vercel** configuration file (`vercel.json`) for deployment.
To deploy:

```bash
vercel
```

Vercel will automatically detect the entry point (`api/index.ts`) and deploy it as a serverless function.

---

## Scripts Overview

| Script                        | Description                              |
| ----------------------------- | ---------------------------------------- |
| `npm run dev`                 | Run API in watch mode using `tsx`        |
| `npm start`                   | Start the compiled API                   |
| `npm run build`               | Compile TypeScript to JavaScript         |
| `npm run start:database`      | Run MongoDB and Mongo Express via Docker |
| `npm run generate-secret-key` | Generate a random 32-byte JWT secret     |
| `npm test`                    | Run tests (placeholder)                  |

---

## Additional Information

* TypeScript improves code maintainability and type safety.
* Docker Compose ensures consistent local database setup.
* Mongo Express allows you to visually explore your database.

---

## Tutorial Video

A complete walkthrough of the project API and usage is available here:
[YouTube Tutorial](https://youtu.be/MPKciL0R5kQ)

---
