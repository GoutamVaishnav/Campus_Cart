import express from "express";
import cors from "cors";
import buyRoutes from "./modules/buy/buy.routes.js";
import rentRoutes from "./modules/rent/rent.routes.js";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/buy", buyRoutes);
app.use("/rent", rentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
