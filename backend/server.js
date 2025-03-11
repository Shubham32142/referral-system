import express, { Router } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Routes } from "./Routes/backend.routes.js";
dotenv.config();
const app = new express();

app.use(express.json());
app.use(cors());
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running at --- ${PORT}`);
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.error("error while connecting to database"));

Routes(app);
