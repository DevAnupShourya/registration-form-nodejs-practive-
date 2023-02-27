const mongoose = require('mongoose');
// ? warnings 
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/db1')
.then(() => {
    console.log(`connected to 'reg_form' database.......`);
})
.catch((e) => {
    console.log(`connetion unseccesful! error : ${e}`);  
});