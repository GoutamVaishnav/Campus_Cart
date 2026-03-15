import dotenv from "dotenv";
import express from "express";
import app from "./src/app.js";

dotenv.config();

const server = express();

server.use("/buy-rent", app);

const PORT = process.env.PORT || 5003;

server.listen(PORT, () => {
  console.log(`Buy-Rent Service running on port ${PORT}`);
});
