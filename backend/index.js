import express from "express";
const app = express();
import config from "./config/config.js";
import connectDB from "./config/db.js";
import path from "path";
connectDB();
// console.log(config);

import cors from "cors";
import cookieParser from "cookie-parser";

app.use(
  cors({
    origin: "https://seagreen-hedgehog-575300.hostingersite.com",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.get("/h", (req, res) => {
  res.json({
    success: "ok",
  });
});


app.use(cookieParser());

import userRoutes from "./routes/userRoutes.js";
app.use("/api/v1", userRoutes);

import { notFound, errorHandler } from "./middleware/errorHandler.js";

app.use(notFound);
app.use(errorHandler);

const port = config.PORT;
app.listen(port, () => {
  console.log(`server runming on http://localhost:${port}`);
});
