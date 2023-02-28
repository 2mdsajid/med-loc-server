const jwt = require('jsonwebtoken')
const User = require('../models/user')

const Cookies = require('cookies')

const AuthUserMiddleware = async (req, res, next) => {
    try {

        var Cookie = new Cookies(req,res) //Cookies library
        

        // get the token from the Authorization header
        const logintoken = req.body.logintoken
        console.log('logintoken in auth',logintoken)

        // console.log('cookie', req.cookies.token);
        // get the token
        // const logintoken = Cookie.get('logintoken') //name of the token
        // console.log('token in auth')
        // console.log(logintoken)

        // verify the token
        const verifylogintoken = jwt.verify(logintoken, process.env.SECRET_KEY)

        // get user data with the token and its ID
        const verifieduser = await User.findOne({ _id: verifylogintoken._id, "tokens.token": logintoken })
        // console.log('middle')
        // console.log(verifieduser)

        if (!verifieduser) { throw new Error('User not found') }

        // req.token = token;
        req.verifieduser = verifieduser;
        req.username = verifieduser.username;
        req.id = verifieduser._id;
        

        next() //to pass onto next page else user remain stuck on this

    } catch (error) {
        res.status(401).json({msg:"no token povided ",status : 401})
        // console.log('not logged in');
    }
}

module.exports = AuthUserMiddleware;