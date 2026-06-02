import type { RequestHandler } from "express";

export const notFoundHandler = (): RequestHandler => {
  return (_req, res) => {
    res.error("Route not found", 404, []);
  };
};
