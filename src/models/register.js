const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    full_name :{
        type: String,
        required:true
    },
    email :{
        type: String,
        required: true,
        unique: true
    },
    phone :{
        type: Number,
        required: true,
        unique: true
    },
    age :{
        type: Number,
        required: true,
    },
    password :{
        type: String,
        required:true
    },
    confirm_password :{
        type: String,
        required:true
    }
});
// ? creating a collection
const Register = new mongoose.model('Register',userSchema);
module.exports = Register;