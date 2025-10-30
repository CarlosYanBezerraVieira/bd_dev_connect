const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const postsRoutes = require("./routes/posts");

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();
app.use("/api/posts", postsRoutes);

module.exports = app;
