//declared dependancies and ascend to variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();
////const cookieParser = require("cookie-parser");
//app.use(cookieParser());
//const images = require("../backend/routes/multerConfig.js");
// Serve static files from the 'uploads' directory
//app.use("/images", express.static("images"));

//created a port
const PORT = process.env.PORT || 8070;

//used dependancies
app.use(cors());
app.use(bodyParser.json());

//get url
const URL = process.env.MONGODB_URL;

//connect mongoDB
mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

//open connection
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb Connection Success!");
});

/* Add your part here */

// server -> controllers

// server -> routes

const createNew = require("./routes/createNew.js");
app.use("/createNew", createNew);

const queryAll = require("./routes/queryAll.js");
app.use("/queryAll", queryAll);

const queryOne = require("./routes/queryOne.js");
app.use("/queryOne", queryOne);

const updateRow = require("./routes/updateRow.js");
app.use("/updateRow", updateRow);

const destroy = require("./routes/destroy.js");
app.use("/destroy", destroy);

const userTable = require("./routes/userTable.js");
app.use("/userTable", userTable);

const user = require("./routes/user.js");
app.use("/user", user);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is up and running no port:  ${PORT}`);
});

/*
//Look how simple the code is

const express = require('express')
const cors = require('cors')
const {db} = require('./db/db')
//for routing
const {readdirSync} = require('fs')
const app = express()

require('dotenv').config()

//middleware
app.use(express.json())
app.use(cors())

//routes
readdirSync('./routes').map((route) => app.use('/api/v1',require('./routes/' + route)))

const PORT = process.env.PORT

const server = () =>{
    db()
    app.listen(PORT,() =>{
        console.log('listening to port : ',PORT)
    })

}

server()*/
