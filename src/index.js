import express from "express";
import dotenv from "dotenv";
import database from "./database/configdb.js";

dotenv.config();

const app = express();
database.connect();

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Hello World! Welcome to life." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}/`);
});
