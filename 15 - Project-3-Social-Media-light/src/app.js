const express = require("express");
const appRoutes = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")

const app = express();
app.use(express.json())
app.use(cookieParser())

app.use("/auth",appRoutes)

module.exports = app;