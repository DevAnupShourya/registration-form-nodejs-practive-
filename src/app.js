const express = require('express');
const app = express();
const path = require('path');
require('./db/connection');

const port = process.env.PORT || 8080;

const static_path = path.join(__dirname , "../public/");
app.use(express.static(static_path));

app.get('/' , (req , res) => {
    res.send('<h1>This is is home page</h1>')
});

app.listen(port , () => {
    console.log(`server running at http://localhost:${port}/`);
})