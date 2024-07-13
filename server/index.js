import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";

//Routes
import userRoutes from "./routes/user.routes.js";
import accountRoutes from "./routes/account.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

//load env variables
dotenv.config();

//connect to database
connectDB();

//initialize express
const app = express();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Welcome to the API",
  });
});

//Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/account", accountRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/transaction", transactionRoutes);

// App listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
});
