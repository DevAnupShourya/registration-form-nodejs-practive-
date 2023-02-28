const mongoose = require('mongoose');
// ? warnings 
mongoose.set('strictQuery', false);

const db_name = 'reg_form';

mongoose.connect(`mongodb://127.0.0.1:27017/${db_name}`)
.then(() => {
    console.log(`Connected to db:${db_name}`);
}).catch(() => {
    console.log('Database Connection failed!!!');
})