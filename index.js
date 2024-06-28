import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";

//load env variables
dotenv.config();

//connect to database
connectDB();

//initialize express
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// App listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
