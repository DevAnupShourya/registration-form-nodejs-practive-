require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bcryptjs = require('bcryptjs');
const cookie_parser = require("cookie-parser");
const port = process.env.PORT || 8080;

app.use(express.json())
app.use(cookie_parser());
app.use(express.urlencoded({ extended: false }))

// ? DB imports
require('./db/connection');
// ? Schema Importing
const Register = require('./models/register');
// ? paths of all important dirs
const static_path = path.join(__dirname, "../public/");
const views_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
// ? Redeclaring some predefined stffs
app.use(express.static(static_path));
app.set('view engine', "hbs");
app.set('views', views_path)
// ? Using partials
hbs.registerPartials(partials_path);

// ! Home Page url
app.get('/', (req, res) => {
    // res.send('<h1>This is is home page</h1>')
    res.render('index');
});

const auth = require("./middleware/auth");
// ! Secret Page url
app.get('/sec', auth, (req, res) => {
    res.render('sec');
});
// ! Login Page url
app.get('/login', (req, res) => {
    res.render('login');
});
// ! Logout Page url
app.get('/logout', auth, async (req, res) => {
    try {
        res.clearCookie("jwt_project");

        // ? for signing out from this device only
        // req.userData.tokens = req.userData.tokens.filter((curr_elem) => {
        //     return curr_elem.token !== req.token;
        // });
        // ? for signing out from all devices
        req.userData.tokens = [];

        res.render("login");
        console.log(req.userData.full_name + "loged out......");

        await req.userData.save();
    } catch (error) {
        res.status(500).send(error)
    }
});
// ! Login Hapenning
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        // * console.log(`email: ${email} , pass : ${password}`);

        // ? checking that email is available in datanase or not
        const userEmail = await Register.findOne({ email });

        const passward_is_matching = await bcryptjs.compare(password, userEmail.password);

        const token = await userEmail.generateAuthToken();

        res.cookie("jwt_project", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true,
            // secure:true
        });

        if (passward_is_matching) {
            res.status(201).render('index');
            console.log(`${userEmail.full_name} logged in...`);
        } else {
            res.send("Invalid Details!!")
        }

    } catch (error) {
        res.status(400).send(`Something went wrong: ${error}`)
    }

});
// ! Registration Page Loading
app.get('/reg', (req, res) => {
    // res.send('<h1>This is is registrations page</h1>')
    res.render('reg');
});
// ! Registration Hapenning
// ? getting data from user
app.post('/reg', async (req, res) => {
    try {
        let pass = req.body.password;
        let conf_pass = req.body.conf_pass;

        if (pass === conf_pass) {
            const userRegister = new Register({
                full_name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                age: req.body.age,
                password: pass,
                confirm_password: conf_pass
            });

            const token = await userRegister.generateAuthToken();

            res.cookie("jwt_project", token, {
                expires: new Date(Date.now() + 10000),
                httpOnly: true,
                // secure:true
            });
            console.log("ccccccccccccccccccccccccccc " + cookie);

            const registeredData = await userRegister.save();

            res.status(201).render('index');
        } else {
            res.send('passwords and confirm password are not matching!!! ')
        }
    } catch (error) {
        res.status(400).send(error);
    }
});
// ! Raising the port
app.listen(port, () => {
    console.log(`server running at http://localhost:${port}/`);
})