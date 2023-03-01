const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    confirm_password: {
        type: String,
        required: true
    }
});

// ? hashing password (middleware)
userSchema.pre("save", async function (next) {
    if(this.isModified){
        this.password = await bcryptjs.hash(this.password, 10);
        this.confirm_password = undefined;
    }
    next();
})

// ? creating a collection
const Register = new mongoose.model('Register', userSchema);
module.exports = Register;