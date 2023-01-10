const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookie = require("cookie-parser");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require("mongoose");
app.use(cookie());
// process.env.AUTH_URI || 'mongodb://localhost:27017/users' || stanture :}}}
mongoose.connect(
"mongodb+srv://chimdi:chimdi@cluster0.5zspaed.mongodb.net/?retryWrites=true&w=majority"
);
const port = process.env.PORT || 9422;
require("../Database/db");
const NightLyfRoutes = require("../Routes/NightLyfRoutes");
app.use("/v1/nightlyf",NightLyfRoutes);


app.all("*", (req, res, next) => {
    res.status(404).json({ error: true, message: "Route not found" });
});

app.use((error, req, res, next) => {
    console.error(error);
    const err = typeof error === "string" ? error : error.message;
    res.status(500).json({
        message: err,
    }).end();
});
  
app.listen(port, () => {
    console.log(`My Server is running on http://localhost:${port}`);
});


