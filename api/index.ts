import express, {Request, Response} from "express";
import dotenv from "dotenv";
import database from "./database/configdb";

dotenv.config();

const app = express();
database.connect();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello World! Welcome to L-I-F-E!" });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}/`);
});
