import express from "express";
import { expressSafeKit } from "../src";

const app = express();

app.use(
  expressSafeKit({
    // In production, always set an explicit origin (required when NODE_ENV=production).
    cors: {
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://your-frontend.com"]
          : ["http://localhost:5173"],
      credentials: true
    },
    rateLimit: {
      max: 20,
      windowMs: 60_000,
      message: "Rate limit exceeded, wait a minute."
    },
    requestLogger: {
      enabled: true
    }
  })
);

app.get("/users", (_req, res) => {
  res.success([{ id: 1, name: "Ada" }], "Users loaded");
});

app.listen(3000, () => {
  console.log("Custom server running at http://localhost:3000");
});
