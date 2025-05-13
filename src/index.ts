import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { pool, initializeDatabase } from "./config/db";
import { migrateGoalsTable, migrateMealPlansTable } from "./config/migrations";
import userRoutes from "./routes/userRoutes";
import mealRoutes from "./routes/mealRoutes";
import healthRoutes from "./routes/healthRoutes";
import goalRoutes from "./routes/goalRoutes";
import mealPlanRoutes from "./routes/mealPlanRoutes";
import schedulerService from "./services/schedulerService";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/meal-plans", mealPlanRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

const waitForPostgres = async (retries = 10, delayMs = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query("SELECT 1");
      console.log("PostgreSQL is ready");
      return;
    } catch (err) {
      console.log(
        `⏳ Postgres not ready (${i + 1}/${retries}), retrying in ${delayMs}ms`
      );
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  throw new Error("❌ PostgreSQL did not become ready in time");
};

const startServer = async () => {
  try {
    await waitForPostgres();
    console.log("Connected to PostgreSQL database");

    await pool.connect();
    console.log("Connected to PostgreSQL database");

    await initializeDatabase();
    console.log("Database schema initialized");

    await migrateGoalsTable();
    await migrateMealPlansTable();
    console.log("Database migrations completed");

    schedulerService.initializeScheduledTasks();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
