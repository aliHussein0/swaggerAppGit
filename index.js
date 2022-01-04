import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Low, JSONFile } from 'lowdb';
import booksRouter from "./routes/books.js";
import swaggerJsDoc from "swagger-jsdoc"
import swaggerUI from"swagger-ui-express";

const PORT = process.env.PORT || 4000;


const db = new Low(new JSONFile('file.json'))
await db.read()
await db.write()

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Library API",
			version: "1.0.0",
			description: "A simple Express Library API",
		},
		servers: [
			{
				url: "http://localhost:4000",
			},
		],
	},
	apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.db = db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/books", booksRouter);

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

export default db;