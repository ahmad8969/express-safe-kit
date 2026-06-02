import express from "express";
import { expressSafeKit, errorHandler, notFoundHandler } from "../src";

const app = express();
app.use(expressSafeKit());

app.get("/boom", () => {
  const error: Error & { statusCode: number } = Object.assign(
    new Error("Something broke"),
    { statusCode: 400 }
  );
  throw error;
});

app.use(notFoundHandler());
app.use(errorHandler());

app.listen(3000, () => {
  console.log("Error-handling server running at http://localhost:3000");
});
