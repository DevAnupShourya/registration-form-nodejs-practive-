const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// ? hashing password (middleware)
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 10);
        this.confirm_password = await bcryptjs.hash(this.confirm_password, 10);
    }
    next();
})

// ? Generating JWT token
userSchema.methods.generateAuthToken = async function () {
    try {
        const generatedToken = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: generatedToken});
        await this.save();
        return generatedToken;
    } catch (error) {
        res.send(error);
    }
}

// ? creating a collection
const Register = new mongoose.model('Register', userSchema);
module.exports = Register;