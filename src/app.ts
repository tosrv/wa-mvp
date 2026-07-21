import express from "express";
import healthRouter from "./routes/health.route.js";
import groupRouter from "./routes/group.route.js";

const app = express();

app.use(express.json());

app.use("/health", healthRouter);
app.use("/groups", groupRouter);

export default app;
