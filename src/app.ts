import express from "express";
import { pool } from "./config/database";
import authRoutes from "./routes/auth.route";
import employeeRoutes from "./routes/employee.route";
import attendanceRoutes from "./routes/attendence.route"


const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);

const port = process.env.PORT || 8000;

pool.connect()
    .then((client) => {
        client.release();

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });

export default app;