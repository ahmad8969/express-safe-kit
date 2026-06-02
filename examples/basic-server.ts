import express from "express";
import { expressSafeKit, errorHandler, notFoundHandler } from "../src";

const app = express();

app.use(expressSafeKit());

app.get("/", (_req, res) => {
  res.success("API is running");
});

app.use(notFoundHandler());
app.use(errorHandler());

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
