const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const saltRounds = 10;
const app = express();
const knex = require("knex");
const register = require("./controllers/register.js");
const signin = require("./controllers/signin.js");
const profile = require("./controllers/profile.js");
const image = require("./controllers/image.js");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "test",
    database: "smart-brain",
  },
});

//!! instead of body=parser use this
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("succ");
});

app.post("/signin", signin.handleSignin(db, bcrypt));
// ! REGISTER METHOD #1 (much easier to understand)
// app.post("/register", (req, res) => {
//   register.handleRegister(req, res, db, bcrypt, saltRounds);
// });
app.post("/register", register.handleRegister(db, bcrypt, saltRounds));
app.get("/profile/:id", profile.handleProfileGet(db));
app.put("/image", image.handleImagePut(db));

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
