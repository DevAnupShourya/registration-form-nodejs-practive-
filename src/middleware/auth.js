const jwt = require('jsonwebtoken');
const Register = require('../models/register');


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt_project;
        const verification = await jwt.verify(token, process.env.SECRET_KEY)
        
        const userData = await Register.findOne({_id : verification._id})
        // console.log(userData);

        req.token = token;
        req.userData = userData;

        next();
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = auth;