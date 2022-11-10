const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const cors = require("cors");

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json()); // to accept json data

app.use("/api/user", userRoutes);

const PORT = process.env.PORT;

const server = app.listen(process.env.PORT||3000,
  console.log(`Server running on PORT ${PORT}...`)
);
