import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 5;
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save().then(() => { res.render("secrets.ejs") });
    });
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const data = await User.findOne({ email: username });
    if (data) {
        bcrypt.compare(password, data.password, (err, result) => {
            if (result === true) {
                res.render("secrets.ejs");
            } else {
                console.log("Invalid password");
            }
        });
    } else {
        console.log("No user found");
    };
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});
