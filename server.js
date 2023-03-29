const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./api/router");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api", router);
app.get("/health-check", (req, res) => {
  res.send("OK");
});

mongoose.connect("mongodb://127.0.0.1:27017/mern", { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
