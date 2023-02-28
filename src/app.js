const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const port = process.env.PORT || 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// ? DB imports
require('./db/connection');
const Register = require('./models/register');

// ? paths of all important dirs
const static_path = path.join(__dirname, "../public/");
const views_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set('view engine', "hbs");
app.set('views', views_path)

hbs.registerPartials(partials_path);

app.get('/', (req, res) => {
    // res.send('<h1>This is is home page</h1>')
    res.render('index');
});
app.get('/login', (req, res) => {
    // res.send('<h1>This is is login page</h1>')
    res.render('login');
});
app.get('/reg', (req, res) => {
    // res.send('<h1>This is is registrations page</h1>')
    res.render('reg');
});
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

            const registeredData = await userRegister.save();
            res.status(201).render('index');
        } else {
            res.send('passwords and confirm password are not matching!!! ')
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen(port, () => {
    console.log(`server running at http://localhost:${port}/`);
})